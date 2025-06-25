import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppSideBar from "../components/SideBar";
import "@mdi/font/css/materialdesignicons.min.css";
import { Routes, Route, useNavigate } from "react-router";
import { PageLinks, PageURLNames } from "../common/Constants";
import ListTemplate from "./ListTemplate";
import PageDashboard from "./PageDashboard";
import PagePayrollList from "./PagePayrollList";
import EmployeeDashboard from "./EmployeeDashboard";
import { getAdminRole } from "../common/Utilities";
import AdminDashboard from "./AdminDashboard";


const PageTemplate: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role, setRole] = useState<string | null>("");
  const navigate = useNavigate();
  const isAuthenticated = (): boolean => {
    const loginStatus = localStorage.getItem("login");

    if (
      loginStatus === null ||
      loginStatus === undefined ||
      loginStatus === "0"
    ) {
      return false;
    }
    return loginStatus === "1";
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(PageLinks.LOGIN);
    }
  }, [isAuthenticated()]);
  console.log(isAuthenticated(), "authen");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const role = getAdminRole();
    setRole(role);
  }, []);
  return (
    // <>
    //     <Header toggleSidebar={toggleSidebar} />
    //     <AppSideBar isOpen={sidebarOpen} />
    // </>
    <div>
      <div className="horizontal-active" style={{ overflowX: "hidden" }}>
        <main className="hp-bg-color-dark-90 d-flex min-vh-100">
          <AppSideBar isOpen={sidebarOpen} />
          <div className="hp-main-layout">
            <div style={{ display: "flex" }}>
              <div className="page-wrapper">
                <div className="page-content">
                  <div className="row">
                    <div className="col-12">
                      <div className="card mb-0">
                        {isAuthenticated() && (
                          <div className="card-body">
                            <Header toggleSidebar={toggleSidebar} />
                            <Routes>
                              <Route
                                path={PageLinks.LIST + "/*"}
                                element={<ListTemplate />}
                              />
                              {
                                role === "ADMIN" && (
                                  <>
                                  <Route
                                    path={PageURLNames.ADMIN_DASHBOARD}
                                    element={<AdminDashboard />}
                                  />
                                  
                                </>
                                )
                              }
                              {role === "CLIENT/EMPLOYER" && (
                                <>
                                  <Route
                                    path={PageURLNames.EMPLOYER_DASHBOARD}
                                    element={<PageDashboard />}
                                  />

                                  <Route
                                    path={PageURLNames.EMPLOYER_PAYROLL_LIST}
                                    element={<PagePayrollList />}
                                  />
                                </>
                              )}
                              {(role === "EMPLOYEE" || role === "MANAGER") && (
                                <>
                                  <Route
                                    path={PageURLNames.EMPLOYEE_DASHBOARD}
                                    element={<EmployeeDashboard />}
                                  />
                                  
                                </>
                              )}
                            </Routes>
                          </div>
                        )}
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
    </div>
  );
};

export default PageTemplate;
