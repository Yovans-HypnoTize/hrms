import { Gender, MaritalStatus, PageLinks } from "./Constants";
import CellMultilineAddress from "../components/table_data/CellMultilineAddress";
import CellMultilineDate from "../components/table_data/CellMultilineDate";
// import ListButtonViewDetails from "../components/list-custom-btns/ListButtonViewDetails";
import CellSalaryComponentFixedValue from "../components/table_data/CellSalaryComponentFixedValue";
import CellSalaryComponentFormula from "../components/table_data/CellSalaryComponentFormula";
// import CellNAForZero from "../components/table_data/CellNAForZero";

export namespace TableViewMappings {
  export interface MappingDetail {
    ID: number;
    mappingName: string;
  }

  export interface TableColumn {
    label: string;
    data_key: string;
    type:
      | "text"
      | "number"
      | "status"
      | "image"
      | "date"
      | "datetime"
      | "time"
      | "custom"
      | "avatar";
    customKeys?: string[];
    mappingList?: MappingDetail[];
    component?: any;
  }

  export interface TableActions {
    type:
      | "edit"
      | "delete"
      | "view"
      | "copy"
      | "custom"
      | "singleButton"
      | "doubleButton"
      | "approveOrReject";
    icon?: string;
    tooltip?: string;
    link?: string;
    params?: { param_key: string; data_key: string }[];
    component?: any;
    singleButton?: any;
    buttonText_1?: string;
    buttonText_2?: string;
  }

  export interface TableDetail {
    pageLink: string;
    columns: TableColumn[];
    actions?: TableActions[];
    primary_column: string;
    status_column?: string;
  }

  /* Mapping List */
  const MappingListYesNo: MappingDetail[] = [
    { ID: 1, mappingName: "Yes" },
    { ID: 0, mappingName: "No" },
  ];

  // const MappingListStatuses: MappingDetail[] = [
  //   { ID: 1, mappingName: "Active" },
  //   { ID: 0, mappingName: "InActive" },
  // ];

  const MappingListGenders: MappingDetail[] = [
    { ID: 0, mappingName: "All" },
    { ID: Gender.Male, mappingName: "Male" },
    { ID: Gender.Female, mappingName: "Female" },
    { ID: Gender.Transgender, mappingName: "Transgender" },
  ];

  const MappingListMaritalStatuses: MappingDetail[] = [
    { ID: 0, mappingName: "All" },
    { ID: MaritalStatus.Single, mappingName: "Single" },
    { ID: MaritalStatus.Married, mappingName: "Married" },
    { ID: MaritalStatus.Widowed, mappingName: "Widowed" },
    { ID: MaritalStatus.Divorsed, mappingName: "Divorsed" },
  ];

  const MappingListSalaryComponentTypes: MappingDetail[] = [
    { ID: 1, mappingName: "Allowance" },
    { ID: 2, mappingName: "Deduction" },
    { ID: 3, mappingName: "Employer Contribution" },
  ];
  // const MappingListSalaryType: MappingDetail[] = [
  //   { ID: 1, mappingName: "Monthly Basic Pay Based" },
  //   { ID: 2, mappingName: "Annual CTC Based" },
  // ];

  const MappingListComponentCalculationTypes: MappingDetail[] = [
    { ID: 1, mappingName: "Formula Based" },
    { ID: 2, mappingName: "Fixed - Common For All" },
    { ID: 3, mappingName: "Fixed - Employee Wise" },
    { ID: 4, mappingName: "Employee Manual Entry" },
    { ID: 5, mappingName: "Custom" },
  ];

  // const MappingListPayrollInterval: MappingDetail[] = [
  //   { ID: 1, mappingName: "Monthly" },
  //   { ID: 2, mappingName: "Bi-Monthly" },
  //   { ID: 3, mappingName: "Fortnighly" },
  //   { ID: 4, mappingName: "Weekly" },
  // ];

  // const MappingListWorkTimeCompensation: MappingDetail[] = [
  //   { ID: 1, mappingName: "Regular Day" },
  //   { ID: 2, mappingName: "Rest Day" },
  // ];
  // const MappingListUserRole: MappingDetail[] = [
  //   { ID: 1, mappingName: "Super Admin" },
  //   { ID: 2, mappingName: "Client" },
  // ];

  // const MappingHolidayTypeCompensation: MappingDetail[] = [
  //   { ID: 1, mappingName: "Special Holiday" },
  //   { ID: 2, mappingName: "Legal Holiday" },
  // ];

