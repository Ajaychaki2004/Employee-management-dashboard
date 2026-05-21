
import { useEffect, useState } from "react";

export default function EmployeeForm({
  onSubmit,
  selectedEmployee,
  clearSelection,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    status: "Active",
    joiningDate: "",
  });

  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        name: selectedEmployee.name || "",
        email: selectedEmployee.email || "",
        department: selectedEmployee.department || "",
        designation: selectedEmployee.designation || "",
        status: selectedEmployee.status || "Active",
        joiningDate:
          selectedEmployee.joiningDate?.split("T")[0] || "",
      });
    }
  }, [selectedEmployee]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);

    setFormData({
      name: "",
      email: "",
      department: "",
      designation: "",
      status: "Active",
      joiningDate: "",
    });

    clearSelection();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {selectedEmployee ? "Edit Employee" : "Add Employee"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage employee details and status.
          </p>
        </div>

        {selectedEmployee && (
          <button
            type="button"
            onClick={clearSelection}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            Clear
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Employee name"
            value={formData.name}
            onChange={handleChange}
            required
            className="block w-full rounded-xl border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input
            type="email"
            name="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="block w-full rounded-xl border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
          <input
            type="text"
            name="department"
            placeholder="e.g. Engineering"
            value={formData.department}
            onChange={handleChange}
            required
            className="block w-full rounded-xl border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Designation</label>
          <input
            type="text"
            name="designation"
            placeholder="e.g. Designer"
            value={formData.designation}
            onChange={handleChange}
            required
            className="block w-full rounded-xl border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="block w-full rounded-xl border-0 py-2.5 pl-3 pr-8 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm bg-white cursor-pointer transition"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Joining date</label>
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            required
            className="block w-full rounded-xl border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm transition"
          />
        </div>

        <button
          type="submit"
          className="md:col-span-2 flex w-full justify-center rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition"
        >
          {selectedEmployee ? "Update Employee" : "Add Employee"}
        </button>
      </form>
    </div>
  );
}