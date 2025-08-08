// permissions.ts
// Role-based checks that mirror your Firestore rules expectations.

export type Role = "admin" | "manager" | "staff" | "client" | "viewer";

export const Roles = {
  isAdmin(role?: Role) {
    return role === "admin";
  },
  canEditProject(role?: Role) {
    return role === "admin" || role === "manager";
  },
  canViewBilling(role?: Role) {
    return role === "admin" || role === "manager";
  },
  canCreateInvoice(role?: Role) {
    return role === "admin" || role === "manager";
  },
  canUploadFiles(role?: Role) {
    return role !== "viewer";
  },
  canReplyTickets(role?: Role) {
    return role !== "viewer";
  },
};
