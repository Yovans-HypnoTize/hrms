import React, { useEffect, useState } from "react";
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
import { eye, eyeOff, lockClosed, lockOpen } from "ionicons/icons";
import "./LoginPage.css";

const ResetPassword: React.FC = () => {
  const { state } = useLocation<any>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserID] = useState<any>("");
  const [showPassword, setShowPassword] = useState(false);

  const history = useHistory();
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();

  useEffect(() => {
    console.log("user email", state);
    setUserID(state.userID);
  }, []);

  const resetPassword = () => {
    if (!password) {
      toast.error("Please Enter Password");
    } else if (!confirmPassword) {
      toast.error("Please Enter Password");
    } else {
      addProcessingRequests();
      //testing-hrm
      ServerAPI.resetPassword(userId, password, confirmPassword)
        .then((response: any) => {
          if (response) {
            setPassword("");
            setConfirmPassword("");
            console.log("response login", response);
            toast.success(response["message"]);
            // const adminRoleName = response.admin_role_name;
            // persistLoginDetail(
            //   true,
            //   response.employee_first_name,
            //   response.employee_middle_name,
            //   response.employee_last_name,
            //   response.access_token,
            //   response.refresh_token
            // );
            history.push(PageLinks.LOGIN);
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
      resetPassword();
    }
  };
  return (
    <IonPage>
      <IonContent fullscreen={true}>
        <div className="login-page">
          <div className="logo-container">
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
            <h1 className="forgot-password-headerText mt-5">Reset Password</h1>
            <IonInput
              fill="outline"
              placeholder="Create your password"
              value={password}
              onIonInput={(event: any) => setPassword(event.target.value)}
            >
              <IonIcon
                slot="start"
                icon={lockOpen}
                aria-hidden="true"
              ></IonIcon>
            </IonInput>
            <IonInput
              fill="outline"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              placeholder="Re-enter your password"
              onIonInput={(event: any) =>
                setConfirmPassword(event.target.value)
              }
            >
              <IonIcon
                slot="start"
                icon={lockClosed}
                aria-hidden="true"
              ></IonIcon>
              <IonIcon
                slot="end"
                icon={showPassword ? eyeOff : eye}
                aria-hidden="true"
                onClick={() => setShowPassword(!showPassword)}
              ></IonIcon>
            </IonInput>

            <button className="login-submit mt-4" onClick={resetPassword}>
              SUBMIT
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ResetPassword;
