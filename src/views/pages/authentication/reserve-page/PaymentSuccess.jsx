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
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const PaymentSuccess = () => {
    const { reserveDetailApiStore } = useStores();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [result, setResult] = useState(null);
    const [tab, setTab] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

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

    const InfoRow = ({ label, value, bold = false }) => (
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body1" fontWeight={bold ? 700 : 500} textAlign="right">
                {value}
            </Typography>
        </Stack>
    );

    const TabPanel = ({ children, value, index }) => {
        return value === index && <Box sx={{ mt: 0.5 }}>{children}</Box>;
    };

    const { park_information, payment_information } = result;

    return (
        <Box
            sx={{
                width: '100%'
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
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        borderRadius: 0,
                        backgroundColor: 'background.paper'
                    }}
                >
                    <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary">
                        <Tab label="ใบเสร็จ" icon={<ReceiptLongIcon />} />
                        <Tab label="QR Code" icon={<DirectionsCarIcon />} />
                    </Tabs>
                </Card>

                <TabPanel value={tab} index={0}>
                    <Stack spacing={2} pb={2}>
                        <Card
                            sx={{
                                background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                                color: 'white',
                                borderRadius: 3
                            }}
                        >
                            <CardContent sx={{ py: 3 }}>
                                <Stack spacing={1.25} alignItems="center">
                                    <Typography fontWeight={700} sx={{ letterSpacing: 0.2 }}>
                                        {payment_information?.landlord_name}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            opacity: 0.9
                                        }}
                                    >
                                        ที่อยู่ตามสาขาที่จดกรมสรรพากร
                                    </Typography>

                                    <Stack spacing={0.25} alignItems="center">
                                        <Typography sx={{ fontSize: 12, opacity: 0.85 }}>Tax ID : {payment_information?.tax_id}</Typography>
                                        <Typography sx={{ fontSize: 12, opacity: 0.85 }}>
                                            Cashier : {payment_information?.cashier || '-'}
                                        </Typography>
                                    </Stack>

                                    {/* Footer */}
                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            opacity: 0.85,
                                            mt: 0.5
                                        }}
                                    >
                                        ใบเสร็จรับเงิน/ใบกำกับภาษีอย่างย่อ
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card
                            sx={{
                                boxShadow: '0 6px 24px rgba(0,0,0,0.08)'
                            }}
                        >
                            <CardContent sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
                                {/* ===== Status ===== */}
                                <Stack alignItems="center" spacing={1.5} mb={3}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <CheckCircleIcon color="success" sx={{ fontSize: 32 }} />
                                        <Typography variant="h5" fontWeight={700}>
                                            ชำระเงินสำเร็จ
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(payment_information.payment_datetime).toLocaleString('th-TH')}
                                    </Typography>
                                </Stack>

                                {/* ===== Reference Info ===== */}
                                <Stack spacing={1} mb={3}>
                                    <InfoRow label="เลขที่ใบเสร็จ" value={payment_information?.receipt_no} />
                                    <InfoRow label="รหัสอ้างอิง" value={payment_information?.ref} />
                                    <InfoRow label="ป้ายทะเบียน" value={park_information?.license_plate} />
                                    <InfoRow label="สถานที่จอด" value={park_information?.park_name_th} />
                                    <InfoRow label="ประเภทผู้ใช้งาน" value="-" />
                                </Stack>

                                <Divider sx={{ my: 2 }} />

                                {/* ===== Payment Detail ===== */}
                                <Stack spacing={1} mb={3}>
                                    <InfoRow label="POS ID" value="-" />
                                    <InfoRow label="รหัสอ้างอิงการชำระเงิน" value={payment_information?.ref2} />
                                    <InfoRow label="ช่องทางการชำระเงิน" value={payment_information.payment_method.toUpperCase()} />
                                    <InfoRow
                                        label="ค่าบริการทั้งหมด"
                                        value={`${payment_information.i_amount_inc_vat.toLocaleString()} บาท`}
                                    />
                                    <InfoRow
                                        label="รวมทั้งหมด"
                                        value={`${payment_information.i_amount_exc_vat.toLocaleString()} บาท`}
                                        bold
                                    />
                                </Stack>

                                <Stack spacing={1}>
                                    <InfoRow label="ค่าบริการก่อนภาษี" value={`${payment_information?.i_vat} บาท`} />
                                    <InfoRow label="ภาษีมูลค่าเพิ่ม" value={`${payment_information?.i_vat} บาท`} />
                                    <InfoRow
                                        label="ค่าบริการรวมภาษี"
                                        value={`${payment_information.i_amount_exc_vat.toLocaleString()} บาท`}
                                        bold
                                    />
                                </Stack>
                            </CardContent>
                            <Box
                                sx={{
                                    px: 3,
                                    pb: 2,
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    เวลาเข้าได้ระหว่าง{' '}
                                    {new Date(park_information.time_in_least).toLocaleTimeString('th-TH', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}{' '}
                                    –{' '}
                                    {new Date(park_information.time_in_last).toLocaleTimeString('th-TH', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Typography>
                            </Box>
                        </Card>
                        <Box
                            sx={{
                                mx: 2,
                                borderRadius: 1.5,
                                bgcolor: 'grey.100',
                                textAlign: 'center'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color: 'text.secondary',
                                    lineHeight: 1.6
                                }}
                            >
                                หมายเหตุ : กรุณาบันทึกใบเสร็จรับเงินนี้เพื่อการตรวจสอบ
                                <br />
                                เผื่อประโยชน์ของท่านเอง
                            </Typography>
                        </Box>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2, width: '100%' }}>
                            <Button fullWidth variant="contained">
                                บันทึกรูป
                            </Button>

                            <Button fullWidth variant="outlined" onClick={() => navigate(RoutePaths.reservePage, { replace: true })}>
                                กลับไปหน้าจอง
                            </Button>
                        </Stack>
                    </Stack>
                </TabPanel>

                <TabPanel value={tab} index={1}>
                    <Card
                        sx={{
                            boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
                            textAlign: 'center'
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} mb={1}>
                                QR Code สำหรับเข้า–ออก
                            </Typography>

                            <Typography variant="body2" color="text.secondary" mb={2}>
                                แสดง QR Code ให้เจ้าหน้าที่สแกน
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <img src={payment_information?.qr_code_url} alt="QR Code" style={{ width: 220, height: 220 }} />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="body2" color="text.secondary">
                                รหัสอ้างอิง : {payment_information?.ref}
                            </Typography>
                        </CardContent>
                    </Card>
                </TabPanel>
            </Stack>
        </Box>
    );
};

export default PaymentSuccess;
