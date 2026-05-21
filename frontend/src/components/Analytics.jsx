import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

export default function Analytics({ employees }) {
  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (emp) => emp.status === "Active"
  ).length;

  const inactiveEmployees = totalEmployees - activeEmployees;

  const departmentData = [];
  const departments = [
    ...new Set(
      employees
        .map((emp) => emp.department)
        .filter(Boolean)
    ),
  ];

  departments.forEach((dept) => {
    departmentData.push({
      department: dept,
      count: employees.filter((emp) => emp.department === dept).length,
    });
  });

  const statusData = [
    { name: "Active", value: activeEmployees },
    { name: "Inactive", value: inactiveEmployees },
  ];

  const STATUS_COLORS = ["#10b981", "#ef4444"]; // Clean emerald and rose colors

  const monthlyJoinedData = (() => {
    const countsByMonth = new Map();

    for (const emp of employees) {
      const raw = emp?.joiningDate || emp?.createdAt;
      if (!raw) continue;

      const date = new Date(raw);
      if (Number.isNaN(date.getTime())) continue;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const key = `${year}-${month}`;
      countsByMonth.set(key, (countsByMonth.get(key) || 0) + 1);
    }

    const sorted = [...countsByMonth.entries()].sort(([a], [b]) => a.localeCompare(b));

    const formatted = sorted.map(([key, count]) => {
      const [year, month] = key.split("-").map(Number);
      const labelDate = new Date(year, (month || 1) - 1, 1);
      const label = new Intl.DateTimeFormat(undefined, { month: "short" }).format(labelDate);
      return { month: `${label} ${year}`, count };
    });

    return formatted.slice(-6);
  })();

  return (
    // Main 12-column Grid Layout
    <section aria-label="Analytics Dashboard" className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      
      {/* ---------------------------------------------------------------------- */}
      {/* STAT CARDS: Each takes 4 columns out of 12 on large screens (4 + 4 + 4 = 12) */}
      {/* ---------------------------------------------------------------------- */}
      
      {/* Card: Total Employees */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-600" />
        <p className="text-sm font-semibold text-slate-500 tracking-wide">Total Employees</p>
        <p className="mt-2 text-4xl font-bold text-slate-900 tracking-tight">{totalEmployees}</p>
      </div>

      {/* Card: Active Employees */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
        <p className="text-sm font-semibold text-slate-500 tracking-wide">Active Employees</p>
        <p className="mt-2 text-4xl font-bold text-slate-900 tracking-tight">{activeEmployees}</p>
      </div>

      {/* Card: Inactive Employees */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
        <p className="text-sm font-semibold text-slate-500 tracking-wide">Inactive Employees</p>
        <p className="mt-2 text-4xl font-bold text-slate-900 tracking-tight">{inactiveEmployees}</p>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* CHARTS LAYER: Each chart takes up 4 columns out of 12 on large screens */}
      {/* ---------------------------------------------------------------------- */}

      {/* Department-wise Count */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Department-wise</p>
            <h3 className="mt-1 text-base font-bold text-slate-900">Count</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Employees</span>
        </div>

        <div className="mt-4 h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="department" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" fill="#a855f7" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Joined Employees */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Monthly Joined</p>
            <h3 className="mt-1 text-base font-bold text-slate-900">Employees</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Last 6 Months</span>
        </div>

        <div className="mt-4 h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyJoinedData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employee Status Distribution */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Employee Status</p>
            <h3 className="mt-1 text-base font-bold text-slate-900">Distribution</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Active vs Inactive</span>
        </div>

        <div className="mt-4 h-60 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={4}>
                {statusData.map((_, index) => (
                  <Cell key={index} fill={STATUS_COLORS[index]} className="focus:outline-none" />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </section>
  );
}