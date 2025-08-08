// types.ts — Devnetiks LLC schema (Firestore + Stripe)
// ----------------------------------------------------------------------------------
// Notes
// - Firestore-friendly types. Replace Date with Timestamp in app layer if you prefer.
// - Currency stored in cents (integers).
// - Modules are optional. Remove what you don’t use yet without breaking others.

// --------------------------------- Shared / Primitives ---------------------------------
export type ID = string;
export type CurrencyCents = number; // $25.00 -> 2500
export type FirestoreDate = Date | { seconds: number; nanoseconds: number };

export type Role = 'client' | 'admin' | 'contractor';
export type ProjectStatus = 'planning' | 'active' | 'onHold' | 'completed' | 'archived';
export type QuoteProjectType = 'brochure' | 'booking' | 'ecommerce' | 'custom';
export type QuoteType = 'fixed' | 'hourly' | 'retainer';
export type QuoteStatus = 'new' | 'reviewed' | 'quoted' | 'accepted' | 'declined' | 'archived';
export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
export type AgreementType = 'msa' | 'sow' | 'nda' | 'dpa';
export type AgreementStatus = 'draft' | 'sent' | 'signed' | 'declined' | 'voided';
export type TaskStatus = 'todo' | 'inProgress' | 'blocked' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type InvoiceStatus = 'unpaid' | 'paid' | 'past_due' | 'void' | 'refunded';
export type PaymentStatus = 'succeeded' | 'failed' | 'refunded' | 'requires_action';
export type SubscriptionStatus =
  | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'paused';
export type TicketStatus = 'open' | 'pending' | 'closed';
export type EnvironmentType = 'prod' | 'staging' | 'dev';
export type DeployStatus = 'queued' | 'building' | 'succeeded' | 'failed';
export type NotificationType =
  | 'quote.created'
  | 'proposal.sent'
  | 'proposal.accepted'
  | 'invoice.issued'
  | 'invoice.due_soon'
  | 'payment.succeeded'
  | 'payment.failed'
  | 'project.updated'
  | 'ticket.updated';

// --------------------------------- Auth / Users ---------------------------------
export interface User {
  uid: ID; // Firebase Auth UID
  role: Role;
  name: string;
  email: string;
  companyName?: string;
  phone?: string;
  avatarUrl?: string;
  stripeCustomerId?: string;
  createdAt: FirestoreDate;
  lastLogin?: FirestoreDate;
}

// --------------------------------- CRM: Organizations & Contacts ---------------------------------
export interface Organization {
  id: ID;
  name: string;
  website?: string;
  billingEmail?: string;
  billingAddress?: Address;
  notes?: string;
  createdAt: FirestoreDate;
  updatedAt?: FirestoreDate;
}

export interface Contact {
  id: ID;
  orgId: ID; // organizations/{id}
  name: string;
  email: string;
  phone?: string;
  role?: 'owner' | 'billing' | 'technical' | 'marketing' | 'other';
  isPrimary?: boolean;
  createdAt: FirestoreDate;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string; // ISO-2
}

// --------------------------------- Projects ---------------------------------
export interface Project {
  id: ID;
  clientId: ID;        // users/{uid}
  orgId?: ID;          // organizations/{id}
  title: string;
  description?: string;
  status: ProjectStatus;
  stack: string[];     // ['React','TypeScript','Tailwind','Firebase']
  stakeholderContactIds?: ID[];
  startDate?: FirestoreDate;
  dueDate?: FirestoreDate;
  priceQuote?: CurrencyCents;
  subscriptionId?: ID; // subscriptions/{id}
  assets?: ID[];       // files/{id}
  notes?: string;
  createdAt: FirestoreDate;
  updatedAt: FirestoreDate;
}

export interface ProjectMember {
  id: ID;
  projectId: ID;
  userId: ID;               // users/{uid}
  role: 'owner' | 'collab' | 'viewer';
  invitedAt: FirestoreDate;
  acceptedAt?: FirestoreDate;
}

export interface Milestone {
  id: ID;
  projectId: ID;
  title: string;
  dueDate?: FirestoreDate;
  status: 'planned' | 'inProgress' | 'completed' | 'cancelled';
  createdAt: FirestoreDate;
}

export interface Task {
  id: ID;
  projectId: ID;
  title: string;
  description?: string;
  assigneeIds?: ID[];
  status: TaskStatus;
  priority?: TaskPriority;
  estimateHours?: number;
  labels?: string[];
  createdAt: FirestoreDate;
  updatedAt?: FirestoreDate;
  dueDate?: FirestoreDate;
  blockedByTaskIds?: ID[];
}

export interface Approval {
  id: ID;
  projectId: ID;
  deliverable: string;       // e.g. "Homepage v2"
  requestedAt: FirestoreDate;
  approvedAt?: FirestoreDate;
  requestedById?: ID;        // user id
  approvedByContactId?: ID;  // contact id
  notes?: string;
}

// --------------------------------- Quotes & Proposals ---------------------------------
export interface AttachedFileRef {
  fileId: ID; // files/{id}
  name?: string;
}

