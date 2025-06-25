import { DateFilterType, Endpoints, PageLinks } from "./Constants";
import { FormDataTypes, UIDataTypes } from "./DataTypes";
import EmployeeStaticFormDialog from "../forms/EmployeeStaticFormDialog";
import CountriesEntryDialog from "../forms/CountriesEntryDialog";
import StateEntryDialog from "../forms/StatesEntryDialog";
import ClientEntryDialog from "../forms/ClientEntryDialog";
import BankEntryDialog from "../forms/BankEntryDialog";
import CompanyEntryDialog from "../forms/CompanyEntryDialog";
import CompanyDetailsEntryDialog from "../forms/CompanyDetailsEntryDialog";
import CompanyLocationEntryDialog from "../forms/CompanyLocationEntryDialog";
import BankAccountEntryDialog from "../forms/BankAccountEntryDialog";
import HolidayGroupEntryDialog from "../forms/HolidayGroupEntryDialog";
import HolidayTypeEntryDialog from "../forms/HolidayTypeEntryDialog";
import HolidayEntryDialog from "../forms/HolidayEntryDialog";
import PartnerEntryDialog from "../forms/PartnerEntryDialog";
import DepartmentEntryDialog from "../forms/DepartmentEntryDialog";
import DesignationEntryDialog from "../forms/DesignationEntryDialog";
import LeaveTypeEntryDialog from "../forms/LeaveTypeEntryDialog";
import LoanTypeEntryDialog from "../forms/LoanTypeEntryDialog";
import RestDayGroupsEntryDialog from "../forms/RestDayGroupsEntryDialog";
import AttendancePolicyEntryDialog from "../forms/AttendancePolicyEntryDialog";
import SalaryComponentEntryDialog from "../forms/SalaryComponentEntryDialog";
import SalaryGroupEntryDialog from "../forms/SalaryGroupEntryDialog";
import PayrollGroupsEntryDialog from "../forms/PayrollGroupsEntryDialog";
import RoleEntryDialog from "../forms/RoleEntryDialog";
import UserEntryDialog from "../forms/UserEntryDialog";
import LeavePlanEntryDialog from "../forms/LeavePlanEntryDialog";
import WorkShiftEntryDialog from "../forms/WorkShiftEntryDialog";
import LeaveCreditEntryDialog from "../forms/LeaveCreditEntryDialog";
import UploadAttendanceEntryDialog from "../forms/UploadAttendanceEntryDialog";
import UploadEmployeeEntryDialog from "../forms/UploadEmployeeEntryDialog";
import EmployeeEntryDialog from "../forms/EmployeeEntryDialog";
import WorkTimeCompensationsFormDialog from "../forms/WorkTimeCompensationsFormDialog";
import ListButtonExportEmployees from "../components/list-custom-btns/ListButtonExportEmployees";
import ListButtonDownloadEmployeeTemplate from "../components/list-custom-btns/ListButtonDownloadEmployeeTemplate";
import LeaveRequestEntryDialog from "../forms/LeaveRequestEntryDialog";
import { getLoginCompanyID } from "./Utilities";
import EmployeeReportEntryDialog from "../forms/EmployeeReportEntryDialog";
import EmployeeLeaveRequestEntryDialog from "../forms/EmployeeLeaveRequestEntryDialog";
import ProjectEntryDialog from "../forms/ProjectEntryDialog";

export namespace PageMappings {

    interface AdditionalFilter {
        label: string;
        paramName: string;
        optional: boolean;
        options: FormDataTypes.SelectOption[];
    }

    interface ListButtons {
        type: 'form-control' | 'custom',
        customComponent?: any;
        iconStart?: string;
        iconEnd?: string;
        title?: string;
        linkedForm?: any;
    }

