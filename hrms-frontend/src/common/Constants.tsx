export const PageURLNames = {
  DASHBOARD: "dashboard",

  ADMIN_DASHBOARD: "admin-dashboard",
  EMPLOYER_DASHBOARD: "employer-dashboard",
  EMPLOYEE_DASHBOARD: "employee-dashboard",
  EMPLOYEE_REPORT: "employee-report",
  ALLOCATED_EMPLOYEE_REPORT: "allocated-employee-report",
  EMPLOYER_PAYROLL_LIST: "employer-payroll-list",
  PAYROLL_CONFIG: "payroll-configuration",
  COUNTRIES: "countries",
  STATES: "states",
  BANKS: "banks",
  CLIENTS: "clients",
  COMPANY: "company",

  EMPLOYEES: "employees",
  SALARY_REVISION: "salary-revision",
  LOAN: "loan",
  ADDITIONAL_ALLOWANCE: "additional-allowance",
  ATTENDANCE: "attendance",
  PROJECTS: "projects",
  COMPANY_LOCATION: "company-location",
  COMPANY_DETAILS: "company-details",
  COMPANY_BANK_DETAILS: "company-bank-details",
  HOLIDAY_GROUPS: "holiday-groups",
  HOLIDAY_TYPES: "holiday-types",
  HOLIDAYS: "holidays",
  PARTNERS: "partners",
  DEPARTMENTS: "departments",
  DESIGNATIONS: "designations",
  WORK_SHIFTS: "work-shifts",
  WORK_TIME_COMPENSATIONS: "work-time-compensations",
  LEAVE_TYPES: "leave-types",
  LEAVE_PLANS: "leave-plans",
  LOAN_TYPE: "loan-types",
  REST_DAY_GROUPS: "rest-day-groups",
  ATTENDANCE_POLICIES: "attendance-policies",
  SALARY_COMPONENTS: "salary-components",
  SALARY_GROUPS: "salary-groups",
  PAYROLL_GROUP: "payroll-group",
  USERS: "users",
  ROLES: "roles",

  LEAVE_REQUEST: "leave-request",
  PENDING_LEAVE_REQUEST: "pending-leave-request",
  LEAVE_BALANCE: "leave-balance",
  LEAVE_CREDITS: "leave-credits",
  LEAVE_HISTORY: "leave-history",

  EMPLOYEE_PAYROLL: "employee-payroll",
  PAYROLL_REPORTS: "payroll-reports",
  PAYROLL_HISTORY: "payroll-history",

  PAYROLL_PROCESS: "payroll-process",

  PROCESS_PAY_RUN: "process-pay-run",

  EMPLOYEE_VIEW_DETAILS: "employee-view-details",
  PAYROLL_VIEW_DETAILS: "payroll-view-details",
};