export interface Quote {
  id: ID;
  submittedByUserId?: ID;    // users/{uid}
  orgId?: ID;                // organizations/{id}
  contactId?: ID;            // contacts/{id}

  // intake
  clientName: string;        // if not authenticated
  email: string;
  phone?: string;

  projectType: QuoteProjectType;
  quoteType: QuoteType;
  budget?: string;           // "$1k–$3k"
  timeline?: string;         // "ASAP", "2-4 weeks"
  details?: string;

  featuresRequested?: string[];
  estimatedHours?: number;
  hourlyRate?: CurrencyCents;

  attachedFiles?: AttachedFileRef[];
  intendedAudience?: string;
  businessGoals?: string;

  status: QuoteStatus;
  respondedBy?: ID;          // admin uid
  createdAt: FirestoreDate;
  updatedAt?: FirestoreDate;
}

export interface ProposalLineItem {
  sku?: string;              // service SKU
  title: string;
  description?: string;
  quantity: number;          // hours or units
  unit: 'hour' | 'fixed' | 'unit';
  unitPrice: CurrencyCents;
  total: CurrencyCents;      // quantity * unitPrice
}

export interface Proposal {
  id: ID;
  orgId?: ID;
  projectId?: ID;
  quoteId?: ID;
  version: number;
  status: ProposalStatus;

  scopeItems: ProposalLineItem[];
  subtotal: CurrencyCents;
  discount?: CurrencyCents;
  tax?: CurrencyCents;
  total: CurrencyCents;

  validUntil?: FirestoreDate;
  sentAt?: FirestoreDate;
  signedAt?: FirestoreDate;
  signedByContactId?: ID;

  notes?: string;
  pdfUrl?: string;
  createdAt: FirestoreDate;
  updatedAt?: FirestoreDate;
}

// --------------------------------- Agreements / E‑Sign ---------------------------------
export interface Agreement {
  id: ID;
  orgId?: ID;
  projectId?: ID;
  type: AgreementType;
  status: AgreementStatus;
  signerContactId?: ID;
  provider: 'dropboxSign' | 'stripeSign' | 'custom';
  fileUrl?: string;
  envelopeId?: string;
  sentAt?: FirestoreDate;
  signedAt?: FirestoreDate;
  createdAt: FirestoreDate;
}

// --------------------------------- Billing: Services & Pricing Rules ---------------------------------
export interface Service {
  id: ID;
  sku: string;
  name: string;
  defaultUnit: 'hour' | 'fixed' | 'unit';
  defaultRate?: CurrencyCents;
  tags?: string[];
  description?: string;
  createdAt: FirestoreDate;
}

export interface PricingRule {
  id: ID;
  serviceSku: string;
  tier?: 'basic' | 'pro' | 'enterprise';
  rate?: CurrencyCents; // override defaultRate
  minHours?: number;
  bundleItems?: Array<{ sku: string; quantity: number }>;
}

// --------------------------------- Subscriptions, Invoices, Payments ---------------------------------
export interface Subscription {
  id: ID; // Stripe subscription id
  clientId: ID;          // users/{uid}
  orgId?: ID;
  projectId?: ID;

  status: SubscriptionStatus;
  plan?: string;         // human label
  items: Array<{ priceId: string; quantity: number }>;
  amount?: CurrencyCents;

  discountId?: string;
  couponId?: string;
  taxRateIds?: string[];
  currency?: string;     // 'usd'

  defaultPaymentMethodId?: string;
  collectionMethod?: 'charge_automatically' | 'send_invoice';
  billingCycleAnchor?: FirestoreDate;
  trialEndsAt?: FirestoreDate;

  stripeCustomerId: string;
  stripePriceId?: string;
  cancelAt?: FirestoreDate;
  startDate?: FirestoreDate;
  createdAt: FirestoreDate;
  updatedAt?: FirestoreDate;
}

export interface InvoiceLineItem {
  description: string;
  amount: CurrencyCents;
  quantity?: number; // default 1
  sku?: string;      // service SKU
}

export interface Invoice {
  id: ID; // Stripe invoice id or internal id
  clientId: ID;
  orgId?: ID;
  projectId?: ID;

  lineItems: InvoiceLineItem[];
  subtotal: CurrencyCents;
  discount?: CurrencyCents;
  tax?: CurrencyCents;
  totalAmount: CurrencyCents;
  currency: string; // 'usd'

  status: InvoiceStatus;
  dueDate?: FirestoreDate;
  billingAddress?: Address;
  pdfUrl?: string;
  createdAt: FirestoreDate;
  updatedAt?: FirestoreDate;
}

export interface Payment {
  id: ID;              // Stripe payment_intent or charge id
  clientId: ID;
  orgId?: ID;
  projectId?: ID;
  invoiceId?: ID;      // invoices/{id}
  subscriptionId?: ID; // subscriptions/{id}

  amount: CurrencyCents;
  currency: string;
  status: PaymentStatus;
  method: string;      // 'card'
  receiptUrl?: string;
  createdAt: FirestoreDate;
}

