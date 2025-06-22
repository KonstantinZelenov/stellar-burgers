import { FC } from 'react';
import { useSelector } from '../../services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { Preloader } from '@ui';
import { fetchUserOrders } from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
