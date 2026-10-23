import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fashion } from '../models/fashion';
import { FashionAPIService } from '../services/fashion-api.service';

@Component({
  selector: 'app-fashion-detail',
  templateUrl: './fashion-detail.component.html',
  styleUrls: ['./fashion-detail.component.css'],
  standalone: false,
})
export class FashionDetailComponent implements OnInit {
  fashion: Fashion | null = null;
  errMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _service: FashionAPIService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this._service.getFashion(id).subscribe({
      next: (data) => (this.fashion = data),
      error: (err) => (this.errMessage = err.message),
    });
  }

  edit() {
    this.router.navigate(['/fashions/edit', this.fashion!._id]);
  }

  remove() {
    if (!this.fashion) return;
    if (!confirm(`Bạn có chắc muốn xóa fashion "${this.fashion.fashion_subject}"?`)) return;
    this._service.deleteFashion(this.fashion._id).subscribe({
      next: () => this.router.navigate(['/fashions']),
      error: (err) => (this.errMessage = err.message),
    });
  }
}
