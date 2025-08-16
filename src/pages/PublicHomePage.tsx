import { Link } from "react-router-dom";

export default function PublicHomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-3xl font-bold mb-3">Devnetiks</h1>
        <p className="text-gray-600 mb-8">
          Modern web apps: quotes, proposals, contracts, billing, hosting,
          support.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/start"
            className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
          >
            Start a Project
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-white"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
