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

import OtpForm from './otpForm';
import PhoneForm from './phoneForm';

const ReservePage = () => {
    const { getReserveApiStore, postReserveApiStore, getProvinceApiStore, sendOTPApiStore, verifyOTPApiStore } = useStores();
    const [hn, setHn] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [provinceList, setProvinceList] = useState([]);
    const [province, setProvince] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [step, setStep] = useState('PHONE');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpRefId, setOtpRefId] = useState(null);
    const [timeOptions, setTimeOptions] = useState([]);
    const [selectedSiId, setSelectedSiId] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
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
            const resProv = await getProvinceApiStore.handleGetProvinceService();
            const list = resProv?.data ?? resProv?.response?.data ?? [];
            if (Array.isArray(list)) setProvinceList(list);
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
                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            {/* หัวข้อ */}
                            <Typography variant="h5" component="h1" align="center" fontWeight="bold" color="primary" gutterBottom>
                                ระบบจองเวลา
                            </Typography>

                            <Divider />

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
                                            <Typography color="text.secondary">ไม่พบช่วงเวลา</Typography>
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
                                                            <Typography fontWeight="bold">
                                                                {dayjs(item.appointment_datetime).format('DD/MM/YYYY HH:mm')}
                                                            </Typography>

                                                            <input type="radio" checked={isSelected} readOnly />
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
                        </Stack>
                    </Box>
                </Card>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
                    กรุณากรอกข้อมูลให้ครบถ้วนก่อนกดบันทึกการจอง
                </Typography>
            </Grid>
            <Dialog
                open={openModal}
                disableEscapeKeyDown={step !== 'PHONE'}
                onClose={() => {
                    if (step === 'PHONE') {
                        closeModal();
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
