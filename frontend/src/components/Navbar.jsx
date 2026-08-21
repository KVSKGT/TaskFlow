import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import DarkModeToggle from "./DarkModeToggle.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-brand-600 dark:text-brand-400">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-500" />
          TaskFlow
        </Link>

        {user && (
          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link to="/dashboard" className="rounded-md px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
              Dashboard
            </Link>
            <Link to="/tasks" className="rounded-md px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
              Tasks
            </Link>
            <DarkModeToggle />
            <span className="ml-2 hidden text-slate-500 sm:inline">Hi, {user.name.split(" ")[0]}</span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="ml-2 rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700 dark:bg-brand-600 dark:hover:bg-brand-500"
            >
              Logout
            </button>
          </nav>
        )}
        {!user && (
          <nav className="flex items-center gap-2 text-sm font-medium">
            <DarkModeToggle />
            <Link to="/login" className="rounded-md px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
              Login
            </Link>
            <Link to="/signup" className="rounded-md bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700">
              Sign up
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
