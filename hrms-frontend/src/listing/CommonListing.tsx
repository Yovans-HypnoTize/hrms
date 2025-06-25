import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import TableMain from "../components/TableMain";
import { ServerAPI } from "../common/ServerAPI";
import { useAppStateAPI } from "../common/AppStateAPI";
import { getUserToken } from "../common/Utilities";
import dayjs, { Dayjs } from "dayjs";
import { PageMappings } from "../common/PageMappings";
import {
  API,
  DateFilterType,
  Endpoints,
  PageLinks,
  ProjectConfig,
} from "../common/Constants";
import { DatePicker } from "antd";
import toast from "react-hot-toast";
import { TableViewMappings } from "../common/TableViewMappings";
import { useNavigate } from "react-router";
import { APIData } from "../common/DataTypes";
import PendingLeaveRequest from "../components/custom-table/PendingLeaveRequest";
import EmployeeViewDetails from "../components/custom-file/EmployeeViewDetails";
import NoAttendance from "../components/custom-table/NoAttendance";
import OverTimeAndLop from "../components/custom-table/OverTimeAndLop";
import PayRunReport from "../components/custom-table/PayRunReport";
import Dashboard from "../components/dashboard/Dashboard";
import ShiftReports from "../components/dashboard/ShiftReport";
import DashboardNotifications from "../components/dashboard/DashboardNotifications";
import PayrollViewDetails from "../components/custom-file/PayrollViewDetails";
import ConfirmDialog from "../components/ConfirmDialog";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const { RangePicker } = DatePicker;

const TabsProcessPayRun = [
  { tabLabel: "pending leave request" },
  { tabLabel: "No attendance" },
  { tabLabel: "over time & LOP" },
];

