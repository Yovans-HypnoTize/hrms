export const PageURLNames = {
  DASHBOARD: "dashboard",
  SUBORDINATE_PENDING_APPROVAL: "subordinates-pending-approval",
  SUBORDINATE_LEAVE_BALANCE_LIST: "subordinates-leave-balance-list",
  SUBORDINATE_LEAVE_REQUEST_LIST: "subordinates-leave-request-list",
  LEAVE_REQUEST_LIST: "leave-request-list",
  SUBORDINATE_LEAVE_BALANCE_DETAIL: "subordinates-leave-balance-detail",
  SUBORDINATE_LEAVE_HISTORY_LIST: "subordinates-leave-history-list",
  ALL_LEAVE_REQUEST: "all-leave-request",
  LEAVE_BALANCE: "leave-balance",
  LEAVE_REQUEST: "leave-request",
  EMPLOYEE_REPORT: "reports",
  LEAVE_HISTORY: "leave-history",
  EMPLOYEE_CONFIRMED_ATTENDANCE: "confirmed-attendance",
  EMPLOYEE_PENDING_ATTENDANCE: "pending-attendance",
  SUBORDINATE_PENDING_ATTENDANCE: "subordinate-pending-attendance",
  PAYSLIP: "payslip",
  EMPLOYEE_PROFILE: "employee-profile",
  CERTIFICATION_LETTER: "certification-letter",
  ORGANIZATIONAL_CHART: "organizational-chart",
  PENDING_LEAVE_REQUEST: "pending-leave-request",
  ALLOCATED_EMPLOYEE_REPORT: "allocated-employee-report",
  // REPORT: "reports",
};

export const PageLinks = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  OTP_VERIFY: "/otp-verify",
  RESET_PASSWORD: "/reset-password",
  LIST: "/view",
  PAGE_EMPLOYEE: "/employee",

  EMPLOYEE_DASHBOARD: "/employee/view/" + PageURLNames.DASHBOARD,
  SUBORDINATE_PENDING_APPROVAL:
    "/employee/view/" + PageURLNames.SUBORDINATE_PENDING_APPROVAL,
  SUBORDINATE_LEAVE_BALANCE_LIST:
    "/employee/view/" + PageURLNames.SUBORDINATE_LEAVE_BALANCE_LIST,
  SUBORDINATE_LEAVE_REQUEST_LIST:
    "/employee/view/" + PageURLNames.SUBORDINATE_LEAVE_REQUEST_LIST,
  LEAVE_REQUEST_LIST: "/employee/view/" + PageURLNames.LEAVE_REQUEST_LIST,
  SUBORDINATE_LEAVE_BALANCE_DETAIL:
    "/employee/view/" + PageURLNames.SUBORDINATE_LEAVE_BALANCE_DETAIL,
  SUBORDINATE_LEAVE_HISTORY_LIST:
    "/employee/view/" + PageURLNames.SUBORDINATE_LEAVE_HISTORY_LIST,
  ALL_LEAVE_REQUEST: "/employee/view/" + PageURLNames.ALL_LEAVE_REQUEST,
  LEAVE_BALANCE: "/employee/view/" + PageURLNames.LEAVE_BALANCE,
  LEAVE_REQUEST: "/employee/view/" + PageURLNames.LEAVE_REQUEST,
  EMPLOYEE_REPORT: "/employee/view/" + PageURLNames.EMPLOYEE_REPORT,
  LEAVE_HISTORY: "/employee/view/" + PageURLNames.LEAVE_HISTORY,
  EMPLOYEE_CONFIRMED_ATTENDANCE:
    "/employee/view/" + PageURLNames.EMPLOYEE_CONFIRMED_ATTENDANCE,
  EMPLOYEE_PENDING_ATTENDANCE:
    "/employee/view/" + PageURLNames.EMPLOYEE_PENDING_ATTENDANCE,
  SUBORDINATE_PENDING_ATTENDANCE:
    "/employee/view/" + PageURLNames.SUBORDINATE_PENDING_ATTENDANCE,
  PAYSLIP: "/employee/view/" + PageURLNames.PAYSLIP,
  CERTIFICATION_LETTER: "/employee/view/" + PageURLNames.CERTIFICATION_LETTER,
  ORGANIZATIONAL_CHART: "/employee/view/" + PageURLNames.ORGANIZATIONAL_CHART,
  EMPLOYEE_PROFILE: "/employee/view/" + PageURLNames.EMPLOYEE_PROFILE,
  EMPLOYEE_PENDING_LEAVE_REQUEST:
    "/employee/view/" + PageURLNames.PENDING_LEAVE_REQUEST,
  ALLOCATED_EMPLOYEE_REPORT:
    "/employee/view/" + PageURLNames.ALLOCATED_EMPLOYEE_REPORT,
  // REPORT: "/employee/view/" + PageURLNames.REPORT,
};

