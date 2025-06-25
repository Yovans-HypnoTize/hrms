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
  convertTimeDecimalToDuration,
  // convertTimeDurationToDecimal,
  extractKeys,
  getDataFromAPI,
  getHourFromTime,
  // getLoginCompanyID,
} from "../common/Utilities";

const WorkShiftEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  id?: number;
  reloadData: any;
}> = ({ showDialog, closeDialog, id, reloadData }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<APIData.WorkShift>(
    InitialData.WorkShift
  );
  const [formDataSet, setFormDataSet] = useState(false);
  const [editMode, setEditMode] = useState(false);
  // const salaryDeductionOptions: FormDataTypes.SelectOption[] = [
  //   { label: "No Deduction", value: "0" },
  //   { label: "Deduct Half Day", value: "1" },
  // ];
  const [companyOption, setCompanyOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [workshiftNameOption, setWorkshiftNameOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);

  // const workshiftAliveOptions: FormDataTypes.SelectOption[] = [
  //   { label: "Yes", value: "1" },
  //   { label: "No", value: "0" },
  // ];

  const workshiftHours: FormDataTypes.SelectOption[] = Array.from(
    { length: 24 },
    (_, i) => ({
      label: (i + 1).toString(),
      value: (i + 1).toString(),
    })
  );

  useEffect(() => {
    // getDataFromAPI(API.EndPoint.WORK_SHIFTS, setHolidayTypeOption, addProcessingRequests, reduceProcessingRequests, params, true, 'holiday_type_id', 'holiday_type_name', 'holiday_types');
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
      API.EndPoint.WORKSHIFT_LIST,
      setWorkshiftNameOption,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "shift_name",
      "shift_name",
      "data"
    );
    setFormDataSet(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      addProcessingRequests();
      ServerAPI.getWorkShiftDetail(id)
        .then((response) => {
          if (response) {
            const workShift = response;
            workShift.work_shift_standard_working_hours =
              convertTimeDecimalToDuration(
                response.work_shift_standard_working_hours
              );
            workShift.work_shift_min_half_day_working_hours =
              convertTimeDecimalToDuration(
                response.work_shift_min_half_day_working_hours
              );
            workShift.work_shift_min_full_day_working_hours =
              convertTimeDecimalToDuration(
                response.work_shift_min_full_day_working_hours
              );
            setInitialValue({ ...response });
            // setInitialValue({...response, company_designation_status: response.company_designation_status === true ? "1":"0"});
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
    company_id: Yup.string()
      .notOneOf(["0"], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    // client_name: Yup.string().notOneOf(["0"], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
    company_workshift_name: Yup.string()
      .notOneOf(["0"], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationSelect),
    company_workshift_start_time: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    company_workshift_end_time: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    company_workshift_start_grace_period: Yup.number().required(
      ProjectStrings.ValidationRequired
    ),
    company_workshift_end_grace_period: Yup.number().required(
      ProjectStrings.ValidationRequired
    ),
    company_workshift_grace_period_deduction: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    company_workshift_min_full_day_hours: Yup.number()
      .typeError("Must be a number")
      .integer("Must be a whole number")
      .min(1, "Must be at least 1")
      .max(24, "Must be less than or equal to 24")
      .required("Required"),
    company_workshift_min_half_day_hours: Yup.number()
      .typeError("Must be a number")
      .integer("Must be a whole number")
      .min(1, "Must be at least 1")
      .max(24, "Must be less than or equal to 24")
      .required("Required"),
    // company_workshift_min_full_day_hours: Yup.number()
    //   .typeError("Full-day hours must be a valid number")
    //   .required(ProjectStrings.ValidationRequired)
    //   .min(1, "Minimum full-day hours must be at least 1")
    //   .max(24, "Full-day hours cannot exceed 24")
    //   .integer("Must be a whole number"),

    // company_workshift_min_half_day_hours: Yup.number()
    //   .typeError("Half-day hours must be a valid number")
    //   .required(ProjectStrings.ValidationRequired)
    //   .min(1, "Minimum half-day hours must be at least 1")
    //   .max(12, "Half-day hours cannot exceed 12")
    //   .integer("Must be a whole number"),
  });

  return (
    <Drawer
      anchor="right"
      open={showDialog}
      onClose={closeDialog}
      className="workshift drawer-min"
    >
      {formDataSet && (
        <Formik
          enableReinitialize={true}
          validateOnChange={false}
          validationSchema={yupSchema}
          initialValues={initialValue}
          onSubmit={(values, { setSubmitting }) => {
            let submitValues: any = { ...values };
            console.log("Submit values", values);
            // submitValues.work_shift_standard_working_hours =
            //   convertTimeDurationToDecimal(
            //     values.work_shift_standard_working_hours
            //   );
            // submitValues.work_shift_min_half_day_working_hours =
            //   convertTimeDurationToDecimal(
            //     values.company_workshift_min_half_day_hours
            //   );
            // submitValues.work_shift_min_full_day_working_hours =
            //   convertTimeDurationToDecimal(
            //     values.company_workshift_min_full_day_hours
            //   );
            console.log("Submit values", submitValues);
            submitValues["company_workshift_min_full_day_hours"] = parseInt(
              submitValues.company_workshift_min_full_day_hours
            );
            submitValues["company_workshift_min_half_day_hours"] = parseInt(
              submitValues.company_workshift_min_half_day_hours
            );
            if (id !== undefined && id !== 0) {
              //   submitValues["company_workshift_min_full_day_hours"] =
              //   getHourFromTime(
              //     submitValues.company_workshift_min_full_day_hours
              //   );
              // submitValues["company_workshift_min_half_day_hours"] =
              //   getHourFromTime(
              //     submitValues.company_workshift_min_half_day_hours
              //   );

              addProcessingRequests();
              const keysToExtract = [
                "company_workshift_id",
                "company_workshift_name",
                "company_workshift_start_time",
                "company_workshift_end_time",
                "company_workshift_start_grace_period",
                "company_workshift_end_grace_period",
                "company_workshift_grace_period_deduction",
                "company_workshift_min_full_day_hours",
                "company_workshift_min_half_day_hours",
              ];
              const updateValues = extractKeys(submitValues, keysToExtract);
              ServerAPI.updateWorkShift(updateValues, id)
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
              // submitValues["company_workshift_min_full_day_hours"] =
              //   getHourFromTime(
              //     submitValues.company_workshift_min_full_day_hours
              //   );
              // submitValues["company_workshift_min_half_day_hours"] =
              //   getHourFromTime(
              //     submitValues.company_workshift_min_half_day_hours
              //   );
              // submitValues["company_workshift_status"] =
              //   submitValues.company_workshift_status === "1" ? true : false;

              addProcessingRequests();
              ServerAPI.addWorkShift(submitValues)
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
                  {editMode ? "Edit" : "Add New"} work shift
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
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Work Shift Name",
                            name: "company_workshift_name",
                            placeholder: "Select Workshift",
                            options: workshiftNameOption,
                            required: true,
                          }}
                        />
                        {/* <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Work Shift Name",
                            name: "company_workshift_name",
                            placeholder: "Select Type",
                            required: true,
                          }}
                        /> */}
                      </div>
                    </div>

                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "timepicker",
                            label: "Scheduled In Time",
                            name: "company_workshift_start_time",
                            placeholder: "Enter Schedule In Time",
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
                            fieldType: "textbox",
                            label: "In Time Late Tolerance (Mins)",
                            name: "company_workshift_start_grace_period",
                            placeholder: "Enter Time (In Mins)",
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
                            fieldType: "timepicker",
                            label: "Scheduled Out Time",
                            name: "company_workshift_end_time",
                            placeholder: "Enter Schedule Out time",
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
                            fieldType: "textbox",
                            label: "Out Time Early Tolerance (Mins)",
                            name: "company_workshift_end_grace_period",
                            placeholder: "Enter Time (In Mins)",
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
                            fieldType: "textbox",
                            label: "Salary Deduction for Late Arrivals",
                            name: "company_workshift_grace_period_deduction",
                            placeholder: "Enter value (%)",
                            required: true,
                          }}
                        />
                      </div>
                    </div>

                    {/* <div className="row  py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label:
                              "Salary Deduction for Late Arrivals and Early Departures",
                            name: "company_workshift_grace_period_deduction",
                            options: salaryDeductionOptions,
                            required: true,
                          }}
                        />
                      </div>
                    </div> */}

                    {/* <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "timepicker",
                            label: "Shift Standard Working Hours",
                            name: "work_shift_standard_working_hours",
                            placeholder: "Select Time",
                            required: true,
                            timepicker24HFormat: true,
                          }}
                        />
                      </div>
                    </div> */}
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Minimum Working hours for Full Day",
                            name: "company_workshift_min_full_day_hours",
                            placeholder: "Enter value",
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
                            fieldType: "textbox",
                            label: "Minimum Working hours for Half Day",
                            name: "company_workshift_min_half_day_hours",
                            placeholder: "Enter value",
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
                            fieldType: "select",
                            label: "Minimum Working hours for Full Day",
                            name: "company_workshift_min_full_day_hours",
                            placeholder: "Select Company",
                            options: workshiftHours,
                            required: true,
                          }}
                        />
                      </div>
                    </div> */}
                    {/* <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Minimum Working hours for Half Day",
                            name: "company_workshift_min_half_day_hours",
                            placeholder: "Select Company",
                            options: workshiftHours,
                            required: true,
                          }}
                        />
                      </div>
                    </div> */}

                    {/* <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "hourtimepicker",
                            label: "Minimum Working hours for Full Day",
                            name: "company_workshift_min_full_day_hours",
                            placeholder: "Select Time",
                            required: true,
                            // timepicker24HFormat: true,
                          }}
                        />
                      </div>
                    </div> */}

                    {/* <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "hourtimepicker",
                            label: "Minimum Working hours for Half Day",
                            name: "company_workshift_min_half_day_hours",
                            placeholder: "Select Time",
                            required: true,
                          }}
                        />
                      </div>
                    </div> */}
                  </div>
                  {/* <div className="row py-3">
                    <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                      <FormField
                        formik={formikProps}
                        fieldProps={{
                          fieldType: "radio",
                          label: "Workshift Status",
                          name: "company_workshift_status",
                          options: workshiftAliveOptions,
                          required: true,
                        }}
                      />
                    </div>
                  </div> */}

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

export default WorkShiftEntryDialog;
