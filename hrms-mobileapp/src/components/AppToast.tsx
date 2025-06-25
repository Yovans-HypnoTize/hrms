import { Toaster } from "react-hot-toast";
import ReactDOM from "react-dom";

const AppToast: React.FC = () => {
  return ReactDOM.createPortal(
    <Toaster
      toastOptions={{
        success: {
          duration: 1000,
          style: {
            background: "#ccf9a4",
          },
        },
        error: {
          style: {
            background: "#f9a4a6",
          },
        },
      }}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      position="top-center"
    />,
    document.body
  );
};
export default AppToast;
