import React, { useEffect, useRef, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { UIDataTypes } from "../common/DataTypes";
import { EndUser, PageLinks } from "../common/Constants";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useAppStateAPI } from "../common/AppStateAPI";
import { Link, useLocation } from "react-router-dom";
import { getAdminRole } from "../common/Utilities";
import ReactDOM from "react-dom";
interface AppSideBarProps {
  isOpen?: boolean;
}

const AdminSideMenuItems: UIDataTypes.MenuItem[] = [
  {
    label: "Dashboard",
    icon: <img src={window.location.origin + "/assets/svg/dashboard.svg"} alt="dashboard"/>,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    menuLink: PageLinks.ADMIN_DASHBOARD,
  },
  {
    label: "Masters",
    icon: <img src={window.location.origin + "/assets/svg/admin-master.svg"} alt="admin master"/>,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    subMenus: [
      // {
      //   label: "Countries",
      //   icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
      //   iconClass: "sidebar-icon iconly-radio-button",
      //   menuLink: PageLinks.ADMIN_COUNTRIES,
      // },
      // {
      //   label: "States",
      //   icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
      //   iconClass: "sidebar-icon iconly-radio-button",
      //   menuLink: PageLinks.ADMIN_STATES,
      // },
      // {
      //   label: "Banks",
      //   icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
      //   iconClass: "sidebar-icon iconly-radio-button",
      //   menuLink: PageLinks.ADMIN_BANKS,
      // },
      //   {
      //     label: "Clients",
      //     icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
      //     iconClass: "sidebar-icon iconly-radio-button",
      //     menuLink: PageLinks.ADMIN_CLIENTS,
      //   },
      {
        label: "Company",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.ADMIN_COMPANY,
      },
      {
        label: "Users",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.ADMIN_USERS,
      },
    ],
  },
  // {
  //     label: 'Payroll Configurations',
  //     icon: <img src='/assets/svg/admin-payroll.svg' />,
  //     iconClass: 'sidebar-icon iconly-Curved-Chart',
  //     menuLink: PageLinks.ADMIN_PAYROLL_CONFIG,
  // }
];

