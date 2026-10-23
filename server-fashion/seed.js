// =============================================================
// Nạp dữ liệu mẫu cho FashionData.Fashion: 3 Style x 4 Fashion
// Chạy: npm run seed   (sẽ XÓA dữ liệu cũ trong collection Fashion)
// Đồng thời ghi ra file Fashion.json để import bằng MongoDB Compass
// =============================================================
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";

// Hình minh họa lấy từ Unsplash (ảnh miễn phí). Có thể thay bằng Base64 nếu muốn.
const PHOTOS = [
  "1490481651871-ab68de25d43d", "1483985988355-763728e1935b", "1515886657613-9f3515b0c78f",
  "1509631179647-0177331693ae", "1529139574466-a303027c1d8b", "1496747611176-843222e1e57c",
  "1485968579580-b6d095142e6e", "1469334031218-e382a71b716b", "1492707892479-7bc8d5a4ee93",
  "1539109136881-3be0616acf4b", "1503342217505-b0a15ec3261c", "1524504388940-b1c1722653e1",
  "1487222477894-8943e31ef7b2", "1434389677669-e08b4cac3105", "1445205170230-053b83016050",
  "1441984904996-e0b6ba687e04", "1472851294608-062f824d29cc", "1558769132-cb1aea458c5e",
  "1551232864-3f0890e580d9", "1507679799987-c73779587ccf", "1520975954732-35dd22299614",
  "1552374196-1ab2a1c593e8", "1475180098004-ca77a66827be", "1544441893-675973e31985",
];
const img = (index, w, h) =>
  `https://images.unsplash.com/photo-${PHOTOS[index % PHOTOS.length]}?w=${w}&h=${h}&fit=crop&q=80`;

const detail = (intro, points, image) => `
<p>${intro}</p>
<h3>Điểm nhấn</h3>
<ul>${points.map((p) => `<li>${p}</li>`).join("")}</ul>
<figure class="image"><img src="${image}" alt="minh hoa"></figure>
<p><i>Mẹo phối đồ:</i> hãy bắt đầu từ một món chủ đạo rồi chọn phụ kiện cùng tông màu.</p>`;

const raw = [
  // ---------------- Street Style ----------------
  ["Street Style", "Phong cách đường phố Paris mùa Thu 2026",
    "Những con phố Paris tràn ngập áo khoác dáng dài, boots cổ cao và khăn len bản lớn.",
    ["Áo trench coat màu be", "Boots da cổ cao", "Khăn len oversize"]],
  ["Street Style", "Milan: khi màu sắc lên ngôi",
    "Giới mộ điệu tại Milan chọn những gam màu rực rỡ, phối nhiều lớp đầy cá tính.",
    ["Cardigan màu hồng neon", "Quần ống rộng", "Túi xách mini"]],
  ["Street Style", "London và tinh thần layering",
    "Thời tiết thất thường giúp London trở thành thủ phủ của phong cách mặc nhiều lớp.",
    ["Hoodie bên trong blazer", "Áo khoác phao ngắn", "Sneaker chunky"]],
  ["Street Style", "Sài Gòn: streetwear nhiệt đới",
    "Giới trẻ Sài Gòn ưu tiên chất liệu thoáng mát nhưng vẫn giữ tinh thần streetwear.",
    ["Áo thun oversize", "Quần cargo", "Mũ bucket"]],
  // ---------------- Trends ----------------
  ["Trends", "Vì sao suit ngắn là khoản đầu tư đáng giá mùa xuân",
    "Bộ suit quần short linh hoạt từ công sở đến dạo phố, là xu hướng nổi bật của năm.",
    ["Blazer dáng rộng", "Quần short ống suông", "Giày loafer"]],
  ["Trends", "Xu hướng màu Mocha Mousse",
    "Gam nâu mocha ấm áp xuất hiện từ áo khoác đến phụ kiện trên khắp các sàn diễn.",
    ["Áo len nâu mocha", "Chân váy da", "Túi tote da lộn"]],
  ["Trends", "Sự trở lại của phong cách Y2K",
    "Những món đồ đầu thập niên 2000 quay trở lại với diện mạo hiện đại hơn.",
    ["Quần cạp trễ", "Kính mát mắt nhỏ", "Áo croptop"]],
  ["Trends", "Thời trang bền vững: mua ít, chọn kỹ",
    "Ngày càng nhiều người chọn chất liệu tự nhiên và thiết kế dùng được lâu dài.",
    ["Vải linen, cotton hữu cơ", "Đồ secondhand", "Capsule wardrobe"]],
  // ---------------- Minimalist ----------------
  ["Minimalist", "Tủ đồ tối giản với 10 món cơ bản",
    "Chỉ với 10 món cơ bản bạn có thể phối hơn 30 bộ trang phục khác nhau.",
    ["Áo sơ mi trắng", "Quần jeans xanh đậm", "Áo blazer đen"]],
  ["Minimalist", "Monochrome: phối đồ cùng một tông màu",
    "Phối toàn bộ trang phục cùng một tông giúp vóc dáng trông cao và thanh lịch hơn.",
    ["Tông kem – be", "Tông xám than", "Chất liệu khác nhau để tạo chiều sâu"]],
  ["Minimalist", "Phong cách Scandinavian cho dân văn phòng",
    "Thiết kế Bắc Âu đề cao sự gọn gàng, thoải mái và chất liệu tốt.",
    ["Áo len cổ lọ", "Quần âu ống đứng", "Đồng hồ mặt tròn đơn giản"]],
  ["Minimalist", "Phụ kiện tối giản tạo điểm nhấn",
    "Một chiếc khuyên tai kim loại hay túi da trơn đủ để nâng tầm bộ trang phục.",
    ["Khuyên tai vàng nhỏ", "Thắt lưng da trơn", "Túi da không logo"]],
];

const now = Date.now();
const fashions = raw.map(([style, subject, intro, points], i) => ({
  fashion_subject: subject,
  fashion_detail: detail(intro, points, img(i + 12, 900, 600)),
  thumbnail: img(i, 480, 600),
  style,
  created_date: new Date(now - i * 86400000), // mỗi bài cách nhau 1 ngày
}));

async function main() {
  // Ghi file Fashion.json (định dạng Extended JSON để Compass import đúng kiểu Date)
  const exportData = fashions.map((f) => ({
    ...f,
    created_date: { $date: f.created_date.toISOString() },
  }));
  fs.writeFileSync(path.join(__dirname, "Fashion.json"), JSON.stringify(exportData, null, 2));
  console.log("Đã ghi Fashion.json");

  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const col = client.db("FashionData").collection("Fashion");
  await col.deleteMany({});
  const r = await col.insertMany(fashions);
  console.log(`Đã nạp ${r.insertedCount} fashion vào FashionData.Fashion`);
  await client.close();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
