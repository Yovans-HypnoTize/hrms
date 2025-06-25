import { Drawer } from "@mui/material";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import React, { useEffect, useState } from "react";
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from "../common/DataTypes";
import { InitialData } from "./InitialData";
import toast from "react-hot-toast";
import { getDataFromAPI, getLoginClientID } from "../common/Utilities";
import { useAppStateAPI } from "../common/AppStateAPI";
import { API, CompanySalaryType, ProjectStrings } from "../common/Constants";
import { ServerAPI } from "../common/ServerAPI";
import * as Yup from "yup";

const CompanyEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  reloadData: any;
  id?: number;
}> = ({ showDialog, closeDialog, reloadData, id }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<APIData.Company>(
    InitialData.Company
  );
  const [editMode, setEditMode] = useState(false);
  const [clientOption, setClientOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [countryOption, setCountryOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [stateOptions, setStateOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [cityOptions, setCityOptions] = useState<FormDataTypes.SelectOption[]>(
    []
  );
  const mobileAvailableOptions: FormDataTypes.SelectOption[] = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];
  const [formDataSet, setFormDataSet] = useState(false);
  const [selectedCountryID, setSelectedCountryID] = useState(0);
  const [selectedStateID, setSelectedStateID] = useState(0);
  // const [currencyOption, setCurrencyOption] = useState<
  //   FormDataTypes.SelectOption[]
  // >([]);
  const salaryOptions: FormDataTypes.SelectOption[] = [
    {
      label: "Monthly Basic Pay Based",
      value: CompanySalaryType.MonthlyBasicPayBased + "",
    },
    { label: "Annual CTC Based", value: CompanySalaryType.AnnualCtcBased + "" },
  ];
  console.log(getLoginClientID(), "client");

  useEffect(() => {
    if (selectedCountryID) {
      let params: { [k: string]: any } = {};
      params["country_id"] = selectedCountryID;
      getDataFromAPI(
        API.EndPoint.STATE_LIST,
        setStateOptions,
        addProcessingRequests,
        reduceProcessingRequests,
        params,
        true,
        "state_id",
        "state_name",
        "data"
      );
    } else {
      setStateOptions([]);
    }
  }, [selectedCountryID]);

  useEffect(() => {
    if (selectedStateID) {
      let params: { [k: string]: any } = {};
      params["state_id"] = selectedStateID;
      getDataFromAPI(
        API.EndPoint.CITY_LIST,
        setCityOptions,
        addProcessingRequests,
        reduceProcessingRequests,
        params,
        true,
        "city_id",
        "city_name",
        "data"
      );
    } else {
      setCityOptions([]);
    }
  }, [selectedStateID]);

  useEffect(() => {
    getDataFromAPI(
      API.EndPoint.CLIENT_LIST,
      setClientOption,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "user_id",
      "user_name",
      "data"
    );
    getDataFromAPI(
      API.EndPoint.COUNTRY_LIST,
      setCountryOption,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "country_id",
      "country_name",
      "data"
    );
    // getDataFromAPI(
    //   API.EndPoint.CURRENCY_LIST,
    //   setCurrencyOption,
    //   addProcessingRequests,
    //   reduceProcessingRequests,
    //   null,
    //   true,
    //   "currency_id",
    //   "currency_abbreviation",
    //   "currencies"
    // );
    // getDataFromAPI(API.EndPoint.STATE_LIST, setStateOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'state_id', 'state_name', 'states');
    setFormDataSet(true);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      addProcessingRequests();
      ServerAPI.getCompanyDetail(id)
        .then((response) => {
          if (response) {
            setInitialValue(response.data);
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
    company_name: Yup.string().required(ProjectStrings.ValidationRequired),
    company_logo: Yup.string().required(ProjectStrings.ValidationRequired),
    company_code: Yup.string().required(ProjectStrings.ValidationRequired),
    company_reg_address1: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    // company_address_city: Yup.string().required(
    //   ProjectStrings.ValidationRequired
    // ),
    company_reg_address_zip: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    country_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    user_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    state_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    city_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    // company_salary_definition_type: Yup.number()
    //   .notOneOf([0], ProjectStrings.ValidationSelect)
    //   .required(ProjectStrings.ValidationRequired),
    // company_currency_id: Yup.number()
    //   .notOneOf([0], ProjectStrings.ValidationSelect)
    //   .required(ProjectStrings.ValidationRequired),
    company_mail: Yup.string()
      .matches(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        { message: "Please enter valid Email.", excludeEmptyString: false }
      )
      .required(ProjectStrings.ValidationRequired),
    // mobile_app_attendance_allowed: Yup.boolean().required(ProjectStrings.ValidationRequired),
  });

  const handleFormSubmit = (values: any, { setSubmitting }: any) => {
    let submitValues: any = { ...values };
    console.log(submitValues);
    submitValues["company_mobile_attendance"] =
      parseInt(values.company_mobile_attendance + "") === 1 ? true : false;
    submitValues["company_reg_address_zip"] =
      submitValues["company_reg_address_zip"].toString();
    const keysToRemove = [
      "company_created_at",
      "company_status",
      "company_updated_at",
      "country",
      "state",
      "user",
      "city",
    ];
    keysToRemove.forEach((key) => {
      delete submitValues[key];
    });

    if (id != undefined && id != 0) {
      addProcessingRequests();
      ServerAPI.updateCompany(submitValues, id)
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
      // submitValues['user_id'] = getLoginClientID();
      addProcessingRequests();
      ServerAPI.addCompany(submitValues)
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
  };
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
          onSubmit={handleFormSubmit}
        >
          {(formikProps) => {
            if (
              formikProps.values.country_id &&
              formikProps.values.country_id !== selectedCountryID
            ) {
              setSelectedCountryID(
                parseInt(formikProps.values.country_id + "")
              );
            }

            if (
              formikProps.values.state_id &&
              formikProps.values.state_id !== selectedStateID
            ) {
              setSelectedStateID(parseInt(formikProps.values.state_id + ""));
            }

            return (
              <div className="tabdetails">
                {/* <h4 className="title-text text-center">{editMode ? 'Edit' : 'Add New'} Company</h4> */}
                <p className="detailed-heading mt-3">
                  {editMode ? "Edit" : "Add New"} Company
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
                            label: "Client Name",
                            name: "user_id",
                            placeholder: "Select Client Name",
                            options: clientOption,
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Company Name",
                            name: "company_name",
                            placeholder: "Enter Company Name",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Company Code",
                            name: "company_code",
                            placeholder: "Enter Company Code",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Company mail ID",
                            name: "company_mail",
                            placeholder: "Enter Company mail ID",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "fileupload",
                            name: "company_logo",
                            label: "Company Logo",
                            accept: "image/*",
                            required: true,
                            previewImage: `${formikProps.values.company_logo}`,
                          }}
                        />
                        {formikProps.touched["company_logo"] &&
                          formikProps.errors["company_logo"] && (
                            <div id="feedback" className="required-text">
                              Required
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Address Line 1",
                            name: "company_reg_address1",
                            placeholder: "Enter Company Address",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Address Line 2",
                            name: "company_reg_address2",
                            placeholder: "Enter Company Address",
                          }}
                        />
                      </div>
                    </div>

                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Country Name",
                            name: "country_id",
                            placeholder: "Select Country Name",
                            options: countryOption,
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "State Name",
                            name: "state_id",
                            placeholder: "Select State Name",
                            required: true,
                            options: stateOptions,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "City Name",
                            name: "city_id",
                            placeholder: "Select City Name",
                            required: true,
                            options: cityOptions,
                          }}
                        />
                      </div>
                    </div>
                    {/* <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "City Name",
                            name: "company_address_city",
                            placeholder: "Enter City Name",
                            required: true,
                          }}
                        />
                      </div>
                    </div> */}
                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "number",
                            label: "Zip / Postcode",
                            name: "company_reg_address_zip",
                            placeholder: "Enter Zip / Postcode",
                            required: true,
                          }}
                        />
                      </div>
                    </div>

                    {/* <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Salary Type",
                            name: "company_salary_definition_type",
                            placeholder: "Select Salary Type",
                            required: true,
                            options: salaryOptions,
                          }}
                        />
                      </div>
                    </div> */}
                    {/* <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Currency",
                            name: "company_currency_id",
                            placeholder: "Select Currency",
                            options: currencyOption,
                            required: true,
                          }}
                        />
                      </div>
                    </div> */}
                    {/* <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "radio",
                            label: "Allow attendance from mobile app? ",
                            name: "mobile_app_attendance_allowed",
                            options: mobileAvailableOptions,
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

export default CompanyEntryDialog;
