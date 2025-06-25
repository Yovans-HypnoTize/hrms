import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  clearCookies,
  getAdminRole,
  getUserProfile,
} from "../common/Utilities";
import { PageLinks } from "../common/Constants";
import { useAppStateAPI } from "../common/AppStateAPI";
import { ServerAPI } from "../common/ServerAPI";
import toast from "react-hot-toast";
import Notifications from "./Notifications";

const Header: React.FC<{ toggleSidebar?: () => void }> = ({
  toggleSidebar,
}) => {
  const dropdownRef = useRef<HTMLLIElement>(null);
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [role, setRole] = useState<any>("");
  const [profile, setProfile] = useState<any>("");

  const toggleDropdown = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    addProcessingRequests();
    // const userID = localStorage.getItem("user_id");
    
      ServerAPI.Logout()
        .then((response: any) => {
          if (response) {
            console.log("response login", response);
            clearCookies();
            navigate(PageLinks.LOGIN);
            toast.success(response["message"]);
          } else if (response && response["message"]) {
            toast.error(response["message"]);
          }
        })
        .finally(() => {
          reduceProcessingRequests();
        });
   
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
    const handleResize = () => {
      if (window.innerWidth < 768) {
        toggleSidebar?.();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const role = getAdminRole();
    const profile = getUserProfile();
    console.log("From header", role);
    setRole(role);
    if (profile !== "null" && profile !== "undefined") {
      setProfile(profile);
    } else {
      setProfile("");
    }
  }, []);

  const getNavigationLink = () => {
    if (role === "CLIENT/EMPLOYER") {
      return PageLinks.EMPLOYER_DASHBOARD;
    } else if (role === "ADMIN") {
      return PageLinks.ADMIN_DASHBOARD;
    } else {
      return PageLinks.EMPLOYEE_DASHBOARD;
    }
  };

  return (
    <div>
      <div className="topbar">
        <div className="topbar-left flex-center-between ml-2">
          <Link
            className="logo"
            to={getNavigationLink()}
            style={{ height: "50px" }}
          >
            <div
              className="d-flex align-items-center"
              style={{ width: "160px", height: "50px" }}
            >
              {/* <img src={window.location.origin + "/assets/svg/appLogo.svg"} alt="logo-large" className="logo-lg" /> */}
              <img
                src={
                  window.location.origin +
                  "/assets/images/adhiran-infotech-logo.png"
                }
                alt="adhiran infotech logo"
                className="logo-lg"
              />
            </div>
          </Link>
          {/* <a className='app-header hide-title'>HRMS</a> */}
        </div>
        <nav className="navbar-custom">
          <ul className="list-unstyled topbar-nav float-right mb-0 mr-2">
            <li className="dropdown" ref={dropdownRef}>
              <button
                className="nav-link dropdown-toggle waves-effect waves-light nav-user"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="false"
                aria-expanded="false"
                onClick={toggleDropdown}
                style={{ background: "none", outline: "none", border: "none" }}
              >
                <img
                  src={
                    profile.length > 0
                      ? profile
                      : window.location.origin +
                        "/assets/images/profile-dummy.png"
                  }
                  alt="profile-user"
                  className="image-rounded-circle"
                />
                {/* <span className="ml-1 nav-user-name">
                                    <i className="mdi mdi-chevron-down"></i>
                                </span> */}
              </button>
              {showMenu && (
                <div className="dropdown-main">
                  <Link
                    to="/"
                    onClick={(e) => {
                      e.preventDefault();
                      // setShowProfile(true);
                      setShowMenu(false);
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="dropdown-menu-items dropdown-menu-right show">
                      <div className="logout-spacer"></div>
                      <p className="nav-user-name mb-0">Profile</p>
                      <div className="logout-spacer"></div>
                    </div>
                  </Link>
                  <hr style={{ margin: "0 10px 0 10px" }} />
                  <Link
                    to="/"
                    style={{ textDecoration: "none" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout(e);
                    }}
                  >
                    <div className="dropdown-menu-items dropdown-menu-right show">
                      <div className="logout-spacer"></div>
                      <p className="nav-user-name mb-0">Logout</p>
                      <div className="logout-spacer"></div>
                    </div>
                  </Link>
                </div>
              )}
            </li>
          </ul>
          <div className="float-right nav-link " style={{height:"10%"}}>
          {
            role === "CLIENT/EMPLOYER" &&  <Notifications/>
          }
          </div>
          <ul className="list-unstyled topbar-nav mb-0">
            <li>
              <button
                className="nav-link button-menu-mobile button-menu-mobile-hidden waves-effect waves-light"
                onClick={toggleSidebar}
              >
                <i className="fa-solid fa-bars"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {/* <div style={{ display: 'block' }}><AppSideBar isOpen={sidebarOpen} /></div> */}
    </div>
  );
};

export default Header;
