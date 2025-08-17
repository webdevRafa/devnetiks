import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Public
import PublicHomePage from "@/pages/PublicHomePage";
import LoginPage from "@/pages/LoginPage";
import StartProjectPage from "@/pages/StartProjectPage";
import ThankYouPage from "@/pages/ThankYouPage";
import AfterLogin from "@/pages/AfterLogin";

// Admin
import DashboardLayout from "@/layouts/DashboardLayout";
import AuthGuard from "@/components/AuthGuard";
import DashboardHome from "@/pages/DashboardHome";

import OrgListPage from "@/pages/organizations/OrgListPage";
import OrgFormPage from "@/pages/organizations/OrgFormPage";
import OrgDetailPage from "@/pages/organizations/OrgDetailPage";

import ProjectListPage from "@/pages/projects/ProjectListPage";
import ProjectFormPage from "@/pages/projects/ProjectFormPage";
import ProjectDetailPage from "@/pages/projects/ProjectDetailPage";

import InvoiceListPage from "@/pages/invoices/InvoiceListPage";
import InvoiceFormPage from "@/pages/invoices/InvoiceFormPage";
import InvoiceDetailPage from "@/pages/invoices/InvoiceDetailPage";

// Quotes (admin)
import QuoteListPage from "@/pages/quotes/QuoteListPage";
import QuoteDetailPage from "@/pages/quotes/QuoteDetailPage";
import QuoteRespondPage from "@/pages/quotes/QuoteRespondPage";
// Client portal (the three files we created)
import ClientLayout from "@/pages/client/ClientLayout";
import ClientHomePage from "@/pages/client/ClientHomePage";
import ClientOrgPage from "@/pages/client/ClientOrgPage";

const router = createBrowserRouter([
  // -------- Public --------
  { path: "/", element: <PublicHomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/after-login", element: <AfterLogin /> },
  { path: "/start", element: <StartProjectPage /> },
  { path: "/thank-you", element: <ThankYouPage /> },

  // -------- Admin (guarded) --------
  {
    path: "/app",
    element: (
      <AuthGuard requireRole={["admin", "manager", "staff"]}>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="projects" replace /> },
      { path: "dashboard", element: <DashboardHome /> },

      // Organizations (admin-only)
      { path: "organizations", element: <OrgListPage /> },
      { path: "organizations/new", element: <OrgFormPage /> },
      { path: "organizations/:id", element: <OrgDetailPage /> },
      { path: "organizations/:id/edit", element: <OrgFormPage /> },

      // Projects

      // Requests / Quotes
      { path: "quotes", element: <QuoteListPage /> },
      { path: "quotes/:id", element: <QuoteDetailPage /> },
      { path: "quotes/:id/respond", element: <QuoteRespondPage /> },

      { path: "projects", element: <ProjectListPage /> },
      { path: "projects/new", element: <ProjectFormPage /> },
      { path: "projects/:id", element: <ProjectDetailPage /> },
      { path: "projects/:id/edit", element: <ProjectFormPage /> },

      // Invoices
      { path: "invoices", element: <InvoiceListPage /> },
      { path: "invoices/new", element: <InvoiceFormPage /> },
      { path: "invoices/:id", element: <InvoiceDetailPage /> },
      { path: "invoices/:id/edit", element: <InvoiceFormPage /> },
    ],
  }, // <-- this comma matters

  // -------- Client (guarded for client and higher) --------
  {
    path: "/client",
    element: (
      <AuthGuard
        requireRole={["client", "viewer", "staff", "manager", "admin"]}
      >
        <ClientLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <ClientHomePage /> },
      { path: "organization", element: <ClientOrgPage /> },
    ],
  }, // <-- this comma also matters

  // -------- Legacy redirects (keep old links working) --------
  { path: "/dashboard", element: <Navigate to="/app/dashboard" replace /> },
  {
    path: "/organizations",
    element: <Navigate to="/app/organizations" replace />,
  },
  { path: "/projects", element: <Navigate to="/app/projects" replace /> },
  { path: "/invoices", element: <Navigate to="/app/invoices" replace /> },

  // Fallback
  { path: "*", element: <Navigate to="/" replace /> },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;
