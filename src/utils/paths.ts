// paths.ts
// Central place to build Firestore collection/doc paths consistently.

export const paths = {
    organizations: () => `organizations`,
    organization: (id: string) => `organizations/${id}`,
  
    contacts: () => `contacts`,
    contact: (id: string) => `contacts/${id}`,
  
    users: () => `users`,
    user: (uid: string) => `users/${uid}`,
  
    projects: () => `projects`,
    project: (id: string) => `projects/${id}`,
  
    projectMembers: () => `projectMembers`,
  projectMember: (id: string) => `projectMembers/${id}`,
  
    milestones: () => `milestones`,
    milestone: (id: string) => `milestones/${id}`,
  
    tasks: () => `tasks`,
    task: (id: string) => `tasks/${id}`,
  
    approvals: () => `approvals`,
    approval: (id: string) => `approvals/${id}`,
  
    proposals: () => `proposals`,
    proposal: (id: string) => `proposals/${id}`,
  
    agreements: () => `agreements`,
    agreement: (id: string) => `agreements/${id}`,
  
    services: () => `services`,
    service: (id: string) => `services/${id}`,
  
    pricingRules: () => `pricingRules`,
    pricingRule: (id: string) => `pricingRules/${id}`,
  
    invoices: () => `invoices`,
    invoice: (id: string) => `invoices/${id}`,
  
    payments: () => `payments`,
    payment: (id: string) => `payments/${id}`,
  
    subscriptions: () => `subscriptions`,
    subscription: (id: string) => `subscriptions/${id}`,
  
    environments: () => `environments`,
    environment: (id: string) => `environments/${id}`,
  
    deploys: () => `deploys`,
    deploy: (id: string) => `deploys/${id}`,
  
    domains: () => `domains`,
    domain: (id: string) => `domains/${id}`,
  
    files: () => `files`,
    file: (id: string) => `files/${id}`,
  
    forms: () => `forms`,
    form: (id: string) => `forms/${id}`,
  
    quotes: () => `quotes`,
    quote: (id: string) => `quotes/${id}`,
  
    tickets: () => `tickets`,
    ticket: (id: string) => `tickets/${id}`,
  
    notifications: () => `notifications`,
    notification: (id: string) => `notifications/${id}`,
  
    activity: () => `activity`,
    activityItem: (id: string) => `activity/${id}`,
  
    jobs: () => `jobs`,
    job: (id: string) => `jobs/${id}`,
  
    webhookEvents: () => `webhookEvents`,
    webhookEvent: (id: string) => `webhookEvents/${id}`,
  } as const;
  