export namespace FormDataTypes {
  export interface SelectOption {
    value: string;
    label: string;
  }

  export interface SelectOptionHolidayType {
    value: boolean;
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

export namespace APIData {
  export interface ModelVariant {
    model_uuid: string;
    variant_name: string;
    variant_code: string;
    fuel_type_uuid: string;
    transmission_type_uuid: string;
    variant_status: number;
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
  export interface Countries {
    country_id: number;
    country_name: string;
  }

  export interface States {
    state_id: number;
    state_name: string;
    country_id: number;
  }

  export interface Clients {
    client_id: number;
    client_name: string;
    client_email: string;
    client_mobile: string;
  }

  export interface Banks {
    bank_name: string;
    country_ids: number[];
  }

  export interface Company {
    // company_id: number;
    company_code: string;
    company_name: string;
    company_reg_address1: string;
    company_reg_address2: string;
    // company_address_city: string;
    company_reg_address_zip: string;
    city_id: number;
    state_id: number;
    country_id: number;
    company_logo: string;
    company_mobile_attendance: number;
    // company_currency_id: number;
    company_mail: string;
    // company_default_probation_days: number;
    // company_salary_definition_type: number;
    user_id: number;
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

  export interface HolidayGroup {
    // holiday_group_name: string;
    company_holiday_group_name: string;
    company_id: number;
  }

  export interface employeeDailyReport {
    report_date: string;
    project_title: string;
    report_summary: string;
    task_id: string;
    status: string;
  }

  export interface HolidayType {
    company_id: number;
    company_holiday_type_name: string;
    company_holiday_type_uid: string;
    company_holiday_type_status: string;

    // holiday_type_name: string;
    // holiday_type_abbreviation: string;
    // holiday_type_is_restricted: number;
    // company_id: number;
  }

  export interface Holiday {
    company_holiday_group_id: number;
    company_holiday_type_id: number;
    company_holiday_name: string;
    company_holiday_date: string;
    company_holiday_description: string;
    company_holiday_status: boolean;

    // holiday_date: string;
    // holiday_name: string;
    // holiday_description: string;
    // company_id: number;
    // holiday_type_id: number;
    // holiday_group_ids: number[];
  }

  export interface Department {
    // department_id: number;
    // department_name: string;
    // company_id: number;
    company_id: number;
    company_department_name: string;
    // company_department_uid:string,
    // company_department_status:string
  }

  export interface LeaveType {
    leave_type_id: number;
    leave_type_name: string;
    leave_type_abbreviation: string;
    leave_type_description: string;
    leave_type_gender_allowed: number;
    leave_type_allowed_marital_status: number;
    company_id: number;
  }

  export interface RestDayGroups {
    company_weekoff_name: string;
    // rest_days: {
    //   rest_day_of_week: number;
    //   rest_day_type: number;
    //   rest_day_week_type: number;
    //   rest_day_restricted_weeks: number[];
    // }[];
    company_id: number;
  }

  export interface AttendancePolicy {
    company_id: number;
    policy_name: string;
    company_workshift_id: number;
    company_weekoff_id: number;
    company_holiday_group_id: number;

    // attendance_policy_name: string;
    // rest_day_group_id: number;
    // work_shift_id: number;
    // holiday_group_id: number;
    // attendance_policy_restricted_holiday_count: number;
    // company_id: number;
  }

  export interface SalaryComponent {
    salary_component_type: number;
    salary_component_name: string;
    salary_component_abbreviation: string;
    salary_component_description: string;
    salary_component_calc_type: number;
    salary_component_calc_day_type: number;
    salary_component_common_fixed_value: number | null;
    salary_component_calculation_formula: string | null;
    salary_component_tax_applicable: number;
    salary_component_bi_month_applicable_cycle: number | null;
    salary_component_is_statistical: number;
    company_id: number;
    salary_component_status: number;
  }

  export interface SalaryGroup {
    salary_group_id: number;
    salary_group_name: string;
    company_id: number;
    salary_group_status: number;
  }

  export interface SalaryGroupComponent {
    salary_group_component_id: number;
    salary_component_id: number;
    salary_component_name: string;
    salary_component_calc_type: number;
    salary_group_id: number;
    salary_group_name: string;
  }

