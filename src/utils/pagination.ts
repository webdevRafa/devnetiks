// pagination.ts
// Generic cursor helpers for Firestore-ish pagination.

export interface Page<T> {
    items: T[];
    nextCursor?: string;
    hasMore: boolean;
  }
  
  export function emptyPage<T>(): Page<T> {
    return { items: [], hasMore: false };
  }
  