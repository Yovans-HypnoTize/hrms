export namespace FormDataTypes {
  export interface SelectOption {
    value: string;
    label: string;
  }
  export interface SelectOption1 {
    value: number | string;
    label: string;
  }
  export interface RadioOption {
    value: boolean;
    label: string;
  }

  export interface FormProps {
    page: string;
    setFormData: any;
    submitData: any;
    operation: "add" | "edit" | "view" | "vehicleAdd" | "vehicleEdit" | "";
  }

  export interface ComboItem {
    id: string;
    display_text: string;
  }
}

export namespace UIDataTypes {
  export interface MenuItem {
    label: string;
    iconClass: string;
    icon: React.ReactNode;
    menuLink?: string;
    subMenus?: MenuItem[];
    restrictUserTypes?: string[];
  }

  export interface StepsIndicatorStep {
    stepNo: number;
    stepName: string;
  }

  export interface TabItem {
    tabLabel: string;
    tabLink: string;
  }
}

export namespace APIData {
  export interface EmployeeDashboard {
    data: {
      dashboard: {
        in_time: string;
        out_time: string;
        total_duration: string;
        punched_state: number;
      };
      insights: {
        credit_earned: number;
        debit_deducted: number;
        pie_chart: {
          legal_holiday: number;
          rest_day: number;
          special_holiday: number;
          work_day: number;
        };
        total_approved: number;
        total_pending: number;
        total_rejected: number;
        total_request: number;
      };
    };
  }

  export interface SubordinateLeaveRequest {
    employee_id: number;
    employee_leave_req_current_status_id: number;
    employee_leave_req_date: string;
    employee_leave_req_day_approval_status: number;
    employee_leave_req_day_type: number;
    employee_leave_req_id: number;
    employee_leave_req_period_from: string;
    employee_leave_req_period_to: string;
    employee_leave_req_reason: string;
    employee_leave_req_status: number;
    employee_leave_req_status_datetime: string;
    employee_leave_req_status_remarks: string;
    employee_name: string;
    leave_type_id: number;
    leave_type_name: string;
    employee_mobile: string;
    employee_photo: string;
    employee_leave_req_no_of_days: string;
  }
  export interface EmployeeLeaveRequest {
    leave_start_date: string;
    leave_end_date: string;
    leave_reason: string;
    leave_days: string;
    leave_session: string;
  }

  export interface LeaveRequest {
    leave_type_id: number;
    employee_leave_req_period_from: string;
    employee_leave_req_period_to: string;
    employee_leave_req_start_day_leave_session: number;
    employee_leave_req_end_day_leave_session: number;
    employee_leave_req_reason: string;
    employee_leave_update_login_id: number;
    employee_leave_req_days: number;
  }

  export interface employeeDailyReport {
    report_date: string;
    project_title: string;
    report_summary: string;
    task_id: string;
    status: string;
  }

  export interface EmployeeDetails {
    employee_code: string;
    employee_first_name: string;
    employee_middle_name: string;
    employee_last_name: string;
    employee_mobile: string;
    employee_email: string;
    employee_login_available: number;
    employee_login_password: string;
    employee_photo: string;
    employee_photo_filename: string;
    employee_gender: number;
    employee_dob: string;
    employee_address_line1: string;
    employee_address_line2: string;
    employee_address_city: string;
    employee_address_postal_code: string;
    employee_marital_status: number;
    employee_blood_group: string;
    employee_father_name: string;
    employee_mother_name: string;
    employee_spouse_name: string;
    employee_emergency_contact_name: string;
    employee_emergency_contact_number: string;
    employee_doj: string;
    employee_probation_period: number;
    employee_date_of_confirmation: string;
    employee_tax_identification_number: string;
    employee_is_contract: number;
    employee_address_country_id: number | null;
    employee_address_state_id: number | null;
    employee_contract_partner_id: number | null;
    employee_working_for_client: number;
    employee_client_partner_id: number | null;
    employee_salary_payment_mode: number;
    bank_id: number | null;
    employee_bank_identification_number: string;
    employee_bank_account_bank_branch: string;
    employee_bank_account_number: string;
    employee_bank_account_name: string;
    employee_salary_source_company_bank_acc_id: number | null;
    employee_current_status_id: number;
    employee_current_location_id: number;
    employee_current_designation_id: number;
    employee_current_department_id: number;
    employee_current_superior_id: number | null;
    employee_current_salary_id: number;
    employee_salary_basic_pay: number;
    employee_salary_ctc: number;
    employee_current_payroll_group_id: number;
    employee_current_attendance_policy_id: number;
    employee_current_leave_plan_id: number;
    employee_in_notice_period: number;
    employee_expected_date_of_leaving: string;
    employee_date_of_reliving: string;
    company_id: number;
    employee_philip_sss_number: string;
    employee_philip_pag_Ibig_number: string;
    employee_philip_philhealth_number: string;
    employee_month_salary_days: number;
  }