  export interface PayrollGroup {
    payroll_group_name: string;
    specific_days_per_month: number;
    calculate_per_day_salary: string;
    payroll_interval: string;
    start_month: string;
    payroll_start_day_of_month: number;
    company_id: number;

    // payroll_group_id: number;
    // payroll_group_name: string;
    // payroll_group_generation_interval: number;
    // payroll_group_start_days_of_month: string | string[];
    // payroll_group_start_month: number;
    // payroll_group_start_day_of_week: number;
    // company_id: number;
    // payroll_group_status: number;
    // payroll_group_calc_per_day_salary_by: number;
    // payroll_group_calc_specific_days_per_month: number;
  }

  export interface User {
    user_id: number;
    user_name: string;
    user_email: string;
    user_mobile: string;
    user_status: boolean;
    user_password: string;
    role_id: number;
  }

  export interface WorkShift {
    company_id: number;
    company_workshift_name: string;
    // company_workshift_status:string,
    company_workshift_start_time: string;
    company_workshift_end_time: string;
    company_workshift_start_grace_period: number;
    company_workshift_end_grace_period: number;
    company_workshift_grace_period_deduction: string;
    company_workshift_min_full_day_hours: string;
    company_workshift_min_half_day_hours: string;

    // work_shift_name: string;
    // work_shift_in_time: string;
    // work_shift_in_late_tolerance_mins: number;
    // work_shift_out_time: string;
    // work_shift_out_early_tolerance_mins: number;
    // work_shift_late_early_salary_deduction: number;
    // work_shift_standard_working_hours: string;
    // work_shift_min_full_day_working_hours: string;
    // work_shift_min_half_day_working_hours: string;
    // company_id: number;
  }

  export interface Designation {
    // company_id: number;
    // designation_name: string;
    // parent_designation_id: number;

    company_department_id: number;
    company_designation_name: string;
    // company_designation_uid:string;
    // company_designation_status:string
  }

  export interface LeavePlan {
    leave_plan_name: string;
    leave_plan_status: number;
    company_id: number;
    leave_plan_leave_types: LeavePlanLeaveType[];
  }

  export interface LeavePlanLeaveType {
    leave_type_id: number;
    leave_plan_leave_type_allocation_type: number;
    leave_plan_leave_type_available_for_probation: boolean;
    leave_plan_leave_type_credit_in_notice_period: boolean;
    leave_plan_leave_type_can_avail_in_notice_period: boolean;
    leave_plan_leave_type_credit_period: number;
    leave_plan_leave_type_credit_month: number;
    leave_plan_leave_type_credit_day: number;
    leave_plan_leave_type_credit_eligible_worked_days: number;
    leave_plan_leave_type_credit_count: number;
    leave_plan_leave_type_unclaimed_operation_year_end: number;
    leave_plan_leave_type_unclaimed_operation_month_end: number;
    leave_plan_leave_type_carry_over_percent_year_end: number;
    leave_plan_leave_type_carry_over_percent_month_end: number;
    leave_plan_leave_type_encashment_percent_year_end: number;
    leave_plan_leave_type_encashment_percent_month_end: number;
    leave_plan_leave_type_credit_doj_eligibility: number;
    leave_plan_leave_type_credit_eligible_doj_month: number;
    leave_plan_leave_type_credit_eligible_doj_day: number;
  }

  // export interface LeavePlan {
  //   leave_plan_name: string;
  //   leave_plan_status: number;
  //   company_id: number;
  //   leave_plan_leave_types: LeavePlanLeaveType[];
  // }

