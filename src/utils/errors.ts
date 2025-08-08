// errors.ts
// Central app error for consistent handling & user-safe messages.

export class AppError extends Error {
    code?: string;
    details?: unknown;
  
    constructor(message: string, code?: string, details?: unknown) {
      super(message);
      this.name = "AppError";
      this.code = code;
      this.details = details;
    }
  }
  
  export function toUserMessage(e: unknown, fallback = "Something went wrong.") {
    if (e instanceof AppError) return e.message;
    if (e instanceof Error) return e.message;
    return fallback;
  }
  