export const DateFilterType = {
  RangePicker: 1,
  MonthPicker: 2,
};

export const APIResult = {
  SUCCESS: true,
  FAILURE: false,
};

export const APIServers = {
  URL: import.meta.env.VITE_API_URL + "api/",
};

export const Endpoints = {
  USER_LOGIN: APIServers.URL + "v1/user/login",
  LOGOUT: APIServers.URL + "v1/user/logout",
  FORGOT_PASSWORD: APIServers.URL + "v1/forgot-password",
  OTP_VERIFY: APIServers.URL + "v1/verify-otp",
  RESET_PASSWORD: APIServers.URL + "v1/reset-password",

  EMPLOYEE_LOGIN: APIServers.URL + "v1/employee/login",
  EMPLOYEE_REPORT: APIServers.URL + "v1/employee/report",
  CHECKIN_CHECKOUT: APIServers.URL + "v1/employee/log",
  EMPLOYEE_DASHBOARD_LOG: APIServers.URL + "v1/employee/log",
  EMPLOYEE_CHECKIN_OUT_STATUS: APIServers.URL + "v1/employee/attendance/status",
  EMPLOYEE_DASHBOARD: APIServers.URL + "v1/employee/dashboard",
  EMPLOYEE_DETAIL: APIServers.URL + "v1/employee/detail",

  EMPLOYEE_LEAVE_REQUEST: APIServers.URL + "v1/employee/leave/request",
  EMPLOYEE_PENDING_LEAVE_REQUEST:
    APIServers.URL + "v1/employee/pending/leave/request",
  ALLOCATED_EMPLOYEE_REPORT: APIServers.URL + "v1/employee/report/list",
  EMPLOYEE_LEAVE_TRANSACTION: APIServers.URL + "v1/employee/leave_transaction",
  EMPLOYEE_LEAVE_BALANCE: APIServers.URL + "v1/employee/leave/balance",

  EMPLOYEE_CONFIRMED_ATTENDANCE: APIServers.URL + "v1/employee/attendance",
  EMPLOYEE_ATTENDANCE_PUNCH: APIServers.URL + "v1/employee/punch",
  EMPLOYEE_PAYSLIP: APIServers.URL + "v1/employee/payslip",

  EMPLOYEE_LEAVE_TYPES: APIServers.URL + "v1/employee/leave_types",

  EMPLOYEE_PENDING_ATTENDANCE: APIServers.URL + "v1/employee/emp_attendance",

  SUBORDINATE_PENDING_ATTENDANCE:
    APIServers.URL + "v1/employee/sub_ordinate/emp_attendance",

  EMPLOYEE_DOCUMENT: APIServers.URL + "v1/employee/document",

  ORGANIZATIONAL_CHART: APIServers.URL + "v1/organizational/chart",

  SUBORDINATE_LEAVE_REQUEST:
    APIServers.URL + "v1/employee/sub_ordinate/leave_request",
  SUBORDINATE_LEAVE_BALANCE:
    APIServers.URL + "v1/employee/sub_ordinate/leave_balance",
  SUBORDINATE_LEAVE_TRANSACTION:
    APIServers.URL + "v1/employee/sub_ordinate/leave_transaction",

  FILE_UPLOAD: APIServers.URL + "/api/v1/file/uploads",
};

export const API = {
  BaseUrl: APIServers.URL,
  EndPoint: Endpoints,
  Result: APIResult,
};
export const EndUser = {
  Employee: "EMPLOYEE",
  Manager: "MANAGER",
};

export const ProjectConfig = {
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

export const LeaveRequestStatus = {
  Rejected: 5,
  Approved: 10,
  Pending: 0,
};

export const LeaveRequestDays = {
  Single: 1,
  Multiple: 2,
};

export const AttendanceType = {
  FulldayPresent: 1,
  HalfdayPresent: 2,
  RestDay: 11,
  Holiday: 12,
  Absent: 21,
  CompensationOff: 14,
  Leave: 13,
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

export const StatusValues = {
  Approved: 10,
  Pending: 0,
  Rejected: 5,
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
};

export const PaymentMode = {
  BankTransfer: 1,
  Cheque: 2,
  Cash: 3,
};
