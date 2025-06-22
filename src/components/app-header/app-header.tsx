import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector, RootState } from '../../services/store';

export const AppHeader: FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return <AppHeaderUI userName={user?.name} />;
};
