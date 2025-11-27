import { Injectable, signal, computed } from '@angular/core';

export type Role = 'ADMIN' | 'USER' | null;

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _token = signal<string | null>(null);
  private readonly _role = signal<Role>(null);

  readonly token = computed(() => this._token());
  readonly role = computed(() => this._role());
  readonly isAuthenticated = computed(() => !!this._token());

  constructor() {
    this.loadFromStorage();
  }

  loadFromStorage() {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role') as Role | null;
    if (token) this._token.set(token);
    if (role) this._role.set(role);
  }

  setAuth(token: string, role: Role) {
    this._token.set(token);
    this._role.set(role);
    localStorage.setItem('access_token', token);
    if (role) localStorage.setItem('role', role);
  }

  clear() {
    this._token.set(null);
    this._role.set(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
  }
}
