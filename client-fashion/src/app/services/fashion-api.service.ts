import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Fashion } from '../models/fashion';

// Client chỉ cần các API đọc dữ liệu của "server-fashion" (port 4000)
@Injectable({ providedIn: 'root' })
export class FashionAPIService {
  constructor(private _http: HttpClient) {}

  getFashions(): Observable<Fashion[]> {
    return this._http.get<Fashion[]>('/fashions').pipe(catchError(this.handleError));
  }

  getFashionsByStyle(style: string): Observable<Fashion[]> {
    return this._http
      .get<Fashion[]>('/fashions/style/' + encodeURIComponent(style))
      .pipe(catchError(this.handleError));
  }

  getStyles(): Observable<string[]> {
    return this._http.get<string[]>('/styles').pipe(catchError(this.handleError));
  }

  getFashion(id: string): Observable<Fashion> {
    return this._http.get<Fashion>('/fashions/' + id).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    const msg = error.error?.message || error.message;
    return throwError(() => new Error(msg));
  }
}
