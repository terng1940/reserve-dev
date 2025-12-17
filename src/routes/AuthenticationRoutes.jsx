import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 1 routing
const ReservePage = Loadable(lazy(() => import('views/pages/authentication/reserve-page/ReservePage')));

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            index: true,
            element: <Navigate to="/reserve-page" replace />
        },
        {
            path: '/reserve-page',
            element: <ReservePage />
        }
    ]
};

export default AuthenticationRoutes;
