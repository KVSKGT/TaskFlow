import { useEffect, useState } from "react";
import api from "../api/axios.js";
import StatsCard from "../components/StatsCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/tasks/analytics/summary");
        setAnalytics(data.analytics);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="w-full px-6 py-8">
      <h1 className="text-2xl font-extrabold text-black dark:text-white">
        Welcome, {user?.name?.split(" ")[0]} 👋
      </h1>
      <p className="mt-1 text-black dark:text-white">Here's a snapshot of your tasks.</p>

      {loading && <p className="mt-8 text-black dark:text-white">Loading analytics...</p>}
      {error && (
        <div className="mt-8 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      {analytics && !loading && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatsCard label="Total Tasks" value={analytics.total} accent="black" />
          <StatsCard label="Completed" value={analytics.completed} accent="green" />
          <StatsCard label="Pending" value={analytics.pending} accent="amber" />
          <StatsCard label="Completion %" value={`${analytics.completionPercentage}%`} accent="slate" />
        </div>
      )}

      {analytics && !loading && (
        <div className="mt-6 rounded-xl border border-black bg-white p-5 dark:border-white dark:bg-black">
          <p className="mb-2 text-sm font-medium text-black dark:text-white">Progress</p>
          <div className="h-3 w-full overflow-hidden rounded-full border border-black bg-white dark:border-white dark:bg-black">
            <div
              className="h-full rounded-full bg-black dark:bg-white transition-all"
              style={{ width: `${analytics.completionPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
