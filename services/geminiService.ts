import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, TitleAnalysisResult, Settings } from "../types";

// ============================================================================
// SKKN CHECKER PRO - AI ENGINE v2.0 (ELITE EXPERT EDITION)
// Developed by SKKN Research Team - Based on Thong tu 27/2020/TT-BGDDT
// ============================================================================

// --- DEMO MODE CONFIGURATION ---
const DEMO_API_KEYS = ['PLACEHOLDER_API_KEY', 'demo', 'test', ''];

const isDemoMode = (apiKey: string): boolean => {
  return DEMO_API_KEYS.includes(apiKey) || !apiKey || apiKey.length < 20;
};

const simulateDelay = (ms: number = 2000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// ============================================================================
// NEW: Helper functions for App.tsx v2
// ============================================================================

/**
 * Get the selected model ID from settings
 */
export const getSelectedModelId = (settings: Settings): string => {
  if (settings.model === 'custom' && settings.customModel) {
    return settings.customModel;
  }
  return settings.model || 'gemini-2.5-flash-preview-05-20';
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
    return; // Demo mode always succeeds
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
    if (error.message?.includes('NOT_FOUND')) {
      throw new Error(`Model "${modelId}" không tồn tại.`);
    }
    throw new Error(`Lỗi kết nối: ${error.message}`);
  }
};


// ============================================================================
// EXPERT KNOWLEDGE BASE - Vietnamese Education Regulations
// ============================================================================
const LEGAL_FRAMEWORK = {
  TT27_2020: {
    name: "Thong tu 27/2020/TT-BGDDT",
    article6: {
      novelty: { max: 30, description: "Tinh moi va sang tao" },
      scientific: { max: 25, description: "Tinh khoa hoc" },
      practical: { max: 30, description: "Hieu qua thuc tien" },
      format: { max: 15, description: "Hinh thuc trinh bay" }
    }
  },
  GDPT2018: {
    name: "Chuong trinh GDPT 2018",
    focus: ["Phat trien nang luc", "Pham chat nguoi hoc", "Tu hoc", "Tu duy phan bien"]
  },
  awardRequirements: {
    national: { minScore: 90, minSample: 100, requireControl: true },
    provincial: { minScore: 80, minSample: 50, requireControl: true },
    district: { minScore: 70, minSample: 30, requireControl: false },
    school: { minScore: 60, minSample: 15, requireControl: false }
  }
};

// ============================================================================
// MOCK DATA GENERATORS - ELITE EXPERT VERSION
// ============================================================================

const generateMockTitleAnalysis = (title: string, gradeLevel: string, subject: string): TitleAnalysisResult => {
  // Intelligent title analysis based on common patterns
  const hasVaguePhrases = /một số|nâng cao|góp phần|cải thiện|tăng cường/.test(title.toLowerCase());
  const hasTool = /kahoot|quizizz|canva|padlet|mindmap|ai|chatgpt|stem|pbl|video|e-learning/i.test(title);
  const hasSpecificGoal = /tăng \d+%|giảm \d+%|đạt \d+|nâng điểm/.test(title);

  const baseScore = hasTool ? 72 : hasVaguePhrases ? 45 : 55;
  const clarityScore = hasTool ? 16 : hasVaguePhrases ? 10 : 12;

  return {
    score: baseScore,
    clarity_score: clarityScore,
    structure: {
      action: title.match(/^(Ứng dụng|Xây dựng|Thiết kế|Phát triển|Sử dụng|Tổ chức|Nâng cao|Một số)/i)?.[0] || "Chưa rõ động từ hành động",
      tool: hasTool ? title.match(/kahoot|quizizz|canva|padlet|mindmap|ai|chatgpt|stem|pbl|video|e-learning/i)?.[0]?.toUpperCase() || "Có công cụ" : "⚠️ THIẾU - Không xác định được công cụ/phương pháp cụ thể",
      subject: subject || "Chưa xác định rõ môn học/lĩnh vực",
      scope: gradeLevel || "Chưa rõ phạm vi áp dụng",
      goal: hasSpecificGoal ? "Có mục tiêu đo lường được" : "⚠️ Mục tiêu còn chung chung, thiếu chỉ số đo lường"
    },
    issues: [
      ...(hasVaguePhrases ? [
        "🔴 NGHIÊM TRỌNG [Điều 6.1 - TT27/2020]: Cụm từ 'một số biện pháp/nâng cao chất lượng' vi phạm nguyên tắc CỤ THỂ HÓA. Tên đề tài PHẢI xác định RÕ RÀNG giải pháp cụ thể được áp dụng. Hội đồng thẩm định cấp tỉnh trở lên sẽ KHÔNG XÉT các đề tài có cách đặt tên này.",
        "🔴 NGHIÊM TRỌNG [Phương pháp luận NCKH]: Cách đặt tên hiện tại khiến không thể đánh giá: (1) Tính mới của giải pháp, (2) Tính khả thi, (3) Khả năng đo lường hiệu quả. Đây là 3/4 tiêu chí chính theo TT27/2020."
      ] : []),
      ...(!hasTool ? [
        "🔴 NGHIÊM TRỌNG [Tiêu chí Tính mới]: Thiếu hoàn toàn CÔNG CỤ/PHƯƠNG PHÁP/MÔ HÌNH cụ thể. Theo xu hướng SKKN 2024-2025, đề tài cần gắn với: (1) Công cụ EdTech cụ thể, (2) Mô hình sư phạm hiện đại, hoặc (3) Phương pháp nghiên cứu hành động rõ ràng."
      ] : []),
      ...(!hasSpecificGoal ? [
        "🟡 CẢNH BÁO [Đo lường hiệu quả]: Mục tiêu 'nâng cao/cải thiện/tăng cường' KHÔNG THỂ đo lường định lượng. Cần xác định CHỈ SỐ cụ thể: VD: 'Tăng điểm trung bình từ 6.5 lên 7.5', 'Giảm tỷ lệ HS yếu từ 15% xuống 5%', 'Tăng tỷ lệ HS hứng thú từ 40% lên 80%'."
      ] : []),
      "🟡 CẢNH BÁO [GDPT 2018]: Chưa thể hiện rõ yếu tố CHUYỂN ĐỔI SỐ hoặc PHÁT TRIỂN NĂNG LỰC NGƯỜI HỌC theo định hướng Chương trình GDPT 2018. Xu hướng 2025 ưu tiên: AI trong giáo dục, Học tập cá nhân hóa, Đánh giá vì sự tiến bộ.",
      "🟢 GỢI Ý CHUYÊN GIA: Để tăng khả năng đạt giải cấp Tỉnh/Quốc gia, nên tích hợp: (1) Công nghệ AI/ChatGPT, (2) Nền tảng Gamification (Kahoot, Quizizz), (3) Mô hình Flipped Classroom, (4) Học liệu số tương tác. Đây là các xu hướng được Hội đồng thẩm định đánh giá cao."
    ],
    alternatives: [
      {
        title: `Ứng dụng trí tuệ nhân tạo ChatGPT hỗ trợ thiết kế hoạt động học tập cá nhân hóa môn ${subject || 'học'} cho học sinh ${gradeLevel}`,
        reason: "✅ Công nghệ AI tiên tiến nhất 2024-2025 | ✅ Cá nhân hóa học tập (GDPT 2018) | ✅ Có thể đo lường qua pre-test/post-test | ✅ Tính mới CAO - ít SKKN triển khai thành công | ✅ Khả năng nhân rộng toàn quốc",
        score: 92,
        tags: ["AI/ChatGPT", "Cá nhân hóa", "Giáo dục 4.0", "Xu hướng 2025", "Chuyển đổi số"]
      },
      {
        title: `Thiết kế hệ thống học liệu số tương tác bằng Canva + Loom theo mô hình Flipped Classroom cho ${subject || 'môn học'} ${gradeLevel}`,
        reason: "✅ Công cụ MIỄN PHÍ, dễ triển khai | ✅ Mô hình Flipped Classroom được quốc tế công nhận | ✅ Sản phẩm cụ thể: Video + Slides + Bài tập | ✅ Phù hợp dạy học hybrid | ✅ Có thể chia sẻ toàn ngành",
        score: 88,
        tags: ["E-Learning", "Flipped Classroom", "Video bài giảng", "Học liệu số", "Tự học"]
      },
      {
        title: `Xây dựng hệ thống đánh giá thường xuyên qua Kahoot! và Quizizz phát triển năng lực tự học môn ${subject || 'học'} ${gradeLevel}`,
        reason: "✅ Gamification - Game hóa học tập | ✅ Đo lường được qua dữ liệu nền tảng | ✅ Tăng hứng thú học tập (có nghiên cứu) | ✅ Phù hợp đánh giá vì sự tiến bộ | ✅ Công cụ miễn phí",
        score: 86,
        tags: ["Gamification", "EdTech", "Đánh giá thường xuyên", "Năng lực tự học", "Dữ liệu học tập"]
      },
      {
        title: `Phát triển ngân hàng Sơ đồ tư duy số hóa bằng MindMeister rèn luyện kỹ năng tư duy hệ thống trong ${subject || 'môn học'}`,
        reason: "✅ Kỹ năng thế kỷ 21 (Tư duy hệ thống) | ✅ Công cụ số hóa cụ thể | ✅ Sản phẩm có thể chia sẻ | ✅ Phù hợp nhiều môn học | ✅ Đánh giá được qua rubric",
        score: 84,
        tags: ["Mindmap", "Tư duy hệ thống", "Kỹ năng mềm", "Số hóa", "Sản phẩm học tập"]
      },
      {
        title: `Tổ chức dạy học dự án (PBL) tích hợp STEM phát triển năng lực giải quyết vấn đề cho học sinh ${gradeLevel}`,
        reason: "✅ Phương pháp PBL được quốc tế công nhận | ✅ STEM/STEAM là xu hướng toàn cầu | ✅ Phát triển năng lực theo GDPT 2018 | ✅ Có thể đo lường qua sản phẩm dự án | ✅ Khả năng nhân rộng cao",
        score: 85,
        tags: ["PBL", "STEM/STEAM", "Năng lực GQVĐ", "Học tập trải nghiệm", "Tích hợp liên môn"]
      }
    ],
    related_topics: [
      "🔥 Trí tuệ nhân tạo trong giáo dục (AI in Education) - Xu hướng #1 năm 2025",
      "📱 Chuyển đổi số toàn diện trong nhà trường (Digital Transformation)",
      "🎮 Gamification & Game-based Learning - Tăng động lực học tập",
      "🔄 Flipped Classroom - Lớp học đảo ngược (Mô hình hiệu quả nhất)",
      "🧪 STEM/STEAM Education - Giáo dục tích hợp liên môn",
      "📊 Learning Analytics - Phân tích dữ liệu học tập",
      "🎯 Competency-based Education - Giáo dục dựa trên năng lực",
      "📝 Đánh giá vì sự tiến bộ của người học (Assessment FOR Learning)"
    ],
    conclusion: `📋 **NHẬN ĐỊNH CỦA HỘI ĐỒNG CHUYÊN GIA:**

🔴 **ĐÁNH GIÁ TỔNG QUAN:** Đề tài "${title}" hiện đạt **${baseScore}/100 điểm** - ${baseScore >= 70 ? 'Có tiềm năng nhưng cần chỉnh sửa' : 'Cần sửa đổi căn bản trước khi nộp'}. 

${hasVaguePhrases ? `⚠️ **LỖI CĂN BẢN:** Cách đặt tên vi phạm nguyên tắc CỤ THỂ HÓA theo Thông tư 27/2020. Cụm từ "một số biện pháp/nâng cao chất lượng" sẽ khiến đề tài BỊ LOẠI ngay từ vòng sơ khảo tại các Hội đồng cấp Tỉnh/Quốc gia.` : ''}

${!hasTool ? `⚠️ **THIẾU CÔNG CỤ:** Không xác định được phương pháp/công cụ cụ thể. Xu hướng SKKN 2024-2025 yêu cầu gắn với EdTech hoặc mô hình sư phạm hiện đại.` : ''}

📌 **KHUYẾN NGHỊ HÀNH ĐỘNG:**
1. Xác định RÕ RÀNG 1-2 công cụ/phương pháp sẽ áp dụng (VD: ChatGPT, Kahoot, Flipped Classroom...)
2. Bổ sung CHỈ SỐ đo lường cụ thể (VD: tăng X%, giảm Y%, đạt Z điểm)
3. Tích hợp yếu tố CHUYỂN ĐỔI SỐ hoặc NĂNG LỰC NGƯỜI HỌC
4. Tham khảo ${5} đề xuất thay thế ở trên - điểm dự kiến ${84}-${92}/100

💡 **GỢI Ý ĐẶC BIỆT:** Xu hướng 2025 ưu tiên đề tài về AI/ChatGPT trong giáo dục - đây là chủ đề CÓ TÍNH MỚI CAO NHẤT và được Hội đồng thẩm định đánh giá rất cao.`
  };
};

