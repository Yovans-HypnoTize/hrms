// import { boolean, string } from "yup";
import { APIData } from "../common/DataTypes";
import { Gender } from "../common/Constants";

export namespace InitialData {
  export const ModelVariant: APIData.ModelVariant = {
    model_uuid: "",
    variant_name: "",
    variant_code: "",
    fuel_type_uuid: "",
    transmission_type_uuid: "",
    variant_status: 1,
  };

  export const Countries: APIData.Countries = {
    country_id: 0,
    country_name: "",
  };

  export const States: APIData.States = {
    state_id: 0,
    state_name: "",
    country_id: 0,
  };

  export const Clients: APIData.Clients = {
    client_id: 0,
    client_name: "",
    client_email: "",
    client_mobile: "",
  };

  export const Banks: APIData.Banks = {
    bank_name: "",
    country_ids: [],
  };

  export const Company: APIData.Company = {
    // company_id: 0,
    company_code: "",
    company_name: "",
    company_reg_address1: "",
    company_reg_address2: "",
    // company_address_city: "",
    company_reg_address_zip: "",
    city_id: 0,
    state_id: 0,
    country_id: 0,
    company_logo: "",
    company_mobile_attendance: 0,
    // company_currency_id: 0,
    company_mail: "",
    // company_default_probation_days: 0,
    // company_salary_definition_type: 0,
    user_id: 0,
  };

  export const CompanyLocation: APIData.CompanyLocation = {
    company_location_name: "",
    company_location_address_line1: "",
    company_location_address_line2: "",
    company_location_address_city: "",
    company_location_address_postal_code: "",
    state_id: 0,
    country_id: 0,
    country_name: "",
    company_id: 0,
  };

  export const Partner: APIData.Partner = {
    partner_name: "",
    partner_address_line1: "",
    partner_address_line2: "",
    partner_address_city: "",
    partner_address_postal_code: "",
    state_id: 0,
    country_id: 0,
    client_id: 0,
  };

  export const HolidayGroup: APIData.HolidayGroup = {
    // holiday_group_name: "",
    company_holiday_group_name: "",
    company_id: 0,
  };

  export const employeeDailyReport: APIData.employeeDailyReport = {
    report_date : "",
    project_title : "",
    report_summary :"",
    task_id:'',
    status:''
  };

  export const HolidayType: APIData.HolidayType = {
    company_id: 0,
    company_holiday_type_name: "",
    company_holiday_type_uid: "",
    company_holiday_type_status: "0",
    // holiday_type_name: "",
    // holiday_type_abbreviation: "",
    // holiday_type_is_restricted: 0,
    // company_id: 0,
  };
  export const Holiday: APIData.Holiday = {
    company_holiday_group_id: 0,
    company_holiday_type_id: 0,
    company_holiday_name: "",
    company_holiday_date: "",
    company_holiday_description: "",
    company_holiday_status: false,

    // holiday_date: "",
    // holiday_name: "",
    // holiday_description: "",
    // company_id: 0,
    // holiday_type_id: 0,
    // holiday_group_ids: [],
  };

  export const Department: APIData.Department = {
    company_id: 0,
    company_department_name: "",
    // company_department_uid: "",
    // company_department_status: "0",

    // department_id: 0,
    // department_name: "",
    // company_id: 0,
  };

  export const LeaveType: APIData.LeaveType = {
    leave_type_id: 0,
    leave_type_name: "",
    leave_type_abbreviation: "",
    leave_type_description: "",
    leave_type_gender_allowed: 0,
    leave_type_allowed_marital_status: 0,
    company_id: 0,
  };

  export const RestDayGroups: APIData.RestDayGroups = {
    company_weekoff_name: "",
    // rest_days: [],
    company_id: 0,
  };

