import { GoogleGenAI } from "@google/genai";
import { Settings } from "../types";

// ============================================================================
// HSG KHTN Hóa Học AI - Gemini Service
// ============================================================================

// --- DEMO MODE CONFIGURATION ---
const DEMO_API_KEYS = ['PLACEHOLDER_API_KEY', 'demo', 'test', ''];

const isDemoMode = (apiKey: string): boolean => {
  return DEMO_API_KEYS.includes(apiKey) || !apiKey || apiKey.length < 20;
};

const simulateDelay = (ms: number = 2000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

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
 * Generate content using Gemini API
 */
export const generateContent = async (
  modelId: string,
  promptOrParts: string | any[],
  apiKey: string,
  systemInstruction?: string
): Promise<string> => {
  if (isDemoMode(apiKey)) {
    await simulateDelay(1500);
    return `[DEMO MODE] Đây là nội dung mẫu. Vui lòng nhập API Key thật để tạo nội dung.

Model: ${modelId}
Prompt: ${typeof promptOrParts === 'string' ? promptOrParts.substring(0, 100) : 'Multi-part content'}...

Để lấy API Key miễn phí:
1. Truy cập https://aistudio.google.com/apikey
2. Đăng nhập Google Account
3. Tạo API Key mới
4. Copy và paste vào Settings`;
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const contents = typeof promptOrParts === 'string'
      ? [{ role: 'user' as const, parts: [{ text: promptOrParts }] }]
      : [{ role: 'user' as const, parts: promptOrParts }];

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
    console.error('Gemini API Error:', error);

    if (error.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('API Key đã hết quota. Vui lòng dùng key khác hoặc chờ reset.');
    }
    if (error.message?.includes('INVALID_ARGUMENT')) {
      throw new Error('API Key không hợp lệ. Vui lòng kiểm tra lại.');
    }
    if (error.message?.includes('PERMISSION_DENIED') || error.message?.includes('suspended')) {
      throw new Error('API Key đã bị đình chỉ (suspended). Vui lòng tạo key mới.');
    }
    if (error.message?.includes('NOT_FOUND')) {
      throw new Error(`Model "${modelId}" không tồn tại. Vui lòng chọn model khác.`);
    }

    throw error;
  }
};

/**
 * Test API connection
 */
export const testConnection = async (apiKey: string, modelId: string): Promise<void> => {
  if (isDemoMode(apiKey)) {
    await simulateDelay(1000);
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ role: 'user', parts: [{ text: 'Xin chào! Đây là tin nhắn test kết nối.' }] }],
    });

    if (!response.text) {
      throw new Error('API không phản hồi.');
    }
  } catch (error: any) {
    if (error.message?.includes('INVALID_ARGUMENT')) {
      throw new Error('API Key không hợp lệ.');
    }
    if (error.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('API Key đã hết quota.');
    }
    if (error.message?.includes('PERMISSION_DENIED') || error.message?.includes('suspended')) {
      throw new Error('API Key đã bị đình chỉ. Vui lòng tạo key mới.');
    }
    if (error.message?.includes('NOT_FOUND')) {
      throw new Error(`Model "${modelId}" không tồn tại.`);
    }
    throw new Error(`Lỗi kết nối: ${error.message}`);
  }
};
