import React from 'react';
import { useDispatch } from 'store/index';
import { useNavigate } from 'react-router-dom';
import { useStores } from 'contexts/StoreContext';
import { openSnackbar } from 'store/slices/snackbar';
import { Formik } from 'formik';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

// third party
import * as Yup from 'yup';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import RoutePaths from 'routes/routePaths';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const JWTRegister = ({ ...others }) => {
    const { registerAdminApiStore } = useStores();
    const theme = useTheme();
    const navigate = useNavigate();
    const { login } = useAuth();
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const ROLE_OPTIONS = [{ label: 'Admin', value: 'ADMIN' }];

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">สมัครเข้าสู่ระบบด้วย ชื่อผู้ใช้ และ รหัสผ่าน</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    username: '',
                    password: '',
                    confirmPassword: '',
                    role_name: 'ADMIN',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string().required('กรุณากรอกชื่อผู้ใช้'),
                    password: Yup.string().required('กรุณากรอกรหัสผ่าน').length(6, 'รหัสผ่านต้องมีความยาว 6 ตัวอักษรเท่านั้น'),
                    confirmPassword: Yup.string()
                        .required('กรุณายืนยันรหัสผ่าน')
                        .oneOf([Yup.ref('password')], 'รหัสผ่านไม่ตรงกัน'),
                    role_name: Yup.string().required('กรุณาเลือกบทบาท')
                })}
                onSubmit={async (values) => {
                    setIsLoading(true);

                    try {
                        const payload = {
                            username: values.username,
                            password: values.password,
                            role_name: values.role_name
                        };

                        await registerAdminApiStore.handleRegisterAdminService(payload);

                        await login(values.username, values.password);

                        navigate(RoutePaths.menuAllData, { replace: true });
                    } catch (err) {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: err?.message || 'เกิดข้อผิดพลาด',
                                variant: 'alert',
                                anchorOrigin: {
                                    vertical: 'top',
                                    horizontal: 'center'
                                },
                                autoHideDuration: 3000,
                                alert: { color: 'error' }
                            })
                        );

                        setIsLoading(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl
                            fullWidth
                            error={Boolean(touched.username && errors.username)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-username-register">ชื่อผู้ใช้สำหรับเข้าสู่ระบบ</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-username-register"
                                type="text"
                                value={values.username}
                                name="username"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {touched.username && errors.username && <FormHelperText error>{errors.username}</FormHelperText>}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-register">รหัสผ่าน</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                autoComplete="new-password"
                                name="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    if (e.target.value.length <= 6) {
                                        handleChange(e);
                                        changePassword(e.target.value);
                                    }
                                }}
                                inputProps={{ maxLength: 6 }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-confirm-password-register">ยืนยันรหัสผ่าน</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-confirm-password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.confirmPassword}
                                autoComplete="new-password"
                                name="confirmPassword"
                                label="ยืนยันรหัสผ่าน"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    if (e.target.value.length <= 6) {
                                        handleChange(e);
                                    }
                                }}
                                inputProps={{ maxLength: 6 }}
                            />
                            {touched.confirmPassword && errors.confirmPassword && (
                                <FormHelperText error>{errors.confirmPassword}</FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.role_name && errors.role_name)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <TextField
                                select
                                fullWidth
                                variant="outlined"
                                name="role_name"
                                value={values.role_name}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={Boolean(touched.role_name && errors.role_name)}
                                helperText={touched.role_name && errors.role_name}
                                InputLabelProps={{ shrink: true }}
                                sx={{ ...theme.typography.customInput }}
                            >
                                {ROLE_OPTIONS.map((role) => (
                                    <MenuItem key={role.value} value={role.value}>
                                        {role.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {touched.role_name && errors.role_name && <FormHelperText error>{errors.role_name}</FormHelperText>}
                        </FormControl>

                        <Grid container alignItems="center" justifyContent="space-between">
                            {/* <Grid item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={(event) => setChecked(event.target.checked)}
                                            name="checked"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="subtitle1">
                                            Agree with &nbsp;
                                            <Typography variant="subtitle1" component={Link} to="#">
                                                Terms & Condition.
                                            </Typography>
                                        </Typography>
                                    }
                                />
                            </Grid> */}
                        </Grid>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button disabled={isLoading} fullWidth size="large" type="submit" variant="contained" color="secondary">
                                    {isLoading ? 'กำลังสมัครเข้าสู่ระบบ MC...' : 'สมัครเข้าสู่ระบบ MC'}
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default JWTRegister;