  export const AttendancePolicy: APIData.AttendancePolicy = {
    company_id: 0,
    policy_name: "",
    company_workshift_id: 0,
    company_weekoff_id: 0,
    company_holiday_group_id: 0,

    // attendance_policy_name: "",
    // rest_day_group_id: 0,
    // work_shift_id: 0,
    // holiday_group_id: 0,
    // attendance_policy_restricted_holiday_count: 0,
    // company_id: 0,
  };
  export const SalaryComponent: APIData.SalaryComponent = {
    salary_component_type: 0,
    salary_component_name: "",
    salary_component_abbreviation: "",
    salary_component_description: "",
    salary_component_calc_type: 0,
    salary_component_calc_day_type: 0,
    salary_component_common_fixed_value: 0 || null,
    salary_component_calculation_formula: "",
    salary_component_tax_applicable: 0,
    salary_component_bi_month_applicable_cycle: null,
    salary_component_is_statistical: 0,
    company_id: 0,
    salary_component_status: 1,
  };
  export const SalaryGroup: APIData.SalaryGroup = {
    salary_group_id: 0,
    salary_group_name: "",
    company_id: 0,
    salary_group_status: 1,
  };

  export const PayrollGroup: APIData.PayrollGroup = {
    payroll_group_name: "",
    specific_days_per_month: 0,
    calculate_per_day_salary: "",
    payroll_interval: "",
    start_month: "",
    payroll_start_day_of_month: 0,
    company_id: 0,

    // payroll_group_id: 0,
    // payroll_group_name: "",
    // payroll_group_generation_interval: 0,
    // payroll_group_start_days_of_month: "",
    // payroll_group_start_month: 0,
    // payroll_group_start_day_of_week: 0,
    // company_id: 0,
    // payroll_group_status: 1,
    // payroll_group_calc_per_day_salary_by: 0,
    // payroll_group_calc_specific_days_per_month: 0,
  };

  export const User: APIData.User = {
    user_id: 0,
    user_name: "",
    user_email: "",
    user_mobile: "",
    user_status: true,
    user_password: "",
    role_id: 0,
  };

  export const WorkShift: APIData.WorkShift = {
    company_id: 0,
    company_workshift_name: "",
    // company_workshift_status: '0',
    company_workshift_start_time: "",
    company_workshift_end_time: "",
    company_workshift_start_grace_period: 0,
    company_workshift_end_grace_period: 0,
    company_workshift_grace_period_deduction: "",
    company_workshift_min_full_day_hours: "",
    company_workshift_min_half_day_hours: "",

    // work_shift_name: "",
    // work_shift_in_time: "",
    // work_shift_in_late_tolerance_mins: 0,
    // work_shift_out_time: "",
    // work_shift_out_early_tolerance_mins: 0,
    // work_shift_late_early_salary_deduction: 0,
    // work_shift_standard_working_hours: "08:00:00",
    // work_shift_min_full_day_working_hours: "08:00:00",
    // work_shift_min_half_day_working_hours: "04:00:00",
    // company_id: 0,
  };

  export const Designation: APIData.Designation = {
    // company_id: 0,
    // designation_name: "",
    // parent_designation_id: 0,

    company_department_id: 0,
    company_designation_name: "",
    // company_designation_uid: "",
    // company_designation_status: '0',
  };

  export const LeavePlanLeaveType: APIData.LeavePlanLeaveType = {
    leave_type_id: 0,
    leave_plan_leave_type_allocation_type: 0,
    leave_plan_leave_type_available_for_probation: false,
    leave_plan_leave_type_credit_in_notice_period: false,
    leave_plan_leave_type_can_avail_in_notice_period: false,
    leave_plan_leave_type_credit_period: 0,
    leave_plan_leave_type_credit_month: 0,
    leave_plan_leave_type_credit_day: 0,
    leave_plan_leave_type_credit_eligible_worked_days: 0,
    leave_plan_leave_type_credit_count: 0,
    leave_plan_leave_type_unclaimed_operation_month_end: 0,
    leave_plan_leave_type_unclaimed_operation_year_end: 0,
    leave_plan_leave_type_carry_over_percent_year_end: 0,
    leave_plan_leave_type_carry_over_percent_month_end: 0,
    leave_plan_leave_type_encashment_percent_year_end: 0,
    leave_plan_leave_type_encashment_percent_month_end: 0,
    leave_plan_leave_type_credit_doj_eligibility: 0,
    leave_plan_leave_type_credit_eligible_doj_month: 0,
    leave_plan_leave_type_credit_eligible_doj_day: 0,
  };

