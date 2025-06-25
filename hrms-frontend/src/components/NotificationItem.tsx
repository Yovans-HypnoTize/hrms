import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ServerAPI } from "../common/ServerAPI";
import { API } from "../common/Constants";
import { useAppStateAPI } from "../common/AppStateAPI";

const NotificationItem = ({ notificationItem, reloadData, close }: any) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  console.log(notificationItem);
  const handleBack = () => {
    handleClearMessage();
  };
  const handleClearMessage = () => {
    const id = notificationItem.id;
    const data = {
      notification_id: [id],
    };
    console.log(id);
    addProcessingRequests();
    ServerAPI.executeAPI(
      API.EndPoint.NOTIFICATION_LIST,
      ServerAPI.APIMethod.POST,
      true,
      data
    )
      .then((response) => {
        if (response !== undefined) {
          close();
          reloadData();
          console.log(response);
        } else {
          console.log("Unexpected Error occurred");
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };
  return (
    <div className="text-dark">
      <div className="d-flex align-items-center notification-item-header  pl-2 py-2">
        <ArrowBackIcon
          onClick={handleBack}
          fontSize="small"
          className="cursor-pointer"
        />
      </div>
      <p className="text-secondary ms-3 mt-2 pl-2">
        {notificationItem.message}
      </p>
    </div>
  );
};

export default NotificationItem;
