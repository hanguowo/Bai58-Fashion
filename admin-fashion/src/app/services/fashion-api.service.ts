import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Fashion } from '../models/fashion';

// Gọi các API của "server-fashion" (port 4000) thông qua proxy.conf.json
@Injectable({ providedIn: 'root' })
export class FashionAPIService {
  constructor(private _http: HttpClient) {}

  // API 1: toàn bộ Fashion (đã sắp xếp ngày tạo giảm dần ở server)
  getFashions(): Observable<Fashion[]> {
    return this._http.get<Fashion[]>('/fashions').pipe(catchError(this.handleError));
  }

  // API 2: lọc Fashion theo Style
  getFashionsByStyle(style: string): Observable<Fashion[]> {
    return this._http
      .get<Fashion[]>('/fashions/style/' + encodeURIComponent(style))
      .pipe(catchError(this.handleError));
  }

  // Danh sách Style (cho dropdownlist)
  getStyles(): Observable<string[]> {
    return this._http.get<string[]>('/styles').pipe(catchError(this.handleError));
  }

  // API 3: một Fashion theo id
  getFashion(id: string): Observable<Fashion> {
    return this._http.get<Fashion>('/fashions/' + id).pipe(catchError(this.handleError));
  }

  // API 4: thêm mới
  postFashion(f: Fashion): Observable<Fashion> {
    return this._http.post<Fashion>('/fashions', f).pipe(catchError(this.handleError));
  }

  // API 5: chỉnh sửa
  putFashion(f: Fashion): Observable<Fashion> {
    return this._http.put<Fashion>('/fashions/' + f._id, f).pipe(catchError(this.handleError));
  }

  // API 6: xóa
  deleteFashion(id: string): Observable<Fashion> {
    return this._http.delete<Fashion>('/fashions/' + id).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    const msg = error.error?.message || error.message;
    return throwError(() => new Error(msg));
  }
}
