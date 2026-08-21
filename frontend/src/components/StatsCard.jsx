export default function StatsCard({ label, value, accent = "black" }) {
  const accents = {
    black: "text-black dark:text-white",
    green: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    slate: "text-black dark:text-white",
    brand: "text-black dark:text-white",
  };

  return (
    <div className="rounded-xl border border-black bg-white p-5 shadow-sm dark:border-white dark:bg-black">
      <p className="text-sm font-medium text-black dark:text-white">{label}</p>
      <p className={`mt-2 text-3xl font-extrabold ${accents[accent]}`}>{value}</p>
    </div>
  );
}