  // const MappingListAttendance: MappingDetail[] = [
  //   { ID: 1, mappingName: "Fullday Present" },
  //   { ID: 2, mappingName: " Halfday Present" },
  //   { ID: 11, mappingName: "Rest Day" },
  //   { ID: 12, mappingName: "Holiday" },
  //   { ID: 13, mappingName: "Leave" },
  //   { ID: 14, mappingName: "Compensation Off" },
  //   { ID: 21, mappingName: "Absent" },
  // ];

  const tableList: TableDetail[] = [
    {
      pageLink: PageLinks.ADMIN_COUNTRIES,
      columns: [
        { label: "Country", data_key: "country_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        {
          type: "delete",
          params: [{ param_key: "country_id", data_key: "country_id" }],
        },
      ],
      primary_column: "country_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.ADMIN_STATES,
      columns: [
        { label: "State", data_key: "state_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        {
          type: "delete",
          params: [{ param_key: "state_id", data_key: "state_id" }],
        },
      ],
      primary_column: "state_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.ADMIN_BANKS,
      columns: [
        { label: "Banks", data_key: "bank_name", type: "text" },
        // { label: "Country", data_key: "country_name", type: "custom", component: BankCountryColumn },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        {
          type: "delete",
          params: [{ param_key: "bank_id", data_key: "bank_id" }],
        },
      ],
      primary_column: "bank_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.ADMIN_CLIENTS,
      columns: [
        { label: "Client", data_key: "client_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        {
          type: "delete",
          params: [{ param_key: "client_id", data_key: "client_id" }],
        },
      ],
      primary_column: "client_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.ADMIN_USERS,
      columns: [
        {
          label: "User Name",
          data_key: "user_name",
          type: "text",
        },
        {
          label: "Role",
          data_key: "role.role_name",
          type: "text",
          // mappingList: MappingListUserRole,
        },
        { label: "Email ID", data_key: "user_email", type: "text" },
        { label: "Mobile Number", data_key: "user_mobile", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        // {
        //   type: "delete",
        //   params: [{ param_key: "user_id", data_key: "user_id" }],
        // },
      ],
      primary_column: "user_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.ADMIN_COMPANY,
      columns: [
        { label: "Company Code", data_key: "company_code", type: "text" },
        { label: "Company Name", data_key: "company_name", type: "text" },
        {
          label: "Address Line 1",
          data_key: "company_reg_address1",
          type: "text",
        },
        {
          label: "Address Line 2",
          data_key: "company_reg_address2",
          type: "text",
        },
        { label: "City", data_key: "city.city_name", type: "text" },
        // { label: "Country", data_key: "client_name", type: "text" },
        // { label: "State", data_key: "client_name", type: "text" },
        {
          label: "Pincode",
          data_key: "company_reg_address_zip",
          type: "text",
        },
        // { label: "mobile app attendance allowed ", data_key: "mobile_app_attendance_allowed", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        // {
        //   type: "delete",
        //   params: [{ param_key: "company_id", data_key: "company_id" }],
        // },
      ],
      primary_column: "company_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_EMPLOYEES,
      columns: [
        {
          label: "Employee Code",
          data_key: "employee.employee_code",
          type: "text",
        },
        {
          label: "Employee Name",
          data_key: "employee.employee_first_name",
          type: "text",
        },
        { label: "Mobile", data_key: "employee.employee_mobile", type: "text" },
        {
          label: "Department",
          data_key: "company_department.company_department_name",
          type: "text",
        },
        {
          label: "Designation",
          data_key: "company_designation.company_designation_name",
          type: "text",
        },
        // {
        //   label: "View More",
        //   data_key: "employee_id",
        //   type: "custom",
        //   component: ListButtonViewDetails,
        // },
      ],
      actions: [
        { type: "edit" },
        // { type: "singleButton", singleButton: { link: PageLinks.EMPLOYER_PERSONAL_VIEW_DETAILS }, buttonText_1: "view details" },
        // { type: "delete", params: [{ param_key: "employee.employee_id", data_key: "employee.employee_id" }] }
      ],

      primary_column: "employee.employee_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_SALARY_REVISION,
      columns: [
        {
          label: "Employee Name",
          data_key: "employee_first_name",
          type: "text",
        },
        { label: "Salary Type", data_key: "company_name", type: "text" },
        {
          label: "Old Salary",
          data_key: "company_address_line1",
          type: "text",
        },
        {
          label: "New Salary",
          data_key: "company_address_line1",
          type: "text",
        },
        { label: "Remarks", data_key: "company_address_line1", type: "text" },
        {
          label: "Effective From Date",
          data_key: "company_address_line2",
          type: "text",
        },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
      ],

      primary_column: "uuid",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_LOAN,
      columns: [
        {
          label: "Employee Name",
          data_key: "employee_first_name",
          type: "text",
        },
        { label: "Loan Type", data_key: "company_name", type: "text" },
        {
          label: "Loan Amount",
          data_key: "company_address_line1",
          type: "text",
        },
        {
          label: "Interest Rate",
          data_key: "company_address_line1",
          type: "text",
        },
        {
          label: "Interest Calculation Type",
          data_key: "company_address_line1",
          type: "text",
        },
        { label: "Paid", data_key: "company_address_line2", type: "text" },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
      ],

      primary_column: "uuid",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_ADDITIONAL_ALLOWANCE,
      columns: [
        {
          label: "Allowance/Deductions ",
          data_key: "employee_first_name",
          type: "text",
        },
        { label: "Interval", data_key: "company_name", type: "text" },
        { label: "Duration", data_key: "company_address_line1", type: "text" },
        {
          label: "Salary Component",
          data_key: "company_address_line1",
          type: "text",
        },
        // { label: "Status", data_key: "company_address_line1", type: "text" },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        { type: "delete", params: [{ param_key: "uuid", data_key: "uuid" }] },
      ],

      primary_column: "uuid",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_ATTENDANCE,
      columns: [
        {
          label: "Employee  ",
          data_key: "employee.employee_first_name",
          type: "text",
        },
        { label: "Date", data_key: "attendance_date", type: "date" },
        // {
        //   label: "Attendance Type",
        //   data_key: "employee_attendance_type",
        //   type: "text",
        //   mappingList: MappingListAttendance,
        // },
        // { label: "Attendance Policy", data_key: "company_address_line1", type: "text" },
        // {
        //   label: "leave type",
        //   data_key: "leave_type_name",
        //   type: "custom",
        //   component: CellNAForZero,
        // },
        {
          label: "In Time ",
          data_key: "check_in",
          type: "text",
        },
        {
          label: "Out Time",
          data_key: "check_out",
          type: "text",
        },
        {
          label: "Regular Duration",
          data_key: "regular_shift_duration",
          type: "text",
        },
        {
          label: "Over Time Duration",
          data_key: "regular_shift_over_time_duration",
          type: "text",
        },
        {
          label: "Status",
          data_key: "status",
          type: "text",
        },
        // {
        //   label: "Night Differential Duration",
        //   data_key: "night_shift_duration",
        //   type: "text",
        // },
        // {
        //   label: "Night Differential Over Time Duration",
        //   data_key: "night_shift_over_time_duration",
        //   type: "text",
        // },
      ],
      actions: [
        // { type: "view" },
        // { type: "edit" },
        {
          type: "delete",
          params: [
            {
              param_key: "employee_attendance_id",
              data_key: "employee_attendance_id",
            },
          ],
        },
      ],

      primary_column: "employee_attendance_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_LEAVE_REQUEST,
      columns: [
        {
          label: "Employee ID",
          data_key: "employee.employee_code",
          type: "text",
        },
        {
          label: "Employee ",
          data_key: "employee.employee_first_name",
          type: "text",
        },
        {
          label: "Leave Request From",
          data_key: "leave_start_date",
          type: "text",
        },
        {
          label: "Leave Request Upto",
          data_key: "leave_end_date",
          type: "text",
        },
        // { label: "Attendance Policy", data_key: "company_address_line1", type: "text" },
        {
          label: "Reason",
          data_key: "leave_reason",
          type: "text",
        },
        // {
        //   label: "No Of Days",
        //   data_key: "employee_leave_req_days",
        //   type: "text",
        // },
        // { label: "Leave Type", data_key: "leave_type_name", type: "text" },
        //  { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        // { type: "delete", params: [{ param_key: "employee_id", data_key: "employee_id" }] }
      ],

      primary_column: "leave_request_id",
      status_column: "status",
    },

    {
      pageLink: PageLinks.EMPLOYEE_LEAVE_REQUEST,
      columns: [
        {
          label: "Employee ID",
          data_key: "employee.employee_code",
          type: "text",
        },
        {
          label: "Employee ",
          data_key: "employee.employee_first_name",
          type: "text",
        },
        {
          label: "Leave Request From",
          data_key: "leave_start_date",
          type: "text",
        },
        {
          label: "Leave Request Upto",
          data_key: "leave_end_date",
          type: "text",
        },

        // { label: "Attendance Policy", data_key: "company_address_line1", type: "text" },
        {
          label: "Reason",
          data_key: "leave_reason",
          type: "text",
        },
        {
          label: "Status",
          data_key: "leave_status",
          type: "text",
        },
        // {
        //   label: "No Of Days",
        //   data_key: "employee_leave_req_days",
        //   type: "text",
        // },
        // { label: "Leave Type", data_key: "leave_type_name", type: "text" },
        //  { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        // { type: "delete", params: [{ param_key: "employee_id", data_key: "employee_id" }] }
      ],

      primary_column: "leave_request_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYEE_PENDING_LEAVE_REQUEST,
      columns: [
        {
          label: "Employee ID",
          data_key: "employee.employee_code",
          type: "text",
        },
        {
          label: "Employee ",
          data_key: "employee.employee_first_name",
          type: "text",
        },
        {
          label: "Leave Request From",
          data_key: "leave_start_date",
          type: "text",
        },
        {
          label: "Leave Request Upto",
          data_key: "leave_end_date",
          type: "text",
        },

        // { label: "Attendance Policy", data_key: "company_address_line1", type: "text" },
        {
          label: "Reason",
          data_key: "leave_reason",
          type: "text",
        },
        {
          label: "Status",
          data_key: "leave_status",
          type: "text",
        },
        // {
        //   label: "No Of Days",
        //   data_key: "employee_leave_req_days",
        //   type: "text",
        // },
        // { label: "Leave Type", data_key: "leave_type_name", type: "text" },
        //  { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "approveOrReject" },
        // { type: "delete", params: [{ param_key: "employee_id", data_key: "employee_id" }] }
      ],

      primary_column: "leave_request_id",
      status_column: "status",
    },

    {
      pageLink: PageLinks.EMPLOYER_LEAVE_HISTORY,
      columns: [
        { label: "Employee  ", data_key: "employee_name", type: "text" },
        {
          label: "Leave Request From",
          data_key: "employee_leave_req_period_from",
          type: "text",
        },
        {
          label: "Leave Request Upto",
          data_key: "employee_leave_req_period_to",
          type: "text",
        },
        // { label: "Attendance Policy", data_key: "company_address_line1", type: "text" },
        {
          label: "Reason",
          data_key: "employee_leave_req_reason",
          type: "text",
        },
        {
          label: "No Of Days",
          data_key: "employee_leave_req_days",
          type: "text",
        },
        { label: "Leave Type", data_key: "leave_type_name", type: "text" },
        //  { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        // { type: "edit" },
        // { type: "delete", params: [{ param_key: "employee_attendance_id", data_key: "employee_attendance_id" }] }
      ],

      primary_column: "employee_leave_req_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_LEAVE_BALANCE,
      columns: [
        { label: "Employee  ", data_key: "employee_name", type: "text" },
        { label: "Leave Type", data_key: "leave_type_name", type: "text" },
        {
          label: "Current Balance",
          data_key: "employee_leave_credit_count",
          type: "text",
        },
      ],
      actions: [
        // { type: "view" },
        // { type: "edit" },
        // { type: "delete", params: [{ param_key: "employee_id", data_key: "employee_id" }] }
      ],

      primary_column: "employee_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYEE_LEAVE_BALANCE,
      columns: [
        { label: "Employee ID", data_key: "employee.employee_code", type: "text" },
        { label: "Employee Name", data_key: "employee.employee_first_name", type: "text" },
        // { label: "Leave Type", data_key: "leave_type_name", type: "text" },
        {
          label: "Current Balance",
          data_key: "company_leave_credit",
          type: "text",
        },
      ],
      actions: [
        // { type: "view" },
        // { type: "edit" },
        // { type: "delete", params: [{ param_key: "employee_id", data_key: "employee_id" }] }
      ],

      primary_column: "employee_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_LEAVE_CREDITS,
      columns: [
        {
          label: "Employee ID",
          data_key: "employee.employee_code",
          type: "text",
        },
        {
          label: "Employee  ",
          data_key: "employee.employee_first_name",
          type: "text",
        },
        // { label: "Leave Type", data_key: "leave_type_name", type: "text" },
        // { label: "Opening Balance", data_key: "opening_balance", type: "text" },
        {
          label: "Leave Credits",
          data_key: "company_leave_credit",
          type: "text",
        },
        // { label: "Closing Balance", data_key: "closing_balance", type: "text" },
        //  { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        // {
        //   type: "delete",
        //   params: [
        
        //     {
        //       param_key: "employee_leave_credit_id",
        //       data_key: "employee_leave_credit_id",
        //     },
        //   ],
        // },
      ],

      primary_column: "leave_credit_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_PAYROLL_PROCESS,
      columns: [
        // { label: "Company Name  ", data_key: "employee_name", type: "text" },
        // { label: "Payroll Month", data_key: "leave_type_name", type: "text" },
        {
          label: "Payment Date",
          data_key: "payroll_total_days",
          type: "custom",
          customKeys: ["payroll_period_from", "payroll_period_to"],
          component: CellMultilineDate,
        },
        // { label: "No Of Employees", data_key: "employee_leave_credit_count", type: "text" },
        // { label: "Employee Net Pay", data_key: "closing_balance", type: "text" },
        //  { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        {
          type: "singleButton",
          singleButton: { link: PageLinks.EMPLOYER_PROCESS_PAY_RUN },
          buttonText_1: "Create Pay Run",
        },
      ],

      primary_column: "payroll_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_EMPLOYEE_PAYROLL,
      columns: [
        // { label: "Employee Name", data_key: "employee_name", type: "text" },
        {
          label: "Basic Pay",
          data_key: "employee_payroll_actual_month_basic_pay",
          type: "text",
        },
        { label: "Allowance", data_key: "payroll_total_days", type: "text" },
        // { label: "Deductions", data_key: "employee_leave_credit_count", type: "text" },
        // { label: "Loss Of Pay", data_key: "closing_balance", type: "text" },
        {
          label: "Net Pay",
          data_key: "employee_payroll_calc_month_net_pay",
          type: "text",
        },
        //  { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        // { type: "edit" },
        // { type: "delete", params: [{ param_key: "employee_leave_credit_id", data_key: "employee_leave_credit_id" }] }
      ],

      primary_column: "employee_payroll_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_COMPANY_DETAILS,
      columns: [
        { label: "Company Name  ", data_key: "company_name", type: "text" },
        {
          label: "Registered Address",
          data_key: "company_reg_address1",
          type: "custom",
          customKeys: ["company_reg_address1", "company_reg_address2"],
          component: CellMultilineAddress,
        },
        { label: "Location", data_key: "city.city_name", type: "text" },
        { label: "Company mail ID", data_key: "company_mail", type: "text" },
        {
          label: "Operating currency",
          data_key: "country.country_currency_name",
          type: "text",
        },
        //{ label: "Default probation days", data_key: "company_default_probation_days", type: "text" },
        // {
        //   label: "Salary type ",
        //   data_key: "company_salary_definition_type",
        //   type: "text",
        //   mappingList: MappingListSalaryType,
        // },
        // { label: "Allow Attendance ", data_key: "mobile_app_attendance_allowed", type: "text" },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
      ],

      primary_column: "company_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_COMPANY_LOCATION,
      columns: [
        { label: "Location", data_key: "company_location_name", type: "text" },
        {
          label: "Registered Address",
          data_key: "company_location_address_city",
          type: "custom",
          customKeys: [
            "company_location_address_line1",
            "company_location_address_line2",
          ],
          component: CellMultilineAddress,
        },
        {
          label: "City",
          data_key: "company_location_address_city",
          type: "text",
        },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        {
          type: "delete",
          params: [
            {
              param_key: "company_location_id",
              data_key: "company_location_id",
            },
          ],
        },
      ],

      primary_column: "company_location_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_COMPANY_BANK_DETAILS,
      columns: [
        { label: "Bank Name", data_key: "bank_name", type: "text" },
        {
          label: "Account Holder Name",
          data_key: "company_name",
          type: "text",
        },
        { label: "Account Number", data_key: "company_name", type: "text" },
        { label: "IFSC code", data_key: "company_name", type: "text" },
        // { label: "Status", data_key: "company_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        {
          type: "delete",
          params: [{ param_key: "company_id", data_key: "company_id" }],
        },
      ],

