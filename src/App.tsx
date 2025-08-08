import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

// Use RELATIVE imports so it works even if you haven't added the "@" alias yet.
import ProjectsListPage from "./pages/projects/ProjectListPage";
import ProjectFormPage from "./pages/projects/ProjectFormPage";
import ProjectDetailPage from "./pages/projects/ProjectDetailPage";
// If any of these pages don't exist yet, you can comment them out temporarily.

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link to="/" className="font-semibold">
            Devnetiks
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/projects" className="hover:underline">
              Projects
            </Link>
            <Link to="/projects/new" className="hover:underline">
              New Project
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

function Home() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Welcome to Devnetiks</h1>
      <p className="text-gray-600">Use the nav to create or view projects.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Projects */}
          <Route path="/projects" element={<ProjectsListPage />} />
          <Route path="/projects/new" element={<ProjectFormPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
