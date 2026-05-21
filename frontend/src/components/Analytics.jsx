
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

  const inactiveEmployees =
    totalEmployees - activeEmployees;

  const departmentData = [];

  const departments = [
    ...new Set(
      employees.map((emp) => emp.department)
    ),
  ];

  departments.forEach((dept) => {
    departmentData.push({
      department: dept,
      count: employees.filter(
        (emp) => emp.department === dept
      ).length,
    });
  });

  const statusData = [
    {
      name: "Active",
      value: activeEmployees,
    },
    {
      name: "Inactive",
      value: inactiveEmployees,
    },
  ];

  const STATUS_COLORS = ["#22c55e", "#ef4444"];

  return (
    <section aria-label="Analytics Overview" className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Summary */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Employees</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">Overview</h3>
          </div>
          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-100">
            Live
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 border border-slate-100">
            <span className="text-sm font-medium text-slate-600">Total</span>
            <span className="text-lg font-bold text-slate-900">{totalEmployees}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-green-50/60 px-4 py-3 border border-green-100">
            <span className="text-sm font-medium text-slate-600">Active</span>
            <span className="text-lg font-bold text-slate-900">{activeEmployees}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-red-50/60 px-4 py-3 border border-red-100">
            <span className="text-sm font-medium text-slate-600">Inactive</span>
            <span className="text-lg font-bold text-slate-900">{inactiveEmployees}</span>
          </div>
        </div>
      </div>

      {/* Department Bar Chart */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Analytics</p>
            <h3 className="mt-1 text-base font-bold text-slate-900">By Department</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Count</span>
        </div>

        <div className="mt-4 h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData}>
              <XAxis dataKey="department" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Pie Chart */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Analytics</p>
            <h3 className="mt-1 text-base font-bold text-slate-900">Status</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Distribution</span>
        </div>

        <div className="mt-4 h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" outerRadius={90} label>
                {statusData.map((_, index) => (
                  <Cell key={index} fill={STATUS_COLORS[index]} />
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