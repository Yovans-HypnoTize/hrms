import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import TableMain from "../components/TableMain";
import { ServerAPI } from "../common/ServerAPI";
import { useAppStateAPI } from "../common/AppStateAPI";
import dayjs, { Dayjs } from "dayjs";
import { PageMappings } from "../common/PageMappings";
import {
  DateFilterType,
  Endpoints,
  PageLinks,
  ProjectConfig,
  StatusValues,
} from "../common/Constants";
import { DatePicker } from "antd";
import { RiCalendarLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { TableViewMappings } from "../common/TableViewMappings";
import { useHistory } from "react-router";
import { APIData, FormDataTypes } from "../common/DataTypes";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Select from "react-select";
import AttendanceEditEntryDialog from "../forms/AttendanceEditEntryDialog";
import ConfirmDialog from "../components/ConfirmDialog";

const { RangePicker } = DatePicker;

const TabsProcessPayRun = [
  { tabLabel: "pending leave request" },
  { tabLabel: "No attendance" },
  { tabLabel: "over time & LOP" },
];

const CommonListing: React.FC<{ page: string }> = ({ page }) => {
  console.log(page, " page");
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
  const history = useHistory();
  const [activeTabButton, setActiveTabButton] = useState("");
  const [activePayrollTabButton, setActivePayrollTabButton] = useState(
    TabsProcessPayRun[0].tabLabel
  );
  const [indexValue, setIndexValue] = useState(0);
  const [updateStatus, setUpdateStatus] = useState("");
  const [leaveTypeList, setLeaveTypeList] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [seletedLeaveType, setSelectedLeaveType] = useState("");
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: "2px solid #D3D3D3",
      "&:hover": { borderColor: "#0E7AD5" },
      borderRadius: "10px",
    }),
  };
  const statusOptions: FormDataTypes.SelectOption[] = [
    { label: "Rejected", value: StatusValues.Rejected + "" },
    { label: "Approved", value: StatusValues.Approved + "" },
    { label: "Pending", value: StatusValues.Pending + "" },
  ];
  const [seletedStatus, setSelectedStatus] = useState("");
  const [attendanceEdit, setAttendanceEdit] = useState(false);
  const [selectedAttendanceIds, setSelectedAttendanceIds] = useState<number[]>(
    []
  );
  const [resetSelectedState, setResetSelectedState] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  const handleStatusChange = (
    selectedOption: FormDataTypes.SelectOption | null
  ) => {
    setSelectedStatus(selectedOption?.value || "");
  };

  console.log(page, "page");
  const handleTabClick = (value: string) => {
    setActiveTabButton(value);
  };

  const handleLeaveTypeChange = (
    selectedOption: FormDataTypes.SelectOption | null
  ) => {
    setSelectedLeaveType(selectedOption?.value || "");
  };

  const handleTabsProcessPayRun = (value: string, index: number) => {
    setActivePayrollTabButton(value);
    setIndexValue(index);
  };

  const frameAPIParams = (pagination?: boolean) => {
    let params: { [k: string]: any } = {};
    if (pageMappingDetail) {
      if (!pageMappingDetail.noPagination) {
        if(reloadData){
          params["page_number"] = 1;
        } else {
          params["page_number"] = pagination ? currentPage : 1;
        }
        params["page_size"] = pagination ? ProjectConfig.EntriesPerPage : 10;
      }
      //params['status'] = '1';
      if (dateRangeSet) {
        if (
          page === PageLinks.LEAVE_REQUEST ||
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
      if (seletedStatus !== "") {
        params["approval_status"] = parseInt(seletedStatus);
      }
      if (seletedLeaveType !== "") {
        params["leave_type"] = parseInt(seletedLeaveType);
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

  // const loadTableData = () => {
  //   if (pageMappingDetail) {
  //     setPageInitialized(true);
  //     const params = frameAPIParams(true);
  //     if (
  //       pageMappingDetail.additionalFilter !== undefined &&
  //       selectedAdditionalFilter
  //     ) {
  //       params[pageMappingDetail.additionalFilter.paramName] =
  //         selectedAdditionalFilter;
  //     }
  //     addProcessingRequests();
  //     ServerAPI.executeAPI(
  //       pageMappingDetail.listEndpoint,
  //       ServerAPI.APIMethod.GET,
  //       true,
  //       null,
  //       params
  //     )
  //       .then((response) => {
  //         if (response !== undefined) {
  //           if (
  //             pageMappingDetail.listResponseParam !== undefined &&
  //             response[pageMappingDetail.listResponseParam] !== undefined
  //           ) {
  //             console.log("Here is a check", response[pageMappingDetail.listResponseParam])
  //             setTableRows(response[pageMappingDetail.listResponseParam]);
  //           } else if (
  //             response.data !== undefined &&
  //             Array.isArray(response.data)
  //           ) {
  //             setTableRows(response.data);
  //           } else if (response !== undefined) {
  //             setTableRows([response]);
  //           } else if (
  //             response["status"] === false &&
  //             response["message"] !== undefined
  //           ) {
  //             setTableRows([]);
  //             toast.error(response["message"]);
  //           } else {
  //             setTableRows([]);
  //             // toast.error("Something Went Wrong " + pageMappingDetail.listEndpoint);
  //           }
  //           if (response["total_pages"] !== undefined) {
  //             setTotalPages(response["total_pages"]);
  //           }
  //         } else {
  //           setTableRows([]);
  //           toast.error("Something Went Wrong");
  //         }
  //       })
  //       .finally(() => {
  //         reduceProcessingRequests();
  //       });
  //   } else {
  //     setTableRows([]);
  //   }
  // };

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
              setTableRows(response.data[key[0]]);
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

  useEffect(() => {
    console.log(tableRows, "current table");
  }, [tableRows]);

  const approveSubordinateAttendance = () => {
    setResetSelectedState(false);
    const approvalValues = selectedAttendanceIds.map((attId) => ({
      attendance_id: attId,
      approval_status: updateStatus ? updateStatus : 0,
    }));
    addProcessingRequests();
    ServerAPI.updateSubordinateAttendance(approvalValues)
      .then((response) => {
        if (response !== undefined && response.message) {
          toast.success(response.message);
          setReloadData(true);
          setResetSelectedState(true);
        } else {
          toast.error(response.message);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
        setSelectedAttendanceIds([]);
      });
  };

  const deleteEntry = (params: { [k: string]: any }, id?: number) => {
    if (pageMappingDetail && pageMappingDetail.deleteEndpoint) {
      //let params: { [k: string]: any } = {};
      addProcessingRequests();
      ServerAPI.executeAPI(
        `${pageMappingDetail.deleteEndpoint}/${id}`,
        ServerAPI.APIMethod.DELETE,
        true,
        null
      )
        .then((response) => {
          if (response !== undefined && response.message) {
            toast.success(response.message);
            setReloadData(true);
          } else {
            alert("Something Went Wrong");
          }
        })
        .finally(() => {
          reduceProcessingRequests();
        });
    }
  };

  // const getLeaveType = () => {
  //   addProcessingRequests();
  //   ServerAPI.executeAPI(
  //     Endpoints.EMPLOYEE_LEAVE_TYPES,
  //     ServerAPI.APIMethod.GET,
  //     true,
  //     null
  //   )
  //     .then((response) => {
  //       if (response.data) {
  //         const leaveType = response.data.map((leave: any) => ({
  //           label: leave.leave_type_name,
  //           value: leave.leave_type_id,
  //         }));
  //         setLeaveTypeList(leaveType);
  //       }
  //     })
  //     .finally(() => {
  //       reduceProcessingRequests();
  //     });
  // };

  // useEffect(() => {
  //   getLeaveType();
  // }, []);

  useEffect(() => {
    const pageDetail = PageMappings.getPageDetail(page);
    setReloadData(false);
    if (pageDetail) {
      setPageInitialized(false);
      setTableDetail(TableViewMappings.getPageTableDetail(pageDetail.pageLink));
      setPageMappingDetail(pageDetail);
      setSearchString("");
      setSelectedLeaveType("");
      setSelectedStatus("");
      setCurrentPage(1);
      setTableRows([]);
      setTotalPages(1);
      setTimeout(() => setReloadData(true), 100);
    }
    setActiveTabButton(page);
  }, [page]);

  useEffect(() => {
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
  }, [currentPage, seletedStatus, seletedLeaveType]);

  useEffect(() => {
    if (dateRangeFrom && dateRangeTo) {
      setDayJSRange([dayjs(dateRangeFrom), dayjs(dateRangeTo)]);
    }
  }, [dateRangeFrom, dateRangeTo]);

  const handleRangeChange = (value: any) => {
    event?.stopPropagation();
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

  const clearDateRange = () => {
    setDateRangeFrom("");
    setDateRangeTo("");
    setReloadData(true);
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
        <div className="card-body-inner d-flex flex-column">
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
          <div className="row mr-0 ml-0 mb-2 py-2 pl-0 d-flex align-items-center w-100 mt-2 date-add">
            <div className="col-6 pl-0">
              <div className="p-0">
                <h4 className="header-title mt-0 mb-0">
                  {pageMappingDetail.title}
                </h4>
              </div>
            </div>
            {(pageMappingDetail.componentSubText ||
              pageMappingDetail.dateFilterType ||
              pageMappingDetail.addAvailable ||
              pageMappingDetail.attendanceEdit ||
              pageMappingDetail.approveSubordinates) && (
              <>
                <div className="col-6 px-2 d-flex justify-content-end p-0">
                  {pageMappingDetail.dateFilterType &&
                    pageMappingDetail.dateFilterType ===
                      DateFilterType.RangePicker && (
                      <>
                        <RangePicker
                          style={{
                            height: "100%",
                            width: "80%",
                            marginRight: 3,
                          }}
                          popupStyle={{
                            width: "300px",
                          }}
                          value={
                            dateRangeSet
                              ? (dayJSRange as [Dayjs, Dayjs])
                              : undefined
                          }
                          onChange={handleRangeChange}
                          allowClear={
                            pageMappingDetail.dateFilterRequired ? false : true
                          }
                          suffixIcon={
                            <RiCalendarLine className="remix-icon hp-text-color-black-100" />
                          }
                          defaultValue={
                            pageMappingDetail.dateFilterRequired
                              ? [dayjs().startOf("month"), dayjs()]
                              : undefined
                          }
                        />

                        {dateRangeSet && (
                          <div
                            style={{ cursor: "pointer",display:"flex",alignItems:'center',marginRight: 8 }}
                            onClick={() => {
                              setDateRangeSet(false);
                              clearDateRange();
                              setReloadData(true);
                            }}
                          >
                            <CloseOutlinedIcon />
                          </div>
                        )} 
                      </>
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
                  {pageMappingDetail.addAvailable && (
                    <button
                      className="toggle-button active h-100 "
                      style={{ minHeight: "44px", minWidth: "70px" }}
                      onClick={() => {
                        setShowFormDialog(true);
                        setDataID(0);
                        setCopyID(0);
                      }}
                    >
                      {" "}
                      <img
                        src="/assets/svg/add-btn.svg"
                        alt=""
                        style={{ marginTop: "-3px" }}
                      />{" "}
                      Add {pageMappingDetail.titleSingular}
                    </button>
                  )}
                  {pageMappingDetail.attendanceEdit && (
                    <button
                      className="toggle-button active h-100 ml-2"
                      style={{ minHeight: "50px", minWidth: "190px" }}
                      onClick={() => setAttendanceEdit(true)}
                    >
                      Update Attendance &nbsp;{" "}
                      <i
                        className="fas fa-edit font-15"
                        aria-hidden="true"
                        style={{ color: "#fff", fontWeight: "500" }}
                      ></i>
                    </button>
                  )}
                  {pageMappingDetail.approveSubordinates && (
                    <button
                      className="toggle-button h-100 ml-2"
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
                      onClick={() => {
                        setShowUpdateConfirm(true);
                        setUpdateStatus(StatusValues.Rejected + "");
                      }}
                      disabled={
                        selectedAttendanceIds.length === 0 ? true : false
                      }
                    >
                      Reject Selected&nbsp;{" "}
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
                  )}

                  {pageMappingDetail.approveSubordinates && (
                    <button
                      className="toggle-button h-100 ml-2"
                      style={
                        selectedAttendanceIds.length > 0
                          ? {
                              minHeight: "50px",
                              minWidth: "93px",
                              backgroundColor: "#008000",
                              color: "white",
                            }
                          : {
                              minHeight: "50px",
                              minWidth: "93px",
                              backgroundColor: "#F2F2F2",
                              color: "#cdcccd",
                            }
                      }
                      onClick={() => {
                        setShowUpdateConfirm(true);
                        setUpdateStatus(StatusValues.Approved + "");
                      }}
                      disabled={
                        selectedAttendanceIds.length === 0 ? true : false
                      }
                    >
                      Approve Selected&nbsp;{" "}
                      <i
                        className="fa-solid fa-check"
                        aria-hidden="true"
                        style={
                          selectedAttendanceIds.length > 0
                            ? { color: "#fff" }
                            : { color: "#008000" }
                        }
                      ></i>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

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
                    history.push(tab.tabLink);
                  }}
                >
                  {tab.tabLabel}
                </button>
              ))}
            </div>
          )}

          {(pageMappingDetail.searchBox ||
            pageMappingDetail.exportDataBtn ||
            pageMappingDetail.uploadEmployeeDataBtn ||
            pageMappingDetail.additionalListButtons ||
            pageMappingDetail.additionalFilterSelect) && (
            <div
              className="row mt-1 mr-0 ml-0 mb-2 py-2 w-100 pl-0 "
              style={{ height: "auto" }}
            >
              <div
                className="col-12 d-flex justify-content-sart p-0 employee-btn flex-wrap"
                style={{ minHeight: "50px", minWidth: "93px" }}
              >
                {pageMappingDetail.searchBox && (
                  <div
                    className="d-flex justify-content-start p-0"
                    style={{ gap: "10px", width: "250px" }}
                  >
                    <>
                      {" "}
                      <input
                        type="text"
                        className="search-option w-100"
                        placeholder="Search By Keywords"
                        value={searchString}
                        onChange={(e: any) => {
                          if (searchTimeout) clearTimeout(searchTimeout);
                          setSearchString(e.target.value);
                        }}
                      />
                      <Icon
                        path={mdiMagnify}
                        size={1}
                        className="search-icon"
                      />
                    </>
                  </div>
                )}
                {pageMappingDetail.additionalFilterSelect && (
                  <div className="p-0 d-flex align-items-center flex-row gap-2">
                    <div className="additional-filter">
                      <div className="mb-24">
                        <Select
                          styles={customStyles}
                          onChange={handleLeaveTypeChange}
                          value={
                            leaveTypeList.find(
                              (option) => option.value === seletedLeaveType
                            ) || null
                          }
                          options={leaveTypeList}
                          className="basic-multi-select"
                          placeholder={"Filter Leave Type"}
                        />
                      </div>
                    </div>
                    {pageMappingDetail.additionalFilterSelect &&
                      seletedLeaveType != "" && (
                        <div
                          style={{ cursor: "pointer" }}
                          className="ml-2"
                          onClick={() => {
                            setSelectedLeaveType("");
                            setReloadData(true);
                          }}
                        >
                          <CloseOutlinedIcon />
                        </div>
                      )}
                  </div>
                )}
                {pageMappingDetail.statusFilter && (
                  <div className="p-0 d-flex align-items-center flex-row gap-2">
                    <div className="additional-filter">
                      <div className="mb-24">
                        <Select
                          styles={customStyles}
                          onChange={handleStatusChange}
                          value={
                            statusOptions.find(
                              (option) => option.value === seletedStatus
                            ) || null
                          }
                          options={statusOptions}
                          className="basic-multi-select"
                          placeholder={"Filter Status"}
                        />
                      </div>
                    </div>
                    {pageMappingDetail.statusFilter && seletedStatus != "" && (
                      <div
                        style={{ cursor: "pointer" }}
                        className="ml-2"
                        onClick={() => {
                          setSelectedStatus("");
                          setReloadData(true);
                        }}
                      >
                        <CloseOutlinedIcon />
                      </div>
                    )}
                  </div>
                )}

                {!!pageMappingDetail.additionalListButtons &&
                  pageMappingDetail.additionalListButtons.map(
                    (addlBtn, btnIdx) => {
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
                                  alt=""
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
                                  alt=""
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
            </div>
          )}

          {pageMappingDetail.tableDetail && tableDetail !== undefined && (
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
                page={page}
                selectedAttendanceIds={setSelectedAttendanceIds}
                resetSelected={resetSelectedState}
              />
            </>
          )}

          {attendanceEdit && (
            <AttendanceEditEntryDialog
              showDialog={attendanceEdit}
              closeDialog={() => setAttendanceEdit(false)}
              reloadData={() => setReloadData(true)}
            />
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
          <ConfirmDialog
            showConfirm={showUpdateConfirm}
            confirmHeading={"Approve Confirm"}
            confirmMsg={
              "Are you sure you want to approve the selected entries?"
            }
            handleNo={() => {
              //setDeleteEntryID('');
              setShowUpdateConfirm(false);
              setSelectedAttendanceIds([]);
              setUpdateStatus("");
            }}
            handleYes={() => {
              page === PageLinks.SUBORDINATE_PENDING_ATTENDANCE &&
                approveSubordinateAttendance();
              setShowUpdateConfirm(false);
              // reloadData()
            }}
          />
        </div>
      </>
    );
  } else {
    return <div></div>;
  }
};

export default CommonListing;
