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
import './LoginPage.css'

const Login: React.FC = () => {
  const [password, setPassword] = useState("");
  const [userID, setUserID] = useState("");

  const history = useHistory();
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();

  const userLogin = () => {
    if (!userID) {
      toast.error("Please Enter Email");
    } else if (!password) {
      toast.error("Please Enter Password");
    } else {
      if (isValidEmail(userID)) {
        addProcessingRequests();
        // testing-hrm
        ServerAPI.userLogin(userID, password)
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
                response?.data?.profile
              );
              history.push(PageLinks.EMPLOYEE_DASHBOARD);
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
      userLogin();
    }
  };

  const forgotPasswordClickHandler = () => {
    history.push(PageLinks.FORGOT_PASSWORD);
  };

  // useEffect(() => {
  //   const onResize = () => {
  //     // You can store initial window height and detect changes
  //     const isKeyboardOpen = window.innerHeight < initialHeight - 100;
  //     if (isKeyboardOpen) {
  //       document.body.classList.add("keyboard-is-open");
  //     } else {
  //       document.body.classList.remove("keyboard-is-open");
  //     }
  //   };

  //   const initialHeight = window.innerHeight;
  //   window.addEventListener("resize", onResize);
  //   return () => window.removeEventListener("resize", onResize);
  // }, []);

  return (
    <IonPage>
      <IonContent fullscreen={true} >
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
        <h1 className="login-welcome">Welcome</h1>
                  <p className="login-greet login-welcome">
                    Welcome!!!! Please enter your details
                  </p>
          <IonInput fill="outline" placeholder="Enter your email">
            <IonIcon slot="start" icon={person} aria-hidden="true"></IonIcon>
          </IonInput>
          <IonInput
            fill="outline"
            type="password"
            value=""
            placeholder="Enter your password"
          >
            <IonIcon
              slot="start"
              icon={lockClosed}
              aria-hidden="true"
            ></IonIcon>
            <IonButton fill="clear" slot="end" aria-label="Show/hide">
              <IonIcon slot="icon-only" name={eye} aria-hidden="true"></IonIcon>
            </IonButton>
          </IonInput>
          <div className="d-flex justify-content-end">
            <button
              className="login-forgot"
              onClick={forgotPasswordClickHandler}
            >
              Forgot Password?
            </button>
          </div>
          <button className="login-submit mt-3" onClick={userLogin}>
                      LOG IN
                    </button>
        </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
