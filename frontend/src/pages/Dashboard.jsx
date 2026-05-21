    import { useEffect, useMemo, useState } from "react";
    import { useNavigate } from "react-router-dom";
    import API from "../api/axios";
    import EmployeeTable from "../components/EmployeeTable";
    import Analytics from "../components/Analytics";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

    export default function Dashboard() {
        const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        employeeId: null,
        employeeName: "",
    });

        const handleLogout = () => {
            localStorage.removeItem("token");
            navigate("/login");
        };

        const openEmployeesForEdit = (employee) => {
            navigate("/employees", { state: { editEmployee: employee } });
        };

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

    // Fetch Employees
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

    // Helper to reset pagination back to page 1 when filter conditions shift
    const handleFilterChange = (setter, value) => {
        setter(value);
        setCurrentPage(1);
    };


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
                setCurrentPage((prev) => prev - 1);
            }
        } catch (error) {
            console.error("Failed to delete employee:", error);
        } finally {
            closeDeleteModal();
        }
    };

    const handleEditFromTable = (employee) => {
        openEmployeesForEdit(employee);
    };

    // Filter Logic
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

    // Pagination Logic
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEmployees = filteredEmployees.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const departments = useMemo(() => {
        return [...new Set(employees.map((emp) => emp.department).filter(Boolean))];
    }, [employees]);

    const employeeListPreview = useMemo(() => {
        return filteredEmployees.slice(0, 6);
    }, [filteredEmployees]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
            <Sidebar handleLogout={handleLogout} />

            {/* Main */}
            <div className="lg:pl-64">
                {/* Top Header */}
                <Navbar />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    {/* Top cards/charts */}
                    <Analytics employees={employees} />

                    {/* Table + list */}
                    <section aria-label="Employee Schedule and List" className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
                                <div className="divide-y divide-slate-100">
                                    <EmployeeTable employees={paginatedEmployees} onEdit={handleEditFromTable} onDelete={requestDeleteEmployee} />

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

                        <div className="lg:col-span-4 space-y-6">
                            {/* Current Project (static) */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500">Current Project</p>
                                        <h3 className="mt-1 text-base font-bold text-slate-900">Employee Management</h3>
                                    </div>
                                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-100">
                                        On progress
                                    </span>
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400">Start date</p>
                                        <p className="mt-1 text-sm font-semibold text-slate-700">1 Oct 2026</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400">Due date</p>
                                        <p className="mt-1 text-sm font-semibold text-slate-700">30 Oct 2026</p>
                                    </div>
                                </div>
                            </div>

                            {/* Employee list */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-bold text-slate-900">List Employee</h3>
                                    <span className="text-xs font-semibold text-slate-400">Preview</span>
                                </div>

                                {loading ? (
                                    <div className="mt-4 space-y-3 animate-pulse">
                                        <div className="h-10 bg-slate-100 rounded-xl" />
                                        <div className="h-10 bg-slate-100 rounded-xl" />
                                        <div className="h-10 bg-slate-100 rounded-xl" />
                                    </div>
                                ) : employeeListPreview.length === 0 ? (
                                    <p className="mt-4 text-sm text-slate-500">No employees yet.</p>
                                ) : (
                                    <div className="mt-4 space-y-3">
                                        {employeeListPreview.map((emp) => {
                                            const initials = (emp.name || "?")
                                                .split(" ")
                                                .filter(Boolean)
                                                .slice(0, 2)
                                                .map((x) => x[0]?.toUpperCase())
                                                .join("");

                                            return (
                                                <div key={emp._id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                                                            {initials || "?"}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900 leading-tight">{emp.name}</p>
                                                            <p className="text-xs text-slate-500">{emp.designation || emp.department || "Employee"}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => openEmployeesForEdit(emp)}
                                                        className="text-xs font-semibold text-purple-700 hover:text-purple-600"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
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
                    <div
                        className="absolute inset-0 bg-slate-900/30"
                        onClick={closeDeleteModal}
                    />

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