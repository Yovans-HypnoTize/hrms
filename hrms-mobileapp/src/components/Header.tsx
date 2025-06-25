import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import { getRole, getUserProfile, logout } from '../common/Utilities';
import { PageLinks } from '../common/Constants';
import { useAppStateAPI } from '../common/AppStateAPI';
import { ServerAPI } from '../common/ServerAPI';
import toast from 'react-hot-toast';

const Header: React.FC<{ toggleSidebar?: () => void }> = ({ toggleSidebar }) => {
    const dropdownRef = useRef<HTMLLIElement>(null);
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [showMenu, setShowMenu] = useState(false);
    const history = useHistory();
    const [role,setRole] = useState<any>('')
    const [profile,setProfile] = useState<any>('')

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
                logout();
                history.push(PageLinks.LOGIN);
                toast.success(response["message"]);
              } else if (response && response["message"]) {
                toast.error(response["message"]);
              }
            })
            .finally(() => {
              reduceProcessingRequests();
            });
       
      };

    // const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    //     e.preventDefault();
    //     logout();
    //     history.push(PageLinks.LOGIN);
    // };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
        const role = getRole();
        const profile = getUserProfile()
        console.log("From header", role)
        setRole(role)
        if(profile !== "null" && profile !== "undefined"){
            setProfile(profile)
        } else {
            setProfile("")
        }
    },[])

    return (
        <div>
            <div className="topbar" style={{ zIndex: 1050, position: "fixed" }}>
                <div className="topbar-left flex-center-between ml-2">
                    <Link className="logo" to={''} style={{ height: "50px" }}>
                        <div className='d-flex align-items-center' style={{ width: "120px", height: "50px" }}>
                            {/* <img src={window.location.origin + "/assets/svg/appLogo.svg"} alt="logo-large" className="logo-lg" /> */}
                            <img src={window.location.origin + "/assets/images/adhiran-infotech-logo.png"} alt="adhiran-logo" className="logo-lg" />
                            {/* <img src={window.location.origin + "/assets/images/omtoc-logo.png"} alt="" className="logo-lg" /> */}
                        </div>
                    </Link>
                    {/* <a className='app-header hide-title'>OMTOC</a> */}
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
                                    src={profile.length > 0 ? profile : window.location.origin + "/assets/images/profile-dummy.png"}
                                    alt="profile-user"
                                    className="rounded-circle"
                                />
                                <span className="ml-1 nav-user-name">
                                    <i className="mdi mdi-chevron-down"></i>
                                </span>

                            </button>
                            {showMenu && (
                                <div className="dropdown-main">
                                    <Link to="/" onClick={e => {
                                        e.preventDefault();
                                        // setShowProfile(true);
                                        // history.push(PageLinks.EMPLOYEE_PROFILE);
                                        setShowMenu(false);
                                    }} style={{ textDecoration: 'none' }}>
                                        <div className="dropdown-menu-items dropdown-menu-right show">
                                            <div className="logout-spacer"></div>
                                            <p className="nav-user-name mb-0">Profile</p>
                                            <div className="logout-spacer"></div>
                                        </div>
                                    </Link>
                                    <Link to="/" style={{ textDecoration: 'none' }} onClick={e => {
                                        e.preventDefault();
                                        handleLogout(e);
                                    }}>
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
                    <ul className="list-unstyled topbar-nav mb-0">
                        <li>
                            <button className="nav-link button-menu-mobile button-menu-mobile-hidden waves-effect waves-light"
                                onClick={toggleSidebar}>
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
