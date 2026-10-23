# Bài 58 – Website Fashion tổng hợp

Bài gồm 3 project chạy cùng lúc:

| Project | Công nghệ | Port | Vai trò |
|---|---|---|---|
| `server-fashion` | NodeJS + ExpressJS + MongoDB | 4000 | Restful API |
| `admin-fashion` | Angular | 4001 | Trang quản trị (CRUD + WYSIWYG) |
| `client-fashion` | Angular | 4002 | Trang trình diễn cho người dùng |

Yêu cầu máy: Node.js 20.19 trở lên (hoặc 22.12+), MongoDB đang chạy ở `mongodb://127.0.0.1:27017`.

---

## 1. Cơ sở dữ liệu `FashionData`

Có 1 collection duy nhất là `Fashion`. Mỗi document có dạng:

```json
{
  "_id": "ObjectId (MongoDB tự tạo)",
  "fashion_subject": "Tiêu đề fashion",
  "fashion_detail": "<p>Chi tiết fashion dạng HTML (nhập bằng WYSIWYG)</p>",
  "thumbnail": "URL hình hoặc chuỗi Base64 (data:image/...)",
  "style": "Street Style",
  "created_date": "ISODate(...) – ngày tạo"
}
```

Dữ liệu mẫu gồm 3 Style (Street Style, Trends, Minimalist), mỗi Style 4 fashion. Có 2 cách nạp:

- **Cách 1 (nhanh):** `cd server-fashion` → `npm install` → `npm run seed`
- **Cách 2 (Compass):** tạo database `FashionData`, collection `Fashion`, rồi chọn *Add Data → Import JSON or CSV file* và trỏ tới `server-fashion/Fashion.json`

## 2. Chạy `server-fashion` (port 4000)

```bash
cd server-fashion
npm install
npm run seed      # chỉ cần chạy 1 lần
npm start         # nodemon index.js
```

| # | Method | URL | Chức năng |
|---|---|---|---|
| 1 | GET | `/fashions` | Toàn bộ Fashion, sắp xếp ngày tạo giảm dần |
| 2 | GET | `/fashions/style/:style` | Lọc Fashion theo Style (không phân biệt hoa thường) |
| 3 | GET | `/fashions/:id` | Một Fashion theo id |
| 4 | POST | `/fashions` | Thêm mới (body JSON, server tự gán `created_date`) |
| 5 | PUT | `/fashions/:id` | Chỉnh sửa |
| 6 | DELETE | `/fashions/:id` | Xóa, trả về Fashion vừa xóa |
| + | GET | `/styles` | Danh sách Style không trùng (dùng cho dropdownlist) |

Body mẫu để test bằng Postman (POST/PUT):

```json
{
  "fashion_subject": "Áo dài cách tân",
  "fashion_detail": "<p>Nội dung <b>chi tiết</b></p>",
  "thumbnail": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=480",
  "style": "Vintage"
}
```

## 3. Chạy `admin-fashion` (port 4001)

```bash
cd admin-fashion
npm install
npm start         # ng serve, đã cấu hình port 4001 + proxy.conf.json → localhost:4000
```

Mở http://localhost:4001

- **Danh sách** (`/fashions`): mỗi dòng có nút Xem, Sửa, Xóa. Bấm Xóa thì phải xác nhận trước. Có nút "Thêm mới Fashion" và dropdown lọc theo Style.
- **Thêm mới / Sửa** (`/fashions/new`, `/fashions/edit/:id`): dùng chung component `FashionFormComponent`. Field chi tiết dùng **CKEditor 5** (WYSIWYG HTML Editor): định dạng chữ, màu, bảng, chèn hình (hình được lưu Base64 ngay trong HTML), xem mã nguồn HTML (nút Source). Lưu thành công thì quay về danh sách.
- **Xem chi tiết** (`/fashions/:id`).

## 4. Chạy `client-fashion` (port 4002)

```bash
cd client-fashion
npm install
npm start         # port 4002 + proxy → localhost:4000
```

Mở http://localhost:4002

- Trang chủ hiển thị Fashion **theo nhóm Style**, hình đại diện là `thumbnail`.
- Bấm vào một Fashion thì mở trang chi tiết: hình và nội dung HTML của field chi tiết, kèm các Fashion cùng Style.
- **Tìm kiếm theo Style:** gõ Style vào ô tìm kiếm (có gợi ý) rồi bấm SEARCH hoặc Enter, hoặc chọn Style từ dropdownlist. Kết quả lấy từ API lọc `/fashions/style/:style`.

## 5. Cấu trúc thư mục chính

```
server-fashion/
  index.js            ← 6 API + /styles
  seed.js             ← nạp dữ liệu mẫu, xuất Fashion.json
admin-fashion/src/app/
  models/fashion.ts
  services/fashion-api.service.ts
  fashion-list/       ← danh sách + xóa có xác nhận
  fashion-detail/     ← xem chi tiết
  fashion-form/       ← thêm mới & sửa (CKEditor)
  safe-html.pipe.ts   ← hiển thị HTML từ WYSIWYG
client-fashion/src/app/
  fashion-home/       ← nhóm theo Style + tìm kiếm
  fashion-detail/     ← trang chi tiết
```

## Lưu ý

- Thứ tự chạy: MongoDB → `server-fashion` → `admin-fashion` / `client-fashion`.
- Project Angular dùng kiểu **NgModule** (`standalone: false`) và có `zone.js` giống các bài trước trong môn.
- File `.npmrc` (`legacy-peer-deps=true`) để tránh lỗi `npm install` do xung đột peer dependency.
- Hình mẫu lấy từ Unsplash nên cần có Internet. Hình chọn từ máy trong trang Admin được lưu Base64 trong MongoDB (server đã tăng giới hạn payload lên 20mb).
