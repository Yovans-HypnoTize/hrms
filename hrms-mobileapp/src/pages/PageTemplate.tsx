import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppSideBar from "../components/SideBar";
import { Route } from "react-router-dom";
import { PageLinks, PageURLNames } from "../common/Constants";
import ListTemplate from "./ListTemplate";
import { IonContent, IonPage, IonRouterOutlet } from "@ionic/react";
import PageDashboard from "./PageDashboard";
import SubordinatePendingLeaveRequest from "../components/custom-pages/SubordinatePendingLeaveRequest";
import SubordinateAllLeaveRequest from "../components/custom-pages/SubordinateAllLeaveRequest";
import LeaveRequest from "../components/custom-pages/LeaveRequest";
import EmployeeViewDetails from "../components/custom-pages/EmployeeDetails";
import OrganizationalChart from "../components/custom-pages/OrganizationalChart";

const PageTemplate: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // const history = useHistory();
  const toggleSidebar = () => {
    console.log("I'm clicked");
    setSidebarOpen(!sidebarOpen);
  };
  // const handleCloseSidebar = () => {
  //   setSidebarOpen(false);
  // };
  return (
    <IonPage>
      <IonContent>
        <div className="" style={{ overflowX: "hidden" }}>
          <Header toggleSidebar={toggleSidebar} />
          <main className="" style={{marginTop:"70px"}}>
            <div style={{ position: "absolute", zIndex: 1000 }}>
              <AppSideBar
                isOpen={sidebarOpen}
                closeSidebar={toggleSidebar}
              />
            </div>
            {!sidebarOpen && (
              <div
                className="sidebar-backdrop"
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "calc(100vh - 50px)",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  zIndex: 998,
                }}
                onClick={toggleSidebar}
              />
            )}
            <div className="">
              <div>
                <div className="">
                  <div className="">
                    <div className="row" style={{padding:"0px 15px 0px 10px" }}>
                      <div className="col-12">
                        <div className="" >
                          <div
                            style={{ margin: "5px 5px",overflowY: "auto", position: "relative", height: "calc(100vh - 120px)"}}
                          >
                            <IonRouterOutlet>
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.DASHBOARD}`}
                                component={PageDashboard}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.SUBORDINATE_LEAVE_BALANCE_LIST}`}
                                component={ListTemplate}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.LEAVE_BALANCE}`}
                                component={ListTemplate}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.LEAVE_REQUEST}`}
                                component={ListTemplate}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.LEAVE_HISTORY}`}
                                component={ListTemplate}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.EMPLOYEE_REPORT}`}
                                component={ListTemplate}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.PENDING_LEAVE_REQUEST}`}
                                component={ListTemplate}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.ALLOCATED_EMPLOYEE_REPORT}`}
                                component={ListTemplate}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.PAYSLIP}`}
                                component={ListTemplate}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.CERTIFICATION_LETTER}`}
                                component={ListTemplate}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.SUBORDINATE_LEAVE_HISTORY_LIST}`}
                                component={ListTemplate}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.EMPLOYEE_CONFIRMED_ATTENDANCE}`}
                                component={ListTemplate}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.EMPLOYEE_PENDING_ATTENDANCE}`}
                                component={ListTemplate}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.SUBORDINATE_PENDING_ATTENDANCE}`}
                                component={ListTemplate}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.SUBORDINATE_PENDING_APPROVAL}`}
                                component={SubordinatePendingLeaveRequest}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.SUBORDINATE_LEAVE_REQUEST_LIST}`}
                                component={SubordinateAllLeaveRequest}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.LEAVE_REQUEST_LIST}`}
                                component={SubordinateAllLeaveRequest}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.ALL_LEAVE_REQUEST}`}
                                component={LeaveRequest}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.EMPLOYEE_PROFILE}`}
                                component={EmployeeViewDetails}
                              />
                              <Route
                                path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.ORGANIZATIONAL_CHART}`}
                                component={OrganizationalChart}
                              />
                              {/* <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.REPORT}`} component={Reports} /> */}
                            </IonRouterOutlet>
                          </div>
                        </div>
                        <Footer />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PageTemplate;

