import { Drawer, IconButton } from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
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

const ProjectEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  reloadData: any;
  id?: number;
}> = ({ showDialog, closeDialog, reloadData, id }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<APIData.Project>({
    ...InitialData.Project,
    employees: InitialData.Project.employees.length
      ? InitialData.Project.employees
      : [{ employee_id: 0, role_id: 0 }],
  });
  const [editMode, setEditMode] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [roleOptions, setRoleOptions] = useState<FormDataTypes.SelectOption[]>(
    []
  );

  const [formDataSet, setFormDataSet] = useState(false);
  const [companyOption, setCompanyOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);

  const statusOptions: FormDataTypes.SelectOption[] = [
    {
      label: "Not Started",
      value: "Not Started",
    },
    {
      label: "In Progress",
      value: "In Progress",
    },
    {
      label: "Completed",
      value: "Completed",
    },
    {
      label: "Pending",
      value: "Pending",
    },
  ];

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
      "data"
    );
    getDataFromAPI(
      API.EndPoint.MASTER_ROLE_LIST,
      setRoleOptions,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "project_role_id",
      "role_name",
      "data"
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      addProcessingRequests();
      ServerAPI.getEmployerProjectListById(id)
        .then((response) => {
          if (response) {
            setInitialValue({ ...response, employees: response.project_team });
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
    company_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    project_name: Yup.string().required(ProjectStrings.ValidationRequired),
    description: Yup.string().required(ProjectStrings.ValidationRequired),
    deadline: Yup.string().required(ProjectStrings.ValidationRequired),
    status: Yup.string().required(ProjectStrings.ValidationRequired),
    employees: Yup.array()
      .of(
        Yup.object().shape({
          employee_id: Yup.number()
            .notOneOf([0], ProjectStrings.ValidationSelect)
            .required(ProjectStrings.ValidationRequired),
          role_id: Yup.number()
            .notOneOf([0], ProjectStrings.ValidationSelect)
            .required(ProjectStrings.ValidationRequired),
        })
      )
      .min(1, "At least one employee must be added"),
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
            if (id !== undefined && id !== 0) {
              const keysToExtract = [
                "company_id",
                "employees",
                "status",
                "deadline",
                "description",
                "project_name",
              ];
              const updateValues = extractKeys(submitValues, keysToExtract);
              addProcessingRequests();
              ServerAPI.updateEmployerProject(updateValues, id)
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
              console.log(submitValues);
              addProcessingRequests();
              ServerAPI.addEmployerProject(submitValues)
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
                  {editMode ? "Edit" : "Add"} Project
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
                            fieldType: "textbox",
                            label: "Project Title",
                            name: "project_name",
                            placeholder: "Enter Project Name",
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
                            label: "Description",
                            name: "description",
                            placeholder: "Enter Description",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <FieldArray name="employees">
                      {({ push, remove }) => (
                        <>
                          {formikProps.values.employees.map((_, index) => {
                            const selectedEmployeeIds =
                              formikProps.values.employees
                                .filter((_, idx) => idx !== index)
                                .map((emp) => emp.employee_id);

                            const filteredEmployeeOptions =
                              employeeOptions.filter(
                                (option) =>
                                  !selectedEmployeeIds.includes(
                                    Number(option.value)
                                  ) ||
                                  Number(option.value) ===
                                    formikProps.values.employees[index]
                                      .employee_id
                              );

                            return (
                              <div key={index} className="row px-2 py-3">
                                <div className="col col-lg-5">
                                  <FormField
                                    formik={formikProps}
                                    fieldProps={{
                                      fieldType: "select",
                                      label: "Employee",
                                      name: `employees.${index}.employee_id`,
                                      placeholder: "Select Employee",
                                      options: filteredEmployeeOptions,
                                      required: true,
                                    }}
                                  />
                                </div>
                                <div className="col col-lg-5 mt-3 mt-sm-0">
                                  <FormField
                                    formik={formikProps}
                                    fieldProps={{
                                      fieldType: "select",
                                      label: "Role",
                                      name: `employees.${index}.role_id`,
                                      placeholder: "Select Role",
                                      options: roleOptions,
                                      required: true,
                                    }}
                                  />
                                </div>
                                <div className="col col-2">
                                  {formikProps.values.employees.length > 1 ? (
                                    <IconButton onClick={() => remove(index)}>
                                      <i
                                        className="fas fa-trash-alt text-danger font-16"
                                        aria-hidden="true"
                                      ></i>
                                    </IconButton>
                                  ) : (
                                    <IconButton disabled>
                                      <i
                                        className="fas fa-trash-alt text-muted font-16"
                                        aria-hidden="true"
                                      ></i>
                                    </IconButton>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          <button
                            type="button"
                            style={{
                              border: "none",
                              backgroundColor:
                                formikProps.values.employees.length >=
                                employeeOptions.length
                                  ? "#ccc"
                                  : "#0E7AD5",
                              color: "#fff",
                              borderRadius: 5,
                              marginLeft: 10,
                              marginBottom: 10,
                              cursor:
                                formikProps.values.employees.length >=
                                employeeOptions.length
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                            onClick={() => push({ employee_id: 0, role_id: 0 })}
                            disabled={
                              formikProps.values.employees.length >=
                              employeeOptions.length
                            }
                          >
                            + Add More Employee
                          </button>
                        </>
                      )}
                    </FieldArray>

                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "datepicker",
                            label: "Completion Date",
                            name: "deadline",
                            placeholder: "Select Date",
                            required: true,
                            allowPastDate: false,
                            allowFutureDate: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row px-2 py-3">
                      <div className="text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Status",
                            name: "status",
                            placeholder: "Select Status",
                            options: statusOptions,
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

export default ProjectEntryDialog;