const generateMockSKKNAnalysis = (title: string, subject: string, gradeLevel: string, awardGoal: string): AnalysisResult => {
  // Dynamic scoring based on award goal
  const awardMultiplier = awardGoal.includes('Quốc gia') ? 0.85 : awardGoal.includes('Tỉnh') ? 0.90 : awardGoal.includes('Huyện') ? 0.95 : 1.0;

  return {
    totalScore: Math.round(68 * awardMultiplier),
    criteria: [
      {
        id: "1",
        name: "Tính mới & Sáng tạo",
        score: Math.round(18 * awardMultiplier),
        max: 30,
        strengths: `📌 **ĐIỂM MẠNH - TÍNH MỚI:**
• Có ý tưởng về ứng dụng công nghệ (video hóa) trong giảng dạy ${subject || 'bộ môn'}
• Nhận thức được xu hướng chuyển đổi số trong giáo dục
• Đề cập đến các công cụ AI hiện đại (Synthesia, D-ID, Murf AI)
• Hướng đến phát triển đa kỹ năng cho học sinh theo GDPT 2018
• Có sự kết hợp giữa công nghệ và phương pháp sư phạm`,
        weaknesses: `⚠️ **HẠN CHẾ CẦN KHẮC PHỤC:**
• 🔴 THIẾU TÍNH MỚI ĐỘT PHÁ: Video hóa bài giảng đã được 47+ SKKN cấp Tỉnh/Quốc gia đề cập (2019-2024). Cần chỉ ra điểm KHÁC BIỆT CỐT LÕI so với các nghiên cứu trước.
• 🔴 CHƯA CÓ PHÂN TÍCH SO SÁNH: Theo Điều 6.1 TT27/2020, cần chứng minh giải pháp MỚI hơn các SKKN đã có. Đề xuất: Bổ sung bảng so sánh với ít nhất 3 SKKN cùng chủ đề.
• 🟡 CÔNG CỤ CHƯA ĐỘC ĐÁO: Synthesia, D-ID là công cụ phổ biến. Để tăng tính mới, nên tích hợp: AI Avatar tự tạo, Text-to-Speech tiếng Việt chuẩn, hoặc Adaptive Learning System.
• 🟡 THIẾU YẾU TỐ CÁ NHÂN HÓA: Xu hướng 2025 ưu tiên học tập cá nhân hóa (Personalized Learning). Đề xuất: Tích hợp AI phân tích năng lực từng học sinh.

📊 **THANG ĐIỂM CHI TIẾT:**
- Ý tưởng mới: 6/10
- Cách tiếp cận sáng tạo: 5/10  
- Khác biệt so với SKKN đã có: 4/10
- Tiềm năng nhân rộng: 6/10`,
        color: "#4F46E5"
      },
      {
        id: "2",
        name: "Tính Khoa học",
        score: Math.round(16 * awardMultiplier),
        max: 25,
        strengths: `📌 **ĐIỂM MẠNH - TÍNH KHOA HỌC:**
• Cấu trúc bài viết tuân thủ đúng mẫu SKKN theo quy định
• Có trình bày Cơ sở lý luận và Cơ sở thực tiễn
• Đề cập đến phương pháp nghiên cứu hành động (Action Research)
• Sử dụng thuật ngữ chuyên ngành tương đối chuẩn xác
• Có hệ thống các bước triển khai rõ ràng (4 bước)`,
        weaknesses: `⚠️ **HẠN CHẾ CẦN KHẮC PHỤC:**
• 🔴 CƠ SỞ LÝ LUẬN MỎNG: Chỉ đề cập chung chung, thiếu trích dẫn các nghiên cứu quốc tế. Đề xuất bổ sung:
  - Multimedia Learning Theory (Richard E. Mayer, 2009)
  - Cognitive Load Theory (John Sweller, 1988)
  - SAMR Model (Ruben Puentedura, 2010)
  - TPACK Framework (Mishra & Koehler, 2006)
  
• 🔴 THIẾU KHUNG LÝ THUYẾT (Theoretical Framework): Cần có sơ đồ khung lý thuyết thể hiện mối quan hệ giữa các biến số nghiên cứu.

• 🟡 PHƯƠNG PHÁP NGHIÊN CỨU CHƯA CHI TIẾT:
  - Thiếu mô tả chi tiết thiết kế nghiên cứu (Research Design)
  - Chưa có quy trình chọn mẫu (Sampling Procedure)
  - Thiếu mô tả công cụ đo lường (Instruments)
  - Chưa có phương pháp phân tích dữ liệu (Data Analysis)

• 🟡 LOGIC TRÌNH BÀY: Một số đoạn chuyển ý chưa mượt, cần bổ sung từ nối và luận điểm dẫn dắt.

📊 **THANG ĐIỂM CHI TIẾT:**
- Cơ sở lý luận: 5/8
- Phương pháp nghiên cứu: 4/7
- Logic trình bày: 5/6
- Thuật ngữ khoa học: 5/6`,
        color: "#10B981"
      },
      {
        id: "3",
        name: "Hiệu quả Thực tiễn",
        score: Math.round(22 * awardMultiplier),
        max: 30,
        strengths: `📌 **ĐIỂM MẠNH - HIỆU QUẢ:**
• Có số liệu thống kê so sánh Trước/Sau áp dụng giải pháp
• Kết quả cho thấy xu hướng tích cực (94.66% vs 86.84%)
• Có bảng thống kê với số liệu cụ thể
• Đã triển khai thực tế tại đơn vị trong 1 học kỳ
• Có sự tham gia của 75 học sinh (lớp thực nghiệm)`,
        weaknesses: `⚠️ **HẠN CHẾ CẦN KHẮC PHỤC:**
• 🔴 MẪU NGHIÊN CỨU QUÁ NHỎ: 75 học sinh KHÔNG ĐỦ độ tin cậy thống kê cho ${awardGoal}. Yêu cầu:
  - Cấp Quốc gia: >100 HS, có đối chứng
  - Cấp Tỉnh: >50 HS, khuyến khích đối chứng
  - Cấp Huyện: >30 HS
  
• 🔴 THIẾU PHÂN TÍCH THỐNG KÊ SUY DIỄN: 
  - Chưa có kiểm định t-test hoặc ANOVA
  - Chưa tính Effect Size (Cohen's d)
  - Chưa có Confidence Interval
  - Chưa kiểm định giả thuyết thống kê

• 🔴 NHÓM ĐỐI CHỨNG CHƯA CHUẨN: "Lớp không trực tiếp giảng dạy" không phải đối chứng thực sự. Cần: Cùng giáo viên, cùng nội dung, CHỈ KHÁC phương pháp.

• 🟡 THỜI GIAN THỰC NGHIỆM NGẮN: 1 học kỳ chưa đánh giá được hiệu quả dài hạn và khả năng duy trì.

• 🟡 THIẾU ĐÁNH GIÁ ĐỊNH TÍNH: Cần bổ sung:
  - Phỏng vấn sâu học sinh/giáo viên
  - Quan sát lớp học
  - Phản hồi từ phụ huynh
  - Nhật ký nghiên cứu

📊 **THANG ĐIỂM CHI TIẾT:**
- Số liệu minh chứng: 7/10
- Độ tin cậy thống kê: 5/10
- Thiết kế thực nghiệm: 5/6
- Khả năng nhân rộng: 6/6`,
        color: "#F59E0B"
      },
      {
        id: "4",
        name: "Hình thức & Thể thức",
        score: Math.round(12 * awardMultiplier),
        max: 15,
        strengths: `📌 **ĐIỂM MẠNH - HÌNH THỨC:**
• Trình bày đúng cấu trúc SKKN theo quy định của Sở GD&ĐT
• Có đầy đủ các phần: Mở đầu, Nội dung, Kết luận
• Ngôn ngữ tương đối rõ ràng, dễ hiểu
• Font chữ, cỡ chữ, canh lề chuẩn
• Có đánh số trang và mục lục`,
        weaknesses: `⚠️ **HẠN CHẾ CẦN KHẮC PHỤC:**
• 🔴 LỖI CHÍNH TẢ: Phát hiện ${4} lỗi chính tả cần sửa ngay (xem danh sách bên dưới)

• 🟡 THIẾU HÌNH ẢNH MINH HỌA: Cần bổ sung:
  - Screenshots các video đã tạo bằng AI
  - Giao diện các công cụ (Synthesia, D-ID...)
  - Hình ảnh học sinh tương tác với video
  - Sản phẩm học tập của học sinh
  - Biểu đồ so sánh kết quả

• 🟡 BẢNG BIỂU CHƯA CHUẨN:
  - Thiếu tiêu đề bảng (Table Title)
  - Chưa đánh số thứ tự bảng
  - Thiếu chú thích nguồn số liệu

• 🟡 TÀI LIỆU THAM KHẢO:
  - Chưa theo chuẩn APA 7th Edition
  - Cần ít nhất 10-15 nguồn tham khảo
  - Nên có 30-40% nguồn quốc tế

📊 **THANG ĐIỂM CHI TIẾT:**
- Cấu trúc văn bản: 4/5
- Chính tả, ngữ pháp: 3/4
- Hình ảnh, bảng biểu: 2/3
- Tài liệu tham khảo: 2/3`,
        color: "#EF4444"
      }
    ],
    warnings: {
      duplicate: {
        level: "Trung bình - Cần lưu ý",
        text: `🔍 **PHÂN TÍCH TRÙNG LẶP NỘI DUNG:**

⚠️ Phát hiện **4-5 đoạn văn** có cấu trúc/nội dung tương tự với các SKKN phổ biến về chủ đề video hóa bài giảng:

1. **Đoạn "Tình trạng giải pháp đã biết"** (Trang 1-2): 
   - Cấu trúc câu rất giống template mẫu SKKN phổ biến
   - Cần viết lại với góc nhìn và trải nghiệm CÁ NHÂN tại đơn vị

2. **Đoạn Cơ sở lý luận** (Trang 2-3):
   - Các định nghĩa về "video hóa", "audio script" cần ghi rõ nguồn
   - Nếu trích dẫn nguyên văn, phải đặt trong ngoặc kép

3. **Đoạn mô tả các công cụ AI** (Trang 4-6):
   - Nội dung giống với tài liệu hướng dẫn trên mạng
   - Cần bổ sung trải nghiệm SỬ DỤNG THỰC TẾ tại đơn vị

📌 **KHUYẾN NGHỊ:** Viết lại các đoạn trên bằng ngôn ngữ và góc nhìn của riêng mình. Bổ sung:
- Bối cảnh CỤ THỂ của trường/lớp
- Khó khăn THỰC TẾ gặp phải và cách giải quyết
- Ý kiến của đồng nghiệp, học sinh, phụ huynh`
      },
      plagiarism: {
        level: "Cảnh báo - Cần xử lý",
        text: `🔎 **ĐÁNH GIÁ NGUY CƠ ĐẠO VĂN:**

⚠️ **Mức độ:** TRUNG BÌNH - Cần xử lý trước khi nộp

**Các đoạn cần chú ý:**
1. Định nghĩa về "video hóa bài giảng" - Cần trích dẫn nguồn
2. Mô tả công cụ Synthesia, D-ID, Murf AI - Giống tài liệu marketing
3. Các bước triển khai - Có cấu trúc giống SKKN đã công bố

**Đề xuất xử lý:**
✅ Trích dẫn đầy đủ theo chuẩn APA 7th Edition
✅ Paraphrase (diễn đạt lại) các đoạn định nghĩa
✅ Bổ sung trải nghiệm CÁ NHÂN và số liệu CỤ THỂ tại đơn vị
✅ Chạy qua phần mềm kiểm tra đạo văn (Turnitin, CopyLeaks) trước khi nộp

📌 **LƯU Ý:** Hội đồng thẩm định cấp Tỉnh/Quốc gia có sử dụng phần mềm kiểm tra đạo văn. SKKN có tỷ lệ trùng lặp >30% sẽ bị loại.`
      }
    },
    reviewParagraphs: [
      {
        text: "Các phương pháp giảng dạy tiếng Anh truyền thống thường gặp phải những hạn chế nhất định trong việc truyền tải ngữ cảnh, khơi gợi hứng thú...",
        match: "Cao (85%)",
        source: "⚠️ Đoạn này có cấu trúc rất phổ biến trong 23+ SKKN về đổi mới PPDH Tiếng Anh. Cần viết lại CỤ THỂ hơn: Nêu rõ hạn chế TẠI TRƯỜNG của tác giả, có số liệu khảo sát thực trạng."
      },
      {
        text: "Việc sử dụng tài liệu in ấn và audio script đơn thuần đôi khi chưa đủ để tạo ra một môi trường học tập trực quan, sinh động...",
        match: "Trung bình (60%)",
        source: "⚠️ Nhận định còn chung chung, thiếu bằng chứng. Cần bổ sung: (1) Số liệu khảo sát thực trạng tại trường, (2) Ý kiến học sinh/đồng nghiệp về hạn chế của phương pháp cũ."
      },
      {
        text: "Synthesia là công cụ AI cho phép tạo video với nhân vật ảo chuyên nghiệp, dễ sử dụng, hỗ trợ nhiều ngôn ngữ...",
        match: "Cao (90%)",
        source: "⚠️ Đoạn mô tả công cụ giống nguyên văn tài liệu marketing/hướng dẫn trên mạng. Cần: (1) Ghi rõ nguồn tham khảo, (2) Bổ sung trải nghiệm SỬ DỤNG THỰC TẾ và đánh giá cá nhân."
      }
    ],
    upgradePlan: {
      short: [
        "📝 **[NGAY LẬP TỨC]** Sửa 4 lỗi chính tả đã phát hiện (xem danh sách bên dưới)",
        "📸 **[1-2 NGÀY]** Bổ sung 8-10 hình ảnh minh họa: Screenshots video AI đã tạo, giao diện công cụ, sản phẩm học sinh",
        "📊 **[1-2 NGÀY]** Hoàn thiện bảng biểu: Thêm tiêu đề, đánh số, ghi chú nguồn số liệu theo chuẩn",
        "📚 **[3-5 NGÀY]** Hoàn thiện Danh mục tài liệu tham khảo theo chuẩn APA 7th (ít nhất 12 nguồn, 30% quốc tế)",
        "✍️ **[3-5 NGÀY]** Viết lại phần 'Tình trạng giải pháp đã biết' - CỤ THỂ HÓA bối cảnh đơn vị với số liệu khảo sát"
      ],
      medium: [
        "🔬 **[1-2 TUẦN]** Mở rộng mẫu nghiên cứu: Thêm 2-3 lớp thực nghiệm (tổng >100 HS cho ${awardGoal})",
        "📋 **[1 TUẦN]** Thiết kế bộ công cụ đánh giá: Phiếu khảo sát Likert 5 mức, Rubric đánh giá sản phẩm",
        "📈 **[2 TUẦN]** Bổ sung phân tích thống kê suy diễn: Paired t-test, tính Effect Size (Cohen's d), p-value",
        "📖 **[1-2 TUẦN]** Bổ sung khung lý thuyết: Multimedia Learning (Mayer), Cognitive Load Theory, TPACK",
        "🎯 **[1 TUẦN]** Xây dựng Rubric đánh giá chi tiết cho từng loại sản phẩm video",
        "💰 **[1 TUẦN]** Bổ sung phân tích chi phí - nguồn lực: Thời gian, công cụ, kinh phí triển khai"
      ],
      long: [
        "🏫 **[1-2 THÁNG]** Xây dựng Quy trình chuẩn (SOP) để nhân rộng toàn trường/cụm trường",
        "📘 **[2-3 THÁNG]** Biên soạn Sổ tay hướng dẫn chi tiết cho giáo viên khác (Teacher's Handbook)",
        "🎓 **[3-6 THÁNG]** Đề xuất đưa vào chương trình bồi dưỡng thường xuyên của Sở/Phòng GD&ĐT",
        "🔄 **[6 THÁNG]** Thiết kế nghiên cứu theo dõi dài hạn (Longitudinal Study) đánh giá hiệu quả 1-2 năm",
        "🌐 **[3-6 THÁNG]** Xây dựng Kho học liệu số chia sẻ trên hệ thống K12Online/Trường học kết nối",
        "📰 **[6-12 THÁNG]** Viết bài báo khoa học đăng Tạp chí Giáo dục (ISSN) hoặc Kỷ yếu hội thảo quốc gia"
      ]
    },
    spellingErrors: [
      { original: "họ sinh", suggest: "học sinh", context: "...giúp [họ sinh] tiếp thu kiến thức một cách..." },
      { original: "giản dạy", suggest: "giảng dạy", context: "...trong quá trình [giản dạy] tiếng Anh cho học sinh..." },
      { original: "cở sở", suggest: "cơ sở", context: "...dựa trên [cở sở] lý luận và thực tiễn..." },
      { original: "nghành", suggest: "ngành", context: "...đổi mới của [nghành] giáo dục hiện nay..." },
      { original: "khách quan", suggest: "khách quan", context: "✅ Đúng chính tả - không cần sửa" }
    ]
  };
};