export const PageLinks = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  OTP_VERIFY: "/otp-verify",
  RESET_PASSWORD: "/reset-password",
  LIST: "/view",
  PAGE_SUPER_ADMIN: "/admin",
  PAGE_EMPLOYER: "/employer",
  PAGE_EMPLOYEE: "/employee",
  PAGE_EMPLOYEES: "/employees",

  ADMIN_DASHBOARD: "/admin/" + PageURLNames.ADMIN_DASHBOARD,
  ADMIN_PAYROLL_CONFIG: "/admin/view/" + PageURLNames.PAYROLL_CONFIG,
  ADMIN_STATES: "/admin/view/" + PageURLNames.STATES,
  ADMIN_COUNTRIES: "/admin/view/" + PageURLNames.COUNTRIES,
  ADMIN_BANKS: "/admin/view/" + PageURLNames.BANKS,
  ADMIN_CLIENTS: "/admin/view/" + PageURLNames.CLIENTS,
  ADMIN_COMPANY: "/admin/view/" + PageURLNames.COMPANY,
  ADMIN_USERS: "/admin/view/" + PageURLNames.USERS,

  EMPLOYER_COMPANY_DETAILS: "/employer/view/" + PageURLNames.COMPANY_DETAILS,
  EMPLOYER_DASHBOARD: "/employer/" + PageURLNames.EMPLOYER_DASHBOARD,
  EMPLOYEE_DASHBOARD: "/employee/" + PageURLNames.EMPLOYEE_DASHBOARD,
  // EMPLOYEE_REPORT: "/employee/" + PageURLNames.EMPLOYEE_REPORT,
  EMPLOYER_EMPLOYEES: "/employer/view/" + PageURLNames.EMPLOYEES,
  EMPLOYER_SALARY_REVISION: "/employer/view/" + PageURLNames.SALARY_REVISION,
  EMPLOYER_LOAN: "/employer/view/" + PageURLNames.LOAN,
  EMPLOYER_ADDITIONAL_ALLOWANCE:
    "/employer/view/" + PageURLNames.ADDITIONAL_ALLOWANCE,
  EMPLOYER_ATTENDANCE: "/employer/view/" + PageURLNames.ATTENDANCE,
  EMPLOYER_PROJECTS: "/employer/view/" + PageURLNames.PROJECTS,
  EMPLOYER_COMPANY_LOCATION: "/employer/view/" + PageURLNames.COMPANY_LOCATION,
  EMPLOYER_COMPANY_BANK_DETAILS:
    "/employer/view/" + PageURLNames.COMPANY_BANK_DETAILS,
  EMPLOYER_HOLIDAY_GROUPS: "/employer/view/" + PageURLNames.HOLIDAY_GROUPS,
  EMPLOYER_HOLIDAY_TYPES: "/employer/view/" + PageURLNames.HOLIDAY_TYPES,
  EMPLOYER_HOLIDAY: "/employer/view/" + PageURLNames.HOLIDAYS,
  EMPLOYER_PARTNERS: "/employer/view/" + PageURLNames.PARTNERS,
  EMPLOYER_DEPARTMENTS: "/employer/view/" + PageURLNames.DEPARTMENTS,
  EMPLOYER_DESIGNATIONS: "/employer/view/" + PageURLNames.DESIGNATIONS,
  EMPLOYER_WORK_SHIFTS: "/employer/view/" + PageURLNames.WORK_SHIFTS,
  EMPLOYER_WORK_TIME_COMPENSATIONS:
    "/employer/view/" + PageURLNames.WORK_TIME_COMPENSATIONS,
  EMPLOYER_LEAVE_TYPE: "/employer/view/" + PageURLNames.LEAVE_TYPES,
  EMPLOYER_LEAVE_PLAN: "/employer/view/" + PageURLNames.LEAVE_PLANS,
  EMPLOYER_MASTERS_LOAN_TYPE: "/employer/view/" + PageURLNames.LOAN_TYPE,
  EMPLOYER_REST_DAY_GROUPS: "/employer/view/" + PageURLNames.REST_DAY_GROUPS,
  EMPLOYER_ATTENDANCE_POLICIES:
    "/employer/view/" + PageURLNames.ATTENDANCE_POLICIES,
  EMPLOYER_SALARY_COMPONENTS:
    "/employer/view/" + PageURLNames.SALARY_COMPONENTS,
  EMPLOYER_SALARY_GROUPS: "/employer/view/" + PageURLNames.SALARY_GROUPS,
  EMPLOYER_PAYROLL_GROUP: "/employer/view/" + PageURLNames.PAYROLL_GROUP,
  EMPLOYER_USERS: "/employer/view/" + PageURLNames.USERS,
  EMPLOYER_ROLES: "/employer/view/" + PageURLNames.ROLES,

  EMPLOYER_LEAVE_REQUEST: "/employer/view/" + PageURLNames.LEAVE_REQUEST,
  EMPLOYEE_LEAVE_REQUEST: "/employee/view/" + PageURLNames.LEAVE_REQUEST,
  EMPLOYEE_PENDING_LEAVE_REQUEST:
    "/employee/view/" + PageURLNames.PENDING_LEAVE_REQUEST,
  EMPLOYEE_REPORT: "/employee/view/" + PageURLNames.EMPLOYEE_REPORT,
  ALLOCATED_EMPLOYEE_REPORT:
    "/employee/view/" + PageURLNames.ALLOCATED_EMPLOYEE_REPORT,
  EMPLOYEE_LEAVE_BALANCE: "/employee/view/" + PageURLNames.LEAVE_BALANCE,
  EMPLOYER_LEAVE_BALANCE: "/employer/view/" + PageURLNames.LEAVE_BALANCE,
  EMPLOYER_LEAVE_CREDITS: "/employer/view/" + PageURLNames.LEAVE_CREDITS,
  EMPLOYER_LEAVE_HISTORY: "/employer/view/" + PageURLNames.LEAVE_HISTORY,

  EMPLOYER_PAYROLL_PROCESS: "/employer/" + PageURLNames.EMPLOYER_PAYROLL_LIST,
  EMPLOYER_PAYROLL_REPORTS: "/employer/view/" + PageURLNames.PAYROLL_REPORTS,
  EMPLOYER_PAYROLL_HISTORY: "/employer/view/" + PageURLNames.PAYROLL_HISTORY,
  EMPLOYER_EMPLOYEE_PAYROLL: "/employer/view/" + PageURLNames.EMPLOYEE_PAYROLL,
  EMPLOYER_PROCESS_PAY_RUN: "/employer/view/" + PageURLNames.PROCESS_PAY_RUN,

  EMPLOYER_PERSONAL_VIEW_DETAILS:
    "/employer/view/" + PageURLNames.EMPLOYEE_VIEW_DETAILS,
  PAYROLL_VIEW_DETAILS: "/employer/view/" + PageURLNames.PAYROLL_VIEW_DETAILS,
};

