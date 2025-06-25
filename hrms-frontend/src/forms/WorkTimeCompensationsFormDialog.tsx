import { Drawer } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from "../common/DataTypes";
import { InitialData } from "./InitialData";
import toast from "react-hot-toast";
import {
  extractKeys,
  getDataFromAPI,
  // getLoginClientID,
} from "../common/Utilities";
import { useAppStateAPI } from "../common/AppStateAPI";
import { API, ProjectStrings } from "../common/Constants";
import { ServerAPI } from "../common/ServerAPI";
import * as Yup from "yup";

const WorkTimeCompensationsFormDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  reloadData: any;
  id?: number;
}> = ({ showDialog, closeDialog, reloadData, id }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<APIData.WorkTimeComponent>(
    InitialData.WorkTimeComponent
  );
  const [editMode, setEditMode] = useState(false);
  const [formDataSet, setFormDataSet] = useState(false);
  const [workShiftOptions, setWorkshiftOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [workTimeDayOptions, setWorkTimeDayOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  // const workTimeCompensationStatus: FormDataTypes.SelectOption[] = [
  //   { label: "Yes", value: "1" },
  //   { label: "No", value: "0" },
  // ];
  //   const workTimeDayOptions: FormDataTypes.SelectOption[] = [
  //     { label: "Regular Day", value: WorkTimeDayType.RegularDay + "" },
  //     { label: "Rest Day", value: WorkTimeDayType.RestDay + "" },
  //   ];

  useEffect(() => {
    // getDataFromAPI(
    //   API.EndPoint.HOLIDAY_TYPES,
    //   setWorkshiftOptions,
    //   addProcessingRequests,
    //   reduceProcessingRequests,
    //   null,
    //   true,
    //   "holiday_type_id",
    //   "holiday_type_name",
    //   "holiday_types"
    // );

    getDataFromAPI(
      API.EndPoint.WORK_SHIFTS,
      setWorkshiftOptions,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "company_workshift_id",
      "company_workshift_name",
      "data",
      "workshift"
    );
    getDataFromAPI(
      API.EndPoint.MASTER_DAY_TYPE,
      setWorkTimeDayOptions,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "day_type_id",
      "day_type_name",
      "data"
    );
    setFormDataSet(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      addProcessingRequests();
      ServerAPI.getworkShiftCompensationDetail(id)
        .then((response) => {
          if (response) {
            setInitialValue({
              ...response,
              // company_workshift_pay_status:
              //   response.company_workshift_pay_status === true ? "1" : "0",
            });
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

  // company_workshift_id: 0,
  // day_type_id: 0,
  // company_workshift_pay_name: "",
  // company_workshift_pay_uid: "",
  // company_workshift_pay_status: false,
  // company_workshift_pay_regular: "",
  // company_workshift_pay_overtime: "",
  // company_workshift_pay_night: "",
  // company_workshift_pay_night_overtime: "",

  const yupSchema = Yup.object().shape({
    // client_name: Yup.string().notOneOf(["0"], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
    // work_time_day_type: Yup.string().required(ProjectStrings.ValidationRequired),

    company_workshift_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    day_type_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    // company_workshift_pay_name: Yup.string().required(
    //   ProjectStrings.ValidationRequired
    // ),
    // company_workshift_pay_uid: Yup.string().required(
    //   ProjectStrings.ValidationRequired
    // ),
    company_workshift_pay_regular: Yup.number()
      .max(99999.99, "Must be less than 100,000")
      .required(ProjectStrings.ValidationRequired),
    // company_workshift_pay_status: Yup.string().required(
    //   ProjectStrings.ValidationRequired
    // ),
    company_workshift_pay_overtime: Yup.number()
      .max(99999.99, "Must be less than 100,000")
      .required(ProjectStrings.ValidationRequired),
    // company_workshift_pay_night: Yup.number()
    //   .max(99999.99, "Must be less than 100,000")
    //   .required(ProjectStrings.ValidationRequired),
    // company_workshift_pay_night_overtime: Yup.number()
    //   .max(99999.99, "Must be less than 100,000")
    //   .required(ProjectStrings.ValidationRequired),
  });

  return (
    <Drawer
      anchor="right"
      open={showDialog}
      onClose={closeDialog}
      className="drawer-fit"
    >
      {formDataSet && (
        <Formik
          enableReinitialize={true}
          validateOnChange={false}
          validationSchema={yupSchema}
          initialValues={initialValue}
          onSubmit={(values, { setSubmitting }) => {
            let submitValues: any = { ...values };
            // const selectedCountry = countryOption.find(option => option.value.toString() === values.country_id.toString());

            // if (selectedCountry) {
            //     submitValues = {
            //         ...submitValues,
            //         country_name: selectedCountry.label
            //     };
            // }
            if (id !== undefined && id !== 0) {
              // submitValues["company_workshift_pay_status"] =
              //   submitValues.company_workshift_pay_status === "1"
              //     ? true
              //     : false;
              addProcessingRequests();
              const keysToExtract = [
                "company_workshift_pay_id",
                "company_workshift_id",
                "company_workshift_pay_name",
                // "company_workshift_pay_status",
                "company_workshift_pay_regular",
                "company_workshift_pay_overtime",
                // "company_workshift_pay_night",
                // "company_workshift_pay_night_overtime",
              ];
              const updateValues = extractKeys(submitValues, keysToExtract);
              ServerAPI.updateworkShiftCompensation(updateValues, id)
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
              // submitValues["company_workshift_pay_status"] =
              //   submitValues.company_workshift_pay_status === "1"
              //     ? true
              //     : false;
              addProcessingRequests();
              ServerAPI.addworkShiftCompensation(submitValues)
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

            // if (id != undefined && id != 0) {
            //   submitValues["company_workshift_pay_status"] =
            //     submitValues.company_workshift_pay_status === "1"
            //       ? true
            //       : false;
            //   //   submitValues["client_id"] = getLoginClientID();
            //   addProcessingRequests();
            //   ServerAPI.updateworkShiftCompensation(submitValues, id)
            //     .then((response) => {
            //       if (response && response["message"]) {
            //         toast.success(response["message"]);
            //         reloadData();
            //         closeDialog();
            //       } else if (response && response["message"]) {
            //         toast.error(response["message"]);
            //       }
            //     })
            //     .finally(() => {
            //       setSubmitting(false);
            //       reduceProcessingRequests();
            //     });
            // }
          }}
        >
          {(formikProps) => {
            return (
              <div className="tabdetails">
                {/* <h4 className="title-text text-center">{editMode ? 'Edit' : 'Add New'} Company Details</h4> */}
                <p className="detailed-heading mt-3">
                  {editMode ? "Edit" : "Add New"} Work Time Compensations
                  Details
                </p>
                <div className="custom-border-grey my-2"></div>
                <Form className="pl-2 pr-2">
                  <div className="px-2 form-field-container">
                    <div className="row py-3">
                      <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Workshift",
                            name: "company_workshift_id",
                            placeholder: "Select Workshift",
                            required: true,
                            options: workShiftOptions,
                            // readOnly: editMode ? true : false,
                          }}
                        />
                      </div>
                      <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Day Type",
                            name: "day_type_id",
                            placeholder: "Day Type",
                            required: true,
                            options: workTimeDayOptions,
                            // readOnly: editMode ? true : false,
                          }}
                        />
                      </div>
                    </div>
                    {/* <div className="row py-3">
                      <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Pay Name",
                            name: "company_workshift_pay_name",
                            placeholder: "Enter Pay Name",
                            required: true,
                          }}
                        />
                      </div>
                      <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Pay Abbreviation",
                            name: "company_workshift_pay_uid",
                            placeholder: "Enter Pay Abbreviation",
                            required: true,
                          }}
                        />
                      </div>
                    </div> */}
                    <div className="row py-3">
                      <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Regular Pay",
                            name: "company_workshift_pay_regular",
                            placeholder: "Enter Value (%)",
                            required: true,
                          }}
                        />
                      </div>
                      <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Overtime Pay",
                            name: "company_workshift_pay_overtime",
                            placeholder: "Enter Value (%)",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    {/* <div className="row py-3">
                      <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Night Shift Pay",
                            name: "company_workshift_pay_night",
                            placeholder: "Enter Value (%)",
                            required: true,
                          }}
                        />
                      </div>
                      <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Night Shift Overtime",
                            name: "company_workshift_pay_night_overtime",
                            placeholder: "Enter Value (%)",
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
                            fieldType: "radio",
                            label: "Compensation Status",
                            name: "company_workshift_pay_status",
                            options: workTimeCompensationStatus,
                            required: true,
                          }}
                        />
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

export default WorkTimeCompensationsFormDialog;
