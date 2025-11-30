/**
 * A service that manages a cache for HTTP requests to avoid redundant calls
 * and to store responses with a time-to-live (TTL) mechanism.
 * 
 * It allows setting and retrieving cached values, as well as managing
 * in-flight requests to prevent duplicate HTTP calls for the same key.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

type CacheEntry = {
    value: unknown;
    timestamp: number;
};

@Injectable({ providedIn: 'root' })
export class RequestCacheService {
    private readonly store = new Map<string, CacheEntry>();
    private readonly inflight = new Map<string, Observable<unknown>>();

    /**
     * Returns the cached result or null if:
     * - there is no entry
     * - or the TTL has expired
     */
    get<T>(key: string, ttlMs: number): T | null {
        const entry = this.store.get(key);
        if (!entry) return null;

        const age = Date.now() - entry.timestamp;
        if (age > ttlMs) {
            this.store.delete(key);
            return null;
        }

        return entry.value as T;
    }

    set<T>(key: string, value: T): void {
        this.store.set(key, { value, timestamp: Date.now() });
    }

    /** In-flight request handling (to avoid sending duplicate HTTP calls for the same key) */
    getInflight<T>(key: string): Observable<T> | null {
        const obs = this.inflight.get(key);
        return (obs as Observable<T>) ?? null;
    }

    setInflight<T>(key: string, obs: Observable<T>): void {
        this.inflight.set(key, obs as Observable<unknown>);
    }

    clearInflight(key?: string): void {
        if (key) {
            this.inflight.delete(key);
        } else {
            this.inflight.clear();
        }
    }


    clearAll(): void {
        this.store.clear();
        this.inflight.clear();
    }
}