  // export interface LeavePlanLeaveType {
  //   leave_type_id: number;
  //   leave_plan_leave_type_allocation_type: number;
  //   leave_plan_leave_type_available_for_probation: boolean;
  //   leave_plan_leave_type_credit_in_notice_period: boolean;
  //   leave_plan_leave_type_can_avail_in_notice_period: boolean;
  //   leave_plan_leave_type_credit_period: number;
  //   leave_plan_leave_type_credit_month: number;
  //   leave_plan_leave_type_credit_day: number;
  //   leave_plan_leave_type_credit_eligible_worked_days: number;
  //   leave_plan_leave_type_credit_count: number;
  //   leave_plan_leave_type_unclaimed_operation_year_end: number;
  //   leave_plan_leave_type_unclaimed_operation_month_end: number;
  //   leave_plan_leave_type_carry_over_percent_year_end: number;
  //   leave_plan_leave_type_carry_over_percent_month_end: number;
  //   leave_plan_leave_type_encashment_percent_year_end: number;
  //   leave_plan_leave_type_encashment_percent_month_end: number;
  //   leave_plan_leave_type_credit_doj_eligibility: number;
  //   leave_plan_leave_type_credit_eligible_doj_month: number;
  //   leave_plan_leave_type_credit_eligible_doj_day: number;
  // }

  export interface PayrollGenerator {
    company_id: number;
    payroll_month: string;
  }

  export interface LeaveCredit {
    employee_id: number;
    company_id: number;
    company_leave_credit: number;
    remarks: string;

    // employee_leave_credit_id: number;
    // leave_type_id: number;
    // employee_leave_credit_count: number;
    // employee_leave_credit_remarks: string;
    // employee_id: number;
  }

  export interface Project {
    company_id: number;
    project_name: string;
    description: string;
    deadline: string;
    status: string;
    employees: Array<{
      employee_id: number;
      role_id: number;
    }>;
  }

  export interface Employee {
    // state_id: number;
    // employee_salary_component_values: {
    //   salary_component_id: number;
    //   employee_salary_component_value: string;
    // }[];
    employee_code: string;
    employee_first_name: string;
    employee_middle_name: string;
    employee_last_name: string;
    employee_mobile: string;
    employee_email: string;
    employee_login_available: number;
    employee_login_password: string;
    employee_photo: string;
    // employee_photo_filename: string;
    employee_gender: 1;
    employee_dob: string;
    employee_address_line1: string;
    employee_address_line2: string;
    employee_address_city: string;
    employee_address_postal_code: string;
    employee_marital_status: number;
    // employee_blood_group: string;
    employee_father_name: string;
    employee_mother_name: string;
    employee_spouse_name: string;
    employee_emergency_contact_name: string;
    employee_emergency_contact_number: string;
    employee_doj: string;
    // employee_probation_period: number;
    employee_date_of_confirmation: string;
    // employee_tax_identification_number: string;
    employee_is_contract: number;
    employee_address_country_id: number | null;
    employee_address_state_id: number | null;
    // employee_contract_partner_id: number | null;
    employee_working_for_client: number;
    // employee_client_partner_id: number | null;
    employee_salary_payment_mode: "";
    bank_name: string;
    // employee_bank_identification_number: string;
    employee_bank_account_bank_branch: string;
    employee_bank_account_number: string;
    employee_bank_account_name: string;
    // employee_salary_source_company_bank_acc_id: number | null;
    employee_status: number;
    // location_id: number;
    designation_id: number;
    department_id: number;
    superior_employee_id: number | null;
    // salary_group_id: number;
    employee_monthly_salary: number;
    // employee_salary_basic_pay: number;
    // employee_salary_ctc: number;
    payroll_group_id: number;
    attendance_policy_id: number;
    // leave_plan_id: number;
    employee_in_notice_period: number;
    employee_expected_date_of_leaving: string;
    // employee_date_of_reliving: string;
    company_id: number;
    // employee_philip_sss_number: string;
    // employee_philip_pag_Ibig_number: string;
    // employee_philip_philhealth_number: string;
    // employee_month_salary_days: number;
    employee_id?: number;
    is_superior_employee: number;
    ot_available: number;
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
    // employee_salary_basic_pay: number;
    employee_monthly_salary: number;
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

