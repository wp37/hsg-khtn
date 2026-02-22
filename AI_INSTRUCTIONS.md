# Các quy tắc phát triển và vận hành dự án (AI Instructions)

Tài liệu này ghi lại các quy tắc đã được thống nhất để AI hoặc các nhà phát triển sau này tuân thủ khi chỉnh sửa dự án.
Tôi đang triển khai ứng dụng từ github qua vercel, hãy kiểm tra giúp tôi các file vercel.json, index.html có tham chiếu đúng chưa và hướng dẫn tôi setup api key gemini để người dùng tự nhập API key của họ để chạy app

## 1. Cấu hình Model AI & Cơ chế Fallback

- **Model mặc định**: `gemini-2.0-flash-exp` (Fast Mode)
- **Model dự phòng**: Tự động chuyển đổi nếu model hiện tại gặp lỗi/quá tải:
  - **Fast Mode**: `gemini-2.0-flash-exp` → `gemini-1.5-flash` → `gemini-1.5-flash-latest`
  - **Smart Mode**: `gemini-1.5-pro` → `gemini-2.0-flash-exp` → `gemini-1.5-flash`
  - **Expert Mode**: `gemini-1.5-pro-latest` → `gemini-1.5-pro` → `gemini-2.0-flash-exp`
- **Cơ chế Retry**:
  - Nếu một bước xử lý (Step 1, 2, hoặc 3) gặp lỗi API, hệ thống **tự động** thử lại ngay lập tức với model tiếp theo trong danh sách.
  - Vẫn giữ nguyên kết quả của các bước trước đó, chỉ retry bước đang lỗi.

## 2. Quản lý API Key

- **Cơ chế**:
  - Người dùng nhập API key vào Modal hoặc qua nút Settings trên Header.
  - Lưu vào `localStorage` của trình duyệt.
  - Ưu tiên sử dụng key từ `localStorage`.
- **Giao diện**:
  - **Thiết lập Model & API Key**: Cần hiển thị như hình mẫu.
    - Hiển thị danh sách chọn Model AI (dạng thẻ/Cards).
    - **Flash Mode** (Default, nhanh): `gemini-2.0-flash-exp`
    - **Pro Mode** (chất lượng cao): `gemini-1.5-pro`
    - **Custom Mode**: Cho phép người dùng chọn model cụ thể
  - Nút **Settings (API Key)** kèm dòng chữ màu đỏ "Lấy API key để sử dụng app" phải luôn hiển thị trên Header để người dùng dễ dàng thay đổi key khi hết quota.
  - Khi chưa có key, hiển thị Modal bắt buộc nhập.
  - Việc nhập key ban đầu trước khi dùng app, hướng dẫn người dùng vào <https://aistudio.google.com/api-keys> để lấy key API

## 3. Quản lý Trạng thái & Lỗi (State Management)

- **Hiển thị lỗi**:
  - Nếu tất cả các model đều thất bại -> Hiện thông báo lỗi màu đỏ, hiển thị nguyên văn lỗi từ API (VD: `429 RESOURCE_EXHAUSTED`).
  - Trạng thái các cột đang chờ phải chuyển thành **"Đã dừng do lỗi"**, tuyệt đối không được hiện "Hoàn tất" hoặc checkmark xanh nếu quy trình bị gián đoạn.
- **Tiến trình**:
  - Progress bar chỉ hiển thị trạng thái hoàn thành (xanh) khi bước đó thực sự thành công.

## 4. Triển khai (Deployment)

- **Nền tảng**: Vercel.
- **File bắt buộc**: `vercel.json` ở root để xử lý SPA routing.

  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```

## 5. Chất Lượng Frontend & UI/UX

### 5.1 Design Aesthetics

- **KHÔNG SỬ DỤNG** generic AI aesthetics:
  - ❌ Font overused: Inter, Roboto, Arial, system fonts
  - ❌ Purple gradients trên white backgrounds
  - ❌ Cookie-cutter layouts thiếu character
- **YÊU CẦU** distinctive design:
  - ✅ Typography: Chọn fonts độc đáo (Google Fonts: Outfit, Poppins, Space Grotesk)
  - ✅ Color: Dominant colors + sharp accents, không dùng màu generic
  - ✅ Motion: Micro-animations, hover effects, staggered reveals

### 5.2 Color Palette Gợi Ý

| Tên | Màu chính |
|-----|-----------|
| Classic Blue | #1C2833, #2E4053, #AAB7B8, #F4F6F6 |
| Teal & Coral | #5EA8A7, #277884, #FE4447 |
| Burgundy Luxury | #5D1D2E, #951233, #C15937, #997929 |
| Black & Gold | #BF9A4A, #000000, #F4F6F6 |

### 5.3 CSS Best Practices

```css
/* Sử dụng CSS Variables */
:root {
  --color-primary: #4A90E2;
  --color-secondary: #7B68EE;
  --color-background: #F5F7FA;
  --color-text: #333333;
  --font-display: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
}

/* Glass morphism effect */
.card-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## 6. Performance & Optimization

### 6.1 Loading Performance

- **Lazy loading** cho images và components
- **Code splitting** cho các routes lớn
- **Debounce** resize handlers
- Tối ưu bundle size < 200KB cho initial load

### 6.2 Runtime Performance

- Avoid expensive DOM operations trong loops
- Sử dụng `requestAnimationFrame` cho animations
- Cache API responses khi phù hợp

## 7. SEO Best Practices

- **Title Tags**: Mô tả ngắn gọn, dưới 60 ký tự
- **Meta Descriptions**: 150-160 ký tự, compelling
- **Heading Structure**: 1 `<h1>` per page, proper hierarchy
- **Semantic HTML**: Sử dụng `<main>`, `<nav>`, `<article>`, `<section>`
- **Unique IDs**: Mọi interactive elements có ID unique

## 8. Error Handling & UX

### 8.1 Error Messages

- Hiển thị **nguyên văn lỗi API** để debug
- Toast notifications cho errors (red), success (green)
- Loading states rõ ràng (spinners, skeletons)

### 8.2 Form Validation

- Validate client-side trước khi submit
- Real-time feedback khi user nhập
- Disable submit button khi form invalid

## 9. Security

### 9.1 API Key Protection

- **KHÔNG BAO GIỜ** hardcode API keys trong source code
- Lưu keys trong `localStorage` với encryption nếu cần
- Rate limiting để tránh abuse

### 9.2 Input Sanitization

- Escape HTML để tránh XSS
- Validate input types nghiêm ngặt

## 10. Accessibility (A11y)

- **ARIA labels** cho interactive elements
- **Contrast ratio** tối thiểu 4.5:1
- **Keyboard navigation** cho mọi tính năng
- **Focus states** rõ ràng

---

## 📁 Tham Khảo Skills

Đã tích hợp best practices từ các skills trong `SKILL EDUCATION/skill_giao_duc/`:

- `frontend-design/SKILL.md` - UI/UX guidelines
- `firebase/SKILL.md` - Security patterns
- `d3-visualization/SKILL.md` - Performance tips
- `app-builder/SKILL.md` - Tech stack selection
