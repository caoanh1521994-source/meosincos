/**
 * Mèo Sin Cos – máy chủ bảng xếp hạng chung cả lớp bằng Google Sheets.
 *
 * Cách dùng:
 * 1. Tạo một Google Sheet mới, đặt tên tuỳ ý (vd: "Mèo Sin Cos – Xếp hạng").
 * 2. Menu Tiện ích mở rộng → Apps Script, xoá code mẫu, dán toàn bộ file này vào, bấm Lưu.
 * 3. Bấm Triển khai → Tùy chọn triển khai mới → Loại: Ứng dụng web.
 *    - Thực thi với tư cách: Tôi
 *    - Người có quyền truy cập: Bất kỳ ai
 *    Bấm Triển khai, cấp quyền, rồi sao chép URL Ứng dụng web (đuôi /exec).
 * 4. Mở index.html, tìm dòng  const SCORE_API='';  và dán URL vào giữa hai dấu nháy.
 * 5. Đẩy lại lên GitHub; Vercel tự cập nhật. Tab "Cả lớp (trực tuyến)" sẽ xuất hiện.
 *
 * Mỗi người chơi là một dòng trong trang tính "BangXepHang"; thầy cô có thể xem, sắp xếp, lọc ngay trong Sheet.
 */
const SHEET = 'BangXepHang';
const COLS = ['id', 'name', 'cls', 'fish', 'done', 'acc', 'certs', 'stars', 'last'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.appendRow(COLS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const values = sheet_().getDataRange().getValues();
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
    const row = [
      clean(d.id), clean(d.name), clean(d.cls),
      Math.max(0, Math.min(147, Number(d.fish) || 0)),
      Math.max(0, Math.min(99, Number(d.done) || 0)),
      Math.max(0, Math.min(100, Number(d.acc) || 0)),
      clean(d.certs), Math.max(0, Math.min(24, Number(d.stars) || 0)),
      Date.now()
    ];
    const sh = sheet_();
    const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getValues().map(r => String(r[0]));
    const at = ids.indexOf(row[0]);
    if (at > 0) sh.getRange(at + 1, 1, 1, COLS.length).setValues([row]);
    else sh.appendRow(row);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