  // export interface EmployeeDetail {
  //     company: {
  //         company_address_city: string;
  //         company_address_line1: string;
  //         company_address_line2: string;
  //         company_address_postal_code: string;
  //         company_id: number;
  //         company_logo: string;
  //         company_name: string;
  //         company_salary_definition_type: number;
  //     },
  //     company_location: {},
  //     employee: {
  //         bank_id: 1,
  //         company_id: 1,
  //         employee_add_time: string;
  //         employee_address_city: string;
  //         employee_address_line1: string;
  //         employee_address_line2: string;
  //         employee_address_postal_code: string;
  //         employee_address_state_id: number | null;
  //         employee_bank_account_bank_branch: string;
  //         employee_bank_account_name: string;
  //         employee_bank_account_number: string;
  //         employee_bank_identification_number: string;
  //         employee_blood_group: string;
  //         employee_client_partner_id: number | null;
  //         employee_code: string;
  //         employee_contract_partner_id: null,
  //         employee_current_attendance_policy_id: 2,
  //         employee_current_department_id: 3,
  //         employee_current_designation_id: 3,
  //         employee_current_leave_plan_id: null,
  //         employee_current_location_id: 3,
  //         employee_current_payroll_group_id: 2,
  //         employee_current_salary_id: 2,
  //         employee_current_status_id: 3,
  //         employee_current_superior_id: null,
  //         employee_date_of_confirmation: string;
  //         employee_date_of_reliving: string;
  //         employee_dob: string;
  //         employee_doj: string;
  //         employee_email: string;
  //         employee_emergency_contact_name: string;
  //         employee_emergency_contact_number: string;
  //         employee_expected_date_of_leaving: string;
  //         employee_father_name: string;
  //         employee_first_name: string;
  //         employee_gender: number;
  //         employee_id: number;
  //         employee_in_notice_period: number;
  //         employee_is_contract: number;
  //         employee_last_name: string;
  //         employee_login_available: number;
  //         employee_login_password: string;
  //         employee_marital_status: number;
  //         employee_middle_name: string;
  //         employee_mobile: string;
  //         employee_mother_name: string;
  //         employee_photo: string;
  //         employee_photo_filename: string;
  //         employee_probation_period: number;
  //         employee_salary_payment_mode: number;
  //         employee_salary_source_company_bank_acc_id: null,
  //         employee_spouse_name: string;
  //         employee_tax_identification_number: string;
  //         employee_working_for_client: number;
  //     },
  //     employee_attendance_policy?: {
  //         attendance_policy_id: number;
  //         attendance_policy_name: string;
  //         employee_attendance_policy_id: number;
  //     },
  //     employee_bank: {
  //         bank_id: number;
  //         bank_name: string;
  //     },
  //     employee_department: {
  //         department_id: number;
  //         department_name: string;
  //         employee_department_id: number;
  //     },
  //     employee_designation: {
  //         designation_id: number;
  //         designation_name: string;
  //         employee_designation_id: number;
  //     },
  //     employee_leave_plan: {
  //         leave_plan_add_time: string;
  //         leave_plan_id: number;
  //         leave_plan_name: string;
  //         leave_plan_status: number;
  //         leave_plan_update_time: string;
  //     },
  //     employee_payroll_group: {
  //         employee_payroll_group_id: number;
  //         payroll_group_id: number;
  //         payroll_group_name: string;
  //     },
  //     employee_salary: {
  //         employee_salary_basic_pay: number;
  //         employee_salary_ctc: number;
  //         employee_salary_effective_from: string;
  //         employee_salary_employer_notes: string;
  //         employee_salary_id: number;
  //         employee_salary_remarks: string;
  //         salary_group_id: number;
  //         salary_group_name: string;
  //     },
  //     employee_status: {
  //         employee_status: number;
  //         employee_status_id: number;
  //         employee_status_left_type: number;
  //         employee_status_time: string;
  //     },
  //     employee_superior?: {
  //         employee_id: number;
  //         employee_name: string;
  //     }
  // }

  export interface EmployeeEdit {
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
    employee_in_notice_period: number;
    employee_expected_date_of_leaving: string;
    employee_date_of_reliving: string;
    company_id: number;
    employee_philip_sss_number: string;
    employee_philip_pag_Ibig_number: string;
    employee_philip_philhealth_number: string;
    employee_month_salary_days: number;
  }

  export interface EmployeeSalaryDetail {
    // employee_salary_basic_pay: number;
    employee_monthly_salary: number;
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