// --------------------------------- Files / Assets ---------------------------------
export interface FileAsset {
  id: ID;
  projectId?: ID;
  orgId?: ID;
  name: string;
  path: string;      // storage path
  url?: string;      // signed/public URL
  mime: string;
  size: number;      // bytes
  checksum?: string; // md5/sha1 for dedupe
  uploadedBy: ID;    // users/{uid}
  access: 'client' | 'internal';
  createdAt: FirestoreDate;
}

// --------------------------------- Forms (Generic Submissions) ---------------------------------
export interface FormSubmission {
  id: ID;
  type: string;                     // 'contact' | 'callback-request' | 'custom-intake'
  data: Record<string, any>;        // flexible payload
  submittedBy?: ID;                 // users/{uid}
  createdAt: FirestoreDate;
}

// --------------------------------- Notifications & Activity Log ---------------------------------
export interface Notification {
  id: ID;
  userId: ID;
  type: NotificationType;
  data?: Record<string, any>;
  readAt?: FirestoreDate;
  createdAt: FirestoreDate;
}

export interface Activity {
  id: ID;
  actorId: ID; // user who did the thing
  scope:
    | 'project' | 'quote' | 'invoice' | 'proposal'
    | 'subscription' | 'ticket' | 'file' | 'agreement';
  scopeId: ID; // e.g. projectId
  action:
    | 'created' | 'updated' | 'deleted' | 'status_changed'
    | 'commented' | 'attached' | 'detached' | 'sent'
    | 'accepted' | 'rejected' | 'signed';
  data?: Record<string, any>;
  at: FirestoreDate;
}

// --------------------------------- Support Tickets ---------------------------------
export interface TicketMessage {
  authorId?: ID;         // internal user
  authorContactId?: ID;  // external contact
  body: string;
  at: FirestoreDate;
}

export interface Ticket {
  id: ID;
  orgId?: ID;
  projectId?: ID;
  contactId?: ID; // requester
  subject: string;
  status: TicketStatus;
  priority?: TaskPriority;
  messages: TicketMessage[];
  attachments?: AttachedFileRef[];
  createdAt: FirestoreDate;
  updatedAt?: FirestoreDate;
}

// --------------------------------- Hosting / Deploys / Domains ---------------------------------
export interface Environment {
  id: ID;
  projectId: ID;
  type: EnvironmentType;
  url?: string;
  provider?: 'vercel' | 'firebase' | 'netlify' | 'other';
  notes?: string;
}

export interface Deploy {
  id: ID;
  projectId: ID;
  envId: ID;     // environments/{id}
  commit?: string;
  byUserId?: ID;
  at: FirestoreDate;
  url?: string;
  status: DeployStatus;
}

export interface Domain {
  id: ID;
  projectId: ID;
  host: string;  // 'example.com'
  verification?: {
    type: 'dns' | 'http';
    token?: string;
    status?: 'pending' | 'verified' | 'failed';
  };
  sslStatus?: 'provisioning' | 'active' | 'expired' | 'failed';
  createdAt: FirestoreDate;
}

// --------------------------------- Automation Jobs / Webhooks ---------------------------------
export interface Job {
  id: ID;
  type:
    | 'invoice.reminder'
    | 'backup'
    | 'syncStripe'
    | 'clean.tempFiles'
    | 'report.dailySummary'
    | 'notify.upcomingRenewals';
  schedule?: string; // cron/RRULE
  lastRunAt?: FirestoreDate;
  nextRunAt?: FirestoreDate;
  status?: 'idle' | 'running' | 'error' | 'done';
  logs?: Array<{ at: FirestoreDate; level: 'info' | 'warn' | 'error'; message: string }>;
}

export interface WebhookEvent {
  id: ID; // provider event id or our hash id
  provider: 'stripe' | 'dropboxSign' | 'other';
  type: string; // e.g. 'invoice.payment_succeeded'
  payloadHash: string; // idempotency guard
  processedAt?: FirestoreDate;
  status: 'received' | 'processed' | 'error';
  attempts?: number;
  createdAt: FirestoreDate;
}

// --------------------------------- Firestore Collection Name Constants ---------------------------------
export const COLLECTIONS = {
  users: 'users',
  organizations: 'organizations',
  contacts: 'contacts',
  projects: 'projects',
  projectMembers: 'projectMembers',   // if top-level; else use subcollection
  milestones: 'milestones',           // typically subcollection under projects
  tasks: 'tasks',                     // typically subcollection under projects
  approvals: 'approvals',             // typically subcollection under projects
  quotes: 'quotes',
  proposals: 'proposals',
  agreements: 'agreements',
  services: 'services',
  pricingRules: 'pricingRules',
  subscriptions: 'subscriptions',
  invoices: 'invoices',
  payments: 'payments',
  files: 'files',
  forms: 'forms',
  notifications: 'notifications',
  activity: 'activity',
  tickets: 'tickets',
  environments: 'environments',
  deploys: 'deploys',
  domains: 'domains',
  jobs: 'jobs',
  webhookEvents: 'webhookEvents',
} as const;
