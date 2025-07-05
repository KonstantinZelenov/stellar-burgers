import { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { orderBurgerApi } from '../../utils/burger-api';
import {
  clearConstructor,
  selectConstructorItems
} from '../../services/slices/burgerConstructorSlice';
import { fetchUserOrders } from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { bun, ingredients } = useSelector(selectConstructorItems);
  const [orderRequest, setOrderRequest] = useState(false);
  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = async () => {
    if (!user) {
      navigate('/login', { state: { from: 'constructor' } });
      return;
    }

    if (!bun || orderRequest) return;

    setOrderRequest(true);
    try {
      const ingredientsIds = [
        bun._id,
        ...ingredients.map((item) => item._id),
        bun._id
      ];
      const res = await orderBurgerApi(ingredientsIds);
      setOrderModalData(res.order);
      dispatch(clearConstructor());
      await dispatch(fetchUserOrders());

      navigate('/');
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
    } finally {
      setOrderRequest(false);
    }
  };

  const closeOrderModal = () => {
    setOrderModalData(null);
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce((sum, item) => sum + item.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
