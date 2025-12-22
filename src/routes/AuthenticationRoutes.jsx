import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import RoutePaths from './routePaths';
import { element } from 'prop-types';

// login option 1 routing
const ReservePage = Loadable(lazy(() => import('views/pages/authentication/reserve-page/ReservePage')));
const PaymentSuccess = Loadable(lazy(() => import('views/pages/authentication/reserve-page/PaymentSuccess')));

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            index: true,
            element: <Navigate to="/reserve-page" replace />
        },
        {
            path: RoutePaths.reservePage,
            element: <ReservePage />
        },
        {
            path: RoutePaths.paymentSuccess,
            element: <PaymentSuccess />
        }
    ]
};

export default AuthenticationRoutes;
