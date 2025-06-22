import { FC } from 'react';
import { useSelector } from '../../services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { Preloader } from '@ui';
import {
  fetchUserOrders,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError
} from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p>Ошибка при загрузке заказов: {error}</p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
