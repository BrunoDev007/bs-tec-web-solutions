import React from 'react';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import SecureLoginForm from './SecureLoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useSecureAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <SecureLoginForm />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;