import React, { useEffect, useRef, useState } from "react";
import EmployeePersonalDetailsEntryDialog from "../../forms/EmployeePersonalDetailsEntryDialog";
import EmployeeProfessionalDetailsEntryDialog from "../../forms/EmployeeProfessionalDetailsEntryDialog";
// import PositionDetailsEntryDialog from "../../forms/PositionDetailsEntryDialog";
import { ServerAPI } from "../../common/ServerAPI";
import { useAppStateAPI } from "../../common/AppStateAPI";
import { APIData } from "../../common/DataTypes";
import EmployeePayrollGroupEntryDialog from "../../forms/EmployeePayrollGroupEntryDialog";
import EmployeeAttendancePolicyEntryDialog from "../../forms/EmployeeAttendancePolicyEntryDialog";
import EmployeeStatusEntryDialog from "../../forms/EmployeeStatusEntryDialog";
import EmployeeWorkingLocationEntryDialog from "../../forms/WorkingLocationEntryDialog";
import EmployeeDepartmentEntryDialog from "../../forms/EmployeeDepartmentEntryDialog";
import EmployeeDesignationEntryDialog from "../../forms/EmployeeDesignationEntryDialog";
import EmployeeSalaryDetailEntryDialog from "../../forms/EmployeeSalaryGroupEntryDialog";
import EmployeePayrollHistory from "../custom-table/EmployeePayrollHistory";
import EmployeeAttendanceHistory from "../custom-table/EmployeeAttendanceHistory";
import EmployeeLocationHistory from "../custom-table/EmployeeLocationHistory";
import EmployeeStatusHistory from "../custom-table/EmployeeStatusHistory";
import EmployeeDepartmentHistory from "../custom-table/EmployeeDepartmentHistory";
import EmployeeDesignationHistory from "../custom-table/EmployeeDesignationHistory";
import { getFormattedLocalDate, getObjectKeyByValue } from "../../common/Utilities";
import { API, EmployeeLeftType, EmployeeStatus, Gender, MaritalStatus, PaymentMode } from "../../common/Constants";
import EmployeeLeavePlanHistory from "../custom-table/EmployeeLeavePlanHistory";
import EmployeeSalaryHistory from "../custom-table/EmployeeSalaryHistory";
import EmployeeSuperiorHistory from "../custom-table/EmployeeSuperiorHistory";
import LeavePlanViewDetail from "../../forms/LeavePlanViewDetailDialog";
import EmployeeSuperiorEntryDialog from "../../forms/EmployeeSuperiorEntryDialog";


