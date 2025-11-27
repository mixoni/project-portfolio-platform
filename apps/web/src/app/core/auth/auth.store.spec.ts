import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  it('should set and clear token', () => {
    const store = new AuthStore();
    store.setAuth('token', 'ADMIN');
    expect(store.isAuthenticated()).toBe(true);
    store.clear();
    expect(store.isAuthenticated()).toBe(false);
  });
});