export const DateFilterType = {
  RangePicker: 1,
  MonthPicker: 2,
};

export const StatusValues = {
  ACTIVE: 1,
  INACTIVE: 0,
  DELETED: 3,
};

export const APIResult = {
  SUCCESS: true,
  FAILURE: false,
};

export const APIServers = {
  URL: process.env.REACT_APP_API_URL,
};

export const Endpoints = {
  EMPLOYER_LOGIN: APIServers.URL + "/api/v1/user/login",
  LOGOUT: APIServers.URL + "/api/v1/user/logout",
  FORGOT_PASSWORD: APIServers.URL + "/api/v1/forgot-password",
  OTP_VERIFY: APIServers.URL + "/api/v1/verify-otp",
  RESET_PASSWORD: APIServers.URL + "/api/v1/reset-password",
  REFRESH_TOKEN: APIServers.URL + "/api/v1/user/refresh-token",

  // admin
  // COUNTRY_LIST: APIServers.URL + "/api/v1/countries",
  COUNTRY_LIST: APIServers.URL + "/api/v1/master/country",
  // STATE_LIST: APIServers.URL + "/api/v1/states",
  STATE_LIST: APIServers.URL + "/api/v1/master/state",
  CITY_LIST: APIServers.URL + "/api/v1/master/city",
  BANK_LIST: APIServers.URL + "/api/v1/banks",
  // CLIENT_LIST: APIServers.URL + "/api/v1/clients",
  CLIENT_LIST: APIServers.URL + "/api/v1/admin/client",
  COMPANY_LIST: APIServers.URL + "/api/v1/admin/company",

  //
  CLIENT_COMPANY_LIST: APIServers.URL + "/api/v1/client/company",
  EMPLOYEES_LIST_OPTIONS:
    APIServers.URL + "/api/v1/client/company/employee/list",
  MASTER_ROLE_LIST: APIServers.URL + "/api/v1/master/project/roles",
  WORKSHIFT_LIST: APIServers.URL + "/api/v1/master/shift-type",

  //emp
  COMPANY_LOCATION: APIServers.URL + "/api/v1/company_locations",
  // HOLIDAY_GROUPS: APIServers.URL + "/api/v1/holiday_groups",
  HOLIDAY_GROUPS: APIServers.URL + "/api/v1/client/company/holiday/group",
  CHECKIN_CHECKOUT: APIServers.URL + "/api/v1/employee/log",
  EMPLOYEE_DASHBOARD_LOG: APIServers.URL + "/api/v1/employee/log",
  EMPLOYEE_CHECKIN_OUT_STATUS:
    APIServers.URL + "/api/v1/employee/attendance/status",

  // HOLIDAY_TYPES: APIServers.URL + "/api/v1/holiday_types",
  HOLIDAY_TYPES: APIServers.URL + "/api/v1/client/company/holiday/type",
  // HOLIDAY_LIST: APIServers.URL + "/api/v1/holidays",
  HOLIDAY_LIST: APIServers.URL + "/api/v1/client/company/holiday",
  PAYROLL_SUMMARY: APIServers.URL + "/api/v1/client/company/payroll/summary",
  EMPLOYEE_TOTAL_OT_PENDING_HOURS: APIServers.URL + "/api/v1/client/company/total/ot/pending/hours",
  PARTNER_LIST: APIServers.URL + "/api/v1/partners",
  // DEPARTMENT_LIST: APIServers.URL + "/api/v1/departments",
  CLIENT_DEPARTMENT_LIST: APIServers.URL + "/api/v1/client/company/department",
  LEAVE_PLAN: APIServers.URL + "/api/v1/leave_plans",
  LEAVE_TYPES: APIServers.URL + "/api/v1/leave_types",
  REST_DAY_GROUPS: APIServers.URL + "/api/v1/client/company/weekoff",
  // REST_DAY_GROUPS: APIServers.URL + "/api/v1/rest_day_groups",
  // ATTENDANCE_POLICY: APIServers.URL + "/api/v1/attendance_policies",
  ATTENDANCE_POLICY: APIServers.URL + "/api/v1/client/attendance/policy",
  // WORK_SHIFTS: APIServers.URL + "/api/v1/work_shifts",
  WORK_SHIFTS: APIServers.URL + "/api/v1/client/company/workshift",
  SALARY_COMPONENTS: APIServers.URL + "/api/v1/salary_components",
  SALARY_GROUP: APIServers.URL + "/api/v1/salary_groups",
  SALARY_GROUP_COMPONENTS: APIServers.URL + "/api/v1/salary_group_components",
  // PAYROLL_GROUP: APIServers.URL + "/api/v1/payroll_groups",
  PAYROLL_GROUP: APIServers.URL + "/api/v1/client/company/payroll/group",
  USER: APIServers.URL + "/api/v1/admin/user",
  DESIGNATION_LIST: APIServers.URL + "/api/v1/designations",
  CLIENT_DESIGNATION_LIST:
    APIServers.URL + "/api/v1/client/company/designation",
  COMPANY_BANK_DETAILS: APIServers.URL + "/api/v1/company_bank_accounts",
  LEAVE_CREDITS: APIServers.URL + "/api/v1/client/company/leave/credit",
  // LEAVE_CREDITS: APIServers.URL + "/api/v1/employee_leave_credits",
  LEAVE_REQUEST: APIServers.URL + "/api/v1/client/company/leave/request",
  EMPLOYEE_LEAVE_REQUEST: APIServers.URL + "/api/v1/employee/leave/request",
  EMPLOYEE_PENDING_LEAVE_REQUEST:
    APIServers.URL + "/api/v1/employee/pending/leave/request",
  EMPLOYEE_REPORT: APIServers.URL + "/api/v1/employee/report",
  ALLOCATED_EMPLOYEE_REPORT: APIServers.URL + "/api/v1/employee/report/list",
  // LEAVE_BALANCE: APIServers.URL + "/api/v1/employee_leave_balance",
  LEAVE_BALANCE: APIServers.URL + "/api/v1/employee/leave/balance",
  ATTENDANCE_LIST:
    APIServers.URL + "/api/v1/client/company/employee/attendance",
  ATTENDANCE_BULK_DELETE:
    APIServers.URL + "/api/v1/client/company/employee/attendance/bulk/delete",
  EMPLOYER_PROJECT_LIST: APIServers.URL + "/api/v1/client/company/project",
  ATTENDANCE_BULK_ADD: APIServers.URL + "/api/v1/employee_attendances/bulk_add",
  EMPLOYEE_ATTENDANCE_BULK_ADD:
    APIServers.URL + "/api/v1/client/company/employee/upload/attendance/excel",
  EMPLOYEE_BULK_ADD: APIServers.URL + "/api/v1/employees/bulk_add",
  CLIENT_EMPLOYEE_BULK_ADD:
    APIServers.URL + "/api/v1/client/company/employee/upload/excel",
  PAYROLL: APIServers.URL + "/api/v1/payrolls",
  ADMIN_ROLE_TYPES: APIServers.URL + "/api/v1/master/role",
  MONTH_PAYROLLS: APIServers.URL + "/api/v1/payroll",
  CLIENT_PAYROLL_LIST:
    APIServers.URL + "/api/v1/client/company/employee/payroll",
  TOTAL_PAYRUN: APIServers.URL + "/api/v1/total_payrun",
  PAYSLIP_REGENERATE: APIServers.URL + "/api/v1/payslip/re-generate",
  PAYSLIP_GENERATE: APIServers.URL + "/api/v1/client/company/generate/payroll",
  EMPLOYEE_PAYROLL: APIServers.URL + "/api/v1/employee_payrolls",
  EMPLOYEE_STATUS: APIServers.URL + "/api/v1/employee_statuses",
  EMPLOYEE_LOCATION: APIServers.URL + "/api/v1/employee_locations",
  EMPLOYEE_SALARIES: APIServers.URL + "/api/v1/employee_salaries",
  EMPLOYEE_DEPARTMENT: APIServers.URL + "/api/v1/employee_department",
  EMPLOYEE_DESIGNATION: APIServers.URL + "/api/v1/employee_designation",
  EMPLOYEE_PAYROLL_GROUPS: APIServers.URL + "/api/v1/employee_payroll_groups",
  EMPLOYEE_PAYROLL_MANUAL_COMPONENTS:
    APIServers.URL + "/api/v1/payroll_manual_components",
  EMPLOYEE_PAYROLL_MANUAL_VALUES:
    APIServers.URL + "/api/v1/payroll_manual_values",
  CURRENCY_LIST: APIServers.URL + "/api/v1/currencies",
  // FILE_UPLOAD: APIServers.URL + "/api/v1/file/uploads",
  FILE_UPLOAD: APIServers.URL + "/api/v1/admin/client/company/upload-logo",
  CLIENT_FILE_UPLOAD: APIServers.URL + "/api/v1/client/company/upload-logo",

  // NO_ATTENDANCE_LIST:APIServers.URL + "/api/v1/currencies",
  // OVER_TIME_AND_LOP:APIServers.URL + "/api/v1/currencies",

  EMPLOYEE_LOGIN: APIServers.URL + "/api/v1/employee/login",
  MASTER_GENDER: APIServers.URL + "/api/v1/master/gender",
  MASTER_MARITAL_STATUS: APIServers.URL + "/api/v1/master/marital",

  EMPLOYEES_LIST: APIServers.URL + "/api/v1/client/company/employee",
  SUPERIOR_EMPLOYEES_LIST:
    APIServers.URL + "/api/v1/client/company/superior/employee",
  // EMPLOYEES_LIST: APIServers.URL + "/api/v1/employees",
  EMPLOYEES_DOWNLOAD_TEMPLATE:
    APIServers.URL + "/api/v1/client/company/download/sample/employee/excel",
  // EMPLOYEES_DOWNLOAD_TEMPLATE:
  //   APIServers.URL + "/api/v1/employees/download_file_format",
  EMPLOYEES_ATTENDANCE_DOWNLOAD_TEMPLATE:
    APIServers.URL +
    "/api/v1/client/company/download/sample/employee/attendance/excel",
  // EMPLOYEES_ATTENDANCE_DOWNLOAD_TEMPLATE:
  //   APIServers.URL + "/api/v1/employee_attendances/download_file_format",
  EMPLOYEES_PAYROLL_DOWNLOAD_TEMPLATE:
    APIServers.URL + "/api/v1/download/payroll_employees",
  EMPLOYEES_SALARY_LIST: APIServers.URL + "/api/v1/employee_salaries",
  EMPLOYER_EMPLOYEE_LOAN_LIST: APIServers.URL + "/api/v1/employee_salaries",
  EMPLOYER_ADDITIONAL_ALLOWANCE_LIST:
    APIServers.URL + "/api/v1/employee_salaries",
  EMPLOYER_WORK_TIME_COMPENSATIONS_LIST:
    APIServers.URL + "/api/v1/client/company/workshift/pay",
  MASTER_DAY_TYPE: APIServers.URL + "/api/v1/master/day-type",
  MASTER_WEEKDAY_TYPE: APIServers.URL + "/api/v1/master/weekday",
  // EMPLOYER_WORK_TIME_COMPENSATIONS_LIST:
  //   APIServers.URL + "/api/v1/work_time_compensations",
  EMPLOYER_MASTERS_LOAN_TYPE_LIST: APIServers.URL + "/api/v1/employee_salaries",
  EMPLOYER_ATTENDANCE_POLICIES:
    APIServers.URL + "/api/v1/employee_attendance_policies",
  EMPLOYER_MASTERS_ROLES_LIST: APIServers.URL + "/api/v1/employee_salaries",
  EMPLOYEES_LEAVE_PLAN_LIST: APIServers.URL + "/api/v1/employee_leave_plans",
  EMPLOYEES_SUPERIOR_LIST: APIServers.URL + "/api/v1/employee_superior",
  EMPLOYEES_DASHBOARD: APIServers.URL + "/api/v1/employer/dashboard",
  EMPLOYER_DASHBOARD: APIServers.URL + "/api/v1/client/company/dashboard",
  ADMIN_DASHBOARD: APIServers.URL + "/api/v1/admin/dashboard",
  NOTIFICATION_LIST: APIServers.URL + "/api/v1/service/notification",

  // EMPLOYEES_DASHBOARD: APIServers.URL + "/api/v1/client/company/dashboard",
};