    export interface PageDetail {
        pageLink: string;
        title: string;
        titleSingular?: string;
        exportDataBtn?: string;
        //editBtn?: string;
        uploadEmployeeDataBtn?: string;
        addEmployeeBtn?: string;
        addEmployeeForm?: any;
        searchBox?: boolean;
        selectDate?: boolean;
        listEndpoint: string;
        personalDetailsForm?: any;
        listAddlParams?: {
            param_name: string;
            param_value: string | number | boolean;
        }[]
        listResponseParam?: string;
        deleteEndpoint?: string;
        statusUpdate?: { endpoint: string; paramName: string };
        form?: any;
        tabs?: UIDataTypes.TabItem[];
        additionalFilter?: AdditionalFilter;
        additionalFilterTitle?: string;
        componentSubText?: string;
        detailView?: any;
        additionalFilterSelect?: boolean;
        detailViewIsForm?: boolean;
        addAvailable?: boolean;
        exportAvailable?: boolean;
        additionalListButtons?: ListButtons[];
        // exportColumns?: TableViewMappings.TableColumn[];
        dateFilterType?: number;
        dateFilterRequired?: boolean;
        noPagination?: boolean;
        approveAndNext?: boolean;
        deleteMultipleEntry?: boolean;
        tableDetail: boolean;
        hidePagination?:boolean
    }

    const AdditionalFilterPayroll: AdditionalFilter = {
        label: 'Payroll Group',
        paramName: 'payroll_group',
        optional: false,
        options: [
            {
                label: "Monthly",
                value: "1"
            },
            {
                label: "Bi-Monthly",
                value: "2"
            },
        ]
    }

    const TabsCompanyDetails: UIDataTypes.TabItem[] = [
        {
            tabLabel: "Company Details",
            tabLink: PageLinks.EMPLOYER_COMPANY_DETAILS,
        },
        // {
        //     tabLabel: "Company Location",
        //     tabLink: PageLinks.EMPLOYER_COMPANY_LOCATION,
        // },
        // {
        //     tabLabel: "Company Bank Details",
        //     tabLink: PageLinks.EMPLOYER_COMPANY_BANK_DETAILS,
        // }
    ]

    const TabsHolidayGroup: UIDataTypes.TabItem[] = [
        {
            tabLabel: "Holiday Groups",
            tabLink: PageLinks.EMPLOYER_HOLIDAY_GROUPS,
        },
        {
            tabLabel: "Holiday Types",
            tabLink: PageLinks.EMPLOYER_HOLIDAY_TYPES,
        },
        {
            tabLabel: "Holidays",
            tabLink: PageLinks.EMPLOYER_HOLIDAY,
        }
    ]

    const TabsDepartment: UIDataTypes.TabItem[] = [
        {
            tabLabel: "departments ",
            tabLink: PageLinks.EMPLOYER_DEPARTMENTS,
        },
        {
            tabLabel: "designations ",
            tabLink: PageLinks.EMPLOYER_DESIGNATIONS,
        },

    ]
    const TabsMasterUsers: UIDataTypes.TabItem[] = [
        {
            tabLabel: "roles ",
            tabLink: PageLinks.EMPLOYER_ROLES,
        },
        {
            tabLabel: "users ",
            tabLink: PageLinks.EMPLOYER_USERS,
        },
    ]


    const TabsAttendancePolicies: UIDataTypes.TabItem[] = [
        // {
        //     tabLabel: "rest day groups ",
        //     tabLink: PageLinks.EMPLOYER_REST_DAY_GROUPS,
        // },
        {
            tabLabel: "attendance policies ",
            tabLink: PageLinks.EMPLOYER_ATTENDANCE_POLICIES,
        },

    ]
    const TabsSalaryGroups: UIDataTypes.TabItem[] = [
        {
            tabLabel: "salary groups",
            tabLink: PageLinks.EMPLOYER_SALARY_GROUPS,
        },
        {
            tabLabel: "salary components",
            tabLink: PageLinks.EMPLOYER_SALARY_COMPONENTS,
        },

    ]
    const TabsWorkShift: UIDataTypes.TabItem[] = [
        {
            tabLabel: "work shifts ",
            tabLink: PageLinks.EMPLOYER_WORK_SHIFTS,
        },
        {
            tabLabel: "work time compensations ",
            tabLink: PageLinks.EMPLOYER_WORK_TIME_COMPENSATIONS,
        },
        // {
        //     tabLabel: "leave types",
        //     tabLink: PageLinks.EMPLOYER_LEAVE_TYPE,

        // },
        // {
        //     tabLabel: "leave plans",
        //     tabLink: PageLinks.EMPLOYER_LEAVE_PLAN,
        // },
        {
            tabLabel: "rest day groups",
            tabLink: PageLinks.EMPLOYER_REST_DAY_GROUPS,
        },

    ]

