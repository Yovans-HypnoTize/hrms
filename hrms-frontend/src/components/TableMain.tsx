import React, { useEffect, useState } from "react";
import { TableViewMappings } from "../common/TableViewMappings";
import Pagination from "@mui/material/Pagination";
import { PageMappings } from "../common/PageMappings";
import ConfirmDialog from "./ConfirmDialog";
import { PageLinks, ProjectConfig, StatusValues } from "../common/Constants";
import {
  getFormattedLocalDate,
  getFormattedLocalDateTime,
  getFormattedLocalTime,
  getStringTruncated,
} from "../common/Utilities";
import { ServerAPI } from "../common/ServerAPI";
import toast from "react-hot-toast";
import { useAppStateAPI } from "../common/AppStateAPI";
import ModalDialog from "./ModalDialog";
import MuiAvatar from "./MuiAvatar";
import MuiPaginationSelect from "./MuiPaginationSelect";

interface TableMainProps {
  tableDetail: TableViewMappings.TableDetail;
  tableRows: any[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (number: number) => void;
  pageMappingDetail: PageMappings.PageDetail;
  setDataID: (id: number) => void;
  setCopyID: (id: number) => void;
  setShowForm: (show: boolean) => void;
  setShowDetail: (show: boolean) => void;
  hidePagination?: boolean;
  deleteTableEntry: (params: { [k: string]: any }, id?: number) => void;
  reloadData: () => void;
  page?: string;
  selectedAttendanceIds?: (id: number[]) => void;
  resetSelected: boolean;
  handleRowPerPageChange: (value: string) =>  void;
  rowPerPage:number;
}

const TableMain: React.FC<TableMainProps> = (props) => {
  const {
    tableDetail,
    tableRows,
    totalPages,
    currentPage,
    setCurrentPage,
    pageMappingDetail,
    setShowForm,
    setShowDetail,
    setDataID,
    setCopyID,
    hidePagination,
    deleteTableEntry,
    reloadData,
    page,
    selectedAttendanceIds,
    resetSelected,
    handleRowPerPageChange,
    rowPerPage,
  } = props;

  const [deleteParams, setDeleteParams] = useState<{ [k: string]: any }>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // const [selectAll, setSelectAll] = useState(false);
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();

  const [open, setOpen] = useState<boolean>(false);
  const [viewMoreContent, setViewMoreContent] = useState<string>("");
  const [viewMoreTitle, setViewMoreTitle] = useState<string>("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const visibleRowIds = tableRows.map((row) => row.employee_attendance_id);

  const isAllSelectedOnPage =
    visibleRowIds.length > 0 &&
    visibleRowIds.every((id) => selectedIds.includes(id));

  // const handleSelectAll = () => {
  //   if (!selectAll) {
  //     const allRowIds = tableRows.map((row) => row.employee_attendance_id);
  //     setSelectedIds(allRowIds);
  //   } else {
  //     setSelectedIds([]);
  //   }
  //   setSelectAll((prevState) => !prevState);
  // };

  const handleSelectAll = () => {
    if (!isAllSelectedOnPage) {
      setSelectedIds((prev) =>
        Array.from(new Set([...prev, ...visibleRowIds]))
      );
    } else {
      setSelectedIds((prev) =>
        prev.filter((id) => !visibleRowIds.includes(id))
      );
    }
  };

  const handleApproveDeclineClick = (id: any, value: any) => {
    const data = {
      leave_status: value,
    };
    addProcessingRequests();
    ServerAPI.updateEmployeePendingLeaveRequest(data, id)
      .then((response) => {
        if (response && response["message"]) {
          toast.success(response["message"]);
          reloadData();
        } else if (response && response["message"]) {
          toast.error(response["message"]);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
    console.log("approve pending leave request", data);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handleDeleteEntry = (params: { [k: string]: any }, id?: number) => {
    deleteTableEntry(params, id);
    setShowDeleteConfirm(false);
  };

  const handleDeleteMultiple = () => {
    const data = {
      employee_attendance_id: selectedIds,
    };
    addProcessingRequests();
    ServerAPI.deleteMultipleEntry(data)
      .then((response) => {
        if (response && response["message"]) {
          setSelectedIds([])
          toast.success(response["message"]);
          reloadData();
        } else if (response && response["message"]) {
          toast.error(response["message"]);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  useEffect(() => {
    if (page === PageLinks.EMPLOYER_ATTENDANCE && resetSelected === true) {
      setSelectedIds([]);
      // setSelectAll(false);
    } else if (page !== PageLinks.EMPLOYER_ATTENDANCE) {
      setSelectedIds([]);
      // setSelectAll(false);
    }
  }, [page, resetSelected]);

  useEffect(() => {
    if (selectedAttendanceIds) {
      selectedAttendanceIds(selectedIds);
    }
  }, [selectedIds, selectedAttendanceIds]);

  return (
    <div>
      <div>
        <div className="table-container">
          <div className="table-scroll">
            <div className="table-responsive">
              <table className="table">
                <thead className="color-native-blue">
                  <tr>
                    {page === PageLinks.EMPLOYER_ATTENDANCE && (
                      <th style={{ textAlign: "center", width: "10%" }}>
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={isAllSelectedOnPage}
                        />
                      </th>
                    )}
                    <th style={{ width: "5%" }}>S.no</th>
                    {tableDetail.columns.map((column, index) => {
                      return <th key={index}>{column.label}</th>;
                    })}
                    {tableDetail.actions !== undefined &&
                      tableDetail.actions.length > 0 && (
                        <th scope="col">Action</th>
                      )}
                  </tr>
                </thead>
                {tableRows !== undefined && tableRows.length > 0 ? (
                  <tbody>
                    {tableRows.map((row: any, rowIndex) => {
                      return (
                        <tr key={rowIndex}>
                          {page === PageLinks.EMPLOYER_ATTENDANCE && (
                            <td style={{ textAlign: "center" }}>
                              <input
                                type="checkbox"
                                onChange={() => {
                                  handleCheckboxChange(
                                    row.employee_attendance_id
                                  );
                                }}
                                checked={selectedIds.includes(
                                  row.employee_attendance_id
                                )}
                              />
                            </td>
                          )}
                          <td style={{ width: "5%" }}>
                            {(currentPage - 1) * rowPerPage +
                              rowIndex +
                              1}
                          </td>
                          {tableDetail.columns.map((column, colIndex) => {
                            let currData: any = undefined;
                            let dataKeys = column.data_key.split(".");
                            dataKeys.forEach((key) => {
                              if (!currData && row[key]) {
                                currData = row[key];
                              } else if (currData) {
                                currData = currData[key];
                              }
                            });
                            if (column.type == "image") {
                              return (
                                <td key={rowIndex + "_" + colIndex}>
                                  <img
                                    className="table-image"
                                    src={currData ? currData : ""}
                                    alt="table"
                                  />
                                </td>
                              );
                            } else if (column.type == "avatar") {
                              return (
                                <td key={rowIndex + "_" + colIndex}>
                                  <MuiAvatar data={currData} maxCount={4} />
                                </td>
                              );
                            } else {
                              let cellData: any = currData ? currData : "--";
                              if (column.mappingList) {
                                //const mappedData = TableViewMappings.getMappedData(tableDetail.pageLink, column.data_key, cellData, row);
                                let mappedData = column.mappingList.find(
                                  (item) => {
                                    return item.ID === cellData;
                                  }
                                );
                                cellData = mappedData
                                  ? mappedData.mappingName
                                  : "";
                              }
                              if (column.type == "date") {
                                cellData = getFormattedLocalDate(cellData);
                              } else if (column.type == "datetime") {
                                cellData = getFormattedLocalDateTime(cellData);
                              } else if (column.type == "time") {
                                cellData = getFormattedLocalTime(cellData);
                              }
                              let title = "";
                              return (
                                <td
                                  key={rowIndex + "_" + colIndex}
                                  title={title}
                                  style={
                                    cellData === "Approved" ||
                                    cellData === "Completed"
                                      ? { color: "green" }
                                      : cellData === "Declined" ||
                                        cellData === "Pending"
                                      ? { color: "red" }
                                      : cellData === "On Hold"
                                      ? { color: "#E49B0F" }
                                      : { color: "#000" }
                                  }
                                >
                                  {/* {JSON.stringify(cellData)} */}
                                  {column.type == "number" && cellData}
                                  {column.type != "number" &&
                                    column.type != "custom" && (
                                      <>
                                        {getStringTruncated(cellData)}
                                        {getStringTruncated(cellData).length >
                                        50 ? (
                                          <button
                                            style={{
                                              border: 0,
                                              fontSize: 12,
                                              cursor: "pointer",
                                              backgroundColor: "transparent",
                                              color: "blue",
                                            }}
                                            onClick={() => {
                                              setViewMoreContent(cellData);
                                              setViewMoreTitle(column.label);
                                              handleOpen();
                                            }}
                                          >
                                            {" "}
                                            view more
                                          </button>
                                        ) : null}
                                      </>
                                    )}
                                  {/* {column.type != "number" &&
                                    column.type != "custom" &&
                                    getStringTruncated(cellData)} */}
                                  {column.type == "custom" &&
                                    React.createElement(column.component, {
                                      data: row,
                                      data_key: column.data_key,
                                      customKeys: column.customKeys,
                                      pageMapping: pageMappingDetail,
                                      tableDetail: tableDetail,
                                      reloadData: reloadData,
                                    })}
                                </td>
                              );
                            }
                          })}
                          {tableDetail.actions !== undefined &&
                            tableDetail.actions.length > 0 && (
                              <td className="text-nowrap">
                                {tableDetail.actions.map(
                                  (action, actionIndex) => {
                                    let primaryKeyVal: any = undefined;
                                    let dataKeys =
                                      tableDetail.primary_column.split(".");
                                    dataKeys.forEach((key) => {
                                      if (!primaryKeyVal && row[key]) {
                                        primaryKeyVal = row[key];
                                      } else if (primaryKeyVal) {
                                        primaryKeyVal = primaryKeyVal[key];
                                      }
                                    });
                                    if (
                                      action.type === "edit" &&
                                      (tableDetail.status_column ===
                                        undefined ||
                                        row[tableDetail.status_column] !==
                                          StatusValues.DELETED)
                                    ) {
                                      return (
                                        <button
                                          type="button"
                                          className="btn btn-no-style px-6"
                                          title="Edit"
                                          key={actionIndex}
                                          onClick={() => {
                                            setDataID(primaryKeyVal);
                                            setCopyID(0);
                                            setShowForm(true);
                                          }}
                                        >
                                          <i className="fas fa-edit text-success font-16"></i>
                                        </button>
                                      );
                                    } else if (
                                      action.type ===
                                      "singleButton" /* && (tableDetail.status_column === undefined || (row[tableDetail.status_column] !== StatusValues.DELETED))*/
                                    ) {
                                      return (
                                        <button
                                          type="button"
                                          className="table-button"
                                          title="singleButton"
                                          key={actionIndex}
                                          onClick={() =>
                                            (window.location.href =
                                              action.singleButton.link)
                                          }
                                        >
                                          {action.buttonText_1}
                                        </button>
                                      );
                                    } else if (
                                      action.type ===
                                      "doubleButton" /*&& (tableDetail.status_column === undefined || (row[tableDetail.status_column] !== StatusValues.DELETED))*/
                                    ) {
                                      return (
                                        <div className="double-btn-container">
                                          <button
                                            type="button"
                                            className="table-button-left"
                                            title="doubleButton"
                                            key={actionIndex}
                                          >
                                            {action.buttonText_1}
                                          </button>
                                          <button
                                            type="button"
                                            className="table-button-right"
                                            title="doubleButton"
                                            key={actionIndex}
                                          >
                                            {action.buttonText_2}
                                          </button>
                                        </div>
                                      );
                                    } else if (
                                      action.type === "copy" &&
                                      (tableDetail.status_column ===
                                        undefined ||
                                        row[tableDetail.status_column] !==
                                          StatusValues.DELETED)
                                    ) {
                                      return (
                                        <button
                                          type="button"
                                          className="btn btn-no-style px-6"
                                          title="Copy"
                                          key={actionIndex}
                                          onClick={() => {
                                            setCopyID(primaryKeyVal);
                                            setDataID(0);
                                            setShowForm(true);
                                          }}
                                        >
                                          <i className="fas fa-copy text-info font-16"></i>
                                        </button>
                                      );
                                    } else if (
                                      action.type === "delete" &&
                                      (tableDetail.status_column ===
                                        undefined ||
                                        row[tableDetail.status_column] !==
                                          StatusValues.DELETED)
                                    ) {
                                      return (
                                        <button
                                          type="button"
                                          className="btn btn-no-style px-6"
                                          title="Delete"
                                          key={actionIndex}
                                          onClick={() => {
                                            //setDeleteEntryID(primaryKeyVal);
                                            let delParams: {
                                              [k: string]: any;
                                            } = {};
                                            if (action.params !== undefined) {
                                              action.params.forEach((param) => {
                                                let delParamKeyVal: any =
                                                  undefined;
                                                let dataKeys =
                                                  param.param_key.split(".");
                                                dataKeys.forEach((key) => {
                                                  if (
                                                    !delParamKeyVal &&
                                                    row[key]
                                                  ) {
                                                    delParamKeyVal = row[key];
                                                  } else if (delParamKeyVal) {
                                                    delParamKeyVal =
                                                      delParamKeyVal[key];
                                                  }
                                                  console.log(
                                                    "Del Param",
                                                    key,
                                                    delParamKeyVal
                                                  );
                                                });
                                                // delParams[param.param_key] =
                                                //   delParamKeyVal;
                                                delParams["id"] =
                                                  delParamKeyVal;
                                                delParams["paramKey"] =
                                                  param.param_key;
                                              });
                                            }
                                            setDeleteParams(delParams);
                                            setShowDeleteConfirm(true);
                                          }}
                                        >
                                          <i
                                            className="fas fa-trash-alt text-danger font-16"
                                            aria-hidden="true"
                                          ></i>
                                        </button>
                                      );
                                    } else if (action.type === "view") {
                                      return (
                                        <button
                                          type="button"
                                          className="btn btn-no-style px-6"
                                          title="View Detail"
                                          key={actionIndex}
                                          onClick={() => {
                                            setDataID(primaryKeyVal);
                                            setShowDetail(true);
                                          }}
                                        >
                                          <i
                                            className="fas fa-eye font-16"
                                            aria-hidden="true"
                                          ></i>
                                        </button>
                                      );
                                    } else if (
                                      action.type === "approveOrReject"
                                    ) {
                                      return (
                                        <>
                                          <button
                                            type="button"
                                            className=" approve-button px-6 mr-2"
                                            title="Approve"
                                            key={actionIndex}
                                            onClick={() => {
                                              const id = row.leave_request_id;
                                              handleApproveDeclineClick(
                                                id,
                                                "Approved"
                                              );
                                            }}
                                          >
                                            Approve
                                          </button>
                                          <button
                                            type="button"
                                            className=" decline-button px-6"
                                            title="Decline"
                                            key={actionIndex}
                                            onClick={() => {
                                              const id = row.leave_request_id;
                                              handleApproveDeclineClick(
                                                id,
                                                "Declined"
                                              );
                                            }}
                                          >
                                            Decline
                                          </button>
                                        </>
                                      );
                                    } else if (action.type === "custom") {
                                      return React.createElement(
                                        action.component,
                                        {
                                          data: row,
                                          params: action.params,
                                          pageMapping: pageMappingDetail,
                                          tableDetail: tableDetail,
                                          reloadData: reloadData,
                                          key: actionIndex,
                                        }
                                      );
                                    }
                                  }
                                )}
                              </td>
                            )}
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={tableDetail.columns.length + 2}>
                        No Data Available
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
              <ConfirmDialog
                showConfirm={showDeleteConfirm}
                confirmHeading={"Delete Confirm"}
                confirmMsg={"Are you sure you want to delete this entry?"}
                handleNo={() => {
                  //setDeleteEntryID('');
                  setDeleteParams({});
                  setShowDeleteConfirm(false);
                }}
                handleYes={() => {
                  handleDeleteEntry(
                    deleteParams,
                    deleteParams[tableDetail.primary_column]
                  );
                  // reloadData()
                }}
              />
              <ModalDialog
                open={open}
                title={viewMoreTitle}
                content={viewMoreContent}
                handleClose={handleClose}
                actionButtons={
                  <>
                    <button
                      className="view-modal-button"
                      onClick={() => {
                        handleClose();
                      }}
                    >
                      Close
                    </button>
                  </>
                }
              />
              <div className="col-12 mt-24 hljs-container">
                <pre>
                  <code
                    className="html"
                    data-component="table"
                    data-code="responsive"
                  ></code>
                </pre>
              </div>
            </div>
          </div>
        </div>
        <div style={{ float: "right" }}>
          {pageMappingDetail.approveAndNext && (
            <div className="table-approve-button-container">
              <button
                type="button"
                className="table-button table-approve-button"
                title="singleButton"
              >
                approve & next
              </button>
            </div>
          )}

          {!hidePagination && (
            <div className="d-flex">
              {page === PageLinks.EMPLOYER_ATTENDANCE &&
                selectedIds.length > 0 && (
                  <button
                    className="delete-all-btn"
                    onClick={handleDeleteMultiple}
                  >
                    Delete Selected Record(s)
                  </button>
                )}
                <div>
                  Rows Per Page: 
                  <MuiPaginationSelect handleRowPerPageChange={handleRowPerPageChange} setCurrentPage={setCurrentPage} key={page}/>
                </div>
              <Pagination
                count={totalPages}
                onChange={handlePagination}
                page={currentPage}
                variant="outlined"
                color="primary"
                shape="rounded"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableMain;