  export interface EmployeeSalary {
    employee_salary_component_values: [
      {
        salary_component_id: number;
        employee_salary_component_value: string;
      }
    ];
    // employee_salary_basic_pay: number;
    employee_monthly_salary: number;
    employee_salary_ctc: number;
    employee_salary_effective_from: string;
    employee_salary_employer_notes: string | null;
    employee_salary_remarks: string | null;
    employee_salary_update_login_id: number | null;
    salary_group_id: number;
    employee_id: number;
  }

  export interface EmployeeDesignation {
    designation_id: number;
    employee_designation_effective_from: string;
    employee_designation_update_login_id: number | null;
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

  export interface EmployeePayrollDetail {
    employee_payroll_group_effective_from: string;
    employee_payroll_group_id: number;
    employee_payroll_group_update_login_id: number | null;
    payroll_group_id: number;
    payroll_group_name: string;
    employee_id: number;
  }

  export interface EmployeePayroll {
    employee_payroll_group_effective_from: string;
    employee_payroll_group_update_login_id: number;
    payroll_group_id: number;
    employee_id: number;
  }

  export interface EmployeeLeavePlanViewDetail {
    employee_id: number;
    leave_plan_id: number;
    leave_plan_name: string;
    employee_leave_plan_id: number;
    employee_leave_plan_effective_from: string;
    employee_leave_plan_update_login_id: number;
  }
  export interface EmployeeLeavePlan {
    employee_id: number;
    leave_plan_id: number;
    employee_leave_plan_effective_from: string;
    employee_leave_plan_update_login_id: number;
  }

  export interface EmployeeSuperior {
    employee_id: number;
    superior_employee_id: number | null;
    employee_superior_effective_from: string;
    employee_superior_update_login_id: number;
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

  export interface EmployeeDepartment {
    department_id: number;
    employee_department_effective_from: string;
    employee_department_update_login_id: number | null;
    employee_id: number;
  }
  export interface EmployeeDepartmentDetail {
    department_id: number;
    department_name: string;
    employee_department_effective_from: string;
    employee_department_id: number;
    employee_department_update_login_id: number | null;
    employee_id: number;
  }

  export interface EmployeeLocationDetail {
    employee_location_effective_from: string;
    employee_location_id: number;
    employee_location_name: string;
    employee_location_update_login_id: number | null;
    employee_id: number;
    company_location_id: number;
  }

  export interface EmployeeSalaryComponentValueDetails {
    employee_salary_component_value: string;
    salary_component_calc_type: number;
    salary_component_id: number;
    salary_component_name: string;
    salary_component_type: number;
  }

  export interface EmployeeLocation {
    employee_location_effective_from: string;
    employee_location_update_login_id: number | null;
    employee_id: number;
    company_location_id: number;
  }

  export interface EmployeeAttendanceDetail {
    employee_attendance_policy_effective_from: string;
    employee_attendance_policy_id: number;
    employee_attendance_policy_update_login_id: number | null;
    attendance_policy_id: number;
    attendance_policy_name: string;
    employee_id: number;
  }

  export interface EmployeeAttendance {
    employee_attendance_policy_effective_from: string;
    employee_attendance_policy_update_login_id: number;
    attendance_policy_id: number;
    employee_id: number;
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
  export interface EmployeeStatus {
    employee_status: number;
    employee_status_left_type: number | null;
    // employee_status_time: string;
    employee_status_update_login_id: number | null;
    employee_id: number;
    employee_date_of_reliving: string;
    employee_date_of_confirmation: string;
  }

  export interface WorkTimeComponent {
    company_workshift_id: number;
    day_type_id: number;
    company_workshift_pay_name: string;
    company_workshift_pay_uid: string;
    // company_workshift_pay_status:string,
    company_workshift_pay_regular: number;
    company_workshift_pay_overtime: number;
    // company_workshift_pay_night: number;
    // company_workshift_pay_night_overtime: number;

    // work_time_day_type: string;
    // holiday_type_id: number;
    // work_time_comp_percent_normal: number;
    // work_time_comp_percent_ot: number;
    // work_time_comp_percent_nd: number;
    // work_time_comp_percent_ndot: number;
    // company_id: number;
  }
  export interface EmployeeBankDetail {
    bank_add_time: string;
    bank_id: number;
    bank_name: string;
    bank_update_time: null;
  }

