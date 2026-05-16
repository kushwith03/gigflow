import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { AppRouter } from './routes';
import { useAuthStore } from './store/useAuthStore';
import { Spinner } from './components/ui/Spinner';
import './index.css';

function App() {
  const { initializeAuth, isInitialLoading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <AppRouter />
    </>
  );
}

export default App;
