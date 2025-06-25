import { Drawer } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import * as Yup from "yup";
import React, { useEffect, useRef, useState } from "react";
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from "../common/DataTypes";
import { InitialData } from "./InitialData";
import { useAppStateAPI } from "../common/AppStateAPI";
import toast from "react-hot-toast";
import { ServerAPI } from "../common/ServerAPI";
import {
  API,
  PayrollCalculateperDaySalary,
  PayrollDayOfTheWeek,
  PayrollInterval,
  PayrollStartMonth,
  ProjectStrings,
} from "../common/Constants";
import {
  extractKeys,
  getDataFromAPI,
  // getLoginCompanyID,
} from "../common/Utilities";

const PayrollGroupsEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  id?: number;
  reloadData: any;
}> = ({ showDialog, closeDialog, id, reloadData }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const formikRef = useRef<FormikProps<APIData.PayrollGroup>>(null);
  const [initialValue, setInitialValue] = useState<APIData.PayrollGroup>(
    InitialData.PayrollGroup
  );
  const [daysOfMonthInitialized, setDaysOfMonthInitialized] = useState(false);
  const [formDataSet, setFormDataSet] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [selectedPayrollInterval, setSelectedPayrollInterval] = useState(0);
  // const [payrollIntevalOption, setPayrollIntervalOption] = useState<FormDataTypes.SelectOption[]>([]);

  const FormValueConstants = {
    previousMonth: "Previous Month",
    currentMonth: "Current Month",
    monthly: "Monthly",
    biMonthly: "Bi-Monthly",
    specificDays: "Specific Days",
    calenderDays: "Calendar Days",
  };

  const StartMonthOptions: FormDataTypes.SelectOption[] = [
    { label: "Previous Month", value: PayrollStartMonth.PreviousMonth + "" },
    { label: "Current Month", value: PayrollStartMonth.CurrentMonth + "" },
  ];
  const PayrollIntervalOptions: FormDataTypes.SelectOption[] = [
    { label: "Monthly", value: PayrollInterval.Monthly + "" },
    // { label: "Bi-Monthly", value: PayrollInterval.BiMonthly + "" },
  ];
  const CalculatePerDaySalaryOptions: FormDataTypes.SelectOption[] = [
    {
      label: "Specific Days",
      value: PayrollCalculateperDaySalary.SpecificDays + "",
    },
    {
      label: "Calendar Days",
      value: PayrollCalculateperDaySalary.CalenderDays + "",
    },
    // {
    //   label: "As Defined in Employee",
    //   value: PayrollCalculateperDaySalary.AsDefinedInEmployee + "",
    // },
  ];
  // { label: "Fortnightly", value: PayrollInterval.FortNightly + "" }, { label: "Weekly", value: PayrollInterval.Weekly + "" }
  const PayrollDayOfWeek: FormDataTypes.SelectOption[] = [
    { label: "Sunday", value: PayrollDayOfTheWeek.Sunday + "" },
    { label: "Monday", value: PayrollDayOfTheWeek.Monday + "" },
    { label: "Tuesday", value: PayrollDayOfTheWeek.Tuesday + "" },
    { label: "Wednesday", value: PayrollDayOfTheWeek.Wednesday + "" },
    { label: "Thursday", value: PayrollDayOfTheWeek.Thursday + "" },
    { label: "Friday", value: PayrollDayOfTheWeek.Friday + "" },
    { label: "Saturday", value: PayrollDayOfTheWeek.Saturday + "" },
  ];
  const formValueModification = (submitValues: any) => {
    submitValues["payroll_start_day_of_month"] = Number(
      submitValues.payroll_start_day_of_month
    );
    submitValues["start_month"] =
      submitValues.start_month === "1"
        ? FormValueConstants.currentMonth
        : FormValueConstants.previousMonth;
    submitValues["payroll_group_status"] =
      submitValues.payroll_group_status === 1 ? true : false;
    submitValues["calculate_per_day_salary"] =
      submitValues.calculate_per_day_salary === "1"
        ? FormValueConstants.specificDays
        : FormValueConstants.calenderDays;
    submitValues["payroll_interval"] =
      submitValues.payroll_interval === "1"
        ? FormValueConstants.monthly
        : FormValueConstants.biMonthly;
    // submitValues["payroll_group_status"] =
    //   submitValues.payroll_group_status === 1 ? true: false
    return submitValues;
  };
  const [daysOfMonthOptions, setDaysOfMonthOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [companyOption, setCompanyOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      addProcessingRequests();
      ServerAPI.getPayrollGroupDetail(id)
        .then((response) => {
          if (response) {
            // specific_days_per_month: 0,
            // payroll_start_day_of_month: 0,
            const data = {
              specific_days_per_month: response.specific_days_per_month,
              payroll_start_day_of_month: response.payroll_start_day_of_month,
              company_id: response.company_id,
              payroll_group_name: response.payroll_group_name,
              payroll_interval:
                response.payroll_interval === FormValueConstants.monthly
                  ? "1"
                  : "2",
              start_month:
                response.start_month === FormValueConstants.currentMonth
                  ? "1"
                  : "2",
              specificDaysPerMonth: response.data,
              calculate_per_day_salary:
                response.calculate_per_day_salary ===
                FormValueConstants.calenderDays
                  ? "2"
                  : "1",
              payroll_group_status:
                response.payroll_group_status === true ? 1 : 0,
            };
            console.log("data for edit", data);
            setInitialValue(data);
            setFormDataSet(true);
            setEditMode(true);
            const monthDays: FormDataTypes.SelectOption[] = [];
            for (let day = 1; day <= 31; day++) {
              monthDays.push({
                value: day.toString(),
                label: day.toString(),
              });
            }
            setDaysOfMonthOptions(monthDays);
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

  // useEffect(() => {
  //   console.log("Fetching Data", id);
  //   if (id !== undefined && id !== 0) {
  //     addProcessingRequests();
  //     ServerAPI.getPayrollGroupDetail(id)
  //       .then((response) => {
  //         if (response) {
  //           const payrollGroup = { ...response };
  //           if (payrollGroup.payroll_interval === PayrollInterval.BiMonthly) {
  //             payrollGroup.payroll_start_day_of_month =
  //               response.payroll_start_day_of_month.split(",");
  //           } else {
  //             console.log(
  //               "parse",
  //               response.payroll_start_day_of_month,
  //               parseInt(response.payroll_start_day_of_month)
  //             );
  //             payrollGroup.payroll_start_day_of_month =
  //               parseInt(response.payroll_start_day_of_month) + "";
  //           }
  //           setSelectedPayrollInterval(payrollGroup.payroll_interval);
  //           setInitialValue(payrollGroup);
  //           console.log(payrollGroup, "payroll group");
  //           setFormDataSet(true);
  //           setEditMode(true);
  //         }
  //       })
  //       .finally(() => {
  //         reduceProcessingRequests();
  //       });
  //   } else {
  //     setFormDataSet(true);
  //   }
  //   setTimeout(() => setDaysOfMonthInitialized(true), 1000);

  //   const monthDays: FormDataTypes.SelectOption[] = [];
  //   for (let day = 1; day <= 31; day++) {
  //     monthDays.push({
  //       value: day.toString(),
  //       label: day.toString(),
  //     });
  //   }
  //   setDaysOfMonthOptions(monthDays);
  // }, [id]);

  useEffect(() => {
    if (formikRef.current && daysOfMonthInitialized) {
      formikRef.current.setFieldValue("payroll_start_day_of_month", "");

      //   if (selectedPayrollInterval === PayrollInterval.BiMonthly) {
      //     formikRef.current.setFieldValue("payroll_start_day_of_month", []);
      //   } else {
      //     formikRef.current.setFieldValue("payroll_start_day_of_month", "");
      //   }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPayrollInterval]);

  useEffect(() => {
    const monthDays: FormDataTypes.SelectOption[] = [];
    for (let day = 1; day <= 31; day++) {
      monthDays.push({
        value: day.toString(),
        label: day.toString(),
      });
    }
    setDaysOfMonthOptions(monthDays);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //     // getDataFromAPI(API.EndPoint.CLIENT_LIST, setPayrollIntervalOption, addProcessingRequests, reduceProcessingRequests, null, true, 'client_id', 'client_name', 'clients');
  //     setFormDataSet(true);
  // }, []);

  //   payroll_group_name: '',
  // specific_days_per_month: 0,
  // calculate_per_day_salary: '',
  // payroll_interval: '',
  // start_month: '',
  // payroll_start_day_of_month: 0,
  // company_id: 0

  const yupSchema = Yup.object().shape({
    company_id: Yup.string()
      .notOneOf(["0"], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    payroll_group_name: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    calculate_per_day_salary: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    payroll_interval: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    start_month: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    // payroll_group_start_day_of_week: Yup.mixed()
    //     .when('payroll_interval', (payroll_interval, schema) => {
    //         if (payroll_interval === 1) {
    //             return Yup.string().required().notOneOf(["0"], "payroll_start_day_of_month cannot be '0'");
    //         } else if (payroll_interval === 2) {
    //             return Yup.array().of(Yup.string()).required().length(2, 'payroll_start_day_of_month must contain exactly 2 items');
    //         }
    //         // For values 3 and 4, no specific validation is applied to payroll_start_day_of_month
    //         return Yup.mixed().notRequired();
    //     }),
    // payroll_start_day_of_month: Yup.string().notOneOf(['0'], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
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
          innerRef={formikRef}
          onSubmit={(values, { setSubmitting }) => {
            let submitValues: any = { ...values };
            if (
              parseInt(values.payroll_interval + "") === PayrollInterval.Monthly
            ) {
              if (
                !submitValues.payroll_start_day_of_month ||
                !parseInt(submitValues.payroll_start_day_of_month + "")
              ) {
                toast.error("Please select Start Day of Month");
                setSubmitting(false);
                return;
              }
            }
            if (
              parseInt(values.payroll_interval + "") ===
              PayrollInterval.BiMonthly
            ) {
              if (
                !submitValues.payroll_start_day_of_month ||
                !parseInt(submitValues.payroll_start_day_of_month + "")
              ) {
                toast.error("Please select Start Day of Month");
                setSubmitting(false);
                return;
              }
            }
            // if (
            //   parseInt(values.payroll_interval + "") ===
            //   PayrollInterval.BiMonthly
            // ) {
            //   if (submitValues.payroll_start_day_of_month.length !== 2) {
            //     toast.error("Please select 2 days for Start Days of Month");
            //     setSubmitting(false);
            //     return;
            //   }
            //   submitValues.payroll_start_day_of_month =
            //     submitValues.payroll_start_day_of_month.join(",");
            // }
            if (id != undefined && id != 0) {
              submitValues = formValueModification(submitValues);
              addProcessingRequests();
              const keysToExtract = [
                "payroll_group_name",
                "calculate_per_day_salary",
                "payroll_interval",
                "start_month",
                "payroll_start_day_of_month",
                "company_id",
                "payroll_group_status",
                "specific_days_per_month"
              ];
              const updateValues = extractKeys(submitValues, keysToExtract);
              ServerAPI.updatePayrollGroup(updateValues, id)
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
              submitValues = formValueModification(submitValues);

              addProcessingRequests();
              ServerAPI.addPayrollGroup(submitValues)
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
            console.log("Values", formikProps.values);
            if (
              parseInt(formikProps.values.payroll_interval + "") !==
              selectedPayrollInterval
            ) {
              setSelectedPayrollInterval(
                parseInt(formikProps.values.payroll_interval + "")
              );
            }
            return (
              <div className="tabdetails">
                <p className="detailed-heading mt-3">
                  {editMode ? "Edit" : "Add New"} Payroll Group
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
                            fieldType: "textbox",
                            label: "Payroll Group Name",
                            name: "payroll_group_name",
                            placeholder: "Enter Payroll Group Name",
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
                            label: "Calculate Per Day Salary",
                            name: "calculate_per_day_salary",
                            placeholder: "Select Calculate/Day Salary",
                            options: CalculatePerDaySalaryOptions,
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    {parseInt(
                      formikProps.values.calculate_per_day_salary + ""
                    ) === PayrollCalculateperDaySalary.SpecificDays && (
                      <div className="row py-3">
                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                          <FormField
                            formik={formikProps}
                            fieldProps={{
                              fieldType: "number",
                              label: "Specific Days Per Month",
                              name: "specific_days_per_month",
                              placeholder: "Enter Specific Days per Month",
                              required: true,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "radio",
                            label: "Payroll Interval",
                            name: "payroll_interval",
                            placeholder: "Select Payroll Interval",
                            options: PayrollIntervalOptions,
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row py-2">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "radio",
                            label: "Start Month",
                            name: "start_month",
                            options: StartMonthOptions,
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    {(parseInt(formikProps.values.payroll_interval + "") ===
                      PayrollInterval.Weekly ||
                      parseInt(formikProps.values.payroll_interval + "") ===
                        PayrollInterval.FortNightly) && (
                      <div className="row py-3">
                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                          <FormField
                            formik={formikProps}
                            fieldProps={{
                              fieldType: "select",
                              label: "Start Day of the week",
                              name: "payroll_group_start_day_of_week",
                              placeholder: "Select Day",
                              options: PayrollDayOfWeek,
                              required: true,
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {parseInt(formikProps.values.payroll_interval + "") ===
                      PayrollInterval.Monthly && (
                      <div className="row py-3">
                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                          <FormField
                            formik={formikProps}
                            fieldProps={{
                              fieldType: "select",
                              label: "Payroll Start Day of the Month",
                              name: "payroll_start_day_of_month",
                              placeholder: "Enter Date",
                              required: true,
                              options: daysOfMonthOptions,
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {parseInt(formikProps.values.payroll_interval + "") ===
                      PayrollInterval.BiMonthly && (
                      <div className="row py-3">
                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                          <FormField
                            formik={formikProps}
                            fieldProps={{
                              fieldType: "select",
                              label: "Payroll Start Days of the Month",
                              name: "payroll_start_day_of_month",
                              placeholder: "Enter Date",
                              required: true,
                              options: daysOfMonthOptions,
                              //   limitedOptions: 2,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "switch",
                            label: "Status",
                            name: "payroll_group_status",
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

export default PayrollGroupsEntryDialog;
