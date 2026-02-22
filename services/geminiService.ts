import { GoogleGenAI } from "@google/genai";
import { Settings } from "../types";

// ============================================================================
// HSG KHTN Hóa Học AI - Gemini Service (v2)
// ============================================================================

// --- DEMO MODE ---
const DEMO_API_KEYS = ['PLACEHOLDER_API_KEY', 'demo', 'test', ''];

const isDemoMode = (apiKey: string): boolean => {
  return DEMO_API_KEYS.includes(apiKey) || !apiKey || apiKey.length < 20;
};

const delay = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

/**
 * Get the selected model ID from settings
 */
export const getSelectedModelId = (settings: Settings): string => {
  if (settings.model === 'custom' && settings.customModel) {
    return settings.customModel;
  }
  return settings.model || 'gemini-2.5-flash';
};

/**
 * Classify API error into actionable categories
 */
type ErrorType = 'INVALID_KEY' | 'SUSPENDED' | 'RATE_LIMITED' | 'QUOTA_EXHAUSTED' | 'MODEL_NOT_FOUND' | 'UNKNOWN';

function classifyError(error: any): { type: ErrorType; message: string; retryable: boolean } {
  const msg = String(error?.message || error || '');
  const status = error?.status || error?.httpStatusCode || 0;

  // 403 - Permission denied / Suspended
  if (msg.includes('PERMISSION_DENIED') || msg.includes('suspended') || status === 403) {
    return { type: 'SUSPENDED', message: 'API Key đã bị đình chỉ (suspended). Vui lòng tạo key mới tại aistudio.google.com/apikey', retryable: false };
  }

  // 429 - Too Many Requests / Rate Limited
  if (msg.includes('429') || msg.includes('Too Many Requests') || msg.includes('RATE_LIMIT') ||
    (msg.includes('RESOURCE_EXHAUSTED') && (msg.includes('rate') || msg.includes('minute') || msg.includes('requests')))) {
    return { type: 'RATE_LIMITED', message: 'Quá giới hạn tốc độ (rate limit). Đang chờ thử lại...', retryable: true };
  }

  // RESOURCE_EXHAUSTED (general quota, not rate limit)
  if (msg.includes('RESOURCE_EXHAUSTED')) {
    return { type: 'QUOTA_EXHAUSTED', message: 'API Key đã hết lượt dùng miễn phí. Vui lòng chờ hoặc tạo key mới.', retryable: false };
  }

  // 400 - Unsupported MIME type or bad content (NOT a key issue)
  if (msg.includes('MIME type') || msg.includes('Unsupported') || msg.includes('mime')) {
    return { type: 'UNKNOWN', message: 'Định dạng nội dung không được hỗ trợ. Vui lòng thử lại với ảnh PNG/JPG hoặc nhập text.', retryable: false };
  }

  // 400 - Invalid argument / Bad key
  if (msg.includes('INVALID_ARGUMENT') || msg.includes('API key not valid') || status === 400) {
    return { type: 'INVALID_KEY', message: 'API Key không hợp lệ. Vui lòng kiểm tra lại.', retryable: false };
  }

  // 404 - Model not found
  if (msg.includes('NOT_FOUND') || msg.includes('not found') || status === 404) {
    return { type: 'MODEL_NOT_FOUND', message: 'Model AI không tồn tại. Vui lòng chọn model khác trong Settings.', retryable: false };
  }

  // Unknown
  return { type: 'UNKNOWN', message: `Lỗi: ${msg.substring(0, 200)}`, retryable: false };
}

/**
 * Generate content using Gemini API with auto-retry for rate limits
 */
export const generateContent = async (
  modelId: string,
  promptOrParts: string | any[],
  apiKey: string,
  systemInstruction?: string
): Promise<string> => {
  // Demo mode
  if (isDemoMode(apiKey)) {
    await delay(1500);
    return `[CHẾ ĐỘ DEMO] Vui lòng nhập API Key thật để sử dụng.

Cách lấy API Key miễn phí:
1. Truy cập https://aistudio.google.com/apikey
2. Đăng nhập Google Account
3. Click "Create API Key"
4. Copy key → dán vào Settings trong app`;
  }

  const ai = new GoogleGenAI({ apiKey });
  const contents = typeof promptOrParts === 'string'
    ? [{ role: 'user' as const, parts: [{ text: promptOrParts }] }]
    : [{ role: 'user' as const, parts: promptOrParts }];

  const MAX_RETRIES = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents,
        config: {
          systemInstruction: systemInstruction || undefined,
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error('API trả về rỗng. Vui lòng thử lại.');
      }
      return text;

    } catch (error: any) {
      console.error(`Gemini API Error (attempt ${attempt}/${MAX_RETRIES}):`, error);
      lastError = error;

      const classified = classifyError(error);

      if (classified.retryable && attempt < MAX_RETRIES) {
        // Rate limited → wait and retry (exponential backoff: 5s, 15s, 30s)
        const waitTime = attempt * 5000 + Math.random() * 2000;
        console.log(`Rate limited. Waiting ${Math.round(waitTime / 1000)}s before retry...`);
        await delay(waitTime);
        continue;
      }

      // Not retryable or last attempt → throw with classified message
      throw new Error(classified.message);
    }
  }

  // Should not reach here, but just in case
  throw lastError || new Error('Lỗi không xác định.');
};

/**
 * Test API connection with a minimal request
 */
export const testConnection = async (apiKey: string, modelId: string): Promise<void> => {
  if (isDemoMode(apiKey)) {
    await delay(500);
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ role: 'user', parts: [{ text: 'Hi' }] }],
    });

    if (!response.text) {
      throw new Error('API không phản hồi.');
    }
  } catch (error: any) {
    const classified = classifyError(error);
    throw new Error(classified.message);
  }
};
