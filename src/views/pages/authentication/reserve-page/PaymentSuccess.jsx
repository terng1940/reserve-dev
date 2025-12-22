import { useLocation, useNavigate } from 'react-router-dom';
import RoutePaths from 'routes/routePaths';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const PaymentSuccess = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const handleBackToReserve = () => {
        navigate(RoutePaths.reservePage, {
            replace: true
        });
    };

    return (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
            <h1>ชำระเงินสำเร็จ 🎉</h1>
            <p>เลขอ้างอิง: {state?.ref}</p>

            <Button variant="contained" color="primary" sx={{ mt: 4, px: 4, py: 1.5 }} onClick={handleBackToReserve}>
                กลับไปหน้าจอง
            </Button>
        </Box>
    );
};

export default PaymentSuccess;
