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
import { extractKeys, getDataFromAPI } from "../common/Utilities";
import FormField from "../components/form-items/FormField";
import { InitialData } from "./InitialData";

const LeaveRequestEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  reloadData: any;
  id?: number;
}> = ({ showDialog, closeDialog, reloadData, id }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] =
    useState<APIData.EmployeeLeaveRequest>(InitialData.EmployeeLeaveRequest);
  console.log(initialValue, "initial outside data");
  const [editMode, setEditMode] = useState(false);
  const [formDataSet, setFormDataSet] = useState(false);

  const leaveRequestOptions = [
    { label: "Single ", value: LeaveRequestDays.Single + "" },
    { label: "Multiple ", value: LeaveRequestDays.Multiple + "" },
  ];
  const singleDaySessionOptions: FormDataTypes.SelectOption[] = [
    { label: "Full Day", value: LeaveRequestSession.FullDay + "" },
    { label: "Half Day", value: LeaveRequestSession.HalfDay + "" },
  ];

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      addProcessingRequests();
      ServerAPI.getEmployeeLeaveRequestDetail(id)
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
            // submitValues["leave_status"] = "Approved";
            submitValues["leave_session"] =
              submitValues.leave_session === "4" ? "Half Day" : "Full Day";
            submitValues["leave_days"] =
              submitValues.leave_days === "1" ? "Single" : "Multiple";

            console.log(submitValues, "submit");
            submitValues["leave_end_date"] =
              submitValues["leave_days"] === "Single"
                ? ""
                : submitValues["leave_end_date"];

            // delete submitValues.leave_days;
            if (id !== undefined && id !== 0) {
              addProcessingRequests();
              const keysToExtract = [
                "leave_start_date",
                "leave_end_date",
                "leave_reason",
                // "leave_status",
                "leave_days",
                "leave_session",
              ];
              const updateValues = extractKeys(submitValues, keysToExtract);
              ServerAPI.updateEmployeeLeaveRequest(updateValues, id)
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
              ServerAPI.addEmployeeLeaveRequest(submitValues)
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
                </Form>
            </div>
          );
        }}
      </Formik>
    </Drawer>
  );
};

export default LeaveRequestEntryDialog;