  export const LeavePlan: APIData.LeavePlan = {
    leave_plan_name: "",
    leave_plan_status: 1,
    company_id: 0,
    leave_plan_leave_types: [LeavePlanLeaveType],
  };

  export const PayrollGenerator: APIData.PayrollGenerator = {
    company_id: 0,
    payroll_month: "",
  };

  export const LeaveCredit: APIData.LeaveCredit = {
    employee_id: 0,
    company_id: 0,
    company_leave_credit: 0,
    remarks: "",

    // employee_leave_credit_id: 0,
    // leave_type_id: 0,
    // employee_leave_credit_count: 0,
    // employee_leave_credit_remarks: "",
    // employee_id: 0,
  };

  export const Project: APIData.Project = {
    company_id: 0,
    deadline:"",
    project_name: "",
    description: "",
    status: "",
    employees: []
  };

  export const Employee: APIData.Employee = {
    // employee_salary_component_values: [
    //   {
    //     salary_component_id: 0,
    //     employee_salary_component_value: "",
    //   },
    // ],
    employee_code: "",
    employee_first_name: "",
    employee_middle_name: "",
    employee_last_name: "",
    employee_mobile: "",
    employee_email: "",
    employee_login_available: 0,
    employee_login_password: "",
    employee_photo: "",
    // employee_photo_filename: "",
    employee_gender: 1,
    employee_dob: "",
    employee_address_line1: "",
    employee_address_line2: "",
    employee_address_city: "",
    employee_address_postal_code: "",
    employee_marital_status: 2,
    // employee_blood_group: "",
    employee_father_name: "",
    employee_mother_name: "",
    employee_spouse_name: "",
    employee_emergency_contact_name: "",
    employee_emergency_contact_number: "",
    employee_doj: "",
    // employee_probation_period: 0,
    employee_date_of_confirmation: "",
    // employee_tax_identification_number: "",
    employee_is_contract: 0,
    // employee_contract_partner_id: null,
    employee_working_for_client: 0,
    // employee_client_partner_id: null,
    employee_salary_payment_mode: "",
    bank_name: "",
    // employee_bank_identification_number: "",
    employee_bank_account_bank_branch: "",
    employee_bank_account_number: "",
    employee_address_country_id: null,
    employee_address_state_id: null,
    employee_bank_account_name: "",
    // employee_salary_source_company_bank_acc_id: null,
    employee_status: 0,
    // location_id: 0,
    designation_id: 0,
    department_id: 0,
    superior_employee_id: null,
    // salary_group_id: 0,
    employee_monthly_salary: 0,
    // employee_salary_basic_pay: 0,
    // employee_salary_ctc: 0,
    payroll_group_id: 0,
    attendance_policy_id: 0,
    // leave_plan_id: 0,
    employee_in_notice_period: 0,
    employee_expected_date_of_leaving: "",
    // employee_date_of_reliving: "",
    company_id: 0,
    // employee_philip_sss_number: "",
    // employee_philip_pag_Ibig_number: "",
    // employee_philip_philhealth_number: "",
    // employee_month_salary_days: 0,
    // state_id: 0,
    is_superior_employee: 0,
    ot_available: 0,
  };
  export const EmployeeDetails: APIData.EmployeeDetails = {
    employee_code: "",
    employee_first_name: "",
    employee_middle_name: "",
    employee_last_name: "",
    employee_mobile: "",
    employee_email: "",
    employee_login_available: 0,
    employee_login_password: "",
    employee_photo: "",
    employee_photo_filename: "",
    employee_gender: Gender.Male,
    employee_dob: "",
    employee_address_line1: "",
    employee_address_line2: "",
    employee_address_city: "",
    employee_address_postal_code: "",
    employee_marital_status: 0,
    employee_blood_group: "",
    employee_father_name: "",
    employee_mother_name: "",
    employee_spouse_name: "",
    employee_emergency_contact_name: "",
    employee_emergency_contact_number: "",
    employee_doj: "",
    employee_probation_period: 0,
    employee_date_of_confirmation: "",
    employee_tax_identification_number: "",
    employee_is_contract: 0,
    employee_contract_partner_id: null,
    employee_working_for_client: 0,
    employee_client_partner_id: null,
    employee_salary_payment_mode: 0,
    bank_id: null,
    employee_bank_identification_number: "",
    employee_bank_account_bank_branch: "",
    employee_bank_account_number: "",
    employee_address_country_id: null,
    employee_address_state_id: null,
    employee_bank_account_name: "",
    employee_salary_source_company_bank_acc_id: null,
    employee_current_status_id: 0,
    employee_current_location_id: 0,
    employee_current_designation_id: 0,
    employee_current_department_id: 0,
    employee_current_superior_id: null,
    employee_current_salary_id: 0,
    employee_monthly_salary: 0,
    // employee_salary_basic_pay: 0,
    employee_salary_ctc: 0,
    employee_current_payroll_group_id: 0,
    employee_current_attendance_policy_id: 0,
    employee_current_leave_plan_id: 0,
    employee_in_notice_period: 0,
    employee_expected_date_of_leaving: "",
    employee_date_of_reliving: "",
    company_id: 0,
    employee_philip_sss_number: "",
    employee_philip_pag_Ibig_number: "",
    employee_philip_philhealth_number: "",
    employee_month_salary_days: 0,
  };