const EmployersSideMenuItems: UIDataTypes.MenuItem[] = [
  {
    label: "Dashboard",
    icon: <img src={window.location.origin + "/assets/svg/dashboard.svg"} alt="dashboard"/>,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    menuLink: PageLinks.EMPLOYER_DASHBOARD,
  },
  {
    label: "Employees",
    icon: <img src={window.location.origin + "/assets/svg/employees.svg"} alt="employees"/>,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    menuLink: PageLinks.EMPLOYER_EMPLOYEES,
    // subMenus: [
    //     {
    //         label: 'Employees',
    //         icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
    //         iconClass: 'sidebar-icon iconly-radio-button',
    //         menuLink: PageLinks.EMPLOYER_EMPLOYEES

    //     },
    //     {
    //         label: 'Employee Salary Revision',
    //         icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
    //         iconClass: 'sidebar-icon iconly-radio-button',
    //         menuLink: PageLinks.EMPLOYER_SALARY_REVISION
    //     },
    //     {
    //         label: 'Employee Loans',
    //         icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
    //         iconClass: 'sidebar-icon iconly-radio-button',
    //         menuLink: PageLinks.EMPLOYER_EMPLOYEE_LOAN
    //     },
    //     {
    //         label: 'Additional Allowance & Deductions',
    //         icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
    //         iconClass: 'sidebar-icon iconly-radio-button',
    //         menuLink: PageLinks.EMPLOYER_ADDITIONAL_ALLOWANCE
    //     },
    // ]
  },
  {
    label: "Attendance",
    icon: <img src={window.location.origin + "/assets/svg/attendance.svg"} alt="attendance"/>,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    menuLink: PageLinks.EMPLOYER_ATTENDANCE,
  },
  {
    label: "Projects",
    icon: <img src={window.location.origin + "/assets/svg/attendance.svg"} alt="attendance"/>,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    menuLink: PageLinks.EMPLOYER_PROJECTS,
  },
  {
    label: "Leave",
    icon: <img src={window.location.origin + "/assets/svg/user-close.svg"} alt="user close"/>,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    subMenus: [
      {
        label: "Leave Request",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.EMPLOYER_LEAVE_REQUEST,
      },
      // {
      //   label: "Leave Balance",
      //   icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
      //   iconClass: "sidebar-icon iconly-radio-button",
      //   menuLink: PageLinks.EMPLOYER_LEAVE_BALANCE,
      // },
      {
        label: "Leave Credits",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.EMPLOYER_LEAVE_CREDITS,
      },
      // {
      //     label: 'Leave History',
      //     icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
      //     iconClass: 'sidebar-icon iconly-radio-button',
      //     menuLink: PageLinks.EMPLOYER_LEAVE_HISTORY
      // },
    ],
  },
  {
    label: "Payroll",
    icon: <img src={window.location.origin + "/assets/svg/payroll.svg"} alt="payroll"/>,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    subMenus: [
      {
        label: "Process Pay Run",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.EMPLOYER_PAYROLL_PROCESS,
      },
      // {
      //     label: 'Employee Payroll',
      //     icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
      //     iconClass: 'sidebar-icon iconly-radio-button',
      //     menuLink: PageLinks.EMPLOYER_EMPLOYEE_PAYROLL
      // },
      // {
      //     label: 'Payroll Reports',
      //     icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
      //     iconClass: 'sidebar-icon iconly-radio-button',
      //     menuLink: PageLinks.EMPLOYER_PAYROLL_REPORTS
      // },
      // {
      //     label: 'Payroll History',
      //     icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
      //     iconClass: 'sidebar-icon iconly-radio-button',
      //     menuLink: PageLinks.EMPLOYER_PAYROLL_HISTORY
      // },
    ],
  },
  {
    label: "Masters",
    icon: <img src={window.location.origin + "/assets/svg/master.svg"} alt="master"/>,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    subMenus: [
      {
        label: "Company Details",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.EMPLOYER_COMPANY_DETAILS,
      },
      {
        label: "Holidays",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.EMPLOYER_HOLIDAY_GROUPS,
      },
      // {
      //   label: "Partners",
      //   icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
      //   iconClass: "sidebar-icon iconly-radio-button",
      //   menuLink: PageLinks.EMPLOYER_PARTNERS,
      // },
      {
        label: "Departments",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.EMPLOYER_DEPARTMENTS,
      },
      {
        label: "Work Shifts",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.EMPLOYER_WORK_SHIFTS,
      },
      // {
      //     label: 'Loan Types',
      //     icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
      //     iconClass: 'sidebar-icon iconly-radio-button',
      //     menuLink: PageLinks.EMPLOYER_MASTERS_LOAN_TYPE
      // },
      {
        label: "Attendance Policies",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.EMPLOYER_ATTENDANCE_POLICIES,
      },
      // {
      //     label: 'Salary Components',
      //     icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
      //     iconClass: 'sidebar-icon iconly-radio-button',
      //     menuLink: PageLinks.EMPLOYER_SALARY_COMPONENTS
      // },
      // {
      //   label: "Salary Groups",
      //   icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
      //   iconClass: "sidebar-icon iconly-radio-button",
      //   menuLink: PageLinks.EMPLOYER_SALARY_GROUPS,
      // },
      {
        label: "Payroll Groups",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.EMPLOYER_PAYROLL_GROUP,
      },
      // {
      //     label: 'Users',
      //     icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
      //     iconClass: 'sidebar-icon iconly-radio-button',
      //     menuLink: PageLinks.EMPLOYER_MASTERS_ROLES
      // },
    ],
  },
  // {
  //     label: 'Organizational Chart',
  //     icon: <img src='/assets/svg/chart.svg' />,
  //     iconClass: 'sidebar-icon iconly-Curved-Chart',
  //     menuLink: PageLinks.EMPLOYER_DASHBOARD
  // },
];

const EmployeeSideMenuItems: UIDataTypes.MenuItem[] = [
  {
    label: "Dashboard",
    icon: <img src={window.location.origin + "/assets/svg/dashboard.svg"} alt="dashboard"/>,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    menuLink: PageLinks.EMPLOYEE_DASHBOARD,
  },
  {
    label: "Leave",
    icon: <img src={window.location.origin + "/assets/svg/user-close.svg"} alt="user close"/>,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    subMenus: [
      {
        label: "Leave Request",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.EMPLOYEE_LEAVE_REQUEST,
      },
       {
        label: "Leave Balance",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.EMPLOYEE_LEAVE_BALANCE,
      },
    ],
  },
  {
    label: "Report",
    icon: <img src={window.location.origin + "/assets/svg/report-icon.svg"} alt="report icon"/>,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    menuLink: PageLinks.EMPLOYEE_REPORT,
  },
];

