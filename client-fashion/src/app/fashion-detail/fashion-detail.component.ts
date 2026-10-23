import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
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
  related: Fashion[] = []; // các Fashion khác cùng Style
  errMessage = '';

  constructor(private route: ActivatedRoute, private _service: FashionAPIService) {}

  ngOnInit(): void {
    // Dùng paramMap để khi bấm sang Fashion liên quan thì trang tự cập nhật
    this.route.paramMap
      .pipe(switchMap((p) => this._service.getFashion(p.get('id')!)))
      .subscribe({
        next: (data) => {
          this.fashion = data;
          window.scrollTo(0, 0);
          this.loadRelated(data);
        },
        error: (err) => (this.errMessage = err.message),
      });
  }

  loadRelated(f: Fashion) {
    this._service.getFashionsByStyle(f.style).subscribe({
      next: (list) => (this.related = list.filter((x) => x._id !== f._id).slice(0, 4)),
    });
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'no-image.svg';
  }
}
