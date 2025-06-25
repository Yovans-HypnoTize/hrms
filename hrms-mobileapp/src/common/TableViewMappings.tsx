import ListButtonViewDetails from "../components/list-custom-btns/ListButtonViewDetails";
import CellBiMonthDate from "../components/table_data/CellBiMonthDate";
import CellDownload from "../components/table_data/CellDownload";
import CellLeaveStatus from "../components/table_data/CellLeaveReqStatus";
import CellNAForZero from "../components/table_data/CellNAForZero";
import { PageLinks } from "./Constants";

export namespace TableViewMappings {
    export interface MappingDetail {
        ID: number,
        mappingName: string,
    }

    export interface TableColumn {
        label: string;
        data_key: string;
        type: "text" | "number" | "status" | "image" | "date" | "datetime" | "time" | "custom";
        customKeys?: string[];
        mappingList?: MappingDetail[];
        component?: any;
    }

    export interface TableActions {
        type: "edit" | "delete" | "view" | "copy" | "custom" | "singleButton" | "doubleButton" | "approveOrReject"
        icon?: string;
        tooltip?: string;
        link?: string;
        params?: { param_key: string, data_key: string }[];
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
        { ID: 1, mappingName: 'Yes', },
        { ID: 0, mappingName: 'No', },
    ]

    const MappingListStatuses: MappingDetail[] = [
        { ID: 1, mappingName: 'Active', },
        { ID: 0, mappingName: 'InActive', },
    ]

    const MappingListPayrollInterval: MappingDetail[] = [
        { ID: 1, mappingName: 'Monthly', },
        { ID: 2, mappingName: 'Bi-Monthly', },
    ]

    const MappingListAttendance: MappingDetail[] = [
        { ID: 1, mappingName: 'Fullday Present' },
        { ID: 2, mappingName: ' Halfday Present' },
        { ID: 11, mappingName: 'Rest Day' },
        { ID: 12, mappingName: 'Holiday' },
        { ID: 13, mappingName: 'Leave' },
        { ID: 14, mappingName: 'Compensation Off' },
        { ID: 21, mappingName: 'Absent' }
    ]