    const TabsEmployeesDetails: UIDataTypes.TabItem[] = [
        {
            tabLabel: "All Employees",
            tabLink: PageLinks.EMPLOYER_EMPLOYEES,
        },
        // {
        //     tabLabel: "Active Employees",
        //     tabLink: PageLinks.EMPLOYER_EMPLOYEES,
        // }, {
        //     tabLabel: "Previous Employees",
        //     tabLink: PageLinks.EMPLOYER_EMPLOYEES,
        // }

    ]
    const TabsEmployeesLoanDetails: UIDataTypes.TabItem[] = [
        {
            tabLabel: "Employee Loans",
            tabLink: PageLinks.EMPLOYER_EMPLOYEES,
        },
        {
            tabLabel: "Loan History",
            tabLink: PageLinks.EMPLOYER_EMPLOYEES,
        },
    ]
    const pageList: PageDetail[] = [
        {
            pageLink: PageLinks.EMPLOYER_DASHBOARD,
            title: "Dashboard",
            listEndpoint: Endpoints.COMPANY_LIST,
            listResponseParam: 'companies',
            tableDetail: false,
        },
        {
            pageLink: PageLinks.ADMIN_DASHBOARD,
            title: "Admin Dashboard",
            listEndpoint: Endpoints.COMPANY_LIST,
            listResponseParam: 'companies',
            tableDetail: false,
        },

        // {
        //     pageLink: PageLinks.ADMIN_COMPANY,
        //     title: "Company Details",
        //     // titleSingular: "Company Details",
        //     // listEndpoint: `${Endpoints.COMPANY_LIST}/${getLoginCompanyID()}`,
        //     listEndpoint: Endpoints.COMPANY_LIST,
        //     form: CompanyDetailsEntryDialog,
        //     tabs: TabsCompanyDetails,
        //     addAvailable: false,
        //     searchBox: false,
        //     // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
        //     detailViewIsForm: true,
        //     listResponseParam: 'companies',
        //     tableDetail: true,
        // },

        {
            pageLink: PageLinks.EMPLOYER_COMPANY_DETAILS,
            title: "Company Details",
            // titleSingular: "Company Details",
            // listEndpoint: `${Endpoints.COMPANY_LIST}/${getLoginCompanyID()}`,
            listEndpoint: Endpoints.CLIENT_COMPANY_LIST,
            form: CompanyDetailsEntryDialog,
            // tabs: TabsCompanyDetails,
            addAvailable: false,
            searchBox: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'companies',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_COMPANY_LOCATION,
            title: "Company Location",
            titleSingular: "New location",
            listEndpoint: Endpoints.COMPANY_LOCATION,
            deleteEndpoint: Endpoints.COMPANY_LOCATION,
            form: CompanyLocationEntryDialog,
            tabs: TabsCompanyDetails,
            addAvailable: true,
            searchBox: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'company_locations',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_COMPANY_BANK_DETAILS,
            title: "Company Bank Details",
            titleSingular: "New account",
            listEndpoint: Endpoints.BANK_LIST,
            deleteEndpoint: Endpoints.BANK_LIST,
            form: BankAccountEntryDialog,
            tabs: TabsCompanyDetails,
            addAvailable: true,
            searchBox: false,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'banks_details',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_HOLIDAY_GROUPS,
            title: "Holiday Groups",
            titleSingular: "Holiday Group",
            listEndpoint: Endpoints.HOLIDAY_GROUPS,
            deleteEndpoint: Endpoints.HOLIDAY_GROUPS,
            form: HolidayGroupEntryDialog,
            tabs: TabsHolidayGroup,
            addAvailable: true,
            searchBox: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'holiday_groups',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_HOLIDAY_TYPES,
            title: "Holiday Types",
            titleSingular: "Holiday Type",
            listEndpoint: Endpoints.HOLIDAY_TYPES,
            deleteEndpoint: Endpoints.HOLIDAY_TYPES,
            form: HolidayTypeEntryDialog,
            tabs: TabsHolidayGroup,
            addAvailable: true,
            searchBox: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'holiday_types',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_HOLIDAY,
            title: "Holidays",
            titleSingular: "Holiday",
            listEndpoint: Endpoints.HOLIDAY_LIST,
            deleteEndpoint: Endpoints.HOLIDAY_LIST,
            // selectDate: true,
            form: HolidayEntryDialog,
            tabs: TabsHolidayGroup,
            addAvailable: true,
            searchBox: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'holidays',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_PARTNERS,
            title: "Partners",
            titleSingular: "Partner",
            listEndpoint: Endpoints.PARTNER_LIST,
            deleteEndpoint: Endpoints.PARTNER_LIST,
            form: PartnerEntryDialog,
            addAvailable: true,
            searchBox: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'partners',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_DEPARTMENTS,
            title: "departments",
            titleSingular: "department",
            listEndpoint: Endpoints.CLIENT_DEPARTMENT_LIST,
            deleteEndpoint: Endpoints.CLIENT_DEPARTMENT_LIST,
            form: DepartmentEntryDialog,
            tabs: TabsDepartment,
            addAvailable: true,
            searchBox: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'departments',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_DESIGNATIONS,
            title: "designations",
            titleSingular: "designations",
            listEndpoint: Endpoints.CLIENT_DESIGNATION_LIST,
            deleteEndpoint: Endpoints.CLIENT_DESIGNATION_LIST,
            form: DesignationEntryDialog,
            tabs: TabsDepartment,
            addAvailable: true,
            searchBox: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'designations',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_WORK_SHIFTS,
            title: "work shifts",
            titleSingular: "work shifts",
            listEndpoint: Endpoints.WORK_SHIFTS,
            deleteEndpoint: Endpoints.WORK_SHIFTS,
            form: WorkShiftEntryDialog,
            tabs: TabsWorkShift,
            addAvailable: true,
            searchBox: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'work_shifts',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_WORK_TIME_COMPENSATIONS,
            title: "work time compensations",
            titleSingular: "compensations",
            listEndpoint: Endpoints.EMPLOYER_WORK_TIME_COMPENSATIONS_LIST,
            deleteEndpoint: Endpoints.EMPLOYER_WORK_TIME_COMPENSATIONS_LIST,
            form: WorkTimeCompensationsFormDialog,
            tabs: TabsWorkShift,
            // editBtn: "edit",
            addAvailable: true,
            searchBox: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'work_time_compensations',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_LEAVE_TYPE,
            title: "leave types",
            titleSingular: "leave type",
            listEndpoint: Endpoints.LEAVE_TYPES,
            deleteEndpoint: Endpoints.LEAVE_TYPES,
            form: LeaveTypeEntryDialog,
            tabs: TabsWorkShift,
            searchBox: true,
            addAvailable: true,
            tableDetail: true,

            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'leave_types',
        },

        {
            pageLink: PageLinks.EMPLOYER_LEAVE_PLAN,
            title: "leave plans",
            titleSingular: "leave plan",
            listEndpoint: Endpoints.LEAVE_PLAN,
            deleteEndpoint: Endpoints.LEAVE_PLAN,
            form: LeavePlanEntryDialog,
            tabs: TabsWorkShift,
            searchBox: true,
            addAvailable: true,
            tableDetail: true,

            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'leave_plans',
        },

        {
            pageLink: PageLinks.EMPLOYER_MASTERS_LOAN_TYPE,
            title: "loan types",
            titleSingular: "loan type",
            listEndpoint: Endpoints.EMPLOYER_MASTERS_LOAN_TYPE_LIST,
            form: LoanTypeEntryDialog,
            searchBox: false,
            addAvailable: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            tableDetail: true,
            listResponseParam: 'list',
        },

        {
            pageLink: PageLinks.EMPLOYER_REST_DAY_GROUPS,
            title: "rest day groups ",
            titleSingular: "rest day group ",
            listEndpoint: Endpoints.REST_DAY_GROUPS,
            deleteEndpoint: Endpoints.REST_DAY_GROUPS,
            form: RestDayGroupsEntryDialog,
            tabs: TabsWorkShift,
            searchBox: true,
            addAvailable: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'rest_day_groups',
            tableDetail: true,
        },

        {
            pageLink: PageLinks.EMPLOYER_ATTENDANCE_POLICIES,
            title: "attendance policies ",
            titleSingular: "attendance policy ",
            listEndpoint: Endpoints.ATTENDANCE_POLICY,
            deleteEndpoint: Endpoints.ATTENDANCE_POLICY,
            form: AttendancePolicyEntryDialog,
            // tabs: TabsAttendancePolicies,
            searchBox: true,
            addAvailable: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'attendance_policies',
            tableDetail: true,
        },

        {
            pageLink: PageLinks.EMPLOYER_SALARY_COMPONENTS,
            title: " salary components ",
            titleSingular: "salary components",
            listEndpoint: Endpoints.SALARY_COMPONENTS,
            deleteEndpoint: Endpoints.SALARY_COMPONENTS,
            form: SalaryComponentEntryDialog,
            tabs: TabsSalaryGroups,
            searchBox: true,
            addAvailable: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            tableDetail: true,
            listResponseParam: 'salary_components',
        },

        {
            pageLink: PageLinks.EMPLOYER_SALARY_GROUPS,
            title: " salary groups ",
            titleSingular: "salary group",
            listEndpoint: Endpoints.SALARY_GROUP,
            deleteEndpoint: Endpoints.SALARY_GROUP,
            form: SalaryGroupEntryDialog,
            tabs: TabsSalaryGroups,
            searchBox: true,
            addAvailable: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'salary_groups',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_PAYROLL_GROUP,
            title: "payroll group",
            titleSingular: "payroll group",
            listEndpoint: Endpoints.PAYROLL_GROUP,
            deleteEndpoint: Endpoints.PAYROLL_GROUP,
            form: PayrollGroupsEntryDialog,
            searchBox: true,
            addAvailable: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'payroll_groups',
            tableDetail: true,
        },

        {
            pageLink: PageLinks.EMPLOYER_ROLES,
            title: "users  ",
            titleSingular: "  roles",
            listEndpoint: Endpoints.EMPLOYER_MASTERS_ROLES_LIST,
            deleteEndpoint: Endpoints.EMPLOYER_MASTERS_ROLES_LIST,
            form: RoleEntryDialog,
            tabs: TabsMasterUsers,
            searchBox: true,
            addAvailable: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'list',
            tableDetail: true,
        },

        {
            pageLink: PageLinks.EMPLOYER_USERS,
            title: "users  ",
            titleSingular: "  users",
            listEndpoint: Endpoints.USER,
            deleteEndpoint: Endpoints.USER,
            form: UserEntryDialog,
            tabs: TabsMasterUsers,
            searchBox: true,
            addAvailable: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'users',
            tableDetail: true,
        },


        {
            pageLink: PageLinks.EMPLOYER_EMPLOYEES,
            title: "Employees",
            titleSingular: "Employees",
            listEndpoint: Endpoints.EMPLOYEES_LIST,
            deleteEndpoint: Endpoints.EMPLOYEES_LIST,
            form: EmployeeEntryDialog,
            // tabs: TabsEmployeesDetails,
            addAvailable: true,
            additionalListButtons: [
                // { type: "form-control", position: "before-add", icon:"/assets/svg/add-btn.svg", title: "Add Employee"  },
                { type: "form-control", iconEnd: "/assets/svg/upload-data.svg", title: "Upload Employee Data", linkedForm: UploadEmployeeEntryDialog },
                // { type: "custom", customComponent: ListButtonExportEmployees },
                { type: "custom", customComponent: ListButtonDownloadEmployeeTemplate },
            ],
            searchBox: true,
            detailViewIsForm: true,
            //listResponseParam: 'employee',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_SALARY_REVISION,
            title: "salary revision",
            titleSingular: "salary revision",
            listEndpoint: Endpoints.EMPLOYEES_SALARY_LIST,
            form: EmployeeStaticFormDialog,
            addAvailable: true,
            searchBox: true,

            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'list',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_LOAN,
            title: "Employee Loans",
            titleSingular: "Employee Loans",
            listEndpoint: Endpoints.EMPLOYER_EMPLOYEE_LOAN_LIST,
            form: EmployeeStaticFormDialog,
            tabs: TabsEmployeesLoanDetails,
            addAvailable: true,
            searchBox: true,

            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'list', tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_ADDITIONAL_ALLOWANCE,
            title: "Additional Allowances & Deductions",
            titleSingular: "Additional Data",
            listEndpoint: Endpoints.EMPLOYER_ADDITIONAL_ALLOWANCE_LIST,
            form: EmployeeStaticFormDialog,
            addAvailable: true,
            searchBox: true,
            tableDetail: true,

            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'list',
        },

        {
            pageLink: PageLinks.EMPLOYER_ATTENDANCE,
            title: "Attendance",
            // uploadEmployeeDataBtn: "Upload Attendance",
            listEndpoint: Endpoints.ATTENDANCE_LIST,
            deleteEndpoint: Endpoints.ATTENDANCE_LIST,
            addAvailable: false,
            dateFilterRequired: true,
            deleteMultipleEntry: true,
            dateFilterType: 1,
            additionalListButtons: [
                // { type: "custom", customComponent: ListButtonExportEmployees },
                // { type: "form-control", position: "before-add", icon:"/assets/svg/add-btn.svg", title: "Add Employee"  },
                { type: "form-control", iconEnd: "/assets/svg/upload-data.svg", title: "Upload Attendance Data", linkedForm: UploadAttendanceEntryDialog },
                { type: "custom", customComponent: ListButtonDownloadEmployeeTemplate },
            ],
            exportAvailable: true,
            searchBox: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'employee_attendances',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_PROJECTS,
            title: "Projects",
            titleSingular: "Project",
            // uploadEmployeeDataBtn: "Upload Attendance",
            listEndpoint: Endpoints.EMPLOYER_PROJECT_LIST,
            form: ProjectEntryDialog,
            deleteEndpoint: Endpoints.EMPLOYER_PROJECT_LIST,
            addAvailable: true,
            dateFilterRequired: false,
            deleteMultipleEntry: false,
            // dateFilterType: 1,
            // additionalListButtons: [
                // { type: "custom", customComponent: ListButtonExportEmployees },
                // { type: "form-control", position: "before-add", icon:"/assets/svg/add-btn.svg", title: "Add Employee"  },
                // { type: "form-control", iconEnd: "/assets/svg/upload-data.svg", title: "Upload Attendance Data", linkedForm: UploadAttendanceEntryDialog },
                // { type: "custom", customComponent: ListButtonDownloadEmployeeTemplate },
            // ],
            exportAvailable: true,
            searchBox: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'employee_attendances',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_LEAVE_REQUEST,
            title: "Leave Request",
            titleSingular: "Leave Request",
            listEndpoint: Endpoints.LEAVE_REQUEST,
            listAddlParams: [
                {
                    param_name: "history",
                    param_value: true
                }
            ],
            additionalFilterSelect: true,
            addAvailable: true,
            exportAvailable: true,
            searchBox: true,
            form: LeaveRequestEntryDialog,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            dateFilterRequired: true,
            dateFilterType: 1,
            listResponseParam: 'data',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYEE_LEAVE_REQUEST,
            title: "Leave Request",
            titleSingular: "Leave Request",
            listEndpoint: Endpoints.EMPLOYEE_LEAVE_REQUEST,
            listAddlParams: [
                {
                    param_name: "history",
                    param_value: true
                }
            ],
            additionalFilterSelect: true,
            addAvailable: true,
            exportAvailable: true,
            searchBox: true,
            form: EmployeeLeaveRequestEntryDialog,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            dateFilterRequired: true,
            dateFilterType: 1,
            listResponseParam: 'data',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYEE_PENDING_LEAVE_REQUEST,
            title: "Pending Leave Request",
            titleSingular: "Pending Leave Request",
            listEndpoint: Endpoints.EMPLOYEE_PENDING_LEAVE_REQUEST,
            listAddlParams: [
                {
                    param_name: "history",
                    param_value: true
                }
            ],
            additionalFilterSelect: true,
            addAvailable: false,
            exportAvailable: true,
            searchBox: true,
            // form: EmployeeLeaveRequestEntryDialog,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            dateFilterRequired: true,
            dateFilterType: 1,
            listResponseParam: 'data',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYEE_REPORT,
            title: "Report",
            titleSingular: "Report",
            listEndpoint: Endpoints.EMPLOYEE_REPORT,
            listAddlParams: [
                {
                    param_name: "history",
                    param_value: true
                }
            ],
            additionalFilterSelect: true,
            addAvailable: true,
            exportAvailable: true,
            searchBox: true,
            form: EmployeeReportEntryDialog,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            dateFilterRequired: true,
            dateFilterType: 1,
            listResponseParam: 'data',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.ALLOCATED_EMPLOYEE_REPORT,
            title: "Employee Reports",
            titleSingular: "Report",
            listEndpoint: Endpoints.ALLOCATED_EMPLOYEE_REPORT,
            listAddlParams: [
                {
                    param_name: "history",
                    param_value: true
                }
            ],
            additionalFilterSelect: true,
            addAvailable: false,
            exportAvailable: true,
            searchBox: true,
            form: EmployeeReportEntryDialog,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            dateFilterRequired: true,
            dateFilterType: 1,
            listResponseParam: 'data',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_LEAVE_BALANCE,
            title: "Leave Balance",
            listEndpoint: Endpoints.LEAVE_BALANCE,
            additionalFilterSelect: true,
            addAvailable: false,
            exportAvailable: true,
            searchBox: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'data',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYEE_LEAVE_BALANCE,
            title: "Leave Balance",
            listEndpoint: Endpoints.LEAVE_BALANCE,
            additionalFilterSelect: true,
            addAvailable: false,
            exportAvailable: true,
            searchBox: false,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'data',
            tableDetail: true,
            hidePagination: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_LEAVE_HISTORY,
            title: "Leave History",
            listEndpoint: Endpoints.LEAVE_BALANCE,
            additionalFilterSelect: true,

            exportAvailable: true,
            searchBox: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'data',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_LEAVE_CREDITS,
            title: "Leave Credits",
            titleSingular: "Credit",
            additionalFilterSelect: true,
            listEndpoint: Endpoints.LEAVE_CREDITS,
            deleteEndpoint: Endpoints.LEAVE_CREDITS,
            form: LeaveCreditEntryDialog,
            addAvailable: true,
            exportAvailable: true,
            searchBox: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'data',
            tableDetail: true,
        },
        // {
        //     pageLink: PageLinks.EMPLOYER_PAYROLL_PROCESS,
        //     title: "Payroll pay Run",
        //     listEndpoint: Endpoints.PAYROLL,
        //     form: LeaveCreditEntryDialog,
        //     additionalFilter: AdditionalFilterPayroll,
        //     additionalFilterTitle: "Payroll Groups",
        //     componentSubText: "Process Pay Run For January 2024",
        //     dateFilterType: 2,
        //     // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
        //     detailViewIsForm: true,
        //     listResponseParam: 'payrolls',
        //     tableDetail: true,
        // },


        // {
        //     pageLink: PageLinks.EMPLOYER_PROCESS_PAY_RUN,
        //     title: "Payroll pay Run",
        //     listEndpoint: Endpoints.PAYROLL,
        //     addAvailable: false,
        //     searchBox: false,
        //     // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
        //     listResponseParam: 'payrolls',
        //     approveAndNext: true,
        //     tableDetail: false,
        // },
        {
            pageLink: PageLinks.EMPLOYER_PERSONAL_VIEW_DETAILS,
            title: "View Details",
            listEndpoint: Endpoints.EMPLOYEES_LIST,
            form: EmployeeEntryDialog,
            searchBox: false,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: false,
            listResponseParam: 'employees',
            tableDetail: false,
        },
        // {
        //     pageLink: PageLinks.PAYROLL_VIEW_DETAILS,
        //     title: "View Details",
        //     listEndpoint: Endpoints.PAYROLL,
        //     searchBox: false,
        //     // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
        //     detailViewIsForm: false,
        //     listResponseParam: 'payrolls',
        //     tableDetail: false,
        // },
        {
            pageLink: PageLinks.EMPLOYER_EMPLOYEE_PAYROLL,
            title: "Employee payroll",
            listEndpoint: Endpoints.EMPLOYEE_PAYROLL,
            searchBox: true,
            dateFilterType: 1,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'employee_payrolls',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_PAYROLL_REPORTS,
            title: "Payroll Reports",
            titleSingular: "Credit",
            listEndpoint: Endpoints.LEAVE_CREDITS,
            deleteEndpoint: Endpoints.LEAVE_CREDITS,
            form: LeaveCreditEntryDialog,
            addAvailable: true,
            exportAvailable: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'data',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYER_PAYROLL_HISTORY,
            title: "Payroll History",
            titleSingular: "Credit",
            listEndpoint: Endpoints.LEAVE_CREDITS,
            deleteEndpoint: Endpoints.LEAVE_CREDITS,
            form: LeaveCreditEntryDialog,
            addAvailable: true,
            exportAvailable: true,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'data',
            tableDetail: true,
        },

        {
            pageLink: PageLinks.ADMIN_COUNTRIES,
            title: "Countries",
            titleSingular: "Country",
            listEndpoint: Endpoints.COUNTRY_LIST,
            deleteEndpoint: Endpoints.COUNTRY_LIST,
            form: CountriesEntryDialog,
            addAvailable: true,
            searchBox: true,
            tableDetail: true,

            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            // dateFilterType: DateFilterType.MonthPicker,
            // dateFilterRequired: true,
            listResponseParam: 'countries',
        },
        {
            pageLink: PageLinks.ADMIN_STATES,
            title: "States",
            titleSingular: "State",
            listEndpoint: Endpoints.STATE_LIST,
            deleteEndpoint: Endpoints.STATE_LIST,
            form: StateEntryDialog,
            addAvailable: true,
            searchBox: true,

            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'states',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.ADMIN_BANKS,
            title: "Banks",
            titleSingular: "Bank",
            listEndpoint: Endpoints.BANK_LIST,
            deleteEndpoint: Endpoints.BANK_LIST,
            form: BankEntryDialog,
            addAvailable: true,
            searchBox: true,
            tableDetail: true,

            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'banks_details',
        },
        {
            pageLink: PageLinks.ADMIN_CLIENTS,
            title: "Clients",
            titleSingular: "Client",
            listEndpoint: Endpoints.CLIENT_LIST,
            deleteEndpoint: Endpoints.CLIENT_LIST,
            form: ClientEntryDialog,
            addAvailable: true,
            searchBox: true,
            tableDetail: true,

            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'clients',
        },
        {
            pageLink: PageLinks.ADMIN_USERS,
            title: "Users",
            titleSingular: "User",
            listEndpoint: Endpoints.USER,
            deleteEndpoint: Endpoints.USER,
            form: UserEntryDialog,
            addAvailable: true,
            searchBox: true,
            tableDetail: true,
            detailViewIsForm: true,
            listResponseParam: 'users',
        },
        {
            pageLink: PageLinks.ADMIN_COMPANY,
            title: "Companies",
            titleSingular: "Company",
            listEndpoint: Endpoints.COMPANY_LIST,
            deleteEndpoint: Endpoints.COMPANY_LIST,
            form: CompanyEntryDialog,
            addAvailable: true,
            searchBox: true,
            tableDetail: true,

            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            listResponseParam: 'companies',
        },
    ]
    export const getPageDetail = (pageLink: string): PageDetail | undefined => {
        const pageDetail = pageList.find((page) => {
            return page.pageLink === pageLink;
        });

        return pageDetail;
    };
}

