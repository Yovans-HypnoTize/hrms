import React, { useState } from "react";
// import { APIData } from "../common/DataTypes";
import { useAppStateAPI } from "../common/AppStateAPI";
import { ServerAPI } from "../common/ServerAPI";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PageLinks } from "../common/Constants";
// import {
//   persistLoginClientDetail,
//   persistLoginDetail,
// } from "../common/Utilities";
import AuthLayout from "./AuthLayout";

const ForgotPassword: React.FC = () => {
  const [userID, setUserID] = useState("");

  const navigate = useNavigate();
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitEmail = () => {
    if (!userID) {
      toast.error("Please Enter Email");
    } else if (!isValidEmail(userID)) {
      toast.error("Please Enter a Valid Email Address");
    } else {
      addProcessingRequests();
      ServerAPI.ForgotPassword(userID)
        .then((response: any) => {
          if (response) {
            console.log("response forgotpassword", response);
            toast.success(response["message"]);
            navigate(PageLinks.OTP_VERIFY, { state: userID });
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
      submitEmail();
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
      <h1 className="login-welcome">Forgot Password</h1>
      <div className="login-form">
        <div
          className="d-flex justify-content-start mb-4"
          style={{ flexDirection: "column" }}
        >
          <input
            type="text"
            className="login-input"
            placeholder="Enter your email"
            onChange={(e) => setUserID(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button className="login-submit" onClick={submitEmail}>
          SUBMIT
        </button>
      </div>
    </AuthLayout>
    // <div className="account-body">
    //   <div className="col-12">
    //     <div className="row">
    //       <div className="col-6 login-left">
    //         <div className="login-content">
    //           <div className="align-items-center justify-content-center mobile-login py-3">
    //             <div style={{ height: "auto", width: "180px" }}>
    //               <img
    //                 src={
    //                   window.location.origin + "/assets/images/adhiran-infotech-logo.png"
    //                 }
    //                 alt="adhiran infotech logo"
    //                 className="logo-lg"
    //               />
    //             </div>
    //           </div>
    //           <h1 className="login-welcome">Forgot Password</h1>
    //           <div className="login-form">
    //             <div
    //               className="d-flex justify-content-start mb-4"
    //               style={{ flexDirection: "column" }}
    //             >
    //               {/* <p className="login-label mb-2">User ID</p> */}
    //               <input
    //                 type="text"
    //                 className="login-input"
    //                 placeholder="Enter your email"
    //                 onChange={(e) => setUserID(e.target.value)}
    //                 onKeyDown={handleKeyDown}
    //               />
    //             </div>

    //             <button className="login-submit" onClick={submitEmail}>
    //               SUBMIT
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="col-6 login-right align-items-center justify-content-center ">
    //         <div style={{ height: "auto", width: "180px" }}>
    //           <img
    //             src={window.location.origin + "/assets/images/adhiran-infotech-white-logo.png"}
    //             alt="adhiran infotec logo"
    //             className="logo-lg"
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ForgotPassword;
