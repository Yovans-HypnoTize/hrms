import ListButtonExportEmployees from "../components/list-custom-btns/ListButtonExportEmployees";
import LeaveRequestEntryDialog from "../forms/LeaveRequestEntryDialog";
import ReportEntryDialog from "../forms/ReportEntryDialog";
import { DateFilterType, Endpoints, PageLinks } from "./Constants";
import { FormDataTypes, UIDataTypes } from "./DataTypes";


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
        uploadEmployeeDataBtn?: string;
        addEmployeeBtn?: string;
        addEmployeeForm?: any;
        searchBox?: boolean;
        selectDate?: boolean;
        listEndpoint: string;
        personalDetailsForm?: any;
        listAddlParams?: {
            param_name: string;
            param_value: string | number;
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
        statusFilter?: boolean;
        detailViewIsForm?: boolean;
        addAvailable?: boolean;
        exportAvailable?: boolean;
        additionalListButtons?: ListButtons[];
        dateFilterType?: number;
        dateFilterRequired?: boolean;
        noPagination?: boolean;
        approveAndNext?: boolean;
        tableDetail: boolean;
        attendanceEdit?: boolean;
        approveSubordinates?: boolean
    }

    const pageList: PageDetail[] = [
        {
            pageLink: PageLinks.SUBORDINATE_LEAVE_BALANCE_LIST,
            title: "Subordinate Leave Balance",
            listEndpoint: Endpoints.SUBORDINATE_LEAVE_BALANCE,
            tableDetail: true,
            searchBox: true,
            additionalFilterSelect: true,
        },
        {
            pageLink: PageLinks.LEAVE_BALANCE,
            title: "Leave Balance List",
            listEndpoint: Endpoints.EMPLOYEE_LEAVE_BALANCE,
            tableDetail: true,
            searchBox:false,
            // additionalFilterSelect: true,
            listResponseParam: 'data',
        },
        {
            pageLink: PageLinks.LEAVE_REQUEST,
            title: "Leave Request List",
            listEndpoint: Endpoints.EMPLOYEE_LEAVE_REQUEST,
            tableDetail: true,
            searchBox:true,
            addAvailable:true,
            form: LeaveRequestEntryDialog,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            // dateFilterRequired: true,
            dateFilterType: 1,
            // additionalFilterSelect: true,
            listResponseParam: 'data',
        },
        {
            pageLink: PageLinks.EMPLOYEE_REPORT,
            title: "Report",
            titleSingular: "",
            listEndpoint: Endpoints.EMPLOYEE_REPORT,
            // listAddlParams: [
            //     {
            //         param_name: "history",
            //         param_value: true
            //     }
            // ],
            additionalFilterSelect: false,
            addAvailable: true,
            searchBox: true,
            form: ReportEntryDialog,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            // dateFilterRequired: true,
            dateFilterType: 1,
            listResponseParam: 'data',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYEE_PENDING_LEAVE_REQUEST,
            title: "Pending Leave Request",
            titleSingular: "",
            listEndpoint: Endpoints.EMPLOYEE_PENDING_LEAVE_REQUEST,
            // listAddlParams: [
            //     {
            //         param_name: "history",
            //         param_value: true
            //     }
            // ],
            additionalFilterSelect: false,
            addAvailable: true,
            searchBox: true,
            form: ReportEntryDialog,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            // dateFilterRequired: true,
            dateFilterType: 1,
            listResponseParam: 'data',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.ALLOCATED_EMPLOYEE_REPORT,
            title: "Employee Reports",
            titleSingular: "Report",
            listEndpoint: Endpoints.ALLOCATED_EMPLOYEE_REPORT,
            listAddlParams: [],
            // additionalFilterSelect: true,
            addAvailable: false,
            exportAvailable: true,
            searchBox: true,
            form: ReportEntryDialog,
            // statusUpdate: { endpoint: Endpoints.UserStatusUpdate, paramName: 'uuid' },
            detailViewIsForm: true,
            // dateFilterRequired: true,
            dateFilterType: 1,
            listResponseParam: 'data',
            tableDetail: true,
        },
        {
            pageLink: PageLinks.LEAVE_HISTORY,
            title: "Leave History",
            listEndpoint: Endpoints.EMPLOYEE_LEAVE_REQUEST,
            tableDetail: true,
        },
        {
            pageLink: PageLinks.SUBORDINATE_LEAVE_HISTORY_LIST,
            title: "Leave History",
            listEndpoint: Endpoints.SUBORDINATE_LEAVE_REQUEST,
            tableDetail: true,
            searchBox: true,
            additionalFilterSelect: true,
            statusFilter: true
        },
        {
            pageLink: PageLinks.EMPLOYEE_CONFIRMED_ATTENDANCE,
            title: "Confirmed Attendance",
            listEndpoint: Endpoints.EMPLOYEE_CONFIRMED_ATTENDANCE,
            tableDetail: true,
        },
        {
            pageLink: PageLinks.EMPLOYEE_PENDING_ATTENDANCE,
            title: "Pending Attendance",
            listEndpoint: Endpoints.EMPLOYEE_PENDING_ATTENDANCE,
            deleteEndpoint: Endpoints.EMPLOYEE_PENDING_ATTENDANCE,
            attendanceEdit: true,
            tableDetail: true,
            statusFilter: true,
            searchBox: true
        },
        {
            pageLink: PageLinks.SUBORDINATE_PENDING_ATTENDANCE,
            title: "Pending Attendance",
            listEndpoint: Endpoints.SUBORDINATE_PENDING_ATTENDANCE,
            tableDetail: true,
            searchBox: true,
            approveSubordinates: true,
        },
        {
            pageLink: PageLinks.PAYSLIP,
            title: "Payslip",
            listEndpoint: Endpoints.EMPLOYEE_PAYSLIP,
            tableDetail: true,
        },
        {
            pageLink: PageLinks.CERTIFICATION_LETTER,
            title: "Certification & Letters",
            titleSingular: "Certification",
            addAvailable: true,
            listEndpoint: Endpoints.EMPLOYEE_DOCUMENT,
            tableDetail: true,
        },
    ]

    export const getPageDetail = (pageLink: string): PageDetail | undefined => {
        const pageDetail = pageList.find((page) => {
            return page.pageLink === pageLink;
        });

        return pageDetail;
    };
}