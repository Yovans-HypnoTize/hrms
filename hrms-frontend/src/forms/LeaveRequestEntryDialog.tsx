import { Drawer } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from "../common/DataTypes";
import { InitialData } from "./InitialData";
import toast from "react-hot-toast";
import { extractKeys, getDataFromAPI } from "../common/Utilities";
import { useAppStateAPI } from "../common/AppStateAPI";
import {
  API,
  LeaveRequestDays,
  LeaveRequestSession,
  ProjectStrings,
} from "../common/Constants";
import { ServerAPI } from "../common/ServerAPI";
import * as Yup from "yup";

const LeaveRequestEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  reloadData: any;
  id?: number;
}> = ({ showDialog, closeDialog, reloadData, id }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<APIData.LeaveRequest>(
    InitialData.LeaveRequest
  );
  console.log(initialValue, "initial outside data");
  const [editMode, setEditMode] = useState(false);
  // const [leaveTypeOptions, setLeavetypeOptions] = useState<
  //   FormDataTypes.SelectOption[]
  // >([]);
  const [employeeOptions, setEmployeeOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [formDataSet, setFormDataSet] = useState(false);
  const [companyOption, setCompanyOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);

  const leaveRequestOptions = [
    { label: "Single ", value: LeaveRequestDays.Single + "" },
    { label: "Multiple ", value: LeaveRequestDays.Multiple + "" },
  ];
  const singleDaySessionOptions: FormDataTypes.SelectOption[] = [
    { label: "Full Day", value: LeaveRequestSession.FullDay + "" },
    { label: "Half Day", value: LeaveRequestSession.HalfDay + "" },
    // {
    //   label: "Half Day Morning",
    //   value: LeaveRequestSession.MorningSession + "",
    // },
    // {
    //   label: "Half Day Evening",
    //   value: LeaveRequestSession.EveningSession + "",
    // },
  ];
  // const startSessionOptions: FormDataTypes.SelectOption[] = [
  //   { label: "Full Day", value: LeaveRequestSession.FullDay + "" },
  //   {
  //     label: "Evening Session",
  //     value: LeaveRequestSession.EveningSession + "",
  //   },
  // ];
  // const endSessionOptions: FormDataTypes.SelectOption[] = [
  //   { label: "Full Day", value: LeaveRequestSession.FullDay + "" },
  //   {
  //     label: "Morning Session",
  //     value: LeaveRequestSession.MorningSession + "",
  //   },
  // ];

  useEffect(() => {
    // getDataFromAPI(
    //   API.EndPoint.LEAVE_TYPES,
    //   setLeavetypeOptions,
    //   addProcessingRequests,
    //   reduceProcessingRequests,
    //   null,
    //   true,
    //   "leave_type_id",
    //   "leave_type_name",
    //   "leave_types"
    // );
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
    getDataFromAPI(
      API.EndPoint.EMPLOYEES_LIST_OPTIONS,
      setEmployeeOptions,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "employee_id",
      "employee_code",
      "data"
      //   "employee_list"
    );
    // getDataFromAPI(API.EndPoint.EMPLOYEES_LIST, setEmployeeOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'employee_id', 'employee_first_name', 'data');
    // addProcessingRequests();
    // ServerAPI.executeAPI(
    //   API.EndPoint.EMPLOYEES_LIST,
    //   ServerAPI.APIMethod.GET,
    //   true,
    //   null
    // )
    //   .then((response) => {
    //     if (response.data !== undefined && response.message) {
    //       const employeeData = response.data.map((item: any) => ({
    //         label: `${item.employee.employee_first_name} ${item.employee.employee_last_name}`,
    //         value: item.employee.employee_id,
    //       }));
    //       setEmployeeOptions(employeeData);
    //       // toast.success(response.message);
    //     } else {
    //       alert("Something Went Wrong");
    //     }
    //   })
    //   .finally(() => {
    //     reduceProcessingRequests();
    //     setFormDataSet(true);
    //   });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      addProcessingRequests();
      // company_id,employee_id,leave_reason,leave_days,leave_start_date, leave_session
      ServerAPI.getLeaveRequestDetail(id)
        .then((response) => {
          if (response) {
            const data = {
              ...response,
              leave_days: response.leave_days === "Single" ? "1" : "2",
              leave_session: response.leave_session === "Full Day" ? "1" : "4",
            };
            console.log("leave request", response);
            setInitialValue(data);
            setFormDataSet(true);
            setEditMode(true);
          }
        })
        .finally(() => {
          reduceProcessingRequests();
        });
    } else {
      setFormDataSet(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const yupSchema = Yup.object().shape({
    // leave_type_id: Yup.number().required(ProjectStrings.ValidationRequired),
    company_id: Yup.string()
      .notOneOf(["0"], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    employee_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    leave_days: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    leave_session: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    leave_start_date: Yup.string().required(ProjectStrings.ValidationRequired),
    leave_reason: Yup.string().required(ProjectStrings.ValidationRequired),
    leave_end_date: Yup.string().when("leave_days", ([leave_days], schema) => {
      if (parseInt(leave_days) === LeaveRequestDays.Multiple)
        return Yup.string().required(ProjectStrings.ValidationRequired);
      return schema;
    }),
    // leave_session: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
    // leave_session: Yup.number()
    //   .transform((value) => parseInt(value))
    //   .notOneOf([0], ProjectStrings.ValidationSelect)
    //   .required(ProjectStrings.ValidationRequired),
    // employee_leave_req_end_day_leave_session: Yup.number().when(
    //   "leave_days",
    //   ([leave_days], schema) => {
    //     if (parseInt(leave_days) === LeaveRequestDays.Multiple)
    //       return Yup.number()
    //         .notOneOf([0], ProjectStrings.ValidationSelect)
    //         .required(ProjectStrings.ValidationRequired);
    //     return schema;
    //   }
    // ),
    // employee_leave_req_reason: Yup.string().required(
    //   ProjectStrings.ValidationRequired
    // ),
  });

  return (
    <Drawer
      anchor="right"
      open={showDialog}
      onClose={closeDialog}
      className="drawer-min workshift"
    >
      {formDataSet && (
        <Formik
          enableReinitialize={true}
          validateOnChange={false}
          validationSchema={yupSchema}
          initialValues={initialValue}
          onSubmit={(values, { setSubmitting }) => {
            let submitValues: any = { ...values };
            submitValues["leave_status"] = "Approved";
            submitValues["leave_session"] =
              submitValues.leave_session === "4" ? "Half Day" : "Full Day";
            submitValues["leave_days"] =
              submitValues.leave_days === "1" ? "Single" : "Multiple";

            console.log(submitValues, "submit");
            // if (
            //   parseInt(values.leave_days + "") ===
            //   LeaveRequestDays.Single
            // ) {
            //   submitValues.leave_end_date =
            //     submitValues.leave_start_date;
            //   submitValues.employee_leave_req_end_day_leave_session = null;
            // }
            submitValues["leave_end_date"] =
              submitValues["leave_days"] === "Single"
                ? ""
                : submitValues["leave_end_date"];

            // delete submitValues.leave_days;
            if (id !== undefined && id !== 0) {
              addProcessingRequests();
              const keysToExtract = [
                "employee_id",
                "company_id",
                "leave_start_date",
                "leave_end_date",
                "leave_reason",
                "leave_status",
                "leave_days",
                "leave_session",
              ];
              const updateValues = extractKeys(submitValues, keysToExtract);
              ServerAPI.updateLeaveRequest(updateValues, id)
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
              ServerAPI.addLeaveRequest(submitValues)
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
                  {editMode ? "Edit" : "Add New"} Leave Request
                </p>
                <div className="custom-border-grey my-2"></div>
                <Form className="pl-2 pr-2">
                  <div className="px-2 form-field-container">
                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Company",
                            name: "company_id",
                            placeholder: "Select Company",
                            options: companyOption,
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
                            label: "Employee Name",
                            name: "employee_id",
                            placeholder: "Select Employee  ",
                            options: employeeOptions,
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    {/* <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Leave Type",
                            name: "leave_type_id",
                            placeholder: "Select Leave Type",
                            options: leaveTypeOptions,
                            required: true,
                          }}
                        />
                      </div>
                    </div> */}
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
                      <div>
                        {/* <div className="row px-2 py-3">
                                                    <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "datepicker", label: "Leave Date", name: "leave_start_date", placeholder: "Select Date", required: true, allowFutureDate: true }} />
                                                    </div>
                                                </div> */}
                        <div className="row px-2 py-3">
                          {/* <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user holiday-group">
                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Half / Full Days", name: "employee_leave_req_end_day_type", placeholder: "Select End Day Type", options: leaveRequestDayType, required: true }} />
                                                    </div> */}
                          <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user holiday-group">
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
                          <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user holiday-group">
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

                    {parseInt(formikProps.values.leave_days + "") ===
                      LeaveRequestDays.Multiple && (
                      <div>
                        <div className="row px-2 py-3">
                          <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user holiday-group">
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
                          <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user holiday-group">
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
                          <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user holiday-group">
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
                          {/* <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user holiday-group">
                            <FormField
                              formik={formikProps}
                              fieldProps={{
                                fieldType: "select",
                                label: "Leave session",
                                name: "leave_session",
                                placeholder: "Select Start Leave session",
                                options: startSessionOptions,
                                required: true,
                              }}
                            />
                          </div>
                          <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user holiday-group">
                            <FormField
                              formik={formikProps}
                              fieldProps={{
                                fieldType: "select",
                                label: "Leave session(end date)",
                                name: "employee_leave_req_end_day_leave_session",
                                placeholder: "Select End Leave session",
                                options: endSessionOptions,
                                required: true,
                              }}
                            />
                          </div> */}
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
                </Form>
              </div>
            );
          }}
        </Formik>
      )}
    </Drawer>
  );
};

export default LeaveRequestEntryDialog;
