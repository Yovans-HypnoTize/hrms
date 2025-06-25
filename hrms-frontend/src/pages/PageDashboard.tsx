/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { useAppStateAPI } from "../common/AppStateAPI";
import { ServerAPI } from "../common/ServerAPI";
import MuiPieChart from "../components/MuiPieChart";
import MuiFolderList from "../components/MuiFolderList";
import { API, ProjectConfig } from "../common/Constants";
import {
  barGraphValueFormatter,
  currentMonthYearFormatter,
  dateFormatter,
} from "../common/Utilities";
import MuiBarChart from "../components/MuiBarChart";
import CustomMonthYearPicker from "../components/dashboard/common/CustomMonthYearPicker";
import { Pagination } from "@mui/material";
import MuiPaginationSelect from "../components/MuiPaginationSelect";
import SearchInputContainer from "../components/SearchInputContainer";

const PageDashboard: React.FC = () => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [employerdashboard, setEmployerDashboard] = useState<any>();
  const [currentDate, setCurrentDate] = useState<any>("");
  const [upcomingHolidaysList, setUpcomingHolidaysList] = useState<any[]>([]);
  const [superiorEmployeeList, setSuperiorEmployeeList] = useState<any[]>([]);
  const [designationChartData, setDesignationChartData] = useState<any[]>([]);
  const [payrollSummary, setPayrollSummary] = useState<any[]>([]);
  const [barGraphSeries, setBarGraphSeries] = useState<any>([]);
  const [totalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState(ProjectConfig.EntriesPerPage);
  const [searchValue] = useState<string>("");

  const [employeeTotalOTHoursparamsObj, setEmployeeTotalOTHoursparamsObj] =
    useState({
      page_size: rowsPerPage || 5,
      page_number: currentPage || 1,
      month: currentMonthYearFormatter(),
      search: searchValue,
    });
  const [employeeTotalOTHoursList, setEmployeeTotalOTHoursList] = useState<
    any[]
  >([]);

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handleRowPerPageChange = (value: any) => {
    setRowsPerPage(value);
  };

  const getDashboard = () => {
    addProcessingRequests();
    ServerAPI.getDashboard()
      .then((response) => {
        if (response) {
          setEmployerDashboard(response.data);
          const designationData = response.data.Designation_percentage.map(
            (item: any) => {
              return {
                label: item.designation,
                value: item.percentage,
              };
            }
          );
          setDesignationChartData(designationData);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  const currentDateFormatter = () => {
    const date = new Date().toDateString();
    setCurrentDate(date);
  };

  const getUpcomingHolidays = () => {
    const params = { current_date: dateFormatter() };
    addProcessingRequests();
    ServerAPI.executeAPI(
      API.EndPoint.HOLIDAY_LIST,
      ServerAPI.APIMethod.GET,
      true,
      null,
      params
    )
      .then((response) => {
        if (response !== undefined) {
          const data = response.data.holidays.map((item: any) => {
            return {
              holidayname: item.company_holiday_name,
              holidayDate: item.company_holiday_date,
            };
          });
          setUpcomingHolidaysList(data);
        } else {
          setUpcomingHolidaysList([]);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  const getPayrollSummary = (payroll_month: any) => {
    const params = { payroll_month: payroll_month };
    addProcessingRequests();
    ServerAPI.executeAPI(
      API.EndPoint.PAYROLL_SUMMARY,
      ServerAPI.APIMethod.GET,
      true,
      null,
      params
    )
      .then((response) => {
        const isEmpty = Object.keys(response).length === 0;
        if (response !== undefined && !isEmpty) {
          const data = [
            {
              label: "Allowance",
              payroll: response.total_allowance,
            },
            { label: "Deduction", payroll: response.total_deductions },
            { label: "Gross Pay", payroll: response.total_gross_pay },
            {
              label: "Basic Pay",
              payroll: response.total_basic_salary,
            },
            { label: "Net Pay", payroll: response.total_net_pay },
          ];

          const series = [
            {
              dataKey: "payroll",
              label: "Payroll Metric",
              valueFormatter: barGraphValueFormatter,
            },
          ];

          setBarGraphSeries(series);
          setPayrollSummary(data);
        } else {
          setPayrollSummary([]);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  const getReportingManagerList = () => {
    addProcessingRequests();
    ServerAPI.executeAPI(
      API.EndPoint.SUPERIOR_EMPLOYEES_LIST,
      ServerAPI.APIMethod.GET,
      true,
      null
      // params
    )
      .then((response) => {
        if (response !== undefined) {
          const data: any = response.data.superior_employee.map((item: any) => {
            return {
              name: item.employee_first_name + item.employee_last_name,
              code: item.employee_code,
              img: item.employee_photo,
            };
          });
          setSuperiorEmployeeList(data);
        } else {
          setSuperiorEmployeeList([]);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  const getEmployeeTotalOtPendingHoursList = () => {
    addProcessingRequests();
    ServerAPI.executeAPI(
      API.EndPoint.EMPLOYEE_TOTAL_OT_PENDING_HOURS,
      ServerAPI.APIMethod.GET,
      true,
      null,
      employeeTotalOTHoursparamsObj
    )
      .then((response) => {
        if (response !== undefined) {
          setEmployeeTotalOTHoursList(response.data.employees);
        } else {
          setEmployeeTotalOTHoursList([]);
          // setSuperiorEmployeeList([]);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  const reloadGetEmployeeTotalOtPendingHoursList = (month: any) => {
    setEmployeeTotalOTHoursparamsObj((prev) => {
      return { ...prev, month: month };
    });
  };

  const sendToBackend = (value: any) => {
    setEmployeeTotalOTHoursparamsObj((prev) => {
      return { ...prev, search: value };
    });
  };

  useEffect(() => {
    getEmployeeTotalOtPendingHoursList();
  }, [employeeTotalOTHoursparamsObj, getEmployeeTotalOtPendingHoursList, searchValue]);

  useEffect(() => {
    getDashboard();
    getUpcomingHolidays();
    getReportingManagerList();
    currentDateFormatter();
    const date = currentMonthYearFormatter();
    getPayrollSummary(date);
  }, []);
  return (
    <section className="pt-2 pb-5">
      <h4 className="mb-3">
        Employee count : {employerdashboard?.data?.Employee_count}
      </h4>

      <div className="row pb-3">
        <div className="col col-md-12 col-lg-8 mb-3 mb-md-0 d-flex align-items-end">
          <div className="row">
            <div className="col col-md-6 col-lg-6 mb-3 mb-md-0 mb-lg-1">
              <div className="dashboard-card">
                <div className="d-flex justify-content-between">
                  <div>
                    <h2>Absent Employee(s)</h2>
                    <p>{employerdashboard?.Absent}</p>
                  </div>
                  <div className="my-auto px-3 border border-1 py-2 rounded-full bg-white">
                    <img
                      alt="user group"
                      src={
                        window.location.origin + "/assets/svg/user-group.svg"
                      }
                      style={{ height: 32, width: 32 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col col-md-6 col-lg-6 col-xl-6 mb-lg-1">
              <div className="dashboard-card4">
                <div className="d-flex justify-content-between">
                  <div>
                    <h2>Present Employee(s)</h2>
                    <p>{employerdashboard?.Present}</p>
                  </div>
                  <div className="my-auto px-3 border border-1 py-2 rounded-full bg-white">
                    <img
                      alt="user group"
                      src={
                        window.location.origin + "/assets/svg/user-group.svg"
                      }
                      style={{ height: 32, width: 32 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col col-md-6 col-lg-6">
              <div className="dashboard-card2">
                <div className="d-flex justify-content-between">
                  <div>
                    <h2>Employee(M)</h2>
                    <p>{employerdashboard?.Male_count}</p>
                  </div>
                  <div className="my-auto px-3 border border-1 py-2 rounded-full bg-white">
                    <img
                      alt="male icon"
                      src={window.location.origin + "/assets/svg/male-icon.svg"}
                      style={{ height: 32, width: 32 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col col-md-6 col-lg-6">
              <div className="dashboard-card3 ">
                <div className="d-flex justify-content-between">
                  <div>
                    <h2>Employee(F)</h2>
                    <p>{employerdashboard?.Female_count}</p>
                  </div>
                  <div className="my-auto px-3 border border-1 py-2 rounded-full bg-white">
                    <img
                      alt="female icon"
                      src={
                        window.location.origin + "/assets/svg/female-icon.svg"
                      }
                      style={{ height: 32, width: 32 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col col-md-6 col-lg-6 mt-lg-1">
              <div className="dashboard-card5 ">
                <div className="d-flex justify-content-between">
                  <div>
                    <h2>Total Employee(s)</h2>
                    <p>{employerdashboard?.Total_employees}</p>
                  </div>
                  <div className="my-auto px-3 border border-1 py-2 rounded-full bg-white">
                    <img
                      alt="total icon"
                      src={
                        window.location.origin + "/assets/svg/user-group.svg"
                      }
                      style={{ height: 32, width: 32 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col col-md-6 col-lg-6 mt-lg-1">
              <div className="dashboard-card6 ">
                <div className="d-flex justify-content-between">
                  <div>
                    <h2>Late Arrival(s)</h2>
                    <p>{employerdashboard?.Late_count}</p>
                  </div>
                  <div className="my-auto px-3 border border-1 py-2 rounded-full bg-white">
                    <img
                      alt="female icon"
                      src={
                        window.location.origin + "/assets/svg/user-group.svg"
                      }
                      style={{ height: 32, width: 32 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col col-md-12 col-lg-4 mb-3 mb-md-0 mt-5 mt-lg-0 d-lg-flex align-items-end">
          <div className="admin-card p-3">
            <div className="text-center">
              <img
                src={
                  employerdashboard?.Company_details?.company_logo.length > 0
                    ? employerdashboard?.Company_details?.company_logo
                    : window.location.origin + "/assets/images/unknown-user.jpg"
                }
                alt="Admin Profile"
                className="profile-img"
              />
            </div>
            <div className="welcome-text">
              <h5 className="fw-bold">
                Welcome{" "}
                {employerdashboard?.Company_details?.user?.user_name
                  .slice(0, 1)
                  .toUpperCase() +
                  employerdashboard?.Company_details?.user?.user_name.slice(
                    1
                  ) || ""}
              </h5>
              <p className="text-muted mb-0">{currentDate}</p>
              <p className="mb-0">
                Email:{" "}
                {employerdashboard?.Company_details?.user?.user_email || ""}
              </p>
              <p className="mt-0">
                Mobile No:{" "}
                {employerdashboard?.Company_details?.user.user_mobile || ""}
              </p>
              <p className="fw-bold">
                {employerdashboard?.Company_details?.company_name || ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="d-flex justify-content-end">
        <CustomMonthYearPicker reloadData={getPayrollSummary} />
      </div> */}

      <div className="row">
        <div className="col-12 col-lg-6">
          <p className="fw-bold p-2">
            Average Number of Employees by Designation
          </p>
          <div className="chart-container d-flex align-items-center justify-content-center mt-4">
            {designationChartData.length > 0 ? (
              <MuiPieChart data={designationChartData} />
            ) : (
              <div className="text-secondary">No Data Available</div>
            )}
          </div>
        </div>
        <div className="col-12 col-lg-6 mt-2 mt-lg-0">
          <div className="d-flex justify-content-between">
            <p className="fw-bold p-2">Payroll Summary</p>
            <div>
              <CustomMonthYearPicker reloadData={getPayrollSummary} />
            </div>
          </div>
          <div className="chart-container d-flex align-items-center justify-content-center mt-2">
            {payrollSummary.length > 0 ? (
              <MuiBarChart data={payrollSummary} series={barGraphSeries} />
            ) : (
              <div className="text-secondary">No Data Available</div>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col col-lg-6">
          <MuiFolderList
            data={upcomingHolidaysList}
            subHeading={"Upcoming Holidays"}
            subHeaderSx={{ backgroundColor: "rgb(243, 241, 241)" }}
          />
        </div>
        <div className="col col-lg-6">
          <MuiFolderList
            data={superiorEmployeeList}
            subHeading={"Superior Employees"}
            subHeaderSx={{ backgroundColor: "rgb(243, 241, 241)" }}
          />
        </div>
      </div>
      <div>
        <div className="d-flex justify-content-between mt-4">
          <div className="mr-2">
            <SearchInputContainer triggerAPICall={sendToBackend} />
          </div>
          <div>
            <CustomMonthYearPicker
              reloadData={reloadGetEmployeeTotalOtPendingHoursList}
            />
          </div>
        </div>
        <div className="table-container mt-2">
          <div className="table-scroll">
            <div className="table-responsive">
              <table className="table">
                <thead className="color-native-blue">
                  <tr>
                    <th style={{ width: "5%" }}>S.no</th>
                    <th>Name</th>
                    <th>Pending Hours</th>
                    <th>Total Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeTotalOTHoursList &&
                  employeeTotalOTHoursList?.length > 0 ? (
                    employeeTotalOTHoursList?.map(
                      (item: any, index: number) => {
                        return (
                          <tr>
                            <td>
                              {(currentPage - 1) * rowsPerPage + index + 1}
                            </td>

                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              {item.employee_name}
                            </td>
                            <td>{item.pending_hours}</td>
                            <td>{item.total_ot_hours}</td>
                          </tr>
                        );
                      }
                    )
                  ) : (
                    <tr>
                      <td colSpan={6}>No Data Available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <div>
            Rows Per Page:
            <MuiPaginationSelect
              handleRowPerPageChange={handleRowPerPageChange}
              setCurrentPage={setCurrentPage}
              key={"employee dashboard pagination"}
            />
          </div>
          <div className="ms-2">
            <Pagination
              count={totalPages}
              onChange={handlePagination}
              page={currentPage}
              variant="outlined"
              color="primary"
              shape="rounded"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageDashboard;
