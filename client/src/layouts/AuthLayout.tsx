import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-none border border-transparent dark:border-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">GigFlow</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Lead Management System</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
