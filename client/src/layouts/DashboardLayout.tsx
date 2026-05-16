import { Outlet, useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { LogOut, User as UserIcon } from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { isSidebarOpen } = useUIStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Placeholder */}
      <aside 
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 font-bold text-primary-600">
          {isSidebarOpen ? "GigFlow" : "GF"}
        </div>
        <nav className="p-4">
          {/* Nav items will go here */}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                <UserIcon size={16} />
              </div>
              <span className="hidden sm:inline font-medium">{user?.name}</span>
              <span className="hidden sm:inline text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 capitalize">
                {user?.role}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500">
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