export const API = {
  BaseUrl: "http://192.168.1.5:5000",
  EndPoint: Endpoints,
  Result: APIResult,
};

export const rowPerPageOptions = [5, 10, 50, 100, 200];

export const ProjectConfig = {
  // EntriesPerPage: 10,
  EntriesPerPage: 5,
  tableCellTruncateLength: 50,
};

export const ProjectStrings = {
  ValidationRequired: "Required",
  ValidationSelect: "Please Select",
  ValidationEmail: "Not a Valid Email",
  ValidationNumber: "Not a Valid Numeric",
  ValidationMax: (max: number) => "Max " + max + " Characters",
  ValidationMin: (min: number) => "Min " + min + " Characters",
  ValidationArrayEmpty: "Please Select Atleast 1",
  ErrorAPIFailed: "Error Occurred while processing the request",
};

export const EndUser = {
  SuperAdmin: "ADMIN",
  Employers: "CLIENT/EMPLOYER",
  Employee: "EMPLOYEE",
  Manager: "MANAGER",
};

export const Gender = {
  Male: 1,
  Female: 2,
  Transgender: 3,
};

export const MaritalStatus = {
  Single: 1,
  Married: 2,
  Widowed: 3,
  Divorsed: 4,
};

export const EmployeeLeftType = {
  Relived: 1,
  Terminated: 2,
  Abscond: 3,
};
export const EmployeeStatus = {
  Probation: 10,
  Confirmed: 20,
  Left: 30,
  Active: 1,
  Inactive: 0,
};

