import { Outlet } from 'react-router-dom';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/utils/cn';

const DashboardLayout = () => {
  const { isSidebarOpen } = useUIStore();

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
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
          <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
