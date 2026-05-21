import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Title Logo */}
        <div className="w-full sm:w-auto flex justify-end sm:justify-start">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Employee <span className="text-purple-600">Overview</span>
          </h1>
        </div>
      </div>
    </header>
  );
}