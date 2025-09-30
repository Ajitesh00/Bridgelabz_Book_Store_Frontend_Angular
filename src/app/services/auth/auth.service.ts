import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BASE_URL = 'http://localhost:4000/api/v1';

  constructor(private http: HttpClient) {}

  loginUser(role: string, input: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/${role}/login`, input);
  }

  registerUser(role: string, input: { firstName: string; lastName: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/${role}/register`, input);
  }
}