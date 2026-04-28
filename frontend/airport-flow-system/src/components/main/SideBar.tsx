import { NavLink } from "react-router";
import { LayoutDashboard, Plane, Clock, MapPin, Building2, Settings } from "lucide-react";

export function AirportSidebar() {
  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
    { path: "/flights", icon: Plane, label: "Flights" },
    { path: "/runway-slots", icon: Clock, label: "Runway Slots" },
    { path: "/stands", icon: MapPin, label: "Stands" },
    { path: "/airlines", icon: Building2, label: "Airlines" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Airport Ops</h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="px-4 py-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-medium">
              OP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Operador</p>
              <p className="text-xs text-muted-foreground">Turno: Manhã</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