// const AppSideBar: React.FC<AppSideBarProps> = ({ isOpen }) => {
//   const { currentPage, setCurrentPage } = useAppStateAPI();
//   const [sideBarkey, setSideBarKey] = useState(Math.random());
//   const [openedMenu, setOpenedMenu] = useState("");
//   const [sideBar, setSideBar] = useState<UIDataTypes.MenuItem[]>([]);
//   const [employeeSideBarMenus, setEmployeeSideBarMenus] = useState(EmployeeSideMenuItems)

//   useEffect(() => {
//     const userType = getAdminRole();
//     let sideMenu:any = [];
  
//     if (userType === EndUser.SuperAdmin) {
//       sideMenu = AdminSideMenuItems;
//     } else if (userType === EndUser.Employers) {
//       sideMenu = EmployersSideMenuItems;
//     } else if (userType === EndUser.Employee || userType === EndUser.Manager) {
//       sideMenu = [...employeeSideBarMenus];  
  
//       if (userType === EndUser.Manager) {
//         sideMenu = [...employeeSideBarMenus, {
//           label: "Employee Reports",
//           icon: <img src={window.location.origin + "/assets/svg/report-icon.svg"} />,
//           iconClass: "sidebar-icon iconly-Curved-Chart",
//           menuLink: PageLinks.ALLOCATED_EMPLOYEE_REPORT,
//         }]
//         const leaveMenu = sideMenu.find((menu:any) => menu.label === "Leave");
//         if (leaveMenu?.subMenus) {
//           const alreadyExists = leaveMenu.subMenus.some(
//             (item:any) => item.menuLink === PageLinks.EMPLOYEE_PENDING_LEAVE_REQUEST
//           );
  
//           if (!alreadyExists) {
//             leaveMenu.subMenus.push({
//               label: "Pending Leave Request",
//               icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
//               iconClass: "sidebar-icon iconly-radio-button",
//               menuLink: PageLinks.EMPLOYEE_PENDING_LEAVE_REQUEST,
//             });
//           }
//         }
//       } else {
//         const leaveMenu = sideMenu.find((menu: any) => menu.label === "Leave");
//             if (leaveMenu?.subMenus) {
//                 leaveMenu.subMenus = leaveMenu.subMenus.filter(
//                     (item: any) => item.menuLink !== PageLinks.EMPLOYEE_PENDING_LEAVE_REQUEST
//                 );
//             }
//       }
//     }
  
//     setSideBar(sideMenu);

//     console.log("from side menu items ")
//   }, []);

