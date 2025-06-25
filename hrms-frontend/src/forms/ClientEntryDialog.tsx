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
import { ProjectStrings } from "../common/Constants";

const ClientEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  id?: number;
  reloadData: () => void;
}> = ({ showDialog, closeDialog, id, reloadData }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<APIData.Clients>(
    InitialData.Clients
  );
  const [formDataSet, setFormDataSet] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      addProcessingRequests();
      ServerAPI.getClientsDetail(id)
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

  useEffect(() => {
    setFormDataSet(true);
  }, []);

  const yupSchema = Yup.object().shape({
    client_name: Yup.string()
      .matches(
        /^[a-zA-Z0-9\s&-]*$/,
        "Client name should be a string or alphanumeric with normal special characters"
      )
      .test(
        "is-not-numeric",
        "Client name should be a string or alphanumeric",
        (value) => {
          if (!value) return true; // Allow empty value, required will handle it
          return !/^\d+$/.test(value); // Ensure value is not entirely numeric
        }
      )
      .required(ProjectStrings.ValidationRequired),

    client_email: Yup.string()
      .email("Invalid email address") // Validate email format
      .required("Required"), // Make email required

    client_mobile: Yup.string()
      .matches(
        /^[0-9]{10}$/, // Match exactly 10 digits
        "Mobile number must be exactly 10 digits"
      )
      .required("Required"), // Make mobile number required
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
            // if (!submitValues["client_name"] || /\d/.test(submitValues['client_name'])) {
            //     toast.error("Client name must be a non-empty string without numeric characters");
            //     setSubmitting(false);
            //     return;
            // }

            // const selectedCountry = countryOption.find(option => option.value.toString() === values.country_id.toString());

            // if (selectedCountry) {
            //     submitValues = {
            //         ...submitValues,
            //         country_name: selectedCountry.label
            //     };
            // }

            if (id != undefined && id != 0) {
              addProcessingRequests();
              ServerAPI.updateClients(submitValues, id)
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
              ServerAPI.addClients(submitValues)
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
                  {editMode ? "Edit" : "Add New"} Client
                </p>
                <div className="custom-border-grey my-2"></div>
                <Form className="pl-2 pr-2">
                  <div className="px-2 form-field-container">
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Client Name",
                            name: "client_name",
                            placeholder: "Enter Client Name",
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
                            label: "Client Email",
                            name: "client_email",
                            placeholder: "Enter Client Email",
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
                            label: "Client Mobile",
                            name: "client_mobile",
                            placeholder: "Enter Client Mobile",
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

export default ClientEntryDialog;
