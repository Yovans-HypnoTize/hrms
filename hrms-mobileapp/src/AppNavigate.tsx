import React, { useEffect, useState } from 'react';
import { BackButtonEvent, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { PageLinks } from "./common/Constants"
import Login from "./components/Login";
import PageTemplate from "./pages/PageTemplate";
import AppToast from './components/AppToast';
import PreloaderBackdrop from './components/PreloaderBackdrop';
import ForgotPassword from './components/ForgotPassword';
import OtpVerify from './components/OtpVerify';
import ResetPassword from './components/ResetPassword';


const AppNavigate: React.FC = () => {
    return (
        <IonReactRouter>
            <IonRouterOutlet>
                <Route path={PageLinks.LOGIN} exact component={Login} />
                <Route exact path="/">
                    <Redirect to={PageLinks.LOGIN} />
                </Route>
                <Route path={PageLinks.FORGOT_PASSWORD} component={ForgotPassword}/>
                <Route path={PageLinks.OTP_VERIFY} component={OtpVerify}/>
                <Route path={PageLinks.RESET_PASSWORD} component={ResetPassword}/>
                <Route path={PageLinks.PAGE_EMPLOYEE + "/*"} component={PageTemplate} />
            </IonRouterOutlet>
            <AppToast />
            <PreloaderBackdrop />
        </IonReactRouter>
    );
}

export default AppNavigate;