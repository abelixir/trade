import { NavLink, Outlet, useNavigate } from "react-router-dom";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/trades", label: "Trades", icon: "📈" },
  { path: "/add-trade", label: "Add Trade", icon: "➕" },
  { path: "/analytics", label: "Analytics", icon: "📉" },
  { path: "/journal", label: "Journal", icon: "📝" },
  { path: "/roadmap", label: "Roadmap", icon: "🗺️" },
];

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/80 border-r border-slate-800 flex flex-col backdrop-blur">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-emerald-400">Trade</span>
            <span className="text-white">Journal</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Track. Learn. Improve.</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 shadow-sm shadow-emerald-500/10"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white transition"
          >
            ← Back to Home
          </button>
          <div className="text-xs text-slate-600 px-4">v0.1.0</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}