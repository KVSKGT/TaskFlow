import { useEffect, useState, useCallback } from "react";
import api from "../api/axios.js";
import TaskCard from "../components/TaskCard.jsx";
import TaskForm from "../components/TaskForm.jsx";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // filters + search + sort + pagination
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/tasks", {
        params: { status, priority, search, sortBy, order, page, limit: 6 },
      });
      setTasks(data.tasks);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [status, priority, search, sortBy, order, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // reset to page 1 whenever a filter/search/sort changes
  useEffect(() => {
    setPage(1);
  }, [status, priority, search, sortBy, order]);

  const handleCreateOrUpdate = async (form) => {
    if (editingTask) {
      await api.put(`/tasks/${editingTask._id}`, form);
    } else {
      await api.post("/tasks", form);
    }
    setEditingTask(null);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.patch(`/tasks/${id}/complete`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  return (
    <div className="w-full px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-black dark:text-white">Your Tasks</h1>
        <button
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          className="rounded-md border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
        >
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div className="mt-5 flex flex-wrap gap-3">
        <input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-black bg-white px-3 py-2 text-sm text-black dark:border-white dark:bg-black dark:text-white"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-black bg-white px-3 py-2 text-sm text-black dark:border-white dark:bg-black dark:text-white"
        >
          <option value="">All statuses</option>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-md border border-black bg-white px-3 py-2 text-sm text-black dark:border-white dark:bg-black dark:text-white"
        >
          <option value="">All priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-md border border-black bg-white px-3 py-2 text-sm text-black dark:border-white dark:bg-black dark:text-white"
        >
          <option value="createdAt">Sort: Newest</option>
          <option value="dueDate">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
          <option value="title">Sort: Title</option>
        </select>
        <button
          onClick={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}
          className="rounded-md border border-black bg-white px-3 py-2 text-sm text-black transition-colors hover:bg-black hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
        >
          {order === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>
        {(status || priority || search || sortBy !== "createdAt" || order !== "desc") && (
          <button
            onClick={() => {
              setStatus("");
              setPriority("");
              setSearch("");
              setSortBy("createdAt");
              setOrder("desc");
            }}
            className="rounded-md text-sm font-medium text-black underline transition-colors hover:opacity-70 dark:text-white"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Loading / Error / Empty states */}
      {loading && <p className="mt-8 text-black dark:text-white">Loading tasks...</p>}
      {error && (
        <div className="mt-8 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}
      {!loading && !error && tasks.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-black bg-white p-12 text-center dark:border-white dark:bg-black">
          <p className="text-lg font-medium text-black dark:text-white">No tasks yet-let's get started!</p>
          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
            className="mt-4 rounded-md border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
          >
            + New Task
          </button>
        </div>
      )}

      {/* Task grid */}
      {!loading && !error && tasks.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={(t) => {
                setEditingTask(t);
                setShowForm(true);
              }}
              onDelete={handleDelete}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-black bg-white px-3 py-1.5 text-sm text-black transition-colors hover:bg-black hover:text-white disabled:opacity-40 dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
          >
            Previous
          </button>
          <span className="text-sm text-black dark:text-white">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-black bg-white px-3 py-1.5 text-sm text-black transition-colors hover:bg-black hover:text-white disabled:opacity-40 dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
          >
            Next
          </button>
        </div>
      )}

      {showForm && (
        <TaskForm
          initialTask={editingTask}
          onSubmit={handleCreateOrUpdate}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}
