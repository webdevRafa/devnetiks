# Devnetiks

Public marketing and contact website for **Devnetiks LLC**, built with React, TypeScript, Tailwind CSS, and Vite. The navbar uses Devnetiks with the supplied emblem; every page identifies Devnetiks LLC as the owner.

## Development

Use Node.js 22.12+ (or a supported newer LTS release).

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

## Contact delivery — one-time activation required

The form at `/start` submits directly to [FormSubmit](https://formsubmit.co/documentation) for delivery to **devnetiks@gmail.com**. It uses native browser validation, a honeypot, and FormSubmit's default CAPTCHA. The visitor's email is used for Reply-To. No account, database, backend function, or API key is required by this application.

Before accepting inquiries:

1. Submit a test inquiry from the deployed website and complete the provider's spam check.
2. Open the FormSubmit activation email sent to devnetiks@gmail.com (check spam) and activate the form.
3. Submit another test from the production domain and confirm both delivery and Reply-To. Repeat activation if the provider requests it for another domain.

Delivery is not verified until this activation and mailbox test are complete. FormSubmit handles the request off-site; the form discloses this to visitors. After submission, the provider returns visitors to `/thank-you` on the same domain. A direct mailto link is available on every page if the service is unavailable. Never put sensitive information in test submissions.

## Deployment

Pushes to the branch connected to Vercel use the existing Git deployment integration. Build command: `npm run build`; output directory: `dist`. `vercel.json` supplies SPA rewrites so direct visits and refreshes at `/start` and `/thank-you` work. No Firebase environment variables are needed.

## Removed functionality

Authentication, client/admin dashboards, organizations, projects, invoices, quotes, CRM utilities, Firebase initialization, and their unused dependencies have been removed. Old application URLs fall back to the public homepage. The existing Firebase service and any previously stored records are not changed by this repository update; retire those separately if no other application uses them.

The original user-supplied emblem is in `public/devnetiks-emblem.png`, used by the navbar, confirmation page, favicon, and touch icon.
