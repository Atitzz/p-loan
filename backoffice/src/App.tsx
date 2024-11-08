import { useContext, useEffect, useMemo } from "react";
import "./css/App.css";
import {
  ThemeProvider,
  alpha,
  createTheme,
  getContrastRatio,
} from "@mui/material";
import { Route, Routes } from "react-router-dom";
import LayoutBeforeLogin from "./_layout/LayoutBeforeLogin";
import LayoutAfterLogin from "./_layout/LayoutAfterLogin";
import Dashboard from "./controller/dashboard/Dashboard";
import ComingSoon from "./_layout/ComingSoon";
import Sidebar_Route from "./controller/sidebar/Sidebar_Route";
import Authentication from "./controller/authentication/Authentication";
import Sidebar_Visibility from "./controller/sidebar/Sidebar_Visibility";
import { getComponent } from "./_layout/json/routes";
import Logout from "./controller/authentication/Logout";
import NaviAuth from "./controller/authentication/NaviAuth";
import { MainContext } from "./context/Context";
import EmailVerify from "./controller/authentication/EmailVerify";
import AddInstallment from "./controller/loans/AddInstallment";
import Paysolution from "./controller/loans/Paysolution";

function App() {
  const { auth, dataRoute, ThemePrimary }: any = useContext(MainContext);
  const theme = createTheme({
    palette: {
      primary: {
        main: ThemePrimary,
        light: alpha(ThemePrimary, 0.5),
        dark: alpha(ThemePrimary, 0.9),
        contrastText:
          getContrastRatio(ThemePrimary, "#fff") > 4.5 ? "#fff" : "#111",
      },
    },
    spacing: 4,
    typography: {
      fontFamily: "Sarabun, sans-serif",
      fontSize: 12,
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: ThemePrimary,
            color:
              getContrastRatio(ThemePrimary, "#fff") > 4.5 ? "#fff" : "#111",
            "::-webkit-scrollbar": {
              display: "none",
            },
          },
        },
      },
    },
  });

  const hasDuplicatePaths = useMemo(() => {
    return dataRoute.reduce((acc, current) => {
      if (acc.some((route) => route.path === current.path)) {
        return [...acc, { ...current, duplicate: true }];
      }
      return [...acc, current];
    }, []);
  }, [dataRoute]);

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {auth.status ? (
          <Route path="/" element={<LayoutBeforeLogin />}>
            <Route path="" element={<Dashboard />} />
            {hasDuplicatePaths.length > 0 &&
              hasDuplicatePaths.map((x, i) => {
                return (
                  <Route
                    key={i}
                    path={x.path}
                    element={getComponent(x.component)}
                  />
                );
              })}
          
            <Route path="sidebar">
              <Route path="route" element={<Sidebar_Route />} />
              <Route path="visibility" element={<Sidebar_Visibility />} />
            </Route>
            <Route path="soon" element={<ComingSoon />} />
            <Route path="logout" element={<Logout />} />
          </Route>
        ) : (
          <Route path="/" element={<LayoutAfterLogin />}>
            <Route path="" element={<Authentication />} />

            <Route path="logout" element={<NaviAuth />} />
          </Route>
        )}
        {/* <Route path="activate/:token" element={<EmailVerify />} /> */}
        <Route
              path="payment/:loan_number/:refno/:amount/:email"
              element={<Paysolution />}
            />
        <Route path="*" element={getComponent("error")} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
