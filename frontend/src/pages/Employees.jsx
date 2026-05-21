import { useEffect, useState } from "react";
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
            <button
              type="button"
              onClick={() => {
                setSelectedEmployee(null);
                scrollToForm();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add New Employee
            </button>
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
            {loading ? (
              /* Premium Pulse Wireframe Loader */
              <div className="p-8 space-y-4 animate-pulse">
                <div className="h-8 bg-slate-100 rounded-lg w-full" />
                <div className="h-12 bg-slate-100 rounded-lg w-full" />
                <div className="h-12 bg-slate-100 rounded-lg w-full" />
                <div className="h-12 bg-slate-100 rounded-lg w-full" />
              </div>
            ) : (
              /* Mounting your custom table component with props */
              <EmployeeTable
                employees={employees}
                onEdit={handleEditEmployee}
                onDelete={requestDeleteEmployee}
              />
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