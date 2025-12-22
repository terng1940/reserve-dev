import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStores } from 'contexts/StoreContext';

import RoutePaths from 'routes/routePaths';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const PaymentSuccess = () => {
    const { reserveDetailApiStore } = useStores();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await reserveDetailApiStore.handleReserveDetailService({
                    reserve_uuid: state?.uuidRef
                });

                if (!res?.error) {
                    setResult(res.response.data);
                }
            } catch (error) {
                console.error('fetchInitialData error:', error);
            }
        };

        fetchInitialData();
    }, [reserveDetailApiStore, state]);

    if (!result) {
        return (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Typography>กำลังโหลดข้อมูล...</Typography>
            </Box>
        );
    }

    const { park_information, payment_information } = result;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'grey.100',
                py: 6,
                px: 2
            }}
        >
            <Box maxWidth={800} mx="auto">
                {/* Header */}
                <Card sx={{ mb: 4, borderRadius: 3 }}>
                    <CardContent>
                        <Stack alignItems="center" spacing={2}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 64 }} />
                            <Typography variant="h5" fontWeight="bold">
                                ชำระเงินสำเร็จ
                            </Typography>
                            <Chip
                                icon={<ReceiptLongIcon />}
                                label={`เลขที่ใบเสร็จ ${payment_information.receipt_no}`}
                                color="success"
                                variant="outlined"
                            />
                        </Stack>
                    </CardContent>
                </Card>

                {/* Parking Information */}
                <Card sx={{ mb: 3, borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            ข้อมูลการจอดรถ
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Stack spacing={1.5}>
                            <Typography fontWeight="medium">{park_information.park_name_th}</Typography>
                            <Typography color="text.secondary">{park_information.park_name_en}</Typography>

                            <Stack direction="row" spacing={1} alignItems="center">
                                <DirectionsCarIcon fontSize="small" />
                                <Typography>ป้ายทะเบียน {park_information.license_plate}</Typography>
                            </Stack>

                            <Typography variant="body2" color="text.secondary">
                                เวลาเข้าได้ระหว่าง{' '}
                                {new Date(park_information.time_in_least).toLocaleTimeString('th-TH', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}{' '}
                                -{' '}
                                {new Date(park_information.time_in_last).toLocaleTimeString('th-TH', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Payment Information */}
                <Card sx={{ mb: 4, borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            รายละเอียดการชำระเงิน
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                    เลขอ้างอิง
                                </Typography>
                                <Typography fontWeight="medium">{payment_information.ref}</Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                    วันที่ชำระเงิน
                                </Typography>
                                <Typography fontWeight="medium">
                                    {new Date(payment_information.payment_datetime).toLocaleString('th-TH')}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                    วิธีชำระเงิน
                                </Typography>
                                <Typography fontWeight="medium">{payment_information.payment_method.toUpperCase()}</Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                    จำนวนเงิน
                                </Typography>
                                <Typography fontWeight="bold" color="primary">
                                    ฿{payment_information.i_amount_inc_vat.toLocaleString()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Action */}
                <Box textAlign="center">
                    <Button
                        variant="contained"
                        size="large"
                        sx={{ px: 5, py: 1.5 }}
                        onClick={() => navigate(RoutePaths.reservePage, { replace: true })}
                    >
                        กลับไปหน้าจอง
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default PaymentSuccess;