    const tableList: TableDetail[] = [
        {
            pageLink: PageLinks.SUBORDINATE_LEAVE_BALANCE_LIST,
            columns: [
                { label: "Employee Name", data_key: "employee_name", type: "text" },
                { label: "Leave Type", data_key: "leave_type_name", type: "text" },
                { label: "Current Balance", data_key: "current_balance", type: "text" },
            ],
            actions: [
                // { type: "view" },
                // { type: "edit" },
                // { type: "delete", params: [{ param_key: "country_id", data_key: "country_id" }] }
            ],
            primary_column: "employee_leave_credit_id",
        },
        {
            pageLink: PageLinks.CERTIFICATION_LETTER,
            columns: [
                { label: "Certificate Name", data_key: "opening_balance", type: "text" },
                { label: "Certificate Date", data_key: "credits", type: "text" },
                { label: "Download", data_key: "payslip_url", type: "custom", component: CellDownload },
            ],
            actions: [
                // { type: "view" },
                { type: "edit" },
                { type: "delete", params: [{ param_key: "employee_document_id", data_key: "employee_document_id" }] }
            ],
            primary_column: "employee_document_id",
        },
        {
            pageLink: PageLinks.LEAVE_BALANCE,
            columns: [
                { label: "Employee ID", data_key: "employee.employee_code", type: "text" },
                { label: "Employee Name", data_key: "employee.employee_first_name", type: "text" },
                { label: "Current Balance", data_key: "company_leave_credit", type: "text" },
            ],
            actions: [

            ],
            primary_column: "leave_credit_id",
        },
        {
            pageLink: PageLinks.LEAVE_REQUEST,
            columns: [
                { label: "Employee ID", data_key: "employee.employee_code", type: "text" },
                { label: "Employee", data_key: "employee.employee_first_name", type: "text" },
                { label: "Leave Request From", data_key: "leave_start_date", type: "text" },
                { label: "Leave Request Upto", data_key: "leave_end_date", type: "text" },
                { label: "Reason", data_key: "leave_reason", type: "text" },
                { label: "Status", data_key: "leave_status", type: "text" },
            ],
            actions: [
               { type:"edit"}
            ],
            primary_column: "leave_request_id",
        },
        {
            pageLink: PageLinks.LEAVE_HISTORY,
            columns: [
                { label: "Leave Requested From", data_key: "employee_leave_req_period_from", type: "date" },
                { label: "Leave Requested To", data_key: "employee_leave_req_period_to", type: "date" },
                // { label: "No of Days", data_key: "debits_entries", type: "text" },
                { label: "Leave Type", data_key: "leave_type_name", type: "text" },
                { label: "Status", data_key: "employee_leave_req_day_approval_status", type: "custom", component: CellLeaveStatus },
            ],
            actions: [

            ],
            primary_column: "employee_leave_req_id",
        },
        {
            pageLink: PageLinks.EMPLOYEE_REPORT,
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
            ],
            actions: [
{type:"edit"}
            ],
            primary_column: "employee_report_id",
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
        {
            pageLink: PageLinks.SUBORDINATE_LEAVE_HISTORY_LIST,
            columns: [
                { label: "Leave Requested From", data_key: "employee_leave_req_period_from", type: "date" },
                { label: "Leave Requested To", data_key: "employee_leave_req_period_to", type: "date" },
                { label: "Leave Type", data_key: "leave_type_name", type: "text" },
                { label: "Status", data_key: "employee_leave_req_day_approval_status", type: "custom", component: CellLeaveStatus },
            ],
            actions: [

            ],
            primary_column: "employee_leave_req_id",
        },
        {
            pageLink: PageLinks.PAYSLIP,
            columns: [
                { label: "Payroll Interval", data_key: "payroll_interval", type: "text", mappingList: MappingListPayrollInterval },
                { label: "Payroll Period", data_key: "payroll_period", type: "custom", component: CellBiMonthDate },
                { label: "Download", data_key: "payslip_url", type: "custom", component: CellDownload },
            ],
            actions: [

            ],
            primary_column: "employee_leave_req_id",
        },
        {
            pageLink: PageLinks.EMPLOYEE_CONFIRMED_ATTENDANCE,
            columns: [
                { label: "Date", data_key: "employee_attendance_date", type: "date" },
                { label: "Attendance Type", data_key: "employee_attendance_type", type: "text", mappingList: MappingListAttendance },
                { label: "In Time", data_key: "employee_attendance_first_in_time", type: "custom", component: CellNAForZero },
                { label: "Out Time", data_key: "employee_attendance_last_out_time", type: "custom", component: CellNAForZero },
                { label: "Regular Duration", data_key: "employee_attendance_regular_duration", type: "text" },
                { label: "Regular OT Duration", data_key: "employee_attendance_ot_duration", type: "text" },
                { label: "Night Differential Duration", data_key: "employee_attendance_nd_duration", type: "text" },
                { label: "Night Differential OT Duration", data_key: "employee_attendance_nd_ot_duration", type: "text" },
            ],
            actions: [
                // { type: "delete", params: [{ param_key: "employee_attendance_id", data_key: "employee_attendance_id" }] }
            ],
            primary_column: "employee_attendance_id",
        },
        {
            pageLink: PageLinks.SUBORDINATE_PENDING_ATTENDANCE,
            columns: [
                { label: "Date", data_key: "employee_attendance_date", type: "date" },
                { label: "Attendance Type", data_key: "employee_attendance_type", type: "text", mappingList: MappingListAttendance },
                { label: "In Time", data_key: "employee_attendance_first_in_time", type: "custom", component: CellNAForZero },
                { label: "Out Time", data_key: "employee_attendance_last_out_time", type: "custom", component: CellNAForZero },
                { label: "Regular Duration", data_key: "employee_attendance_regular_duration", type: "text" },
                { label: "Regular OT Duration", data_key: "employee_attendance_ot_duration", type: "text" },
                { label: "Night Differential Duration", data_key: "employee_attendance_nd_duration", type: "text" },
                { label: "Night Differential OT Duration", data_key: "employee_attendance_nd_ot_duration", type: "text" },
            ],
            actions: [
            ],
            primary_column: "attendance_id",
        },
        {
            pageLink: PageLinks.EMPLOYEE_PENDING_ATTENDANCE,
            columns: [
                { label: "Date", data_key: "employee_attendance_date", type: "date" },
                { label: "Attendance Type", data_key: "employee_attendance_type", type: "text", mappingList: MappingListAttendance },
                { label: "In Time", data_key: "employee_attendance_first_in_time", type: "custom", component: CellNAForZero },
                { label: "Out Time", data_key: "employee_attendance_last_out_time", type: "custom", component: CellNAForZero },
                { label: "Regular Duration", data_key: "employee_attendance_regular_duration", type: "text" },
                { label: "Regular OT Duration", data_key: "employee_attendance_ot_duration", type: "text" },
                { label: "Night Differential Duration", data_key: "employee_attendance_nd_duration", type: "text" },
                { label: "Night Differential OT Duration", data_key: "employee_attendance_nd_ot_duration", type: "text" },
            ],
            actions: [
                { type: "delete", params: [{ param_key: "attendance_id", data_key: "attendance_id" }] }
            ],
            primary_column: "attendance_id",
        },
    ]

    export const getPageTableDetail = (pageLink: string): TableDetail => {
        const tableDetail = tableList.find(table => {
            return table.pageLink === pageLink;
        });
        return tableDetail ? tableDetail : { pageLink: '', columns: [], primary_column: '' };
    }
}