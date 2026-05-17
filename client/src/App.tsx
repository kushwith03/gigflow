import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { AppRouter } from './routes';
import { useAuthStore } from './store/useAuthStore';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { Spinner } from './components/ui/Spinner';
import './index.css';

function AppContent() {
  const { initializeAuth, isInitialLoading } = useAuthStore();
  const { theme } = useTheme();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isInitialLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton theme={theme} />
      <AppRouter />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
