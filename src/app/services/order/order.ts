import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiBaseUrl = 'http://localhost:4000/api/v1/order';

  constructor(private http: HttpClient, private router: Router) {}

  placeOrder(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post<any>(this.apiBaseUrl, {}, { headers }).pipe(
      map(response => response.data),
      catchError(this.handleError('placeOrder'))
    );
  }

  getOrders(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any>(this.apiBaseUrl, { headers }).pipe(
      map(response => response.data || []),
      catchError(this.handleError('getOrders', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.error?.message === 'jwt expired' || error.error?.message === 'jwt malformed') {
        localStorage.removeItem('token');
        this.router.navigate(['/auth']);
      }
      console.error(`${operation} failed:`, error);
      return throwError(() => new Error(error.error?.message || 'An error occurred'));
    };
  }
}