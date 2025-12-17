import React from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const PhoneForm = ({ phone, loading, onChange, onSubmit }) => {
    return (
        <Stack spacing={2}>
            <Typography variant="h6" align="center">
                ยืนยันเบอร์โทรศัพท์
            </Typography>

            <Typography variant="body2" color="text.secondary" align="center">
                กรุณากรอกเบอร์โทรศัพท์เพื่อรับรหัส OTP
            </Typography>

            <TextField
                fullWidth
                label="เบอร์โทรศัพท์"
                placeholder="เช่น 0812345678"
                value={phone}
                onChange={(e) => onChange(e.target.value)}
                inputProps={{ maxLength: 10 }}
            />

            <Button variant="contained" size="large" disabled={!phone || loading} onClick={onSubmit}>
                {loading ? <CircularProgress size={20} /> : 'ส่งรหัส OTP'}
            </Button>
        </Stack>
    );
};

export default PhoneForm;