// import React, { useState } from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import AppSideBar from "../components/SideBar";
// import { Route, useHistory } from "react-router-dom";
// import { PageLinks, PageURLNames } from "../common/Constants";
// import ListTemplate from "./ListTemplate";
// import { IonContent, IonPage, IonRouterOutlet } from "@ionic/react";
// import PageDashboard from "./PageDashboard";
// import SubordinatePendingLeaveRequest from "../components/custom-pages/SubordinatePendingLeaveRequest";
// import SubordinateAllLeaveRequest from "../components/custom-pages/SubordinateAllLeaveRequest";
// import LeaveRequest from "../components/custom-pages/LeaveRequest";
// import EmployeeViewDetails from "../components/custom-pages/EmployeeDetails";
// import OrganizationalChart from "../components/custom-pages/OrganizationalChart";

// const PageTemplate: React.FC = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const history = useHistory();
//   const toggleSidebar = () => {
//     console.log("I'm clicked");
//     setSidebarOpen(!sidebarOpen);
//   };
//   const handleCloseSidebar = () => {
//     setSidebarOpen(false);
//   };
//   return (
//     <IonPage>
//       <IonContent>
//         <div className="horizontal-active" style={{ overflowX: "hidden" }}>
//           <Header toggleSidebar={toggleSidebar} />
//           <main className="hp-bg-color-dark-90 d-flex min-vh-100" style={{marginTop:"70px"}}>
//             <div style={{ position: "absolute", zIndex: 1000 }}>
//               <AppSideBar
//                 isOpen={sidebarOpen}
//                 closeSidebar={handleCloseSidebar}
//               />
//             </div>
//             {sidebarOpen && (
//               <div
//                 className="sidebar-backdrop"
//                 style={{
//                   position: "fixed",
//                   top: 0,
//                   left: 0,
//                   width: "100vw",
//                   height: "100vh",
//                   backgroundColor: "rgba(0, 0, 0, 0.3)",
//                   zIndex: 998,
//                 }}
//                 onClick={handleCloseSidebar}
//               />
//             )}
//             <div className="hp-main-layout">
//               <div style={{ display: "flex" }}>
//                 <div className="page-wrapper">
//                   <div className="page-content min-h-full">
//                     <div className="row" style={{ height: "100%" }}>
//                       <div className="col-12">
//                         <div className="card mb-0" style={{ height: "100%" }}>
//                           <div
//                             className="card-body"
//                             style={{ margin: "5px 5px", position: "relative" }}
//                           >
//                             <IonRouterOutlet>
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.DASHBOARD}`}
//                                 component={PageDashboard}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.SUBORDINATE_LEAVE_BALANCE_LIST}`}
//                                 component={ListTemplate}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.LEAVE_BALANCE}`}
//                                 component={ListTemplate}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.LEAVE_REQUEST}`}
//                                 component={ListTemplate}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.LEAVE_HISTORY}`}
//                                 component={ListTemplate}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.EMPLOYEE_REPORT}`}
//                                 component={ListTemplate}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.PENDING_LEAVE_REQUEST}`}
//                                 component={ListTemplate}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.ALLOCATED_EMPLOYEE_REPORT}`}
//                                 component={ListTemplate}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.PAYSLIP}`}
//                                 component={ListTemplate}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.CERTIFICATION_LETTER}`}
//                                 component={ListTemplate}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.SUBORDINATE_LEAVE_HISTORY_LIST}`}
//                                 component={ListTemplate}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.EMPLOYEE_CONFIRMED_ATTENDANCE}`}
//                                 component={ListTemplate}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.EMPLOYEE_PENDING_ATTENDANCE}`}
//                                 component={ListTemplate}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.SUBORDINATE_PENDING_ATTENDANCE}`}
//                                 component={ListTemplate}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.SUBORDINATE_PENDING_APPROVAL}`}
//                                 component={SubordinatePendingLeaveRequest}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.SUBORDINATE_LEAVE_REQUEST_LIST}`}
//                                 component={SubordinateAllLeaveRequest}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.LEAVE_REQUEST_LIST}`}
//                                 component={SubordinateAllLeaveRequest}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.ALL_LEAVE_REQUEST}`}
//                                 component={LeaveRequest}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.EMPLOYEE_PROFILE}`}
//                                 component={EmployeeViewDetails}
//                               />
//                               <Route
//                                 path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.ORGANIZATIONAL_CHART}`}
//                                 component={OrganizationalChart}
//                               />
//                               {/* <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.REPORT}`} component={Reports} /> */}
//                             </IonRouterOutlet>
//                           </div>
//                         </div>
//                         <Footer />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </main>
//         </div>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default PageTemplate;

