import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, PlusCircle, BarChart3, GraduationCap } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/children', icon: Users, label: 'Children' },
  { to: '/sessions/new', icon: PlusCircle, label: 'Session' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function MobileNav() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 z-40 lg:hidden">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900">CalmLearn</span>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 z-40 lg:hidden">
        <div className="flex items-center justify-around h-full">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                  isActive ? 'text-slate-900' : 'text-slate-400'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
