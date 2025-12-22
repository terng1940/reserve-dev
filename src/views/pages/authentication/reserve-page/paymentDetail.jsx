import React, { useEffect, useRef, useState } from 'react';
import { useStores } from 'contexts/StoreContext';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import RoutePaths from 'routes/routePaths';

import {
    QrCode2 as QrCodeIcon,
    AccessTime as TimeIcon,
    CalendarToday as CalendarIcon,
    Payment as PaymentIcon,
    LocalHospital as HospitalIcon,
    ArrowForward as ArrowForwardIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const PaymentDetail = ({ data }) => {
    const ref = data?.payment_information?.ref;
    const uuidRef = data.reserve_uuid;
    const { qrStatusApiStore } = useStores();
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const intervalRef = useRef(null);
    const navigate = useNavigate();

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const formatDate = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleDateString('th-TH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (timeString) => {
        const date = new Date(timeString);
        return (
            date.toLocaleDateString('th-TH', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }) +
            ' ' +
            formatTime(timeString)
        );
    };

    const handleNext = () => {
        if (paymentStatus !== 'success') return;

        navigate(RoutePaths.paymentSuccess, {
            replace: true,
            state: { ref }
        });
    };

    useEffect(() => {
        if (!ref) return;

        const poll = async () => {
            try {
                const res = await qrStatusApiStore.handleQRstatusService({ ref2: ref });
                const status = res?.status?.toLowerCase();
                if (status === 'success') {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    setPaymentStatus('success');
                    setTimeout(() => {
                        navigate(RoutePaths.paymentSuccess, {
                            replace: true,
                            state: { ref, uuidRef }
                        });
                    }, 1500);
                }
            } catch (err) {
                console.error('check qr status error', err);
            }
        };

        poll();

        intervalRef.current = setInterval(poll, 3000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [ref, qrStatusApiStore, navigate]);

    // useEffect(() => {
    //     if (!ref) return;

    //     const poll = async () => {
    //         clearInterval(intervalRef.current);
    //         intervalRef.current = null;

    //         navigate(RoutePaths.paymentSuccess, {
    //             replace: true,
    //             state: { ref, uuidRef }
    //         });
    //     };

    //     poll();
    // }, [ref, navigate]);

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 1000,
                mx: 'auto',
                p: { xs: 2, sm: 3, md: 4 },
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)'
            }}
        >
            {/* Decorative Background Elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 160,
                    background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                    borderRadius: '0 0 30px 30px',
                    zIndex: 0
                }}
            />

            <Paper
                elevation={6}
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                }}
            >
                {/* Hospital Information Card */}
                <Card
                    sx={{
                        mb: 4,
                        background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 30px rgba(25, 118, 210, 0.4)'
                        }
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item>
                                <HospitalIcon fontSize="large" sx={{ opacity: 0.9 }} />
                            </Grid>
                            <Grid item xs>
                                <Typography variant="h6" fontWeight="700" gutterBottom>
                                    {data.park_information.park_name_th}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {data.park_information.park_name_en}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Chip
                                    label={paymentStatus === 'success' ? 'ชำระแล้ว' : 'รอการชำระเงิน'}
                                    color={paymentStatus === 'success' ? 'success' : 'warning'}
                                    icon={paymentStatus === 'success' ? <CheckCircleIcon /> : null}
                                    sx={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        px: 2,
                                        py: 1,
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Grid container spacing={4}>
                    {/* Left Column - Payment Details */}
                    <Grid item xs={12} md={6}>
                        {/* Payment Information Card */}
                        <Card
                            sx={{
                                mb: 4,
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    fontWeight="700"
                                    gutterBottom
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        color: 'primary.main',
                                        mb: 3
                                    }}
                                >
                                    <Box
                                        sx={{
                                            background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                                            p: 1,
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <PaymentIcon sx={{ color: 'white' }} />
                                    </Box>
                                    รายละเอียดการชำระเงิน
                                </Typography>

                                <Stack spacing={3}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'grey.50'
                                        }}
                                    >
                                        <Typography variant="body1" color="text.secondary">
                                            เลขที่อ้างอิง:
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            fontWeight="600"
                                            sx={{
                                                fontFamily: 'monospace',
                                                color: 'primary.dark'
                                            }}
                                        >
                                            {data.payment_information.ref}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            p: 3,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                            border: '2px solid',
                                            borderColor: 'primary.light'
                                        }}
                                    >
                                        <Typography variant="body1" color="text.secondary">
                                            จำนวนเงิน:
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            color="primary"
                                            fontWeight="800"
                                            sx={{
                                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                            }}
                                        >
                                            ฿{data.payment_information.to_pay_amount.toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Reservation Information Card */}
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    fontWeight="700"
                                    gutterBottom
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        color: 'primary.main',
                                        mb: 3
                                    }}
                                >
                                    <Box
                                        sx={{
                                            background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                                            p: 1,
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <CalendarIcon sx={{ color: 'white' }} />
                                    </Box>
                                    รายละเอียดการจอง
                                </Typography>

                                <List
                                    sx={{
                                        bgcolor: 'background.default',
                                        borderRadius: 2,
                                        p: 0
                                    }}
                                >
                                    {data.reserve_information.map((reserve, index) => (
                                        <Card
                                            key={reserve.r_id}
                                            sx={{
                                                mb: index < data.reserve_information.length - 1 ? 2 : 0,
                                                borderRadius: 2,
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                    transform: 'translateX(4px)'
                                                }
                                            }}
                                        >
                                            <ListItem sx={{ p: 2.5 }}>
                                                <ListItemIcon sx={{ minWidth: 40 }}>
                                                    <CheckCircleIcon
                                                        color="success"
                                                        sx={{
                                                            fontSize: 28,
                                                            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                                                        }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle1" fontWeight="600" color="primary.dark">
                                                            จองหมายเลข #{reserve.r_id}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box sx={{ mt: 1.5 }}>
                                                            <Stack spacing={1}>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 1,
                                                                        p: 1,
                                                                        bgcolor: 'grey.50',
                                                                        borderRadius: 1
                                                                    }}
                                                                >
                                                                    <TimeIcon fontSize="small" color="action" />
                                                                    <Typography variant="body2" color="text.primary" fontWeight="500">
                                                                        {formatTime(reserve.time_in)} - {formatTime(reserve.time_out)}
                                                                    </Typography>
                                                                </Box>
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        fontStyle: 'italic',
                                                                        opacity: 0.8
                                                                    }}
                                                                >
                                                                    {formatDate(reserve.time_in)}
                                                                </Typography>
                                                            </Stack>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        </Card>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Column - QR Code */}
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                border: '1px solid',
                                borderColor: 'divider',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <CardContent
                                sx={{
                                    p: 3,
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight="700"
                                    gutterBottom
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        color: 'primary.main',
                                        mb: 3,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                                            p: 1,
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <QrCodeIcon sx={{ color: 'white' }} />
                                    </Box>
                                    สแกน QR Code เพื่อชำระเงิน
                                </Typography>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        display: 'inline-block',
                                        bgcolor: 'white',
                                        border: '2px solid',
                                        borderColor: 'primary.light',
                                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                                        mb: 3
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 240,
                                            height: 240,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: 'white',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}
                                    >
                                        <img
                                            src={data.payment_information.qrCodeUrl}
                                            alt="QR Code สำหรับชำระเงิน"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                padding: 8
                                            }}
                                        />
                                    </Box>
                                </Paper>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: 2,
                                        mb: 3,
                                        textAlign: 'center',
                                        lineHeight: 1.6
                                    }}
                                >
                                    ใช้แอปพลิเคชันธนาคารหรือกระเป๋าเงินดิจิทัลสแกนเพื่อชำระเงิน
                                </Typography>

                                <Chip
                                    icon={<TimeIcon />}
                                    label={`ชำระเงินก่อน ${formatDateTime(data.reserve_information[0].time_in)}`}
                                    color="warning"
                                    variant="filled"
                                    sx={{
                                        mt: 1,
                                        fontWeight: 'bold',
                                        px: 2,
                                        py: 1.5,
                                        boxShadow: '0 2px 8px rgba(255, 167, 38, 0.3)'
                                    }}
                                />
                                {paymentStatus === 'success' && (
                                    <Typography variant="subtitle1" color="success.main" fontWeight="bold" sx={{ mt: 2 }}>
                                        ✔ ชำระเงินสำเร็จ กำลังไปหน้าถัดไป...
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Next Button Section */}
                <Box
                    sx={{
                        mt: 5,
                        textAlign: 'center',
                        pt: 3,
                        borderTop: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        disabled={paymentStatus !== 'success'}
                        onClick={handleNext}
                        sx={{
                            px: 6,
                            py: 2,
                            borderRadius: 3,
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                            boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                            textTransform: 'none',
                            letterSpacing: '0.5px',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                                boxShadow: '0 12px 30px rgba(25, 118, 210, 0.4)',
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease',
                            minWidth: 250
                        }}
                    >
                        ดำเนินการถัดไป
                    </Button>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 2,
                            opacity: 0.7,
                            fontStyle: 'italic'
                        }}
                    >
                        กดปุ่มนี้หลังจากชำระเงินเรียบร้อยแล้ว
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default PaymentDetail;
