import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';
import { FC, useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { useDispatch } from '../../services/store';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { IngredientDetails, OrderInfo } from '../../components';
import { Modal } from '../modal/modal';
import { ProtectedRoute } from '../protected/protected-route';
import { checkUserAuth } from '../../services/slices/authSlice';
import {
  saveBackgroundLocation,
  selectBackgroundLocation
} from '../../services/slices/orderSlice';
import { useSelector } from '../../services/store';

const App: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const dispatch = useDispatch();
  const backgroundLocation = useSelector(selectBackgroundLocation);

  useEffect(() => {
    if (location.state?.background) {
      dispatch(
        saveBackgroundLocation({
          pathname: location.state.background.pathname,
          search: location.state.background.search,
          hash: location.state.background.hash,
          state: location.state.background.state,
          key: location.state.background.key
        })
      );
    }
  }, [location, dispatch]);

  useEffect(() => {
    if (
      backgroundLocation &&
      (location.pathname.startsWith('/profile/orders/') ||
        location.pathname.startsWith('/feed/'))
    ) {
      navigate(location.pathname, {
        replace: true,
        state: { background: backgroundLocation }
      });
    }
  }, [backgroundLocation, location, navigate]);

  const handleModalClose = () => {
    dispatch(saveBackgroundLocation(undefined));
    navigate(-1);
  };

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Детали заказа' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
