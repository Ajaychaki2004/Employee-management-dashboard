import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";
import Analytics from "../components/Analytics";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

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

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
            <Sidebar handleLogout={handleLogout} />

            <div className="lg:pl-64">
                <Navbar />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    {loading ? (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <div className="space-y-4 animate-pulse">
                                <div className="h-8 bg-slate-100 rounded-lg w-48" />
                                <div className="h-40 bg-slate-100 rounded-2xl w-full" />
                            </div>
                        </div>
                    ) : (
                        <Analytics employees={employees} />
                    )}
                </main>
            </div>
        </div>
    );
}