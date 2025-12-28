import { LayoutDashboard, FolderKanban, Calendar, Users, FileText, Settings, Briefcase } from 'lucide-react';
import type { PageView, UserRole } from '../App';

interface SidebarProps {
  currentPage: PageView;
  userRole: UserRole;
  onNavigate: (page: PageView) => void;
}

interface NavItem {
  id: PageView;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

export function Sidebar({ currentPage, userRole, onNavigate }: SidebarProps) {
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['admin', 'faculty', 'student'],
    },
    {
      id: 'projects',
      label: 'Project Evaluations',
      icon: <FolderKanban className="w-5 h-5" />,
      roles: ['admin', 'faculty', 'student'],
    },
    {
      id: 'reservations',
      label: 'Room & Desk Booking',
      icon: <Calendar className="w-5 h-5" />,
      roles: ['admin', 'faculty', 'student'],
    },
    {
      id: 'positions',
      label: 'Positions & Applications',
      icon: <Briefcase className="w-5 h-5" />,
      roles: ['admin', 'faculty', 'student'],
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <Users className="w-5 h-5" />,
      roles: ['admin'],
    },
  ];

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">APCMS</h2>
            <p className="text-xs text-gray-500">Efficiency You Can Trust.</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <p className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider">Main Menu</p>
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                currentPage === item.id || (currentPage === 'project-details' && item.id === 'projects')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Secondary Menu */}
        <div className="mt-8 space-y-1">
          <p className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider">System</p>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-blue-900 mb-1">Need Help?</p>
          <p className="text-xs text-blue-700">Contact support@campus.edu</p>
        </div>
      </div>
    </aside>
  );
}
