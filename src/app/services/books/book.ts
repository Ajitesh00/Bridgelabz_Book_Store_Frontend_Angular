import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Book {
  private apiBaseUrl = 'http://localhost:4000/api/v1/book';

  constructor(private http: HttpClient, private router: Router) {}

  fetchBooks(page: number = 1, limit: number = 8, sortBy: string = 'relevance', search: string = ''): Observable<{ books: any[]; totalRecords: number }> {
    const token = localStorage.getItem('token');
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy);
    if (search) {
      params = params.set('search', search);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(this.apiBaseUrl, { headers, params }).pipe(
      tap(response => console.log('API response:', response)),
      map(response => {
        // Handle nested response structures
        const books = response.data?.books || response.books || response.data?.data?.books || [];
        const totalRecords = response.data?.totalRecords || response.totalRecords || response.data?.data?.totalRecords || 0;
        return { books, totalRecords };
      }),
      catchError(this.handleError<{ books: any[]; totalRecords: number }>('fetchBooks', { books: [], totalRecords: 0 }))
    );
  }

  fetchBookById(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiBaseUrl}/${id}`, { headers }).pipe(
      tap(response => console.log('Book API response:', response)),
      map(response => response.data?.data || response.data || response),
      catchError(this.handleError<any>('fetchBookById', null))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      if (error.error?.message === 'Session Expired' || error.error?.message === 'jwt malformed') {
        localStorage.removeItem('token');
        this.router.navigate(['/auth']);
      }
      return of(result as T);
    };
  }
}