import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Formik } from 'formik';
import { useDispatch } from 'store/index';
import { openSnackbar } from 'store/slices/snackbar';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

// third party
import * as Yup from 'yup';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import RoutePaths from 'routes/routePaths';
// ===============================|| JWT LOGIN ||=============================== //

const JWTLogin = ({ loginProp, ...others }) => {
    const theme = useTheme();

    const { login } = useAuth();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = React.useState(false);

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Formik
            initialValues={{
                username: '',
                password: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                username: Yup.string().required('กรุณากรอกชื่อผู้ใช้'),
                password: Yup.string().required('กรุณากรอกรหัสผ่าน').length(6, 'รหัสผ่านต้องมีความยาว 6 ตัวอักษรเท่านั้น')
            })}
            onSubmit={async (values) => {
                setIsLoading(true);
                try {
                    await login(values.username, values.password);
                    navigate(RoutePaths.menuAllData, { replace: true });
                } catch (err) {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'เกิดข้อผิดพลาด',
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
                    <FormControl fullWidth error={Boolean(touched.username && errors.username)} sx={{ ...theme.typography.customInput }}>
                        {' '}
                        <InputLabel htmlFor="outlined-adornment-username-login">ชื่อผู้ใช้สำหรับเข้าสู่ระบบ</InputLabel>{' '}
                        <OutlinedInput
                            id="outlined-adornment-username-login"
                            type="text"
                            value={values.username}
                            name="username"
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />{' '}
                        {touched.username && errors.username && <FormHelperText error>{errors.username}</FormHelperText>}{' '}
                    </FormControl>

                    <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-password-login">รหัสผ่าน</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password-login"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            autoComplete="new-password"
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
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
                            inputProps={{
                                maxLength: 6
                            }}
                            label="Password"
                        />
                        {touched.password && errors.password && (
                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                {errors.password}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(event) => setChecked(event.target.checked)}
                                        name="checked"
                                        color="primary"
                                    />
                                }
                                label="Keep me logged in"
                            /> */}
                        </Grid>
                        <Grid item>
                            {/* <Typography
                                variant="subtitle1"
                                component={Link}
                                to={RoutePaths.forgotPassword}
                                color="secondary"
                                sx={{ textDecoration: 'none' }}
                            >
                                Forgot Password?
                            </Typography> */}
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button disabled={isLoading} fullWidth size="large" type="submit" variant="contained" color="secondary">
                                {isLoading ? 'กำลังเข้าสู่ระบบ MC...' : 'เข้าสู่ระบบ MC'}
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

JWTLogin.propTypes = {
    loginProp: PropTypes.number
};

export default JWTLogin;
