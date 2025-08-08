import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import AuthGuard from "@/components/AuthGuard";

// Pages
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
  {
    path: "/",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/dashboard", element: <DashboardHome /> },
      // Organizations
      { path: "/organizations", element: <OrgListPage /> },
      { path: "/organizations/new", element: <OrgFormPage /> },
      { path: "/organizations/:id", element: <OrgDetailPage /> },
      { path: "/organizations/:id/edit", element: <OrgFormPage /> },
      // Projects
      { path: "/projects", element: <ProjectListPage /> },
      { path: "/projects/new", element: <ProjectFormPage /> },
      { path: "/projects/:id", element: <ProjectDetailPage /> },
      { path: "/projects/:id/edit", element: <ProjectFormPage /> },
      // Invoices
      { path: "/invoices", element: <InvoiceListPage /> },
      { path: "/invoices/new", element: <InvoiceFormPage /> },
      { path: "/invoices/:id", element: <InvoiceDetailPage /> },
      { path: "/invoices/:id/edit", element: <InvoiceFormPage /> },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;
