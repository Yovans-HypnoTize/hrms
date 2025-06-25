import { useEffect, useRef, useState } from "react";
import MuiIconWithBadge from "./MuiIconWithBadge";
import { useAppStateAPI } from "../common/AppStateAPI";
import { ServerAPI } from "../common/ServerAPI";
import { API } from "../common/Constants";
import NotificationItem from "./NotificationItem";

const Notifications = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [showMenu, setShowMenu] = useState(false);
  const [notificationList, setNotificationList] = useState<any[]>([]);
  const [showMessageItem, setShowMessageItem] = useState<boolean>(false);
  const [messageItem, setMessageItem] = useState<any>({});

  const toggleDropdown = () => {
    setShowMenu(!showMenu);
  };
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    getNotificationList();
  }, []);

  const getNotificationList = () => {
    addProcessingRequests();
    ServerAPI.executeAPI(
      API.EndPoint.NOTIFICATION_LIST,
      ServerAPI.APIMethod.GET,
      true,
      null
    )
      .then((response) => {
        if (response !== undefined) {
          const data = response.data.notifications;
          setNotificationList(data);
        } else {
          setNotificationList([]);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  const handleMessageItem = (item: any) => {
    setShowMessageItem(true);
    setMessageItem(item);
  };

  const handleCloseMessageItem = () => {
    setShowMessageItem(false);
  };

  const handleClearAllMessage = () => {
    const ids = notificationList.map((item) => item.id);
    const data = {
      notification_id: ids,
    };
    console.log(ids);
    addProcessingRequests();
    ServerAPI.executeAPI(
      API.EndPoint.NOTIFICATION_LIST,
      ServerAPI.APIMethod.POST,
      true,
      data
    )
      .then((response) => {
        if (response !== undefined) {
          getNotificationList();
          console.log(response);
        } else {
          console.log("Unexpected error occurred");
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  return (
    <div className="" ref={dropdownRef}>
      <button
        className="nav-link dropdown-toggle waves-effect waves-light nav-user p-0"
        data-toggle="dropdown"
        aria-haspopup="false"
        aria-expanded="false"
        onClick={toggleDropdown}
        style={{ background: "none", outline: "none", border: "none" }}
      >
        <MuiIconWithBadge
          badgeColor="secondary"
          badgeContent={notificationList.length ? notificationList.length : 0}
        />
      </button>
      <div>
        {showMenu && (
          <div className="notification-dropdown-main">
            {!showMessageItem && (
              <div className="notification-container-header d-flex justify-content-between align-items-center">
                <p className="mb-0 pl-2 py-2 fs-5">Notifications</p>
                {notificationList.length > 0 && (
                  <p
                    className="mb-0 pl-2 py-2 text-sm pr-2 cursor-pointer"
                    onClick={handleClearAllMessage}
                  >
                    Clear
                  </p>
                )}
              </div>
            )}
            {!showMessageItem && (
              <>
                {notificationList.length > 0 ? (
                  notificationList.map((item, index) => (
                    <div
                      className="notification-dropdown-menu-items show cursor-pointer"
                      key={item.id || index}
                      onClick={() => handleMessageItem(item)}
                    >
                      <div className="logout-spacer"></div>
                      <p className="text-sm mb-0 ml-2 sub-header-text">
                        {item?.message.length > 40
                          ? item.message.slice(0, 40) + "..."
                          : item.message}
                      </p>
                      <div className="logout-spacer"></div>
                      {index !== notificationList.length - 1 && (
                        <hr style={{ margin: "0 10px 0 10px" }} />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="pl-3 mt-2">
                    <p>No messages</p>
                  </div>
                )}
              </>
            )}

            {showMessageItem && (
              <NotificationItem
                notificationItem={messageItem}
                close={handleCloseMessageItem}
                reloadData={getNotificationList}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