  export interface LeaveRequest {
    employee_id: number;
    company_id: number;
    leave_start_date: string;
    leave_end_date: string;
    leave_reason: string;
    leave_status: string;
    leave_days: string;
    leave_session: string;

    // leave_type_id: number;
    // employee_leave_req_days: number;
    // employee_leave_req_period_from: string;
    // employee_leave_req_period_to: string;
    // employee_leave_req_start_day_leave_session: number;
    // employee_leave_req_end_day_leave_session: number;
    // employee_leave_req_reason: string;
    // employee_leave_update_login_id: number;
    // employee_id: number;
    // employee_leave_req_id: number;
  }

  export interface EmployeeLeaveRequest {
    leave_start_date: string;
    leave_end_date: string;
    leave_reason: string;
    // leave_status: string,
    leave_days: string;
    leave_session: string;
  }

  export interface MonthPayroll {
    company_name: string;
    no_of_employees?: number;
    payroll_month: string;
    payroll_cycles: {
      payroll_id: number | null;
      payroll_period: string;
      payroll_status: number;
      payrun_start_date: string;
      total_final_amount: string;
    }[];
  }

  export interface EmployeePayrollComponent {
    employee_payroll_component_abbreviation: string;
    employee_payroll_component_calculated_value: string;
    employee_payroll_component_description: string;
    employee_payroll_component_id: number;
    employee_payroll_component_name: string;
    employee_payroll_component_type: number;
  }

  export interface EmployeePayrollCompensation {
    employee_payroll_comp_calculated_amount: string;
    employee_payroll_comp_day_type: number;
    employee_payroll_comp_duration: number;
    employee_payroll_comp_id: number;
    employee_payroll_comp_work_time_type: number;
    holiday_type_id: number;
    holiday_type_name: string;
  }

  export interface PayrollListDetails {
    employee_payroll_details: {
      data: {
        basic_pay: string;
        doj: string;
        employee_name: string;
        employee_payroll_compensations: EmployeePayrollCompensation[];
        employee_payroll_components: EmployeePayrollComponent[];
        leave_days: number;
        loss_of_pay: number;
        loss_of_pay_days: number;
        no_of_working_days: string;
        regular_duration: number;
        regular_pay: string;
        total_pay: string;
        net_pay: string;
        working_shift: string;
        employee_payroll_wht: string;
        payslip_url: string;
      }[];
    };
    payroll_summary: {
      month: string;
      total_allowances: number;
      payslip_status: number;
      payslipzip_url: string;
      total_deductions: number;
      total_employees: number;
      total_final_amount: number;
    };
  }

  export interface PayrollManualComponents {
    employees: {
      employee_id: number;
      employee_first_name: string;
      employee_middle_name: string;
      employee_last_name: string;
      salary_components: {
        salary_component_id: number;
        salary_component_name: string;
        salary_component_type: number;
        salary_component_calc_type: number;
        salary_component_abbreviation: string;
        employee_payroll_component_calculated_value?: string;
      }[];
    }[];
    manual_salary_components: {
      salary_component_id: number;
      salary_component_name: string;
      salary_component_type: number;
      salary_component_calc_type: number;
      salary_component_abbreviation: string;
    }[];
  }

  export interface PayrollManualValue {
    employee_id: number;
    salary_component_id: number;
    employee_payroll_component_calculated_value: number;
  }

  export interface EmployeeDashboard {
    distribution_client: {
      client_name: string;
      distribution: number;
    }[];
    distribution_department: {
      department_name: string;
      distribution: number;
    }[];
    distribution_gender: {
      distribution: number;
      gender: string;
    }[];
    total_absent: string;
    total_employee: number;
    total_holiday: string;
    total_leave: string;
    total_present: string;
    upcoming_birthday: {
      birthday_date: string;
      employee_first_name: string;
      employee_last_name: string;
      employee_middle_name: string;
    }[];
    upcoming_holiday: {
      holiday_date: string;
      holiday_description: string;
      holiday_name: string;
      holiday_type_name: string;
    }[];
  }
}
