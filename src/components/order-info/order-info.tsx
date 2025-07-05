import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { TOrder } from '@utils-types';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';
import { selectUser } from '../../services/slices/authSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number?: string }>();
  const orderNumber = number ? parseInt(number) : 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const { orders: feedOrders } = useSelector((state) => state.feed);
  const { orders: profileOrders, currentOrder } = useSelector(
    (state) => state.orders
  );
  const allIngredients = useSelector((state) => state.ingredients.items);

  useEffect(() => {
    if (window.location.pathname.startsWith('/profile/orders') && !user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (orderNumber && !currentOrder) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [orderNumber, currentOrder, dispatch]);

  const orderData =
    currentOrder ||
    feedOrders.find((order: TOrder) => order.number === orderNumber) ||
    profileOrders.find((order: TOrder) => order.number === orderNumber);

  const orderInfo = useMemo(() => {
    if (!orderData || !allIngredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = allIngredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, allIngredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
