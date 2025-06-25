import { Drawer } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from "../common/DataTypes";
import { InitialData } from "./InitialData";
import { useAppStateAPI } from "../common/AppStateAPI";
import toast from "react-hot-toast";
import { ServerAPI } from "../common/ServerAPI";
import { API, ProjectStrings } from "../common/Constants";
import {
  extractKeys,
  getDataFromAPI,
  getLoginCompanyID,
} from "../common/Utilities";

const AttendancePolicyEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  id?: number;
  reloadData: any;
}> = ({ showDialog, closeDialog, id, reloadData }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<APIData.AttendancePolicy>(
    InitialData.AttendancePolicy
  );
  const [formDataSet, setFormDataSet] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [holidayGroupOption, setHolidayGroupOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [restDayGroupOption, setRestdayGroupOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [workShiftsOption, setWorkShiftsOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [companyOption, setCompanyOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);

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

    getDataFromAPI(
      API.EndPoint.HOLIDAY_GROUPS,
      setHolidayGroupOption,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "company_holiday_group_id",
      "company_holiday_group_name",
      "data",
      "groups"
    );
    getDataFromAPI(
      API.EndPoint.REST_DAY_GROUPS,
      setRestdayGroupOption,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "company_weekoff_id",
      "company_weekoff_name",
      "data",
      "weekoff"
    );
    getDataFromAPI(
      API.EndPoint.WORK_SHIFTS,
      setWorkShiftsOption,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "company_workshift_id",
      "company_workshift_name",
      "data",
      "workshift"
    );
    setFormDataSet(true);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      addProcessingRequests();
      ServerAPI.getAttendancePolicyDetail(id)
        .then((response) => {
          if (response) {
            setInitialValue(response);
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
  }, [id]);

  const yupSchema = Yup.object().shape({
    company_id: Yup.string()
      .notOneOf(["0"], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    policy_name: Yup.string().required(ProjectStrings.ValidationRequired),
    company_weekoff_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    company_workshift_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    company_holiday_group_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    // attendance_policy_restricted_holiday_count: Yup.number().required(
    //   ProjectStrings.ValidationNumber
    // ),
  });

  return (
    <Drawer
      anchor="right"
      open={showDialog}
      onClose={closeDialog}
      className="drawer-min"
    >
      {formDataSet && (
        <Formik
          enableReinitialize={true}
          validateOnChange={false}
          validationSchema={yupSchema}
          initialValues={initialValue}
          onSubmit={(values, { setSubmitting }) => {
            let submitValues: any = { ...values };

            if (id != undefined && id != 0) {
              addProcessingRequests();
              const keysToExtract = [
                "company_id",
                "policy_name",
                "company_workshift_id",
                "company_weekoff_id",
                "company_holiday_group_id",
              ];
              const updateValues = extractKeys(submitValues, keysToExtract);
              ServerAPI.updateAttendancePolicy(updateValues, id)
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
              //   submitValues["company_id"] = getLoginCompanyID();
              addProcessingRequests();
              ServerAPI.addAttendancePolicy(submitValues)
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
                <p className="detailed-heading mt-3">
                  {editMode ? "Edit" : "Add New"} Attendance Policy
                </p>
                <div className="custom-border-grey my-2"></div>
                <Form className="pl-2 pr-2">
                  <div className="px-2 form-field-container">
                    <div className="row py-3">
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
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group-1">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Attendance Policy Name",
                            name: "policy_name",
                            placeholder: "Enter Attendance Policy Name",
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
                            label: "Rest Day Group",
                            name: "company_weekoff_id",
                            placeholder: "Select Rest Day Group",
                            options: restDayGroupOption,
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
                            label: "Work Shift",
                            name: "company_workshift_id",
                            placeholder: "Select Work Shift",
                            options: workShiftsOption,
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
                            label: "Holiday Group",
                            name: "company_holiday_group_id",
                            placeholder: "Select Group",
                            options: holidayGroupOption,
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    {/* <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Allowed Restricted Holiday / Year",
                            name: "attendance_policy_restricted_holiday_count",
                            placeholder: "Select Number",
                            required: true,
                          }}
                        />
                      </div>
                    </div> */}
                    {/* <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "switch", label: "Status", name: "body_type_status" }} />
                                            </div>
                                        </div> */}
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
                      {editMode ? "Save Changes" : "Add Now"}
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

export default AttendancePolicyEntryDialog;
