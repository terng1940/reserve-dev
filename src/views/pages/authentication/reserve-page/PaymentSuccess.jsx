import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStores } from 'contexts/StoreContext';
import { toPng } from 'html-to-image';

import QRCode from 'react-qr-code';
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
import DownloadIcon from '@mui/icons-material/Download';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { QrCode2 as QrCodeIcon, AccessTime as TimeIcon, LocalHospital as HospitalIcon } from '@mui/icons-material';

const PaymentSuccess = () => {
    const qrRef = useRef(null);
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
                    // reserve_uuid: state?.uuidRef
                    reserve_uuid: '2647a098-5b80-4ad1-b193-233aa2353226'
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

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const formatShortDate = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: '2-digit'
        });
    };

    const TabPanel = ({ children, value, index }) => {
        return value === index && <Box sx={{ mt: 0.5 }}>{children}</Box>;
    };

    const handleDownloadQR = async () => {
        if (!qrRef.current) return;

        try {
            const dataUrl = await toPng(qrRef.current, {
                cacheBust: true,
                pixelRatio: 2
            });

            const link = document.createElement('a');
            link.download = `QR-${park_information?.license_plate || 'parking'}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Download QR failed', err);
        }
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
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                            '& .MuiTab-root': {
                                color: '#0e215a'
                            },
                            '& .MuiTab-root.Mui-selected': {
                                color: '#0e215a'
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#0e215a'
                            }
                        }}
                    >
                        <Tab label="QR Code" icon={<DirectionsCarIcon />} />
                        <Tab label="ใบเสร็จ" icon={<ReceiptLongIcon />} />
                    </Tabs>
                </Card>

                <TabPanel value={tab} index={0}>
                    <Stack spacing={2} pb={2}>
                        <Card
                            sx={{
                                background: 'linear-gradient(135deg, #0e215a 0%, #0e3f68ff 100%)',
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: -50,
                                    right: -50,
                                    width: 150,
                                    height: 150,
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    borderRadius: '50%'
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -30,
                                    left: -30,
                                    width: 100,
                                    height: 100,
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    borderRadius: '50%'
                                }
                            }}
                        >
                            <CardContent sx={{ py: 2 }}>
                                <Stack spacing={0.5}>
                                    {/* ชื่อโรงพยาบาล */}
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <HospitalIcon sx={{ fontSize: 28, opacity: 0.9, color: 'white' }} />
                                        <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'white' }}>
                                            {park_information?.park_name_th}
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
                                            {park_information?.license_plate}
                                        </Box>
                                    </Typography>

                                    {/* วันที่และเวลาเข้า */}
                                    <Typography
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
                                            {formatTime(park_information.time_in_least)}–{formatTime(park_information.time_in_last)}{' '}
                                            {formatShortDate(park_information.time_in_least)}
                                        </Box>
                                    </Typography>
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
                                        <Typography fontWeight={700} color="#0e215a" textAlign="center">
                                            สแกน QR Code เข้าลาน
                                        </Typography>
                                    </Stack>

                                    <Box
                                        ref={qrRef}
                                        sx={{
                                            width: 240,
                                            height: 240,
                                            bgcolor: 'white',
                                            p: 2,
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {park_information?.park_qr && <QRCode value={park_information.park_qr} size={200} />}
                                    </Box>

                                    <Stack
                                        direction={{ xs: 'column', sm: 'column' }}
                                        spacing={{ xs: 1, sm: 1 }}
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            ราคา:{' '}
                                            <Box component="span" sx={{ fontWeight: 700 }}>
                                                {payment_information?.i_amount_exc_vat.toLocaleString()} บาท
                                            </Box>
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            เลขอ้างอิง:{' '}
                                            <Box component="span" sx={{ fontWeight: 600 }}>
                                                {payment_information?.ref2}
                                            </Box>
                                        </Typography>
                                    </Stack>
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
                                onClick={handleDownloadQR}
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
                                onClick={() => navigate(RoutePaths.reservePage, { replace: true })}
                                sx={{
                                    color: '#0e215a',
                                    borderColor: '#0e215a',
                                    '&:hover': {
                                        borderColor: '#0e215a',
                                        backgroundColor: 'transparent'
                                    }
                                }}
                            >
                                กลับไปหน้าจอง
                            </Button>
                        </Stack>
                    </Stack>
                </TabPanel>

                <TabPanel value={tab} index={1}>
                    <Stack spacing={2} pb={2}>
                        <Card
                            sx={{
                                background: 'linear-gradient(135deg, #0e215a 0%, #0e3f68ff 100%)',
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: -50,
                                    right: -50,
                                    width: 150,
                                    height: 150,
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    borderRadius: '50%'
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -30,
                                    left: -30,
                                    width: 100,
                                    height: 100,
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    borderRadius: '50%'
                                }
                            }}
                        >
                            <CardContent sx={{ py: 2 }}>
                                <Stack spacing={0.5}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <HospitalIcon sx={{ fontSize: 28, opacity: 0.9, color: 'white' }} />
                                        <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'white' }}>
                                            {payment_information?.landlord_name}
                                        </Typography>
                                    </Stack>
                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            opacity: 0.9
                                        }}
                                    >
                                        ที่อยู่ตามสาขาที่จดกรมสรรพากร
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: 'white'
                                        }}
                                    >
                                        Tax ID:{' '}
                                        <Box
                                            component="span"
                                            sx={{
                                                fontWeight: 400,
                                                opacity: 0.85
                                            }}
                                        >
                                            {payment_information?.tax_id}
                                        </Box>
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: 'white'
                                        }}
                                    >
                                        Cashier:{' '}
                                        <Box
                                            component="span"
                                            sx={{
                                                fontWeight: 400,
                                                opacity: 0.85
                                            }}
                                        >
                                            {payment_information?.cashier || '-'}
                                        </Box>
                                    </Typography>
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
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: '#0e215a',
                                    '&:hover': {
                                        backgroundColor: '#0e215a',
                                        boxShadow: 'none'
                                    }
                                }}
                            >
                                บันทึกรูป
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate(RoutePaths.reservePage, { replace: true })}
                                sx={{
                                    color: '#0e215a',
                                    borderColor: '#0e215a',
                                    '&:hover': {
                                        borderColor: '#0e215a',
                                        backgroundColor: 'transparent'
                                    }
                                }}
                            >
                                กลับไปหน้าจอง
                            </Button>
                        </Stack>
                    </Stack>
                </TabPanel>
            </Stack>
        </Box>
    );
};

export default PaymentSuccess;
