import { useContext, useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { DarkModeContext } from './Contexts/DarkModeContextProvider';
import StrategyContextProvider from './Contexts/StrategyContextProvider';
import ToastContextProvider from './Contexts/ToastContextProvider';
import CustomPresetsContextProvider from './Contexts/CustomPresetsContextProvider';
import Chart from './components/Chart';
import Configure from './components/Configure';
import Presets from './components/Presets';
import "@fontsource/exo/700.css";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import blue from "@mui/material/colors/blue";
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import GitHubIcon  from '@mui/icons-material/GitHub';
import useMediaQuery from '@mui/material/useMediaQuery';
import Toast from './components/Toast';

function App() {
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const viewportTheme = useTheme();
  const isLargeScreen = useMediaQuery(viewportTheme.breakpoints.up("lg"));

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      text: {
        primary: darkMode ? "#ffffff" : "#0a0a0a",
        secondary: darkMode ? "#d1d1d1" : "#525252",
      },
      background: {
        default: darkMode ? "#121212" : "#ebebeb",
        secondary: darkMode ? "#303030" : "#ffffff",
      },
      border: {
        main: darkMode ? "#525252" : "#d1d1d1",
        selected: darkMode ? blue[200] : blue[600],
      },
      button: {
        main: darkMode ? blue[200] : blue[600]
      }
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? "#303030" : "#ffffff",
            color: darkMode ? "#ffffff" : "#303030",
          }
        }
      },
    }
  });

  const toggleDrawer = (bool) => () => {
    setDrawerOpen(bool);
  };

  const appBarStyles = {
    sx: {
      borderBottom: 1,
      borderColor: "border.main",
      height: '3.4rem',
      display: 'flex',
      flexDirection: "row",
      alignItems: 'center'
    }
  };

  useEffect(() => {
    if (isLargeScreen) {
      setDrawerOpen(false);
    }
  }, [isLargeScreen])

  return (
    <ThemeProvider theme={theme}>
      <ToastContextProvider>
        <CssBaseline />
        <AppBar {...appBarStyles} elevation={0}>
          <Typography 
            variant='h6' 
            sx={
              { 
                flexGrow: 1, 
                px: 1, 
                fontFamily: 'Exo',
                display: "inline-flex",
                gap: "5px"
              }
            }
          >
             <Link 
              href="https://github.com/anshuthopsee/option-payoff"
              sx={{
                display: "flex",
                alignItems: "center"
              }}
            >
              <GitHubIcon/> 
            </Link>
            option-payoff
          </Typography>
          <IconButton 
            size={"small"} 
            onClick={() => setDarkMode(!darkMode)}
            sx={{color: darkMode ? "#ffffff" : "#303030", mx: "10px"}}
          >
            {
              darkMode ? 
                <LightModeIcon/>
              :
                <DarkModeIcon/>
            }
          </IconButton>
          <Box sx={{ display: { xs: 'flex', lg: 'none'},  mx: "10px" }}>
            <IconButton
              size="small"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </AppBar>
        <StrategyContextProvider>
          <CustomPresetsContextProvider>
            <Drawer
              anchor={"right"}
              open={drawerOpen ? true : false}
              PaperProps={{
                sx: { maxWidth: {xs: "145px", md: "280px"} },
              }}
              onClose={toggleDrawer(false)}
            >
              <Presets drawerView={true} toggleDrawer={toggleDrawer}/>
            </Drawer>
            <Container 
              maxWidth={false} 
              disableGutters
              sx={
                {
                  minHeight: '100vh', 
                  maxHeight: "100%",
                  display: 'flex',
                  flexDirection: "column",
                  pt: "65px",
                  pb: "15px",
                  px: "10px",
                  maxWidth: '1500px',
                  flexGrow: 1,
                  position: "relative"
                }
              }
            >
              <div style={{ flex: 1 }}>
                <Grid container spacing={"10px"}>
                  <Grid item lg={7} md={12} sm={12} xs={12}>
                    <Chart/>
                  </Grid>
                  <Grid item lg={5} md={12} sm={12} xs={12}>
                    <Configure darkMode={darkMode}/>
                  </Grid>
                </Grid>
                <Box sx={{ display: {lg: "block", xs: "none"}, mt: "10px", position: "relative" }}>
                  <Presets drawerView={false} toggleDrawer={toggleDrawer}/>
                </Box>
              </div>
              <Typography 
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: 'center',
                  mt: "40px",
                  width: "100%",
                  height: "40px",
                }}>
                <Link 
                  href="https://github.com/anshuthopsee/option-payoff"sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}
                >
                  <GitHubIcon/> 
                  anshuthopsee/option-payoff 
                </Link>
              </Typography>
            </Container>
          </CustomPresetsContextProvider>
        </StrategyContextProvider>
        <Toast/>
      </ToastContextProvider>
    </ThemeProvider>
  );
};

export default App;
