---
description: Template để tạo ứng dụng AI cho giáo dục với hệ thống đăng ký, thanh toán, admin dashboard
---

# Education AI App Template

Template này dựa trên codebase **SKKN Architect Pro** - đã được kiểm chứng hoạt động tốt trên Vercel.

## 🚀 Quick Start

### Bước 1: Clone Template

```powershell
# Copy folder skkn-architect-pro sang tên mới
xcopy /E /I "skkn-architect-pro" "ten-du-an-moi"
cd ten-du-an-moi
npm install
```

### Bước 2: Customize App

1. Đổi tên app trong `package.json`
2. Thay đổi logo/title trong `App.tsx` (line 486-542)
3. Chỉnh sửa các mode/chức năng trong `App.tsx`
4. Cập nhật prompts AI trong `constants.ts`

### Bước 3: Deploy

```powershell
npm run build
git init
git add .
git commit -m "Initial commit"
# Push lên GitHub và kết nối Vercel
```

---

## 📁 Cấu trúc Files Quan Trọng

| File | Mục đích | Cần chỉnh sửa? |
|------|----------|----------------|
| `App.tsx` | Component chính, UI, logic | ✅ Có |
| `constants.ts` | Prompts AI, system instructions | ✅ Có |
| `services/geminiService.ts` | Gọi Gemini API | ⚠️ Ít khi |
| `utils/authUtils.ts` | Authentication, đăng ký, thanh toán | ⚠️ Ít khi |
| `types.ts` | TypeScript types | ⚠️ Nếu cần |
| `index.css` | Styles, animations | ⚠️ Ít khi |

---

## 🔧 Tùy chỉnh Chức năng

### 1. Thay đổi thông tin thanh toán

File: `utils/authUtils.ts` (line 43-50)

```typescript
export const BANK_INFO = {
  bankName: 'Tên Ngân Hàng',
  accountNumber: 'Số Tài Khoản',
  accountHolder: 'Tên Chủ TK',
  amount: 'Số tiền',
  qrUrl: 'URL mã QR VietQR',
};
```

### 2. Thay đổi Admin Credentials

File: `utils/authUtils.ts` (line 68-71)

```typescript
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'mat_khau_moi',
};
```

### 3. Thêm Mode/Chức năng mới

File: `App.tsx`

- Thêm vào `AppMode` type trong `types.ts`
- Thêm tab trong Mode Switcher (line 546-560)
- Thêm form/UI cho mode mới

### 4. Tùy chỉnh AI Prompts

File: `constants.ts`

- `SYSTEM_INSTRUCTION`: Hướng dẫn chung cho AI
- `OUTLINE_PROMPT`: Prompt tạo outline
- `EVALUATION_PROMPT`: Prompt đánh giá
- Thêm prompts mới theo nhu cầu

---

## 💡 Ý tưởng Ứng dụng Giáo dục

| Tên App | Mô tả | Chức năng chính |
|---------|-------|-----------------|
| **Tạo Đề Thi AI** | Tự động tạo đề thi từ nội dung bài học | Upload bài → AI tạo câu hỏi |
| **Chấm Bài Luận AI** | Chấm điểm bài luận/văn học sinh | Upload bài → AI chấm + feedback |
| **Phân Tích Học Sinh** | Dashboard phân tích điểm số | Import điểm → Biểu đồ + gợi ý |
| **Soạn Giáo Án AI** | Tạo giáo án chuẩn từ chủ đề | Nhập chủ đề → Giáo án chi tiết |
| **Hỏi Đáp Kiến Thức** | Chatbot trả lời câu hỏi học sinh | Chat với AI theo môn học |

---

## ⚡ Tips Pro

1. **Giữ nguyên authUtils.ts** - Đã fix SSR-safe, không cần sửa
2. **Giữ nguyên geminiService.ts** - Logic API đã tối ưu
3. **Tập trung sửa constants.ts** - Thay prompts cho use case mới
4. **Responsive sẵn** - UI đã tối ưu cho mobile/desktop

---

## 🎨 Customization Examples

### Thay đổi màu theme

File: `App.tsx` và `index.css`

- Màu chính: `amber-400`, `amber-500`
- Background: `#0d0d1a`, `#1a1a2e`
- Thay thế bằng màu bạn muốn (vd: `emerald`, `blue`, `purple`)

### Thêm Analytics

Thêm Google Analytics vào `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```
