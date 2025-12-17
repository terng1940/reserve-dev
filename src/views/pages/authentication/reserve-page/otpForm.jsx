import React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const OtpForm = ({ otp, phone, loading, onChange, onSubmit }) => {
    return (
        <Stack spacing={2}>
            <Typography variant="h6" align="center">
                กรอกรหัส OTP
            </Typography>

            <Typography variant="body2" color="text.secondary" align="center">
                ระบบได้ส่งรหัส OTP ไปที่เบอร์ {phone}
            </Typography>

            <TextField
                fullWidth
                label="รหัส OTP"
                placeholder="กรอกรหัส 6 หลัก"
                value={otp}
                onChange={(e) => onChange(e.target.value)}
                inputProps={{ maxLength: 6 }}
            />

            <Button variant="contained" size="large" disabled={!otp || loading} onClick={onSubmit}>
                {loading ? <CircularProgress size={20} /> : 'ยืนยัน'}
            </Button>
        </Stack>
    );
};

export default OtpForm;
