import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.adhiraninfotech.hrmsemployee',
  appName: 'HRMS Employee Portal',
  webDir: 'dist',
  server: {
    // hostname: '10.0.2.2',
    cleartext: true,
    // androidScheme: 'http',
    
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 2000,
      backgroundColor: "#d0d0d0",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      // useDialog: true,
    },
  },
};

export default config;
