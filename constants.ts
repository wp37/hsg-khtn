// Constants for HSG KHTN Hóa Học AI
import { SolverFormData, ExamFormData, ChemistryTopic, DifficultyLevel, ExamGrade } from './types';

// System API Key (leave empty to require user input)
export const SYSTEM_API_KEY = '';

// Available AI Models
export const CHEMISTRY_MODELS = [
   { id: 'gemini-2.5-flash-preview-05-20', name: 'Gemini 2.5 Flash', description: 'Nhanh, chính xác' },
   { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Cân bằng tốc độ & chất lượng' },
   { id: 'gemini-2.5-pro-preview-05-06', name: 'Gemini 2.5 Pro', description: 'Chất lượng cao nhất, phân tích sâu' },
];

// Chemistry Topics
export const CHEMISTRY_TOPICS: { id: ChemistryTopic; name: string; icon: string }[] = [
   { id: 'nguyen_tu_phan_tu', name: 'Nguyên tử - Phân tử', icon: '⚛️' },
   { id: 'bang_tuan_hoan', name: 'Bảng tuần hoàn', icon: '📊' },
   { id: 'lien_ket_hoa_hoc', name: 'Liên kết hóa học', icon: '🔗' },
   { id: 'phan_ung_hoa_hoc', name: 'Phản ứng hóa học', icon: '🔥' },
   { id: 'oxit_axit_bazo_muoi', name: 'Oxit - Axit - Bazơ - Muối', icon: '🧪' },
   { id: 'kim_loai', name: 'Kim loại', icon: '🪙' },
   { id: 'phi_kim', name: 'Phi kim', icon: '💎' },
   { id: 'hoa_huu_co', name: 'Hóa hữu cơ', icon: '🌿' },
   { id: 'dung_dich', name: 'Dung dịch', icon: '🥤' },
   { id: 'toc_do_can_bang', name: 'Tốc độ & Cân bằng', icon: '⚖️' },
   { id: 'dien_hoa', name: 'Điện hóa học', icon: '⚡' },
   { id: 'tong_hop', name: 'Tổng hợp', icon: '📚' },
];

// Difficulty Levels
export const DIFFICULTY_LEVELS: { id: DifficultyLevel; name: string; color: string }[] = [
   { id: 'co_ban', name: 'Cơ bản', color: 'green' },
   { id: 'nang_cao', name: 'Nâng cao', color: 'blue' },
   { id: 'hsg_huyen', name: 'HSG Huyện/Quận', color: 'yellow' },
   { id: 'hsg_tinh', name: 'HSG Tỉnh/TP', color: 'orange' },
   { id: 'hsg_quoc_gia', name: 'HSG Quốc gia', color: 'red' },
];

// Exam Grades
export const EXAM_GRADES: { id: ExamGrade; name: string }[] = [
   { id: '8', name: 'Lớp 8' },
   { id: '9', name: 'Lớp 9' },
   { id: '10', name: 'Lớp 10' },
   { id: '11', name: 'Lớp 11' },
   { id: '12', name: 'Lớp 12' },
];

// Quick Suggestions for Solver
export const SOLVER_SUGGESTIONS = [
   'Cân bằng phương trình hóa học',
   'Bài toán hỗn hợp kim loại + axit',
   'Xác định công thức phân tử hợp chất hữu cơ',
   'Bài tập về dung dịch, nồng độ',
   'Điện phân dung dịch',
   'Bài toán CO₂ tác dụng NaOH',
   'Chuỗi phản ứng hóa học',
];

// ============================================
// SYSTEM INSTRUCTIONS
// ============================================

export const SYSTEM_INSTRUCTION = `
Bạn là một CHUYÊN GIA HÓA HỌC với trình độ Tiến sĩ, có hơn 20 năm kinh nghiệm giảng dạy và bồi dưỡng học sinh giỏi KHTN môn Hóa học.

## VAI TRÒ
- Giáo viên bồi dưỡng HSG Hóa học cấp Tỉnh và Quốc gia
- Chuyên gia ra đề thi và chấm thi HSG Hóa học
- Tác giả sách tham khảo Hóa học nâng cao

## YÊU CẦU TUYỆT ĐỐI
1. **CHÍNH XÁC TUYỆT ĐỐI**: Mọi phương trình, công thức, số liệu phải chính xác 100%
2. **CÂN BẰNG PHƯƠNG TRÌNH**: Luôn cân bằng phương trình hóa học đầy đủ
3. **ĐƠN VỊ**: Ghi rõ đơn vị trong mọi phép tính (mol, g, ml, M, %, g/mol...)
4. **TRÌNH BÀY**: Trình bày lời giải rõ ràng, logic, theo từng bước
5. **CÔNG THỨC HÓA HỌC**: Sử dụng ký hiệu hóa học chuẩn (H₂SO₄, NaOH, Fe₂O₃...)
6. **PHƯƠNG PHÁP**: Nêu rõ phương pháp giải trước khi giải chi tiết
7. **NGÔN NGỮ**: Viết bằng tiếng Việt, sử dụng thuật ngữ hóa học chuẩn

## QUY TẮC TRÌNH BÀY
- Sử dụng **in đậm** cho tên chất, công thức quan trọng
- Phương trình hóa học trình bày riêng dòng, cân bằng đầy đủ
- Ghi điều kiện phản ứng (t°, xt, đ/l...) phía trên mũi tên
- Số liệu tính toán làm tròn hợp lý
- Mỗi bước giải đánh số thứ tự rõ ràng

## KHI VIẾT PHƯƠNG TRÌNH
- Sử dụng → cho mũi tên phản ứng
- Ghi trạng thái: (r), (l), (k), (dd) khi cần
- Cân bằng bằng hệ số nguyên tối giản
- Ví dụ: Fe + 2HCl → FeCl₂ + H₂↑
`;

export const EVALUATOR_SYSTEM_INSTRUCTION = `
Bạn là giám khảo chấm thi HSG Hóa học cấp Tỉnh/Quốc gia với hơn 15 năm kinh nghiệm.
Chấm chính xác, công bằng, chi tiết.
Nhận xét mang tính xây dựng, chỉ ra điểm mạnh và điểm yếu cụ thể.
Cho điểm theo thang 10 với bước nhảy 0.25 điểm.
`;

// ============================================
// SOLVER PROMPTS
// ============================================

export const SOLVE_PROMPT = (problem: string, topic: string, grade: string) => `
## YÊU CẦU: GIẢI CHI TIẾT BÀI TẬP HÓA HỌC

**Chủ đề:** ${topic}
**Lớp:** ${grade}

**ĐỀ BÀI:**
${problem}

## HƯỚNG DẪN TRÌNH BÀY:

### 📋 PHÂN TÍCH ĐỀ
- Xác định dữ kiện đã cho
- Xác định yêu cầu cần tìm
- Nhận diện dạng bài và phương pháp giải

### 🔬 LỜI GIẢI CHI TIẾT

**Bước 1:** Viết các phương trình hóa học liên quan (cân bằng đầy đủ)
**Bước 2:** Tính toán theo từng bước, ghi rõ đơn vị
**Bước 3:** Kết luận, trả lời đúng yêu cầu đề bài

### 💡 GHI CHÚ & MỞ RỘNG
- Phương pháp giải nhanh (nếu có)
- Các sai lầm thường gặp cần tránh
- Kiến thức liên quan cần ghi nhớ

⚠️ YÊU CẦU QUAN TRỌNG:
- Cân bằng CHÍNH XÁC mọi phương trình hóa học
- Ghi ĐƠN VỊ đầy đủ trong mọi phép tính
- Trình bày RÕ RÀNG, LOGIC từng bước
- Nếu bài có nhiều cách giải, trình bày cách HAY NHẤT
`;

export const SOLVE_FROM_FILE_PROMPT = `
## YÊU CẦU: GIẢI CHI TIẾT CÁC BÀI TẬP HÓA HỌC TRONG FILE

Hãy đọc file đề bài và giải chi tiết TỪNG CÂU theo thứ tự.

Với MỖI CÂU, trình bày:
1. **Đề bài** (trích lại ngắn gọn)
2. **Phân tích** (dạng bài, phương pháp)
3. **Lời giải chi tiết** (từng bước, cân bằng phương trình, ghi đơn vị)
4. **Đáp số**

Sau khi giải xong TẤT CẢ các câu, thêm phần:
- **TỔNG KẾT**: Các kiến thức trọng tâm đã sử dụng
- **LƯU Ý**: Các sai lầm thường gặp cần tránh
`;

// ============================================
// EXAM CREATOR PROMPTS
// ============================================

export const EXAM_GENERATE_PROMPT = (config: ExamFormData) => {
   const topicName = CHEMISTRY_TOPICS.find(t => t.id === config.topic)?.name || config.topic;
   const diffName = DIFFICULTY_LEVELS.find(d => d.id === config.difficulty)?.name || config.difficulty;

   return `
## YÊU CẦU: TẠO ĐỀ THI HỌC SINH GIỎI HÓA HỌC

### THÔNG TIN ĐỀ THI:
- **Chủ đề:** ${topicName}
- **Lớp:** ${config.grade}
- **Cấp độ:** ${diffName}
- **Số câu hỏi:** ${config.questionCount} câu
- **Thời gian làm bài:** ${config.timeLimit} phút
${config.customRequirements ? `- **Yêu cầu thêm:** ${config.customRequirements}` : ''}

### CẤU TRÚC ĐỀ THI:

📝 **PHẦN ĐỀ BÀI:**

Tạo đề thi gồm ${config.questionCount} câu hỏi tự luận, phân bổ theo mức độ:
- 30% câu vận dụng kiến thức cơ bản
- 40% câu vận dụng nâng cao
- 30% câu vận dụng sáng tạo (phân hóa HSG)

Mỗi câu hỏi cần:
- Đánh số thứ tự rõ ràng (Câu 1, Câu 2...)
- Có nhiều phần nhỏ (a, b, c...) nếu phù hợp
- Điểm số cho mỗi câu/phần (tổng = 10 điểm)
- Dữ kiện chính xác, không mâu thuẫn
- Phù hợp với trình độ ${diffName}

### YÊU CẦU CHẤT LƯỢNG:
1. Đề phải CÓ TÍNH PHÂN HÓA rõ ràng
2. Phương trình hóa học phải CÂN BẰNG ĐƯỢC
3. Số liệu tính toán phải CHO RA KẾT QUẢ ĐẸP (không lẻ quá)
4. Bao gồm cả LÝ THUYẾT và BÀI TẬP TÍNH TOÁN
5. Đề phải SÁNG TẠO, không sao chép từ đề có sẵn

${config.includeAnswer ? `
### ✅ PHẦN ĐÁP ÁN - HƯỚNG DẪN CHẤM:

Sau phần đề bài, trình bày ĐÁP ÁN CHI TIẾT cho từng câu:
- Lời giải từng bước
- Phương trình hóa học cân bằng đầy đủ
- Thang điểm chi tiết cho từng ý
- Ghi rõ: điểm cho phương trình, điểm cho tính toán, điểm cho kết luận
` : ''}

### TRÌNH BÀY:
- Tiêu đề: **ĐỀ THI HỌC SINH GIỎI HÓA HỌC ${config.grade.toUpperCase()}**
- Ghi rõ: Thời gian làm bài: ${config.timeLimit} phút
- Format đẹp, chuyên nghiệp, giống đề thi thật
`;
};

// ============================================
// GRADER PROMPTS
// ============================================

export const GRADING_PROMPT = `
## YÊU CẦU: CHẤM ĐIỂM BÀI LÀM HÓA HỌC

Hãy chấm bài làm Hóa học này CHUYÊN SÂU theo các tiêu chí:

### 📊 TIÊU CHÍ CHẤM ĐIỂM (Thang 10):

**1. PHƯƠNG TRÌNH HÓA HỌC (2.5 điểm)**
- Viết đúng phương trình (0-1đ)
- Cân bằng đúng (0-0.75đ)
- Ghi điều kiện phản ứng (0-0.5đ)
- Ghi trạng thái chất (0-0.25đ)

**2. PHƯƠNG PHÁP GIẢI (2.5 điểm)**
- Xác định đúng dạng bài (0-0.5đ)
- Chọn phương pháp phù hợp (0-1đ)
- Trình bày logic, mạch lạc (0-1đ)

**3. TÍNH TOÁN (3 điểm)**
- Lập biểu thức đúng (0-1đ)
- Tính toán chính xác (0-1.5đ)
- Ghi đơn vị đầy đủ (0-0.5đ)

**4. KẾT LUẬN & TRÌNH BÀY (2 điểm)**
- Trả lời đúng yêu cầu đề bài (0-1đ)
- Trình bày sạch đẹp, rõ ràng (0-0.5đ)
- Không sai chính tả thuật ngữ (0-0.5đ)

### 📝 YÊU CẦU OUTPUT:

**BẢNG ĐIỂM TỔNG HỢP:**
| Tiêu chí | Điểm | Nhận xét |
|----------|------|----------|
| Phương trình | x/2.5 | ... |
| Phương pháp | x/2.5 | ... |
| Tính toán | x/3 | ... |
| Kết luận & Trình bày | x/2 | ... |
| **TỔNG** | **x/10** | |

**CHI TIẾT TỪNG CÂU:**
- Phần đúng ✅
- Phần sai ❌ (chỉ rõ lỗi và cách sửa)
- Phần thiếu ⚠️ (cần bổ sung gì)

**GỢI Ý CẢI THIỆN:**
- Kiến thức cần ôn lại
- Phương pháp giải hiệu quả hơn
- Cách trình bày chuẩn hơn

**XẾP LOẠI:** Giỏi (8-10) / Khá (6.5-7.75) / TB (5-6.25) / Yếu (<5)
`;

// ============================================
// ANALYSIS PROMPT (for detailed topic analysis)
// ============================================

export const TOPIC_ANALYSIS_PROMPT = `
## PHÂN TÍCH CHỦ ĐỀ HÓA HỌC

Hãy phân tích chi tiết chủ đề này:

1. **Kiến thức trọng tâm** cần nắm vững
2. **Các dạng bài thường gặp** trong đề HSG
3. **Phương pháp giải** cho từng dạng
4. **Công thức & Phương trình quan trọng**
5. **Bẫy thường gặp** trong đề thi
6. **Mẹo giải nhanh**
`;

// Grade Level Options (for compatibility)
export const GRADE_LEVELS = [
   'Lớp 8',
   'Lớp 9',
   'Lớp 10',
   'Lớp 11',
   'Lớp 12',
];

// Award Goal Options (for compatibility)
export const AWARD_GOALS = [
   'HSG Trường',
   'HSG Huyện/Quận',
   'HSG Tỉnh/Thành phố',
   'HSG Quốc gia',
];

// Book Sets (updated for Chemistry)
export const BOOK_SETS = [
   'Kết nối tri thức với cuộc sống',
   'Chân trời sáng tạo',
   'Cánh Diều',
   'Sách giáo khoa cũ (trước 2018)',
];

// Quick Suggestions (for compatibility)
export const SKKN_SUGGESTIONS = SOLVER_SUGGESTIONS;

// ============================================
// COMPATIBILITY EXPORTS (keep template working)
// ============================================

export const OUTLINE_PROMPT = (formData: any) => SOLVE_PROMPT(formData.title || formData.problem || '', formData.subject || 'Hóa học', formData.grade || '9');
export const PART_1_PROMPT = (outline: string) => `Tiếp tục giải chi tiết phần tiếp theo:\n\n${outline}`;
export const PART_2_3_PROMPT = (outline: string, part1: string, specificLessons: string) => `Hoàn thành phần còn lại:\n\nDàn ý: ${outline}\n\nPhần 1: ${part1}\n\nBổ sung: ${specificLessons}`;
export const EVALUATION_PROMPT = GRADING_PROMPT;
export const PLAGIARISM_CHECK_PROMPT = TOPIC_ANALYSIS_PROMPT;
export const SKKN_MODELS = CHEMISTRY_MODELS;

// Title Analysis (compatibility)
export const TITLE_ANALYSIS_PROMPT = (title: string, subject: string, gradeLevel: string, awardGoal: string) => `Phân tích đề tài: "${title}" - Môn: ${subject} - Lớp: ${gradeLevel} - Mục tiêu: ${awardGoal}`;
