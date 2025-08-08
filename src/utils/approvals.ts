// approvals.ts
// Simple approval state logic.

export type ApprovalState = "pending" | "approved" | "rejected";

export function canApprove(role: string) {
  // tighten later based on projectMembers role map
  return role === "admin" || role === "manager";
}

export function resolveApproval(current: ApprovalState, action: "approve" | "reject"): ApprovalState {
  if (current !== "pending") return current;
  return action === "approve" ? "approved" : "rejected";
}
