import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Hiển thị nguyên HTML do WYSIWYG tạo ra (giữ lại style, hình base64...)
// Chỉ dùng cho nội dung do Admin nhập.
@Pipe({ name: 'safeHtml', standalone: false })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(html: string | null | undefined): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html || '');
  }
}
