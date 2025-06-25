import React, { useEffect, useState } from "react";
import { APIData } from "../common/DataTypes";
import { useAppStateAPI } from "../common/AppStateAPI";
import { ServerAPI } from "../common/ServerAPI";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
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

const ForgotPassword: React.FC = () => {
  const [userID, setUserID] = useState("");

  const history = useHistory();
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();

  const forgotPassword = () => {
    if (!userID) {
      toast.error("Please Enter Email");
    } else {
      if (isValidEmail(userID)) {
        addProcessingRequests();
        ServerAPI.forgotPassword(userID)
          .then((response: any) => {
            setUserID("");
            if (response) {
              toast.success(response["message"]);
              history.push(PageLinks.OTP_VERIFY, { userID: userID });
            } else if (response && response["message"]) {
              toast.error(response["message"]);
            }
          })
          .finally(() => {
            reduceProcessingRequests();
          });
      } else {
        toast.error("Please Enter Valid Email");
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      forgotPassword();
    }
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
            <h1 className="forgot-password-headerText mt-5">Forgot Password</h1>
            <div className="my-3">
              <IonInput
                value={userID}
                fill="outline"
                placeholder="Enter your email"
                onIonInput={(event: any) => setUserID(event.target.value)}
              >
                <IonIcon
                  slot="start"
                  icon={person}
                  aria-hidden="true"
                ></IonIcon>
              </IonInput>
            </div>

            <button className="login-submit mt-3" onClick={forgotPassword}>
              SUBMIT
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