  export interface Company {
    // company_id: number;
    company_code: string;
    company_name: string;
    company_address_line1: string;
    company_address_line2: string;
    company_address_city: string;
    company_address_postal_code: string;
    state_id: number;
    country_id: number;
    company_logo: string;
    mobile_app_attendance_allowed: number;
    company_currency_id: number;
    company_hr_email: string;
    company_default_probation_days: number;
    company_salary_definition_type: number;
    client_id: number;
  }

  export interface EmployeeBankDetail {
    bank_add_time: string;
    bank_id: number;
    bank_name: string;
    bank_update_time: null;
  }

  export interface Partner {
    partner_name: string;
    partner_address_line1: string;
    partner_address_line2: string;
    partner_address_city: string;
    partner_address_postal_code: string;
    state_id: number;
    country_id: number;
    client_id: number;
  }

  export interface Clients {
    client_id: number;
    client_name: string;
  }

  export interface EmployeeStatusDetail {
    employee_status: number;
    employee_status_id: number;
    employee_status_left_type: number;
    employee_status_time: string;
    employee_status_update_login_id: number | null;
    employee_id: number;
    employee_date_of_reliving: string;
    employee_date_of_confirmation: string;
  }

  export interface EmployeeDepartmentDetail {
    department_id: number;
    department_name: string;
    employee_department_effective_from: string;
    employee_department_id: number;
    employee_department_update_login_id: number | null;
    employee_id: number;
  }

  export interface EmployeeDesignationDetail {
    designation_id: number;
    designation_name: string;
    employee_designation_effective_from: string;
    employee_designation_id: number;
    employee_designation_update_login_id: number | null;
    employee_id: number;
  }

  export interface EmployeeSalaryDetail {
    employee_salary_basic_pay: number;
    employee_salary_ctc: number;
    employee_salary_effective_from: string;
    employee_salary_employer_notes: string | null;
    employee_salary_id: number;
    employee_salary_remarks: string | null;
    employee_salary_update_login_id: number | null;
    salary_group_id: number;
    salary_group_name: string;
    employee_id: number;
  }

  export interface CompanyLocation {
    company_location_name: string;
    company_location_address_line1: string;
    company_location_address_line2: string;
    company_location_address_city: string;
    company_location_address_postal_code: string;
    state_id: number;
    country_id: number;
    country_name: string;
    company_id: number;
  }

  export interface EmployeeSuperiorEmployeeDetail {
    employee_id: number;
    superior_employee_id: number;
    employee_superior_code: string;
    employee_superior_first_name: string;
    employee_superior_last_name: string;
    employee_superior_effective_from: string;
    employee_superior_update_login_id: number;
    employee_superior_id: number;
  }

  export interface Certifications {
    file: string;
  }

  export interface EmployeeEditAttendance {
    employee_attendance_date: string;
    employee_attendance_first_in_time: string;
    employee_attendance_last_out_time: string;
    employee_shift_in_time: string;
    employee_shift_out_time: string;
    attendance_type: string;
    employee_attendance_regular_duration: string;
    employee_attendance_ot_duration: string;
    employee_attendance_nd_duration: string;
    employee_attendance_nd_ot_duration: string;
    lop_duration: string;
    approval_status?: string;
  }

  export interface Report {
    startTime: null | string;
    endTime: null | string;
    taskDescription: string;
    taskStatus: string;
    taskCategory: string;
    taskPriority: string;
  }
}
