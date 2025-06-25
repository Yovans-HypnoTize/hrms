import { string } from "yup";
import { APIData } from "../common/DataTypes";

export namespace InitialData {

    export const LeaveRequest: APIData.LeaveRequest = {
        leave_type_id: 0,
        employee_leave_req_days: 1,
        employee_leave_req_period_from: "",
        employee_leave_req_period_to: "",
        employee_leave_req_start_day_leave_session: 0,
        employee_leave_req_end_day_leave_session: 0,
        employee_leave_req_reason: "",
        employee_leave_update_login_id: 0,
    }
    export const Certifications: APIData.Certifications = {
        file: ""
    }
    export const ReportData: APIData.Report = {
        startTime:'',
        endTime:'',
        taskDescription: '',
        taskStatus:'',
        taskCategory:'',
        taskPriority:''
    }

    export const employeeDailyReport: APIData.employeeDailyReport = {
        report_date : "",
        project_title : "",
        report_summary :"",
        task_id:'',
        status:''
      };

    export const EmployeeLeaveRequest: APIData.EmployeeLeaveRequest = {
        leave_start_date: "",
        leave_end_date: "",
        leave_reason: "",
        leave_days: "",
        leave_session: "",
      };

}
