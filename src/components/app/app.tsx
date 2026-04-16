import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { PATHS } from '../../utils/constants';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/ingredients-slice';
import { useDispatch } from '../../services/store';
import { getUser } from '../../services/user-slice';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;
  const handleCloseModal = () => navigate(-1);

  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path={PATHS.HOME} element={<ConstructorPage />} />
        <Route
          path={PATHS.MODAL_INGREDIENTS_ID}
          element={<IngredientDetails />}
        />
        <Route path={PATHS.FEED} element={<Feed />} />
        <Route path={PATHS.FEED_ID} element={<OrderInfo />} />

        <Route element={<ProtectedRoute forAuthorized={false} />}>
          <Route path={PATHS.LOGIN} element={<Login />} />
          <Route path={PATHS.REGISTER} element={<Register />} />
          <Route path={PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={PATHS.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute forAuthorized />}>
          <Route path={PATHS.PROFILE}>
            <Route index element={<Profile />} />
            <Route path={PATHS.PROFILE_ORDERS} element={<ProfileOrders />} />
            <Route path={PATHS.PROFILE_ORDERS_ID} element={<OrderInfo />} />
          </Route>
        </Route>

        <Route path={PATHS.NOT_FOUND} element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path={PATHS.MODAL_FEED_NUMBER}
            element={
              <Modal title={'Детали заказа'} onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path={PATHS.MODAL_INGREDIENTS_ID}
            element={
              <Modal title={`Детали ингредиента`} onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute forAuthorized />}>
            <Route
              path={PATHS.MODAL_PROFILE_ORDERS_NUMBER}
              element={
                <Modal title={'Детали заказа'} onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
