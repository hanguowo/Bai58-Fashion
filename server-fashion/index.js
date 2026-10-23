// =============================================================
// Bài 58 – server-fashion (NodeJS + ExpressJS + MongoDB)
// Port 4000 – Database: FashionData – Collection: Fashion
// =============================================================
const express = require("express");
const app = express();
const port = 4000;

const morgan = require("morgan");
app.use(morgan("combined"));

// Tăng giới hạn payload vì hình thumbnail/hình trong WYSIWYG là Base64
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));

const cors = require("cors");
app.use(cors());

// ---------------- Kết nối MongoDB ----------------
const { MongoClient, ObjectId } = require("mongodb");
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";
const client = new MongoClient(MONGO_URL);
const database = client.db("FashionData");
const fashionCollection = database.collection("Fashion");

// Kiểm tra id có đúng định dạng ObjectId không (tránh server bị crash)
function toObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

// Chỉ lấy những field hợp lệ từ body (không cho client tự gửi _id)
function pickFashion(body) {
  return {
    fashion_subject: (body.fashion_subject || "").trim(),
    fashion_detail: body.fashion_detail || "",
    thumbnail: body.thumbnail || "",
    style: (body.style || "").trim(),
  };
}

app.get("/", (req, res) => {
  res.send("server-fashion is running – Bài 58");
});

// 1) API trả về toàn bộ Fashion, sắp xếp theo ngày tạo giảm dần
app.get("/fashions", async (req, res) => {
  try {
    const result = await fashionCollection
      .find({})
      .sort({ created_date: -1 })
      .toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// 2) API lọc danh sách Fashion theo 1 Style (không phân biệt hoa thường)
//    VD: GET /fashions/style/Street%20Style
app.get("/fashions/style/:style", async (req, res) => {
  try {
    const style = req.params.style.trim();
    const escaped = style.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const result = await fashionCollection
      .find({ style: { $regex: `^${escaped}$`, $options: "i" } })
      .sort({ created_date: -1 })
      .toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// (Bổ sung) API trả về danh sách Style không trùng – dùng cho dropdownlist
app.get("/styles", async (req, res) => {
  try {
    const styles = await fashionCollection.distinct("style");
    res.send(styles.filter((s) => s).sort());
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// 3) API trả về một Fashion dựa vào id
app.get("/fashions/:id", async (req, res) => {
  const o_id = toObjectId(req.params.id);
  if (!o_id) return res.status(400).send({ message: "id không hợp lệ" });
  const result = await fashionCollection.findOne({ _id: o_id });
  if (!result) return res.status(404).send({ message: "Không tìm thấy Fashion" });
  res.send(result);
});

// 4) API thêm mới một Fashion (ngày tạo do server tự gán)
app.post("/fashions", async (req, res) => {
  const fashion = pickFashion(req.body);
  if (!fashion.fashion_subject || !fashion.style) {
    return res.status(400).send({ message: "Tiêu đề và Style là bắt buộc" });
  }
  fashion.created_date = new Date();
  const r = await fashionCollection.insertOne(fashion);
  fashion._id = r.insertedId;
  res.status(201).send(fashion);
});

// 5) API chỉnh sửa một Fashion (giữ nguyên ngày tạo)
app.put("/fashions/:id", async (req, res) => {
  const o_id = toObjectId(req.params.id);
  if (!o_id) return res.status(400).send({ message: "id không hợp lệ" });
  const fashion = pickFashion(req.body);
  if (!fashion.fashion_subject || !fashion.style) {
    return res.status(400).send({ message: "Tiêu đề và Style là bắt buộc" });
  }
  const r = await fashionCollection.updateOne({ _id: o_id }, { $set: fashion });
  if (r.matchedCount === 0) return res.status(404).send({ message: "Không tìm thấy Fashion" });
  const result = await fashionCollection.findOne({ _id: o_id });
  res.send(result);
});

// 6) API xóa một Fashion dựa vào id – trả về Fashion vừa xóa
app.delete("/fashions/:id", async (req, res) => {
  const o_id = toObjectId(req.params.id);
  if (!o_id) return res.status(400).send({ message: "id không hợp lệ" });
  const result = await fashionCollection.findOneAndDelete({ _id: o_id });
  if (!result) return res.status(404).send({ message: "Không tìm thấy Fashion" });
  res.send(result);
});

// Kết nối DB xong rồi mới mở port
client
  .connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`server-fashion listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Không kết nối được MongoDB:", err.message);
    process.exit(1);
  });
