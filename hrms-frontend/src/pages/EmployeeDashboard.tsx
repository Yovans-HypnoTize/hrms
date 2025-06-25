import React, { useEffect, useState } from "react";
import { useAppStateAPI } from "../common/AppStateAPI";
import { ServerAPI } from "../common/ServerAPI";
import { ProjectConfig } from "../common/Constants";
import { Pagination } from "@mui/material";
import DateRangePicker from "../components/DateRangePicker";
import ToggleSwitch from "../components/toggle-switch/ToggleSwitch";
import EmployeeReportEntryDialog from "../forms/EmployeeReportEntryDialog";
import toast from "react-hot-toast";
import { dateFormatter } from "../common/Utilities";
import MuiPaginationSelect from "../components/MuiPaginationSelect";

const EmployeeDashboard: React.FC = () => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  const [dashboardLogResponse, setDashboardLogResponse] = useState<any[]>([]);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showReportDialog, setShowReportDialog] = useState<boolean>(false);
  const [isReportIdAvailable, setIsReportIdAvailable] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(ProjectConfig.EntriesPerPage);

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };
  const paramsObj = {
    page_size: rowsPerPage || 5,
    page_number: currentPage || 1,
    from_date: "",
    to_date: "",
  };

  const findReportAvalilable = () => {
    addProcessingRequests();
    ServerAPI.getEmployeeReportList()
      .then((response) => {
        if (response?.data) {
          // if (response?.data?.employee_report?.length > 0) {
          const reportFilter = response.data.employee_report.find(
            (item: any) => item.report_date === dateFormatter()
          );
          console.log(reportFilter);
          reportFilter !== undefined
            ? setIsReportIdAvailable(reportFilter.employee_report_id)
            : setIsReportIdAvailable(0);
          // } else {
          //   setIsReportIdAvailable(0);
          // }
        } else {
          toast.error("Something went wrong!");
        }
      })
      .finally(() => {
        reduceProcessingRequests();
        setShowReportDialog(true);
      });
  };

  const handleCheckIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      findReportAvalilable();
    } else {
      processCheckInOut(e.target.checked);
    }
  };

  const processCheckInOut = (isCheckIn: boolean) => {
    const checkInOutTime = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
    });
    const checkInOutDate = dateFormatter();
    const data = {
      [isCheckIn ? "check_in" : "check_out"]: checkInOutTime,
      attendance_date: checkInOutDate,
    };

    addProcessingRequests();
    ServerAPI.addCheckInOut(data)
      .then((response) => {
        if (response?.message) {
          getEmployeeDashboardAttendenceStatus();
          getEmployeeDashboardAttendenceHistory(paramsObj);
          toast.success(response.message);
        } else {
          toast.error("Something went wrong!");
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });

    setCheckedIn(isCheckIn);
  };

  const handleReportSubmit = () => {
    setShowReportDialog(false);
    processCheckInOut(false);
  };

  const getEmployeeDashboardAttendenceHistory = (params: any) => {
    addProcessingRequests();
    ServerAPI.getEmployeeAttendenceHistoryLog(params)
      .then((response) => {
        if (response.data.attendance.length > 0) {
          const responseData = response.data.attendance;
          if (response.data.pagination["total_pages"] !== undefined) {
            setTotalPages(response.data.pagination["total_pages"]);
            setCurrentPage(response.data.pagination["page_number"]);
          }
          setDashboardLogResponse(responseData);
        } else {
          setDashboardLogResponse([]);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  const getEmployeeDashboardAttendenceStatus = () => {
    addProcessingRequests();
    ServerAPI.getEmployeeCheckInOutStatus()
      .then((response) => {
        if (response) {
          if (response.data !== null) {
            const responseData = response.data.status;
            setCheckedIn(responseData);
          } else {
            setCheckedIn(false);
          }
        } else {
          console.log("No error occurred");
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  useEffect(() => {
    // getEmployeeDashboardAttendenceHistory(paramsObj);
    getEmployeeDashboardAttendenceStatus();
  }, [currentPage]);

  const reloadData = (dateRange: any) => {
    let params: any = {
      ...paramsObj,
      from_date: dateRange?.dateRangeFrom || "",
      to_date: dateRange?.dateRangeTo || "",
    };
    getEmployeeDashboardAttendenceHistory(params);
  };

  const handleRowPerPageChange = (value: any) => {
    setRowsPerPage(value);
  };

  useEffect(() => {
    getEmployeeDashboardAttendenceHistory(paramsObj);
  }, [rowsPerPage,currentPage]);

  return (
    <section className="pt-15 pb-5">
      <div className="d-flex justify-content-between align-items-center check-in-out-paper">
        <p className="ps-menu-label mb-0 fw-bold ps-3">Dashboard</p>
        <div className="d-flex">
          <p className="mx-3 mt-2 checkin-text">
            {checkedIn ? "Check Out : " : "Check In : "}
          </p>
          <ToggleSwitch checked={checkedIn} onChange={handleCheckIn} />
        </div>
      </div>
      <div>
        <div className="d-flex justify-content-between align-items-center pt-3">
          <p className="fw-medium fs-6 mb-0">Attendance History</p>

          <DateRangePicker tiggerAPIRequest={reloadData} />
        </div>
        <div className="table-container">
          <div className="table-scroll">
            <div className="table-responsive">
              <table className="table">
                <thead className="color-native-blue">
                  <tr>
                    <th style={{ width: "5%" }}>S.no</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>

                    <th>Shift Type</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardLogResponse && dashboardLogResponse?.length > 0 ? (
                    dashboardLogResponse?.map((item: any, index: number) => {
                      return (
                        <tr>
                          <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                          <td
                            style={{
                              whiteSpace: "nowrap",
                              minWidth: "150px",
                            }}
                          >
                            {item.attendance_date}
                          </td>
                          <td>
                            {item.check_in !== null ? item.check_in : "--"}
                          </td>
                          <td>
                            {item.check_out !== null ? item.check_out : "--"}
                          </td>

                          <td>
                            {item.shift_type !== null ? item.shift_type : "--"}
                          </td>
                        </tr>
                      );
                    })
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
      {showReportDialog && (
        <EmployeeReportEntryDialog
          showDialog={showReportDialog}
          closeDialog={() => setShowReportDialog(false)}
          reloadData={handleReportSubmit}
          id={isReportIdAvailable}
        />
      )}
    </section>
  );
};

export default EmployeeDashboard;
