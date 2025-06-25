import React, { useState } from "react";
// import { APIData } from "../common/DataTypes";
import { useAppStateAPI } from "../common/AppStateAPI";
import { ServerAPI } from "../common/ServerAPI";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PageLinks } from "../common/Constants";
import {
  persistLoginClientDetail,
  persistLoginDetail,
} from "../common/Utilities";
import AuthLayout from "./AuthLayout";

const Login: React.FC = () => {
  const [password, setPassword] = useState("");
  const [userID, setUserID] = useState("");

  const navigate = useNavigate();
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const userLogin = () => {
    if (!userID) {
      toast.error("Please Enter Email");
    } else if (!isValidEmail(userID)) {
      toast.error("Please Enter a Valid Email Address");
    } else if (!password) {
      toast.error("Please Enter Password");
    } else {
      addProcessingRequests();
      ServerAPI.AdminLogin(userID, password)
        .then((response: any) => {
          if (response) {
            console.log("response login", response);
            toast.success(response["message"]);
            const adminRoleName = response?.data?.user?.role?.role_name;
            persistLoginDetail(
              true,
              response?.data?.user?.user_id,
              response?.data?.user?.role?.role_name,
              response?.data?.access_token,
              response?.data?.profile,
              response?.data?.refresh_token,
            );
            if (
              response.client &&
              response.companies &&
              response.companies.length > 0
            ) {
              persistLoginClientDetail(
                response.client.client_id,
                response.client.client_name,
                response?.company_id,
                response?.company_name,
                response?.profile
              );
            }
            if (adminRoleName === "ADMIN") {
              navigate(PageLinks.ADMIN_DASHBOARD);
            } else if (adminRoleName === "CLIENT/EMPLOYER") {
              // navigate(PageLinks.OTP_VERIFY,{ state: userID })
              navigate(PageLinks.EMPLOYER_DASHBOARD);
            } else if (
              adminRoleName === "EMPLOYEE" ||
              adminRoleName === "MANAGER"
            ) {
              navigate(PageLinks.EMPLOYEE_DASHBOARD);
            }
          } else if (response && response["message"]) {
            toast.error(response["message"]);
          }
        })
        .finally(() => {
          reduceProcessingRequests();
        });
    }
  };

  const handleForgotPassword = () => {
    navigate(PageLinks.FORGOT_PASSWORD);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      userLogin();
    }
  };

  return (
    <AuthLayout>
      <div className="align-items-center justify-content-center mobile-login py-3">
        <div style={{ height: "auto", width: "180px" }}>
          <img
            src={
              window.location.origin +
              "/assets/images/adhiran-infotech-logo.png"
            }
            alt="adhiran infotech logo"
            className="logo-lg"
          />
        </div>
      </div>
      <h1 className="login-welcome">Welcome</h1>
      <p className="login-greet login-welcome">
        Welcome!!!! Please enter your details
      </p>
      <div className="login-form">
        <div
          className="d-flex justify-content-start mb-4"
          style={{ flexDirection: "column" }}
        >
          <p className="login-label mb-2">Email</p>
          <input
            type="text"
            className="login-input"
            placeholder="Enter your email"
            onChange={(e) => setUserID(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div
          className="d-flex justify-content-start "
          style={{ flexDirection: "column" }}
        >
          <p className="login-label mb-2">Password</p>
          <input
            type="password"
            className="login-input"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="login-forgot" onClick={handleForgotPassword}>
            Forgot Password?
          </button>
        </div>
        <button className="login-submit" onClick={userLogin}>
          LOG IN
        </button>
      </div>
    </AuthLayout>
  );
};

export default Login;
