type Status = "active" | "reviewing" | "completed" | "cancelled" | "pending" | "accepted" | "rejected" | "withdrawn" | "new" | "interviewing" | "open" | "closed" | "paid";

const CONFIG: Record<Status, { label: string; className: string }> = {
  active:      { label: "Aktiv",        className: "bg-blue-50 text-blue-700 border-blue-200" },
  reviewing:   { label: "Under review", className: "bg-orange-light text-orange border-orange/25" },
  completed:   { label: "Afsluttet",    className: "bg-green-50 text-green-700 border-green-200" },
  cancelled:   { label: "Annulleret",   className: "bg-red-50 text-red-600 border-red-200" },
  pending:     { label: "Afventer",     className: "bg-orange-light text-orange border-orange/25" },
  accepted:    { label: "Accepteret",   className: "bg-green-50 text-green-700 border-green-200" },
  rejected:    { label: "Afvist",       className: "bg-red-50 text-red-600 border-red-200" },
  withdrawn:   { label: "Trukket",      className: "bg-gray-100 text-gray-500 border-gray-200" },
  new:         { label: "Ny",           className: "bg-blue-50 text-blue-700 border-blue-200" },
  interviewing:{ label: "Interview",    className: "bg-purple-50 text-purple-700 border-purple-200" },
  open:        { label: "Åben",         className: "bg-green-50 text-green-700 border-green-200" },
  closed:      { label: "Lukket",       className: "bg-gray-100 text-gray-500 border-gray-200" },
  paid:        { label: "Betalt",       className: "bg-green-50 text-green-700 border-green-200" },
};

export default function StatusBadge({ status }: { status: Status }) {
  const cfg = CONFIG[status] ?? { label: status, className: "bg-gray-100 text-gray-500 border-gray-200" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
