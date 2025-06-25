import React, { useEffect, useRef, useState } from "react";
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
import { getAdminRole } from "../common/Utilities";

const OtpVerify: React.FC = () => {
  const { state } = useLocation();
  const [email, setEmail] = useState<any>("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  // const [userId, setUserId] = useState<string>();

  useEffect(() => {
    setEmail(state);
    inputRefs.current[0]?.focus();
  }, []);

  // const handleChange = (index: number, value: string) => {
  //   if (value.match(/^[0-9]*$/)) {
  //     const newOtp = [...otp];
  //     const digits = value.split("").slice(0, 6);
  //     digits.forEach((digit, i) => {
  //       newOtp[index + i] = digit;
  //     });
  //     setOtp(newOtp);

  //     const nextIndex = index + digits.length;
  //     if (nextIndex < 6) {
  //       inputRefs.current[nextIndex]?.focus();
  //     }
  //   }
  // };
  const handleChange = (index: number, value: string) => {
    if (/^[0-9]*$/.test(value)) {
      const digits = value.split("").filter((char) => /\d/.test(char)).slice(0, 6 - index); // max fill to 6 total
      const newOtp = [...otp];
  
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
  
      setOtp(newOtp);
  
      const nextIndex = index + digits.length;
      if (nextIndex < 6) {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" || event.key === "Delete") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
      } else if (index > 0) {
        newOtp[index - 1] = "";
        inputRefs.current[index - 1]?.focus();
      }
      setOtp(newOtp);
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  
    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (event.key === "Enter") {
      const otpCode = otp.join("");
      if (otpCode.length === 6) {
        userLogin();
      } else {
        toast.error("Please fill in all OTP fields");
      }
    }
  };

  const otpVerify = (email: string,otpCode:string) => {
    addProcessingRequests();
    ServerAPI.OtpVerification(email, otpCode)
      .then((response: any) => {
        if (response) {
          toast.success(response["message"]);
          // const role = getAdminRole();
          // if(role === "CLIENT/EMPLOYER"){
          //   navigate(PageLinks.EMPLOYER_DASHBOARD);
          // } else {
            navigate(PageLinks.RESET_PASSWORD, { state: response.data.user_id });
          // }
        } else if (response && response["message"]) {
          toast.error(response["message"]);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  }

  const userLogin = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter OTP");
      return;
    }
    otpVerify(email,otpCode)
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
      <h1 className="login-welcome">OTP VERIFICATION</h1>
      <div className="login-form">
        <div className="d-flex justify-content-center mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              className="otp-input"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength={6}
              style={{ textAlign: "center" }}
            />
          ))}
        </div>

        <button className="login-submit" onClick={userLogin}>
          SUBMIT
        </button>
      </div>
    </AuthLayout>
  );
};

export default OtpVerify;
