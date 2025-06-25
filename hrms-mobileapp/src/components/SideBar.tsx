import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { UIDataTypes } from "../common/DataTypes";
import { EndUser, PageLinks } from "../common/Constants";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useAppStateAPI } from "../common/AppStateAPI";
import { Link } from "react-router-dom";
import { getRole } from "../common/Utilities";
interface AppSideBarProps {
  isOpen?: boolean;
  closeSidebar:() => void
}

const EmployeeSideMenuItems: UIDataTypes.MenuItem[] = [
  {
    label: "Dashboard",
    icon: <img src="/assets/svg/dashboard.svg" />,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    menuLink: PageLinks.EMPLOYEE_DASHBOARD,
  },
  {
    label: "Leaves",
    icon: <img src="/assets/svg/user-close.svg" />,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    subMenus: [
      {
        label: "Leave Request",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.LEAVE_REQUEST,
      },
      {
        label: "Leave Balance",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.LEAVE_BALANCE,
      },
    ],
  },
  {
    label: "Report",
    icon: <img src="/assets/svg/chart.svg" />,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    menuLink: PageLinks.EMPLOYEE_REPORT,
  },
];

const AppSideBar: React.FC<AppSideBarProps> = ({ isOpen,closeSidebar }) => {
  const { currentPage, setCurrentPage } = useAppStateAPI();
  const [sideBarkey, setSideBarKey] = useState(Math.random());
  const [openedMenu, setOpenedMenu] = useState("");
  const [sideBar, setSideBar] = useState<UIDataTypes.MenuItem[]>([]);

  useEffect(() => {
    const userType = getRole();
    let sideMenu:any = [];
  
   if (userType === EndUser.Employee || userType === EndUser.Manager) {
      sideMenu = [...EmployeeSideMenuItems];  
  
      if (userType === EndUser.Manager) {
        sideMenu = [...EmployeeSideMenuItems, {
          label: "Employee Reports",
          icon: <img src={window.location.origin + "/assets/svg/chart.svg"} alt="report icon"/>,
          iconClass: "sidebar-icon iconly-Curved-Chart",
          menuLink: PageLinks.ALLOCATED_EMPLOYEE_REPORT,
        }]
        const leaveMenu = sideMenu.find((menu:any) => menu.label === "Leaves");
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
        const leaveMenu = sideMenu.find((menu: any) => menu.label === "Leaves");
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

  const handleSubMenuClick = (menu: string) => {
    if (openedMenu === menu) {
      setOpenedMenu(""); 
    } else {
      setOpenedMenu(menu);
    }
    setSideBarKey(Math.random());
  };
  return (
    <Sidebar
      style={{ textAlign: "start", height: "calc(100vh - 120px)" }}
      collapsed={isOpen}
      className="metismenu left-sidenav-menu"
      key={sideBarkey}
    >
      
      <Menu>
        {sideBar.map((menuItem, index) => {
          if (menuItem.subMenus === undefined) {
            return (
              <Link
                to={menuItem.menuLink || ""}
                onClick={() => {
                  setCurrentPage(menuItem.menuLink + "")
                  closeSidebar()
                }}
                key={index}
                style={{ textDecoration: "none" }}
              >
                <MenuItem
                  active={currentPage === menuItem.menuLink}
                  icon={menuItem.icon}
                >
                  {menuItem.label}
                </MenuItem>
              </Link>
            );
          } else {
            return (
              <SubMenu
                label={menuItem.label}
                icon={menuItem.icon}
                open={menuItem.label === openedMenu}
                onClick={() => handleSubMenuClick(menuItem.label)}
                key={index}
              >
                {menuItem.subMenus.map((subMenu, subIdx) => (
                  <Link
                    to={subMenu.menuLink || ""}
                    onClick={() => {
                      setCurrentPage(subMenu.menuLink + "")
                      closeSidebar()
                    }}
                    key={subIdx}
                    style={{ textDecoration: "none" }}
                  >
                    <MenuItem
                      active={currentPage === subMenu.menuLink}
                      icon={subMenu.icon}
                    >
                      {subMenu.label}
                    </MenuItem>
                  </Link>
                ))}
              </SubMenu>
            );
          }
        })}
      </Menu>
    </Sidebar>
  );
};

export default AppSideBar;

// import React, { useEffect, useState } from "react";
// import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
// import { UIDataTypes } from "../common/DataTypes";
// import { EndUser, PageLinks } from "../common/Constants";
// import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
// import { useAppStateAPI } from "../common/AppStateAPI";
// import { Link } from "react-router-dom";
// import { getRole } from "../common/Utilities";
// interface AppSideBarProps {
//   isOpen?: boolean;
//   closeSidebar:() => void
// }

// const EmployeeSideMenuItems: UIDataTypes.MenuItem[] = [
//   {
//     label: "Dashboard",
//     icon: <img src="/assets/svg/dashboard.svg" />,
//     iconClass: "sidebar-icon iconly-Curved-Chart",
//     menuLink: PageLinks.EMPLOYEE_DASHBOARD,
//   },
// //   {
// //     label: "ORM",
// //     icon: <img src="/assets/svg/subordinate.svg" />,
// //     iconClass: "sidebar-icon iconly-Curved-Chart",
// //     subMenus: [
// //       {
// //         label: "Pending Request",
// //         icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
// //         iconClass: "sidebar-icon iconly-radio-button",
// //         menuLink: PageLinks.SUBORDINATE_PENDING_APPROVAL,
// //       },
// //       {
// //         label: "Pending Attendance",
// //         icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
// //         iconClass: "sidebar-icon iconly-radio-button",
// //         menuLink: PageLinks.SUBORDINATE_PENDING_ATTENDANCE,
// //       },
// //       {
// //         label: "All Leave Request",
// //         icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
// //         iconClass: "sidebar-icon iconly-radio-button",
// //         menuLink: PageLinks.SUBORDINATE_LEAVE_REQUEST_LIST,
// //       },
// //       {
// //         label: "Leave Balance",
// //         icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
// //         iconClass: "sidebar-icon iconly-radio-button",
// //         menuLink: PageLinks.SUBORDINATE_LEAVE_BALANCE_LIST,
// //       },
// //       {
// //         label: "Leave History",
// //         icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
// //         iconClass: "sidebar-icon iconly-radio-button",
// //         menuLink: PageLinks.SUBORDINATE_LEAVE_HISTORY_LIST,
// //       },
// //     ],
// //   },
//   {
//     label: "Leaves",
//     icon: <img src="/assets/svg/user-close.svg" />,
//     iconClass: "sidebar-icon iconly-Curved-Chart",
//     subMenus: [
//       // {
//       //     label: 'All Leave Request',
//       //     icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
//       //     iconClass: 'sidebar-icon iconly-radio-button',
//       //     menuLink: PageLinks.ALL_LEAVE_REQUEST
//       // },
//       {
//         label: "Leave Request",
//         icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
//         iconClass: "sidebar-icon iconly-radio-button",
//         menuLink: PageLinks.LEAVE_REQUEST,
//       },
//       {
//         label: "Leave Balance",
//         icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
//         iconClass: "sidebar-icon iconly-radio-button",
//         menuLink: PageLinks.LEAVE_BALANCE,
//       },
//     ],
//   },
//   // {
//   //     label: 'Attendance',
//   //     icon: <img src='/assets/svg/attendance.svg' />,
//   //     iconClass: 'sidebar-icon iconly-Curved-Chart',
//   //     subMenus: [
//   //         {
//   //             label: 'Confirmed Attendance',
//   //             icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
//   //             iconClass: 'sidebar-icon iconly-radio-button',
//   //             menuLink: PageLinks.EMPLOYEE_CONFIRMED_ATTENDANCE
//   //         },
//   //         {
//   //             label: 'Pending Attendance',
//   //             icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
//   //             iconClass: 'sidebar-icon iconly-radio-button',
//   //             menuLink: PageLinks.EMPLOYEE_PENDING_ATTENDANCE
//   //         },
//   //     ]
//   // },
// //   {
// //     label: "Payslip",
// //     icon: <img src="/assets/svg/payslip.svg" />,
// //     iconClass: "sidebar-icon iconly-Curved-Chart",
// //     menuLink: PageLinks.PAYSLIP,
// //   },
//   // {
//   //     label: 'Certification & Letter',
//   //     icon: <img src='/assets/svg/certification.svg' />,
//   //     iconClass: 'sidebar-icon iconly-Curved-Chart',
//   //     menuLink: PageLinks.CERTIFICATION_LETTER,
//   // },
//   // {
//   //     label: 'Organizational Chart',
//   //     icon: <img src='/assets/svg/chart.svg' />,
//   //     iconClass: 'sidebar-icon iconly-Curved-Chart',
//   //     menuLink: PageLinks.ORGANIZATIONAL_CHART,
//   // },
//   {
//     label: "Report",
//     icon: <img src="/assets/svg/chart.svg" />,
//     iconClass: "sidebar-icon iconly-Curved-Chart",
//     menuLink: PageLinks.EMPLOYEE_REPORT,
//   },
// ];

// const AppSideBar: React.FC<AppSideBarProps> = ({ isOpen,closeSidebar }) => {
//   const { currentPage, setCurrentPage } = useAppStateAPI();
//   const [sideBarkey, setSideBarKey] = useState(Math.random());
//   const [openedMenu, setOpenedMenu] = useState("");
//   const [sideBar, setSideBar] = useState<UIDataTypes.MenuItem[]>([]);

//   // useEffect(() => {
//   //   setSideBar(EmployeeSideMenuItems);
//   // }, []);

//   useEffect(() => {
//     const userType = getRole();
//     let sideMenu:any = [];
  
//    if (userType === EndUser.Employee || userType === EndUser.Manager) {
//       sideMenu = [...EmployeeSideMenuItems];  
  
//       if (userType === EndUser.Manager) {
//         sideMenu = [...EmployeeSideMenuItems, {
//           label: "Employee Reports",
//           icon: <img src={window.location.origin + "/assets/svg/chart.svg"} alt="report icon"/>,
//           iconClass: "sidebar-icon iconly-Curved-Chart",
//           menuLink: PageLinks.ALLOCATED_EMPLOYEE_REPORT,
//         }]
//         const leaveMenu = sideMenu.find((menu:any) => menu.label === "Leaves");
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
//         const leaveMenu = sideMenu.find((menu: any) => menu.label === "Leaves");
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
//       style={{ textAlign: "start", height: "calc(100vh - 120px)" }}
//       collapsed={!isOpen}
//       className="metismenu left-sidenav-menu"
//       key={sideBarkey}
//     >
//       {/* <Menu>
//                 <MenuItem icon={<img src='/assets/svg/dashboard.svg' />}>Dashboard</MenuItem>
//                 <SubMenu label='Employees' icon={<img src='/assets/svg/Employees.svg' />}>
//                     <MenuItem>Company</MenuItem><hr className='mt-1 mb-1' />
//                     <MenuItem>Others</MenuItem><hr className='mt-1 mb-1' />
//                 </SubMenu>
//                 <MenuItem icon={<img src='/assets/svg/Attendance.svg' />}>Attendance</MenuItem>
//                 <SubMenu label='Leave' icon={<img src='/assets/svg/user-close.svg' />}></SubMenu>
//                 <SubMenu label='Payroll' icon={<img src='/assets/svg/Payroll.svg' />}></SubMenu>
//                 <SubMenu label='Masters' icon={<img src='/assets/svg/master.svg' />}></SubMenu>
//                 <MenuItem icon={<img src='/assets/svg/chart.svg' />}>Organization Chart</MenuItem>
//             </Menu> */}
//       <Menu>
//         {sideBar.map((menuItem, index) => {
//           if (menuItem.subMenus === undefined) {
//             return (
//               <Link
//                 to={menuItem.menuLink || ""}
//                 onClick={() => {
//                   setCurrentPage(menuItem.menuLink + "")
//                   closeSidebar()
//                 }}
//                 key={index}
//                 style={{ textDecoration: "none" }}
//               >
//                 <MenuItem
//                   active={currentPage === menuItem.menuLink}
//                   icon={menuItem.icon}
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
//                     onClick={() => {
//                       setCurrentPage(subMenu.menuLink + "")
//                       closeSidebar()
//                     }}
//                     key={subIdx}
//                     style={{ textDecoration: "none" }}
//                   >
//                     <MenuItem
//                       active={currentPage === subMenu.menuLink}
//                       icon={subMenu.icon}
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

// export default AppSideBar;
