const statusStyles = {
  Todo: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

const priorityStyles = {
  Low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  Medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  High: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default function TaskCard({ task, onEdit, onDelete, onComplete }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
        <div className="flex shrink-0 gap-1">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[task.status]}`}>
            {task.status}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {task.dueDate ? `Due ${new Date(task.dueDate).toLocaleDateString()}` : "No due date"}
        </span>
        <div className="flex gap-1 text-xs font-medium -mr-2">
          {task.status !== "Done" && (
            <button onClick={() => onComplete(task._id)} className="rounded px-2 py-1 text-emerald-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300">
              Complete
            </button>
          )}
          <button onClick={() => onEdit(task)} className="rounded px-2 py-1 text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-brand-400 dark:hover:bg-brand-900/30 dark:hover:text-brand-300">
            Edit
          </button>
          <button onClick={() => onDelete(task._id)} className="rounded px-2 py-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
