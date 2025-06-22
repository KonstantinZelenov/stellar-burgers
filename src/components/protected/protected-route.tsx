import { Navigate, useLocation } from 'react-router-dom';
import { FC, useEffect } from 'react';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const location = useLocation();
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <Preloader />;
  }

  if (onlyUnAuth) {
    return user ? (
      <Navigate to={location.state?.from || '/'} replace />
    ) : (
      <>{children}</>
    );
  }

  if (!user) {
    return (
      <Navigate
        to='/login'
        state={{
          from: location,
          message: 'Для доступа требуется авторизация'
        }}
        replace
      />
    );
  }

  return <>{children}</>;
};