      primary_column: "company_id",
      status_column: "status",
    },

    {
      pageLink: PageLinks.EMPLOYER_HOLIDAY_GROUPS,
      columns: [
        {
          label: "Holiday Group ",
          data_key: "company_holiday_group_name",
          type: "text",
        },
        // { label: "Location", data_key: "", type: "text" },
        // { label: " Status", data_key: "company_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        // {
        //   type: "delete",
        //   params: [
        //     { param_key: "holiday_group_id", data_key: "holiday_group_id" },
        //   ],
        // },
      ],

      primary_column: "company_holiday_group_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_HOLIDAY_TYPES,
      columns: [
        {
          label: "Holiday Type ",
          data_key: "company_holiday_type_name",
          type: "text",
        },
        // {
        //   label: "Holiday Type UID ",
        //   data_key: "company_holiday_type_uid",
        //   type: "text",
        // },
        // { label: " Status", data_key: "company_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        // {
        //   type: "delete",
        //   params: [
        //     { param_key: "holiday_type_id", data_key: "holiday_type_id" },
        //   ],
        // },
      ],

      primary_column: "company_holiday_type_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_HOLIDAY,
      columns: [
        { label: "Date", data_key: "company_holiday_date", type: "date" },
        {
          label: " Holiday Name",
          data_key: "company_holiday_name",
          type: "text",
        },
        {
          label: " Holiday Type",
          data_key: "company_holiday_type.company_holiday_type_name",
          type: "text",
        },
        {
          label: " Description",
          data_key: "company_holiday_description",
          type: "text",
        },
        // { label: " Holiday Groups", data_key: "company_name", type: "text" },
        // { label: " Status", data_key: "company_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        { type: "edit" },
        // {
        //   type: "delete",
        //   params: [{ param_key: "holiday_id", data_key: "holiday_id" }],
        // },
      ],

      primary_column: "company_holiday_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_PARTNERS,
      columns: [
        { label: "Partner Name  ", data_key: "partner_name", type: "text" },
        {
          label: "Partner Address",
          data_key: "partner_address_city",
          type: "text",
        },
        // { label: " status", data_key: "company_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
        {
          label: "Partner Address",
          data_key: "partner_address_line1",
          type: "custom",
          customKeys: [
            "partner_address_line1",
            "partner_address_line2",
            "partner_address_city",
          ],
          component: CellMultilineAddress,
        },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        {
          type: "delete",
          params: [{ param_key: "partner_id", data_key: "partner_id" }],
        },
      ],

      primary_column: "partner_id",
      status_column: "status",
    },

    {
      pageLink: PageLinks.EMPLOYER_DEPARTMENTS,
      columns: [
        {
          label: "department name",
          data_key: "company_department_name",
          type: "text",
        },
        {
          label: "Company name",
          data_key: "company.company_name",
          type: "text",
        },
        // { label: " status", data_key: "company_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        // {
        //   type: "delete",
        //   params: [{ param_key: "department_id", data_key: "department_id" }],
        // },
      ],

      primary_column: "company_department_id",
      status_column: "status",
    },

    {
      pageLink: PageLinks.EMPLOYER_DESIGNATIONS,
      columns: [
        {
          label: "Department name ",
          data_key: "company_department.company_department_name",
          type: "text",
        },
        {
          label: "designation name ",
          data_key: "company_designation_name",
          type: "text",
        },
        // { label: " status", data_key: "company_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],

      actions: [
        // { type: "view" },
        { type: "edit" },
        // {
        //   type: "delete",
        //   params: [{ param_key: "designation_id", data_key: "designation_id" }],
        // },
      ],

      primary_column: "company_designation_id",
      status_column: "status",
    },

    {
      pageLink: PageLinks.EMPLOYER_WORK_SHIFTS,
      columns: [
        {
          label: "shift name ",
          data_key: "company_workshift_name",
          type: "text",
        },
        {
          label: " scheduled In Time",
          data_key: "company_workshift_start_time",
          type: "text",
        },
        {
          label: " in time late tolerance",
          data_key: "company_workshift_start_grace_period",
          type: "text",
        },
        {
          label: " scheduled out time",
          data_key: "company_workshift_end_time",
          type: "text",
        },
        {
          label: " out time early tolerance",
          data_key: "company_workshift_end_grace_period",
          type: "text",
        },
        // { label: " status", data_key: "company_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        // {
        //   type: "delete",
        //   params: [{ param_key: "work_shift_id", data_key: "work_shift_id" }],
        // },
      ],

      primary_column: "company_workshift_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_WORK_TIME_COMPENSATIONS,
      columns: [
        {
          label: "Workshift",
          data_key: "company_workshift.company_workshift_name",
          type: "text",
          // mappingList: MappingListWorkTimeCompensation,
        },
        {
          label: "day type  ",
          data_key: "day_type.day_type_name",
          type: "text",
          // mappingList: MappingListWorkTimeCompensation,
        },
        // {
        //   label: "Holiday Type",
        //   data_key: "holiday_type_name",
        //   type: "custom",
        //   component: CellNAForZero,
        // },
        {
          label: "Regular Shift",
          data_key: "company_workshift_pay_regular",
          type: "text",
        },
        {
          label: "Regular Shift OT",
          data_key: "company_workshift_pay_overtime",
          type: "text",
        },
        // {
        //   label: "Regular Night Shift",
        //   data_key: "company_workshift_pay_night",
        //   type: "text",
        // },
        // {
        //   label: "Regular Pay (Night)",
        //   data_key: "company_workshift_pay_night",
        //   type: "text",
        // },

        // {
        //   label: "Regular Night Shift OT",
        //   data_key: "company_workshift_pay_night_overtime",
        //   type: "text",
        // },
        // {
        //   label: "night differential overtime percentage",
        //   data_key: "work_time_comp_percent_ndot",
        //   type: "text",
        // },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
      ],

      primary_column: "company_workshift_pay_id",
      status_column: "status",
    },

    {
      pageLink: PageLinks.EMPLOYER_LEAVE_TYPE,
      columns: [
        { label: "leave type name", data_key: "leave_type_name", type: "text" },
        {
          label: "leave type abbreviation",
          data_key: "leave_type_abbreviation",
          type: "text",
        },
        {
          label: "allowed gender",
          data_key: "leave_type_gender_allowed",
          type: "text",
          mappingList: MappingListGenders,
        },
        {
          label: "allowed marital status",
          data_key: "leave_type_allowed_marital_status",
          type: "text",
          mappingList: MappingListMaritalStatuses,
        },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        {
          type: "delete",
          params: [{ param_key: "leave_type_id", data_key: "leave_type_id" }],
        },
      ],

      primary_column: "leave_type_id",
    },

    {
      pageLink: PageLinks.EMPLOYER_LEAVE_PLAN,
      columns: [
        { label: "leave plan name", data_key: "leave_plan_name", type: "text" },

        // { label: " status", data_key: "company_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        {
          type: "delete",
          params: [{ param_key: "leave_plan_id", data_key: "leave_plan_id" }],
        },
      ],

      primary_column: "leave_plan_id",
      status_column: "status",
    },

    {
      pageLink: PageLinks.EMPLOYER_MASTERS_LOAN_TYPE,
      columns: [
        {
          label: "loan type name",
          data_key: "employee_first_name",
          type: "text",
        },

        // { label: " status", data_key: "company_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        { type: "delete", params: [{ param_key: "uuid", data_key: "uuid" }] },
      ],

      primary_column: "uuid",
      status_column: "status",
    },

    {
      pageLink: PageLinks.EMPLOYER_REST_DAY_GROUPS,
      columns: [
        {
          label: "rest day group name",
          data_key: "company_weekoff_name",
          type: "text",
        },
        // { label: " days", data_key: "company_name", type: "text" },
        // { label: " restricted weeks", data_key: "company_name", type: "text" },

        // { label: " status", data_key: "company_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        // {
        //   type: "delete",
        //   params: [
        //     { param_key: "rest_day_group_id", data_key: "rest_day_group_id" },
        //   ],
        // },
      ],

      primary_column: "company_weekoff_id",
      status_column: "status",
    },

    {
      pageLink: PageLinks.EMPLOYER_ATTENDANCE_POLICIES,
      columns: [
        {
          label: "Attendance Policy Name",
          data_key: "policy_name",
          type: "text",
        },
        /*{ label: "rest day group name", data_key: "company_name", type: "text" },
                { label: "work shift", data_key: "company_name", type: "text" },
                { label: "Number of permissible time allowances", data_key: "company_name", type: "text" },
                { label: "holiday group", data_key: "company_name", type: "text" },*/
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        // {
        //   type: "delete",
        //   params: [
        //     {
        //       param_key: "attendance_policy_id",
        //       data_key: "attendance_policy_id",
        //     },
        //   ],
        // },
      ],

      primary_column: "company_attendance_policy_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_PROJECTS,
      columns: [
        {
          label: "Project Name",
          data_key: "project_name",
          type: "text",
        },
        {
          label: "Project Description",
          data_key: "description",
          type: "text",
        },
        {
          label: "Team",
          data_key: "project_team",
          type: "avatar",
        },
        {
          label: "Completion Date",
          data_key: "deadline",
          type: "text",
        },
        {
          label: "Status",
          data_key: "status",
          type: "text",
        },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        // {
        //   type: "delete",
        //   params: [
        //     {
        //       param_key: "attendance_policy_id",
        //       data_key: "attendance_policy_id",
        //     },
        //   ],
        // },
      ],

      primary_column: "company_project_id",
      status_column: "status",
    },

    {
      pageLink: PageLinks.EMPLOYER_SALARY_COMPONENTS,
      columns: [
        {
          label: "salary component name",
          data_key: "salary_component_name",
          type: "text",
        },
        {
          label: "component abbreviation",
          data_key: "salary_component_abbreviation",
          type: "text",
        },
        {
          label: "component type",
          data_key: "salary_component_type",
          type: "text",
          mappingList: MappingListSalaryComponentTypes,
        },
        {
          label: "calculation type",
          data_key: "salary_component_calc_type",
          type: "text",
          mappingList: MappingListComponentCalculationTypes,
        },
        {
          label: " fixed amount",
          data_key: "salary_component_common_fixed_value",
          type: "custom",
          component: CellSalaryComponentFixedValue,
        },
        {
          label: "formula",
          data_key: "salary_component_calculation_formula",
          type: "custom",
          component: CellSalaryComponentFormula,
        },
        {
          label: "statistical component",
          data_key: "salary_component_is_statistical",
          type: "text",
          mappingList: MappingListYesNo,
        },
        {
          label: "tax applicable ",
          data_key: "salary_component_tax_applicable",
          type: "text",
          mappingList: MappingListYesNo,
        },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        {
          type: "delete",
          params: [
            {
              param_key: "salary_component_id",
              data_key: "salary_component_id",
            },
          ],
        },
      ],

      primary_column: "salary_component_id",
      status_column: "status",
    },

    {
      pageLink: PageLinks.EMPLOYER_SALARY_GROUPS,
      columns: [
        {
          label: "salary group name",
          data_key: "salary_group_name",
          type: "text",
        },
        // { label: "salary component", data_key: "salary_group_components", type: "text" },
        // { label: "basic pay", data_key: "company_name", type: "text" },
        // { label: "payroll interval", data_key: "company_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        {
          type: "delete",
          params: [
            { param_key: "salary_group_id", data_key: "salary_group_id" },
          ],
        },
      ],

      primary_column: "salary_group_id",
      status_column: "status",
    },

    {
      pageLink: PageLinks.EMPLOYER_PAYROLL_GROUP,
      columns: [
        {
          label: "payroll group name",
          data_key: "payroll_group_name",
          type: "text",
        },
        {
          label: "payroll interval",
          data_key: "payroll_interval",
          type: "text",
          // mappingList: MappingListPayrollInterval,
        },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        // {
        //   type: "delete",
        //   params: [
        //     { param_key: "payroll_group_id", data_key: "payroll_group_id" },
        //   ],
        // },
      ],

      primary_column: "company_payroll_group_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_ROLES,
      columns: [
        { label: "role name", data_key: "employee_first_name", type: "text" },

        { label: " status", data_key: "company_name", type: "text" },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        { type: "delete", params: [{ param_key: "uuid", data_key: "uuid" }] },
      ],

      primary_column: "uuid",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYER_USERS,
      columns: [
        { label: " role name  ", data_key: "user_display_name", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        {
          type: "delete",
          params: [{ param_key: "user_id", data_key: "user_id" }],
        },
      ],

      primary_column: "user_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.EMPLOYEE_REPORT,
      columns: [
        { label: " Project Title  ", data_key: "project_title", type: "text" },
        {
          label: " Project Description  ",
          data_key: "report_summary",
          type: "text",
        },
        { label: "Task ID", data_key: "task_id", type: "text" },
        { label: "Status", data_key: "status", type: "text" },
        { label: " Report Date  ", data_key: "report_date", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        { type: "edit" },
        // {
        //   type: "delete",
        //   params: [{ param_key: "user_id", data_key: "user_id" }],
        // },
      ],

      primary_column: "employee_report_id",
      status_column: "status",
    },
    {
      pageLink: PageLinks.ALLOCATED_EMPLOYEE_REPORT,
      columns: [
        { label: "Employee ID", data_key: "employee.employee_code", type: "text" },
        { label: "Name", data_key: "employee.employee_first_name", type: "text" },
        { label: " Project Title  ", data_key: "project_title", type: "text" },
        {
          label: " Project Description  ",
          data_key: "report_summary",
          type: "text",
        },
        { label: "Task ID", data_key: "task_id", type: "text" },
        { label: "Status", data_key: "status", type: "text" },
        { label: " Report Date  ", data_key: "report_date", type: "text" },
        // { label: "Status", data_key: "status", type: "custom", component: CellStatusUpdateBadge },
      ],
      actions: [
        // { type: "view" },
        // { type: "edit" },
        // {
        //   type: "delete",
        //   params: [{ param_key: "user_id", data_key: "user_id" }],
        // },
      ],

      primary_column: "employee_report_id",
      status_column: "status",
    },
  ];

  export const getPageTableDetail = (pageLink: string): TableDetail => {
    const tableDetail = tableList.find((table) => {
      return table.pageLink === pageLink;
    });
    return tableDetail
      ? tableDetail
      : { pageLink: "", columns: [], primary_column: "" };
  };

  /*export const getMappedData = (pageLink: string, column_data_key: string, dataID: number, data?: any) => {
        //let itemDetail: MappingDetail | undefined = undefined;
        let selectedList: MappingDetail[] = [];

        if (column_data_key.includes('gender')) {
            selectedList = GenderList;
        }
        if (!selectedList.length && column_data_key.includes('marital_status')) {
            selectedList = MaritalStatusList;
        }
        if (['salary_component_tax_applicable', 'salary_component_is_statistical'].includes(column_data_key)) {
            selectedList = YesNoList;
        }
        if (!selectedList.length && column_data_key.includes('marital_status') && (column_data_key === 'status' || column_data_key.endsWith('_status'))) {
            selectedList = StatusList;
        }
        if (column_data_key === 'salary_component_type') {
            selectedList = SalaryComponentTypeList;
        }

        let itemDetail = selectedList.find(item => {
            return item.ID === dataID;
        });

        return itemDetail ? itemDetail : { ID: 0, mappingName: '' };
    }*/
}
