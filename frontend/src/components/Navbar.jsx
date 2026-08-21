import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import DarkModeToggle from "./DarkModeToggle.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 border-b border-black bg-white dark:border-white dark:bg-black">
      <div className="flex w-full items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-black dark:text-white">
          <span className="inline-block h-3 w-3 rounded-full bg-black dark:bg-white" />
          TaskFlow
        </Link>

        {user && (
          <nav className="flex items-center gap-6 text-base font-medium">
            <Link to="/dashboard" className="rounded-md px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
              Dashboard
            </Link>
            <Link to="/tasks" className="rounded-md px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
              Tasks
            </Link>
            <DarkModeToggle />
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="rounded-md border border-black bg-black px-4 py-2 text-white transition-colors hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
            >
              Logout
            </button>
          </nav>
        )}
        {!user && (
          <nav className="flex items-center gap-6 text-base font-medium">
            <DarkModeToggle />
            <Link to="/login" className="rounded-md px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
              Login
            </Link>
            <Link to="/signup" className="rounded-md border border-black bg-black px-4 py-2 text-white transition-colors hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white">
              Sign up
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