//   const handleSubMenuClick = (menu: string) => {
//     if (openedMenu === menu) {
//       setOpenedMenu(""); // Toggle off if clicked on the active menu
//     } else {
//       setOpenedMenu(menu);
//     }
//     setSideBarKey(Math.random());
//   };
//   return (
//     <Sidebar
//       style={{ textAlign: "start", height: "100vh" }}
//       collapsed={!isOpen}
//       className=""
//       key={sideBarkey}
//     >
//       {/* <Menu>
//                 <MenuItem icon={<img src='/assets/svg/dashboard.svg' />}>Dashboard</MenuItem>
//                 <SubMenu label='Employees' icon={<img src='/assets/svg/employees.svg' />}>
//                     <MenuItem>Company</MenuItem><hr className='mt-1 mb-1' />
//                     <MenuItem>Others</MenuItem><hr className='mt-1 mb-1' />
//                 </SubMenu>
//                 <MenuItem icon={<img src='/assets/svg/attendance.svg' />}>Attendance</MenuItem>
//                 <SubMenu label='Leave' icon={<img src='/assets/svg/user-close.svg' />}></SubMenu>
//                 <SubMenu label='Payroll' icon={<img src='/assets/svg/payroll.svg' />}></SubMenu>
//                 <SubMenu label='Masters' icon={<img src='/assets/svg/master.svg' />}></SubMenu>
//                 <MenuItem icon={<img src='/assets/svg/chart.svg' />}>Organization Chart</MenuItem>
//             </Menu> */}
//       <Menu>
//         {sideBar.map((menuItem, index) => {
//           if (menuItem.subMenus === undefined) {
//             return (
//               <Link
//                 to={menuItem.menuLink || ""}
//                 onClick={() => setCurrentPage(menuItem.menuLink)}
//                 key={index}
//                 style={{ textDecoration: "none" }}
//               >
//                 <MenuItem
//                   active={currentPage === menuItem.menuLink}
//                   icon={menuItem.icon}
//                   style={{
//                     backgroundColor:
//                       currentPage === menuItem.menuLink ? "#fff" : "",
//                     color:
//                       currentPage === menuItem.menuLink ? "red" : "inherit",
//                     borderRadius: "5px",
//                   }}
//                 >
//                   {menuItem.label}
//                 </MenuItem>
//               </Link>
//             );
//           } else {
//             return (
//               <SubMenu
//                 label={menuItem.label}
//                 icon={menuItem.icon}
//                 open={menuItem.label === openedMenu}
//                 onClick={() => handleSubMenuClick(menuItem.label)}
//                 key={index}
//               >
//                 {menuItem.subMenus.map((subMenu, subIdx) => (
//                   <Link
//                     to={subMenu.menuLink || ""}
//                     onClick={() => setCurrentPage(subMenu.menuLink)}
//                     key={subIdx}
//                     style={{ textDecoration: "none" }}
//                   >
//                     <MenuItem
//                       active={currentPage === subMenu.menuLink}
//                       icon={subMenu.icon}
//                       style={{
//                         backgroundColor:
//                           currentPage === subMenu.menuLink ? "#fff" : "",
//                         color:
//                           currentPage === subMenu.menuLink ? "red" : "inherit",
//                         borderRadius: "5px",
//                       }}
//                     >
//                       {subMenu.label}
//                     </MenuItem>
//                   </Link>
//                 ))}
//               </SubMenu>
//             );
//           }
//         })}
//       </Menu>
//     </Sidebar>
//   );
// };