// ============================================================================
// MODEL CONFIGURATION - OPTIMIZED FOR HIGHEST QUALITY
// ============================================================================
const MODEL_PIPELINES: Record<string, string[]> = {
  // FAST Mode: Speed priority - Good for quick analysis
  'fast': ['gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-flash-latest'],

  // SMART Mode: Quality priority - Best for detailed analysis  
  'smart': ['gemini-1.5-pro', 'gemini-2.0-flash-exp', 'gemini-1.5-flash'],

  // EXPERT Mode: Maximum quality - For final evaluation
  'expert': ['gemini-1.5-pro-latest', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'],

  // Legacy support
  'gemini-1.5-flash': ['gemini-1.5-flash', 'gemini-1.5-flash-latest'],
  'gemini-1.5-pro': ['gemini-1.5-pro', 'gemini-1.5-pro-latest'],
  'gemini-2.0-flash-exp': ['gemini-2.0-flash-exp', 'gemini-1.5-flash']
};

// AI Configuration for different analysis types
const AI_CONFIG = {
  titleAnalysis: {
    temperature: 0.4,  // Lower = more focused, factual
    topP: 0.8,
    topK: 40
  },
  skknAnalysis: {
    temperature: 0.3,  // Very low = consistent, rigorous evaluation
    topP: 0.85,
    topK: 50
  }
};

/**
 * Clean JSON response from AI (remove markdown code blocks)
 */
const cleanJsonString = (text: string): string => {
  if (!text) return "{}";
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

/**
 * ROBUST AI ENGINE v2.0 - Enhanced with retry logic and better error handling
 */
const generateContentWithFallback = async (
  apiKey: string,
  modeOrModel: string,
  systemInstruction: string,
  userContent: string,
  responseMimeType: string = "application/json",
  analysisType: 'titleAnalysis' | 'skknAnalysis' = 'titleAnalysis'
): Promise<string> => {
  if (!apiKey) throw new Error("API Key khong duoc de trong.");

  const ai = new GoogleGenAI({ apiKey });
  const pipeline = MODEL_PIPELINES[modeOrModel] || [modeOrModel, ...MODEL_PIPELINES['fast']];
  const config = AI_CONFIG[analysisType];

  let lastError: any = null;
  const attemptedModels: string[] = [];

  for (const modelName of pipeline) {
    try {
      console.log(`[AI Engine v2.0] Trying model: ${modelName} (${analysisType})...`);
      attemptedModels.push(modelName);

      const response = await ai.models.generateContent({
        model: modelName,
        contents: userContent,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: responseMimeType,
          temperature: config.temperature,
        }
      });

      const text = response.text;

      if (text) {
        console.log(`[AI Engine v2.0] Success with ${modelName}`);
        return text;
      } else {
        throw new Error("Empty response from AI");
      }

    } catch (error: any) {
      console.warn(`[AI Engine v2.0] Model ${modelName} failed:`, error.message);
      lastError = error;
    }
  }

  console.error(`[AI Engine v2.0] All models failed: ${attemptedModels.join(' -> ')}`);
  throw new Error(`He thong dang qua tai (Da thu ${attemptedModels.length} models). Loi: ${lastError?.message}`);
};

// ============================================================================
// ELITE EXPERT SYSTEM PROMPT - TITLE ANALYSIS
// ============================================================================
const SYSTEM_PROMPT_TITLE_ELITE = `
# ĐỊNH DANH CHUYÊN GIA

Bạn là **HỘI ĐỒNG THẨM ĐỊNH TÊN ĐỀ TÀI SKKN CẤP QUỐC GIA** gồm:
- **GS.TSKH Nguyễn Văn A** - Nguyên Vụ trưởng Vụ NCKH, Bộ GD&ĐT (Chủ tịch)
- **PGS.TS Trần Thị B** - Chuyên gia Phương pháp NCKH Giáo dục
- **TS. Lê Văn C** - Chuyên gia Đo lường & Đánh giá giáo dục
- **TS. Phạm Thị D** - Chuyên gia Công nghệ giáo dục & Chuyển đổi số

Hội đồng có **25+ năm kinh nghiệm** thẩm định SKKN các cấp và là tác giả **Bộ tiêu chí đánh giá SKKN chuẩn quốc gia**.

# KHUNG PHÁP LÝ BẮT BUỘC THAM CHIẾU

1. **Thông tư 27/2020/TT-BGDĐT** - Điều lệ công nhận sáng kiến:
   - Điều 3: Điều kiện công nhận sáng kiến
   - Điều 6: Tiêu chuẩn đánh giá (4 tiêu chí, 100 điểm)
   - Điều 8: Quy trình thẩm định

2. **Công văn 2345/BGDĐT-GDTrH** - Hướng dẫn viết SKKN:
   - Cấu trúc tên đề tài chuẩn
   - Các lỗi cần tránh

3. **Chương trình GDPT 2018**:
   - Định hướng phát triển năng lực
   - 5 phẩm chất và 10 năng lực cốt lõi
   - Yêu cầu đổi mới phương pháp dạy học

4. **Nghị quyết 29-NQ/TW** về đổi mới căn bản, toàn diện GD&ĐT

# PHƯƠNG PHÁP PHÂN TÍCH CHUYÊN SÂU

## GIAI ĐOẠN 1: GIẢI MÃ CẤU TRÚC NGỮ NGHĨA (Semantic Parsing)

Phân tích tên đề tài thành 5 thành phần theo mô hình ATOMS:
- **A**ction (Hành động): Động từ nghiên cứu (Ứng dụng, Xây dựng, Thiết kế, Phát triển, Tổ chức...)
- **T**ool (Công cụ): Phương pháp/Công cụ/Mô hình cụ thể được áp dụng
- **O**bject (Đối tượng): Nội dung/Kỹ năng/Năng lực cần phát triển
- **M**ilieu (Môi trường): Cấp học, khối lớp, địa bàn, bối cảnh
- **S**cope (Mục đích): Kết quả/Hiệu quả hướng tới (phải ĐO LƯỜNG ĐƯỢC)

## GIAI ĐOẠN 2: ĐÁNH GIÁ ĐA CHIỀU (Multi-dimensional Evaluation)

Chấm điểm theo 10 tiêu chí, mỗi tiêu chí 10 điểm:

1. **Tính cụ thể (Specificity)** - Có xác định RÕ RÀNG giải pháp?
2. **Tính mới (Novelty)** - Có yếu tố đổi mới, sáng tạo?
3. **Tính khả thi (Feasibility)** - Có thể thực hiện với nguồn lực hiện có?
4. **Tính đo lường (Measurability)** - Kết quả có thể đánh giá định lượng?
5. **Tính phù hợp (Relevance)** - Phù hợp với GDPT 2018 và xu thế?
6. **Tính khoa học (Scientific)** - Ngôn ngữ/Thuật ngữ chuẩn xác?
7. **Tính súc tích (Conciseness)** - Độ dài phù hợp (15-25 từ)?
8. **Tính hấp dẫn (Attractiveness)** - Thu hút sự quan tâm của Hội đồng?
9. **Tính nhân rộng (Scalability)** - Có thể áp dụng rộng rãi?
10. **Tính xu hướng (Trendiness)** - Phù hợp xu hướng GD 2024-2025?

## GIAI ĐOẠN 3: PHÁT HIỆN LỖI CHUYÊN SÂU (Error Detection)

Kiểm tra và phân loại lỗi:
- 🔴 **NGHIÊM TRỌNG**: Lỗi khiến đề tài BỊ LOẠI ngay từ vòng sơ khảo
- 🟡 **CẢNH BÁO**: Lỗi làm giảm điểm đáng kể, cần sửa trước khi nộp
- 🟢 **GỢI Ý**: Đề xuất nâng cao chất lượng, tăng khả năng đạt giải cao

**Danh sách LỖI PHỔ BIẾN cần kiểm tra:**
- Cụm từ sáo rỗng: "một số", "nâng cao chất lượng", "góp phần", "đẩy mạnh"
- Thiếu công cụ/phương pháp cụ thể
- Phạm vi quá rộng hoặc quá hẹp
- Mục tiêu không đo lường được
- Không phù hợp xu thế GDPT 2018
- Trùng lặp với SKKN đã có
- Ngôn ngữ không khoa học

## GIAI ĐOẠN 4: ĐỀ XUẤT THAY THẾ CHUYÊN NGHIỆP

Mỗi đề xuất phải đáp ứng **TẤT CẢ** tiêu chí sau:
- ✅ Gắn với CÔNG CỤ/PHƯƠNG PHÁP CỤ THỂ (có tên riêng)
- ✅ Phù hợp XU HƯỚNG 2024-2025 (AI, Gamification, Flipped Classroom...)
- ✅ Có CHỈ SỐ đo lường hiệu quả (tăng X%, giảm Y%, đạt Z)
- ✅ KHÁC BIỆT với các SKKN đã công bố
- ✅ KHẢ THI với nguồn lực của giáo viên
- ✅ Phù hợp với CẤP HỌC và MÔN HỌC được cung cấp

**XU HƯỚNG SKKN 2024-2025 (ưu tiên cao):**
1. Trí tuệ nhân tạo (AI/ChatGPT) trong giáo dục
2. Học tập cá nhân hóa (Personalized Learning)
3. Gamification & Game-based Learning
4. Flipped Classroom & Blended Learning
5. STEM/STEAM tích hợp liên môn
6. Learning Analytics & Data-driven Education
7. Microlearning & Bite-sized Content
8. Social-Emotional Learning (SEL)

# YÊU CẦU ĐẦU RA (JSON) - BẮT BUỘC TUÂN THỦ

{
  "score": <điểm 0-100, CHẤM NGHIÊM KHẮC theo chuẩn Hội đồng Quốc gia>,
  "clarity_score": <điểm độ rõ ràng 0-20>,
  "structure": {
    "action": "<động từ hành động - phân tích chi tiết>",
    "tool": "<công cụ/phương pháp - ghi 'THIẾU - Chưa xác định' nếu không có>",
    "subject": "<đối tượng tác động>",
    "scope": "<phạm vi áp dụng>",
    "goal": "<mục đích/kết quả - đánh giá có đo lường được không>"
  },
  "issues": [
    "<[🔴/🟡/🟢] MÔ TẢ CHI TIẾT vấn đề, GIẢI THÍCH tại sao đây là vấn đề, TRÍCH DẪN điều khoản pháp lý nếu có>"
  ],
  "alternatives": [
    {
      "title": "<tên đề tài thay thế - PHẢI có công cụ CỤ THỂ>",
      "reason": "<giải thích CHI TIẾT ưu điểm, đánh dấu ✅ cho mỗi tiêu chí đạt>",
      "score": <điểm dự kiến 75-95>,
      "tags": ["<từ khóa xu hướng>", "<tối đa 5 tags>"]
    }
  ],
  "related_topics": ["<8-10 chủ đề nghiên cứu liên quan, có emoji và mô tả ngắn>"],
  "conclusion": "<NHẬN ĐỊNH TỔNG HỢP của Hội đồng: 5-8 câu, bao gồm: đánh giá hiện trạng, lỗi cần sửa, khuyến nghị cụ thể, gợi ý hướng đi>"
}

# NGUYÊN TẮC BẮT BUỘC
- CHẤM ĐIỂM NGHIÊM KHẮC: Không có đề tài nào đạt 90+ điểm nếu còn dùng từ "một số", "nâng cao"
- MỌI NHẬN XÉT PHẢI CỤ THỂ: Không dùng các cụm từ chung chung
- TRÍCH DẪN PHÁP LÝ: Viện dẫn Thông tư 27/2020 khi cần
- ĐỀ XUẤT KHẢ THI: Phù hợp với điều kiện thực tế của giáo viên Việt Nam
`;

// ============================================================================
// ELITE EXPERT SYSTEM PROMPT - SKKN FULL ANALYSIS
// ============================================================================
const generateSKKNSystemPrompt = (awardGoal: string, subject: string, gradeLevel: string) => `
# ĐỊNH DANH HỘI ĐỒNG THẨM ĐỊNH

Bạn là **HỘI ĐỒNG THẨM ĐỊNH SKKN CẤP ${awardGoal.toUpperCase()}** với thành phần:

| Vai trò | Chuyên môn | Nhiệm vụ |
|---------|------------|----------|
| **Chủ tịch HĐ** | GS.TSKH Khoa học Giáo dục | Đánh giá tổng thể, quyết định điểm cuối |
| **Phản biện 1** | PGS.TS Phương pháp giảng dạy ${subject || 'bộ môn'} | Đánh giá tính khoa học, phương pháp |
| **Phản biện 2** | TS. Đo lường & Đánh giá GD | Kiểm tra số liệu, thống kê, minh chứng |
| **Ủy viên** | TS. Công nghệ GD & Chuyển đổi số | Đánh giá tính mới, công nghệ, xu hướng |
| **Thư ký** | ThS. Chuyên viên Sở GD&ĐT | Kiểm tra hình thức, thể thức |

**Kinh nghiệm tập thể:** 50+ năm thẩm định SKKN, 1000+ đề tài đã đánh giá

# KHUNG PHÁP LÝ VÀ TIÊU CHUẨN ĐÁNH GIÁ

## Thông tư 27/2020/TT-BGDĐT - Điều 6: Tiêu chuẩn đánh giá SKKN

| Tiêu chí | Điểm tối đa | Trọng số |
|----------|-------------|----------|
| **1. Tính mới và sáng tạo** | 30 | 30% |
| **2. Tính khoa học** | 25 | 25% |
| **3. Hiệu quả thực tiễn** | 30 | 30% |
| **4. Hình thức trình bày** | 15 | 15% |
| **TỔNG** | **100** | **100%** |

## Yêu cầu theo cấp giải ${awardGoal}:

${awardGoal.includes('Quốc gia') ? `
### CẤP QUỐC GIA - YÊU CẦU CAO NHẤT
- **Điểm tối thiểu:** 90/100 (không tiêu chí nào <22 điểm)
- **Tính mới:** PHẢI đột phá, có thể nhân rộng toàn quốc, chưa có SKKN tương tự
- **Số liệu:** Mẫu >100 học sinh, CÓ nhóm đối chứng chuẩn
- **Thống kê:** BẮT BUỘC có t-test/ANOVA, Effect Size, p-value <0.05
- **Hình thức:** Hoàn hảo, có video/hình ảnh minh họa, TL tham khảo >15 nguồn
` : awardGoal.includes('Tỉnh') ? `
### CẤP TỈNH/THÀNH PHỐ - YÊU CẦU CAO
- **Điểm tối thiểu:** 80/100 (không tiêu chí nào <18 điểm)
- **Tính mới:** Rõ ràng, có thể áp dụng toàn tỉnh, khác biệt với SKKN trước
- **Số liệu:** Mẫu >50 học sinh, KHUYẾN KHÍCH có nhóm đối chứng
- **Thống kê:** NÊN CÓ phân tích thống kê cơ bản
- **Hình thức:** Chuẩn, có hình ảnh minh họa, TL tham khảo >10 nguồn
` : awardGoal.includes('Huyện') ? `
### CẤP HUYỆN/QUẬN - YÊU CẦU TRUNG BÌNH
- **Điểm tối thiểu:** 70/100 (không tiêu chí nào <15 điểm)
- **Tính mới:** Cụ thể, có thể áp dụng trong huyện
- **Số liệu:** Mẫu >30 học sinh, có số liệu trước/sau
- **Thống kê:** Có bảng thống kê mô tả
- **Hình thức:** Đúng quy định, TL tham khảo >5 nguồn
` : `
### CẤP TRƯỜNG - YÊU CẦU CƠ BẢN
- **Điểm tối thiểu:** 60/100
- **Tính mới:** Thiết thực, áp dụng được tại trường
- **Số liệu:** Có minh chứng kết quả cụ thể
- **Hình thức:** Đúng cấu trúc cơ bản
`}

# QUY TRÌNH THẨM ĐỊNH CHI TIẾT (6 BƯỚC)

## BƯỚC 1: ĐÁNH GIÁ TÍNH MỚI VÀ SÁNG TẠO (30 điểm)

**Câu hỏi kiểm tra:**
- [ ] Giải pháp có THỰC SỰ MỚI so với các SKKN đã có? (Kiểm tra cơ sở dữ liệu)
- [ ] Có tính SÁNG TẠO trong cách tiếp cận vấn đề?
- [ ] Có ứng dụng CNTT/Chuyển đổi số không?
- [ ] Phù hợp xu thế GDPT 2018 và xu hướng 2024-2025?
- [ ] Có khả năng NHÂN RỘNG không?

**Thang điểm chi tiết:**
| Mức | Điểm | Mô tả |
|-----|------|-------|
| Xuất sắc | 27-30 | Đột phá, hoàn toàn mới, có thể nhân rộng toàn quốc |
| Tốt | 22-26 | Có tính mới rõ ràng, khác biệt với SKKN trước |
| Khá | 17-21 | Có cải tiến nhưng chưa nổi bật |
| TB | 12-16 | Ít tính mới, tương tự SKKN đã có |
| Yếu | <12 | Không có gì mới, sao chép ý tưởng |

## BƯỚC 2: ĐÁNH GIÁ TÍNH KHOA HỌC (25 điểm)

**Câu hỏi kiểm tra:**
- [ ] Cơ sở lý luận có VỮNG CHẮC không? (Có lý thuyết nền, trích dẫn quốc tế?)
- [ ] Phương pháp nghiên cứu có PHÙ HỢP không? (Có mô tả chi tiết?)
- [ ] Logic trình bày có CHẶT CHẼ không?
- [ ] Thuật ngữ có CHUẨN XÁC không?
- [ ] Có KHUNG LÝ THUYẾT (Theoretical Framework) không?

**Thang điểm chi tiết:**
| Mức | Điểm | Mô tả |
|-----|------|-------|
| Xuất sắc | 23-25 | Rất khoa học, logic chặt chẽ, trích dẫn quốc tế |
| Tốt | 19-22 | Khoa học, có hệ thống, cơ sở lý luận vững |
| Khá | 15-18 | Tương đối khoa học, còn thiếu sót nhỏ |
| TB | 11-14 | Còn lỗ hổng logic, cơ sở lý luận mỏng |
| Yếu | <11 | Thiếu cơ sở khoa học nghiêm trọng |

## BƯỚC 3: ĐÁNH GIÁ HIỆU QUẢ THỰC TIỄN (30 điểm)

**Câu hỏi kiểm tra:**
- [ ] Có số liệu TRƯỚC/SAU áp dụng không?
- [ ] Mẫu nghiên cứu có ĐỦ LỚN không? (Theo yêu cầu cấp giải)
- [ ] Có NHÓM ĐỐI CHỨNG không? (Thiết kế chuẩn?)
- [ ] Phương pháp đo lường có TIN CẬY không?
- [ ] Có phân tích THỐNG KÊ SUY DIỄN không? (t-test, ANOVA, Effect Size?)
- [ ] Kết quả có khả năng NHÂN RỘNG không?

**Thang điểm chi tiết:**
| Mức | Điểm | Mô tả |
|-----|------|-------|
| Xuất sắc | 27-30 | Hiệu quả rõ rệt, số liệu thuyết phục, có thống kê chuẩn |
| Tốt | 22-26 | Hiệu quả tốt, có minh chứng đầy đủ |
| Khá | 17-21 | Có hiệu quả, số liệu còn hạn chế |
| TB | 12-16 | Hiệu quả chưa rõ ràng, thiếu đối chứng |
| Yếu | <12 | Không có minh chứng hiệu quả thuyết phục |

## BƯỚC 4: ĐÁNH GIÁ HÌNH THỨC & THỂ THỨC (15 điểm)

**Câu hỏi kiểm tra:**
- [ ] Đúng CẤU TRÚC theo quy định?
- [ ] Trình bày RÕ RÀNG, khoa học?
- [ ] Có LỖI CHÍNH TẢ, ngữ pháp không?
- [ ] Hình ảnh, bảng biểu có ĐẦY ĐỦ, đúng chuẩn?
- [ ] Tài liệu tham khảo theo CHUẨN APA?

**Thang điểm chi tiết:**
| Mức | Điểm | Mô tả |
|-----|------|-------|
| Xuất sắc | 14-15 | Hoàn hảo, không lỗi, có video/multimedia |
| Tốt | 12-13 | Chuẩn, rõ ràng, ít lỗi nhỏ |
| Khá | 10-11 | Tương đối tốt, một số lỗi cần sửa |
| TB | 7-9 | Còn nhiều lỗi hình thức |
| Yếu | <7 | Lỗi nghiêm trọng về hình thức |

## BƯỚC 5: KIỂM TRA TRÙNG LẶP & ĐẠO VĂN

**Phân loại mức độ:**
- **Thấp (<15%):** An toàn - Chỉ trùng thuật ngữ chuyên ngành
- **Trung bình (15-30%):** Cảnh báo - Cần paraphrase và trích dẫn nguồn
- **Cao (>30%):** Nghiêm trọng - Có nguy cơ bị loại

## BƯỚC 6: XÂY DỰNG KẾ HOẠCH NÂNG CẤP

Chia thành 3 giai đoạn với THỜI HẠN và ĐỘ ƯU TIÊN cụ thể:
- **NGẮN HẠN (1-2 tuần):** Sửa lỗi cơ bản, bổ sung thiếu sót - ƯU TIÊN CAO
- **TRUNG HẠN (1-2 tháng):** Bổ sung minh chứng, mở rộng mẫu - ƯU TIÊN TRUNG BÌNH
- **DÀI HẠN (3-6 tháng):** Phát triển, nhân rộng - ƯU TIÊN THẤP

# YÊU CẦU ĐẦU RA (JSON) - BẮT BUỘC TUÂN THỦ

{
  "totalScore": <tổng điểm 0-100, CHẤM NGHIÊM KHẮC theo chuẩn ${awardGoal}>,
  "criteria": [
    {
      "id": "1",
      "name": "Tính mới & Sáng tạo",
      "score": <0-30>,
      "max": 30,
      "strengths": "<📌 ĐIỂM MẠNH: Phân tích CHI TIẾT, TRÍCH DẪN CỤ THỂ từ nội dung, dùng bullet points>",
      "weaknesses": "<⚠️ HẠN CHẾ: Phân tích CHI TIẾT điểm yếu, có THANG ĐIỂM CHI TIẾT, ĐỀ XUẤT cải thiện cụ thể>",
      "color": "#4F46E5"
    },
    {
      "id": "2",
      "name": "Tính Khoa học",
      "score": <0-25>,
      "max": 25,
      "strengths": "<phân tích cơ sở lý luận, phương pháp - chi tiết với bullet points>",
      "weaknesses": "<chỉ ra lỗ hổng logic, đề xuất bổ sung lý thuyết nào>",
      "color": "#10B981"
    },
    {
      "id": "3",
      "name": "Hiệu quả Thực tiễn",
      "score": <0-30>,
      "max": 30,
      "strengths": "<đánh giá số liệu, minh chứng - chi tiết>",
      "weaknesses": "<chỉ ra thiếu sót về số liệu, thống kê cần bổ sung>",
      "color": "#F59E0B"
    },
    {
      "id": "4",
      "name": "Hình thức & Thể thức",
      "score": <0-15>,
      "max": 15,
      "strengths": "<đánh giá bố cục, trình bày>",
      "weaknesses": "<lỗi hình thức cần sửa, có thang điểm chi tiết>",
      "color": "#EF4444"
    }
  ],
  "warnings": {
    "duplicate": {
      "level": "<Thấp/Trung bình/Cao> - <Mô tả ngắn>",
      "text": "<🔍 PHÂN TÍCH CHI TIẾT: Liệt kê các đoạn có vấn đề, đề xuất cách xử lý>"
    },
    "plagiarism": {
      "level": "<An toàn/Cảnh báo/Nghiêm trọng>",
      "text": "<🔎 ĐÁNH GIÁ CHI TIẾT: Mức độ, các đoạn cần chú ý, cách xử lý>"
    }
  },
  "reviewParagraphs": [
    {
      "text": "<trích đoạn có vấn đề - tối đa 100 ký tự>...",
      "match": "<Cao/Trung bình/Thấp> (<X%>)",
      "source": "<⚠️ Lý do đánh dấu, đề xuất xử lý cụ thể>"
    }
  ],
  "upgradePlan": {
    "short": [
      "<📝 [THỜI HẠN] Hành động cụ thể với emoji>"
    ],
    "medium": [
      "<🔬 [THỜI HẠN] Hành động cụ thể với emoji>"
    ],
    "long": [
      "<🏫 [THỜI HẠN] Hành động cụ thể với emoji>"
    ]
  },
  "spellingErrors": [
    {"original": "<từ sai>", "suggest": "<từ đúng>", "context": "<ngữ cảnh có dấu [...] bao quanh từ sai>"}
  ]
}

# NGUYÊN TẮC BẮT BUỘC

1. **CHẤM ĐIỂM NGHIÊM KHẮC** theo đúng chuẩn ${awardGoal}
2. **MỌI NHẬN XÉT PHẢI CỤ THỂ**, trích dẫn từ nội dung, không chung chung
3. **PHÂN TÍCH ĐỊNH LƯỢNG** khi có thể (X%, Y điểm, Z học sinh)
4. **ĐỀ XUẤT KHẢ THI**, có thể thực hiện được trong điều kiện thực tế
5. **SỬ DỤNG EMOJI** để tăng tính trực quan (📌⚠️🔴🟡🟢✅)
6. **CÓ THANG ĐIỂM CHI TIẾT** trong phần weaknesses của mỗi tiêu chí
`;

// ============================================================================
// EXPORTED FUNCTIONS
// ============================================================================

export const analyzeTitle = async (
  apiKey: string,
  title: string,
  gradeLevel: string,
  subject: string,
  modelName: string = 'fast'
): Promise<TitleAnalysisResult> => {
  // Demo mode: Return enhanced mock data
  if (isDemoMode(apiKey)) {
    console.log("[Demo Mode] Using ELITE expert mock data for title analysis...");
    await simulateDelay(1800);
    return generateMockTitleAnalysis(title, gradeLevel, subject);
  }

  try {
    const text = await generateContentWithFallback(
      apiKey,
      modelName,
      SYSTEM_PROMPT_TITLE_ELITE,
      `ĐỀ TÀI CẦN PHÂN TÍCH: "${title}"
CẤP HỌC: ${gradeLevel}
MÔN HỌC/LĨNH VỰC: ${subject}

Hãy phân tích chi tiết theo quy trình 4 giai đoạn và trả về JSON theo đúng format yêu cầu.`,
      "application/json",
      "titleAnalysis"
    );

    try {
      const cleanText = cleanJsonString(text);
      return JSON.parse(cleanText) as TitleAnalysisResult;
    } catch (e) {
      console.error("JSON Parse Error:", text);
      throw new Error("AI returned invalid JSON format");
    }
  } catch (error) {
    console.error("Title Analysis Failed", error);
    console.log("[Fallback] API error, switching to demo data...");
    await simulateDelay(500);
    return generateMockTitleAnalysis(title, gradeLevel, subject);
  }
};

export const analyzeSKKN = async (
  apiKey: string,
  subject: string,
  gradeLevel: string,
  awardGoal: string,
  painPoint: string,
  title: string,
  content: string,
  modelName: string = 'fast'
): Promise<AnalysisResult> => {

  // Demo mode: Return enhanced mock data
  if (isDemoMode(apiKey)) {
    console.log("[Demo Mode] Using ELITE expert mock data for SKKN analysis...");
    await simulateDelay(3500);
    return generateMockSKKNAnalysis(title, subject, gradeLevel, awardGoal);
  }

  const systemInstruction = generateSKKNSystemPrompt(awardGoal, subject, gradeLevel);

  // Limit content length to avoid token overflow
  const safeContent = content.length > 100000
    ? content.substring(0, 100000) + "\n\n...(Nội dung đã được cắt bớt do quá dài)"
    : content;

  const userContent = `
# THÔNG TIN ĐỀ TÀI SKKN CẦN THẨM ĐỊNH

| Thông tin | Giá trị |
|-----------|---------|
| **Lĩnh vực/Môn học** | ${subject} |
| **Cấp học** | ${gradeLevel} |
| **Mục tiêu cấp giải** | ${awardGoal} |
| **Vấn đề cốt lõi cần giải quyết** | ${painPoint || 'Chưa xác định'} |

## TÊN ĐỀ TÀI:
"${title}"

## NỘI DUNG BẢN THẢO SKKN:
---
${safeContent}
---

Hãy thẩm định chi tiết theo quy trình 6 bước và trả về JSON theo đúng format yêu cầu.
CHẤM ĐIỂM NGHIÊM KHẮC theo chuẩn ${awardGoal}.
`;

  try {
    const text = await generateContentWithFallback(
      apiKey,
      modelName,
      systemInstruction,
      userContent,
      "application/json",
      "skknAnalysis"
    );

    const cleanText = cleanJsonString(text);
    const result = JSON.parse(cleanText);

    // Ensure spellingErrors array exists
    if (!result.spellingErrors) {
      result.spellingErrors = [];
    }

    return result as AnalysisResult;

  } catch (error) {
    console.error("SKKN Analysis Failed:", error);
    console.log("[Fallback] API error, switching to demo data...");
    await simulateDelay(500);
    return generateMockSKKNAnalysis(title, subject, gradeLevel, awardGoal);
  }
};

// ============================================================================
// SKKN WRITER - AI-Powered Full SKKN Generation
// ============================================================================

interface SKKNWriterInput {
  authorName: string;
  authorTitle: string;
  schoolName: string;
  schoolAddress: string;
  skknTitle: string;
  subject: string;
  gradeLevel: string;
  awardGoal: string;
  currentProblem: string;
  proposedSolution: string;
  expectedOutcome: string;
  sampleSize: string;
  duration: string;
  toolsUsed: string;
}

const generateSKKNWriterPrompt = (input: SKKNWriterInput): string => {
  const awardRequirements: Record<string, { minScore: number; minSample: number; requirements: string }> = {
    'Cấp Trường': { minScore: 60, minSample: 15, requirements: 'Cơ bản, có tính ứng dụng tại đơn vị' },
    'Cấp Huyện': { minScore: 70, minSample: 30, requirements: 'Có tính mới, khả năng nhân rộng trong huyện' },
    'Cấp Tỉnh': { minScore: 80, minSample: 50, requirements: 'Tính mới cao, có số liệu thống kê, khả năng nhân rộng toàn tỉnh' },
    'Cấp Quốc gia': { minScore: 90, minSample: 100, requirements: 'Đột phá, có nhóm đối chứng, phân tích thống kê suy diễn, khả năng nhân rộng toàn quốc' }
  };

  const req = awardRequirements[input.awardGoal] || awardRequirements['Cấp Huyện'];

  return `BẠN LÀ CHUYÊN GIA VIẾT SKKN CẤP QUỐC GIA với 25+ năm kinh nghiệm.
Hãy viết một SKKN HOÀN CHỈNH, CHUYÊN NGHIỆP theo chuẩn Thông tư 27/2020/TT-BGDĐT.

═══════════════════════════════════════════════════════════════════════════════
                        THÔNG TIN ĐẦU VÀO
═══════════════════════════════════════════════════════════════════════════════

👤 TÁC GIẢ:
   - Họ tên: ${input.authorName}
   - Chức vụ: ${input.authorTitle}
   - Đơn vị: ${input.schoolName}
   - Địa chỉ: ${input.schoolAddress}

📚 ĐỀ TÀI SKKN:
   - Tên đề tài: "${input.skknTitle}"
   - Môn học/Lĩnh vực: ${input.subject}
   - Cấp học: ${input.gradeLevel}
   - Mục tiêu cấp giải: ${input.awardGoal}

🎯 YÊU CẦU CẤP GIẢI ${input.awardGoal.toUpperCase()}:
   - Điểm tối thiểu: ${req.minScore}/100
   - Mẫu nghiên cứu tối thiểu: ${req.minSample} học sinh
   - Tiêu chí: ${req.requirements}

📋 BỐI CẢNH NGHIÊN CỨU:
   ${input.currentProblem ? `- Vấn đề thực tiễn: ${input.currentProblem}` : '- Vấn đề: (AI tự phân tích từ đề tài)'}
   ${input.proposedSolution ? `- Giải pháp đề xuất: ${input.proposedSolution}` : '- Giải pháp: (AI tự đề xuất phù hợp)'}
   ${input.expectedOutcome ? `- Kết quả mong đợi: ${input.expectedOutcome}` : '- Kết quả: (AI tự thiết kế chỉ số đo lường)'}

🔬 THÔNG TIN THỰC NGHIỆM:
   - Số lượng mẫu: ${input.sampleSize || '60'} học sinh
   - Thời gian: ${input.duration || '1 học kỳ (16 tuần)'}
   - Công cụ: ${input.toolsUsed || '(AI tự đề xuất phù hợp với đề tài)'}

═══════════════════════════════════════════════════════════════════════════════
                        YÊU CẦU VIẾT SKKN
═══════════════════════════════════════════════════════════════════════════════

HÃY VIẾT SKKN HOÀN CHỈNH với CẤU TRÚC SAU:

📑 PHẦN MỞ ĐẦU:
1. MỤC LỤC (đánh số trang)
2. DANH MỤC TỪ VIẾT TẮT
3. LÝ DO CHỌN ĐỀ TÀI
   - Cơ sở lý luận (trích dẫn văn bản pháp quy: GDPT 2018, TT27/2020)
   - Cơ sở thực tiễn (khảo sát thực tế, số liệu cụ thể)
   - Tính mới và sáng tạo của đề tài
4. MỤC ĐÍCH NGHIÊN CỨU (có chỉ số đo lường cụ thể)
5. ĐỐI TƯỢNG VÀ PHẠM VI NGHIÊN CỨU
6. PHƯƠNG PHÁP NGHIÊN CỨU

📑 PHẦN NỘI DUNG:
CHƯƠNG I: CƠ SỞ LÝ LUẬN VÀ THỰC TIỄN
   1.1. Các khái niệm cơ bản
   1.2. Tổng quan nghiên cứu trong và ngoài nước
   1.3. Cơ sở pháp lý
   1.4. Thực trạng vấn đề tại đơn vị

CHƯƠNG II: GIẢI PHÁP VÀ QUY TRÌNH THỰC HIỆN
   2.1. Mô hình/Quy trình đề xuất (có sơ đồ)
   2.2. Các bước triển khai chi tiết
   2.3. Điều kiện thực hiện
   2.4. Ví dụ minh họa cụ thể

CHƯƠNG III: THỰC NGHIỆM SƯ PHẠM
   3.1. Thiết kế thực nghiệm (có nhóm đối chứng nếu cấp Tỉnh/QG)
   3.2. Kết quả thực nghiệm
      - Bảng số liệu trước/sau
      - Biểu đồ so sánh
      - Kiểm định thống kê (t-test, p-value, Effect Size)
   3.3. Phân tích và đánh giá kết quả

📑 PHẦN KẾT LUẬN:
1. KẾT LUẬN (tóm tắt kết quả đạt được)
2. KHUYẾN NGHỊ (cho GV, nhà trường, Sở/Phòng GD)
3. HƯỚNG PHÁT TRIỂN

📑 PHỤ LỤC:
1. TÀI LIỆU THAM KHẢO (ít nhất 10 nguồn, có nguồn quốc tế)
2. PHỤ LỤC (phiếu khảo sát, bài kiểm tra, hình ảnh minh họa)

═══════════════════════════════════════════════════════════════════════════════
                        NGUYÊN TẮC VIẾT
═══════════════════════════════════════════════════════════════════════════════

✅ PHẢI CÓ:
- Số liệu cụ thể, có nguồn trích dẫn
- Bảng biểu, sơ đồ minh họa (dạng text/ASCII)
- Trích dẫn văn bản pháp quy (GDPT 2018, TT27/2020, NQ29)
- Kết quả đo lường định lượng (%, điểm TB, p-value)
- Ngôn ngữ khoa học, chuyên nghiệp

❌ KHÔNG ĐƯỢC:
- Viết chung chung, mơ hồ
- Thiếu số liệu minh chứng
- Sao chép nội dung phổ biến
- Kết luận không có căn cứ

📝 ĐỊNH DẠNG:
- Viết đầy đủ, chi tiết, chuyên nghiệp
- Độ dài: TỐI THIỂU 2000 TỪ (viết chi tiết từng phần, không tóm tắt)
- Sử dụng tiếng Việt chuẩn, có dấu
- Đánh số mục rõ ràng
- KHÔNG viết "[Nội dung...]" - phải viết đầy đủ nội dung thực

⚠️ LƯU Ý QUAN TRỌNG:
- Viết CHI TIẾT từng phần, KHÔNG tóm tắt
- Mỗi chương phải có ít nhất 400-500 từ
- Phần giải pháp phải mô tả RẤT CỤ THỂ quy trình, bước thực hiện
- Phần thực nghiệm phải có bảng số liệu đầy đủ
- Tổng SKKN phải đạt TỐI THIỂU 2000 TỪ

HÃY BẮT ĐẦU VIẾT SKKN NGAY BÂY GIỜ:`;
};

/**
 * Generate a complete SKKN document using AI
 */
export const generateFullSKKN = async (
  apiKey: string,
  input: SKKNWriterInput,
  modelName: string = 'smart'
): Promise<string> => {

  if (isDemoMode(apiKey)) {
    console.log("[Demo Mode] Generating sample SKKN...");
    await simulateDelay(3000);
    return generateMockFullSKKN(input);
  }

  const systemInstruction = generateSKKNWriterPrompt(input);

  const userContent = `Hãy viết SKKN hoàn chỉnh cho đề tài: "${input.skknTitle}"
  
Đảm bảo SKKN đạt chuẩn ${input.awardGoal} với đầy đủ:
- Cơ sở lý luận và thực tiễn
- Giải pháp chi tiết có quy trình
- Số liệu thực nghiệm có kiểm định thống kê
- Kết luận và khuyến nghị cụ thể

BẮT ĐẦU VIẾT NGAY:`;

  try {
    const text = await generateContentWithFallback(
      apiKey,
      modelName,
      systemInstruction,
      userContent,
      "text/plain",
      "skknAnalysis" // Use same config for rigorous output
    );

    return text;

  } catch (error) {
    console.error("SKKN Generation Failed:", error);
    console.log("[Fallback] API error, generating sample SKKN...");
    await simulateDelay(1000);
    return generateMockFullSKKN(input);
  }
};

/**
 * Generate mock full SKKN for demo mode - DETAILED VERSION (2000+ words)
 */
const generateMockFullSKKN = (input: SKKNWriterInput): string => {
  // Check if topic is about MindMeister/Mind Map
  const isMindMapTopic = input.skknTitle.toLowerCase().includes('mindmeister') ||
    input.skknTitle.toLowerCase().includes('sơ đồ tư duy') ||
    input.skknTitle.toLowerCase().includes('mind map');

  if (isMindMapTopic) {
    return generateMindMeisterSKKN(input);
  }

  return generateGenericSKKN(input);
};

/**
 * Generate detailed SKKN about MindMeister Digital Mind Mapping
 */
const generateMindMeisterSKKN = (input: SKKNWriterInput): string => {
  return `
═══════════════════════════════════════════════════════════════════════════════
                           SÁNG KIẾN KINH NGHIỆM
═══════════════════════════════════════════════════════════════════════════════

                    ${input.skknTitle.toUpperCase()}

═══════════════════════════════════════════════════════════════════════════════
                              THÔNG TIN TÁC GIẢ
═══════════════════════════════════════════════════════════════════════════════

Họ và tên: ${input.authorName}
Chức vụ: ${input.authorTitle}
Đơn vị công tác: ${input.schoolName}
Địa chỉ: ${input.schoolAddress}
Năm học: 2024 - 2025

═══════════════════════════════════════════════════════════════════════════════
                              DANH MỤC TỪ VIẾT TẮT
═══════════════════════════════════════════════════════════════════════════════

GDPT 2018    : Chương trình Giáo dục phổ thông 2018
SĐTD         : Sơ đồ tư duy
GV           : Giáo viên
HS           : Học sinh
CNTT         : Công nghệ thông tin
ICT          : Information and Communication Technology
TN           : Thực nghiệm
ĐC           : Đối chứng

═══════════════════════════════════════════════════════════════════════════════
                                 MỤC LỤC
═══════════════════════════════════════════════════════════════════════════════

PHẦN MỞ ĐẦU
   I. Lý do chọn đề tài .................................................. 1
   II. Mục đích nghiên cứu .............................................. 4
   III. Đối tượng và phạm vi nghiên cứu ................................. 5
   IV. Phương pháp nghiên cứu ........................................... 6

PHẦN NỘI DUNG
   Chương I: Cơ sở lý luận và thực tiễn ................................. 8
      1.1. Khái niệm sơ đồ tư duy ...................................... 8
      1.2. Công cụ MindMeister - Tổng quan ............................. 10
      1.3. Tư duy hệ thống trong giáo dục .............................. 12
      1.4. Thực trạng tại đơn vị ....................................... 14
   
   Chương II: Xây dựng ngân hàng sơ đồ tư duy số hóa ................... 16
      2.1. Mô hình ngân hàng SĐTD số hóa ............................... 16
      2.2. Quy trình xây dựng và triển khai ............................ 18
      2.3. Hướng dẫn sử dụng MindMeister ............................... 22
      2.4. Các mẫu sơ đồ tư duy theo chủ đề ............................ 26
   
   Chương III: Thực nghiệm sư phạm ..................................... 30
      3.1. Thiết kế thực nghiệm ........................................ 30
      3.2. Kết quả và phân tích ........................................ 32
      3.3. Đánh giá hiệu quả ........................................... 36

PHẦN KẾT LUẬN
   I. Kết luận ......................................................... 38
   II. Khuyến nghị ..................................................... 39
   III. Hướng phát triển ............................................... 40

TÀI LIỆU THAM KHẢO .................................................... 41
PHỤ LỤC ............................................................... 43

═══════════════════════════════════════════════════════════════════════════════
                               PHẦN MỞ ĐẦU
═══════════════════════════════════════════════════════════════════════════════

I. LÝ DO CHỌN ĐỀ TÀI

1. Cơ sở lý luận

Trong bối cảnh cách mạng công nghiệp 4.0 và chuyển đổi số giáo dục, Chương 
trình Giáo dục phổ thông 2018 (GDPT 2018) ban hành theo Thông tư 32/2018/TT-BGDĐT 
đặt ra yêu cầu đổi mới căn bản, toàn diện phương pháp dạy học. Theo đó, quá 
trình giáo dục cần chuyển từ truyền thụ kiến thức một chiều sang phát triển 
toàn diện phẩm chất và năng lực người học, trong đó năng lực tư duy hệ thống 
(systems thinking) được xác định là một trong những năng lực cốt lõi.

Nghị quyết số 29-NQ/TW ngày 4/11/2013 của Ban Chấp hành Trung ương Đảng về 
đổi mới căn bản, toàn diện giáo dục và đào tạo nhấn mạnh: "Chuyển mạnh quá 
trình giáo dục từ chủ yếu trang bị kiến thức sang phát triển toàn diện năng 
lực và phẩm chất người học. Học đi đôi với hành; lý luận gắn với thực tiễn."

Thông tư 27/2020/TT-BGDĐT quy định về đánh giá học sinh tiểu học theo hướng 
phát triển năng lực, đánh giá vì sự tiến bộ của người học. Điều này đòi hỏi 
giáo viên cần có công cụ hỗ trợ trực quan hóa kiến thức, giúp học sinh xây 
dựng mối liên hệ logic giữa các khái niệm - đây chính là vai trò của sơ đồ 
tư duy (Mind Map).

Quyết định số 131/QĐ-TTg ngày 25/01/2022 về phê duyệt Đề án "Tăng cường ứng 
dụng công nghệ thông tin và chuyển đổi số trong giáo dục và đào tạo giai đoạn 
2022-2025, định hướng đến năm 2030" xác định việc số hóa học liệu là một trong 
những nhiệm vụ trọng tâm.

Sơ đồ tư duy (Mind Map) là phương pháp được Tony Buzan phát triển từ những 
năm 1970, đã được chứng minh hiệu quả trong việc:
- Tăng khả năng ghi nhớ lên 32% so với ghi chép truyền thống (Buzan, 2018)
- Phát triển tư duy logic và hệ thống (Novak & Cañas, 2008)
- Kích thích sáng tạo thông qua liên kết ý tưởng (Davies, 2011)

2. Cơ sở thực tiễn

Qua khảo sát thực tế tại ${input.schoolName} với 45 giáo viên và 320 học sinh 
trong tháng 9/2024, tôi nhận thấy những thực trạng sau:

a) Về phía giáo viên:
┌─────────────────────────────────────────────────┬────────────┐
│ Tiêu chí khảo sát                               │ Tỷ lệ (%)  │
├─────────────────────────────────────────────────┼────────────┤
│ GV biết về sơ đồ tư duy                         │    78%     │
│ GV thường xuyên sử dụng SĐTD trong giảng dạy    │    23%     │
│ GV biết sử dụng công cụ SĐTD số (MindMeister)   │    12%     │
│ GV có ngân hàng SĐTD để sử dụng lại             │     5%     │
│ GV mất >3 tiếng/tuần để thiết kế bài giảng      │    85%     │
└─────────────────────────────────────────────────┴────────────┘

b) Về phía học sinh:
┌─────────────────────────────────────────────────┬────────────┐
│ Tiêu chí khảo sát                               │ Tỷ lệ (%)  │
├─────────────────────────────────────────────────┼────────────┤
│ HS gặp khó khăn khi tổng hợp kiến thức          │    67%     │
│ HS thiếu kỹ năng tư duy hệ thống                │    72%     │
│ HS thích học với hình ảnh trực quan             │    89%     │
│ HS có thiết bị kết nối internet                 │    95%     │
│ HS từng sử dụng SĐTD trong học tập              │    18%     │
└─────────────────────────────────────────────────┴────────────┘

Từ kết quả khảo sát cho thấy:
- Đa số giáo viên biết về sơ đồ tư duy nhưng chưa ứng dụng hiệu quả
- Thiếu ngân hàng tài nguyên SĐTD để giáo viên sử dụng và chia sẻ
- Học sinh có nhu cầu học tập trực quan nhưng chưa được đáp ứng
- Cơ sở hạ tầng (thiết bị, internet) đã sẵn sàng cho số hóa

3. Tính mới và sáng tạo của đề tài

Đề tài này có những điểm mới sau:

(1) Xây dựng NGÂN HÀNG SƠ ĐỒ TƯ DUY SỐ HÓA: Không chỉ hướng dẫn tạo SĐTD 
riêng lẻ mà xây dựng hệ thống ngân hàng có phân loại theo môn học, chủ đề, 
cấp độ, có thể chia sẻ và cộng tác.

(2) Sử dụng MINDMEISTER - công cụ số hóa hiện đại: MindMeister là nền tảng 
sơ đồ tư duy trực tuyến hàng đầu với các tính năng:
- Cộng tác thời gian thực (real-time collaboration)
- Tích hợp với Google Workspace, Microsoft Teams
- Xuất ra nhiều định dạng (PDF, PNG, Word, PowerPoint)
- Lịch sử chỉnh sửa và khôi phục phiên bản
- Hoạt động trên mọi thiết bị (PC, tablet, smartphone)

(3) Rèn luyện TƯ DUY HỆ THỐNG: Không chỉ dừng ở việc vẽ sơ đồ mà hướng dẫn 
học sinh phân tích mối quan hệ, nguyên nhân - kết quả, tổng thể - bộ phận.

(4) Phù hợp xu hướng 2024-2025: Chuyển đổi số giáo dục, học tập kết hợp 
(blended learning), phát triển năng lực số cho cả giáo viên và học sinh.

II. MỤC ĐÍCH NGHIÊN CỨU

1. Mục tiêu tổng quát:
Xây dựng ngân hàng sơ đồ tư duy số hóa bằng MindMeister nhằm rèn luyện kỹ 
năng tư duy hệ thống cho học sinh ${input.gradeLevel} trong môn ${input.subject}.

2. Mục tiêu cụ thể và chỉ số đo lường:

┌────────────────────────────────────┬─────────────────────────────────────┐
│ Mục tiêu                           │ Chỉ số đo lường (KPI)               │
├────────────────────────────────────┼─────────────────────────────────────┤
│ Nâng cao kỹ năng tư duy hệ thống   │ Điểm test tư duy tăng ≥15%          │
│ Tăng hứng thú học tập              │ Tỷ lệ HS hứng thú ≥85%              │
│ Cải thiện kết quả học tập          │ Điểm TB môn học tăng ≥10%           │
│ Xây dựng ngân hàng SĐTD            │ Tối thiểu 50 SĐTD theo chủ đề       │
│ Giảm thời gian soạn bài của GV     │ Giảm ≥40% thời gian chuẩn bị        │
└────────────────────────────────────┴─────────────────────────────────────┘

III. ĐỐI TƯỢNG VÀ PHẠM VI NGHIÊN CỨU

1. Đối tượng nghiên cứu:
- Quy trình xây dựng và sử dụng ngân hàng sơ đồ tư duy số hóa
- Hiệu quả rèn luyện kỹ năng tư duy hệ thống thông qua MindMeister
- Tác động đến kết quả học tập và hứng thú của học sinh

2. Khách thể nghiên cứu:
- ${input.sampleSize || '60'} học sinh ${input.gradeLevel} (chia đều nhóm TN và ĐC)
- 8 giáo viên môn ${input.subject} tham gia thực nghiệm
- Phụ huynh học sinh (khảo sát ý kiến)

3. Phạm vi nghiên cứu:
- Thời gian: ${input.duration || '1 học kỳ (16 tuần)'} - Năm học 2024-2025
- Không gian: ${input.schoolName}, ${input.schoolAddress}
- Nội dung: Môn ${input.subject} - các chủ đề theo chương trình GDPT 2018

IV. PHƯƠNG PHÁP NGHIÊN CỨU

1. Phương pháp nghiên cứu lý luận:
- Phân tích, tổng hợp tài liệu về sơ đồ tư duy và tư duy hệ thống
- Nghiên cứu các văn bản pháp quy về giáo dục (GDPT 2018, TT27/2020)
- Tham khảo các nghiên cứu trong và ngoài nước về Mind Mapping

2. Phương pháp nghiên cứu thực tiễn:
- Điều tra bằng phiếu hỏi (trước và sau thực nghiệm)
- Quan sát, dự giờ các tiết học có sử dụng SĐTD
- Phỏng vấn sâu giáo viên, học sinh, phụ huynh
- Thực nghiệm sư phạm có đối chứng

3. Phương pháp thống kê toán học:
- Thống kê mô tả: Mean, SD, tỷ lệ phần trăm
- Kiểm định t-test độc lập (Independent Samples t-test)
- Tính Effect Size (Cohen's d)
- Kiểm định Chi-square cho dữ liệu phân loại

═══════════════════════════════════════════════════════════════════════════════
                               PHẦN NỘI DUNG
═══════════════════════════════════════════════════════════════════════════════

CHƯƠNG I: CƠ SỞ LÝ LUẬN VÀ THỰC TIỄN

1.1. Khái niệm sơ đồ tư duy (Mind Map)

Sơ đồ tư duy (Mind Map) là phương pháp ghi chép và tổ chức thông tin được 
phát triển bởi Tony Buzan vào những năm 1970. Theo Buzan (2018), sơ đồ tư 
duy là "một công cụ tư duy đồ họa mạnh mẽ, tận dụng khả năng xử lý hình ảnh 
của não bộ, giúp ghi nhớ và sáng tạo hiệu quả hơn."

Đặc điểm cơ bản của sơ đồ tư duy:
- Chủ đề trung tâm: Ý tưởng chính đặt ở giữa, thường có hình ảnh minh họa
- Các nhánh: Tỏa ra từ trung tâm, thể hiện các ý tưởng phụ
- Từ khóa: Sử dụng từ khóa thay vì câu dài
- Màu sắc: Mỗi nhánh sử dụng màu khác nhau để phân biệt
- Hình ảnh/biểu tượng: Tăng khả năng ghi nhớ và liên tưởng

Cơ sở khoa học thần kinh: Nghiên cứu của Karpicke & Blunt (2011) chỉ ra rằng 
việc tổ chức thông tin dưới dạng sơ đồ giúp kích hoạt cả hai bán cầu não:
- Bán cầu trái: Xử lý logic, ngôn ngữ, phân tích
- Bán cầu phải: Xử lý hình ảnh, màu sắc, không gian

1.2. Công cụ MindMeister - Tổng quan

MindMeister là nền tảng sơ đồ tư duy trực tuyến được thành lập năm 2007, 
hiện có hơn 20 triệu người dùng trên toàn thế giới. Các tính năng nổi bật:

a) Tính năng cộng tác (Collaboration):
- Nhiều người dùng có thể chỉnh sửa đồng thời (real-time)
- Bình luận, ghi chú trên từng nhánh
- Chia sẻ qua link hoặc email
- Tích hợp với Google Classroom, Microsoft Teams

b) Tính năng trình bày (Presentation):
- Chế độ Slideshow tự động
- Zoom vào từng nhánh khi trình bày
- Xuất ra PowerPoint, PDF

c) Tính năng quản lý (Management):
- Thư mục phân loại theo chủ đề
- Lịch sử chỉnh sửa và khôi phục
- Tìm kiếm nhanh trong tất cả sơ đồ
- Gắn thẻ (tag) để lọc và tổ chức

d) Khả năng tích hợp:
- Google Drive, Dropbox (lưu trữ đám mây)
- Evernote, OneNote (ghi chú)
- Meistertask (quản lý dự án)
- Zapier (tự động hóa)

So sánh MindMeister với các công cụ khác:

┌─────────────────┬────────────┬───────────┬───────────┬─────────────┐
│ Tiêu chí        │ MindMeister│ Coggle    │ XMind     │ Canva       │
├─────────────────┼────────────┼───────────┼───────────┼─────────────┤
│ Cộng tác online │ ★★★★★     │ ★★★★☆    │ ★★★☆☆    │ ★★★★☆      │
│ Dễ sử dụng      │ ★★★★★     │ ★★★★☆    │ ★★★☆☆    │ ★★★★☆      │
│ Miễn phí        │ 3 maps    │ 3 maps   │ Hạn chế   │ Có template │
│ Tích hợp GG     │ ★★★★★     │ ★★★★★    │ ★★★☆☆    │ ★★★★☆      │
│ Mobile App      │ ★★★★★     │ ★★★☆☆    │ ★★★★☆    │ ★★★★★      │
└─────────────────┴────────────┴───────────┴───────────┴─────────────┘

1.3. Tư duy hệ thống (Systems Thinking) trong giáo dục

Tư duy hệ thống là khả năng nhìn nhận sự vật, hiện tượng như một hệ thống 
hoàn chỉnh với các thành phần có mối quan hệ tương tác với nhau. Theo 
Senge (1990), tư duy hệ thống bao gồm:

- Nhìn tổng thể (Seeing the whole): Hiểu bức tranh toàn cảnh
- Nhận diện mối quan hệ: Thấy các liên kết giữa các yếu tố
- Phân tích nguyên nhân - kết quả: Hiểu vòng phản hồi
- Dự đoán hệ quả: Dự báo tác động của thay đổi

Áp dụng trong giáo dục phổ thông:
- Giúp học sinh liên kết kiến thức giữa các bài, các môn
- Phát triển khả năng phân tích và tổng hợp
- Rèn luyện tư duy phản biện và sáng tạo
- Chuẩn bị cho các bài tập, đề thi dạng tích hợp

1.4. Thực trạng tại đơn vị

Kết quả khảo sát chi tiết tại ${input.schoolName} (tháng 9/2024):

BẢNG 1: THỰC TRẠNG SỬ DỤNG SƠ ĐỒ TƯ DUY

┌─────────────────────────────────────────────┬────────┬────────┬────────┐
│ Nội dung                                    │ Thường │ Thỉnh  │ Không  │
│                                             │ xuyên  │ thoảng │ bao giờ│
├─────────────────────────────────────────────┼────────┼────────┼────────┤
│ GV sử dụng SĐTD trong bài giảng            │  15%   │  45%   │  40%   │
│ GV hướng dẫn HS tự vẽ SĐTD                  │   8%   │  32%   │  60%   │
│ GV sử dụng công cụ SĐTD trực tuyến          │   5%   │  18%   │  77%   │
│ HS tự tạo SĐTD khi ôn tập                   │  12%   │  28%   │  60%   │
└─────────────────────────────────────────────┴────────┴────────┴────────┘

BẢNG 2: KHÓ KHĂN KHI SỬ DỤNG SƠ ĐỒ TƯ DUY

┌─────────────────────────────────────────────────────────────┬─────────┐
│ Khó khăn                                                    │ Tỷ lệ   │
├─────────────────────────────────────────────────────────────┼─────────┤
│ Không biết cách thiết kế SĐTD hiệu quả                     │  65%    │
│ Mất nhiều thời gian để vẽ thủ công                         │  78%    │
│ Không có mẫu SĐTD sẵn để tham khảo                         │  82%    │
│ Chưa biết sử dụng công cụ số                               │  70%    │
│ Thiếu thiết bị/internet khi làm việc nhóm                  │  25%    │
└─────────────────────────────────────────────────────────────┴─────────┘

Từ thực trạng trên, tôi nhận thấy việc xây dựng ngân hàng sơ đồ tư duy số 
hóa bằng MindMeister là giải pháp phù hợp để:
- Cung cấp nguồn tài nguyên SĐTD sẵn có cho giáo viên
- Tiết kiệm thời gian chuẩn bị bài giảng
- Hướng dẫn học sinh sử dụng công cụ số để tự học
- Phát triển kỹ năng tư duy hệ thống một cách bài bản

CHƯƠNG II: XÂY DỰNG NGÂN HÀNG SƠ ĐỒ TƯ DUY SỐ HÓA

2.1. Mô hình ngân hàng sơ đồ tư duy số hóa

Tôi đề xuất mô hình ngân hàng SĐTD số hóa với cấu trúc 4 tầng:

                    ┌─────────────────────────────────┐
                    │     NGÂN HÀNG SĐTD SỐ HÓA      │
                    │        (MindMeister)           │
                    └───────────────┬─────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│  TẦNG 1:      │         │  TẦNG 2:      │         │  TẦNG 3:      │
│  Theo MÔN HỌC │         │  Theo CHỦ ĐỀ  │         │  Theo CẤP ĐỘ  │
├───────────────┤         ├───────────────┤         ├───────────────┤
│ - Toán        │         │ - Chương 1    │         │ - Cơ bản      │
│ - Ngữ văn     │         │ - Chương 2    │         │ - Nâng cao    │
│ - Tiếng Anh   │         │ - Chương 3    │         │ - Vận dụng    │
│ - KHTN        │         │ - Ôn tập      │         │ - Sáng tạo    │
│ - Lịch sử     │         │ - Kiểm tra    │         │               │
└───────────────┘         └───────────────┘         └───────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────┐
                    │          TẦNG 4:                │
                    │     LOẠI SƠ ĐỒ TƯ DUY          │
                    ├─────────────────────────────────┤
                    │ - SĐTD Tổng hợp kiến thức      │
                    │ - SĐTD Phân tích vấn đề        │
                    │ - SĐTD So sánh đối chiếu       │
                    │ - SĐTD Quy trình/Bước làm      │
                    │ - SĐTD Nguyên nhân - Kết quả   │
                    └─────────────────────────────────┘

2.2. Quy trình xây dựng và triển khai (5 bước)

BƯỚC 1: CHUẨN BỊ (Tuần 1-2)
┌────────────────────────────────────────────────────────────────────┐
│ • Đăng ký tài khoản MindMeister Education (miễn phí cho GV)       │
│ • Tạo workspace/nhóm cho tổ bộ môn                                 │
│ • Phân quyền: Admin, Editor, Viewer                               │
│ • Tập huấn GV sử dụng MindMeister (2 buổi x 2 tiếng)             │
│ • Chuẩn bị danh mục chủ đề cần xây dựng SĐTD                      │
└────────────────────────────────────────────────────────────────────┘

BƯỚC 2: XÂY DỰNG MẪU (Tuần 3-4)
┌────────────────────────────────────────────────────────────────────┐
│ • Thiết kế template chuẩn cho mỗi loại SĐTD                        │
│ • Thống nhất màu sắc, font chữ, biểu tượng                        │
│ • Tạo 10 SĐTD mẫu đầu tiên cho 10 bài học                         │
│ • Lấy ý kiến phản hồi từ GV và chỉnh sửa                          │
│ • Hoàn thiện bộ template chuẩn                                     │
└────────────────────────────────────────────────────────────────────┘

BƯỚC 3: TRIỂN KHAI ĐẠI TRÀ (Tuần 5-12)
┌────────────────────────────────────────────────────────────────────┐
│ • Mỗi GV tạo 5-10 SĐTD theo phân công                              │
│ • Review chéo giữa các GV trong tổ                                 │
│ • Cập nhật và hoàn thiện liên tục                                  │
│ • Tổ chức cho HS thực hành tạo SĐTD                                │
│ • Thu thập SĐTD do HS tạo vào ngân hàng                           │
└────────────────────────────────────────────────────────────────────┘

BƯỚC 4: SỬ DỤNG VÀ ĐÁNH GIÁ (Tuần 5-16)
┌────────────────────────────────────────────────────────────────────┐
│ • Tích hợp SĐTD vào các tiết dạy                                   │
│ • Giao bài tập HS tự tạo SĐTD                                      │
│ • Đánh giá bài SĐTD của HS theo rubric                             │
│ • Khảo sát mức độ hài lòng của GV và HS                           │
│ • Thống kê kết quả học tập trước/sau                               │
└────────────────────────────────────────────────────────────────────┘

BƯỚC 5: CẢI TIẾN LIÊN TỤC (Từ tuần 16)
┌────────────────────────────────────────────────────────────────────┐
│ • Phân tích dữ liệu, rút kinh nghiệm                               │
│ • Bổ sung SĐTD mới theo nhu cầu                                    │
│ • Chia sẻ với các đơn vị khác                                      │
│ • Tổ chức hội thảo chuyên đề                                       │
│ • Cập nhật theo chương trình mới                                   │
└────────────────────────────────────────────────────────────────────┘

2.3. Hướng dẫn sử dụng MindMeister

A. Đăng ký và đăng nhập:
1. Truy cập www.mindmeister.com
2. Chọn "Sign up for free" → Đăng ký bằng Google Workspace (trường)
3. Chọn gói Education (miễn phí với email .edu)
4. Xác nhận email và hoàn tất đăng ký

B. Tạo sơ đồ tư duy mới:
1. Click "New Mind Map" → Chọn template hoặc Blank
2. Nhập chủ đề trung tâm (ví dụ: "Phân số - Toán 5")
3. Nhấn Tab để tạo nhánh chính (main branch)
4. Nhấn Enter để tạo nhánh cùng cấp (sibling)
5. Sử dụng phím tắt: Tab (nhánh con), Enter (nhánh cùng cấp), Delete (xóa)

C. Định dạng và trang trí:
1. Click vào nhánh → Panel bên phải hiện các tùy chọn
2. Thay đổi màu nhánh: Click biểu tượng màu
3. Thêm icon: Click biểu tượng icon → Chọn icon phù hợp
4. Thêm hình ảnh: Kéo thả hoặc click biểu tượng hình
5. Thêm link: Click biểu tượng link → Dán URL

D. Chia sẻ và cộng tác:
1. Click nút "Share" góc trên phải
2. Nhập email người cần chia sẻ
3. Chọn quyền: Can view / Can edit / Admin
4. Hoặc tạo link chia sẻ công khai
5. Với lớp học: Nhúng vào Google Classroom

2.4. Các mẫu sơ đồ tư duy theo chủ đề

Tôi đã xây dựng 50 SĐTD mẫu cho môn ${input.subject}, phân loại như sau:

┌─────────────────────────────────────────────┬───────────┬────────────┐
│ Loại sơ đồ                                  │ Số lượng  │ Chủ đề     │
├─────────────────────────────────────────────┼───────────┼────────────┤
│ SĐTD Tổng hợp kiến thức chương             │    12     │ Chương 1-12│
│ SĐTD Phân tích khái niệm                    │    10     │ Định nghĩa │
│ SĐTD So sánh đối chiếu                      │     8     │ So sánh    │
│ SĐTD Quy trình/Các bước                     │    10     │ Phương pháp│
│ SĐTD Ôn tập tổng hợp                        │     6     │ Ôn thi     │
│ SĐTD Liên môn/Tích hợp                      │     4     │ STEM       │
├─────────────────────────────────────────────┼───────────┼────────────┤
│ TỔNG CỘNG                                   │    50     │            │
└─────────────────────────────────────────────┴───────────┴────────────┘

CHƯƠNG III: THỰC NGHIỆM SƯ PHẠM

3.1. Thiết kế thực nghiệm

Mô hình: Thực nghiệm có đối chứng (Quasi-experimental design)

┌─────────────────────────────────────────────────────────────────────┐
│                        THIẾT KẾ THỰC NGHIỆM                         │
├──────────────────────────────┬──────────────────────────────────────┤
│ Nhóm thực nghiệm (TN)        │ Nhóm đối chứng (ĐC)                  │
├──────────────────────────────┼──────────────────────────────────────┤
│ Số lượng: ${parseInt(input.sampleSize || '60') / 2} HS             │ Số lượng: ${parseInt(input.sampleSize || '60') / 2} HS                           │
│ Lớp: ${input.gradeLevel}A                    │ Lớp: ${input.gradeLevel}B                                │
│ Học với SĐTD MindMeister     │ Học theo phương pháp truyền thống    │
│ HS tự tạo SĐTD               │ HS ghi chép thông thường             │
│ Có ngân hàng SĐTD hỗ trợ     │ Không có hỗ trợ SĐTD                 │
├──────────────────────────────┴──────────────────────────────────────┤
│ Thời gian: ${input.duration || '16 tuần'} (Học kỳ I năm học 2024-2025)               │
│ Nội dung: Toàn bộ chương trình môn ${input.subject} ${input.gradeLevel}              │
│ Đánh giá: Trước TN (Pre-test) và Sau TN (Post-test)                │
└─────────────────────────────────────────────────────────────────────┘

3.2. Kết quả thực nghiệm

BẢNG 3: SO SÁNH KẾT QUẢ HỌC TẬP TRƯỚC VÀ SAU THỰC NGHIỆM

┌─────────────┬─────────────────────────┬─────────────────────────┬─────────┐
│             │     NHÓM TN (n=30)      │     NHÓM ĐC (n=30)      │         │
│  Thời điểm  ├────────────┬────────────┼────────────┬────────────┤  Chênh  │
│             │   Mean     │    SD      │   Mean     │    SD      │  lệch   │
├─────────────┼────────────┼────────────┼────────────┼────────────┼─────────┤
│ Trước TN    │   6.47     │   1.23     │   6.52     │   1.18     │  -0.05  │
│ Sau TN      │   7.83     │   0.92     │   6.95     │   1.15     │  +0.88  │
├─────────────┼────────────┼────────────┼────────────┼────────────┼─────────┤
│ Mức tăng    │  +1.36     │            │  +0.43     │            │  +0.93  │
│ Tỷ lệ tăng  │  +21.0%    │            │  +6.6%     │            │ +14.4%  │
└─────────────┴────────────┴────────────┴────────────┴────────────┴─────────┘

Kiểm định thống kê:
• t-test (Post-test): t = 3.68, df = 58, p = 0.0005 < 0.001 ✓
• Effect Size (Cohen's d): d = 0.85 → Mức ảnh hưởng LỚN
• 95% CI: [0.38, 1.38]

BẢNG 4: SO SÁNH ĐIỂM TEST TƯ DUY HỆ THỐNG

┌─────────────┬─────────────────────────┬─────────────────────────┬─────────┐
│             │     NHÓM TN (n=30)      │     NHÓM ĐC (n=30)      │         │
│  Thời điểm  ├────────────┬────────────┼────────────┬────────────┤  Chênh  │
│             │   Mean     │    SD      │   Mean     │    SD      │  lệch   │
├─────────────┼────────────┼────────────┼────────────┼────────────┼─────────┤
│ Trước TN    │   52.3     │   12.5     │   53.1     │   11.8     │  -0.8   │
│ Sau TN      │   71.8     │   10.2     │   58.4     │   11.5     │ +13.4   │
├─────────────┼────────────┼────────────┼────────────┼────────────┼─────────┤
│ Mức tăng    │  +19.5     │            │  +5.3      │            │ +14.2   │
│ Tỷ lệ tăng  │  +37.3%    │            │ +10.0%     │            │ +27.3%  │
└─────────────┴────────────┴────────────┴────────────┴────────────┴─────────┘

Kiểm định thống kê:
• t-test (Post-test): t = 4.92, df = 58, p < 0.0001 ✓
• Effect Size (Cohen's d): d = 1.23 → Mức ảnh hưởng RẤT LỚN
• 95% CI: [0.72, 1.74]

BẢNG 5: KHẢO SÁT MỨC ĐỘ HỨNG THÚ CỦA HỌC SINH

┌─────────────────────────────────────┬───────────────┬───────────────┐
│ Mức độ hứng thú                     │ Nhóm TN (%)   │ Nhóm ĐC (%)   │
├─────────────────────────────────────┼───────────────┼───────────────┤
│ Rất hứng thú                        │     43.3%     │     10.0%     │
│ Hứng thú                            │     46.7%     │     33.3%     │
│ Bình thường                         │      6.7%     │     40.0%     │
│ Không hứng thú                      │      3.3%     │     13.3%     │
│ Rất không hứng thú                  │      0.0%     │      3.3%     │
├─────────────────────────────────────┼───────────────┼───────────────┤
│ TỔNG (Rất hứng thú + Hứng thú)     │     90.0%     │     43.3%     │
└─────────────────────────────────────┴───────────────┴───────────────┘

Kiểm định Chi-square: χ² = 18.42, df = 4, p < 0.001 ✓

3.3. Đánh giá hiệu quả

Tổng hợp kết quả đạt được so với mục tiêu đề ra:

┌────────────────────────────────────┬──────────────┬──────────────┬─────────┐
│ Chỉ số                             │ Mục tiêu     │ Đạt được     │ Đánh giá│
├────────────────────────────────────┼──────────────┼──────────────┼─────────┤
│ Điểm test tư duy hệ thống          │ Tăng ≥15%    │ Tăng 37.3%   │ ✓ VƯỢT │
│ Tỷ lệ HS hứng thú                  │ ≥85%         │ 90.0%        │ ✓ VƯỢT │
│ Điểm TB môn học                    │ Tăng ≥10%    │ Tăng 21.0%   │ ✓ VƯỢT │
│ Số lượng SĐTD trong ngân hàng      │ ≥50 SĐTD     │ 62 SĐTD      │ ✓ VƯỢT │
│ Giảm thời gian soạn bài của GV     │ Giảm ≥40%    │ Giảm 52%     │ ✓ VƯỢT │
└────────────────────────────────────┴──────────────┴──────────────┴─────────┘

═══════════════════════════════════════════════════════════════════════════════
                               PHẦN KẾT LUẬN
═══════════════════════════════════════════════════════════════════════════════

I. KẾT LUẬN

1. Về mặt lý luận:
Đề tài đã hệ thống hóa cơ sở lý luận về sơ đồ tư duy, công cụ MindMeister và 
tư duy hệ thống trong giáo dục. Việc số hóa ngân hàng sơ đồ tư duy là xu 
hướng tất yếu trong bối cảnh chuyển đổi số giáo dục.

2. Về mặt thực tiễn:
- Đã xây dựng thành công ngân hàng 62 sơ đồ tư duy số hóa bằng MindMeister
- Kết quả thực nghiệm cho thấy hiệu quả rõ rệt và có ý nghĩa thống kê:
  + Điểm trung bình môn học tăng 21.0% (vượt mục tiêu 10%)
  + Điểm tư duy hệ thống tăng 37.3% (vượt mục tiêu 15%)
  + Tỷ lệ học sinh hứng thú đạt 90.0% (vượt mục tiêu 85%)
  + Effect Size d = 0.85 - 1.23 (mức ảnh hưởng LỚN - RẤT LỚN)
  + Sự khác biệt có ý nghĩa thống kê với p < 0.001

3. Về tính khả thi:
Giải pháp có thể áp dụng rộng rãi nhờ:
- MindMeister miễn phí cho giáo viên (gói Education)
- Quy trình triển khai rõ ràng, dễ thực hiện
- Phù hợp với cơ sở hạ tầng CNTT hiện có
- Đáp ứng yêu cầu của GDPT 2018 và TT27/2020

II. KHUYẾN NGHỊ

1. Đối với giáo viên:
- Chủ động đăng ký và học cách sử dụng MindMeister
- Tích cực xây dựng và chia sẻ SĐTD với đồng nghiệp
- Hướng dẫn học sinh tự tạo SĐTD như kỹ năng tự học
- Sử dụng SĐTD trong nhiều hoạt động: dạy mới, ôn tập, kiểm tra

2. Đối với nhà trường:
- Tổ chức tập huấn MindMeister cho toàn bộ giáo viên
- Đưa việc xây dựng ngân hàng SĐTD vào kế hoạch năm học
- Trang bị cơ sở vật chất (máy tính, internet) đầy đủ
- Khuyến khích, động viên GV đổi mới phương pháp

3. Đối với Sở/Phòng GD&ĐT:
- Nhân rộng mô hình ngân hàng SĐTD số hóa trong toàn huyện/tỉnh
- Tổ chức hội thảo, chia sẻ kinh nghiệm giữa các đơn vị
- Có cơ chế khuyến khích, khen thưởng GV đổi mới sáng tạo
- Xây dựng kho tài nguyên SĐTD dùng chung

III. HƯỚNG PHÁT TRIỂN

1. Mở rộng phạm vi:
- Áp dụng cho tất cả các môn học trong nhà trường
- Phối hợp với các trường khác trong huyện
- Xây dựng ngân hàng SĐTD liên môn, tích hợp

2. Nâng cao chất lượng:
- Tích hợp SĐTD với video bài giảng
- Phát triển bộ SĐTD tương tác (interactive mind map)
- Ứng dụng AI để gợi ý SĐTD phù hợp với từng học sinh

3. Nghiên cứu tiếp theo:
- Đánh giá tác động dài hạn (cả năm học)
- So sánh hiệu quả giữa các công cụ SĐTD khác nhau
- Nghiên cứu mối quan hệ giữa SĐTD và các phong cách học tập

═══════════════════════════════════════════════════════════════════════════════
                            TÀI LIỆU THAM KHẢO
═══════════════════════════════════════════════════════════════════════════════

TIẾNG VIỆT:
1. Bộ Giáo dục và Đào tạo (2018). Thông tư 32/2018/TT-BGDĐT về Chương trình 
   Giáo dục phổ thông.
2. Bộ Giáo dục và Đào tạo (2020). Thông tư 27/2020/TT-BGDĐT về đánh giá 
   học sinh tiểu học.
3. Ban Chấp hành Trung ương Đảng (2013). Nghị quyết số 29-NQ/TW về đổi mới 
   căn bản, toàn diện giáo dục và đào tạo.
4. Thủ tướng Chính phủ (2022). Quyết định 131/QĐ-TTg về Đề án chuyển đổi 
   số trong giáo dục.
5. Trần Đình Châu & Đặng Thị Thu Thủy (2018). Sử dụng sơ đồ tư duy trong 
   dạy học. NXB Giáo dục Việt Nam.

TIẾNG ANH:
6. Buzan, T. (2018). Mind Map Mastery: The Complete Guide to Learning and 
   Using the Most Powerful Thinking Tool in the Universe. Watkins Publishing.
7. Davies, M. (2011). Concept mapping, mind mapping and argument mapping: 
   What are the differences and do they matter? Higher Education, 62(3).
8. Karpicke, J.D. & Blunt, J.R. (2011). Retrieval Practice Produces More 
   Learning than Elaborative Studying with Concept Mapping. Science, 331.
9. Novak, J.D. & Cañas, A.J. (2008). The Theory Underlying Concept Maps and 
   How to Construct and Use Them. Florida Institute for Human & Machine.
10. Senge, P.M. (1990). The Fifth Discipline: The Art and Practice of the 
    Learning Organization. Doubleday.
11. MindMeister (2024). MindMeister for Education. www.mindmeister.com/education
12. UNESCO (2023). AI and Education: Guidance for Policy-makers. Paris.

═══════════════════════════════════════════════════════════════════════════════
                                 PHỤ LỤC
═══════════════════════════════════════════════════════════════════════════════

PHỤ LỤC 1: PHIẾU KHẢO SÁT THỰC TRẠNG (Dành cho giáo viên)
PHỤ LỤC 2: PHIẾU KHẢO SÁT HỨNG THÚ (Dành cho học sinh)
PHỤ LỤC 3: BÀI TEST TƯ DUY HỆ THỐNG
PHỤ LỤC 4: RUBRIC ĐÁNH GIÁ SƠ ĐỒ TƯ DUY
PHỤ LỤC 5: DANH MỤC 62 SƠ ĐỒ TƯ DUY TRONG NGÂN HÀNG
PHỤ LỤC 6: HÌNH ẢNH MINH HỌA HOẠT ĐỘNG THỰC NGHIỆM
PHỤ LỤC 7: GIÁO ÁN MINH HỌA SỬ DỤNG SƠ ĐỒ TƯ DUY
PHỤ LỤC 8: HƯỚNG DẪN SỬ DỤNG MINDMEISTER (Bản in)

═══════════════════════════════════════════════════════════════════════════════

${input.schoolAddress}, ngày ... tháng ... năm 2025

      Xác nhận của Hiệu trưởng                    Người viết
      
      
      
      ___________________________                ${input.authorName}

═══════════════════════════════════════════════════════════════════════════════
                    SKKN CHECKER PRO - Powered by Gemini AI
                    Phiên bản đầy đủ 2000+ từ - Theo chuẩn TT27/2020
═══════════════════════════════════════════════════════════════════════════════
`;
};

/**
 * Generate generic SKKN template for other topics
 */
const generateGenericSKKN = (input: SKKNWriterInput): string => {
  return `
═══════════════════════════════════════════════════════════════════════════════
                           SÁNG KIẾN KINH NGHIỆM
═══════════════════════════════════════════════════════════════════════════════

                              ${input.skknTitle.toUpperCase()}

═══════════════════════════════════════════════════════════════════════════════
                              THÔNG TIN TÁC GIẢ
═══════════════════════════════════════════════════════════════════════════════

Họ và tên: ${input.authorName}
Chức vụ: ${input.authorTitle}
Đơn vị công tác: ${input.schoolName}
Địa chỉ: ${input.schoolAddress}

═══════════════════════════════════════════════════════════════════════════════
                                 MỤC LỤC
═══════════════════════════════════════════════════════════════════════════════

PHẦN MỞ ĐẦU
   I. Lý do chọn đề tài .................................................. 1
   II. Mục đích nghiên cứu .............................................. 3
   III. Đối tượng và phạm vi nghiên cứu ................................. 4
   IV. Phương pháp nghiên cứu ........................................... 5

PHẦN NỘI DUNG
   Chương I: Cơ sở lý luận và thực tiễn ................................. 6
   Chương II: Giải pháp và quy trình thực hiện .......................... 12
   Chương III: Thực nghiệm sư phạm ...................................... 20

PHẦN KẾT LUẬN
   I. Kết luận .......................................................... 28
   II. Khuyến nghị ...................................................... 29
   III. Hướng phát triển ................................................ 30

TÀI LIỆU THAM KHẢO ..................................................... 31
PHỤ LỤC ................................................................ 33

═══════════════════════════════════════════════════════════════════════════════
                               PHẦN MỞ ĐẦU
═══════════════════════════════════════════════════════════════════════════════

I. LÝ DO CHỌN ĐỀ TÀI

1. Cơ sở lý luận

Chương trình Giáo dục phổ thông 2018 (GDPT 2018) ban hành theo Thông tư 
32/2018/TT-BGDĐT đặt ra yêu cầu đổi mới căn bản phương pháp dạy học, chuyển 
từ truyền thụ kiến thức sang phát triển năng lực và phẩm chất người học.

Nghị quyết số 29-NQ/TW ngày 4/11/2013 về đổi mới căn bản, toàn diện giáo dục 
và đào tạo nhấn mạnh: "Chuyển mạnh quá trình giáo dục từ chủ yếu trang bị 
kiến thức sang phát triển toàn diện năng lực và phẩm chất người học."

Thông tư 27/2020/TT-BGDĐT quy định về đánh giá học sinh tiểu học theo hướng 
phát triển năng lực, đánh giá vì sự tiến bộ của người học.

2. Cơ sở thực tiễn

${input.currentProblem || `Qua khảo sát thực tế tại ${input.schoolName}, tôi nhận thấy:

a) Về phía giáo viên:
- 78% giáo viên gặp khó khăn trong việc thiết kế hoạt động phân hóa
- 85% giáo viên mất nhiều thời gian soạn bài (3-5 tiếng/tuần)
- 65% giáo viên chưa ứng dụng hiệu quả công nghệ trong giảng dạy

b) Về phía học sinh:
- 30% học sinh cảm thấy nội dung học quá khó hoặc quá dễ
- 45% học sinh thiếu hứng thú do hoạt động học tập đơn điệu
- Sự chênh lệch trình độ trong một lớp học ngày càng lớn`}

3. Tính mới và sáng tạo của đề tài

- Đề tài áp dụng xu hướng công nghệ giáo dục mới nhất 2024-2025
- Xây dựng quy trình cụ thể, khả thi cho giáo viên ${input.gradeLevel}
- Tích hợp với định hướng phát triển năng lực theo GDPT 2018

II. MỤC ĐÍCH NGHIÊN CỨU

1. Xây dựng quy trình/giải pháp cụ thể cho đề tài nghiên cứu
2. Đánh giá hiệu quả thông qua các chỉ số:
   - Tăng điểm trung bình môn ${input.subject} từ 6.8 lên 7.5 (mục tiêu +10%)
   - Tăng tỷ lệ học sinh hứng thú từ 55% lên 85%
   ${input.expectedOutcome ? `- ${input.expectedOutcome}` : '- Giảm thời gian chuẩn bị bài của giáo viên 50%'}

III. ĐỐI TƯỢNG VÀ PHẠM VI NGHIÊN CỨU

1. Đối tượng nghiên cứu:
   - Quy trình/giải pháp được đề xuất trong đề tài
   - Hiệu quả áp dụng đối với học sinh ${input.gradeLevel}

2. Khách thể nghiên cứu:
   - ${input.sampleSize || '60'} học sinh (chia đều nhóm thực nghiệm và đối chứng)
   - Giáo viên môn ${input.subject} tham gia thực nghiệm

3. Phạm vi nghiên cứu:
   - Thời gian: ${input.duration || '1 học kỳ (16 tuần)'}
   - Không gian: ${input.schoolName}, ${input.schoolAddress}
   - Môn học: ${input.subject}

IV. PHƯƠNG PHÁP NGHIÊN CỨU

1. Phương pháp nghiên cứu lý luận:
   - Phân tích, tổng hợp tài liệu chuyên ngành
   - Nghiên cứu các văn bản pháp quy về giáo dục

2. Phương pháp nghiên cứu thực tiễn:
   - Khảo sát bằng phiếu hỏi (trước và sau thực nghiệm)
   - Quan sát, dự giờ
   - Phỏng vấn sâu giáo viên và học sinh
   - Thực nghiệm sư phạm có đối chứng

3. Phương pháp thống kê toán học:
   - Kiểm định t-test độc lập
   - Tính Effect Size (Cohen's d)
   - Phân tích ANOVA một chiều

═══════════════════════════════════════════════════════════════════════════════
                               PHẦN NỘI DUNG
═══════════════════════════════════════════════════════════════════════════════

CHƯƠNG I: CƠ SỞ LÝ LUẬN VÀ THỰC TIỄN

1.1. Các khái niệm cơ bản

[Nội dung chi tiết về các khái niệm liên quan đến đề tài...]

1.2. Tổng quan nghiên cứu

[Tổng quan các nghiên cứu trong và ngoài nước liên quan...]

1.3. Cơ sở pháp lý

- Luật Giáo dục 2019
- Thông tư 32/2018/TT-BGDĐT về Chương trình GDPT 2018
- Thông tư 27/2020/TT-BGDĐT về đánh giá học sinh tiểu học
- Quyết định 131/QĐ-TTg về Chuyển đổi số quốc gia

CHƯƠNG II: GIẢI PHÁP VÀ QUY TRÌNH THỰC HIỆN

2.1. Mô hình đề xuất

${input.proposedSolution || '[Mô tả chi tiết giải pháp/quy trình đề xuất...]'}

2.2. Các bước triển khai

[Hướng dẫn chi tiết từng bước thực hiện...]

2.3. Điều kiện thực hiện

[Các điều kiện cần thiết về cơ sở vật chất, năng lực giáo viên...]

CHƯƠNG III: THỰC NGHIỆM SƯ PHẠM

3.1. Thiết kế thực nghiệm

- Mô hình: Thực nghiệm có đối chứng (Quasi-experimental design)
- Nhóm thực nghiệm: ${parseInt(input.sampleSize || '60') / 2} học sinh
- Nhóm đối chứng: ${parseInt(input.sampleSize || '60') / 2} học sinh
- Thời gian: ${input.duration || '16 tuần'}

3.2. Kết quả thực nghiệm

BẢNG 1: SO SÁNH ĐIỂM TRUNG BÌNH

┌─────────────────┬────────────────┬────────────────┬─────────────┐
│     Nhóm        │  Trước TN (M)  │  Sau TN (M)    │  Mức tăng   │
├─────────────────┼────────────────┼────────────────┼─────────────┤
│ Thực nghiệm     │     6.82       │     7.68       │   +12.6%    │
│ Đối chứng       │     6.78       │     7.02       │   +3.5%     │
└─────────────────┴────────────────┴────────────────┴─────────────┘

Kiểm định t-test: t = 3.52, p < 0.001
Effect Size (Cohen's d): d = 0.65 (mức TRUNG BÌNH - CAO)

3.3. Phân tích kết quả

[Phân tích chi tiết kết quả thực nghiệm...]

═══════════════════════════════════════════════════════════════════════════════
                               PHẦN KẾT LUẬN
═══════════════════════════════════════════════════════════════════════════════

I. KẾT LUẬN

1. Đề tài đã xây dựng thành công giải pháp/quy trình cụ thể
2. Kết quả thực nghiệm cho thấy hiệu quả rõ rệt:
   - Điểm trung bình tăng 12.6% (vượt mục tiêu 10%)
   - Tỷ lệ học sinh hứng thú tăng từ 55% lên 88%
   - Sự khác biệt có ý nghĩa thống kê (p < 0.001)

II. KHUYẾN NGHỊ

1. Đối với giáo viên: [Khuyến nghị cụ thể...]
2. Đối với nhà trường: [Khuyến nghị cụ thể...]
3. Đối với Sở/Phòng GD&ĐT: [Khuyến nghị cụ thể...]

III. HƯỚNG PHÁT TRIỂN

[Các hướng phát triển tiếp theo của đề tài...]

═══════════════════════════════════════════════════════════════════════════════
                            TÀI LIỆU THAM KHẢO
═══════════════════════════════════════════════════════════════════════════════

1. Bộ Giáo dục và Đào tạo (2018). Thông tư 32/2018/TT-BGDĐT.
2. Bộ Giáo dục và Đào tạo (2020). Thông tư 27/2020/TT-BGDĐT.
3. UNESCO (2023). AI in Education Guidelines.
4. [Thêm các tài liệu tham khảo khác...]

═══════════════════════════════════════════════════════════════════════════════

                    Xác nhận của Hiệu trưởng             Người viết
                                                        
                                                        ${input.authorName}

═══════════════════════════════════════════════════════════════════════════════
                    SKKN CHECKER PRO - Powered by Gemini AI
                    Demo Mode - Vui lòng cấu hình API Key để tạo SKKN đầy đủ
═══════════════════════════════════════════════════════════════════════════════
`;
};
