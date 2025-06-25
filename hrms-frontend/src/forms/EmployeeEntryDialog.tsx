import { Drawer } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect, useRef, useState } from "react";
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from "../common/DataTypes";
import { InitialData } from "./InitialData";
import toast from "react-hot-toast";
import {
  extractKeys,
  getDataFromAPI,
  // getLoginCompanyID,
} from "../common/Utilities";
import { useAppStateAPI } from "../common/AppStateAPI";
import {
  API,
  EmployeeLeftType,
  EmployeeStatus,
  // Gender,
  // MaritalStatus,
  // PaymentMode,
  PayrollCalculateperDaySalary,
  ProjectStrings,
  // SalaryComponentCalculationType,
} from "../common/Constants";
import { ServerAPI } from "../common/ServerAPI";
import * as Yup from "yup";
// import { useNavigate } from "react-router";

interface EmployeeSalaryComponent {
  salary_component_id: number;
  employee_salary_component_value: string;
}

const EmployeeEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  reloadData: any;
  id?: number;
}> = ({ showDialog, closeDialog, reloadData, id }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<APIData.Employee>(
    InitialData.Employee
  );
  const formikRef = useRef<FormikProps<APIData.Employee>>(null);
  const [editMode, setEditMode] = useState(false);
  // const [clientOption, setClientOption] = useState<FormDataTypes.SelectOption[]>([]);
  // const [countryOptions, setCountryOptions] = useState<
  //   FormDataTypes.SelectOption[]
  // >([]);
  const [locationOptions, setLocationOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [departmentOptions, setDepartmentOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [attendancePolicyOptions, setAttendancePolicyOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [payrollGroupOptions, setPayrollGroupOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [superiorEmployeeOptions, setSuperiorEmployeeOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  // const [salaryGroupOptions, setSalaryGroupOptions] = useState<
  //   FormDataTypes.SelectOption[]
  // >([]);
  // const [partnerOptions, setPartnerOptions] = useState<
  //   FormDataTypes.SelectOption[]
  // >([]);
  // const [employeeOptions, setEmployeeOptions] = useState<
  //   FormDataTypes.SelectOption[]
  // >([]);
  const [formDataSet, setFormDataSet] = useState(false);
  // const [showPhilTextField, setShowPhilTextField] = useState(false);
  // const navigate = useNavigate();
  const [activeTabButton, setActiveTabButton] = useState("");
  // const [bankOption, setBankOption] = useState<FormDataTypes.SelectOption[]>(
  //   []
  // );
  // const [leavePlanOption, setleavePlanOption] = useState<
  //   FormDataTypes.SelectOption[]
  // >([]);
  const [companyOption, setCompanyOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);

  const [indexValue, setIndexValue] = useState(0);
  const [selectedCountryID, setSelectedCountryID] = useState(0);
  const [selectedStateID, setSelectedStateID] = useState(0);
  const [selectedDepartmentID, setSelectedDepartmentID] = useState(0);
  // const [selectedSalaryGroupID, setSelectedSalaryGroupID] = useState(0);
  const [employeePhoto, setEmployeePhoto] = useState("");
  // const [salaryComponents, setSalaryComponents] = useState<
  //   APIData.SalaryGroupComponent[]
  // >([]);
  const [selectedPayrollGroupID, setSelectedPayrollGroupID] = useState(0);
  const [payrollGroups, setPayrollGroups] = useState<APIData.PayrollGroup[]>(
    []
  );
  const [genderOptions, setGenderOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [maritalStatusOptions, setMaritalStatusOptions] = useState<
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
  const [designationOptions, setDesignationOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  console.log(formikRef.current?.values, "formikvalues");
  console.log(payrollGroups);

  // useEffect(() => {
  //   if (selectedSalaryGroupID && selectedSalaryGroupID !== 0) {
  //     addProcessingRequests();
  //     ServerAPI.getSalaryGroupComponents(
  //       selectedSalaryGroupID,
  //       SalaryComponentCalculationType.CommonFixedEmployeeWise
  //     )
  //       .then((response) => {
  //         if (response.salary_group_components !== undefined) {
  //           setSalaryComponents(response.salary_group_components);
  //         }
  //       })
  //       .finally(() => {
  //         reduceProcessingRequests();
  //         setFormDataSet(true);
  //       });
  //   } else {
  //     setFormDataSet(true);
  //   }
  // }, [selectedSalaryGroupID]);

  useEffect(() => {
    if (selectedPayrollGroupID && selectedPayrollGroupID !== 0) {
      addProcessingRequests();
      ServerAPI.getFilteredPayrollGroups(
        selectedPayrollGroupID,
        PayrollCalculateperDaySalary.AsDefinedInEmployee
      )
        .then((response) => {
          if (response.payroll_groups !== undefined) {
            setPayrollGroups(response.payroll_groups);
          }
        })
        .finally(() => {
          reduceProcessingRequests();
          setFormDataSet(true);
        });
    } else {
      setFormDataSet(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPayrollGroupID]);

  // useEffect(() => {
  //   if (getLoginCompanyID()) {
  //     addProcessingRequests();
  //     ServerAPI.getCompanyDetail(getLoginCompanyID())
  //       .then((response) => {
  //         if (response) {
  //           let countryName = response.country_name;
  //           console.log(countryName, "cn");
  //           if (countryName === "Philippines") {
  //             setShowPhilTextField(true);
  //           } else {
  //             setShowPhilTextField(false);
  //           }
  //         }
  //       })
  //       .finally(() => {
  //         reduceProcessingRequests();
  //         setFormDataSet(true);
  //       });
  //   } else {
  //     setFormDataSet(true);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [getLoginCompanyID()]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountryID]);

  useEffect(() => {
    if (selectedDepartmentID) {
      let params: { [k: string]: any } = {};
      params["company_department_id"] = selectedDepartmentID;
      getDataFromAPI(
        API.EndPoint.CLIENT_DESIGNATION_LIST,
        setDesignationOptions,
        addProcessingRequests,
        reduceProcessingRequests,
        params,
        true,
        "company_designation_id",
        "company_designation_name",
        "data"
        // "designations"
      );
    } else {
      setDesignationOptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDepartmentID]);

  const handleTabClick = (value: string, index: number) => {
    setActiveTabButton(value);
    setIndexValue(index);
  };

  // const salaryOptions = [
  //     { label: "Annual CTC", value: "ANNUAL" },
  //     { label: "Monthly Salary", value: "MONTH" },
  //     { label: "Per Day's Salary", value: "DAY" },
  // ];
  // const genderOptions = [
  //   { label: "Male", value: Gender.Male + "" },
  //   { label: "Female", value: Gender.Female + "" },
  //   { label: "Transgender", value: Gender.Transgender + "" },
  // ];
  // const maritalStatusOptions = [
  //   { label: "Single", value: MaritalStatus.Single + "" },
  //   { label: "Married", value: MaritalStatus.Married + "" },
  //   { label: "Widowed", value: MaritalStatus.Widowed + "" },
  //   { label: "Divorsed", value: MaritalStatus.Widowed + "" },
  // ];
  // const paymodeOptions = [
  //   { label: "Bank Transfer", value: PaymentMode.BankTransfer + "" },
  //   { label: "Cheque", value: PaymentMode.Cheque + "" },
  //   { label: "Cash", value: PaymentMode.Cash + "" },
  // ];
  const paymodeOptions = [
    { label: "Bank Transfer", value: "Bank Transfer" },
    { label: "Cheque", value: "Cheque" },
    { label: "Cash", value: "Cash" },
  ];

  const currentDate = new Date();
  const aboveOrEqualsEighteenYears = new Date(
    currentDate.getFullYear() - 18,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const keysToExtract = [
    "employee_first_name",
    "employee_last_name",
    "employee_middle_name",
    "employee_photo",
    "employee_mobile",
    "employee_email",
    "employee_dob",
    "employee_father_name",
    "employee_mother_name",
    "employee_spouse_name",
    "employee_marital_status",
    "employee_gender",
    "employee_address_city",
    "employee_address_country_id",
    "employee_address_state_id",
    "employee_address_line1",
    "employee_address_line2",
    "employee_address_postal_code",
    "employee_login_available",
    "employee_login_password",
    "employee_doj",
    "department_id",
    "designation_id",
    "employee_status",
    "superior_employee_id",
    "employee_monthly_salary",
    "employee_expected_date_of_leaving",
    "employee_is_contract",
    "employee_working_for_client",
    "employee_bank_account_bank_branch",
    "employee_bank_account_name",
    "employee_bank_account_number",
    "employee_in_notice_period",
    "employee_salary_payment_mode",
    "attendance_policy_id",
    "payroll_group_id",
    "employee_code",
    "is_superior_employee",
    "company_id",
    "bank_name",
    "employee_emergency_contact_number",
    "employee_emergency_contact_name",
    "ot_available"
  ];
  // const currencyOptions = [
  //     { label: "PHP", value: "Philippine" },
  //     { label: "INR", value: "india" },
  // ];
  const loginOptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  const superiorOptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  const otOptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  const contractOptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];
  const clientOptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];
  const noticePeriodOptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];
  const employeeStatusOptions = [
    { label: "Active", value: EmployeeStatus.Active + "" },
    { label: "Inactive", value: EmployeeStatus.Inactive + "" },
    // { label: "Left", value: EmployeeStatus.Left + "" },
  ];
  // const employeeStatusOptions = [
  //   { label: "Active", value: EmployeeStatus.Probation + "" },
  //   { label: "Inactive", value: EmployeeStatus.Confirmed + "" },
  //   // { label: "Left", value: EmployeeStatus.Left + "" },
  // ];
  const employeeLeftTypeOptions = [
    { label: "Relived", value: EmployeeLeftType.Relived + "" },
    { label: "Terminated", value: EmployeeLeftType.Terminated + "" },
    { label: "Abscond", value: EmployeeLeftType.Abscond + "" },
  ];

  // const bloodGroupOptions = [
  //   { label: "A+", value: "A+" },
  //   { label: "A-", value: "A-" },
  //   { label: "B+", value: "B+" },
  //   { label: "B-", value: "B-" },
  //   { label: "O+", value: "O+" },
  //   { label: "O-", value: "O-" },
  //   { label: "AB+", value: "AB+" },
  //   { label: "AB-", value: "AB-" },
  // ];

  const employeeTabItem = [
    { label: "personal details" },
    { label: "professional details" },
    { label: "position" },
    //{ label: "documents" },
    //{ label: "past experience" },
  ];

  const validateAndNavigate = async (
    formikProps: any,
    indexValue: number,
    activeButton: string,
    fields: string[]
  ) => {
    formikProps.setTouched(
      fields.reduce((acc: any, field) => {
        acc[field] = true;
        return acc;
      }, {}),
      true
    );

    const errors = await formikProps.validateForm();
    const tabErrors = Object.keys(errors).filter((key) => fields.includes(key));
    console.log("validating errors on click next", errors);
    if (tabErrors.length === 0) {
      setIndexValue(indexValue);
      setActiveTabButton(activeButton);
      // setActiveTabButton("position");
    }
  };
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStateID]);

  useEffect(() => {
    console.log("location options", locationOptions);
  }, [locationOptions]);

  useEffect(() => {
    setFormDataSet(true);
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
      API.EndPoint.CLIENT_COMPANY_LIST,
      setLocationOptions,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "city_id",
      "city_name",
      "data",
      "companies"
    );

    getDataFromAPI(
      API.EndPoint.CLIENT_DEPARTMENT_LIST,
      setDepartmentOptions,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "company_department_id",
      "company_department_name",
      "data",
      "departments"
    );
    getDataFromAPI(
      API.EndPoint.ATTENDANCE_POLICY,
      setAttendancePolicyOptions,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "company_attendance_policy_id",
      "policy_name",
      "data",
      "attendance_policy"
    );
    getDataFromAPI(
      API.EndPoint.PAYROLL_GROUP,
      setPayrollGroupOptions,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "company_payroll_group_id",
      "payroll_group_name",
      "data",
      "attendance_payroll"
    );

    getDataFromAPI(
      API.EndPoint.SUPERIOR_EMPLOYEES_LIST,
      setSuperiorEmployeeOptions,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "employee_id",
      "employee_code",
      "data",
      "superior_employee"
    );
    getDataFromAPI(
      API.EndPoint.MASTER_GENDER,
      setGenderOptions,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "gender_id",
      "gender_name",
      "data"
    );
    getDataFromAPI(
      API.EndPoint.MASTER_MARITAL_STATUS,
      setMaritalStatusOptions,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "marital_id",
      "marital_name",
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

    // addProcessingRequests();
    // ServerAPI.executeAPI(
    //   API.EndPoint.EMPLOYEES_LIST,
    //   ServerAPI.APIMethod.GET,
    //   true,
    //   null
    // )
    //   .then((response) => {
    //     if (response.data !== undefined && response.message) {
    //       let supEmployees: FormDataTypes.SelectOption[] = [
    //         { label: "No Superior", value: "0" },
    //       ];
    //       response.data.forEach((item: any) =>
    //         supEmployees.push({
    //           label: `${item.employee.employee_first_name} ${item.employee.employee_last_name}`,
    //           value: item.employee.employee_id,
    //         })
    //       );
    //       setEmployeeOptions(supEmployees);
    //       // toast.success(response.message);
    //     } else {
    //       alert("Something Went Wrong");
    //     }
    //   })
    //   .finally(() => {
    //     reduceProcessingRequests();
    //     setFormDataSet(true);
    //   });
    // setFormDataSet(true);

    // setSalaryComponents([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      addProcessingRequests();
      ServerAPI.getEmployeeDetails(id)
        .then((response) => {
          if (response) {
            const data = {
              employee_login_available:
                response.employee_login_available === true ? "1" : "0",
              employee_status:
                response.employee_status === "Active" ? "1" : "0",
              employee_in_notice_period:
                response.employee_in_notice_period === true ? "1" : "0",
              is_superior_employee:
                response.is_superior_employee === true ? "1" : "0",
              ot_available: response.ot_available === true ? "1" : "0",
              employee_working_for_client:
                response.employee_working_for_client === true ? "1" : "0",
              employee_is_contract:
                response.employee_is_contract === true ? "1" : "0",
            };

            setInitialValue({ ...response, ...data });
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

  let yupSchema = Yup.object().shape({
    employee_first_name: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    employee_last_name: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    employee_mobile: Yup.string()
      .matches(/^\+?[1-9]\d{1,14}$/, {
        message: "Please enter a valid number.",
        excludeEmptyString: false,
      }).min(10,"Minimum 10 digit required").max(14,"Maximum 14 digit allowed")
      .required(ProjectStrings.ValidationRequired),
    employee_code: Yup.string().required(ProjectStrings.ValidationRequired),
    employee_address_postal_code: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    employee_emergency_contact_number: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, {
      message: "Please enter a valid number.",
      excludeEmptyString: false,
    }).min(10,"Minimum 10 digit required").max(14,"Maximum 14 digit allowed")
    .required(ProjectStrings.ValidationRequired),
    // employee_emergency_contact_number: Yup.string().required(
    //   ProjectStrings.ValidationRequired
    // ),
    employee_emergency_contact_name: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    employee_monthly_salary: Yup.number().required(
      ProjectStrings.ValidationRequired
    ),
    designation_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    department_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    attendance_policy_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    payroll_group_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    employee_address_city: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    employee_address_state_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    employee_doj: Yup.string().required(ProjectStrings.ValidationRequired),
    employee_dob: Yup.string().required(ProjectStrings.ValidationRequired),
    employee_gender: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    employee_email: Yup.string()
      .matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.(com|in)$/, {
        message: "Please enter a valid Email",
        excludeEmptyString: false,
      })
      .required(ProjectStrings.ValidationRequired),
    employee_address_line1: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    employee_address_country_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    company_id: Yup.string()
      .notOneOf(["0"], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),

      employee_login_password: Yup.string().when(
        "employee_login_available",
        ([employee_login_available], schema) => {
          if (employee_login_available === "1") {
            return schema.required(ProjectStrings.ValidationRequired);
          }
          return schema.notRequired();
        }
      ),
      employee_expected_date_of_leaving: Yup.string().when(
        "employee_in_notice_period",
        ([employee_in_notice_period], schema) => {
          if (employee_in_notice_period === "1") {
          return schema.required(ProjectStrings.ValidationRequired);

        }
        return schema.notRequired();
        }
      ),
    // employee_login_password: Yup.string().when(
    //   "employee_login_available",
    //   ([employee_login_available], schema) => {
    //     if (employee_login_available === "1")
    //       return Yup.string().required(ProjectStrings.ValidationRequired);
    //     return schema;
    //   }
    // ),
    // employee_expected_date_of_leaving: Yup.string().when(
    //   "employee_in_notice_period",
    //   ([employee_in_notice_period], schema) => {
    //     if (employee_in_notice_period === "1")
    //       return Yup.string().required(ProjectStrings.ValidationRequired);
    //     return schema;
    //   }
    // ),


    // employee_date_of_confirmation: Yup.string().when(
    //   "employee_status",
    //   ([employee_status], schema) => {
    //     if (parseInt(employee_status) === EmployeeStatus.Probation)
    //       return Yup.string().required(ProjectStrings.ValidationRequired);
    //     return schema;
    //   }
    // ),
   
    // employee_date_of_reliving: Yup.string().when(
    //   "employee_status",
    //   ([employee_status], schema) => {
    //     if (parseInt(employee_status) === EmployeeStatus.Left)
    //       return Yup.string().required(ProjectStrings.ValidationRequired);
    //     return schema;
    //   }
    // ),
    // employee_status_left_type: Yup.string().when(
    //   "employee_status",
    //   ([employee_status], schema) => {
    //     if (parseInt(employee_status) === EmployeeStatus.Left)
    //       return Yup.number()
    //         .notOneOf([0], ProjectStrings.ValidationSelect)
    //         .required(ProjectStrings.ValidationRequired);
    //     return schema;
    //   }
    // ),

    // employee_contract_partner_id: Yup.number().when('employee_is_contract', ([employee_is_contract], schema) => {
    //     console.log('yup', parseInt(employee_is_contract));
    //     if (parseInt(employee_is_contract) === 1) {
    //         return Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired);
    //     } else {
    //         return schema.notRequired();
    //     }
    // }),
    // employee_client_partner_id: Yup.number().when('employee_working_for_client', ([employee_working_for_client], schema) => {
    //     if (parseInt(employee_working_for_client) === 1) {
    //         return Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired);
    //     } else {
    //         return schema.notRequired();
    //     }
    // }),
  });

  const fieldNamesToValidate = {
    personalDetails:[
      "employee_emergency_contact_number",
      "employee_dob",
      "employee_email",
      "employee_mobile",
      "employee_code",
      "employee_last_name",
      "employee_first_name",
      "employee_address_line1",
      "employee_address_country_id",
      "employee_address_state_id",
      "employee_address_city",
      "employee_address_postal_code",
      "employee_emergency_contact_name",
    ],
    professionalDetails:[
      "department_id",
      "designation_id",
      "employee_doj",
    ],
    // position:[]
  }

  return (
    <>
      <Drawer
        anchor="right"
        open={showDialog}
        onClose={closeDialog}
        className="drawer-max"
      >
        {formDataSet && (
          <Formik
            enableReinitialize={true}
            validateOnChange={false}
            validationSchema={yupSchema}
            initialValues={initialValue}
            innerRef={formikRef}
            onSubmit={(values, { setSubmitting }) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const employeeSalaryComponentValues: EmployeeSalaryComponent[] =
                [];

              // salaryComponents.forEach((component, index) => {
              //   const employeeSalaryComponentValue =
              //     values.employee_salary_component_values[index]
              //       ?.employee_salary_component_value;

              //   employeeSalaryComponentValues.push({
              //     salary_component_id: component.salary_component_id,
              //     employee_salary_component_value:
              //       employeeSalaryComponentValue || "",
              //   });
              // });
              let submitValues: any = {
                ...values,
                // employee_salary_component_values: employeeSalaryComponentValues,
              };
              // submitValues['employee_superior_id'] = null;
              // submitValues['company_id'] = getLoginCompanyID();

              submitValues["employee_login_available"] =
                submitValues["employee_login_available"] === "1" ? true : false;
              submitValues["employee_status"] =
                submitValues["employee_status"] === "1" ? "Active" : "Inactive";
              submitValues["employee_in_notice_period"] =
                submitValues["employee_in_notice_period"] === "1"
                  ? true
                  : false;
              submitValues["employee_expected_date_of_leaving"] =
                submitValues["employee_in_notice_period"] === true
                  ? submitValues["employee_expected_date_of_leaving"]
                  : "";
              submitValues["is_superior_employee"] =
                submitValues["is_superior_employee"] === "1" ? true : false;
              submitValues["ot_available"] =
                submitValues["ot_available"] === "1" ? true : false;
              submitValues["employee_working_for_client"] =
                submitValues["employee_working_for_client"] === 1
                  ? true
                  : false;
              submitValues["employee_is_contract"] =
                submitValues["employee_is_contract"] === 1 ? true : false;
              submitValues["employee_mobile"] =
                submitValues["employee_mobile"].toString();
              // submitValues["employee_login_available"] = parseInt(
              //   submitValues["employee_login_available"]
              // );
              // submitValues["is_superior_employee"] = parseInt(
              //   submitValues["is_superior_employee"]
              // );
              // submitValues["employee_gender"] = parseInt(
              //   submitValues["employee_gender"]
              // );
              // submitValues["employee_marital_status"] = parseInt(
              //   submitValues["employee_marital_status"]
              // );
              // submitValues["employee_is_contract"] = parseInt(
              //   submitValues["employee_is_contract"]
              // );
              // submitValues["employee_working_for_client"] = parseInt(
              //   submitValues["employee_working_for_client"]
              // );

              // submitValues["employee_salary_payment_mode"] = parseInt(
              //   submitValues["employee_salary_payment_mode"]
              // );

              // submitValues["employee_status"] = parseInt(
              //   submitValues["employee_status"]
              // );

              //submitValues['employee_photo'] === '123.png';

              // submitValues["employee_bank_identification_number"] = "134";
              // submitValues["employee_philip_philhealth_number"] =
              //   submitValues["employee_philip_philhealth_number"] + "";
              // submitValues["employee_philip_pag_Ibig_number"] =
              //   submitValues["employee_philip_pag_Ibig_number"] + "";
              // submitValues["employee_philip_sss_number"] =
              //   submitValues["employee_philip_sss_number"] + "";
              // submitValues["employee_mobile"] =
              //   submitValues["employee_mobile"] + "";
              // submitValues["employee_emergency_contact_number"] =
              //   submitValues["employee_emergency_contact_number"] + "";
              // submitValues["employee_tax_identification_number"] =
              //   submitValues["employee_tax_identification_number"].toString();
              // submitValues["employee_address_postal_code"] =
              //   submitValues["employee_address_postal_code"].toString();
              // submitValues["employee_salary_basic_pay"] =
              //   submitValues["employee_salary_basic_pay"].toString();
              //submitValues['employee_blood_group'] === 'o';
              // submitValues["employee_photo_filename"] = employeePhoto;
              // delete submitValues["employee_address_country_id"];
              // if (parseInt(submitValues["superior_employee_id"]) === 0) {
              //   submitValues["superior_employee_id"] = null;
              // }
              // if (submitValues["employee_date_of_confirmation"] === "") {
              //   submitValues["employee_date_of_confirmation"] = null;
              // }
              // if (submitValues["employee_in_notice_period"] === "1") {
              //   submitValues["employee_expected_date_of_leaving"] = submitValues["employee_in_notice_period"] === "1" ? submitValues["employee_expected_date_of_leaving"] : ''
              // }
              // if (submitValues["employee_expected_date_of_leaving"] === "") {
              //   submitValues["employee_expected_date_of_leaving"] = null;
              // }

              // submitValues['employee_date_of_confirmation'] = '2000-02-02';
              // submitValues['employee_date_of_reliving'] = '2024-09-09';

              console.log(submitValues, "Submit value");
              console.log(initialValue, "initial value");

              // if (submitValues['employee_login_available'] === 1) {
              //     if (!submitValues['employee_login_password']) {
              //         toast.error("Login Password Required")
              //         setSubmitting(false);
              //         return
              //     }

              // if (parseInt(submitValues["employee_is_contract"]) === 1) {
              //   if (!submitValues["employee_contract_partner_id"]) {
              //     toast.error("Contract Partner Id Required");
              //     setSubmitting(false);
              //     return;
              //   }
              // }

              // if (payrollGroups.length > 0 && payrollGroups[0].payroll_group_calc_per_day_salary_by === PayrollCalculateperDaySalary.AsDefinedInEmployee) {
              //     if (!submitValues['employee_month_salary_days'] || submitValues['employee_month_salary_days'] > 31) {
              //         toast.error("Employee Month Salary Days Should be Greater than 0 and Less than 31")
              //         setSubmitting(false);
              //         return
              //     }
              // }

              // if (parseInt(submitValues["employee_working_for_client"]) === 1) {
              //   if (!submitValues["employee_client_partner_id"]) {
              //     toast.error("Client Partner Id Required");
              //     setSubmitting(false);
              //     return;
              //   }
              // }
              // if (
              //   parseInt(submitValues["employee_status"]) ===
              //   EmployeeStatus.Confirmed
              // ) {
              //   if (!submitValues["employee_date_of_confirmation"]) {
              //     toast.error("Date Of Confirmation Required");
              //     setSubmitting(false);
              //     return;
              //   }
              // }

              console.log(submitValues);
              // if (showPhilTextField) {
              //   if (!submitValues["employee_philip_sss_number"]) {
              //     toast.error("Employee SSS Number Required");
              //     setSubmitting(false);
              //     return;
              //   }
              //   if (!submitValues["employee_philip_pag_Ibig_number"]) {
              //     toast.error("Employee Ibig Required");
              //     setSubmitting(false);
              //     return;
              //   }
              //   if (!submitValues["employee_philip_philhealth_number"]) {
              //     toast.error("Employee Philheath Required");
              //     setSubmitting(false);
              //     return;
              //   }
              // } else {
              //   submitValues["employee_philip_philhealth_number"] = null;
              //   submitValues["employee_philip_pag_Ibig_number"] = null;
              //   submitValues["employee_philip_sss_number"] = null;
              // }

              if (id != undefined && id != 0) {
                addProcessingRequests();

                const updateValues = extractKeys(submitValues, keysToExtract);
                ServerAPI.updateEmployee(updateValues, id)
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
                // submitValues["company_id"] = getLoginCompanyID();
                ServerAPI.addEmployee(submitValues)
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
              if (
                formikProps.values.employee_address_country_id &&
                formikProps.values.employee_address_country_id !==
                  selectedCountryID
              ) {
                setSelectedCountryID(
                  parseInt(formikProps.values.employee_address_country_id + "")
                );
                console.log(
                  "country_id",
                  formikProps.values.employee_address_country_id
                );
              } else if (
                formikProps.values.payroll_group_id &&
                formikProps.values.payroll_group_id !== selectedPayrollGroupID
              ) {
                setSelectedPayrollGroupID(
                  parseInt(formikProps.values.payroll_group_id + "")
                );
              } else if (
                formikProps.values.employee_photo &&
                formikProps.values.employee_photo !== employeePhoto
              ) {
                const fileExtension = formikProps.values.employee_photo
                  .split(".")
                  .pop();
                if (fileExtension) {
                  setEmployeePhoto(fileExtension);
                  console.log(fileExtension, "photo");
                }
              }
              // else if (
              //   formikProps.values.salary_group_id &&
              //   formikProps.values.salary_group_id !== selectedSalaryGroupID
              // ) {
              //   setSelectedSalaryGroupID(
              //     parseInt(formikProps.values.salary_group_id + "")
              //   );
              // }

              if (
                formikProps.values.employee_address_state_id &&
                formikProps.values.employee_address_state_id !== selectedStateID
              ) {
                setSelectedStateID(
                  parseInt(formikProps.values.employee_address_state_id + "")
                );
              }
              if (
                formikProps.values.department_id &&
                formikProps.values.department_id !== selectedDepartmentID
              ) {
                setSelectedDepartmentID(
                  parseInt(formikProps.values.department_id + "")
                );
              }

              return (
                <div className="employee-personal-detail-form">
                  <div className="tabdetails">
                    <p className="detailed-heading mt-3">
                      {editMode ? "Edit" : "Add"} Employee
                    </p>
                    <div className="custom-border-grey my-2"></div>

                    <Form className=" ">
                      <div className="px-2 form-field-container">
                        {employeeTabItem && (
                          <div className="toggle-buttons mt-3">
                            {employeeTabItem.map((tab, index) => (
                              <button
                                key={index}
                                className={`toggle-button ${
                                  activeTabButton === tab.label ||
                                  (index === 0 && !activeTabButton)
                                    ? "active"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  console.log("Tab button clicked",tab.label, index)
                                  e.preventDefault();
                                  handleTabClick(tab.label, index);
                                }}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>
                        )}
                        {indexValue === 0 && (
                          <div className="personal-details">
                            <div className="personal-detail-grid">
                              <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                  <FormField
                                    formik={formikProps}
                                    fieldProps={{
                                      fieldType: "textbox",
                                      label: "First Name",
                                      name: "employee_first_name",
                                      placeholder: "Enter First Name",
                                      required: true,
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                  <FormField
                                    formik={formikProps}
                                    fieldProps={{
                                      fieldType: "textbox",
                                      label: "Middle Name",
                                      name: "employee_middle_name",
                                      placeholder: "Enter Middle Name",
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                  <FormField
                                    formik={formikProps}
                                    fieldProps={{
                                      fieldType: "textbox",
                                      label: "Last Name",
                                      name: "employee_last_name",
                                      placeholder: "Enter Last Name",
                                      required: true,
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="row py-3  personal-detail-field">
                                <div className="text-field-empty-custom-user">
                                  <FormField
                                    formik={formikProps}
                                    fieldProps={{
                                      fieldType: "textbox",
                                      label: "Employee Code",
                                      name: "employee_code",
                                      placeholder: "Enter Employee Code",
                                      required: true,
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="row py-3  personal-detail-field">
                                <div className="text-field-empty-custom-user">
                                  <FormField
                                    formik={formikProps}
                                    fieldProps={{
                                      fieldType: "number",
                                      label: "Mobile Number",
                                      name: "employee_mobile",
                                      placeholder: "Enter Mobile Number",
                                      required: true,
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="row py-3  personal-detail-field">
                                <div className="text-field-empty-custom-user">
                                  <FormField
                                    formik={formikProps}
                                    fieldProps={{
                                      fieldType: "textbox",
                                      label: "Official Email",
                                      name: "employee_email",
                                      placeholder: "Enter Email",
                                      required: true,
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="row py-3  personal-detail-field">
                                <div className="text-field-empty-custom-user">
                                  <FormField
                                    formik={formikProps}
                                    fieldProps={{
                                      fieldType: "select",
                                      label: "Gender",
                                      name: "employee_gender",
                                      placeholder: "Select Gender",
                                      required: true,
                                      options: genderOptions,
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="row py-3  personal-detail-field">
                                <div className="text-field-empty-custom-user">
                                  <FormField
                                    formik={formikProps}
                                    fieldProps={{
                                      fieldType: "datepicker",
                                      label: "Date Of Birth",
                                      name: "employee_dob",
                                      placeholder: "Select Date Of Birth",
                                      required: true,
                                      allowPastDate: true,
                                      allowFutureDate: false,
                                      customAllowDate: true,
                                      customAllowDateValue: aboveOrEqualsEighteenYears
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="row py-3  personal-detail-field">
                                <div className="text-field-empty-custom-user">
                                  <FormField
                                    formik={formikProps}
                                    fieldProps={{
                                      fieldType: "select",
                                      label: "Maritial Status",
                                      name: "employee_marital_status",
                                      placeholder: "Select Maritial Status",
                                      options: maritalStatusOptions,
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="row py-3  personal-detail-field">
                                <div className="text-field-empty-custom-user">
                                  <FormField
                                    formik={formikProps}
                                    fieldProps={{
                                      fieldType: "fileupload",
                                      name: "employee_photo",
                                      label: "Employee Photo",
                                      accept: "image/*",
                                      required: true,
                                      // previewImage: {formikProps.values.employee_photo !== null ? `formikProps.values.employee_photo` : undefined},
                                      previewImage: `${formikProps.values.employee_photo}`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* <div><hr /></div>
                                                        <div className='permanant-address'>
                                                            <div className='permanant-address-heading'>permanent address</div>
                                                            <div className='personal-detail-grid'>
                                                                <div className="row py-3 personal-detail-field">
                                                                    <div className="  text-field-empty-custom-user">
                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Address Line 1", name: "employee_address_line1", placeholder: "enter Company Address", required: true }} />
                                                                    </div>
                                                                </div>

                                                                <div className="row py-3 personal-detail-field">
                                                                    <div className="  text-field-empty-custom-user">
                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Address Line 2", name: "employee_address_line2", placeholder: "enter Company Address", required: true }} />
                                                                    </div>
                                                                </div>

                                                                <div className="row py-3 personal-detail-field">
                                                                    <div className="  text-field-empty-custom-user">
                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: " city", name: "employee_address_city", placeholder: "enter city", required: true }} />
                                                                    </div>
                                                                </div>

                                                                <div className="row py-3  personal-detail-field">
                                                                    <div className="text-field-empty-custom-user">
                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Country", name: "transmission_type_uuid", placeholder: "Select country", required: true, options: countryOptions }} />
                                                                    </div>
                                                                </div>

                                                                <div className="row py-3  personal-detail-field">
                                                                    <div className="text-field-empty-custom-user">
                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "State", name: "company_address_postal_code", placeholder: "select state", required: true, options: stateOptions }} />
                                                                    </div>
                                                                </div>

                                                                <div className="row py-3  personal-detail-field">
                                                                    <div className="text-field-empty-custom-user">
                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "  Zip / Postcode", name: "employee_address_postal_code", placeholder: "Enter postcode", required: true }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> */}

                            <div>
                              <hr />
                            </div>
                            <div className="permanant-address">
                              <div className="permanant-address-heading">
                                Address
                              </div>
                              <div className="personal-detail-grid">
                                <div className="row py-3 personal-detail-field">
                                  <div className="  text-field-empty-custom-user">
                                    <FormField
                                      formik={formikProps}
                                      fieldProps={{
                                        fieldType: "textbox",
                                        label: "Address Line 1",
                                        name: "employee_address_line1",
                                        placeholder: "Enter Address Line 1",
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="row py-3 personal-detail-field">
                                  <div className="  text-field-empty-custom-user">
                                    <FormField
                                      formik={formikProps}
                                      fieldProps={{
                                        fieldType: "textbox",
                                        label: "Address Line 2",
                                        name: "employee_address_line2",
                                        placeholder: "Enter Address Line 2",
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="row py-3  personal-detail-field">
                                  <div className="text-field-empty-custom-user">
                                    <FormField
                                      formik={formikProps}
                                      fieldProps={{
                                        fieldType: "select",
                                        label: "Country Name",
                                        name: "employee_address_country_id",
                                        placeholder: "Select Country Name",
                                        options: countryOption,
                                        required: true,
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="row py-3  personal-detail-field">
                                  <div className="text-field-empty-custom-user">
                                    <FormField
                                      formik={formikProps}
                                      fieldProps={{
                                        fieldType: "select",
                                        label: "State Name",
                                        name: "employee_address_state_id",
                                        placeholder: "Select State Name",
                                        required: true,
                                        options: stateOptions,
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="row py-3 personal-detail-field">
                                  <div className="  text-field-empty-custom-user">
                                    <FormField
                                      formik={formikProps}
                                      fieldProps={{
                                        fieldType: "select",
                                        label: "City Name",
                                        name: "employee_address_city",
                                        placeholder: "Select City Name",
                                        required: true,
                                        options: cityOptions,
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="row py-3  personal-detail-field">
                                  <div className="text-field-empty-custom-user">
                                    <FormField
                                      formik={formikProps}
                                      fieldProps={{
                                        fieldType: "number",
                                        label: "  Zip / Postcode",
                                        name: "employee_address_postal_code",
                                        placeholder: "Enter Postcode",
                                        required: true,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <hr />
                            </div>
                            <div className="permanant-address">
                              <div className="personal-detail-grid">
                                {/* <div className="row py-3 personal-detail-field">
                                  <div className="  text-field-empty-custom-user">
                                    <FormField
                                      formik={formikProps}
                                      fieldProps={{
                                        fieldType: "select",
                                        label: "Blood Group",
                                        name: "employee_blood_group",
                                        placeholder: "Select Blood Group",
                                        options: bloodGroupOptions,
                                      }}
                                    />
                                  </div>
                                </div> */}

                                <div className="row py-3 personal-detail-field">
                                  <div className="  text-field-empty-custom-user">
                                    <FormField
                                      formik={formikProps}
                                      fieldProps={{
                                        fieldType: "textbox",
                                        label: "Father’s Name",
                                        name: "employee_father_name",
                                        placeholder: "  Enter Father’s Name",
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="row py-3  personal-detail-field">
                                  <div className="text-field-empty-custom-user">
                                    <FormField
                                      formik={formikProps}
                                      fieldProps={{
                                        fieldType: "textbox",
                                        label: "Mother’s Name",
                                        name: "employee_mother_name",
                                        placeholder: "  Enter Mother Name",
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="row py-3  personal-detail-field">
                                  <div className="text-field-empty-custom-user">
                                    <FormField
                                      formik={formikProps}
                                      fieldProps={{
                                        fieldType: "textbox",
                                        label: "Spouse Name",
                                        name: "employee_spouse_name",
                                        placeholder: "  Enter Spouse Name",
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="row py-3  personal-detail-field">
                                  <div className="text-field-empty-custom-user">
                                    <FormField
                                      formik={formikProps}
                                      fieldProps={{
                                        fieldType: "number",
                                        label: "Emergency Contact Number",
                                        name: "employee_emergency_contact_number",
                                        placeholder:
                                          "Enter Emergency Contact Number",
                                        required: true,
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="row py-3  personal-detail-field">
                                  <div className="text-field-empty-custom-user">
                                    <FormField
                                      formik={formikProps}
                                      fieldProps={{
                                        fieldType: "textbox",
                                        label: "Emergency Contact Name",
                                        name: "employee_emergency_contact_name",
                                        placeholder:
                                          "Enter Emergency Contact Name",
                                        required: true,
                                      }}
                                    />
                                  </div>
                                </div>
                                {/* <div className="row py-3  personal-detail-field">
                                                                    <div className="text-field-empty-custom-user">
                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Tax Identification Number", name: "employee_tax_identification_number", placeholder: "Enter Tax Identification Number", required: true }} />
                                                                    </div>
                                                                </div> */}
                                {/* {showPhilTextField && (
                                  <>
                                    <div className="row py-3 personal-detail-field">
                                      <div className="text-field-empty-custom-user">
                                        <FormField
                                          formik={formikProps}
                                          fieldProps={{
                                            fieldType: "textbox",
                                            label: "Employee SSS Number",
                                            name: "employee_philip_sss_number",
                                            placeholder:
                                              "Enter Employee SSS Number",
                                            required: true,
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className="row py-3 personal-detail-field">
                                      <div className="text-field-empty-custom-user">
                                        <FormField
                                          formik={formikProps}
                                          fieldProps={{
                                            fieldType: "textbox",
                                            label: "Employee IBIG Number",
                                            name: "employee_philip_pag_Ibig_number",
                                            placeholder:
                                              "Enter Employee IBIG Number",
                                            required: true,
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className="row py-3 personal-detail-field">
                                      <div className="text-field-empty-custom-user">
                                        <FormField
                                          formik={formikProps}
                                          fieldProps={{
                                            fieldType: "textbox",
                                            label: "Employee Philheath Number",
                                            name: "employee_philip_philhealth_number",
                                            placeholder:
                                              "Enter Employee Philheath Number",
                                            required: true,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )} */}
                              </div>
                            </div>

                            <div className="row btn-form-submit">
                              <button
                                type="button"
                                className="button2"
                                disabled={formikProps.isSubmitting}
                                onClick={() => {
                                  // setIndexValue(1);
                                  // setActiveTabButton("professional details");
                                  validateAndNavigate(
                                    formikProps,
                                    1,
                                    "professional details",
                                    fieldNamesToValidate.personalDetails
                                  );
                                  // formikProps.submitForm();
                                  // if (!formikProps.isValid) {
                                  //     toast.error("Please ensure all fields are Filled and Valid!");
                                  // }
                                }}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}

                        {indexValue === 1 && (
                          <div className="position-history">
                            <div className="employee-personal-detail-form">
                              <div className="tabdetails">
                                <Form className=" ">
                                  <div className="px-2 form-field-container">
                                    <div className="personal-detail-grid">
                                      <div className="row py-3 personal-detail-field radio-section">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "radio",
                                              label: "Login available",
                                              name: "employee_login_available",
                                              options: loginOptions,
                                              required: true,
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className="row py-3 personal-detail-field radio-section">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "radio",
                                              label: " Is RM",
                                              name: "is_superior_employee",
                                              options: superiorOptions,
                                              required: true,
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className="row py-3 personal-detail-field radio-section">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "radio",
                                              label: "OT Available",
                                              name: "ot_available",
                                              options: otOptions,
                                              required: true,
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {formikProps.values.employee_login_available.toString() ===
                                        "1" && (
                                        <div className="row py-3 personal-detail-field">
                                          <div className="text-field-empty-custom-user">
                                            <FormField
                                              formik={formikProps}
                                              fieldProps={{
                                                fieldType: "password",
                                                label: "Login password",
                                                name: "employee_login_password",
                                                placeholder: "Enter Password",
                                                required: true,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      )}
                                      {/* <div className="row py-3 personal-detail-field">
                                        <div className="  text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "select",
                                              label: "Leave Plan",
                                              name: "leave_plan_id",
                                              placeholder: "Select Leave Plan",
                                              options: leavePlanOption,
                                              required: true,
                                            }}
                                          />
                                        </div>
                                      </div> */}
                                      <div className="row py-3  personal-detail-field">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "datepicker",
                                              label: "Date Of Joining",
                                              name: "employee_doj",
                                              placeholder:
                                                "Select Date Of Joining",
                                              required: true,
                                              allowFutureDate: true,
                                              allowPastDate: true,
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className="row py-3  personal-detail-field">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "select",
                                              label: "Current Status",
                                              name: "employee_status",
                                              placeholder: "Select Status",
                                              required: true,
                                              options: employeeStatusOptions,
                                            }}
                                          />
                                        </div>
                                      </div>
                                      {formikProps.values.employee_status ===
                                        EmployeeStatus.Left && (
                                        <>
                                          <div className="row py-3  personal-detail-field">
                                            <div className="text-field-empty-custom-user">
                                              <FormField
                                                formik={formikProps}
                                                fieldProps={{
                                                  fieldType: "select",
                                                  label: "Employee Left Type",
                                                  name: "employee_status_left_type",
                                                  placeholder:
                                                    "Select Left Type",
                                                  required: true,
                                                  options:
                                                    employeeLeftTypeOptions,
                                                }}
                                              />
                                            </div>
                                          </div>
                                          <div className="row py-3 personal-detail-field">
                                            <div className="text-field-empty-custom-user">
                                              <FormField
                                                formik={formikProps}
                                                fieldProps={{
                                                  fieldType: "datepicker",
                                                  label: "Date Of Reliving",
                                                  name: "employee_date_of_reliving",
                                                  placeholder:
                                                    "Select Date Of Reliving",
                                                  required: true,
                                                  allowFutureDate: true,
                                                  allowPastDate: true,
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </>
                                      )}
                                      {/* {formikProps.values.employee_status ===
                                        EmployeeStatus.Active && (
                                        <div className="row py-3 personal-detail-field">
                                          <div className="text-field-empty-custom-user">
                                            <FormField
                                              formik={formikProps}
                                              fieldProps={{
                                                fieldType: "datepicker",
                                                label: "Date Of Confirmation",
                                                name: "employee_date_of_confirmation",
                                                placeholder:
                                                  "Select Date Of Confirmation",
                                                required: true,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      )} */}
                                      {/* {formikProps.values.employee_status ===
                                        EmployeeStatus.Confirmed && (
                                        <div className="row py-3 personal-detail-field">
                                          <div className="text-field-empty-custom-user">
                                            <FormField
                                              formik={formikProps}
                                              fieldProps={{
                                                fieldType: "datepicker",
                                                label: "Date Of Confirmation",
                                                name: "employee_date_of_confirmation",
                                                placeholder:
                                                  "Select Date Of Confirmation",
                                                required: true,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      )} */}
                                      {/* <div className="row py-3  personal-detail-field">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "select",
                                              label: "Working Location",
                                              name: "location_id",
                                              placeholder:
                                                "Select Working Location",
                                              required: true,
                                              options: locationOptions,
                                            }}
                                          />
                                        </div>
                                      </div> */}
                                      <div className="row py-3  personal-detail-field">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "select",
                                              label: "Department",
                                              name: "department_id",
                                              placeholder: "Select Department",
                                              required: true,
                                              options: departmentOptions,
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className="row py-3  personal-detail-field">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "select",
                                              label: "Designation",
                                              name: "designation_id",
                                              placeholder: "Select Designation",
                                              required: true,
                                              options: designationOptions,
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {formikProps.values.is_superior_employee.toString() !==
                                        "1" && (
                                        <div className="row py-3  personal-detail-field">
                                          <div className="text-field-empty-custom-user">
                                            <FormField
                                              formik={formikProps}
                                              fieldProps={{
                                                fieldType: "select",
                                                label: "Reporting Manager",
                                                name: "superior_employee_id",
                                                placeholder: "Select RM",
                                                options:
                                                  superiorEmployeeOptions,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      )}

                                      <div className="row py-3  personal-detail-field">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "number",
                                              label: "Monthly Basic Pay",
                                              name: "employee_monthly_salary",
                                              required: true,
                                              placeholder:
                                                "Enter Monthly Basic Pay",
                                            }}
                                          />
                                        </div>
                                      </div>
                                      {/* <div className="row py-3  personal-detail-field">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "select",
                                              label: "Salary Group",
                                              name: "salary_group_id",
                                              placeholder:
                                                "Select Salary Group",
                                              required: true,
                                              options: salaryGroupOptions,
                                            }}
                                          />
                                        </div>
                                      </div> */}
                                      {/* {salaryComponents.length > 0 &&
                                        salaryComponents.map(
                                          (component, index) => (
                                            <div
                                              key={index}
                                              className="row py-3 personal-detail-field"
                                            >
                                              <div className="text-field-empty-custom-user">
                                                <FormField
                                                  formik={formikProps}
                                                  fieldProps={{
                                                    fieldType: "textbox",
                                                    label:
                                                      component.salary_component_name,
                                                    name: `employee_salary_component_values.${index}.employee_salary_component_value`,
                                                    placeholder:
                                                      "Enter " +
                                                      component.salary_component_name +
                                                      " Value",
                                                    required: true,
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          )
                                        )} */}
                                    </div>
                                  </div>
                                  <div className="row btn-form-submit">
                                    <button
                                      type="button"
                                      className="button2"
                                      disabled={formikProps.isSubmitting}
                                      onClick={() => {
                                        // setIndexValue(2);
                                        // setActiveTabButton("position");
                                        const fieldsToValidate = formikProps.values.employee_login_available === 0 ? fieldNamesToValidate.professionalDetails : [...fieldNamesToValidate.professionalDetails,"employee_login_password"]
                                        validateAndNavigate(
                                          formikProps,
                                          2,
                                          "position",
                                          fieldsToValidate
                                        );
                                        // formikProps.submitForm();
                                        // if (!formikProps.isValid) {
                                        //     toast.error("Please ensure all fields are Filled and Valid!");
                                        // }
                                      }}
                                      // onClick={() => validateAndNavigate(formikProps)}
                                    >
                                      Next
                                    </button>
                                  </div>
                                </Form>
                              </div>
                            </div>
                          </div>
                        )}

                        {indexValue === 2 && (
                          <div className="professional-details">
                            <div className="employee-personal-detail-form">
                              <div className="tabdetails">
                                <Form className=" ">
                                  <div className="px-2 form-field-container">
                                    <div className="personal-detail-grid">
                                      <div className="personal-detail-field radio-section">
                                        <div className="row py-3">
                                          <div className="text-field-empty-custom-user">
                                            <FormField
                                              formik={formikProps}
                                              fieldProps={{
                                                fieldType: "radio",
                                                label: "Employee is contract",
                                                name: "employee_is_contract",
                                                options: contractOptions,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* {formikProps.values
                                        .employee_is_contract == 1 && (
                                        <div className="row py-3 personal-detail-field">
                                          <div className="text-field-empty-custom-user">
                                            <FormField
                                              formik={formikProps}
                                              fieldProps={{
                                                fieldType: "select",
                                                label: "Contract Partner",
                                                name: "employee_contract_partner_id",
                                                placeholder: "Select Partner",
                                                required: true,
                                                options: partnerOptions,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      )} */}

                                      <div className="personal-detail-field radio-section">
                                        <div className="row py-3">
                                          <div className="text-field-empty-custom-user">
                                            <FormField
                                              formik={formikProps}
                                              fieldProps={{
                                                fieldType: "radio",
                                                label:
                                                  "Employee working for client",
                                                name: "employee_working_for_client",
                                                options: clientOptions,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* {formikProps.values
                                        .employee_working_for_client == 1 && (
                                        <div className="row py-3 personal-detail-field">
                                          <div className="text-field-empty-custom-user">
                                            <FormField
                                              formik={formikProps}
                                              fieldProps={{
                                                fieldType: "select",
                                                label: "Client Partner",
                                                name: "employee_client_partner_id",
                                                placeholder: "Select Client",
                                                required: true,
                                                options: partnerOptions,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      )} */}

                                      {/* input type */}
                                      <div className="row py-3 personal-detail-field">
                                        <div className="  text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "textbox",
                                              label: "Bank Name",
                                              name: "bank_name",
                                              placeholder: "Enter Bank Name",
                                              // options: bankOption,
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className="row py-3  personal-detail-field">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "textbox",
                                              label: " Branch Name",
                                              name: "employee_bank_account_bank_branch",
                                              placeholder:
                                                "Enter Bank Branch Name",
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div className="row py-3  personal-detail-field">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "textbox",
                                              label: "Account Holder Name",
                                              name: "employee_bank_account_name",
                                              placeholder:
                                                "Enter Account Holder Name",
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div className="row py-3  personal-detail-field">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "number",
                                              label: "Account Number",
                                              name: "employee_bank_account_number",
                                              placeholder:
                                                "Enter Account Number",
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div className="row py-3  personal-detail-field">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "radio",
                                              label: "In notice period",
                                              name: "employee_in_notice_period",
                                              options: noticePeriodOptions,
                                            }}
                                          />
                                        </div>
                                      </div>
                                      {formikProps.values.employee_in_notice_period.toString() ===
                                        "1" && (
                                        <div className="row py-3 personal-detail-field">
                                          <div className="text-field-empty-custom-user">
                                            <FormField
                                              formik={formikProps}
                                              fieldProps={{
                                                fieldType: "datepicker",
                                                label:
                                                  " Expected Date Of Reliving",
                                                name: "employee_expected_date_of_leaving",
                                                placeholder:
                                                  "Select Expected Date Of Reliving",
                                                // required: true,
                                                allowFutureDate: true,
                                                allowPastDate: true,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      )}

                                      <div className="row py-3  personal-detail-field">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "select",
                                              label: "Payment Mode",
                                              name: "employee_salary_payment_mode",
                                              placeholder:
                                                "Select Payment Mode",
                                              options: paymodeOptions,
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* <div className="row py-3  personal-detail-field">
                                                                                <div className="text-field-empty-custom-user">
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "pay from account", name: "transmission_type_uuid", placeholder: "select company account", required: true, options: currencyOptions }} />
                                                                                </div>
                                                                            </div> */}

                                      <div className="row py-3  personal-detail-field">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "select",
                                              label: "attendance policy name",
                                              name: "attendance_policy_id",
                                              placeholder: "Select Policy Name",
                                              required: true,
                                              options: attendancePolicyOptions,
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div className="row py-3  personal-detail-field">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "select",
                                              label: "payroll group",
                                              name: "payroll_group_id",
                                              placeholder:
                                                "Select Payroll Group",
                                              required: true,
                                              options: payrollGroupOptions,
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div className="row py-3  personal-detail-field">
                                        <div className="text-field-empty-custom-user">
                                          <FormField
                                            formik={formikProps}
                                            fieldProps={{
                                              fieldType: "select",
                                              label: "Company Name",
                                              name: "company_id",
                                              placeholder:
                                                "Select Company Name",
                                              options: companyOption,
                                              required: true,
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* {payrollGroups.length > 0 && payrollGroups[0].payroll_group_calc_per_day_salary_by === PayrollCalculateperDaySalary.AsDefinedInEmployee &&
                                                                                <div className="row py-3 personal-detail-field">
                                                                                    <div className="text-field-empty-custom-user">
                                                                                        <FormField
                                                                                            formik={formikProps}
                                                                                            fieldProps={{
                                                                                                fieldType: "textbox",
                                                                                                label: "Employee Month Salary Days",
                                                                                                name: "employee_month_salary_days",
                                                                                                placeholder: "Enter Employee Month Salary Days",
                                                                                                required: true
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            } */}

                                      {/* <div className="row py-3  personal-detail-field">
                                                                                <div className="text-field-empty-custom-user">
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "salary group name", name: "employee_salary_group_id", placeholder: "select salary group", required: true, options: salaryGroupOptions }} />
                                                                                </div>
                                                                            </div> */}
                                    </div>
                                  </div>
                                  <div className="row btn-form-submit">
                                    <button
                                      type="button"
                                      className="button2"
                                      disabled={formikProps.isSubmitting}
                                      onClick={() => {
                                        formikProps.submitForm();
                                        if (!formikProps.isValid) {
                                          console.log(
                                            "Errors",
                                            formikProps.errors
                                          );
                                          toast.error(
                                            "Please ensure all fields are Filled and Valid!"
                                          );
                                        }
                                      }}
                                    >
                                      Save
                                    </button>
                                  </div>
                                </Form>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Form>
                  </div>
                </div>
              );
            }}
          </Formik>
        )}
      </Drawer>
    </>
  );
};

export default EmployeeEntryDialog;
