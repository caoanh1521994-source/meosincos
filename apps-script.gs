/**
 * Mèo Sin Cos – lưu người đăng nhập và bảng xếp hạng chung cả lớp bằng Google Sheets.
 *
 * Cách dùng:
 * 1. Tạo một Google Sheet mới, đặt tên tuỳ ý (vd: "Mèo Sin Cos – Xếp hạng").
 * 2. Menu Tiện ích mở rộng → Apps Script, xoá code mẫu, dán toàn bộ file này vào, bấm Lưu.
 * 3. Bấm Triển khai → Tùy chọn triển khai mới → Loại: Ứng dụng web.
 *    - Thực thi với tư cách: Tôi
 *    - Người có quyền truy cập: Bất kỳ ai
 *    Bấm Triển khai, cấp quyền, rồi sao chép URL Ứng dụng web (đuôi /exec).
 * 4. Mở index.html, tìm dòng  const SCORE_API='';  và dán URL vào giữa hai dấu nháy.
 * 5. Đẩy lại lên GitHub; Vercel tự cập nhật.
 *
 * Sheet sẽ tự tạo 2 trang tính:
 *  - "BangXepHang": mỗi học sinh một dòng (cá, câu đã làm, điểm thi thử cao nhất, số lần thi,
 *    số câu hình học đã làm, số lần đăng nhập, lần hoạt động gần nhất).
 *  - "DangNhap": mỗi lần đăng nhập ghi thêm một dòng (thời gian, họ tên, lớp).
 *
 * Nếu đã triển khai bản cũ: dán đè code này, rồi Triển khai → Quản lý bản triển khai →
 * chọn bản đang dùng → Chỉnh sửa → Phiên bản: Mới → Triển khai (giữ nguyên URL).
 * Trang tính "BangXepHang" cũ nên xoá đi để script tạo lại với đủ cột mới.
 */
const SHEET = 'BangXepHang';
const LOGS = 'DangNhap';
const COLS = ['id', 'name', 'cls', 'fish', 'done', 'acc', 'certs', 'stars', 'exam', 'examN', 'geo', 'logins', 'last'];

function sheet_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(header);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const values = sheet_(SHEET, COLS).getDataRange().getValues();
  const rows = values.slice(1).filter(r => r[0]).map(r => {
    const o = {};
    COLS.forEach((c, i) => (o[c] = r[i]));
    return o;
  });
  return json_({ rows: rows });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d.id || !d.name) return json_({ ok: false });
    const clean = v => String(v == null ? '' : v).slice(0, 60);
    const num = (v, max) => Math.max(0, Math.min(max, Number(v) || 0));

    if (d.type === 'login') {
      sheet_(LOGS, ['Thời gian', 'Họ tên', 'Lớp', 'id'])
        .appendRow([new Date(Number(d.t) || Date.now()), clean(d.name), clean(d.cls), clean(d.id)]);
      return json_({ ok: true });
    }

    const exam = d.exam === null || d.exam === undefined || d.exam === '' ? '' : num(d.exam, 10);
    const row = [
      clean(d.id), clean(d.name), clean(d.cls),
      num(d.fish, 147), num(d.done, 99), num(d.acc, 100),
      clean(d.certs), num(d.stars, 24),
      exam, num(d.examN, 999), num(d.geo, 61), num(d.logins, 99999),
      Date.now()
    ];
    const sh = sheet_(SHEET, COLS);
    const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getValues().map(r => String(r[0]));
    const at = ids.indexOf(row[0]);
    if (at > 0) sh.getRange(at + 1, 1, 1, COLS.length).setValues([row]);
    else sh.appendRow(row);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
