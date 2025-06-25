import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { UIDataTypes } from "../common/DataTypes";
import { EndUser, PageLinks } from "../common/Constants";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useAppStateAPI } from "../common/AppStateAPI";
import { Link, useLocation } from "react-router-dom";
import { getAdminRole } from "../common/Utilities";
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
    icon: <img src={window.location.origin + "/assets/svg/employees.svg"} alt="employees logo"/>,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    menuLink: PageLinks.EMPLOYER_EMPLOYEES,
  },
  {
    label: "Attendance",
    icon: <img src={window.location.origin + "/assets/svg/attendance.svg"} alt="attendance"/>,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    menuLink: PageLinks.EMPLOYER_ATTENDANCE,
  },
  {
    label: "Leave",
    icon: <img src={window.location.origin + "/assets/svg/user-close.svg"}  alt="user close"/>,
    iconClass: "sidebar-icon iconly-Curved-Chart",
    subMenus: [
      {
        label: "Leave Request",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.EMPLOYER_LEAVE_REQUEST,
      },
      {
        label: "Leave Credits",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.EMPLOYER_LEAVE_CREDITS,
      },
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
      {
        label: "Attendance Policies",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.EMPLOYER_ATTENDANCE_POLICIES,
      },
      {
        label: "Payroll Groups",
        icon: <RadioButtonUncheckedIcon className="custom-small-icon" />,
        iconClass: "sidebar-icon iconly-radio-button",
        menuLink: PageLinks.EMPLOYER_PAYROLL_GROUP,
      },
    ],
  },
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

const PreviousAppSideBar: React.FC<AppSideBarProps> = ({ isOpen }) => {
  const { currentPage, setCurrentPage } = useAppStateAPI();
  const [sideBarkey, setSideBarKey] = useState(Math.random());
  const [openedMenu, setOpenedMenu] = useState("");
  const [sideBar, setSideBar] = useState<UIDataTypes.MenuItem[]>([]);
  const [employeeSideBarMenus, setEmployeeSideBarMenus] = useState(EmployeeSideMenuItems)
  const location = useLocation();

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

  const handleSubMenuClick = (menu: string) => {
    if (openedMenu === menu) {
      setOpenedMenu(""); // Toggle off if clicked on the active menu
    } else {
      setOpenedMenu(menu);
    }
    setSideBarKey(Math.random());
  };
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
                onClick={() => setCurrentPage(menuItem.menuLink)}
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
              <SubMenu
                label={menuItem.label}
                icon={menuItem.icon}
                open={menuItem.label === openedMenu}
                onClick={() => handleSubMenuClick(menuItem.label)}
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
            );
          }
        })}
      </Menu>
    </Sidebar>
  );
};

export default PreviousAppSideBar;