const CommonListing: React.FC<{ page: string }> = ({ page }) => {
  const [showOption, setShowoption] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showAdditionalFormDialogs, setShowAdditionalFormDialogs] = useState<
    number[]
  >([]);
  //const [showEmployeeFormDialog, setShowEmployeeFormDialog] = useState(false);
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [pageMappingDetail, setPageMappingDetail] =
    useState<PageMappings.PageDetail>();
  const [tableRows, setTableRows] = useState<any[]>();
  const [tableDetail, setTableDetail] =
    useState<TableViewMappings.TableDetail>();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [selectedAdditionalFilter, setSelectedAdditionalFilter] = useState("");
  const [dateRangeSet, setDateRangeSet] = useState(false);
  const [dateRangeFrom, setDateRangeFrom] = useState("");
  const [dateRangeTo, setDateRangeTo] = useState("");
  const [dayJSRange, setDayJSRange] = useState<[Dayjs?, Dayjs?]>([]);
  const [dateMonthSet, setDateMonthSet] = useState(false);
  const [dateMonth, setDateMonth] = useState("");
  const [reloadData, setReloadData] = useState<boolean>(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [dataID, setDataID] = useState(0);
  const [copyID, setCopyID] = useState(0);
  // const [selectedTab, setSelectedTab] = React.useState(0);
  const [pageInitialized, setPageInitialized] = useState(false);
  const navigate = useNavigate();
  const [activeTabButton, setActiveTabButton] = useState("");
  const [activePayrollTabButton, setActivePayrollTabButton] = useState(
    TabsProcessPayRun[0].tabLabel
  );
  const [indexValue, setIndexValue] = useState(0);
  const [selectedAttendanceIds, setSelectedAttendanceIds] = useState<number[]>(
    []
  );
  const [resetSelectedState, setResetSelectedState] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeList, setEmployeeList] = useState<APIData.Employee[]>([]);
  const [leaveTypeList, setLeaveTypeList] = useState<APIData.LeaveType[]>([]);
  const [seletedEmployee, setSelectedEmployee] = useState("0");
  const [seletedLeaveType, setSelectedLeaveType] = useState("0");
  const [rowsPerPage, setRowsPerPage] = useState(ProjectConfig.EntriesPerPage)

  // useEffect(() => {
  //   leaveTypeLists();
  // }, []);

  useEffect(() => {
    setReloadData(true);
  }, [seletedEmployee, seletedLeaveType]);

  useEffect(() => {
    if (page !== PageLinks.EMPLOYER_ATTENDANCE) {
      setSelectedAttendanceIds([]);
    }
  }, [page]);

  const handleTabClick = (value: string) => {
    setActiveTabButton(value);
  };

  const handleTabsProcessPayRun = (value: string, index: number) => {
    setActivePayrollTabButton(value);
    setIndexValue(index);
  };

  const handleRowPerPageChange = (value:any) => {
    setRowsPerPage(value)
  }

  useEffect(() => {
    loadTableData()
  },[rowsPerPage])

  const frameAPIParams = (pagination?: boolean) => {
    let params: { [k: string]: any } = {};
    if (pageMappingDetail) {
      if (!pageMappingDetail.noPagination) {
        params["page_number"] = pagination ? currentPage : 1;
        params["page_size"] = pagination ? rowsPerPage : 10;
      }
      //params['status'] = '1';
      if (dateRangeSet) {
        if (
          page === PageLinks.EMPLOYER_LEAVE_REQUEST ||
          page === PageLinks.EMPLOYEE_LEAVE_REQUEST ||
          page === PageLinks.EMPLOYEE_PENDING_LEAVE_REQUEST
        ) {
          params["employee_leave_req_period_from"] = dateRangeFrom;
          params["employee_leave_req_period_to"] = dateRangeTo;
        } else {
          params["from_date"] = dateRangeFrom;
          params["to_date"] = dateRangeTo;
        }
      }

      if (dateMonthSet) {
        params["month"] = dateMonth;
      }
      if (searchString) {
        params["search"] = searchString;
      }
      if (seletedLeaveType) {
        params["leave_type_id"] =
          parseInt(seletedLeaveType) === 0
            ? undefined
            : parseInt(seletedLeaveType);
      }
      if (seletedEmployee) {
        params["employee_id"] =
          parseInt(seletedEmployee) === 0
            ? undefined
            : parseInt(seletedEmployee);
      }
      if (pageMappingDetail.listAddlParams !== undefined) {
        pageMappingDetail.listAddlParams.forEach(
          (addlParam) => (params[addlParam.param_name] = addlParam.param_value)
        );
      }
    }
    return params;
  };

  var searchTimeout: any = null;

  const employeeLists = () => {
    addProcessingRequests();
    ServerAPI.executeAPI(
      API.EndPoint.EMPLOYEES_LIST,
      ServerAPI.APIMethod.GET,
      true,
      null
    )
      .then((response) => {
        if (response.data !== undefined && response.message) {
          const employeeData = response.data.map((item: any) => item.employee);
          setEmployeeList(employeeData);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  const leaveTypeLists = () => {
    addProcessingRequests();
    ServerAPI.executeAPI(
      API.EndPoint.LEAVE_TYPES,
      ServerAPI.APIMethod.GET,
      true,
      null
    )
      .then((response) => {
        if (response?.leave_types !== undefined) {
          const leaveTypeData = response.leave_types;
          setLeaveTypeList(leaveTypeData);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  const extractName = (item: any) => {
    return item.project_team
      .map(
        (member: any) =>
          `${member.employee.employee_first_name} ${member.employee.employee_last_name}`
      )
      .join(", ");
  };

  const extractEmployeeTeam = (item: any) => {
    return item.project_team
      .map(
        (member: any) =>{
          return {name: member.employee.employee_code, alt : member.employee.employee_first_name,src: member.employee.employee_photo}
        }
      )
  };

  const loadTableData = () => {
    if (pageMappingDetail) {
      setPageInitialized(true);
      const params = frameAPIParams(true);
      if (
        pageMappingDetail.additionalFilter !== undefined &&
        selectedAdditionalFilter
      ) {
        params[pageMappingDetail.additionalFilter.paramName] =
          selectedAdditionalFilter;
      }
      addProcessingRequests();

      // alert(lastSegment);
      // console.log(lastSegment);
      ServerAPI.executeAPI(
        pageMappingDetail.listEndpoint,
        ServerAPI.APIMethod.GET,
        true,
        null,
        params
      )
        .then((response) => {
          if (response !== undefined) {
            // const lastSegment =
            // window.location.pathname.split("/").filter(Boolean).pop() || "";
            const key = Object.keys(response.data).filter(
              (item) => item !== "pagination"
            );
            // Check if the last segment exists as a key in response.data
            console.log("here", response.data, key);

            if (response.data && response.data[key[0]]) {
              if (
                response.data[key[0]].every(
                  (item: any) => "project_team" in item
                )
              ) {
                const data = response.data[key[0]].map((item: any) => {
                  return { ...item, project_team: extractEmployeeTeam(item) };
                  // return { ...item, project_team: extractName(item) };
                });
                console.log("employee data", data)
                setTableRows(data);
                // setTableRows(response.data[key[0]]);
              } else {
                setTableRows(response.data[key[0]]);
              }
              console.log(response.data[key[0]]);
            } else if (
              pageMappingDetail.listResponseParam !== undefined &&
              response[pageMappingDetail.listResponseParam] !== undefined
            ) {
              setTableRows(response[pageMappingDetail.listResponseParam]);
            } else if (
              response.data !== undefined &&
              typeof response.data === "object"
            ) {
              setTableRows([response.data]);
            } else if (response !== undefined) {
              setTableRows([response?.data]);
            } else if (
              response["status"] === false &&
              response["message"] !== undefined
            ) {
              setTableRows([]);
              toast.error(response["message"]);
            } else {
              setTableRows([]);
            }
            // console.log("total pages got from api",response.data.pagination["total_pages"])
            if (response.data["pagination"]) {
              if (response.data.pagination["total_pages"] !== undefined) {
                setTotalPages(response.data.pagination["total_pages"]);
              }
            }
          } else {
            setTableRows([]);
          }
        })
        .finally(() => {
          reduceProcessingRequests();
          setReloadData(false);
        });
    } else {
      setTableRows([]);
    }
  };

  const deleteMultipleEntry = () => {
    setResetSelectedState(false);
    if (pageMappingDetail && pageMappingDetail.deleteEndpoint) {
      let params: { [k: string]: any } = {};
      params["attendance_ids"] = selectedAttendanceIds.join(",");
      addProcessingRequests();
      ServerAPI.executeAPI(
        Endpoints.ATTENDANCE_LIST,
        ServerAPI.APIMethod.DELETE,
        true,
        null,
        params
      )
        .then((response) => {
          if (response !== undefined && response.message) {
            toast.success(response.message);
            setReloadData(true);
            setResetSelectedState(true);
          }
        })
        .finally(() => {
          reduceProcessingRequests();
          setSelectedAttendanceIds([]);
        });
    }
  };

  const deleteEntry = (params: { [k: string]: any }, id?: number) => {
    if (pageMappingDetail && pageMappingDetail.deleteEndpoint) {
      //let params: { [k: string]: any } = {};
      console.log("param key", params);
      addProcessingRequests();
      ServerAPI.executeAPI(
        `${pageMappingDetail.deleteEndpoint}?${params.paramKey}=${params.id}`,
        ServerAPI.APIMethod.DELETE,
        true
        // null
      )
        .then((response) => {
          if (response !== undefined && response.message) {
            setReloadData(true);
            toast.success(response.message);
          }
        })
        .finally(() => {
          reduceProcessingRequests();
        });
    }
  };

  useEffect(() => {
    const pageDetail = PageMappings.getPageDetail(page);
    console.log("pageDetail", pageDetail)
    console.log("tableDetail", pageDetail !== undefined && TableViewMappings.getPageTableDetail(pageDetail.pageLink))
    setReloadData(false);
    if (pageDetail) {
      setPageInitialized(false);
      setTableDetail(TableViewMappings.getPageTableDetail(pageDetail.pageLink));
      setPageMappingDetail(pageDetail);
      setSearchString("");
      setCurrentPage(1);
      setTableRows([]);
      setTotalPages(1);
      setTimeout(() => setReloadData(true), 100);
      setRowsPerPage(ProjectConfig.EntriesPerPage)
    }
    setActiveTabButton(page);
  }, [page]);

  useEffect(() => {
    console.log("Search", searchString);
    if (searchTimeout) clearTimeout(searchTimeout);
    if (pageInitialized) {
      searchTimeout = setTimeout(() => {
        setCurrentPage(1);
        setReloadData(true);
      }, 500);
    }
  }, [searchString]);

  useEffect(() => {
    if (
      pageMappingDetail !== undefined &&
      pageMappingDetail?.additionalFilter !== undefined
    ) {
      setCurrentPage(1);
      setReloadData(true);
    }
  }, [selectedAdditionalFilter]);

  useEffect(() => {
    console.log("Reload Data", reloadData);
    if (reloadData) {
      loadTableData();
    }
    const loadTimer = setTimeout(() => setReloadData(false), 100);
    return () => clearTimeout(loadTimer);
  }, [reloadData]);

  useEffect(() => {
    setReloadData(true);
  }, [currentPage]);

  useEffect(() => {
    if (dateRangeFrom && dateRangeTo) {
      setDayJSRange([dayjs(dateRangeFrom), dayjs(dateRangeTo)]);
    }
  }, [dateRangeFrom, dateRangeTo]);

  const handleRangeChange = (value: any) => {
    if (value) {
      setDateRangeFrom(dayjs(value[0]).format("YYYY-MM-DD"));
      setDateRangeTo(dayjs(value[1]).format("YYYY-MM-DD"));
      setDateRangeSet(true);
      setReloadData(true);
    } else {
      setDateRangeSet(false);
      setReloadData(true);
    }
  };

  const handleMonthChange = (value: any) => {
    if (value) {
      setDateMonth(dayjs(value).format("MM-YY"));
      setDateMonthSet(true);
      setReloadData(true);
    } else {
      setDateMonth("");
      setDateMonthSet(false);
      setReloadData(true);
    }
  };

  const displayAdditionalFormDialogs = (index: number) => {
    if (!showAdditionalFormDialogs.includes(index)) {
      setShowAdditionalFormDialogs((idxs) => [...idxs, index]);
    }
  };

  const hideAdditionalFormDialogs = (index: number) => {
    if (showAdditionalFormDialogs.includes(index)) {
      setShowAdditionalFormDialogs(
        showAdditionalFormDialogs.filter((formIndex) => formIndex !== index)
      );
    }
  };

  if (pageMappingDetail != undefined) {
    return (
      <>
        <div className="card-body-inner pr-0 d-flex flex-column">
          <div className="col-12 p-0 d-flex align-items-start resp-attendance">
            <h4 className="header-title mt-0 mb-0" style={{ width: "30rem" }}>
              {pageMappingDetail.title}
            </h4>
            {(pageMappingDetail.componentSubText ||
              pageMappingDetail.dateFilterType) && (
              <div className="row mr-0 ml-0 py-2 pl-0 d-flex align-items-center w-100">
                <div className="col-12 d-flex p-0 resp-date gap-2 align-items-center">
                  {pageMappingDetail.dateFilterType &&
                    pageMappingDetail.dateFilterType ===
                      DateFilterType.RangePicker && (
                      <RangePicker
                        value={
                          dateRangeSet
                            ? (dayJSRange as [Dayjs, Dayjs])
                            : undefined
                        }
                        onChange={handleRangeChange}
                        allowClear={
                          pageMappingDetail.dateFilterRequired ? false : true
                        }
                        // suffixIcon={
                        //   <RiCalendarLine className="remix-icon hp-text-color-black-100" />
                        // }
                        // defaultValue={pageMappingDetail.dateFilterRequired ? [dayjs().startOf('month'), dayjs()] : undefined}
                      />
                    )}
                  {pageMappingDetail.dateFilterType &&
                    pageMappingDetail.dateFilterType ===
                      DateFilterType.MonthPicker && (
                      <DatePicker
                        value={
                          dateMonthSet ? dayjs(dateMonth, "MM-YY") : undefined
                        }
                        onChange={handleMonthChange}
                        allowClear={
                          pageMappingDetail.dateFilterRequired ? false : true
                        }
                        defaultValue={
                          pageMappingDetail.dateFilterRequired
                            ? dayjs(dayjs().format("YYYY/MM"), "YYYY/MM")
                            : undefined
                        }
                        format={"YYYY/MM"}
                        picker="month"
                      />
                    )}
                  {dateRangeSet && (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setDateRangeSet(false);
                        setReloadData(true);
                      }}
                    >
                      <CloseOutlinedIcon />
                    </div>
                  )}
                  {dateMonthSet && (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setDateMonthSet(false);
                        setReloadData(true);
                      }}
                    >
                      <CloseOutlinedIcon />
                    </div>
                  )}
                </div>
                {/* <div className='col-6 pl-0'>
                                {pageMappingDetail.componentSubText && <p className='additional-option-title mb-1'>Select {pageMappingDetail.componentSubText}</p>}
                            </div> */}
              </div>
            )}
          </div>
          {pageMappingDetail.additionalFilter !== undefined && (
            <div className="col-6 p-0 mt-4">
              <div className="additional-filter">
                <>
                  {pageMappingDetail.additionalFilterTitle && (
                    <p className="additional-option-title mb-1">
                      Select {pageMappingDetail.additionalFilterTitle}
                    </p>
                  )}
                  <select
                    value={selectedAdditionalFilter}
                    className="form-control"
                    onChange={(e) =>
                      setSelectedAdditionalFilter(e.target.value)
                    }
                  >
                    {pageMappingDetail.additionalFilter.optional === true && (
                      <option value="">
                        Select {pageMappingDetail.additionalFilter.label}
                      </option>
                    )}
                    {pageMappingDetail.additionalFilter.options.map(
                      (option, index) => (
                        <option value={option.value} key={index}>
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </>
              </div>
            </div>
          )}

          {pageMappingDetail.tabs !== undefined && (
            <div className="toggle-buttons mt-3">
              {pageMappingDetail.tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`toggle-button ${
                    activeTabButton === tab.tabLink ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick(tab.tabLink);
                    navigate(tab.tabLink);
                  }}
                >
                  {tab.tabLabel}
                </button>
              ))}
            </div>
          )}

          {(pageMappingDetail.searchBox ||
            pageMappingDetail.exportDataBtn ||
            pageMappingDetail.addAvailable ||
            pageMappingDetail.uploadEmployeeDataBtn ||
            pageMappingDetail.additionalListButtons) && (
            <div
              className="row mt-1 mr-0 ml-0 mb-2 py-2 w-100 pl-0 search-btns-resp"
              style={{ height: "50px" }}
            >
              {pageMappingDetail.searchBox && (
                <div
                  className="col-4 d-flex justify-content-start p-0 "
                  style={{ gap: "10px" }}
                >
                  <>
                    {" "}
                    <input
                      type="text"
                      className="search-option"
                      placeholder="Search By Keywords"
                      value={searchString}
                      onChange={(e: any) => {
                        if (searchTimeout) clearTimeout(searchTimeout);
                        setSearchString(e.target.value);
                      }}
                    />
                    <Icon path={mdiMagnify} size={1} className="search-icon" />
                  </>
                </div>
              )}
              <div
                className={
                  pageMappingDetail.searchBox
                    ? "col-8 d-flex justify-content-end p-0 employee-btn"
                    : "col-12 d-flex justify-content-end p-0 employee-btn"
                }
                style={{ height: "auto" }}
              >
                {pageMappingDetail.addAvailable && (
                  <button
                    className="toggle-button active h-100"
                    style={{ minHeight: "50px", minWidth: "93px" }}
                    onClick={() => {
                      setShowFormDialog(true);
                      setDataID(0);
                      setCopyID(0);
                    }}
                  >
                    {" "}
                    <img
                      src={window.location.origin + "/assets/svg/add-btn.svg"}
                      alt="add btn"
                      style={{ marginTop: "-3px" }}
                    />{" "}
                    Add {pageMappingDetail.titleSingular}
                  </button>
                )}
                {/* {pageMappingDetail.exportDataBtn && (
                                    <button className='toggle-button active h-100' style={{ minHeight: "50px", minWidth: "93px" }}>{pageMappingDetail.exportDataBtn}</button>
                                )} */}
                <div
                  className={
                    page === PageLinks.EMPLOYER_ATTENDANCE
                      ? "add-func-btns-attendance"
                      : "add-func-btns"
                  }
                >
                  {/* {pageMappingDetail.deleteMultipleEntry && (
                    <button
                      className="toggle-button h-100"
                      style={
                        selectedAttendanceIds.length > 0
                          ? {
                              minHeight: "50px",
                              minWidth: "93px",
                              backgroundColor: "#DC3545",
                              color: "white",
                            }
                          : {
                              minHeight: "50px",
                              minWidth: "93px",
                              backgroundColor: "#F2F2F2",
                              color: "#cdcccd",
                            }
                      }
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={
                        selectedAttendanceIds.length === 0 ? true : false
                      }
                    >
                      Delete Selected&nbsp;{" "}
                      <i
                        className="fas fa-trash-alt font-15"
                        aria-hidden="true"
                        style={
                          selectedAttendanceIds.length > 0
                            ? { color: "#fff", fontWeight: "500" }
                            : { color: "#DC3545", fontWeight: "500" }
                        }
                      ></i>
                    </button>
                  )} */}

                  {!!pageMappingDetail.additionalListButtons &&
                    pageMappingDetail.additionalListButtons.map(
                      (addlBtn, btnIdx) => {
                        if (addlBtn.type === "form-control") {
                          return (
                            <button
                              className="toggle-button active h-100"
                              style={{ minHeight: "50px", minWidth: "93px" }}
                              key={btnIdx}
                              onClick={() =>
                                displayAdditionalFormDialogs(btnIdx)
                              }
                            >
                              {!!addlBtn.iconStart && (
                                <>
                                  <img
                                    src={addlBtn.iconStart}
                                    alt="add icon"
                                    style={{ marginTop: "-3px" }}
                                  />
                                  &nbsp;
                                </>
                              )}
                              {addlBtn.title}
                              {!!addlBtn.iconEnd && (
                                <>
                                  &nbsp;
                                  <img
                                    src={addlBtn.iconEnd}
                                    alt="add icon end"
                                    style={{ marginTop: "-3px" }}
                                  />
                                </>
                              )}
                            </button>
                          );
                        } else if (
                          addlBtn.type === "custom" &&
                          addlBtn.customComponent
                        ) {
                          return React.createElement(addlBtn.customComponent, {
                            pageMapping: pageMappingDetail,
                            tableDetail: tableDetail,
                            reloadData: reloadData,
                            key: btnIdx,
                          });
                        }
                      }
                    )}
                </div>

                {/* {pageMappingDetail.addEmployeeBtn && (
                                    <button className='toggle-button active h-100' style={{ minHeight: "50px", minWidth: "93px" }} onClick={() => { setShowEmployeeFormDialog(true); setDataID(0); setCopyID(0); }}>
                                        <img src="/assets/svg/add-btn.svg" alt="" style={{ marginTop: '-3px' }} /> {pageMappingDetail.addEmployeeBtn}
                                    </button>
                                )} */}
                {/* <div style={{ gap: "10px", display: "flex", alignItems: "flex-end" }}>
                                    {pageMappingDetail.uploadEmployeeDataBtn && (
                                        <button className='toggle-button active h-100' style={{ minHeight: "50px", minWidth: "93px" }} onClick={() => { setShowFormDialog(true); setDataID(0); setCopyID(0); }}>{pageMappingDetail.uploadEmployeeDataBtn} <img src="/assets/svg/upload-data.svg" alt="" /></button>
                                    )}

                                    {pageMappingDetail.uploadEmployeeDataBtn && (
                                        <a href="#"> <img src="/assets/images/excel-icon.png" alt="" style={{ width: "25px", height: "25px", margin: "10px 0" }} /> </a>
                                    )}
                                </div> */}
                {/* {pageMappingDetail.editBtn && (
                                    <button className='toggle-button active h-100' style={{ minHeight: "50px", minWidth: "93px" }}>{pageMappingDetail.editBtn}</button>
                                )} */}
              </div>
            </div>
          )}
          <div
            className={
              page === PageLinks.EMPLOYER_EMPLOYEES
                ? "add-func-btns-1 w-100 mt-2"
                : "d-none"
            }
          >
            {!!pageMappingDetail.additionalListButtons &&
              pageMappingDetail.additionalListButtons.map((addlBtn, btnIdx) => {
                if (addlBtn.type === "form-control") {
                  return (
                    <button
                      className="toggle-button active h-100"
                      style={{ minHeight: "50px", minWidth: "93px" }}
                      key={btnIdx}
                      onClick={() => displayAdditionalFormDialogs(btnIdx)}
                    >
                      {!!addlBtn.iconStart && (
                        <>
                          <img
                            src={addlBtn.iconStart}
                            alt="add icon start"
                            style={{ marginTop: "-3px" }}
                          />
                          &nbsp;
                        </>
                      )}
                      {addlBtn.title}
                      {!!addlBtn.iconEnd && (
                        <>
                          &nbsp;
                          <img
                            src={addlBtn.iconEnd}
                            alt="add end icon"
                            style={{ marginTop: "-3px" }}
                          />
                        </>
                      )}
                    </button>
                  );
                } else if (
                  addlBtn.type === "custom" &&
                  addlBtn.customComponent
                ) {
                  return React.createElement(addlBtn.customComponent, {
                    pageMapping: pageMappingDetail,
                    tableDetail: tableDetail,
                    reloadData: reloadData,
                    key: btnIdx,
                  });
                }
              })}
          </div>

          {pageMappingDetail.additionalFilterSelect && (
            <div className="col-12 p-0 mt-2 d-flex align-items-center flex-row gap-2">
              <div className="additional-filter">
                <>
                  {/* <p className='additional-option-title mb-1'>Filter Leave Type</p> */}
                  {/* <select
                    value={seletedLeaveType}
                    className="form-control"
                    onChange={(e) => setSelectedLeaveType(e.target.value)}
                    style={{ paddingLeft: "30px" }}
                    aria-placeholder="Filter Leave Type"
                  >
                    <option value={0} disabled selected hidden>
                      {" "}
                      Filter Leave Type
                    </option>
                    {leaveTypeList.map((data, index) => (
                      <option value={data.leave_type_id} key={index}>
                        {data.leave_type_name}
                      </option>
                    ))}
                  </select> */}
                  {/* 
                  <img
                    src={
                      window.location.origin + "/assets/svg/filter-circle.svg"
                    }
                    alt="circle-icon"
                    className="mr-1"
                    height={"14px"}
                    style={{
                      color: "black",
                      position: "absolute",
                      marginTop: "-30px",
                      marginLeft: "10px",
                    }}
                  /> */}
                </>
              </div>
              {/* <p className='additional-option-title mb-1'>Filter Employee</p> */}
              {/* {page === PageLinks.EMPLOYER_LEAVE_REQUEST && <div className="additional-filter" >
                            <>
                                <select value={seletedEmployee} className="form-control" onChange={e => setSelectedEmployee(e.target.value)} style={{ paddingLeft: "30px" }}>
                                    <option value={0}>Filter Employee</option>
                                    {employeeList.map((data, index) => (<option value={data.employee_id} key={index}>{`${data.employee_first_name} ${data.employee_last_name}`}</option>))}
                                </select>
                                <img src={window.location.origin + "/assets/svg/filter-circle.svg"} alt="circle-icon" className='mr-1' height={'14px'} style={{ color: "black", position: "absolute", marginTop: "-30px", marginLeft: "10px" }} />
                            </>
                        </div>} */}
              {pageMappingDetail.additionalFilterSelect &&
                (seletedEmployee != "0" || seletedLeaveType != "0") && (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedLeaveType("0");
                      setSelectedEmployee("0");
                      setReloadData(true);
                    }}
                  >
                    <CloseOutlinedIcon />
                  </div>
                )}
            </div>
          )}
          {/* {pageMappingDetail.additionalFilterSelect && <div className='filter-option d-flex gap-2 p-2 mt-2'>
                        <button><img src={window.location.origin + "/assets/svg/filter-circle.svg"} alt="circle-icon" className='mr-1 mt-0' height={'14px'} /> Filter By</button>
                        <div> <button className='select' onClick={() => setShowoption(!showOption)}>Employee <i className={`mdi ${showOption ? 'mdi-chevron-up' : 'mdi-chevron-down'}`}></i></button>
                            {showOption && <div className='option'>
                                <p className='mb-0 pt-2 pb-2' onClick={() => setShowoption(false)}>Leave Request</p><hr className='mt-1 mb-1' />
                                <p className='mb-0 pt-2 pb-2' onClick={() => setShowoption(false)}>Leave Balance</p><hr className='mt-1 mb-1' />
                                <p className='mb-0 pt-2 pb-2' onClick={() => setShowoption(false)}>Leave Credit</p><hr className='mt-1 mb-1' />
                            </div>}</div>
                        <div> <button className='select'>Date <i className={`mdi ${showOption ? 'mdi-chevron-up' : 'mdi-chevron-down'}`}></i></button></div>
                        <div> <button className='select'>Period <i className={`mdi ${showOption ? 'mdi-chevron-up' : 'mdi-chevron-down'}`}></i></button></div>
                        <div> <button className='select'>Leave Type<i className={`mdi ${showOption ? 'mdi-chevron-up' : 'mdi-chevron-down'}`}></i></button></div>
                    </div>} */}
          {page === PageLinks.EMPLOYER_EMPLOYEE_PAYROLL && (
            <div className="my-3">
              <p className="additional-option-title">Employee Details</p>
              <div className="form-box p-2" style={{ width: "80vw" }}>
                <div className="d-flex justify-content-between para">
                  <div>
                    <p className="dummy-para">First Name</p>
                    <p className="dummy-value">Dinesh</p>
                  </div>
                  <div>
                    <p className="dummy-para">Last Name</p>
                    <p className="dummy-value">J</p>
                  </div>
                  <div>
                    <p className="dummy-para">Company Name</p>
                    <p className="dummy-value">BES</p>
                  </div>
                  <div>
                    <p className="dummy-para">Employee Code</p>
                    <p className="dummy-value">4</p>
                  </div>
                  <div>
                    <p className="dummy-para">Mobile Number</p>
                    <p className="dummy-value">899</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between para">
                  <div>
                    <p className="dummy-para">Official Email</p>
                    <p className="dummy-value">Dinesh</p>
                  </div>
                  <div>
                    <p className="dummy-para">Gender</p>
                    <p className="dummy-value">J</p>
                  </div>
                  <div>
                    <p className="dummy-para">Date Of Joining</p>
                    <p className="dummy-value">BES</p>
                  </div>
                  <div>
                    <p className="dummy-para">Tax Identification Number</p>
                    <p className="dummy-value">4</p>
                  </div>
                  <div>
                    <p className="dummy-para">Work Location</p>
                    <p className="dummy-value">899</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between para">
                  <div>
                    <p className="dummy-para">department</p>
                    <p className="dummy-value">Dinesh</p>
                  </div>
                  <div>
                    <p className="dummy-para">Designation</p>
                    <p className="dummy-value">J</p>
                  </div>
                  <div>
                    <p className="dummy-para">Superior Employee</p>
                    <p className="dummy-value">BES</p>
                  </div>
                  <div>
                    <p className="dummy-para">Annual CTC</p>
                    <p className="dummy-value">4</p>
                  </div>
                  <div>
                    <p className="dummy-para">Monthly Pay</p>
                    <p className="dummy-value">899</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between para">
                  <div>
                    <p className="dummy-para">Attendance Policy</p>
                    <p className="dummy-value">Dinesh</p>
                  </div>
                  <div>
                    <p className="dummy-para">Salary Structure</p>
                    <p className="dummy-value">J</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* {page === PageLinks.PAYROLL_VIEW_DETAILS && <><PayrollViewDetails /></>} */}
          {page === PageLinks.EMPLOYER_PERSONAL_VIEW_DETAILS && (
            <>
              <EmployeeViewDetails />
            </>
          )}

          {page === PageLinks.EMPLOYER_PROCESS_PAY_RUN && (
            <>
              {TabsProcessPayRun && (
                <div className="toggle-buttons mt-3">
                  {TabsProcessPayRun.map((tab, index) => (
                    <button
                      key={index}
                      className={`toggle-button ${
                        activePayrollTabButton === tab.tabLabel ||
                        (index === 0 && !activePayrollTabButton)
                          ? "active"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabsProcessPayRun(tab.tabLabel, index);
                      }}
                    >
                      {tab.tabLabel}
                    </button>
                  ))}
                </div>
              )}

              {indexValue === 0 && <PendingLeaveRequest />}
              {indexValue === 1 && <NoAttendance />}
              {indexValue === 2 && <OverTimeAndLop />}
              <PayRunReport />

              <div className="table-container">
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div className="table-approve-button-container">
                    <button
                      type="button"
                      className="table-button table-approve-button"
                      title="singleButton"
                    >
                      Approve & Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* {page === PageLinks.EMPLOYER_PROCESS_PAY_RUN && <>
                        {TabsProcessPayRun && (
                            <div className='toggle-buttons mt-3'>
                                {TabsProcessPayRun.map((tab, index) => (
                                    <button
                                        key={index}
                                        className={`toggle-button ${activeTabButton === tab.tabLabel || (index === 0 && !activeTabButton) ? 'active' : ''}`}
                                        onClick={(e) => { e.preventDefault(); handleTabsProcessPayRun(tab.tabLabel, index); }}
                                    >
                                        {tab.tabLabel}
                                    </button>
                                ))}
                            </div>
                        )}

                        {indexValue === 0 &&
                           <PendingLeaveRequest/>}

                    </>} */}
          {/* {tableDetail !== undefined && (
                        <>

                            <TableMain
                                tableDetail={tableDetail}
                                tableRows={tableRows ? tableRows : []}
                                totalPages={totalPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                pageMappingDetail={pageMappingDetail}
                                setDataID={setDataID}
                                setCopyID={setCopyID}
                                setShowForm={setShowFormDialog}
                                setShowDetail={setShowDetailDialog}
                                deleteTableEntry={deleteEntry}
                                reloadData={() => setReloadData(true)}
                            />

                        </>
                    )} */}

          {pageMappingDetail.tableDetail && tableDetail !== undefined && (
            <>
              <TableMain
              rowPerPage={rowsPerPage}
                handleRowPerPageChange={handleRowPerPageChange}
                tableDetail={tableDetail}
                tableRows={tableRows ? tableRows : []}
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageMappingDetail={pageMappingDetail}
                setDataID={setDataID}
                setCopyID={setCopyID}
                setShowForm={setShowFormDialog}
                setShowDetail={setShowDetailDialog}
                deleteTableEntry={deleteEntry}
                reloadData={() => setReloadData(true)}
                page={page}
                selectedAttendanceIds={setSelectedAttendanceIds}
                resetSelected={resetSelectedState}
                hidePagination={
                  pageMappingDetail.hidePagination === true
                    ? pageMappingDetail.hidePagination
                    : false
                }
              />
            </>
          )}

          {/* {showEmployeeFormDialog === true && pageMappingDetail.addEmployeeForm !== undefined && (
                        React.createElement(
                            pageMappingDetail.addEmployeeForm,
                            {
                                showDialog: showEmployeeFormDialog,
                                closeDialog: () => { setShowEmployeeFormDialog(false) },
                                reloadData: () => setReloadData(true),
                                id: dataID,
                                copyID: copyID
                            }
                        )
                    )} */}

          {showAdditionalFormDialogs.map((formIdx) => {
            if (
              pageMappingDetail.additionalListButtons &&
              pageMappingDetail.additionalListButtons[formIdx].linkedForm
            ) {
              return React.createElement(
                pageMappingDetail.additionalListButtons[formIdx].linkedForm,
                {
                  showDialog: showAdditionalFormDialogs.includes(formIdx),
                  closeDialog: () => {
                    hideAdditionalFormDialogs(formIdx);
                  },
                  reloadData: () => setReloadData(true),
                  id: dataID,
                  copyID: copyID,
                }
              );
            }
          })}

          {showFormDialog === true &&
            pageMappingDetail.form !== undefined &&
            React.createElement(pageMappingDetail.form, {
              showDialog: showFormDialog,
              closeDialog: () => {
                setShowFormDialog(false);
              },
              reloadData: () => setReloadData(true),
              id: dataID,
              copyID: copyID,
            })}
          {showDetailDialog === true &&
            pageMappingDetail.detailView !== undefined &&
            !pageMappingDetail.detailViewIsForm &&
            React.createElement(pageMappingDetail.detailView, {
              showDialog: showDetailDialog,
              closeDialog: () => {
                setShowDetailDialog(false);
              },
              reloadData: () => setReloadData(true),
              id: dataID,
            })}
          {showDetailDialog === true &&
            pageMappingDetail.form !== undefined &&
            pageMappingDetail.detailViewIsForm &&
            React.createElement(pageMappingDetail.form, {
              showDialog: showDetailDialog,
              closeDialog: () => {
                setShowDetailDialog(false);
              },
              reloadData: () => setReloadData(true),
              id: dataID,
              detailView: true,
            })}
        </div>
        <ConfirmDialog
          showConfirm={showDeleteConfirm}
          confirmHeading={"Delete Confirm"}
          confirmMsg={"Are you sure you want to delete the selected entries?"}
          handleNo={() => {
            //setDeleteEntryID('');
            setShowDeleteConfirm(false);
          }}
          handleYes={() => {
            page === PageLinks.EMPLOYER_ATTENDANCE && deleteMultipleEntry();
            setShowDeleteConfirm(false);
            // reloadData()
          }}
        />
      </>
    );
  } else {
    return <div />;
  }
};

export default CommonListing;

// return (
//     <>
//         <div className='toggle-buttons'>
//             <button className={`toggle-button ${activeButton === 'Holiday Types' ? 'active' : ''}`} onClick={() => handleButtonClick('Holiday Types')}>Holiday Types</button>
//             <button className={`toggle-button ${activeButton === 'Holiday Groups' ? 'active' : ''}`} onClick={() => handleButtonClick('Holiday Groups')}>Holiday Groups</button>
//             <button className={`toggle-button ${activeButton === 'Holidays' ? 'active' : ''}`} onClick={() => handleButtonClick('Holidays')}>Holidays</button>
//         </div>
//         <div className='row mt-4 mr-0 ml-0 mb-2 p-2'>
//             <div className='col-6 d-flex justify-content-start p-0'>
//                 <input type="text" className='search-option w-50' placeholder='Search' />
//                 <Icon path={mdiMagnify} size={1} className='search-icon' />
//             </div>
//             <div className='col-6 d-flex justify-content-end p-0'>
//                 <button className='toggle-button active h-100' onClick={() => setShowFormDialog(true)}><i className="mdi mdi-plus"></i> Add Holiday</button>
//             </div>
//         </div>
//         <div className='filter-option d-flex gap-2 pt-2 pb-2'>
//             <button><img src="/assets/svg/filter-circle.svg" alt="circle-icon" className='mr-1 mt-0' height={'14px'} /> Filter By</button>
//             <div> <button className='select' onClick={() => setShowoption(!showOption)}>Leave <i className={`mdi ${showOption ? 'mdi-chevron-up' : 'mdi-chevron-down'}`}></i></button>
//                 {showOption && <div className='option'>
//                     <p className='mb-0 pt-2 pb-2' onClick={() => setShowoption(false)}>Leave Request</p><hr className='mt-1 mb-1' />
//                     <p className='mb-0 pt-2 pb-2' onClick={() => setShowoption(false)}>Leave Balance</p><hr className='mt-1 mb-1' />
//                     <p className='mb-0 pt-2 pb-2' onClick={() => setShowoption(false)}>Leave Credit</p><hr className='mt-1 mb-1' />
//                 </div>}</div>
//         </div>
//         {/* <TableMain /> */}
//         {showFormDialog && (
//             <EmployersStaticFormDialog showDialog={showFormDialog} closeDialog={() => setShowFormDialog(false)} />
//         )}
//     </>
// );
