import { NavLink } from "react-router-dom";

export default function Sidebar({ handleLogout }) {
  // Modern navigation data array equipped with their corresponding router paths
  const navItems = [
    {
      name: "Overview",
      path: "/", // Directs to your main dashboard view
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.505-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      name: "Employees",
      path: "/employees", // Matches your exact route path
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A4.617 4.617 0 0 1 14.124 21c-.424.18-.873.3-1.34.34a11.31 11.31 0 0 1-5.567 0 4.62 4.62 0 0 1-1.34-.34 4.616 4.616 0 0 1-.876-.766V19.13M21 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6 18.75a.75.75 0 0 1-.75-.75V6.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 .75.75v3c0 .25.115.485.312.641l2.438 1.95c.22.176.312.46.23.731l-.75 2.5a.75.75 0 0 1-.72.534H6Z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-white border-r border-slate-100 z-30">
      
      {/* Sidebar Identity Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100">
        <div className="h-9 w-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
          E
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
          <p className="text-base font-bold text-slate-900 leading-tight">HR Suite</p>
        </div>
      </div>

      {/* Navigation Block */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          return (
            <NavLink
              key={item.name}
              to={item.path}
              // The end prop ensures "/" only matches the exact home route and not every route
              end={item.path === "/"} 
              className={({ isActive }) =>
                `w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition duration-150 group ${
                  isActive
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600 transition"}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  
                  {isActive && (
                    <span className="text-[11px] font-bold rounded-full bg-white/20 px-2 py-0.5 tracking-wide uppercase">
                      Live
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer Action */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 shadow-sm hover:bg-red-50 hover:text-red-700 active:bg-red-100 transition duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Logout
        </button>
      </div>
      
    </aside>
  );
}