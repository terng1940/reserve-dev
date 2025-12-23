import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';

// project import
import useConfig from 'hooks/useConfig';
import Palette from './palette';
import Typography from './typography';

import componentStyleOverrides from './compStyleOverride';
import customShadows from './shadows';

export default function ThemeCustomization({ children }) {
    const { borderRadius, fontFamily, mode, outlinedFilled, presetColor, themeDirection } = useConfig();

    const theme = useMemo(() => Palette(mode, presetColor), [mode, presetColor]);

    const themeTypography = useMemo(() => Typography(theme, borderRadius, fontFamily), [theme, borderRadius, fontFamily]);
    const themeCustomShadows = useMemo(() => customShadows(mode, theme), [mode, theme]);

    const themeOptions = useMemo(
        () => ({
            direction: themeDirection,
            palette: theme.palette,
            mixins: {
                toolbar: {
                    minHeight: '48px',
                    padding: '16px',
                    '@media (min-width: 600px)': {
                        minHeight: '48px'
                    }
                }
            },
            typography: themeTypography,
            customShadows: themeCustomShadows,
            components: {
                MuiCssBaseline: {
                    styleOverrides: `
                       @font-face {
                         font-family: 'NotoSansThaiLocal';
                         src: url('/fonts/NotoSansThai-Light.woff2') format('woff2');
                         font-weight: 300;
                         font-style: normal;
                         font-display: swap;
                       }
                       @font-face {
                         font-family: 'NotoSansThaiLocal';
                         src: url('/fonts/NotoSansThai-Regular.woff2') format('woff2');
                         font-weight: 400;
                         font-style: normal;
                         font-display: swap;
                       }
                       @font-face {
                         font-family: 'NotoSansThaiLocal';
                         src: url('/fonts/NotoSansThai-Medium.woff2') format('woff2');
                         font-weight: 500;
                         font-style: normal;
                         font-display: swap;
                       }
                       @font-face {
                         font-family: 'NotoSansThaiLocal';
                         src: url('/fonts/NotoSansThai-SemiBold.woff2') format('woff2');
                         font-weight: 600;
                         font-style: normal;
                         font-display: swap;
                       }
                       @font-face {
                         font-family: 'NotoSansThaiLocal';
                         src: url('/fonts/NotoSansThai-Bold.woff2') format('woff2');
                         font-weight: 700;
                         font-style: normal;
                         font-display: swap;
                       }
                     `
                }
            }
        }),
        [themeDirection, theme, themeCustomShadows, themeTypography]
    );

    const themes = createTheme(themeOptions);
    themes.components = {
        ...themes.components,
        ...componentStyleOverrides(themes, borderRadius, outlinedFilled)
    };

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

ThemeCustomization.propTypes = {
    children: PropTypes.node
};