  export const EmployeePayrollDetail: APIData.EmployeePayrollDetail = {
    employee_payroll_group_effective_from: "",
    employee_payroll_group_id: 0,
    employee_payroll_group_update_login_id: 0,
    payroll_group_id: 0,
    payroll_group_name: "",
    employee_id: 0,
  };
  export const EmployeePayroll: APIData.EmployeePayroll = {
    employee_payroll_group_effective_from: "",
    employee_payroll_group_update_login_id: 0,
    payroll_group_id: 0,
    employee_id: 0,
  };

  export const EmployeeLeavePlanViewDetail: APIData.EmployeeLeavePlanViewDetail =
    {
      employee_id: 0,
      employee_leave_plan_id: 0,
      leave_plan_id: 0,
      leave_plan_name: "",
      employee_leave_plan_effective_from: "",
      employee_leave_plan_update_login_id: 0,
    };
  export const EmployeeLeavePlan: APIData.EmployeeLeavePlan = {
    employee_id: 0,
    leave_plan_id: 0,
    employee_leave_plan_effective_from: "",
    employee_leave_plan_update_login_id: 0,
  };

  export const EmployeeAttendanceDetail: APIData.EmployeeAttendanceDetail = {
    employee_attendance_policy_effective_from: "",
    employee_attendance_policy_id: 0,
    employee_attendance_policy_update_login_id: 0,
    attendance_policy_id: 0,
    attendance_policy_name: "",
    employee_id: 0,
  };
  export const EmployeeAttendance: APIData.EmployeeAttendance = {
    employee_attendance_policy_effective_from: "",
    employee_attendance_policy_update_login_id: 0,
    attendance_policy_id: 0,
    employee_id: 0,
  };

