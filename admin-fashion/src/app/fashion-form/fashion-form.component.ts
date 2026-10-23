import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  FontColor,
  FontSize,
  FontBackgroundColor,
  Alignment,
  Link,
  List,
  BlockQuote,
  HorizontalLine,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageUpload,
  ImageInsert,
  AutoImage,
  Base64UploadAdapter,
  Table,
  TableToolbar,
  SourceEditing,
  type EditorConfig,
} from 'ckeditor5';
import { Fashion } from '../models/fashion';
import { FashionAPIService } from '../services/fashion-api.service';

// Màn hình dùng chung cho THÊM MỚI và SỬA Fashion
//   /fashions/new       -> thêm mới
//   /fashions/edit/:id  -> sửa
@Component({
  selector: 'app-fashion-form',
  templateUrl: './fashion-form.component.html',
  styleUrls: ['./fashion-form.component.css'],
  standalone: false,
})
export class FashionFormComponent implements OnInit {
  fashion = new Fashion();
  isEdit = false;
  styles: string[] = [];
  errMessage = '';
  saving = false;

  // ===== Cấu hình WYSIWYG HTML Editor (CKEditor 5) cho field chi tiết =====
  public Editor = ClassicEditor;
  public editorConfig: EditorConfig = {
    licenseKey: 'GPL', // bản miễn phí mã nguồn mở
    plugins: [
      Essentials, Paragraph, Heading, Bold, Italic, Underline, Strikethrough,
      FontColor, FontSize, FontBackgroundColor, Alignment, Link, List, BlockQuote,
      HorizontalLine, Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize,
      ImageUpload, ImageInsert, AutoImage, Base64UploadAdapter, Table, TableToolbar,
      SourceEditing,
    ],
    toolbar: {
      items: [
        'undo', 'redo', '|', 'heading', '|',
        'bold', 'italic', 'underline', 'strikethrough', '|',
        'fontSize', 'fontColor', 'fontBackgroundColor', '|',
        'alignment', 'bulletedList', 'numberedList', '|',
        'link', 'insertImage', 'insertTable', 'blockQuote', 'horizontalLine', '|',
        'sourceEditing',
      ],
      shouldNotGroupWhenFull: false,
    },
    image: {
      toolbar: [
        'imageStyle:inline', 'imageStyle:block', 'imageStyle:side', '|',
        'toggleImageCaption', 'imageTextAlternative', 'resizeImage',
      ],
    },
    table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'] },
    placeholder: 'Nhập nội dung chi tiết fashion (có thể chèn hình, bảng...)',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _service: FashionAPIService
  ) {}

  ngOnInit(): void {
    this._service.getStyles().subscribe({ next: (data) => (this.styles = data) });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this._service.getFashion(id).subscribe({
        next: (data) => (this.fashion = data),
        error: (err) => (this.errMessage = err.message),
      });
    }
  }

  // Chọn file hình -> chuyển thành chuỗi Base64 (giống Bài 55)
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => (this.fashion.thumbnail = reader.result!.toString());
    reader.onerror = (error) => console.log('Error: ', error);
    reader.readAsDataURL(file);
  }

  save() {
    this.errMessage = '';
    if (!this.fashion.fashion_subject.trim() || !this.fashion.style.trim()) {
      this.errMessage = 'Vui lòng nhập Tiêu đề và Style';
      return;
    }
    this.saving = true;
    const request = this.isEdit
      ? this._service.putFashion(this.fashion)
      : this._service.postFashion(this.fashion);

    request.subscribe({
      // Lưu thành công -> quay về màn hình danh sách
      next: () => this.router.navigate(['/fashions']),
      error: (err) => {
        this.errMessage = err.message;
        this.saving = false;
      },
    });
  }

  cancel() {
    this.router.navigate(['/fashions']);
  }
}
