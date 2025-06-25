import { Drawer } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useAppStateAPI } from "../common/AppStateAPI";
import {
  LeaveRequestDays,
  LeaveRequestSession,
  API,
  ProjectStrings,
} from "../common/Constants";
import { APIData, FormDataTypes } from "../common/DataTypes";
import { ServerAPI } from "../common/ServerAPI";
import { dateFormatter, extractKeys, getDataFromAPI } from "../common/Utilities";
import FormField from "../components/form-items/FormField";
import { InitialData } from "./InitialData";

const ReportEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  reloadData: any;
  id?: number;
}> = ({ showDialog, closeDialog, reloadData, id }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<APIData.employeeDailyReport>(
    InitialData.employeeDailyReport
  );
  const [formDataSet, setFormDataSet] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [employeeReportId, setEmployeeReportId] = useState(undefined)

  const statusOption = [
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
    { label: "On Hold", value: "On Hold" },
    { label: "Completed", value: "Completed" },
  ];

  const findReportAvalilable = () => {
    addProcessingRequests();
    ServerAPI.getEmployeeReportList()
      .then((response) => {
        if (response?.data) {
          // if(response?.data?.employee_report?.length > 0){
            const reportFilter = response.data.employee_report.find(
              (item: any) => item.report_date === dateFormatter()
            );
            console.log(reportFilter)
            if(reportFilter !== undefined ){
              const id = reportFilter.employee_report_id
              getEmployeeReportDetailsById(id)
              setEmployeeReportId(id)
            } else {
              setFormDataSet(true)
            }
            // reportFilter !== undefined ? getEmployeeReportDetailsById(reportFilter.employee_report_id):setFormDataSet(true);
          // } else {
          //   setFormDataSet(true)
          // }
        } else {
          toast.error("Something went wrong!");
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  const getEmployeeReportDetailsById = (id: any) => {
    ServerAPI.getEmployeeReportDetail(id)
      .then((response) => {
        if (response) {
          console.log("report", response);
          setInitialValue(response);
          setFormDataSet(true);
          setEditMode(true);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  useEffect(() => {
    if (id === 0 || id === undefined) {
      findReportAvalilable();
    } else if (id !== undefined && id !== 0) {
      getEmployeeReportDetailsById(id);
      addProcessingRequests();
    } else {
      setFormDataSet(true);
    }
  }, [id]);

  const yupSchema = Yup.object().shape({
    report_date: Yup.string().required(ProjectStrings.ValidationRequired),
    project_title: Yup.string().required(ProjectStrings.ValidationRequired),
    task_id: Yup.string().required(ProjectStrings.ValidationRequired),
    report_summary: Yup.string().required(ProjectStrings.ValidationRequired),
    status: Yup.string()
      .oneOf(
        ["Pending", "In Progress", "On Hold", "Completed"],
        "Invalid status selected"
      )
      .required(ProjectStrings.ValidationRequired),
  });

  return (
    <Drawer
      anchor="right"
      open={showDialog}
      onClose={closeDialog}
      className="drawer-min workshift"
    >
      <Formik
        enableReinitialize={true}
        validateOnChange={false}
        validationSchema={yupSchema}
        initialValues={initialValue}
        onSubmit={(values, { setSubmitting }) => {
          let submitValues: any = { ...values };
          if (id != undefined && id != 0 || employeeReportId !== undefined) {
            const reportId =id != undefined && id != 0 ? id : employeeReportId !== undefined ? employeeReportId:0
            addProcessingRequests();
            const keysToExtract = [
              "report_summary",
              "project_title",
              "report_date",
              "status",
              "task_id",
            ];
            const updateValues = extractKeys(submitValues, keysToExtract);

            ServerAPI.updateEmployeeReport(updateValues, reportId)
              .then((response) => {
                if (response && response["message"]) {
                  toast.success(response["message"]);
                  reloadData();
                  closeDialog();
                } else if (response && response["message"]) {
                  toast.error(response["message"]);
                }
              })
              .finally(() => {
                setSubmitting(false);
                reduceProcessingRequests();
              });
          } else {
            addProcessingRequests();
            ServerAPI.addEmployeeReport(submitValues)
              .then((response) => {
                if (response && response["message"]) {
                  toast.success(response["message"]);
                  reloadData();
                  closeDialog();
                } else if (response && response["message"]) {
                  toast.error(response["message"]);
                }
              })
              .finally(() => {
                setSubmitting(false);
                reduceProcessingRequests();
              });
          }
        }}
      >
        {(formikProps) => {
          return (
            <div className="tabdetails">
              {/* <h4 className="title-text text-center">{editMode ? 'Edit' : 'Add New'} Leave Request</h4> */}
              <p className="detailed-heading mt-3">
                {editMode ? "Edit" : "Add New"} Report
              </p>
              <div className="custom-border-grey my-2"></div>
              {/* <Form className="pl-2 pr-2">
                  <div className="px-2 form-field-container">
                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Reason",
                            name: "leave_reason",
                            placeholder: "Enter a reason for your leave",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Single / Multiple Days",
                            name: "leave_days",
                            placeholder: "Select",
                            options: leaveRequestOptions,
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    {parseInt(formikProps.values.leave_days + "") ===
                      LeaveRequestDays.Single && (
                        <div className="row px-2 py-3">
                          <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                            <FormField
                              formik={formikProps}
                              fieldProps={{
                                fieldType: "datepicker",
                                label: "Leave Date",
                                name: "leave_start_date",
                                placeholder: "Select Date",
                                required: true,
                                allowFutureDate: true,
                                allowPastDate: false
                              }}
                            />
                          </div>
                          <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group mt-4">
                            <FormField
                              formik={formikProps}
                              fieldProps={{
                                fieldType: "select",
                                label: "Leave Session",
                                name: "leave_session",
                                placeholder: "Select Leave Session",
                                options: singleDaySessionOptions,
                                required: true,
                              }}
                            />
                          </div>
                        </div>
                    )}

                    {parseInt(formikProps.values.leave_days + "") ===
                      LeaveRequestDays.Multiple && (
                      <div>
                        <div className="row px-2 py-3">
                          <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                            <FormField
                              formik={formikProps}
                              fieldProps={{
                                fieldType: "datepicker",
                                label: "Leave requested from",
                                name: "leave_start_date",
                                placeholder: "Select Date",
                                required: true,
                                allowFutureDate: true,
                                allowPastDate: false
                              }}
                            />
                          </div>
                          <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group mt-4">
                            <FormField
                              formik={formikProps}
                              fieldProps={{
                                fieldType: "datepicker",
                                label: "Leave requested upto",
                                name: "leave_end_date",
                                placeholder: "Select Date",
                                required: true,
                                allowFutureDate: true,
                                allowPastDate: false
                              }}
                            />
                          </div>
                        </div>

                        <div className="row px-2 py-3">
                          <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                            <FormField
                              formik={formikProps}
                              fieldProps={{
                                fieldType: "select",
                                label: "Leave Session",
                                name: "leave_session",
                                placeholder: "Select Leave Session",
                                options: singleDaySessionOptions,
                                required: true,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="row leave-request">
                    <button
                      type="button"
                      className="button1"
                      onClick={closeDialog}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="button2"
                      disabled={formikProps.isSubmitting}
                      onClick={() => {
                        formikProps.submitForm();
                        if (!formikProps.isValid) {
                          console.log(formikProps.errors, "errror");
                          console.log(formikProps.values, "data");
                          toast.error(
                            "Please ensure all fields are Filled and Valid!"
                          );
                        }
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </Form> */}
                <Form className="pl-2 pr-2">
                  <div className="px-2 form-field-container">
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "datepicker",
                            label: "Date",
                            name: "report_date",
                            placeholder: "Select Date",
                            required: true,
                            allowFutureDate: true,
                            allowPastDate: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Task ID",
                            name: "task_id",
                            placeholder: "Enter ID",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Project Tile",
                            name: "project_title",
                            placeholder: "Enter Title",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textarea",
                            label: "Project Report",
                            name: "report_summary",
                            placeholder: "Enter Description",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Status",
                            name: "status",
                            placeholder: "Select Group",
                            options: statusOption,
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row btn-form-submit">
                    <button
                      type="button"
                      className="button1"
                      onClick={closeDialog}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="button2"
                      disabled={formikProps.isSubmitting}
                      onClick={() => {
                        formikProps.submitForm();
                        if (!formikProps.isValid) {
                          toast.error(
                            "Please ensure all fields are Filled and Valid!"
                          );
                        }
                      }}
                    >
                      {editMode ? "Save" : "Submit"}
                    </button>
                  </div>
                </Form>
            </div>
          );
        }}
      </Formik>
    </Drawer>
  );
};

export default ReportEntryDialog;
