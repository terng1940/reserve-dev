import React, { useState, useEffect } from 'react';
import { useStores } from 'contexts/StoreContext';

import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import LocalParkingIcon from '@mui/icons-material/LocalParking';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentsIcon from '@mui/icons-material/Payments';
import InfoIcon from '@mui/icons-material/Info';

import OtpForm from './otpForm';
import PhoneForm from './phoneForm';
import PaymentDetail from './paymentDetail';

const ReservePage = () => {
    const {
        getReserveApiStore,
        postReserveApiStore,
        getProvinceApiStore,
        sendOTPApiStore,
        verifyOTPApiStore,
        informationApiStore,
        paymentDetailApiStore
    } = useStores();
    const [hn, setHn] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [provinceList, setProvinceList] = useState([]);
    const [province, setProvince] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [step, setStep] = useState('FORM');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpRefId, setOtpRefId] = useState(null);
    const [timeOptions, setTimeOptions] = useState([]);
    const [selectedSiId, setSelectedSiId] = useState(null);
    const [getUuid, setGetUuid] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [hasPendingPayment, setHasPendingPayment] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const [parkingInfo, setParkingInfo] = useState({
        park_name_th: '',
        park_name_en: '',
        park_short_des: '',
        reserve_fee: 0
    });

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const closeSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const fetchParkingInfo = async () => {
        try {
            const result = await informationApiStore.handleInformationService();
            if (result?.data) {
                setParkingInfo(result.data);
            }
        } catch (error) {
            console.error('Error fetching parking information:', error);
        }
    };

    const fecthSearchHN = async () => {
        try {
            const body = { hn_number: hn.trim() };
            const result = await getReserveApiStore.handleGetReserveService(body);

            if (result.error) {
                setTimeOptions([]);
                showSnackbar('เกิดข้อผิดพลาดในการค้นหา HN', 'error');
                return;
            }

            const data = result.response?.data;

            if (!data || data.length === 0) {
                setTimeOptions([]);
                showSnackbar('ไม่พบข้อมูล', 'warning');
                return;
            }

            const times = data[0]?.appointment_datetime ?? [];

            if (times.length === 0) {
                setTimeOptions([]);
                showSnackbar('ไม่พบช่วงเวลา', 'warning');
                return;
            }

            setTimeOptions(times);
            setSelectedSiId(null);
            showSnackbar('ค้นหาข้อมูลสำเร็จ', 'success');
        } catch (e) {
            console.error(e);
            setTimeOptions([]);
            showSnackbar('ไม่สามารถเชื่อมต่อระบบได้', 'error');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        closeModal();
        setOpenModal(true);
        setStep('PHONE');
    };

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            const body = {
                license_plate: licensePlate,
                province,
                mobile: phone,
                hn_number: hn,
                reserve_at: new Date().toISOString(),
                si_id: selectedSiId ? [selectedSiId] : []
            };

            const result = await postReserveApiStore.handlePostReserveService(body);

            if (result.error) {
                showSnackbar('สร้างรายการจองไม่สำเร็จ', 'error');
                return;
            }

            const uuid = result.response?.data?.reserve_uuid;
            if (!uuid) {
                throw new Error('reserve_uuid not found');
            }
            setGetUuid(uuid);

            const resultOtp = await sendOTPApiStore.handleSendOTPService({
                c_mobile: phone
            });

            if (resultOtp?.error) {
                showSnackbar('ส่ง OTP ไม่สำเร็จ', 'error');
                return;
            }

            const refId = resultOtp.response?.data?.ref_id;
            if (!refId) {
                showSnackbar('ไม่พบ ref สำหรับ OTP', 'error');
                return;
            }

            setOtpRefId(refId);
            setStep('OTP');
            showSnackbar('ส่งรหัส OTP แล้ว', 'success');
        } catch (e) {
            console.error(e);
            showSnackbar('เกิดข้อผิดพลาดในระบบ', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const body = {
                ref_id: otpRefId,
                pin: otp
            };

            const result = await verifyOTPApiStore.handleVerifyOTPService(body);

            if (result?.error) {
                showSnackbar('OTP ไม่ถูกต้อง', 'error');
                return;
            }

            showSnackbar('ยืนยัน OTP สำเร็จ', 'success');

            const bodyPayment = {
                reserve_uuid: getUuid
            };

            const paymentResult = await paymentDetailApiStore.handlePaymentDetailService(bodyPayment);

            if (paymentResult?.error) return;
            setPaymentData(paymentResult.response);
            setHasPendingPayment(true);
            setStep('PAYMENT');
        } catch (e) {
            console.error(e);
            showSnackbar('เกิดข้อผิดพลาดในการยืนยัน OTP', 'error');
        } finally {
            setLoading(false);
        }
    };

    const canSubmit = hn && licensePlate && province && selectedSiId !== null;
    const closeModal = () => {
        setOpenModal(false);
        setStep('PHONE');
        setPhone('');
        setOtp('');
        setLoading(false);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const resProv = await getProvinceApiStore.handleGetProvinceService();
                const list = resProv?.data ?? resProv?.response?.data ?? [];
                if (Array.isArray(list)) setProvinceList(list);

                await fetchParkingInfo();
            } catch (error) {
                console.error('fetchInitialData error:', error);
            }
        };

        fetchInitialData();
    }, [getProvinceApiStore]);

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
                minHeight: '100vh',
                bgcolor: 'grey.50',
                p: { xs: 2, sm: 3 }
            }}
        >
            <Grid item xs={12} sm={10} md={8} lg={6}>
                <Card
                    elevation={3}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                    }}
                >
                    {/* Parking Information Header */}
                    <Box
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            p: 3,
                            borderRadius: 2,
                            mb: 3,
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
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                                <LocalParkingIcon sx={{ fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h5" component="h1" fontWeight="bold">
                                        {parkingInfo.park_name_th || 'โรงพยาบาลศิริราช ปิยมหาราชการุณย์'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        {parkingInfo.park_name_en || 'Siriraj Piyamaharajkarun Hospital'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>

                    {/* Information Cards */}
                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} sm={6}>
                            <Card
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    height: '100%',
                                    borderLeft: '4px solid',
                                    borderLeftColor: 'info.main',
                                    bgcolor: 'info.50'
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <AccessTimeIcon color="info" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            ค่าจอดรถ
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold">
                                            {parkingInfo.park_short_des || '20 บาทต่อชั่วโมง'}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Card
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    height: '100%',
                                    borderLeft: '4px solid',
                                    borderLeftColor: 'warning.main',
                                    bgcolor: 'warning.50'
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <PaymentsIcon color="warning" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            ค่าจองล่วงหน้า
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold" color="warning.dark">
                                            {parkingInfo.reserve_fee ? `${parkingInfo.reserve_fee} บาท` : '100 บาท'}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Important Note */}
                    {parkingInfo.reserve_fee > 0 && (
                        <Card
                            variant="outlined"
                            sx={{
                                p: 2,
                                mb: 3,
                                bgcolor: 'primary.50',
                                borderColor: 'primary.200'
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                <InfoIcon color="primary" sx={{ mt: 0.5 }} />
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold" color="primary.dark" gutterBottom>
                                        ข้อควรทราบ
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        กรุณาชำระค่าจองล่วงหน้า {parkingInfo.reserve_fee || 100} บาท
                                        ซึ่งจะถูกหักจากค่าจอดรถทั้งหมดเมื่อท่านมาถึงที่จอดรถ
                                    </Typography>
                                </Box>
                            </Stack>
                        </Card>
                    )}

                    <Divider sx={{ mb: 3 }} />

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            {/* หัวข้อ */}
                            <Typography variant="h5" component="h2" fontWeight="bold" color="text.primary" gutterBottom>
                                จองที่จอดรถล่วงหน้า
                            </Typography>

                            {/* ช่องกรอก HN */}
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    component="label"
                                    fontWeight="medium"
                                    gutterBottom
                                    sx={{ display: 'block' }}
                                >
                                    HN
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="กรุณากรอกหมายเลข HN"
                                        value={hn}
                                        onChange={(e) => setHn(e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1
                                            }
                                        }}
                                    />
                                    <IconButton
                                        type="button"
                                        color="primary"
                                        onClick={fecthSearchHN}
                                        sx={{
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            '&:hover': {
                                                bgcolor: 'primary.dark'
                                            },
                                            height: 56,
                                            width: 56,
                                            borderRadius: 1
                                        }}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </Stack>
                            </Box>

                            {/* Field เวลา */}
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    component="label"
                                    fontWeight="medium"
                                    gutterBottom
                                    sx={{ display: 'block' }}
                                >
                                    เลือกช่วงเวลา
                                </Typography>

                                <Grid container spacing={2}>
                                    {timeOptions.length === 0 ? (
                                        <Grid item xs={12}>
                                            <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                                                <Typography color="text.secondary" align="center">
                                                    กรุณากรอก HN เพื่อค้นหาช่วงเวลาที่นัดหมาย
                                                </Typography>
                                            </Card>
                                        </Grid>
                                    ) : (
                                        timeOptions.map((item) => {
                                            const isSelected = selectedSiId === item.si_id;

                                            return (
                                                <Grid item xs={12} key={item.si_id}>
                                                    <Card
                                                        variant="outlined"
                                                        onClick={() => setSelectedSiId(item.si_id)}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            borderColor: isSelected ? 'primary.main' : 'divider',
                                                            bgcolor: isSelected ? 'primary.50' : 'background.paper',
                                                            transition: '0.2s',
                                                            '&:hover': {
                                                                borderColor: 'primary.main'
                                                            }
                                                        }}
                                                    >
                                                        <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
                                                            <Stack direction="row" spacing={2} alignItems="center">
                                                                <AccessTimeIcon color="primary" />
                                                                <Typography fontWeight="bold">
                                                                    {dayjs(item.appointment_datetime).format('DD/MM/YYYY HH:mm')}
                                                                </Typography>
                                                            </Stack>

                                                            <Box
                                                                sx={{
                                                                    width: 24,
                                                                    height: 24,
                                                                    borderRadius: '50%',
                                                                    border: '2px solid',
                                                                    borderColor: isSelected ? 'primary.main' : 'grey.400',
                                                                    bgcolor: isSelected ? 'primary.main' : 'transparent',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    '&::after': isSelected
                                                                        ? {
                                                                              content: '""',
                                                                              width: 12,
                                                                              height: 12,
                                                                              borderRadius: '50%',
                                                                              bgcolor: 'white'
                                                                          }
                                                                        : null
                                                                }}
                                                            />
                                                        </Box>
                                                    </Card>
                                                </Grid>
                                            );
                                        })
                                    )}
                                </Grid>
                            </Box>

                            {/* ช่องกรอกป้ายทะเบียน */}
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    component="label"
                                    fontWeight="medium"
                                    gutterBottom
                                    sx={{ display: 'block' }}
                                >
                                    ป้ายทะเบียนรถ
                                </Typography>

                                <Grid container spacing={2}>
                                    {/* ป้ายทะเบียน */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            placeholder="กรุณากรอกป้ายทะเบียนรถ"
                                            value={licensePlate}
                                            onChange={(e) => setLicensePlate(e.target.value)}
                                        />
                                    </Grid>

                                    {/* จังหวัด */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            required
                                            label="จังหวัด"
                                            value={province}
                                            onChange={(e) => setProvince(e.target.value)}
                                            helperText={!province ? 'กรุณาเลือกจังหวัด' : ''}
                                        >
                                            <MenuItem value="">เลือกจังหวัด</MenuItem>
                                            {provinceList
                                                .sort((a, b) => a.province_name_th.localeCompare(b.province_name_th, 'th'))
                                                .map((prov) => (
                                                    <MenuItem key={prov.province_id} value={prov.province_name_th}>
                                                        {prov.province_name_th}
                                                    </MenuItem>
                                                ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Divider />

                            {/* ปุ่ม Submit */}
                            <Button
                                type="submit"
                                disabled={!canSubmit}
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                sx={{
                                    py: 1.5,
                                    borderRadius: 1,
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                                    }
                                }}
                            >
                                บันทึกการจอง
                            </Button>
                            {hasPendingPayment && (
                                <Button variant="contained" color="warning" onClick={() => setStep('PAYMENT')}>
                                    กลับไปชำระเงิน
                                </Button>
                            )}
                        </Stack>
                    </Box>
                </Card>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
                    กรุณากรอกข้อมูลให้ครบถ้วนก่อนกดบันทึกการจอง
                </Typography>
            </Grid>
            <Dialog
                open={step === 'PHONE' || step === 'OTP'}
                disableEscapeKeyDown={step !== 'PHONE'}
                onClose={() => {
                    if (step === 'PHONE') {
                        setStep('FORM');
                    }
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogContent>
                    {step === 'PHONE' && <PhoneForm phone={phone} loading={loading} onChange={setPhone} onSubmit={handleSendOtp} />}

                    {step === 'OTP' && <OtpForm otp={otp} phone={phone} loading={loading} onChange={setOtp} onSubmit={handleVerifyOtp} />}
                </DialogContent>
            </Dialog>
            <Dialog
                open={step === 'PAYMENT'}
                fullWidth
                maxWidth="md"
                scroll="paper"
                onClose={() => {
                    if (hasPendingPayment) {
                        if (window.confirm('คุณยังไม่ได้ชำระเงิน ต้องการออกจากหน้านี้หรือไม่?')) {
                            setStep('FORM');
                        }
                    }
                }}
            >
                <DialogContent
                    sx={{
                        p: 0,
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}
                >
                    <PaymentDetail data={paymentData} />
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={closeSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        backgroundColor:
                            snackbar.severity === 'success'
                                ? '#2e7d32'
                                : snackbar.severity === 'warning'
                                  ? '#ed6c02'
                                  : snackbar.severity === 'error'
                                    ? '#d32f2f'
                                    : '#0288d1',
                        color: '#fff'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default ReservePage;
