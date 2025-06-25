import React, { useEffect, useRef, useState } from "react";
import { APIData } from "../common/DataTypes";
import { useAppStateAPI } from "../common/AppStateAPI";
import { ServerAPI } from "../common/ServerAPI";
import toast from "react-hot-toast";
import { useHistory, useLocation } from "react-router-dom";
import { PageLinks } from "../common/Constants";
import { isValidEmail, persistLoginDetail } from "../common/Utilities";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
} from "@ionic/react";
import { eye, lockClosed, person } from "ionicons/icons";
import "./LoginPage.css";

const OtpVerify: React.FC = () => {
  const { state } = useLocation<any>();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [password, setPassword] = useState("");
  const [userID, setUserID] = useState<any>("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const history = useHistory();
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();

  useEffect(() => {
    console.log("user email", state);
    setUserID(state.userID);
    inputRefs.current[0]?.focus();
  }, []);

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
        validateOtp();
      } else {
        toast.error("Please fill in all OTP fields");
      }
    }
  };

  const otpVerify = (email: string, otpCode: string) => {
    addProcessingRequests();
    ServerAPI.otpVerify(email, otpCode)
      .then((response: any) => {
        if (response) {
          toast.success(response["message"]);
          history.push(PageLinks.RESET_PASSWORD, {
            userID: response.data.user_id,
          });
        } else if (response && response["message"]) {
          toast.error(response["message"]);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  const validateOtp = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter OTP");
      return;
    }
    otpVerify(userID, otpCode);
  };

  return (
    <IonPage>
      <IonContent fullscreen={true}>
        <div className="login-page">
          <div className="forgot-password-logo-container">
            <img
              src={
                window.location.origin +
                "/assets/images/adhiran-infotech-white-logo.png"
              }
              alt="company logo"
              className=""
            />
          </div>
          <div className="login-form-wrapper">
          <h1 className="forgot-password-headerText mt-5">
                    OTP VERIFICATION
                  </h1>
                  <div className="login-form mx-3 mt-3">
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
                          style={{
                            textAlign: "center",
                            height: 40,
                            width: 35,
                            margin: "0px 5px 30px 5px",
                            borderRadius: 5,
                            border: "1px solid #0D3C58",
                          }}
                        />
                      ))}
                    </div>
                    <button className="login-submit" onClick={validateOtp}>
                      SUBMIT
                    </button>
                  </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OtpVerify;

