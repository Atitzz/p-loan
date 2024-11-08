import { useContext } from "react";
import "./css/App.css";
import {
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import LayoutBeforeLogin from "./_layout/LayoutBeforeLogin";
import LayoutAfterLogin from "./_layout/LayoutAfterLogin";
import ComingSoon from "./_layout/ComingSoon";
import Authentication from "./controller/authentication/Authentication";
import NaviAuth from "./controller/authentication/NaviAuth";
import { MainContext } from "./context/Context";
import Home from "./controller/Home/Home";
import Profile from "./controller/Profile/Profile";
import History from "./controller/Profile/Manage/History";
import Plans from "./controller/Loans/Plans";
import TakeLoans from "./controller/Loans/TakeLoans";
import KYC from "./controller/kyc/KYC";
import LineAccess from "./controller/authentication/LineAccess";
import MyLoans from "./controller/Loans/MyLoans";
import LoanHistory from "./controller/Loans/component/LoanHistory";
import Contract from "./controller/Loans/Contract";
import Manage from "./controller/Profile/Manage/Manage";
import SetPIN from "./controller/Profile/Manage/SetPIN";
import LoanDue from "./controller/Loans/component/LoanDue";
import TestCamera from "./controller/Home/TestCamera";
import Test2 from "./controller/Home/Test2";
import Paysolution from "./controller/paysolution/Paysolution";
function App() {
  const { auth }: any = useContext(MainContext);
  const theme = createTheme({
    spacing: 4,
    typography: {
      fontFamily: "Sarabun, sans-serif",
    },
  });

  // useEffect(() => {
  //   liff
  //     .init({ liffId })
  //     .then(() => console.log("LIFF initialized"))
  //     .catch((error) => console.error("LIFF initialization failed", error));
  // }, []);
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {/* <Route path="/face" element={<FaceRecognition />} /> */}
        <Route path="test" element={<TestCamera />} />
        <Route path="test2" element={<Test2 />} />
        {auth.status ? (
          <Route path="/" element={<LayoutAfterLogin />}>
            <Route path="" element={<Home />} />
            <Route path="kyc" element={<KYC />} />
            <Route path="profile">
              <Route path="" element={<Profile />} />
              <Route path="manage" element={<Manage />} />
              <Route path="pin" element={<SetPIN />} />
              <Route path="history" element={<History />} />
            </Route>
            <Route path="loans">
              <Route path="" element={<Plans />} />
              <Route path="takeloan/:id" element={<TakeLoans />} />
              <Route path="history/:loan_id" element={<LoanHistory />} />
              <Route path="due/:loan_id" element={<LoanDue />} />
              <Route path="contract/:loan_number" element={<Contract />} />

              {/* <Route path="myloan" element={<MyLoans />} /> */}
            </Route>
            <Route path="soon" element={<ComingSoon />} />
            <Route path="existed" element={<ComingSoon />} />
            <Route path="logout" element={<NaviAuth />} />
            {/* <Route path="*" element={<Navigate to="/" />} /> */}
          </Route>
        ) : (
          <Route path="/" element={<LayoutBeforeLogin />}>
            <Route path="" element={<Authentication />} />
            <Route path="signin" element={<Authentication />} />
            {/* <Route path="signup" element={<Register />} /> */}
            <Route path="line/:token" element={<LineAccess />} />
           
            {/* <Route path="otp/:mobile" element={<OTPVerify />} /> */}
          </Route>
        )}
        {/* <Route path="activate/:token" element={<EmailVerify />} /> */}
        <Route path="payment/:loan_number/:refno/:amount" element={<Paysolution />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
