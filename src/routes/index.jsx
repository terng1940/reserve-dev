import { createBrowserRouter } from 'react-router-dom';

import AuthenticationRoutes from './AuthenticationRoutes';

// ==============================|| ROUTING RENDER ||============================== //
const router = createBrowserRouter([AuthenticationRoutes], {
    basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
