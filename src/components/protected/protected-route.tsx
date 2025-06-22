import { Navigate, useLocation } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
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
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isLoading && !authChecked) {
      setAuthChecked(true);
    }
  }, [isLoading, authChecked]);

  if (!authChecked) {
    return <Preloader />;
  }

  if (error && !onlyUnAuth) {
    console.error('Auth error:', error);
    return (
      <Navigate
        to='/error'
        state={{
          from: location,
          error: 'Ошибка авторизации. Пожалуйста, войдите снова.'
        }}
        replace
      />
    );
  }

  if (onlyUnAuth && user) {
    const redirectTo = location.state?.from?.pathname || '/';
    return <Navigate to={redirectTo} replace />;
  }

  if (!onlyUnAuth && !user) {
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
