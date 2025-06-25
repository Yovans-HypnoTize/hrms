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
  // getLoginCompanyID,
} from "../common/Utilities";

const DesignationEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  id?: number;
  reloadData: any;
}> = ({ showDialog, closeDialog, id, reloadData }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<APIData.Designation>(
    InitialData.Designation
  );
  const [formDataSet, setFormDataSet] = useState(false);
  const [editMode, setEditMode] = useState(false);
  //   const [superiorDesigaionOptions, setSuperiorDesignationOptions] = useState<
  //     FormDataTypes.SelectOption[]
  //   >([]);
  const [departmentOption, setDepartmentOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  // const designationAliveOptions: FormDataTypes.SelectOption[] = [
  //   { label: "Yes", value: "1" },
  //   { label: "No", value: "0" },
  // ];

  useEffect(() => {
    getDataFromAPI(
      API.EndPoint.CLIENT_DEPARTMENT_LIST,
      setDepartmentOption,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "company_department_id",
      "company_department_name",
      "data",
      "departments"
    );
    // getDataFromAPI(
    //   API.EndPoint.CLIENT_DESIGNATION_LIST,
    //   setSuperiorDesignationOptions,
    //   addProcessingRequests,
    //   reduceProcessingRequests,
    //   null,
    //   true,
    //   "designation_id",
    //   "company_designation_name",
    //   "designations"
    // );
    setFormDataSet(true);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      addProcessingRequests();
      ServerAPI.getDesignationDetail(id)
        .then((response) => {
          if (response) {
            setInitialValue({
              ...response,
              // company_designation_status:
              //   response.company_designation_status === true ? "1" : "0",
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

  useEffect(() => {
    setFormDataSet(true);
  }, []);

  const yupSchema = Yup.object().shape({
    company_designation_name: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    company_department_id: Yup.string()
      .notOneOf(["0"], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    // company_designation_uid: Yup.string().required(ProjectStrings.ValidationRequired),
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
              // submitValues["company_designation_status"] =
              //   submitValues.company_designation_status === "1" ? true : false;
              addProcessingRequests();
              const keysToExtract = [
                "company_department_id",
                "company_designation_name",
                // "company_department_uid",
                // "company_designation_status",
              ];
              const updateValues = extractKeys(submitValues, keysToExtract);
              ServerAPI.updateDesignation(updateValues, id)
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
              //   submitValues["company_department_id"] = getLoginCompanyID();
              // submitValues["company_designation_status"] =
              //   submitValues.company_designation_status === "1" ? true : false;
              addProcessingRequests();
              ServerAPI.addDesignation(submitValues)
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
                  {editMode ? "Edit" : "Add New"} Designation
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
                            label: "Department",
                            name: "company_department_id",
                            placeholder: "Select Department",
                            options: departmentOption,
                            required: true,
                          }}
                        />
                      </div>
                    </div>

                    {/* <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Superior Designation",
                            name: "parent_designation_id",
                            placeholder: "Select Superior Designation",
                            options: superiorDesigaionOptions,
                          }}
                        />
                      </div>
                    </div> */}
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Designation Name",
                            name: "company_designation_name",
                            placeholder: "Enter Designation Name",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    {/* <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Designation Abbreviation",
                            name: "company_designation_uid",
                            placeholder: "Enter Designation Abbreviation",
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
                            label: "Designation Status",
                            name: "company_designation_status",
                            options: designationAliveOptions,
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

export default DesignationEntryDialog;
