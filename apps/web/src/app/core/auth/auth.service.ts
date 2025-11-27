import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthStore, Role } from './auth.store';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private store: AuthStore) {}

  login(username: string, password: string) {
    return this.http
      .post<{ accessToken: string }>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(res => {
          const role: Role = username === 'admin' ? 'ADMIN' : 'USER';
          this.store.setAuth(res.accessToken, role);
        }),
      );
  }

  logout() {
    this.store.clear();
  }
}