export const PaymentMode = {
  BankTransfer: 1,
  Cheque: 2,
  Cash: 3,
};

export const SalaryComponentType = {
  Allowance: 1,
  Deduction: 2,
  EmployerContribution: 3,
};
export const LeaveTypeUnclaimedOperation = {
  Lapse: 1,
  Encash: 2,
  CarryOver: 3,
};

export const SalaryComponentCalculationType = {
  FormulaBased: 1,
  CommonFixedForAll: 2,
  CommonFixedEmployeeWise: 3,
  EmployeeManualEntry: 4,
  Custom: 5,
};
export const SalaryComponentCalculationDayType = {
  AllDays: 1,
  WorkingDays: 2,
};

export const PayrollInterval = {
  Monthly: 1,
  BiMonthly: 2,
  FortNightly: 3,
  Weekly: 4,
};

export const PayrollStartMonth = {
  CurrentMonth: 1,
  PreviousMonth: 2,
};

export const PayrollCalculateperDaySalary = {
  SpecificDays: 1,
  CalenderDays: 2,
  AsDefinedInEmployee: 3,
};

export const CompanySalaryType = {
  MonthlyBasicPayBased: 1,
  AnnualCtcBased: 2,
};

export const LeaveCreditType = {
  PreCredit: 1,
  ClaimBased: 2,
};
export const LeaveRequestDays = {
  Single: 1,
  Multiple: 2,
};

export const LeaveRequestSession = {
  HalfDay: 4,
  FullDay: 1,
  MorningSession: 2,
  EveningSession: 3,
};
export const LeaveRequestDayType = {
  FullDay: 1,
  HalfDay: 2,
};

export const LeaveCreditPeriod = {
  Yearly: 1,
  Monthly: 2,
};

export const SalaryComponentBimonthlyCycle = {
  AllCycles: 0,
  FirstCycle: 1,
  SecondCycle: 2,
};

export const RestDays = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};
export const PayrollDayOfTheWeek = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

export const RestrictedWeeks = {
  All: 1,
  Restricted: 2,
};
export const WorkTimeDayType = {
  RegularDay: 1,
  RestDay: 2,
};

export const WorkTimeType = {
  Normal: 1,
  Ot: 2,
  Nd: 3,
  NdOt: 4,
};

export const PayrollStatus = {
  Initiated: 10,
  Completed: 20,
};
export const TotalPayrunStatus = {
  Processing: 10,
  Completed: 20,
  EmployeeCompleted: 15,
};
