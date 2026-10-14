# Mèo Sin Cos

Web game ôn tập 99 câu lượng giác Toán 11 (đề cương giữa học kì I). Chú mèo đội nón lá dẫn người chơi qua 8 điểm dừng ở Hà Nội; làm xong mỗi chặng nhận giấy chứng nhận tham quan.

- `index.html`: toàn bộ trò chơi (HTML, CSS, JS trong một file; công thức hiển thị bằng MathJax từ cdnjs).
- `hinh/`: hình vẽ cho mục Bay vào không gian: `h125…h163.png` cắt từ đề Chủ đề 2, `g-*.png` là hình minh hoạ trong sổ tay Hình học không gian.
- `meo-hoc-bai.mp3`: nhạc nền không lời "Mèo được 10 điểm".
- `apps-script.gs`: (tuỳ chọn) máy chủ bảng xếp hạng chung cả lớp bằng Google Sheets; hướng dẫn nằm ở đầu file.
- Tiến độ, tên người chơi và giấy chứng nhận lưu trong trình duyệt (localStorage) của từng máy.

## Đưa lên Vercel

1. Tạo repo GitHub tên `meosincos`, đẩy các file trong thư mục này lên nhánh `main`.
2. Vào vercel.com → Add New → Project → Import repo `meosincos`.
3. Framework Preset: **Other**, không cần Build Command, Output Directory để trống → Deploy.
4. Đặt Project Name là `meosincos` để có địa chỉ `https://meosincos.vercel.app`.

## Lưu đăng nhập và bảng xếp hạng cả lớp

Mặc định danh sách đăng nhập và bảng xếp hạng (điểm thi thử, số cá, tiến độ lượng giác, hình học) chỉ lưu trên từng máy. Sau khi nối Google Sheets, mỗi lần đăng nhập được ghi vào trang tính `DangNhap`, điểm của từng học sinh vào `BangXepHang`. Muốn cả lớp chung một bảng: làm theo hướng dẫn trong `apps-script.gs`, rồi dán URL Web App vào dòng `const SCORE_API='';` trong `index.html`.
