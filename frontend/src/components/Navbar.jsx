import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import DarkModeToggle from "./DarkModeToggle.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex w-full items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-brand-600 dark:text-brand-400">
          <span className="inline-block h-3 w-3 rounded-full bg-brand-500" />
          TaskFlow
        </Link>

        {user && (
          <nav className="flex items-center gap-6 text-base font-medium">
            <Link to="/dashboard" className="rounded-md px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              Dashboard
            </Link>
            <Link to="/tasks" className="rounded-md px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              Tasks
            </Link>
            <DarkModeToggle />
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 dark:bg-brand-600 dark:hover:bg-brand-500"
            >
              Logout
            </button>
          </nav>
        )}
        {!user && (
          <nav className="flex items-center gap-6 text-base font-medium">
            <DarkModeToggle />
            <Link to="/login" className="rounded-md px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              Login
            </Link>
            <Link to="/signup" className="rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">
              Sign up
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
