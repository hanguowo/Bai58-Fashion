// Cấu trúc 1 document trong collection "Fashion" (database FashionData)
export class Fashion {
  constructor(
    public _id: any = null,               // ObjectId – MongoDB tự tạo
    public fashion_subject: string = '',  // tiêu đề fashion
    public fashion_detail: string = '',   // chi tiết fashion (HTML từ WYSIWYG)
    public thumbnail: string = '',        // hình thumbnail (URL hoặc Base64)
    public style: string = '',            // Style của fashion
    public created_date: any = null       // ngày tạo – server tự gán
  ) {}
}
