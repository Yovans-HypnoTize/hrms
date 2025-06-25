import React, { useEffect, useState } from "react";
import FormField from "../form-items/FormField";
import toast from "react-hot-toast";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { InitialData } from "../../forms/InitialData";
import { APIData } from "../../common/DataTypes";
import { ProjectStrings } from "../../common/Constants";
import { useAppStateAPI } from "../../common/AppStateAPI";
import { ServerAPI } from "../../common/ServerAPI";
import { dateFormatter } from "../../common/Utilities";

const taskCategoryOptions = [
  {
    value: "Development",
    label: "Development",
  },
  {
    value: "Testing",
    label: "Testing",
  },
  {
    value: "Design",
    label: "Design",
  },
  {
    value: "Documentation",
    label: "Documentation",
  },
];

const taskStatusOptions = [
  {
    value: "In Progress",
    label: "In Progress",
  },
  {
    value: "On Hold",
    label: "On Hold",
  },
  {
    value: "Completed",
    label: "Completed",
  },
];

const taskPriorityOptions = [
  {
    value: "low",
    label: "Low",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "high",
    label: "High",
  },
];

const Reports: React.FC = () => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<APIData.Report>(
    InitialData.ReportData
  );
  const [employeeId, setEmployeeId] = useState(0)

  const statusOption = [
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
    { label: "On Hold", value: "On Hold" },
    { label: "Completed", value: "Completed" },
  ];

  const yupSchemaGenerator = () => {
    if (!Array.isArray(InitialData?.ReportData)) {
      return Yup.object().shape({});
    }

    return Yup.object().shape(
      InitialData?.ReportData.reduce((acc, current) => {
        acc[current] = Yup.string().required("Required");
        return acc;
      }, {})
    );
  };

  const yupSchema = Yup.object().shape({
    report_date: Yup.string().required(ProjectStrings.ValidationRequired),
    project_title: Yup.string().required(ProjectStrings.ValidationRequired),
    task_id: Yup.string().required(ProjectStrings.ValidationRequired),
    report_summary: Yup.string().required(ProjectStrings.ValidationRequired),
    status: Yup.string()
      .oneOf(
        ["Pending", "In Progress", "On Hold", "Completed"],
        "Invalid status selected"
      )
      .required(ProjectStrings.ValidationRequired),
  });

  const getEmployeeReportDetailsById = (id: any) => {
    ServerAPI.getEmployeeReportDetail(id)
      .then((response) => {
        if (response) {
          console.log("report", response);
          setInitialValue(response);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };


  const findReportAvalilable = () => {
    addProcessingRequests();
    ServerAPI.getEmployeeReportList()
      .then((response) => {
        if (response?.data) {
          // if(response?.data?.employee_report?.length > 0){
            const reportFilter = response.data.employee_report.find(
              (item: any) => item.report_date === dateFormatter()
            );
            console.log(reportFilter)
            reportFilter !== undefined && getEmployeeReportDetailsById(reportFilter.employee_report_id);
        } else {
          toast.error("Something went wrong!");
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };

  useEffect(() => {
    if (employeeId === 0 || employeeId === undefined) {
      findReportAvalilable();
    } else {
      getEmployeeReportDetailsById(employeeId);
    } 
  }, [employeeId]);

  return (
    <>
      <h3 className="title-text header-title p-2">Report</h3>

      <div className="px-3">
        <Formik
          enableReinitialize={true}
          validateOnChange={false}
          validationSchema={yupSchema}
          initialValues={initialValue}
          onSubmit={(values, { setSubmitting }) => {
            let submitValues: any = { ...values };
            console.log(submitValues, "submit");
            addProcessingRequests();
            ServerAPI.addEmployeeReport(submitValues)
              .then((response) => {
                if (response && response["message"]) {
                  toast.success(response["message"]);
                } else if (response && response["message"]) {
                  toast.error(response["message"]);
                }
              })
              .finally(() => {
                setSubmitting(false);
                reduceProcessingRequests();
              });
          }}
        >
          {(formikProps) => {
            return (
              <div className="tabdetails">
                <div className="row justify-content-end pr-3">
                  <button
                    type="button"
                    className="button3"
                    disabled={formikProps.isSubmitting}
                    onClick={() => {
                      console.log("add new report");
                    }}
                  >
                    + New
                  </button>
                </div>
                <Form className="pl-2 pr-2">
                  <div className="px-2 form-field-container">
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "datepicker",
                            label: "Date",
                            name: "report_date",
                            placeholder: "Select Date",
                            required: true,
                            allowFutureDate: true,
                            allowPastDate: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Task ID",
                            name: "task_id",
                            placeholder: "Enter ID",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Project Tile",
                            name: "project_title",
                            placeholder: "Enter Title",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textarea",
                            label: "Project Report",
                            name: "report_summary",
                            placeholder: "Enter Description",
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
                            label: "Status",
                            name: "status",
                            placeholder: "Select Group",
                            options: statusOption,
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row pl-3 pb-3">
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
      </div>
    </>
  );
};

export default Reports;
