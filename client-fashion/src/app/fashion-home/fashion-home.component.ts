import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fashion } from '../models/fashion';
import { FashionAPIService } from '../services/fashion-api.service';

// Một nhóm hiển thị: tên Style + các Fashion thuộc Style đó
interface StyleGroup {
  style: string;
  items: Fashion[];
}

@Component({
  selector: 'app-fashion-home',
  templateUrl: './fashion-home.component.html',
  styleUrls: ['./fashion-home.component.css'],
  standalone: false,
})
export class FashionHomeComponent implements OnInit {
  groups: StyleGroup[] = [];
  styles: string[] = [];
  keyword = '';        // Style người dùng nhập / chọn
  currentStyle = '';   // Style đang lọc (lấy từ URL ?style=)
  errMessage = '';
  loading = false;

  constructor(
    private _service: FashionAPIService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._service.getStyles().subscribe({
      next: (data) => (this.styles = data),
      error: (err) => (this.errMessage = err.message),
    });

    // Mỗi khi ?style= trên URL thay đổi thì tải lại dữ liệu
    this.route.queryParamMap.subscribe((params) => {
      this.currentStyle = params.get('style') || '';
      this.keyword = this.currentStyle;
      this.loadData();
    });
  }

  loadData() {
    this.loading = true;
    this.errMessage = '';
    const source = this.currentStyle
      ? this._service.getFashionsByStyle(this.currentStyle) // API lọc theo Style
      : this._service.getFashions();                        // API lấy toàn bộ
    source.subscribe({
      next: (data) => {
        this.groups = this.groupByStyle(data);
        this.loading = false;
      },
      error: (err) => {
        this.errMessage = err.message;
        this.loading = false;
      },
    });
  }

  // Gom danh sách Fashion thành các nhóm theo Style
  groupByStyle(list: Fashion[]): StyleGroup[] {
    const map = new Map<string, Fashion[]>();
    for (const f of list) {
      if (!map.has(f.style)) map.set(f.style, []);
      map.get(f.style)!.push(f);
    }
    return Array.from(map, ([style, items]) => ({ style, items })).sort((a, b) =>
      a.style.localeCompare(b.style)
    );
  }

  // Tìm kiếm: nhập Style hoặc chọn từ dropdownlist
  search() {
    const style = this.keyword.trim();
    this.router.navigate(['/'], { queryParams: style ? { style } : {} });
  }

  onSelectStyle(style: string) {
    this.keyword = style;
    this.search();
  }

  clearSearch() {
    this.keyword = '';
    this.search();
  }

  // Hình lỗi -> thay bằng hình mặc định
  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'no-image.svg';
  }
}
