
export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-slate-50 text-slate-600">
            <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wide">Name</th>
            <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wide">Email</th>
            <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wide">Department</th>
            <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wide">Designation</th>
            <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wide">Status</th>
            <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wide">Joining Date</th>
            <th className="py-3.5 px-4 text-center text-xs font-semibold uppercase tracking-wide">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white">
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp._id} className="hover:bg-slate-50/60 transition">
                <td className="py-3 px-4 text-sm font-semibold text-slate-900">{emp.name}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{emp.email}</td>
                <td className="py-3 px-4 text-sm text-slate-700">{emp.department}</td>
                <td className="py-3 px-4 text-sm text-slate-700">{emp.designation}</td>
                <td className="py-3 px-4 text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${
                      emp.status === "Active"
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-sm text-slate-600">
                  {new Date(emp.joiningDate).toLocaleDateString()}
                </td>

                <td className="py-3 px-4">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => onEdit(emp)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(emp._id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-10 text-slate-500">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}