// status.ts
// Common state helpers for proposals, agreements, invoices, tickets, etc.

export type CommonStatus =
  | "draft"
  | "pending"
  | "active"
  | "approved"
  | "rejected"
  | "signed"
  | "void"
  | "paid"
  | "unpaid"
  | "overdue"
  | "archived"
  | "closed"
  | "open";

export const Status = {
  isFinal(s: CommonStatus) {
    return ["signed", "void", "paid", "rejected", "archived", "closed"].includes(s);
  },
  isOpen(s: CommonStatus) {
    return ["draft", "pending", "active", "approved", "open"].includes(s);
  },
  nextInvoiceStatus(s: CommonStatus): CommonStatus {
    if (s === "unpaid") return "paid";
    if (s === "paid") return "paid";
    if (s === "overdue") return "paid";
    return s;
  },
};
