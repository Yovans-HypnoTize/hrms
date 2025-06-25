import { Drawer } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from "../common/DataTypes";
import { InitialData } from "./InitialData";
import toast from "react-hot-toast";
import { extractKeys, getDataFromAPI } from "../common/Utilities";
import { useAppStateAPI } from "../common/AppStateAPI";
import { API, ProjectStrings } from "../common/Constants";
import { ServerAPI } from "../common/ServerAPI";
import * as Yup from "yup";

const LeaveCreditEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  reloadData: any;
  id?: number;
}> = ({ showDialog, closeDialog, reloadData, id }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<APIData.LeaveCredit>(
    InitialData.LeaveCredit
  );
  const [editMode, setEditMode] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  //   const [leaveTypeOptions, setLeavetypeOptions] = useState<
  //     FormDataTypes.SelectOption[]
  //   >([]);

  const [formDataSet, setFormDataSet] = useState(false);
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
      API.EndPoint.EMPLOYEES_LIST_OPTIONS,
      setEmployeeOptions,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "employee_id",
      "employee_code",
      "data",
      // "employee_list"
    );
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
    //         label: `${item.employee.employee_first_name} ${
    //           item.employee.employee_last_name
    //             ? item.employee.employee_last_name
    //             : ""
    //         }`,
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
      ServerAPI.getLeaveCreditDetail(id)
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //   employee_id: 0,
  //   company_id: 0,
  //   company_leave_credit: 0,
  //   remarks:''

  const yupSchema = Yup.object().shape({
    employee_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    company_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    // leave_type_id: Yup.number()
    //   .notOneOf([0], ProjectStrings.ValidationSelect)
    //   .required(ProjectStrings.ValidationRequired),
    company_leave_credit: Yup.number().required(
      ProjectStrings.ValidationRequired
    ),
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
            submitValues["company_leave_credit"] = parseInt(
              submitValues["company_leave_credit"]
            );
            if (!submitValues["company_leave_credit"]) {
              toast.error("Employee Leave Credit Count Required");
              setSubmitting(false);
              return;
            }
            if (id !== undefined && id !== 0) {
              const keysToExtract = [
                "employee_id",
                "company_id",
                "company_leave_credit",
                "remarks",
              ];
              const updateValues = extractKeys(submitValues, keysToExtract);
              addProcessingRequests();
              ServerAPI.updateLeaveCredit(updateValues, id)
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
              ServerAPI.addLeaveCredit(submitValues)
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
                  {editMode ? "Edit" : "Add"} Leave Credits
                </p>
                <div className="custom-border-grey my-2"></div>
                <Form className="pl-2 pr-2">
                  <div className="px-2 form-field-container">
                    <div className="row px-2 py-3">
                      <div className="text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Company Name",
                            name: "company_id",
                            placeholder: "Select Company Name",
                            options: companyOption,
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
                            label: "Employee Name",
                            name: "employee_id",
                            placeholder: "Select Employee",
                            options: employeeOptions,
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
                            label: "Leave Type Id",
                            name: "leave_type_id",
                            placeholder: "Select Leave Type",
                            options: leaveTypeOptions,
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
                            label: "Leave credit Count",
                            name: "company_leave_credit",
                            placeholder: "Enter Leave Credits",
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
                            fieldType: "textarea",
                            label: "Remarks",
                            name: "remarks",
                            placeholder: "Enter Remarks",
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

export default LeaveCreditEntryDialog;
