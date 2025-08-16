import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// --- Public pages (new) ---
import PublicHomePage from "@/pages/PublicHomePage";
import LoginPage from "@/pages/LoginPage";
import StartProjectPage from "@/pages/StartProjectPage";
import ThankYouPage from "@/pages/ThankYouPage";

// --- Admin shell + guard + pages (yours) ---
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

const router = createBrowserRouter([
  // -------- Public --------
  { path: "/", element: <PublicHomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/start", element: <StartProjectPage /> },
  { path: "/thank-you", element: <ThankYouPage /> },

  // -------- Admin (guarded) --------
  {
    path: "/app",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="projects" replace /> },

      // Dashboard
      { path: "dashboard", element: <DashboardHome /> },

      // Organizations
      { path: "organizations", element: <OrgListPage /> },
      { path: "organizations/new", element: <OrgFormPage /> },
      { path: "organizations/:id", element: <OrgDetailPage /> },
      { path: "organizations/:id/edit", element: <OrgFormPage /> },

      // Projects
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
  },

  // -------- Legacy redirects (keep your old links working) --------
  { path: "/dashboard", element: <Navigate to="/app/dashboard" replace /> },

  {
    path: "/organizations",
    element: <Navigate to="/app/organizations" replace />,
  },
  {
    path: "/organizations/new",
    element: <Navigate to="/app/organizations/new" replace />,
  },
  {
    path: "/organizations/:id",
    element: <Navigate to="/app/organizations/:id" replace />,
  },
  {
    path: "/organizations/:id/edit",
    element: <Navigate to="/app/organizations/:id/edit" replace />,
  },

  { path: "/projects", element: <Navigate to="/app/projects" replace /> },
  {
    path: "/projects/new",
    element: <Navigate to="/app/projects/new" replace />,
  },
  {
    path: "/projects/:id",
    element: <Navigate to="/app/projects/:id" replace />,
  },
  {
    path: "/projects/:id/edit",
    element: <Navigate to="/app/projects/:id/edit" replace />,
  },

  { path: "/invoices", element: <Navigate to="/app/invoices" replace /> },
  {
    path: "/invoices/new",
    element: <Navigate to="/app/invoices/new" replace />,
  },
  {
    path: "/invoices/:id",
    element: <Navigate to="/app/invoices/:id" replace />,
  },
  {
    path: "/invoices/:id/edit",
    element: <Navigate to="/app/invoices/:id/edit" replace />,
  },

  // Fallback
  { path: "*", element: <Navigate to="/" replace /> },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;
