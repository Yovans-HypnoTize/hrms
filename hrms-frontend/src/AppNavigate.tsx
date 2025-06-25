import React from "react";
import { PageLinks } from "./common/Constants";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/login";
import PageTemplate from "./pages/PageTemplate";
import PreloaderBackdrop from "./components/PreloaderBackdrop";
import AppToast from "./components/AppToast";
import ForgotPassword from "./components/ForgotPassword";
import OtpVerify from "./components/OtpVerify";
import ResetPassword from "./components/ResetPassword";

const AppNavigate: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to={PageLinks.LOGIN} />} />
                <Route path={PageLinks.LOGIN} element={<Login />} />
                <Route path={PageLinks.FORGOT_PASSWORD} element={<ForgotPassword />} />
                <Route path={PageLinks.OTP_VERIFY} element={<OtpVerify />} />
                <Route path={PageLinks.RESET_PASSWORD} element={<ResetPassword />} />
                <Route path={PageLinks.PAGE_SUPER_ADMIN + "/*"} element={<PageTemplate />} />
                <Route path={PageLinks.PAGE_EMPLOYER + "/*"} element={<PageTemplate />} />
                <Route path={PageLinks.PAGE_EMPLOYEE + "/*"} element={<PageTemplate />} />
            </Routes>
            <AppToast />
            <PreloaderBackdrop />
        </Router>
    );
}

export default AppNavigate;