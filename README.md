# Mèo Sin Cos

Web game ôn tập 99 câu lượng giác Toán 11 (đề cương giữa học kì I). Chú mèo đội nón lá dẫn người chơi qua 8 điểm dừng ở Hà Nội; làm xong mỗi chặng nhận giấy chứng nhận tham quan.

- `index.html`: toàn bộ trò chơi (HTML, CSS, JS trong một file; công thức hiển thị bằng MathJax từ cdnjs).
- `meo-hoc-bai.mp3`: nhạc nền không lời "Mèo học bài".
- Tiến độ, tên người chơi và giấy chứng nhận lưu trong trình duyệt (localStorage) của từng máy.

## Đưa lên Vercel

1. Tạo repo GitHub tên `meo-sin-cos`, đẩy các file trong thư mục này lên nhánh `main`.
2. Vào vercel.com → Add New → Project → Import repo `meo-sin-cos`.
3. Framework Preset: **Other**, không cần Build Command, Output Directory để trống → Deploy.
4. Địa chỉ sẽ là `https://meo-sin-cos.vercel.app` (nếu tên còn trống; nếu không, đổi trong Settings → Domains).
