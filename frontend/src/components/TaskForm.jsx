import { useState, useEffect } from "react";

const emptyForm = { title: "", description: "", status: "Todo", priority: "Medium", dueDate: "" };

export default function TaskForm({ initialTask, onSubmit, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title || "",
        description: initialTask.description || "",
        status: initialTask.status || "Todo",
        priority: initialTask.priority || "Medium",
        dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialTask]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-black bg-white p-6 shadow-xl dark:border-white dark:bg-black">
        <h2 className="mb-4 text-lg font-bold text-black dark:text-white">
          {initialTask ? "Edit Task" : "New Task"}
        </h2>

        {error && (
          <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-black dark:text-white">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-black bg-white px-3 py-2 text-sm text-black dark:border-white dark:bg-black dark:text-white"
              placeholder="e.g. Finish API docs"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black dark:text-white">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-md border border-black bg-white px-3 py-2 text-sm text-black dark:border-white dark:bg-black dark:text-white"
              placeholder="Optional details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-black dark:text-white">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-black bg-white px-3 py-2 text-sm text-black dark:border-white dark:bg-black dark:text-white"
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-black dark:text-white">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-black bg-white px-3 py-2 text-sm text-black dark:border-white dark:bg-black dark:text-white"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-black dark:text-white">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-black bg-white px-3 py-2 text-sm text-black dark:border-white dark:bg-black dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-transparent px-4 py-2 text-sm font-medium text-black transition-colors hover:border-black dark:text-white dark:hover:border-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
            >
              {initialTask ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