const EmployeeViewDetails = () => {
    const [showPersonalFormDialog, setShowPersonalFormDialog] = useState(false);
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [showPayrollHistory, setShowPayrollHistory] = useState(false);
    const [showDepartmentHistory, setShowDepartmentHistory] = useState(false);
    const [showDesignationHistory, setShowDesignationHistory] = useState(false);
    const [showStatusHistory, setShowStatusHistory] = useState(false);
    const [showLocationHistory, setShowLocationHistory] = useState(false);
    const [showAttendanceHistory, setShowAttendanceHistory] = useState(false);
    const [showLeavePlanHistory, setShowLeavePlanHistory] = useState(false);
    const [showSuperiorEmployeeHistory, setShowSuperiorEmployeeHistory] = useState(false);
    const [showSalaryHistory, setShowSalaryHistory] = useState(false);
    const [showProfessionalFormDialog, setShowProfessionalFormDialog] = useState(false);
    const [showAEmployeeAttendanceFormDialog, setShowEmployeeAttendanceFormDialog] = useState(false);
    const [editEmployeeAttendanceId, seteditEmployeeAttendanceId] = useState(0);
    const [showEmployeeLocationFormDialog, setShowEmployeeLocationFormDialog] = useState(false);
    const [editEmployeeLocationID, setEditEmployeeLocationID] = useState(0);
    const [showEmployeeStatusFormDialog, setShowEmployeeStatusFormDialog] = useState(false);
    const [editEmployeeStatusID, setEditEmployeeStatusID] = useState(0);
    const [showEmployeeDepartmentFormDialog, setShowEmployeeDepartmentFormDialog] = useState(false);
    const [editEmployeeDepartmentId, seteditEmployeeDepartmentId] = useState(0);
    const [showEmployeePayrollFormDialog, setShowEmployeePayrollFormDialog] = useState(false);
    const [editEmployeePayrollID, setEditEmployeePayrollID] = useState(0);
    const [showEmployeeDesignationFormDialog, setShowEmployeeDesignationFormDialog] = useState(false);
    const [editEmployeeDesignationID, setEditEmployeeDesignationID] = useState(0);
    const [showEmployeeSalaryGroupFormDialog, setShowEmployeeSalaryGroupFormDialog] = useState(false);
    const [editEmployeeSalaryGroupID, setEditEmployeeSalaryGroupID] = useState(0);
    const [showEmployeeLeavePlanDialog, setShowEmployeeLeavePlanDialog] = useState(false);
    const [editEmployeeLeavePlanID, setEditEmployeeLeavePlanID] = useState(0);
    const [showEmployeeSuperiorEmployeeDialog, setShowEmployeeSuperiorEmployeeDialog] = useState(false);
    const [editEmployeeSuperiorID, setEditEmployeeSuperiorID] = useState(0);
    const [employeeDetails, setEmployeeDetails] = useState<APIData.EmployeeDetails | null>(null);
    const [employeeCompany, setEmployeeCompany] = useState<APIData.Company | null>(null);
    const [employeeSalaryComponentsValue, setEmployeeSalaryComponentsValue] = useState<APIData.EmployeeSalaryComponentValueDetails[]>([]);
    const [employeeCompanyLocation, setEmployeeCompanyLocation] = useState<APIData.CompanyLocation | null>(null);
    const [employeeSalary, setEmployeeSalary] = useState<APIData.EmployeeSalaryDetail | null>(null);
    const [employeeDesignation, setEmployeeDesignation] = useState<APIData.EmployeeDesignationDetail | null>(null);
    const [employeePayroll, setEmployeePayroll] = useState<APIData.EmployeePayrollDetail | null>(null);
    const [employeeDepartment, setEmployeeDepartment] = useState<APIData.EmployeeDepartmentDetail | null>(null);
    const [employeeStatus, setEmployeeStatus] = useState<APIData.EmployeeStatusDetail | null>(null);
    const [employeeLocation, setEmployeeLocation] = useState<APIData.EmployeeLocationDetail | null>(null);
    const [employeeAttendance, setEmployeeAttendance] = useState<APIData.EmployeeAttendanceDetail | null>(null);
    const [employeeSuperior, setEmployeeSuperior] = useState<APIData.EmployeeSuperiorEmployeeDetail | null>(null);
    const [employeeLeavePlan, setemployeeLeavePlan] = useState<APIData.EmployeeLeavePlanViewDetail | null>(null);
    const [employeeClientPartner, setEmployeeClientPartner] = useState<APIData.Clients | null>(null);
    const [employeeContractPartner, setEmployeeContractPartner] = useState<APIData.Partner | null>(null);
    const [employeeBank, setEmployeeBank] = useState<APIData.EmployeeBankDetail | null>(null);
    const [reloadData, setReloadData] = useState<boolean>(false);
    const customTableViewRef = useRef<HTMLDivElement | null>(null);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = parseInt(urlParams.get('employee_id') || '');

    console.log("photo", `${API.BaseUrl}/file/preview?filename=${!!employeeDetails && employeeDetails.employee_photo ? employeeDetails.employee_photo : ""}`)
    // "http://hrmsapi.sitepreview.in/api/v1/file/preview?filename=20240423113650_peakpx.jpg"

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (customTableViewRef.current && !customTableViewRef.current.contains(event.target as Node)) {
                setShowPayrollHistory(false);
                setShowAttendanceHistory(false);
                setShowLocationHistory(false);
                setShowStatusHistory(false);
                setShowDepartmentHistory(false);
                setShowDesignationHistory(false);
                setShowLeavePlanHistory(false);
                setShowSalaryHistory(false);
                setShowSuperiorEmployeeHistory(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const loadData = () => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getEmployeeDetails(id).then(response => {
                if (response.data) {
                    const empData = response.data.employee;
                    const empCompany = response.data.company;
                    const empCompanyLocation = response.data.company_location;
                    const empSalary = response.data.employee_salary;
                    const empDesignation = response.data.employee_designation;
                    const empPayroll = response.data.employee_payroll_group;
                    const empDepartment = response.data.employee_department;
                    const empStatus = response.data.employee_status;
                    const empLocation = response.data.employee_location;
                    const empAttendance = response.data.employee_attendance_policy;
                    const superiorEmployee = response.data.employee_superior;
                    const empLeavePlan = response.data.employee_leave_plan
                    const empClientPartner = response.data.employee_client_partner;
                    const empContractPartner = response.data.employee_contract_partner;
                    const empBank = response.data.employee_bank
                    const empSalaryComponent = response.data.employee_salary_component_values;
                    setEmployeeDetails(empData);
                    setEmployeeCompany(empCompany);
                    setEmployeeCompanyLocation(empCompanyLocation);
                    setEmployeeSalary(empSalary);
                    setEmployeeDesignation(empDesignation);
                    setEmployeePayroll(empPayroll);
                    setEmployeeDepartment(empDepartment);
                    setEmployeeStatus(empStatus);
                    setEmployeeLocation(empLocation);
                    setEmployeeAttendance(empAttendance);
                    setEmployeeSuperior(superiorEmployee);
                    setemployeeLeavePlan(empLeavePlan);
                    setEmployeeClientPartner(empClientPartner);
                    setEmployeeContractPartner(empContractPartner);
                    setEmployeeBank(empBank);
                    setEmployeeSalaryComponentsValue(empSalaryComponent);
                    //setEmployeeDetail(response.data);
                } else {
                    console.error('No employee data found in the response');
                }
            }).finally(() => {
                reduceProcessingRequests();
            });
        }
    }

    useEffect(() => {
        loadData()
    }, [id]);

    useEffect(() => {
        loadData();
        setReloadData(false)
    }, [reloadData]);

    return (
        <div className="personal-view-details" style={{ width: "81vw" }}>
            {!!employeeDetails && <div className='my-3'>
                <div className='form-box p-2'>
                    <div className="view-details-content-edit-button">
                        <div className="personal-view-details-heading">Personal Details</div>
                        <div><button className="view-details-doc-button" onClick={() => setShowPersonalFormDialog(true)}>Edit</button>
                        </div>
                    </div>
                    <div className='personal-detail-grid'>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">First name</label>
                                <br />
                                <span className="view-details-value">{employeeDetails.employee_first_name}</span>
                            </div>
                        </div>

                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Last Name</label>
                                <br />
                                <span className="view-details-value">{!!employeeDetails && employeeDetails.employee_last_name ? employeeDetails.employee_last_name : "N/A"}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Employee Code</label>
                                <br />
                                <span className="view-details-value">{employeeDetails.employee_code}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Mobile Number</label>
                                <br />
                                <span className="view-details-value"> {employeeDetails.employee_mobile}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Official Email</label>
                                <br />
                                <span className="view-details-value"> {employeeDetails.employee_email}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Gender</label>
                                <br />
                                <span className="view-details-value" >{getObjectKeyByValue(Gender, employeeDetails.employee_gender)}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Date Of Birth</label>
                                <br />
                                <span className="view-details-value">{getFormattedLocalDate(employeeDetails.employee_dob)}</span>
                            </div>
                        </div>
                        {/* <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Login Password</label>
                                <br />
                                <spanord" className="view-details-vallue={employeeDetails.employee_login_password}>
                            </div>
                        </div> */}
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Marital Status</label>
                                <br />
                                <span className="view-details-value">{!!employeeDetails && employeeDetails.employee_marital_status ? getObjectKeyByValue(MaritalStatus, employeeDetails.employee_marital_status) : "N/A"}</span>
                            </div>
                        </div>
                        {/* <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Leave Plan</label>
                                <br />
                                <span className="view-details-value" {leave_plan.leave_plan_name}>
                            </div>
                        </div> */}
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Blood Group</label>
                                <br />
                                <span className="view-details-value">{employeeDetails.employee_blood_group ? employeeDetails.employee_blood_group : "N/A"}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Father Name</label>
                                <br />
                                <span className="view-details-value">{!!employeeDetails && employeeDetails.employee_father_name ? employeeDetails.employee_father_name : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Mother Name</label>
                                <br />
                                <span className="view-details-value">{!!employeeDetails && employeeDetails.employee_mother_name ? employeeDetails.employee_mother_name : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Spouse Name</label>
                                <br />
                                <span className="view-details-value">{!!employeeDetails && employeeDetails.employee_spouse_name ? employeeDetails.employee_spouse_name : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Emergency Contact Number</label>
                                <br />
                                <span className="view-details-value">{!!employeeDetails && employeeDetails.employee_emergency_contact_number ? employeeDetails.employee_emergency_contact_number : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Emergency Contact Name</label>
                                <br />
                                <span className="view-details-value"> {!!employeeDetails && employeeDetails.employee_emergency_contact_name ? employeeDetails.employee_emergency_contact_name : "N/A"}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user" style={{ height: '54px' }}>
                                <label htmlFor="employee_first_name" className="view-details-label">Address</label>
                                <br />
                                <textarea
                                    className="view-details-value view-details-textarea"
                                    value={
                                        (!!employeeDetails && employeeDetails.employee_address_line2)
                                            ? `${employeeDetails.employee_address_line1}, ${employeeDetails.employee_address_line2}`
                                            : (!!employeeDetails && employeeDetails.employee_address_line1 ? employeeDetails.employee_address_line1 : 'N/A')
                                    }
                                />

                            </div>
                        </div>
                        {(!!employeeDetails && employeeDetails.employee_photo !== null || "") && <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Employee Photo</label>
                                <br />
                                {/* <span className="view-details-value" {employeeDetails.employee_emergency_contact_name}> */}
                                <img src={!!employeeDetails && employeeDetails.employee_photo ? employeeDetails.employee_photo : ""} width={"120"} height={"100"} />
                            </div>
                        </div>}

                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Tax Identification Number</label>
                                <br />
                                <span className="view-details-value">{!!employeeDetails && employeeDetails.employee_tax_identification_number ? employeeDetails.employee_tax_identification_number : "N/A"}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Employee SSS Number</label>
                                <br />
                                <span className="view-details-value">{!!employeeDetails && employeeDetails.employee_philip_sss_number ? employeeDetails.employee_philip_sss_number : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Employee IBIG Number</label>
                                <br />
                                <span className="view-details-value">{!!employeeDetails && employeeDetails.employee_philip_pag_Ibig_number ? employeeDetails.employee_philip_pag_Ibig_number : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Employee Philheath Number</label>
                                <br />
                                <span className="view-details-value"> {!!employeeDetails && employeeDetails.employee_philip_philhealth_number ? employeeDetails.employee_philip_philhealth_number : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Employee Month Salary Days</label>
                                <br />
                                <span className="view-details-value">{!!employeeDetails && employeeDetails.employee_month_salary_days ? employeeDetails.employee_month_salary_days : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='form-box p-2'>
                    <div className="view-details-content-edit-button">
                        <div className="personal-view-details-heading">Professional Details</div>
                        <div><button className="view-details-doc-button" onClick={() => setShowProfessionalFormDialog(true)}>Edit</button></div>
                    </div>
                    <div className='personal-detail-grid'>
                        {/* <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Company Name</label>
                                <br />
                                <span className="view-details-value" {employeeCompany?.company_name}>
                            </div>
                        </div> */}

                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">employee is contract</label>
                                <br />
                                <span className="view-details-value">{employeeDetails.employee_is_contract === 1 ? "Yes" : employeeDetails.employee_is_contract === 0 ? "No" : "N/A"}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">contract partner name</label>
                                <br />
                                <span className="view-details-value"> {!!employeeContractPartner && employeeContractPartner.partner_name ? employeeContractPartner.partner_name : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">employee working for client</label>
                                <br />
                                <span className="view-details-value">{employeeDetails.employee_working_for_client === 1 ? "Yes" : employeeDetails.employee_working_for_client === 0 ? "No" : "N/A"}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">client partner</label>
                                <br />
                                <span className="view-details-value">{!!employeeClientPartner && employeeClientPartner.client_name ? employeeClientPartner.client_name : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">employee bank name</label>
                                <br />
                                <span className="view-details-value">{employeeBank && employeeBank ? employeeBank.bank_name : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">branch</label>
                                <br />
                                <span className="view-details-value">{!!employeeDetails && employeeDetails.employee_bank_account_bank_branch ? employeeDetails.employee_bank_account_bank_branch : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">account number</label>
                                <br />
                                <span className="view-details-value">{!!employeeDetails && employeeDetails.employee_bank_account_number ? employeeDetails.employee_bank_account_number : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">account name</label>
                                <br />
                                <span className="view-details-value">{!!employeeDetails && employeeDetails.employee_bank_account_name ? employeeDetails.employee_bank_account_name : 'N/A'}</span>
                            </div>
                        </div>
                        {/* <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">current working shift</label>
                                <br />
                                <span className="view-details-value" {employeeDetail?.employee_marital_status}>
                            </div>
                        </div> */}
                        {/* <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">current status  </label>
                                <br />
                                <span className="view-details-value" {getObjectKeyByValue(EmployeeStatus, employeeStatus.employee_status)}>
                            </div>
                        </div> */}
                        {/* <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">date of confirmation</label>
                                <br />
                                <span className="view-details-value" {employeeDetails.employee_date_of_confirmation}>
                            </div>
                        </div> */}
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">in notice period</label>
                                <br />
                                <span className="view-details-value">{employeeDetails.employee_in_notice_period === 1 ? "Yes" : employeeDetails.employee_in_notice_period === 0 ? "No" : "N/A"}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Expected date of reliving</label>
                                <br />
                                <span className="view-details-value">{!!employeeDetails && employeeDetails.employee_expected_date_of_leaving ? employeeDetails.employee_expected_date_of_leaving : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">payment mode</label>
                                <br />
                                <span className="view-details-value">{!!employeeDetails && employeeDetails.employee_salary_payment_mode ? getObjectKeyByValue(PaymentMode, employeeDetails.employee_salary_payment_mode) : "N/A"}
                                </span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Login Available</label>
                                <br />
                                <span className="view-details-value"> {employeeDetails.employee_login_available === 1 ? "Yes" : employeeDetails.employee_login_available === 0 ? "No" : "N/A"}
                                </span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Date Of Joining</label>
                                <br />
                                <span className="view-details-value">{getFormattedLocalDate(employeeDetails.employee_doj)}</span>
                            </div>
                        </div>
                        {/* <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">pay from</label>
                                <br />
                                <span className="view-details-value" {"lorem ipsum"}>
                            </div>
                        </div> */}
                    </div>
                    <div className="display-resp">
                        <div className="view-details-form-edit-container">
                            <div className='view-details-form-edit personal-detail-grid '>
                                <div className="row py-3 personal-detail-field single-details">
                                    <div className="  text-field-empty-custom-user">
                                        <label htmlFor="employee_first_name" className="view-details-label">payroll group</label>
                                        <br />
                                        <span className="view-details-value">{!!employeePayroll ? employeePayroll.payroll_group_name : 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="row py-3 personal-detail-field single-details">
                                    <div className="  text-field-empty-custom-user">
                                        <label htmlFor="employee_first_name" className="view-details-label">effective from date</label>
                                        <br />
                                        <span className="view-details-value">{!!employeePayroll ? getFormattedLocalDate(employeePayroll.employee_payroll_group_effective_from) : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexDirection: "column", marginTop: "1rem" }}>
                                <div onClick={() => { setShowEmployeePayrollFormDialog(true); setEditEmployeePayrollID(employeeDetails.employee_current_payroll_group_id) }} style={{ cursor: " pointer" }}><img src="/assets/svg/view-edit.svg" alt="" /></div>
                                <div onClick={() => { setShowEmployeePayrollFormDialog(true); setEditEmployeePayrollID(0) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-add.svg"} alt="" /></div>
                                <div onClick={() => setShowPayrollHistory(true)} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-history.svg"} alt="" /></div>
                            </div>
                        </div>
                        <div className="view-details-form-edit-container">
                            <div className='view-details-form-edit personal-detail-grid'>
                                <div className="row py-3 personal-detail-field single-details">
                                    <div className="  text-field-empty-custom-user">
                                        <label htmlFor="employee_first_name" className="view-details-label">attendance policy</label>
                                        <br />
                                        <span className="view-details-value"> {!!employeeAttendance ? employeeAttendance.attendance_policy_name : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="row py-3 personal-detail-field single-details">
                                    <div className="  text-field-empty-custom-user">
                                        <label htmlFor="employee_first_name" className="view-details-label">effective from date</label>
                                        <br />
                                        <span className="view-details-value">{!!employeeAttendance ? getFormattedLocalDate(employeeAttendance.employee_attendance_policy_effective_from) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexDirection: "column", marginTop: "1rem" }}>
                                <div onClick={() => { setShowEmployeeAttendanceFormDialog(true); seteditEmployeeAttendanceId(employeeDetails.employee_current_attendance_policy_id) }} style={{ cursor: " pointer" }}><img src="/assets/svg/view-edit.svg" alt="" /></div>
                                <div onClick={() => { setShowEmployeeAttendanceFormDialog(true); seteditEmployeeAttendanceId(0) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-add.svg"} alt="" /></div>
                                <div onClick={() => { setShowAttendanceHistory(true) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-history.svg"} alt="" /></div>
                            </div>
                        </div>

                        <div className="view-details-form-edit-container">
                            <div className='view-details-form-edit personal-detail-grid'>
                                <div className="row py-3 personal-detail-field single-details">
                                    <div className="  text-field-empty-custom-user">
                                        <label htmlFor="employee_first_name" className="view-details-label">Leave Plan</label>
                                        <br />
                                        <span className="view-details-value" >{!!employeeLeavePlan ? employeeLeavePlan.leave_plan_name : "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <div className="row py-3 personal-detail-field single-details">
                                    <div className="  text-field-empty-custom-user">
                                        <label htmlFor="employee_first_name" className="view-details-label">effective from date</label>
                                        <br />
                                        <span className="view-details-value">{(employeeLeavePlan && employeeLeavePlan.employee_leave_plan_effective_from) ? getFormattedLocalDate(employeeLeavePlan.employee_leave_plan_effective_from) : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexDirection: "column", marginTop: "1rem" }}>
                                <div onClick={() => { setShowEmployeeLeavePlanDialog(true); setEditEmployeeLeavePlanID(employeeDetails.employee_current_leave_plan_id) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-edit.svg"} alt="" /></div>
                                <div onClick={() => { setShowEmployeeLeavePlanDialog(true); setEditEmployeeLeavePlanID(0) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-add.svg"} alt="" /></div>
                                <div onClick={() => { setShowLeavePlanHistory(true) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-history.svg"} alt="" /></div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="view-details-form-edit-container" style={{ alignItems: "end", paddingBottom: "12px" }}>
                        <div className='view-details-form-edit personal-detail-grid' style={{ display: "flex", flexWrap: "wrap" }}>
                            <div className="row py-3 personal-detail-field single-details">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">payroll group</label>
                                    <br />
                                    <span className="view-details-value" {!!employeePayroll ? employeePayroll.payroll_group_name : 'N/A'}>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field single-details">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">effective from date</label>
                                    <br />
                                    <span className="view-details-value" {!!employeePayroll ? getFormattedLocalDate(employeePayroll.employee_payroll_group_effective_from) : 'N/A'}>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field single-details">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">Employee Month Salary Days</label>
                                    <br />
                                    <span className="view-details-value" {!!employeeDetails ? employeeDetails.employee_month_salary_days : 'N/A'}>
                                </div>
                            </div>
                        </div>
                        <div className="salary-group-resp" style={{ display: "flex", gap: "10px", alignItems: "center", }}>
                            <div onClick={() => { setShowEmployeePayrollFormDialog(true); setEditEmployeePayrollID(employeeDetails.employee_current_payroll_group_id) }} style={{ cursor: " pointer" }}><img src="/assets/svg/view-edit.svg" alt="" /></div>
                            <div onClick={() => { setShowEmployeePayrollFormDialog(true); setEditEmployeePayrollID(0) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-add.svg"} alt="" /></div>
                            <div onClick={() => setShowPayrollHistory(true)} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-history.svg"} alt="" /></div>
                        </div>
                    </div> */}

                    <div className="view-details-form-edit-container" style={{ alignItems: "end", paddingBottom: "12px" }}>
                        <div className='view-details-form-edit personal-detail-grid ' style={{ display: "flex", flexWrap: "wrap" }}>
                            <div className="row py-3 personal-detail-field single-details">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">salary group</label>
                                    <br />
                                    <span className="view-details-value">{!!employeeSalary ? employeeSalary.salary_group_name : 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field single-details">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">monthly basic pay</label>
                                    <br />
                                    <span className="view-details-value">{!!employeeSalary ? employeeSalary.employee_monthly_salary : 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field single-details">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">  annual CTC</label>
                                    <br />
                                    <span className="view-details-value">{!!employeeSalary && employeeSalary.employee_salary_ctc > 0 ? employeeSalary.employee_salary_ctc : 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field single-details">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">effective from date</label>
                                    <br />
                                    <span className="view-details-value">{!!employeeSalary ? getFormattedLocalDate(employeeSalary.employee_salary_effective_from) : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {/* <div className="row py-3 personal-detail-field single-details">
                                <div className="text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">Salary Component Value</label>
                                    <br />
                                    <span className="view-details-value" {!!employeeSalaryComponentsValue ? employeeSalaryComponentsValue.employee_salary_component_value : 'N/A'}                                   />
                                </div>
                            </div> */}
                            {employeeSalaryComponentsValue && employeeSalaryComponentsValue.length > 0 && (
                                employeeSalaryComponentsValue.map((value, index) => (
                                    <div className="row py-3 personal-detail-field single-details mr-2" key={index}>
                                        <div className="text-field-empty-custom-user">
                                            <label htmlFor="employee_first_name" className="view-details-label">{value.salary_component_name}</label>
                                            <br />
                                            <span className="view-details-value">{value.employee_salary_component_value ? value.employee_salary_component_value : "N/A"}</span>
                                        </div>
                                    </div>
                                ))
                            )}


                        </div>
                        <div className="salary-group-resp" style={{ display: "flex", gap: "10px", alignItems: "center", }}>
                            <div onClick={() => { setShowEmployeeSalaryGroupFormDialog(true); setEditEmployeeSalaryGroupID(employeeDetails.employee_current_salary_id) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-edit.svg"} alt="" /></div>
                            <div onClick={() => { setShowEmployeeSalaryGroupFormDialog(true); setEditEmployeeSalaryGroupID(0) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-add.svg"} alt="" /></div>
                            <div onClick={() => { setShowSalaryHistory(true) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-history.svg"} alt="" /></div>
                        </div>
                    </div>

                    {/* <div className="view-details-form-edit-container">
                        <div className='view-details-form-edit personal-detail-grid '>
                            <div className="row py-3 personal-detail-field single-details">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">salary group</label>
                                    <br />
                                    <span className="view-details-value" {employeeDetail?.employee_current_salary_group_id}>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field single-details">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">effective from date</label>
                                    <br />
                                    <span className="view-details-value" {"03/02/2020"}>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <div><img src="/assets/svg/view-edit.svg" alt="" /></div>
                            <div><img src="/assets/svg/view-add.svg" alt="" /></div>
                            <div><img src="/assets/svg/view-history.svg" alt="" /></div>
                        </div>
                    </div> */}
                </div>

                <div className='form-box p-2'>
                    <div className="personal-view-details-heading mb-1">  position history</div>
                    <div className="view-details-form-edit-container" style={{ alignItems: "end", paddingBottom: "12px" }}>
                        <div className='view-details-form-edit personal-detail-grid' style={{ display: "flex", flexWrap: "wrap" }}>
                            <div className="row py-3 personal-detail-field single-details">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">employee status</label>
                                    <br />
                                    <span className="view-details-value">{!!employeeStatus ? getObjectKeyByValue(EmployeeStatus, employeeStatus.employee_status) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                            {employeeStatus?.employee_status === EmployeeStatus.Left &&
                                <>
                                    <div className="row py-3 personal-detail-field single-details">
                                        <div className="  text-field-empty-custom-user">
                                            <label htmlFor="employee_first_name" className="view-details-label">Employee Left Type</label>
                                            <br />
                                            <span className="view-details-value">{!!employeeStatus ? getObjectKeyByValue(EmployeeLeftType, employeeStatus.employee_status_left_type) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="row py-3 personal-detail-field single-details">
                                        <div className="  text-field-empty-custom-user">
                                            <label htmlFor="employee_first_name" className="view-details-label">Date Of Reliving</label>
                                            <br />
                                            <span className="view-details-value">{!!employeeStatus ? getFormattedLocalDate(employeeStatus.employee_date_of_reliving) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </>}
                            {employeeStatus?.employee_status === EmployeeStatus.Confirmed &&
                                <>
                                    <div className="row py-3 personal-detail-field single-details">
                                        <div className="  text-field-empty-custom-user">
                                            <label htmlFor="employee_first_name" className="view-details-label">Date Of Confirmation</label>
                                            <br />
                                            <span className="view-details-value">{!!employeeStatus ? getFormattedLocalDate(employeeStatus.employee_date_of_confirmation) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </>}
                            {employeeStatus?.employee_status === EmployeeStatus.Probation &&
                                <>
                                    <div className="row py-3 personal-detail-field single-details">
                                        <div className="  text-field-empty-custom-user">
                                            <label htmlFor="employee_first_name" className="view-details-label">Date Of Confirmation</label>
                                            <br />
                                            <span className="view-details-value">{!!employeeStatus ? getFormattedLocalDate(employeeStatus.employee_date_of_confirmation) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </>}
                            {/* <div className="row py-3 personal-detail-field single-details">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">  effective from date</label>
                                    <br />
                                    <span className="view-details-value">{!!employeeStatus ? getFormattedLocalDate(employeeStatus.employee_status_time) : 'N/A'}
                                    </span>
                                </div>
                            </div> */}
                        </div>
                        <div className="salary-group-resp" style={{ display: "flex", gap: "10px", alignItems: "center", }}>
                            <div onClick={() => { setShowEmployeeStatusFormDialog(true); setEditEmployeeStatusID(employeeDetails.employee_current_status_id) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-edit.svg"} alt="" /></div>
                            <div onClick={() => { setShowEmployeeStatusFormDialog(true); setEditEmployeeStatusID(0) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-add.svg"} alt="" /></div>
                            <div onClick={() => { setShowStatusHistory(true) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-history.svg"} alt="" /></div>
                        </div>
                    </div>
                    <div className="display-resp">
                        <div className="view-details-form-edit-container">
                            <div className='view-details-form-edit personal-detail-grid '>
                                <div className="row py-3 personal-detail-field single-details">
                                    <div className="  text-field-empty-custom-user">
                                        <label htmlFor="employee_first_name" className="view-details-label">working location</label>
                                        <br />
                                        <span className="view-details-value">{!!employeeCompanyLocation ? employeeCompanyLocation.company_location_name : "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <div className="row py-3 personal-detail-field single-details">
                                    <div className="  text-field-empty-custom-user">
                                        <label htmlFor="employee_first_name" className="view-details-label">effective from date</label>
                                        <br />
                                        <span className="view-details-value">{!!employeeLocation ? getFormattedLocalDate(employeeLocation.employee_location_effective_from) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexDirection: "column", marginTop: "1rem" }}>
                                <div onClick={() => { setShowEmployeeLocationFormDialog(true); setEditEmployeeLocationID(employeeDetails.employee_current_location_id) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-edit.svg"} alt="" /></div>
                                <div onClick={() => { setShowEmployeeLocationFormDialog(true); setEditEmployeeLocationID(0) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-add.svg"} alt="" /></div>
                                <div onClick={() => { setShowLocationHistory(true) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-history.svg"} alt="" /></div>
                            </div>
                        </div>

                        <div className="view-details-form-edit-container">
                            <div className='view-details-form-edit personal-detail-grid '>
                                <div className="row py-3 personal-detail-field single-details">
                                    <div className="  text-field-empty-custom-user">
                                        <label htmlFor="employee_first_name" className="view-details-label">department</label>
                                        <br />
                                        <span className="view-details-value">{!!employeeDepartment ? employeeDepartment.department_name : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="row py-3 personal-detail-field single-details">
                                    <div className="  text-field-empty-custom-user">
                                        <label htmlFor="employee_first_name" className="view-details-label">effective from date</label>
                                        <br />
                                        <span className="view-details-value">{!!employeeDepartment ? getFormattedLocalDate(employeeDepartment.employee_department_effective_from) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexDirection: "column", marginTop: "1rem" }}>
                                <div onClick={() => { setShowEmployeeDepartmentFormDialog(true); seteditEmployeeDepartmentId(employeeDetails.employee_current_department_id) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-edit.svg"} alt="" /></div>
                                <div onClick={() => { setShowEmployeeDepartmentFormDialog(true); seteditEmployeeDepartmentId(0) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-add.svg"} alt="" /></div>
                                <div onClick={() => { setShowDepartmentHistory(true) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-history.svg"} alt="" /></div>
                            </div>
                        </div>

                        <div className="view-details-form-edit-container">
                            <div className='view-details-form-edit personal-detail-grid '>
                                <div className="row py-3 personal-detail-field single-details">
                                    <div className="  text-field-empty-custom-user">
                                        <label htmlFor="employee_first_name" className="view-details-label">designation</label>
                                        <br />
                                        <span className="view-details-value">{!!employeeDesignation ? employeeDesignation.designation_name : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="row py-3 personal-detail-field single-details">
                                    <div className="  text-field-empty-custom-user">
                                        <label htmlFor="employee_first_name" className="view-details-label">effective from date</label>
                                        <br />
                                        <span className="view-details-value">{!!employeeDesignation ? getFormattedLocalDate(employeeDesignation.employee_designation_effective_from) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexDirection: "column", marginTop: "1rem" }}>
                                <div onClick={() => { setShowEmployeeDesignationFormDialog(true); setEditEmployeeDesignationID(employeeDetails.employee_current_designation_id); }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-edit.svg"} alt="" /></div>
                                <div onClick={() => { setShowEmployeeDesignationFormDialog(true); setEditEmployeeDesignationID(0); }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-add.svg"} alt="" /></div>
                                <div onClick={() => { setShowDesignationHistory(true) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-history.svg"} alt="" /></div>
                            </div>
                        </div>
                        <div className="view-details-form-edit-container">
                            <div className='view-details-form-edit personal-detail-grid '>
                                <div className="row py-3 personal-detail-field single-details">
                                    <div className="  text-field-empty-custom-user">
                                        <label htmlFor="employee_first_name" className="view-details-label">superior employee</label>
                                        <br />
                                        <span className="view-details-value">{employeeSuperior && employeeSuperior.employee_superior_first_name ? employeeSuperior.employee_superior_first_name : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="row py-3 personal-detail-field single-details">
                                    <div className="  text-field-empty-custom-user">
                                        <label htmlFor="employee_first_name" className="view-details-label">effective from date</label>
                                        <br />
                                        <span className="view-details-value">{(employeeSuperior && employeeSuperior.employee_superior_effective_from) ? getFormattedLocalDate(employeeSuperior.employee_superior_effective_from) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexDirection: "column", marginTop: "1rem" }}>
                                <div onClick={() => { setShowEmployeeSuperiorEmployeeDialog(true); setEditEmployeeSuperiorID(employeeDetails.employee_current_superior_id ? employeeDetails.employee_current_superior_id : 0) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-edit.svg"} alt="" /></div>
                                <div onClick={() => { setShowEmployeeSuperiorEmployeeDialog(true); setEditEmployeeSuperiorID(0) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-add.svg"} alt="" /></div>
                                <div onClick={() => { setShowSuperiorEmployeeHistory(true) }} style={{ cursor: " pointer" }}><img src={window.location.origin + "/assets/svg/view-history.svg"} alt="" /></div>
                            </div>
                        </div>
                    </div>
                    {/* 
                    <div className="view-details-form-edit-container">
                        <div className='view-details-form-edit personal-detail-grid '>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">allowances  </label>
                                    <br />
                                    <span className="view-details-value" {"lorem ipsum"}>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">effective from date</label>
                                    <br />
                                    <span className="view-details-value" {"03/02/2020"}>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <div><img src="/assets/svg/view-edit.svg" alt="" /></div>
                            <div><img src="/assets/svg/view-add.svg" alt="" /></div>
                            <div><img src="/assets/svg/view-history.svg" alt="" /></div>
                        </div>
                    </div> */}

                </div>

                {/* <div className='form-box p-2' style={{ width: "78.5vw" }}>
                    <div className="view-details-content-edit-button">
                        <div className="personal-view-details-heading">  documents</div>
                        <div><button className="view-details-doc-button"><div style={{ display: "flex", gap: "10px" }}> <img src="/assets/svg/add-btn.svg" alt="" /> Add New Doc </div></button></div>
                    </div>
                    <div className="view-details-doc-container">
                        <div className='personal-detail-grid'>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">  document type</label>
                                    <br />
                                    <span className="view-details-value" {"lorem ipsum"}>
                                </div>
                            </div>

                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">  document reference number</label>
                                    <br />
                                    <span className="view-details-value" {"987654321"}>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">  document</label>
                                    <br />
                                    <button className="view-details-doc-button"><div style={{ display: "flex", gap: "10px" }}>view document <img src="/assets/svg/greaterthan.svg" alt="" /></div></button>
                                </div>
                            </div>

                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">    expiry date</label>
                                    <br />
                                    <span className="view-details-value" {"03/02/2027"}>
                                </div>
                            </div>

                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">      remarks</label>
                                    <br />
                                    <span className="view-details-value" {"lorem ipsum"}>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="view-details-doc-container">
                        <div className='personal-detail-grid'>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">  document type</label>
                                    <br />
                                    <span className="view-details-value" {"lorem ipsum"}>
                                </div>
                            </div>

                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">  document reference number</label>
                                    <br />
                                    <span className="view-details-value" {"987654321"}>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">  document</label>
                                    <br />
                                    <button className="view-details-doc-button"><div style={{ display: "flex", gap: "10px" }}>view document <img src="/assets/svg/greaterthan.svg" alt="" /></div></button>
                                </div>
                            </div>

                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">    expiry date</label>
                                    <br />
                                    <span className="view-details-value" {"03/02/2027"}>
                                </div>
                            </div>

                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">      remarks</label>
                                    <br />
                                    <span className="view-details-value" {"lorem ipsum"}>
                                </div>
                            </div>

                        </div>
                    </div>
                </div> */}

                {/* <div className='form-box p-2' style={{ width: "78.5vw" }}>
                    <div className="view-details-content-edit-button">
                        <div className="personal-view-details-heading">past experience</div>
                        <div><button className="view-details-doc-button"><div style={{ display: "flex", gap: "10px" }}> <img src="/assets/svg/add-btn.svg" alt="" /> add past experience    </div></button></div>
                    </div>
                    <div className="view-details-doc-container">
                        <div className='personal-detail-grid'>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">company name</label>
                                    <br />
                                    <span className="view-details-value" {"lorem ipsum"}>
                                </div>
                            </div>

                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">      working location</label>
                                    <br />
                                    <span className="view-details-value" {"lorem ipsum"}>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">   department</label>
                                    <br />
                                    <span className="view-details-value" {"lorem ipsum"}>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">        designation</label>
                                    <br />
                                    <span className="view-details-value" {"lorem ipsum"}>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">        join date</label>
                                    <br />
                                    <span className="view-details-value" {"  03/02/2020"}>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">  letter of employment</label>
                                    <br />
                                    <button className="view-details-doc-button"><div style={{ display: "flex", gap: "10px" }}>view document <img src="/assets/svg/greaterthan.svg" alt="" /></div></button>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">   salary slips  </label>
                                    <br />
                                    <button className="view-details-doc-button"><div style={{ display: "flex", gap: "10px" }}>view document <img src="/assets/svg/greaterthan.svg" alt="" /></div></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="view-details-doc-container">
                        <div className='personal-detail-grid'>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">    company name  </label>
                                    <br />
                                    <span className="view-details-value" {"lorem ipsum"}>
                                </div>
                            </div>

                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">      working location</label>
                                    <br />
                                    <span className="view-details-value" {"lorem ipsum"}>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">   department</label>
                                    <br />
                                    <span className="view-details-value" {"lorem ipsum"}>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">        designation</label>
                                    <br />
                                    <span className="view-details-value" {"lorem ipsum"}>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">        join date</label>
                                    <br />
                                    <span className="view-details-value" {"  03/02/2020"}>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">  letter of employment</label>
                                    <br />
                                    <button className="view-details-doc-button"><div style={{ display: "flex", gap: "10px" }}>view document <img src="/assets/svg/greaterthan.svg" alt="" /></div></button>
                                </div>
                            </div>
                            <div className="row py-3 personal-detail-field">
                                <div className="  text-field-empty-custom-user">
                                    <label htmlFor="employee_first_name" className="view-details-label">   salary slips  </label>
                                    <br />
                                    <button className="view-details-doc-button"><div style={{ display: "flex", gap: "10px" }}>view document <img src="/assets/svg/greaterthan.svg" alt="" /></div></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>}

            {showPersonalFormDialog && <EmployeePersonalDetailsEntryDialog showDialog={showPersonalFormDialog} closeDialog={() => setShowPersonalFormDialog(false)} reloadData={() => setReloadData(true)} id={id} />}
            {showProfessionalFormDialog && <EmployeeProfessionalDetailsEntryDialog showDialog={showProfessionalFormDialog} closeDialog={() => setShowProfessionalFormDialog(false)} reloadData={() => setReloadData(true)} id={id} />}
            {showEmployeePayrollFormDialog && <EmployeePayrollGroupEntryDialog showDialog={showEmployeePayrollFormDialog} closeDialog={() => setShowEmployeePayrollFormDialog(false)} reloadData={() => setReloadData(true)} employeeID={id} id={editEmployeePayrollID} />}
            {showAEmployeeAttendanceFormDialog && <EmployeeAttendancePolicyEntryDialog showDialog={showAEmployeeAttendanceFormDialog} closeDialog={() => setShowEmployeeAttendanceFormDialog(false)} reloadData={() => setReloadData(true)} id={editEmployeeAttendanceId} employeeID={id} />}
            {showEmployeeStatusFormDialog && <EmployeeStatusEntryDialog showDialog={showEmployeeStatusFormDialog} closeDialog={() => setShowEmployeeStatusFormDialog(false)} reloadData={() => setReloadData(true)} id={editEmployeeStatusID} employeeID={id} />}
            {showEmployeeLocationFormDialog && <EmployeeWorkingLocationEntryDialog showDialog={showEmployeeLocationFormDialog} closeDialog={() => setShowEmployeeLocationFormDialog(false)} reloadData={() => setReloadData(true)} id={editEmployeeLocationID} employeeID={id} />}
            {showEmployeeDepartmentFormDialog && <EmployeeDepartmentEntryDialog showDialog={showEmployeeDepartmentFormDialog} closeDialog={() => setShowEmployeeDepartmentFormDialog(false)} reloadData={() => setReloadData(true)} employeeID={id} id={editEmployeeDepartmentId} />}
            {showEmployeeDesignationFormDialog && <EmployeeDesignationEntryDialog showDialog={showEmployeeDesignationFormDialog} closeDialog={() => setShowEmployeeDesignationFormDialog(false)} reloadData={() => setReloadData(true)} employeeID={id} id={editEmployeeDesignationID} />}
            {showEmployeeSalaryGroupFormDialog && <EmployeeSalaryDetailEntryDialog showDialog={showEmployeeSalaryGroupFormDialog} closeDialog={() => setShowEmployeeSalaryGroupFormDialog(false)} reloadData={() => setReloadData(true)} id={editEmployeeSalaryGroupID} employeeID={id} />}
            {showEmployeeLeavePlanDialog && <LeavePlanViewDetail showDialog={showEmployeeLeavePlanDialog} closeDialog={() => setShowEmployeeLeavePlanDialog(false)} reloadData={() => setReloadData(true)} id={editEmployeeLeavePlanID} employeeID={id} />}
            {showEmployeeSuperiorEmployeeDialog && <EmployeeSuperiorEntryDialog showDialog={showEmployeeSuperiorEmployeeDialog} closeDialog={() => setShowEmployeeSuperiorEmployeeDialog(false)} reloadData={() => setReloadData(true)} id={editEmployeeSuperiorID} employeeID={id} />}

            {
                showPayrollHistory &&
                <div className='custom-tableheight'>
                    <div ref={customTableViewRef} className='custom-tableview'>
                        <div className='custom-tableview-scroll'>
                            <EmployeePayrollHistory employeeID={id} />
                        </div>
                    </div>
                </div>
            }
            {
                showAttendanceHistory &&
                <div className='custom-tableheight'>
                    <div ref={customTableViewRef} className='custom-tableview'>
                        <div className='custom-tableview-scroll'>
                            <EmployeeAttendanceHistory employeeID={id} />
                        </div>
                    </div>
                </div>
            }
            {
                showStatusHistory &&
                <div className='custom-tableheight'>
                    <div ref={customTableViewRef} className='custom-tableview'>
                        <div className='custom-tableview-scroll'>
                            <EmployeeStatusHistory employeeID={id} />
                        </div>
                    </div>
                </div>
            }
            {
                showLocationHistory &&
                <div className='custom-tableheight'>
                    <div ref={customTableViewRef} className='custom-tableview'>
                        <div className='custom-tableview-scroll'>
                            <EmployeeLocationHistory employeeID={id} />
                        </div>
                    </div>
                </div>
            }
            {
                showDepartmentHistory &&
                <div className='custom-tableheight'>
                    <div ref={customTableViewRef} className='custom-tableview'>
                        <div className='custom-tableview-scroll'>
                            <EmployeeDepartmentHistory employeeID={id} />
                        </div>
                    </div>
                </div>
            }
            {
                showDesignationHistory &&
                <div className='custom-tableheight'>
                    <div ref={customTableViewRef} className='custom-tableview'>
                        <div className='custom-tableview-scroll'>
                            <EmployeeDesignationHistory employeeID={id} />
                        </div>
                    </div>
                </div>
            }
            {
                showLeavePlanHistory &&
                <div className='custom-tableheight'>
                    <div ref={customTableViewRef} className='custom-tableview'>
                        <div className='custom-tableview-scroll'>
                            <EmployeeLeavePlanHistory employeeID={id} />
                        </div>
                    </div>
                </div>
            }
            {
                showSalaryHistory &&
                <div className='custom-tableheight' >
                    <div ref={customTableViewRef} className='custom-tableview' style={{ width: "70vw" }}>
                        <div className='custom-tableview-scroll'>
                            <EmployeeSalaryHistory employeeID={id} />
                        </div>
                    </div>
                </div>
            }
            {
                showSuperiorEmployeeHistory &&
                <div className='custom-tableheight'>
                    <div ref={customTableViewRef} className='custom-tableview'>
                        <div className='custom-tableview-scroll'>
                            <EmployeeSuperiorHistory employeeID={id} />
                        </div>
                    </div>
                </div>
            }
        </div >


    );
}

export default EmployeeViewDetails;