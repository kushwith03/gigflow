import { Outlet, useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { LogOut, User as UserIcon, Moon, Sun, Menu } from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { isSidebarOpen, toggleSidebar, isDarkMode, toggleDarkMode } = useUIStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 font-bold text-primary-600 dark:text-primary-400">
          <span className={cn("transition-opacity", isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>
            GigFlow
          </span>
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1">
            <Menu size={20} />
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          {/* Nav items will go here */}
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-md bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400",
            !isSidebarOpen && "justify-center"
          )}>
            <Menu size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Leads</span>}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-8 z-20 transition-colors">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1 md:hidden">
                <Menu size={20} />
              </Button>
            )}
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">Leads</h2>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="text-gray-500 dark:text-gray-400 p-2">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
      ...

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                <UserIcon size={16} />
              </div>
              <span className="hidden md:inline font-medium">{user?.name}</span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 dark:text-gray-400">
              <LogOut size={18} className="sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>
        <main className="p-4 sm:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
