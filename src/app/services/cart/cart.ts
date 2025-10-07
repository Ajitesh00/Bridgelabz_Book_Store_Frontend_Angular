import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiBaseUrl = 'http://localhost:4000/api/v1/cart';

  constructor(private http: HttpClient, private router: Router) {}

  addToCart(bookId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post<any>(this.apiBaseUrl, { book_id: bookId, quantity: 1 }, { headers }).pipe(
      map(response => response.data),
      catchError(this.handleError('addToCart'))
    );
  }

  getCart(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any>(this.apiBaseUrl, { headers }).pipe(
      tap(response => console.log('Raw Cart API Response:', response)),
      map(response => response.data || []),
      catchError(this.handleError('getCart', []))
    );
  }

  updateCart(cartItemId: string, body: { quantity: number }): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put<any>(`${this.apiBaseUrl}/${cartItemId}`, body, { headers }).pipe(
      map(response => response.data),
      catchError(this.handleError('updateCart'))
    );
  }

  removeFromCart(cartItemId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.delete<any>(`${this.apiBaseUrl}/${cartItemId}`, { headers }).pipe(
      map(response => response.data),
      catchError(this.handleError('removeFromCart'))
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