const AppSideBar: React.FC<AppSideBarProps> = ({ isOpen }) => {
  const { currentPage, setCurrentPage } = useAppStateAPI();
  const [sideBarkey, setSideBarKey] = useState(Math.random());
  const [openedMenu, setOpenedMenu] = useState("");
  const [sideBar, setSideBar] = useState<UIDataTypes.MenuItem[]>([]);
  const [employeeSideBarMenus, setEmployeeSideBarMenus] = useState(EmployeeSideMenuItems)
  const location = useLocation();
  const [showPopover, setShowPopover] = useState<boolean>(false)
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number }>({
  top: 0,
  left: 0,
});
const popoverRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      // setShowPopover(false); // Close popover if clicked outside
      setOpenedMenu("")
    }
  }

  if (showPopover) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showPopover]);
  

  useEffect(() => {
    const userType = getAdminRole();
    let sideMenu:any = [];
  
    if (userType === EndUser.SuperAdmin) {
      sideMenu = AdminSideMenuItems;
    } else if (userType === EndUser.Employers) {
      sideMenu = EmployersSideMenuItems;
    } else if (userType === EndUser.Employee || userType === EndUser.Manager) {
      sideMenu = [...employeeSideBarMenus];  
  
      if (userType === EndUser.Manager) {
        sideMenu = [...employeeSideBarMenus, {
          label: "Employee Reports",
          icon: <img src={window.location.origin + "/assets/svg/report-icon.svg"} alt="report icon"/>,
          iconClass: "sidebar-icon iconly-Curved-Chart",
          menuLink: PageLinks.ALLOCATED_EMPLOYEE_REPORT,
        }]
        const leaveMenu = sideMenu.find((menu:any) => menu.label === "Leave");
        if (leaveMenu?.subMenus) {
          const alreadyExists = leaveMenu.subMenus.some(
            (item:any) => item.menuLink === PageLinks.EMPLOYEE_PENDING_LEAVE_REQUEST
          );
  
          if (!alreadyExists) {
            leaveMenu.subMenus.push({
              label: "Pending Leave Request",
              icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
              iconClass: "sidebar-icon iconly-radio-button",
              menuLink: PageLinks.EMPLOYEE_PENDING_LEAVE_REQUEST,
            });
          }
        }
      } else {
        const leaveMenu = sideMenu.find((menu: any) => menu.label === "Leave");
            if (leaveMenu?.subMenus) {
                leaveMenu.subMenus = leaveMenu.subMenus.filter(
                    (item: any) => item.menuLink !== PageLinks.EMPLOYEE_PENDING_LEAVE_REQUEST
                );
            }
      }
    }
  
    setSideBar(sideMenu);

    console.log("from side menu items ")
  }, []);

  const handleSubMenuClick = (menu: string,event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (openedMenu === menu) {
      setOpenedMenu(""); 
    } else {
      setOpenedMenu(menu);
      console.log(menu)

      const rect = event.currentTarget.getBoundingClientRect();

    setPopoverPosition({
      top: rect.top + window.scrollY, 
      left: rect.right + 10, 
    });

    console.log("top",rect.top+window.scrollY, "left", rect.right+10)
    }
    setSideBarKey(Math.random());
  };

  useEffect(() => {
    if(isOpen === false){
      setOpenedMenu("")
      setShowPopover(true)
    }
  },[isOpen])
  return (
    <Sidebar
      style={{ textAlign: "start", height: "100vh" }}
      collapsed={!isOpen}
      className=""
      key={sideBarkey}
    >
      <Menu>
        {sideBar.map((menuItem, index) => {
             const isActive = location.pathname === menuItem.menuLink;
          if (menuItem.subMenus === undefined) {
            return (
              <Link
                to={menuItem.menuLink || ""}
                onClick={() => {setCurrentPage(menuItem.menuLink)
                  if(isOpen === false){
                    setOpenedMenu("")
                  }
                }}
                key={index}
                style={{ textDecoration: "none" }}
              >
                <MenuItem
                  active={isActive}
                  icon={menuItem.icon}
                  style={{
                    backgroundColor:
                      currentPage === isActive ? "#fff" : "",
                    color:
                      currentPage === isActive ? "red" : "inherit",
                    borderRadius: "5px",
                  }}
                >
                  {menuItem.label}
                </MenuItem>
              </Link>
            );
          } else {
            return (
              <>
              {showPopover &&
                (menuItem.label === openedMenu && isOpen === false )&& <div style={{
                  position:'absolute',
                  left: 50,
                  zIndex: 1
                }}>
                  {menuItem.subMenus.map((subMenu, subIdx) => {
                    const isSubActive = location.pathname === subMenu.menuLink;
                    return ReactDOM.createPortal(
                      <div
                      ref={popoverRef}
                        className="popover-menu"
                        style={{
                          position: "absolute",
                          top: popoverPosition.top,
                          left: 80,
                          background: "#fff",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
                          padding: "5px",
                          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                          zIndex: 1000,
                        }}
                      >
                       {menuItem?.subMenus?.map((subMenu, subIdx) => (
                      <Link
                        to={subMenu.menuLink || ""}
                        onClick={() => {
                          setCurrentPage(subMenu.menuLink)
                          setOpenedMenu("")}}
                        key={subIdx}
                        style={{ textDecoration: "none" }}
                      >
                        <p 
                        className="popover-sidebar-menu"
                        >
                        {subMenu.label}
                          </p>
                      </Link>
                    ))}
                      </div>,
                      document.body
                    )
          }
                )}
                </div>
              }
              
              <SubMenu
                label={menuItem.label}
                icon={menuItem.icon}
                open={menuItem.label === openedMenu}
                onClick={(event) => handleSubMenuClick(menuItem.label,event)}
                key={index}
              >
                {menuItem.subMenus.map((subMenu, subIdx) => {
                    const isSubActive = location.pathname === subMenu.menuLink;
                    return <Link
                    to={subMenu.menuLink || ""}
                    onClick={() => setCurrentPage(subMenu.menuLink)}
                    key={subIdx}
                    style={{ textDecoration: "none" }}
                  >
                    <MenuItem
                      active={isSubActive}
                      icon={subMenu.icon}
                      style={{
                        backgroundColor:
                          currentPage === isSubActive ? "#fff" : "",
                        color:
                          currentPage === isSubActive ? "red" : "inherit",
                        borderRadius: "5px",
                      }}
                    >
                      {subMenu.label}
                    </MenuItem>
                  </Link>
          }
                
                )}
              </SubMenu>
              </>
            );
          }
        })}
      </Menu>
    </Sidebar>
  );
};

export default AppSideBar;
