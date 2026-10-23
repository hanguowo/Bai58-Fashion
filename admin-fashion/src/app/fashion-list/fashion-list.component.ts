import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fashion } from '../models/fashion';
import { FashionAPIService } from '../services/fashion-api.service';

@Component({
  selector: 'app-fashion-list',
  templateUrl: './fashion-list.component.html',
  styleUrls: ['./fashion-list.component.css'],
  standalone: false,
})
export class FashionListComponent implements OnInit {
  fashions: Fashion[] = [];
  styles: string[] = [];
  selectedStyle = '';
  errMessage = '';
  loading = false;

  constructor(private _service: FashionAPIService, private router: Router) {}

  ngOnInit(): void {
    this.loadStyles();
    this.loadFashions();
  }

  loadStyles() {
    this._service.getStyles().subscribe({
      next: (data) => (this.styles = data),
      error: (err) => (this.errMessage = err.message),
    });
  }

  // Nếu có chọn Style thì gọi API lọc, ngược lại lấy toàn bộ
  loadFashions() {
    this.loading = true;
    const source = this.selectedStyle
      ? this._service.getFashionsByStyle(this.selectedStyle)
      : this._service.getFashions();
    source.subscribe({
      next: (data) => {
        this.fashions = data;
        this.loading = false;
      },
      error: (err) => {
        this.errMessage = err.message;
        this.loading = false;
      },
    });
  }

  viewDetail(f: Fashion) {
    this.router.navigate(['/fashions', f._id]);
  }

  addNew() {
    this.router.navigate(['/fashions/new']);
  }

  edit(f: Fashion) {
    this.router.navigate(['/fashions/edit', f._id]);
  }

  // Phải xác nhận trước khi xóa
  remove(f: Fashion) {
    if (!confirm(`Bạn có chắc muốn xóa fashion "${f.fashion_subject}"?`)) return;
    this._service.deleteFashion(f._id).subscribe({
      next: () => {
        this.loadFashions();
        this.loadStyles();
      },
      error: (err) => (this.errMessage = err.message),
    });
  }
}
