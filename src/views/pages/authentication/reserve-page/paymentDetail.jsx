import React, { useEffect, useRef, useState } from 'react';
import { useStores } from 'contexts/StoreContext';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import RoutePaths from 'routes/routePaths';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import { QrCode2 as QrCodeIcon, AccessTime as TimeIcon, LocalHospital as HospitalIcon } from '@mui/icons-material';

const PaymentDetail = ({ data, onCancel }) => {
    const ref = data?.payment_information?.ref;
    const uuidRef = data?.reserve_uuid;
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

    const handleCancelClick = () => {
        onCancel?.();
    };

    const handleDownloadQr = () => {
        const link = document.createElement('a');
        link.href = data.payment_information.qrCodeUrl;
        link.download = `QR_${data.payment_information.ref}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatShortDate = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: '2-digit'
        });
    };

    useEffect(() => {
        if (!ref) return;

        const poll = async () => {
            try {
                const res = await qrStatusApiStore.handleQRstatusService({ ref2: ref });
                const status = res?.response.status;
                if (status) {
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
            clearInterval(intervalRef.current);
            intervalRef.current = null;
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
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)',
                py: { xs: 2, sm: 4 }
            }}
        >
            <Stack
                spacing={{ xs: 1.5, sm: 2 }}
                sx={{
                    maxWidth: 960,
                    mx: 'auto',
                    px: { xs: 2, sm: 3 }
                }}
            >
                <Card
                    sx={{
                        background: 'linear-gradient(135deg, #0e215a 0%, #2196f3 100%)',
                        color: 'white'
                    }}
                >
                    <CardContent sx={{ py: 2 }}>
                        <Stack spacing={0.5}>
                            {/* ชื่อโรงพยาบาล */}
                            <Stack direction="row" spacing={1} alignItems="center">
                                <HospitalIcon sx={{ fontSize: 28, opacity: 0.9, color: 'white' }} />
                                <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'white' }}>
                                    {data?.park_information.park_name_th}
                                </Typography>
                            </Stack>

                            {/* เลขทะเบียน */}
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: 'white'
                                }}
                            >
                                เลขทะเบียน:{' '}
                                <Box
                                    component="span"
                                    sx={{
                                        fontWeight: 400,
                                        opacity: 0.85
                                    }}
                                >
                                    {data?.licensePlate}
                                </Box>
                            </Typography>

                            {/* วันที่และเวลาเข้า */}
                            {data?.reserve_information.map((reserve) => (
                                <Typography
                                    key={reserve.r_id}
                                    sx={{
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: 'white'
                                    }}
                                >
                                    วันที่และเวลาเข้า:{' '}
                                    <Box
                                        component="span"
                                        sx={{
                                            fontWeight: 400,
                                            opacity: 0.85
                                        }}
                                    >
                                        {formatTime(reserve.time_in)}–{formatTime(reserve.time_out)} {formatShortDate(reserve.time_in)}
                                    </Box>
                                </Typography>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>

                <Card
                    sx={{
                        boxShadow: '0 6px 24px rgba(0,0,0,0.08)'
                    }}
                >
                    <CardContent>
                        <Stack alignItems="center">
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box
                                    sx={{
                                        p: 1,
                                        borderRadius: 2,
                                        background: '#0e215a'
                                    }}
                                >
                                    <QrCodeIcon sx={{ color: 'white' }} />
                                </Box>
                                <Typography fontWeight={700} color="primary.main" textAlign="center">
                                    สแกน QR Code เพื่อชำระเงิน
                                </Typography>
                            </Stack>

                            <Stack direction={{ xs: 'column', sm: 'column' }} alignItems="center" justifyContent="center"></Stack>
                            <Box
                                sx={{
                                    width: { xs: 200, sm: 240 },
                                    height: { xs: 200, sm: 240 },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <img src={data?.payment_information.qrCodeUrl} alt="QR Code" style={{ width: '100%', height: '100%' }} />
                            </Box>

                            <Stack
                                direction={{ xs: 'column', sm: 'column' }}
                                spacing={{ xs: 1, sm: 1 }}
                                alignItems="center"
                                justifyContent="center"
                            >
                                {/* ราคา */}
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    ราคา:{' '}
                                    <Box component="span" sx={{ fontWeight: 700 }}>
                                        {data?.payment_information.to_pay_amount.toLocaleString()} บาท
                                    </Box>
                                </Typography>

                                {/* เลขอ้างอิง */}
                                <Typography variant="body2" color="text.secondary">
                                    เลขอ้างอิง:{' '}
                                    <Box component="span" sx={{ fontWeight: 600 }}>
                                        {data?.payment_information.ref}
                                    </Box>
                                </Typography>
                            </Stack>
                            <Chip
                                icon={<TimeIcon />}
                                label={`ชำระเงินก่อน ${formatDateTime(data?.reserve_information[0]?.time_in)}`}
                                color="warning"
                                sx={{
                                    fontWeight: 'bold',
                                    px: 2,
                                    mt: 1
                                }}
                            />

                            {/* Success */}
                            {paymentStatus === 'success' && (
                                <Typography variant="subtitle1" color="success.main" fontWeight={700}>
                                    ✔ ชำระเงินสำเร็จ กำลังไปหน้าถัดไป...
                                </Typography>
                            )}
                        </Stack>
                    </CardContent>
                </Card>

                <List sx={{ p: 0 }}>
                    <ListItem
                        sx={{
                            px: 2,
                            py: 1.5,
                            bgcolor: 'background.paper',
                            borderRadius: 1.5,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                        }}
                    >
                        <ListItemText
                            primary={
                                <Stack spacing={0.5}>
                                    <Typography variant="body2" sx={{ fontSize: 13 }}>
                                        • กรุณาไปถึงที่จอดรถในเวลาที่จอง หรือไม่เกินก่อน หรือหลังเวลาจอง{' '}
                                        <Box component="span" sx={{ fontSize: 13, fontWeight: 600 }}>
                                            30 นาที
                                        </Box>{' '}
                                        หากเกินเวลาการจองจะถูกยกเลิก
                                    </Typography>

                                    <Typography variant="body2" sx={{ fontSize: 13 }}>
                                        • กรุณาจอดรถในพื้นที่{' '}
                                        <Box component="span" sx={{ fontWeight: 600 }}>
                                            Reserve Zone
                                        </Box>{' '}
                                        เท่านั้น มิฉะนั้นอาจโดนล็อคล้อ
                                    </Typography>

                                    <Typography variant="body2" sx={{ fontSize: 13 }}>
                                        • หากไม่ได้ไปจอด กรุณานำ{' '}
                                        <Box component="span" sx={{ fontWeight: 600 }}>
                                            QR
                                        </Box>{' '}
                                        ที่ได้รับทาง{' '}
                                        <Box component="span" sx={{ fontWeight: 600 }}>
                                            SMS
                                        </Box>{' '}
                                        สแกนที่{' '}
                                        <Box component="span" sx={{ fontWeight: 600 }}>
                                            Kiosk Reservation Zone
                                        </Box>
                                    </Typography>
                                </Stack>
                            }
                        />
                    </ListItem>
                </List>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2, width: '100%' }}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadQr}
                        sx={{
                            backgroundColor: '#0e215a',
                            '&:hover': {
                                backgroundColor: '#0e215a',
                                boxShadow: 'none'
                            }
                        }}
                    >
                        ดาวน์โหลด QR Code
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<CloseIcon />}
                        onClick={handleCancelClick}
                        sx={{
                            color: '#0e215a',
                            borderColor: '#0e215a',
                            '&:hover': {
                                borderColor: '#0e215a',
                                backgroundColor: 'transparent'
                            }
                        }}
                    >
                        ยกเลิก / ออกจากหน้านี้
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default PaymentDetail;
