// firestore.ts
// Firestore helpers that don't leak SDK across your app.

import {
    Timestamp,
    serverTimestamp as fbServerTimestamp,
    type FirestoreDataConverter,
    type WithFieldValue,
    type QueryDocumentSnapshot,
    type SnapshotOptions,
  } from "firebase/firestore";
  
  export const serverTimestamp = fbServerTimestamp;
  
  export function fromTimestamp(t?: Timestamp | null): Date | null {
    return t ? t.toDate() : null;
  }
  
  export function toTimestamp(d?: Date | null): Timestamp | null {
    return d ? Timestamp.fromDate(d) : null;
  }
  
  // A generic converter that passes through but makes Date fields explicit if needed.
  export function passthroughConverter<T>(): FirestoreDataConverter<T> {
    return {
      toFirestore(modelObject: WithFieldValue<T>) {
        return modelObject as unknown as Record<string, unknown>;
      },
      fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
        return snapshot.data(options) as T;
      },
    };
  }
  