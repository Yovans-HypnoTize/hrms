import { Drawer } from "@mui/material";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import React, { useEffect, useState } from "react";
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from "../common/DataTypes";
import { InitialData } from "./InitialData";
import toast from "react-hot-toast";
import { getDataFromAPI } from "../common/Utilities";
import { useAppStateAPI } from "../common/AppStateAPI";
import { API, ProjectStrings } from "../common/Constants";
import { ServerAPI } from "../common/ServerAPI";
import * as Yup from "yup";

const UserEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  reloadData: any;
  id?: number;
}> = ({ showDialog, closeDialog, reloadData, id }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<APIData.User>(
    InitialData.User
  );
  const [editMode, setEditMode] = useState(false);
  const adminUserTypeOptions: FormDataTypes.SelectOption[] = [
    { label: "Super Admin", value: "1" },
    { label: "Client", value: "2" },
  ];
  const [clientOption, setClientOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [adminRoleOption, setAdminRoleOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [formDataSet, setFormDataSet] = useState(false);

  useEffect(() => {
    // getDataFromAPI(
    //   API.EndPoint.CLIENT_LIST,
    //   setClientOption,
    //   addProcessingRequests,
    //   reduceProcessingRequests,
    //   null,
    //   true,
    //   "client_id",
    //   "client_name",
    //   "clients"
    // );
    getDataFromAPI(
      API.EndPoint.ADMIN_ROLE_TYPES,
      setAdminRoleOption,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "role_id",
      "role_name",
      "data"
    );
    setFormDataSet(true);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      addProcessingRequests();
      ServerAPI.getUserDetail(id)
        .then((response) => {
          if (response) {
            setInitialValue(response?.data);
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

  const EDIT_SCHEMA = {
    role_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    user_name: Yup.string().required(ProjectStrings.ValidationRequired),
    // user_password: Yup.string().required(ProjectStrings.ValidationRequired),
    user_email: Yup.string()
      .matches(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        { message: "Please enter valid Email.", excludeEmptyString: false }
      )
      .required(ProjectStrings.ValidationRequired),
    user_mobile: Yup.string()
      .matches(/^\+?[1-9]\d{1,14}$/, {
        message: "Please enter a valid number.",
        excludeEmptyString: false,
      })
      .min(10, "Minimum 10 digit required")
      .max(14, "Maximum 14 digit allowed")
      .required(ProjectStrings.ValidationRequired),
  };

  const ADD_SCHEMA = {
    ...EDIT_SCHEMA,
    user_password: Yup.string().required(ProjectStrings.ValidationRequired),
  };

  const yupSchema = Yup.object().shape(EDIT_SCHEMA);

  const addSchema = Yup.object().shape(ADD_SCHEMA);

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
          validationSchema={editMode ? yupSchema : addSchema}
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
            if (id != undefined && id != 0) {
              addProcessingRequests();
              const { role, ...cleanSubmitValues } = submitValues;
              ServerAPI.updateUser(cleanSubmitValues, id)
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
              ServerAPI.addUser(submitValues)
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
                {/* <h4 className="title-text text-center">{editMode ? 'Edit' : 'Add New'} Company Location</h4> */}
                <p className="detailed-heading mt-3">
                  {editMode ? "Edit" : "Add New"} User
                </p>
                <div className="custom-border-grey my-2"></div>
                <Form className="pl-2 pr-2">
                  <div className="px-2 form-field-container">
                    {/* <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Client", name: "client_id", placeholder: "Select Client", required: true, options: clientOption }} />
                                            </div>
                                        </div> */}
                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        {/* {JSON.stringify(adminRoleOption)} */}
                        {/* {JSON.stringify(formikProps)} */}
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "User Role",
                            name: "role_id",
                            placeholder: "Select Role",
                            required: true,
                            options: adminRoleOption,
                          }}
                        />
                      </div>
                    </div>
                    {/* <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "User Type", name: "user_type", placeholder: "Select Role", required: true, options: adminUserTypeOptions }} />
                                            </div>
                                        </div> */}
                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "User Name",
                            name: "user_name",
                            placeholder: "Enter user Name",
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
                            label: "User Email ID",
                            name: "user_email",
                            placeholder: "Enter User Email ID",
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
                            label: "Mobile",
                            name: "user_mobile",
                            placeholder: "Enter Mobile",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    {editMode ? (
                      <></>
                    ) : (
                      <div className="row px-2 py-3">
                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                          <FormField
                            formik={formikProps}
                            fieldProps={{
                              fieldType: "password",
                              label: "Password",
                              name: "user_password",
                              placeholder: "Enter Password",
                              required: true,
                            }}
                          />
                        </div>
                      </div>
                    )}

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

export default UserEntryDialog;
