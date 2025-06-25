import React, { useState } from "react";
// import { APIData } from "../common/DataTypes";
import { useAppStateAPI } from "../common/AppStateAPI";
import { ServerAPI } from "../common/ServerAPI";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { PageLinks } from "../common/Constants";
// import {
//   persistLoginClientDetail,
//   persistLoginDetail,
// } from "../common/Utilities";
import AuthLayout from "./AuthLayout";

const ResetPassword: React.FC = () => {
  const { state } = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();

  const userLogin = () => {
    if (!confirmPassword) {
      toast.error("Please Enter password");
    } else if (!newPassword) {
      toast.error("Please Enter Password");
    } else {
      console.log(newPassword, confirmPassword);

      addProcessingRequests();
      let USERID = state;
      console.log("From reset password", USERID, confirmPassword, newPassword);
      ServerAPI.ResetPassword(USERID, confirmPassword, newPassword)
        .then((response: any) => {
          if (response) {
            console.log("response login", response);
            toast.success(response["message"]);
            navigate(PageLinks.LOGIN);
          } else if (response && response["message"]) {
            toast.error(response["message"]);
          }
        })
        .finally(() => {
          reduceProcessingRequests();
        });
    }
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
            alt="adhiran-infotech-logo"
            className="logo-lg"
          />
        </div>
      </div>
      <h1 className="login-welcome mb-2">Reset Password</h1>
      <div className="login-form">
        <div
          className="d-flex justify-content-start mb-4"
          style={{ flexDirection: "column" }}
        >
          <p className="login-label mb-2">New Password</p>
          <input
            type="text"
            className="login-input"
            placeholder="Enter new password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div
          className="d-flex justify-content-start "
          style={{ flexDirection: "column" }}
        >
          <p className="login-label mb-2">Confirm Password</p>
          <input
            type="password"
            className="login-input"
            placeholder="Enter confirm password"
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button className="login-submit mt-5" onClick={userLogin}>
          SUBMIT
        </button>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
