import React, { useEffect, useRef, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
// import dayjs, { Dayjs } from "dayjs";
import { APIData, FormDataTypes } from "../common/DataTypes";
import { useAppStateAPI } from "../common/AppStateAPI";
import { ServerAPI } from "../common/ServerAPI";
import Pagination from "@mui/material/Pagination";
import toast from "react-hot-toast";
import {
  API,
  Endpoints,
  ProjectConfig,
  //   PageLinks,
  //   PayrollStatus,
  // ProjectStrings,
} from "../common/Constants";
// import { useNavigate } from "react-router";
import {
  getDataFromAPI,
  //   getFormattedLocalDate,
  //   getObjectKeyByValue,
} from "../common/Utilities";
import PayrollComponentValueEntryDialog from "../forms/PayrollComponentValueEntryDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import { Formik } from "formik";
import { InitialData } from "../forms/InitialData";
import FormField from "../components/form-items/FormField";
import * as Yup from "yup";
import MuiPaginationSelect from "../components/MuiPaginationSelect";
import SearchInputContainer from "../components/SearchInputContainer";

const PagePayrollList: React.FC = () => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  //   const [payrollGroups, setPayrollGroups] = useState<APIData.PayrollGroup[]>(
  //     []
  //   );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPayrollGroupID, setSelectedPayrollGroupID] = useState("");
  const [payrollMonth, setPayrollMonth] = useState(dayjs().format("YYYY-MM"));
  const [searchValue, setSearchValue] = useState<string>("");
  const [payrollMonthFilter, setPayrollMonthFilter] = useState(
    dayjs().format("YYYY-MM")
  );
  //   const [monthPayroll, setMonthPayroll] = useState<APIData.MonthPayroll | null>(
  //     null
  //   );
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // const [deletePayrollID, setDeletePayrollID] = useState(0);
  const customTableViewRef = useRef<HTMLDivElement | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [manualEntryPayrollID, setManualEntryPayrollID] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [manualEntryStartDate, setManualEntryStartDate] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [payrollIDDel, setPayrollIDDel] = useState(0);
  const [payrollList, setPayrollList] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [initialValue, setInitialValue] = useState<APIData.PayrollGenerator>(
    InitialData.PayrollGenerator
  );
  const [companyOption, setCompanyOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<any>();
  const [rowsPerPage, setRowsPerPage] = useState(ProjectConfig.EntriesPerPage);
  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        customTableViewRef.current &&
        !customTableViewRef.current.contains(event.target as Node)
      ) {
        setShowManualEntry(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // getPayslipDetail

  //   const navigate = useNavigate();

  // const fetchPayrollGroups = () => {
  // addProcessingRequests();
  // ServerAPI.getPayrollGroups().then((response: any) => {
  //     if (response) {
  //         const payrollGps: APIData.PayrollGroup[] = response.payroll_groups;
  //         if (payrollGps.length > 0) {
  //             setPayrollGroups(payrollGps);
  //             // setSelectedPayrollGroupID(payrollGps[0].payroll_group_id + '');
  //         } else {
  //             setPayrollGroups([]);
  //         }
  //     }
  // }).finally(() => {
  //     reduceProcessingRequests();
  // });
  // };

  const handleMonthChange = (value: any) => {
    if (value) {
      setPayrollMonth(dayjs(value).format("YYYY-MM"));
    } else {
      setPayrollMonth("");
    }
  };
  // const handleMonthChangeFilter = (value: any) => {
  //   if (value) {
  //     setPayrollMonthFilter(dayjs(value).format("YYYY-MM"));
  //     // fetchPayrollListFilter(payrollMonthFilter)
  //   } else {
  //     setPayrollMonthFilter("");
  //   }
  // };

  useEffect(() => {
    fetchPayrollListFilter(payrollMonth);
  }, [payrollMonth]);

  const fetchPayrollListFilter = (value: any) => {
    addProcessingRequests();
    const params = {
      page_size: rowsPerPage,
      page_number: currentPage,
      payroll_month: value,
      search:searchValue
    };
    ServerAPI.getMonthlyPayrollList(params)
      .then((response) => {
        if (response) {
          const paginationData = response.data.pagination;
          setTotalPages(paginationData.total_pages);
          setCurrentPage(paginationData.page_number);
          console.log(response.data.pagination);
          setPayrollList(response.data.employee_payroll);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  useEffect(() => {
    getDataFromAPI(
      API.EndPoint.CLIENT_COMPANY_LIST,
      setCompanyOption,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "company_id",
      "company_name",
      "data",
      "companies"
    );
  }, []);

  // useEffect(() => {
  //   console.log("fetch payroll list", payrollList);
  // }, [payrollList]);

  const fetchPayrollList = () => {
    addProcessingRequests();
    const params = {
      page_size: rowsPerPage,
      page_number: currentPage,
      payroll_month: payrollMonth,
      search:searchValue
    };
    ServerAPI.getMonthlyPayrollList(params)
      .then((response) => {
        if (response) {
          const paginationData = response.data.pagination;
          setTotalPages(paginationData.total_pages);
          setCurrentPage(paginationData.page_number);
          console.log(response.data.pagination);
          setPayrollList(response.data.employee_payroll);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  //   const createPayRun = (payrollPeriod: string, startDate: string) => {
  // addProcessingRequests();
  // ServerAPI.createMonthlyPayRun({ payroll_group_id: parseInt(selectedPayrollGroupID), pay_run_month: payrollPeriod, start_date: startDate }).then((response: any) => {
  //     if (response) {
  //         toast.success(response.message);
  //         fetchPayrollList();
  //     }
  // }).finally(() => {
  //     reduceProcessingRequests();
  // });
  //   };

  //   const regeneratePayRun = (
  //     payrollPeriod: string,
  //     startDate: string,
  //     payrollId: number
  //   ) => {
  // addProcessingRequests();
  // ServerAPI.regeneratePayrun({ payroll_group_id: parseInt(selectedPayrollGroupID), payroll_id: payrollId, pay_run_month: payrollPeriod, start_date: startDate }).then((response: any) => {
  //     if (response) {
  //         toast.success(response.message);
  //         fetchPayrollList();
  //     }
  // }).finally(() => {
  //     reduceProcessingRequests();
  // });
  //   };

  const deletePayroll = (id: number) => {
    //let params: { [k: string]: any } = {};
    addProcessingRequests();
    ServerAPI.executeAPI(
      `${Endpoints.MONTH_PAYROLLS}/${id}`,
      ServerAPI.APIMethod.DELETE,
      true,
      null
    )
      .then((response) => {
        if (response !== undefined && response.message) {
          toast.success(response.message);
          fetchPayrollList();
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  const handleDeleteEntry = (item: any) => {
    setDataToDelete(item);
    setShowDeleteConfirm(true);
  };

  const handlePayrollDelete = (item: any) => {
    console.log("get Item from handledeleteentry", item);
    const params = {
      id: item.payroll_id,
      paramKey: "payroll_id",
    };
    addProcessingRequests();
    ServerAPI.executeAPI(
      `${API.EndPoint.CLIENT_PAYROLL_LIST}?${params.paramKey}=${params.id}`,
      ServerAPI.APIMethod.DELETE,
      true
      // null
    )
      .then((response) => {
        if (response !== undefined && response.message) {
          toast.success(response.message);
          fetchPayrollList();
          setShowDeleteConfirm(false);
        }
      })
      .finally(() => {
        setShowDeleteConfirm(false);
        reduceProcessingRequests();
      });
  };

  const handlePayrollDownload = (item: any) => {
    addProcessingRequests();
    ServerAPI.getPayslipDetail(item.payroll_id)
      .then((response) => {
        if (response) {
          if (response && response.payslip_filepath) {
            // const link = document.createElement('a');
            // link.href = response.payslip_filepath;
            // link.setAttribute('download',"payslip.pdf")
            // document.body.appendChild(link)
            // link.click();
            // document.body.removeChild(link)
            window.open(response.payslip_filepath, "_blank");
          } else {
            console.error("Payslip file path is missing.");
          }
          console.log("leave request", response);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };
  //   const regeneratePayslip = (id: number) => {
  //     addProcessingRequests();
  //     ServerAPI.executeAPI(
  //       `${Endpoints.PAYSLIP_REGENERATE}/${id}`,
  //       ServerAPI.APIMethod.GET,
  //       true,
  //       null
  //     )
  //       .then((response) => {
  //         if (response !== undefined && response.message) {
  //           toast.success(response.message);
  //           fetchPayrollList();
  //         }
  //       })
  //       .finally(() => {
  //         reduceProcessingRequests();
  //       });
  //   };

  useEffect(() => {
    // fetchPayrollGroups();
    fetchPayrollList();
  }, [currentPage, rowsPerPage,searchValue]);

  const handleRowPerPageChange = (value: any) => {
    setRowsPerPage(value);
  };

  // useEffect(() => {
  //     console.log(payrollMonth, selectedPayrollGroupID);
  //     if (payrollMonth && selectedPayrollGroupID) {
  //         fetchPayrollList();
  //     }
  // }, [payrollMonth, selectedPayrollGroupID]);

  // const yupSchema = Yup.object().shape({
  // company_id: Yup.number()
  //   .notOneOf([0], ProjectStrings.ValidationSelect)
  //   .required(ProjectStrings.ValidationRequired),
  // payroll_month: Yup.string().required(ProjectStrings.ValidationRequired),
  // });

  //   const formatMonthYear = (dateStr: string): string => {
  //     // Create a Date object from the date string
  //     const date = new Date(dateStr);

  //     // Use toLocaleDateString to format the month and year
  //     return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  //   };
  
  const sendToBackend = (value: any) => {
    setSearchValue(value)
  };

  return (
    <>
      <div className="card-body-inner pr-0 d-flex flex-column">
        <div className="col-6 p-0">
          <h4 className="header-title mt-0 mb-0">Payroll</h4>
        </div>

        {/* <div className='col-6 p-0 mt-4'>
                    <div className="additional-filter">
                        <>
                            <p className='additional-option-title mb-1'>Select Payroll Group</p>
                            <select value={selectedPayrollGroupID} className="form-control" onChange={e => setSelectedPayrollGroupID(e.target.value)}>
                                {payrollGroups.map((group, index) => (<option value={group.payroll_group_id} key={index}>{group.payroll_group_name}</option>))}
                            </select>
                        </>
                    </div>
                </div> */}

        {/* <div className='row mr-0 ml-0 mb-2 py-2 pl-0 w-100 mt-2 payroll-resp'>
                    <div className='col-6 pl-0'>
                        <p className='additional-option-title mb-1'>Process Pay Run {payrollMonth ? 'for ' + formatMonthYear(payrollMonth) : ''}</p>
                    </div>
                    <div className='col-6 d-flex justify-content-end p-0 end'>
                        <DatePicker
                            value={payrollMonth ? dayjs(payrollMonth, 'YYYY-MM') : undefined}
                            onChange={handleMonthChange}
                            allowClear={false}
                            defaultValue={dayjs(dayjs().format('YYYY/MM'), 'YYYY/MM')}
                            format={'YYYY/MM'}
                            picker="month" />
                    </div>
                </div> */}

        <div className="row mr-0 ml-0 mb-2 py-2 pl-0 w-100 mt-2 payroll-resp">
          <div className="col-12 col-md-4 pl-0">
            <SearchInputContainer triggerAPICall={sendToBackend}/>
          </div>
          <div className="col-12 col-md-8 d-flex justify-content-end p-0 mt-4 mt-md-0">
            <Formik
              initialValues={initialValue}
              onSubmit={(values, { setSubmitting }) => {
                let submitValues = { ...values };

                submitValues["payroll_month"] = payrollMonth;

                addProcessingRequests();
                // submitValues["company_id"] = getLoginCompanyID();
                ServerAPI.generatePayroll(submitValues)
                  .then((response) => {
                    if (response && response["message"]) {
                      fetchPayrollList();
                      toast.success(response["message"]);
                    } else if (response && response["message"]) {
                      toast.error(response["message"]);
                    }
                  })
                  .finally(() => {
                    setSubmitting(false);
                    reduceProcessingRequests();
                  });
              }}
              // validationSchema={yupSchema}
            >
              {(formikProps) => {
                return (
                  <div className="d-flex px-2">
                    <div className="px-2 text-field-empty-custom-user">
                      <FormField
                        formik={formikProps}
                        fieldProps={{
                          fieldType: "select",
                          label: "Company Name",
                          name: "company_id",
                          placeholder: "Select Company Name",
                          options: companyOption,
                          required: true,
                        }}
                      />
                    </div>
                    <div className="px-2">
                      {/* <FormField
                        formik={formikProps}
                        fieldProps={{
                          fieldType: "datepicker",
                          label: "Payroll Date",
                          name: "payroll_month",
                          placeholder: "Select Date",
                          required: true,
                          allowFutureDate: true,
                        }}
                      /> */}
                      <DatePicker
                        value={
                          payrollMonth
                            ? dayjs(payrollMonth, "YYYY-MM")
                            : undefined
                        }
                        onChange={handleMonthChange}
                        allowClear={false}
                        defaultValue={dayjs(
                          dayjs().format("YYYY/MM"),
                          "YYYY/MM"
                        )}
                        format={"YYYY/MM"}
                        picker="month"
                      />
                    </div>
                    <div className="px-2">
                      <button
                        type="button"
                        className="generate-btn"
                        disabled={formikProps.isSubmitting}
                        onClick={() => {
                          if (formikProps.values["company_id"] === 0) {
                            toast.error(
                              "Please select company to generate payroll"
                            );
                          } else {
                            formikProps.submitForm();
                          }
                        }}
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                );
              }}
            </Formik>

            {/* <DatePicker
                            value={payrollMonth ? dayjs(payrollMonth, 'YYYY-MM') : undefined}
                            onChange={handleMonthChange}
                            allowClear={false}
                            defaultValue={dayjs(dayjs().format('YYYY/MM'), 'YYYY/MM')}
                            format={'YYYY/MM'}
                            picker="month" /> */}
          </div>
        </div>
        {/* <div>
          <p className="mb-1">Filter By</p>
          <DatePicker
            value={
              payrollMonthFilter
                ? dayjs(payrollMonthFilter, "YYYY-MM")
                : undefined
            }
            onChange={handleMonthChangeFilter}
            allowClear={false}
            defaultValue={dayjs(dayjs().format("YYYY/MM"), "YYYY/MM")}
            format={"YYYY/MM"}
            picker="month"
          />
        </div> */}

        <div>
          <div className="table-container">
            <div className="table-scroll">
              <div className="table-responsive">
                <table className="table">
                  <thead className="color-native-blue">
                    <tr>
                      <th style={{ width: "5%" }}>S.no</th>
                      <th>EMP Code</th>
                      <th>Name</th>
                      <th>Payroll Period</th>
                      <th>Basic Salary</th>
                      <th>Net Amount</th>
                      <th>Deductions</th>
                      <th>OT Hours</th>
                      <th>Penalty Hours</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {monthPayroll && monthPayroll.payroll_cycles.length > 0 ?
                                            <>
                                                {monthPayroll.payroll_cycles.map((payrollCycle, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{getFormattedLocalDate(monthPayroll.payroll_cycles[index].payrun_start_date)}</td>
                                                        <td>{payrollCycle.payroll_status === PayrollStatus.Completed ? `${monthPayroll.payroll_cycles[index].total_final_amount}` : 'Yet to be calculated'}</td>
                                                        <td>{payrollCycle.payroll_status === null ? 'Pending' : getObjectKeyByValue(PayrollStatus, payrollCycle.payroll_status)}</td>
                                                        <td>
                                                            {(!payrollCycle.payroll_status || payrollCycle.payroll_status === PayrollStatus.Initiated) ?
                                                                <>
                                                                    <div className="d-flex gap-1">
                                                                        <button type="button" className="table-button" title="singleButton" onClick={() => { createPayRun(monthPayroll.payroll_month, payrollCycle.payrun_start_date) }}>
                                                                            Create Pay Run
                                                                        </button>
                                                                        <button type="button" className="table-button" title="singleButton" onClick={() => {
                                                                            setManualEntryPayrollID(payrollCycle.payroll_id ?? 0);
                                                                            setManualEntryStartDate(payrollCycle.payrun_start_date);
                                                                            setShowManualEntry(true);
                                                                        }}>
                                                                            Manual Entry
                                                                        </button>
                                                                        {payrollCycle.payroll_status === PayrollStatus.Initiated && <> <button type="button" className="btn btn-no-style px-6" title="Detail" onClick={() => {
                                                                            setShowConfirmDialog(true);
                                                                            setPayrollIDDel(payrollCycle.payroll_id ?? 0);
                                                                        }}>
                                                                            <i className="fas fa-trash-alt text-danger font-16" aria-hidden="true"></i>
                                                                        </button>
                                                                            {payrollCycle.payroll_status === PayrollStatus.Completed && <button type="button" className="btn btn-no-style px-6" title="Detail" onClick={() => {
                                                                                regeneratePayRun(monthPayroll.payroll_month, payrollCycle.payrun_start_date, payrollCycle.payroll_id ?? 0)
                                                                            }}>
                                                                                <i className="fa-solid fa-rotate font-16 " style={{ color: "#0598F5" }}></i>
                                                                            </button>}</>
                                                                        }
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    <button type="button" className="table-button" title="singleButton" onClick={() => { navigate(`${PageLinks.PAYROLL_VIEW_DETAILS}?payroll_id=${payrollCycle.payroll_id}&payroll_month=${payrollMonth}`) }}>
                                                                        View Details
                                                                    </button>
                                                                    <button type="button" className="btn btn-no-style px-6" title="Detail" onClick={() => {
                                                                        setShowConfirmDialog(true);
                                                                        setPayrollIDDel(payrollCycle.payroll_id ?? 0);
                                                                    }}>
                                                                        <i className="fas fa-trash-alt text-danger font-16" aria-hidden="true"></i>
                                                                    </button>
                                                                    {payrollCycle.payroll_status === PayrollStatus.Completed && <button type="button" className="btn btn-no-style px-6" title="Detail" onClick={() => {
                                                                        regeneratePayRun(monthPayroll.payroll_month, payrollCycle.payrun_start_date, payrollCycle.payroll_id ?? 0)
                                                                    }}>
                                                                        <i className="fa-solid fa-rotate font-16 " style={{ color: "#0598F5" }}></i>
                                                                    </button>}
                                                                </>
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                            : <tr>
                                                <td colSpan={6}>No Data Available</td>
                                            </tr>
                                        } */}
                    {payrollList && payrollList?.length > 0 ? (
                      payrollList?.map((item: any, index: number) => {
                        return (
                          <tr>
                            <td>
                              {(currentPage - 1) *
                                ProjectConfig.EntriesPerPage +
                                index +
                                1}
                            </td>
                            {/* <td>{index + 1}</td> */}
                            <td>{item.employee.employee_code }</td>
                            <td>{item.employee.employee_first_name }</td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              {item.payroll_start_date} to{" "}
                              {item.payroll_end_date}
                            </td>
                            <td>{item.monthly_salary }</td>
                            <td>{item.net_salary}</td>
                            <td>{item.deductions}</td>
                            <td>{item.ot_hours}</td>
                            <td>{item.penalty_hours}</td>
                            <td>{item.payroll_status}</td>
                            <td>
                              {/* <button
                                type="button"
                                className="generate-btn"
                                onClick={() => handlePayrollDownload(item)}
                              >
                                View
                              </button> */}
                              <button
                                type="button"
                                className="btn btn-no-style px-6"
                                title="View"
                                onClick={() => handlePayrollDownload(item)}
                              >
                                <i
                                  className="fas fa-eye text-primary font-16"
                                  aria-hidden="true"
                                ></i>
                              </button>

                              <button
                                type="button"
                                className="btn btn-no-style px-6"
                                title="Delete"
                                onClick={() => handleDeleteEntry(item)}
                              >
                                <i
                                  className="fas fa-trash-alt text-danger font-16"
                                  aria-hidden="true"
                                ></i>
                              </button>
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
                  <ConfirmDialog
                    showConfirm={showDeleteConfirm}
                    confirmHeading={"Delete Confirm"}
                    confirmMsg={"Are you sure you want to delete this entry?"}
                    handleNo={() => {
                      setShowDeleteConfirm(false);
                    }}
                    handleYes={() => {
                      handlePayrollDelete(dataToDelete);
                    }}
                  />
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
              key="Payroll pagination select"

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
          {/* <div style={{ float: "right" }}>
            <Pagination
              count={totalPages}
              onChange={handlePagination}
              page={currentPage}
              variant="outlined"
              color="primary"
              shape="rounded"
            />
          </div> */}
        </div>

        {/* {showConfirmDialog && (
          <ConfirmDialog
            showConfirm={showConfirmDialog}
            confirmHeading={"Delete Confirm"}
            confirmMsg={"Are you sure you want to delete this payroll entry?"}
            handleNo={() => {
              setPayrollIDDel(0);
              setShowConfirmDialog(false);
            }}
            handleYes={() => {
              deletePayroll(payrollIDDel);
              setShowConfirmDialog(false);
              // reloadData()
            }}
          />
        )} */}
        {/* {showManualEntry && (
          <PayrollComponentValueEntryDialog
            showDialog={showManualEntry}
            closeDialog={() => setShowManualEntry(false)}
            reloadData={fetchPayrollList}
            payrollGroupID={parseInt(selectedPayrollGroupID)}
            payrollMonth={payrollMonth}
            startDate={manualEntryStartDate}
            payrollID={manualEntryPayrollID}
          />
        )} */}
      </div>
    </>
  );
};

export default PagePayrollList;
