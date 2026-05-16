import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';
import { ProtectedRoute, PublicRoute } from './RouteGuard';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import LeadsPage from '@/pages/dashboard/LeadsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/auth',
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <LeadsPage /> },
          { path: 'leads', element: <LeadsPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
