import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

// Component Layout Imports
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeTable from "../components/EmployeeTable";

export default function EmployeesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    employeeId: null,
    employeeName: "",
  });

  const scrollToForm = () => {
    const el = document.getElementById("employee-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Fetch all employees from your API
  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const employee = location.state?.editEmployee;
    if (!employee) return;

    setSelectedEmployee(employee);
    requestAnimationFrame(() => scrollToForm());

    // Clear router state so refresh doesn't re-trigger edit
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  // Shared Authentication Logout Handlers
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    scrollToForm();
  };

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        (emp.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (emp.email || "").toLowerCase().includes(search.toLowerCase());

      const matchesDepartment = departmentFilter === "" || emp.department === departmentFilter;
      const matchesStatus = statusFilter === "" || emp.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [departmentFilter, employees, search, statusFilter]);

  const departments = useMemo(() => {
    return [...new Set(employees.map((emp) => emp.department).filter(Boolean))];
  }, [employees]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  // Add Employee
  const addEmployee = async (data) => {
    try {
      const res = await API.post("/employees", data);
      setEmployees((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Failed to add employee:", error);
    }
  };

  // Update Employee
  const updateEmployee = async (data) => {
    if (!selectedEmployee?._id) return;

    try {
      const res = await API.put(`/employees/${selectedEmployee._id}`, data);
      setEmployees((prev) => prev.map((emp) => (emp._id === selectedEmployee._id ? res.data : emp)));
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  const handleSubmit = (data) => {
    if (selectedEmployee) return updateEmployee(data);
    return addEmployee(data);
  };

  // Delete Handler passed safely into EmployeeTable
  const closeDeleteModal = () => {
    setDeleteModal({ open: false, employeeId: null, employeeName: "" });
  };

  useEffect(() => {
    if (!deleteModal.open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeDeleteModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteModal.open]);

  const requestDeleteEmployee = (id) => {
    const emp = employees.find((e) => e._id === id);
    setDeleteModal({
      open: true,
      employeeId: id,
      employeeName: emp?.name || "this employee",
    });
  };

  const confirmDeleteEmployee = async () => {
    if (!deleteModal.employeeId) return;

    try {
      await API.delete(`/employees/${deleteModal.employeeId}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== deleteModal.employeeId));

      // Reset page if deleting the last item on a page
      if (paginatedEmployees.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }
    } catch (error) {
      console.error("Failed to delete employee:", error);
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* 1. Left Fixed Navigation Rail Component */}
      <Sidebar handleLogout={handleLogout} />

      {/* 2. Responsive Content Container (Pushed right on large viewports) */}
      <div className="lg:pl-64">
        
        {/* Top Header Controls bar */}
        <Navbar />

        {/* Core Main View Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Section Dynamic Context Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Roster</h2>
              <p className="text-sm text-slate-500 mt-1">
                View, manage, and audit corporate account permissions across all internal structural entities.
              </p>
            </div>
            
            {/* Quick action button to skip over to management form */}
            
          </div>

          {/* Employee management form */}
          <section id="employee-form" aria-label="Employee Management" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <EmployeeForm
              onSubmit={handleSubmit}
              selectedEmployee={selectedEmployee}
              clearSelection={() => setSelectedEmployee(null)}
            />
          </section>

          {/* Master Employee Table Shell */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Search + filters */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:max-w-md relative">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => handleFilterChange(setSearch, e.target.value)}
                  className="w-full rounded-xl border-0 py-2.5 pl-4 pr-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm bg-white transition"
                />
              </div>

              <div className="flex flex-wrap w-full md:w-auto items-center gap-3 justify-end">
                <select
                  value={departmentFilter}
                  onChange={(e) => handleFilterChange(setDepartmentFilter, e.target.value)}
                  className="rounded-xl border-0 py-2.5 pl-3 pr-8 text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-600 sm:text-sm bg-white cursor-pointer transition"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
                  className="rounded-xl border-0 py-2.5 pl-3 pr-8 text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-600 sm:text-sm bg-white cursor-pointer transition"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {loading ? (
              /* Premium Pulse Wireframe Loader */
              <div className="p-8 space-y-4 animate-pulse">
                <div className="h-8 bg-slate-100 rounded-lg w-full" />
                <div className="h-12 bg-slate-100 rounded-lg w-full" />
                <div className="h-12 bg-slate-100 rounded-lg w-full" />
                <div className="h-12 bg-slate-100 rounded-lg w-full" />
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-16 px-4">
                <p className="text-slate-500 font-medium text-lg">No matching records found</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters.</p>
              </div>
            ) : (
              /* Mounting your custom table component with props */
              <div className="divide-y divide-slate-100">
                <EmployeeTable
                  employees={paginatedEmployees}
                  onEdit={handleEditEmployee}
                  onDelete={requestDeleteEmployee}
                />

                {totalPages > 1 && (
                  <div className="p-4 bg-white flex items-center justify-between border-t border-slate-100 px-6">
                    <span className="text-sm text-slate-500">
                      Showing page <span className="font-semibold text-slate-700">{currentPage}</span> of{" "}
                      <span className="font-semibold text-slate-700">{totalPages}</span>
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition"
                      >
                        Previous
                      </button>
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition hidden sm:inline-block ${
                              currentPage === pageNum
                                ? "bg-purple-600 text-white shadow-sm"
                                : "border border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </main>
      </div>

      {/* Delete confirmation modal */}
      {deleteModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm delete employee"
        >
          <div className="absolute inset-0 bg-slate-900/30" onClick={closeDeleteModal} />

          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900">Delete employee?</h3>
            <p className="mt-2 text-sm text-slate-600">
              This will permanently remove <span className="font-semibold">{deleteModal.employeeName}</span>.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteEmployee}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}   