  export const EmployeeSalaryDetail: APIData.EmployeeSalaryDetail = {
    // employee_salary_basic_pay: 0,
    employee_monthly_salary: 0,
    employee_salary_ctc: 0,
    employee_salary_effective_from: "",
    employee_salary_employer_notes: "",
    employee_salary_id: 0,
    employee_salary_remarks: "",
    employee_salary_update_login_id: 0,
    salary_group_id: 0,
    salary_group_name: "",
    employee_id: 0,
  };

  export const EmployeeSalary: APIData.EmployeeSalary = {
    employee_salary_component_values: [
      {
        salary_component_id: 0,
        employee_salary_component_value: "",
      },
    ],
    // employee_salary_basic_pay: 0,
    employee_monthly_salary: 0,
    employee_salary_ctc: 0,
    employee_salary_effective_from: "",
    employee_salary_employer_notes: "",
    employee_salary_remarks: "",
    employee_salary_update_login_id: 0,
    salary_group_id: 0,
    employee_id: 0,
  };

  export const EmployeeLocationDetail: APIData.EmployeeLocationDetail = {
    employee_location_effective_from: "",
    employee_location_id: 0,
    employee_location_update_login_id: 0,
    employee_location_name: "",
    employee_id: 0,
    company_location_id: 0,
  };
  export const EmployeeLocation: APIData.EmployeeLocation = {
    employee_location_effective_from: "",
    employee_location_update_login_id: 0,
    employee_id: 0,
    company_location_id: 0,
  };

  export const EmployeeDepartment: APIData.EmployeeDepartment = {
    department_id: 0,
    employee_department_effective_from: "",
    employee_department_update_login_id: 0,
    employee_id: 0,
  };

  export const EmployeeDesignation: APIData.EmployeeDesignation = {
    designation_id: 0,
    employee_designation_effective_from: "",
    employee_designation_update_login_id: 0,
    employee_id: 0,
  };

  export const EmployeeStatus: APIData.EmployeeStatus = {
    employee_status: 0,
    employee_status_left_type: 0,
    // employee_status_time: '',
    employee_status_update_login_id: 0,
    employee_id: 0,
    employee_date_of_confirmation: "",
    employee_date_of_reliving: "",
  };

  export const WorkTimeComponent: APIData.WorkTimeComponent = {
    company_workshift_id: 0,
    day_type_id: 0,
    company_workshift_pay_name: "",
    company_workshift_pay_uid: "",
    // company_workshift_pay_status: '0',
    company_workshift_pay_regular: 0,
    company_workshift_pay_overtime: 0,
    // company_workshift_pay_night: 0,
    // company_workshift_pay_night_overtime: 0,

    // work_time_day_type: "",
    // holiday_type_id: 0,
    // work_time_comp_percent_normal: 0,
    // work_time_comp_percent_ot: 0,
    // work_time_comp_percent_nd: 0,
    // work_time_comp_percent_ndot: 0,
    // company_id: 0,
  };

  export const LeaveRequest: APIData.LeaveRequest = {
    employee_id: 0,
    company_id: 0,
    leave_start_date: "",
    leave_end_date: "",
    leave_reason: "",
    leave_status: "",
    leave_days: "",
    leave_session: "",

    // leave_type_id: 0,
    // employee_leave_req_days: 1,
    // employee_leave_req_period_from: "",
    // employee_leave_req_period_to: "",
    // employee_leave_req_start_day_leave_session: 0,
    // employee_leave_req_end_day_leave_session: 0,
    // employee_leave_req_reason: "",
    // employee_leave_update_login_id: 0,
    // employee_id: 0,
    // employee_leave_req_id: 0,
  };

  export const EmployeeLeaveRequest: APIData.EmployeeLeaveRequest = {
    leave_start_date: "",
    leave_end_date: "",
    leave_reason: "",
    // leave_status: "",
    leave_days: "",
    leave_session: "",
  };

  export const EmployeeSuperior: APIData.EmployeeSuperior = {
    employee_id: 0,
    superior_employee_id: 0,
    employee_superior_effective_from: "",
    employee_superior_update_login_id: 0,
  };
}
