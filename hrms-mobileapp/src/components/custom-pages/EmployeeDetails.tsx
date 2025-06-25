import React, { useEffect, useRef, useState } from "react";
import { ServerAPI } from "../../common/ServerAPI";
import { useAppStateAPI } from "../../common/AppStateAPI";
import { APIData } from "../../common/DataTypes";

import { getFormattedLocalDate, getObjectKeyByValue } from "../../common/Utilities";
import { API, EmployeeLeftType, EmployeeStatus, Gender, MaritalStatus, PaymentMode } from "../../common/Constants";


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
    const [employeeClientPartner, setEmployeeClientPartner] = useState<APIData.Clients | null>(null);
    const [employeeContractPartner, setEmployeeContractPartner] = useState<APIData.Partner | null>(null);
    const [employeeBank, setEmployeeBank] = useState<APIData.EmployeeBankDetail | null>(null);
    const [employeeCompanyLocation, setEmployeeCompanyLocation] = useState<APIData.CompanyLocation | null>(null);
    const [employeeSalary, setEmployeeSalary] = useState<APIData.EmployeeSalaryDetail | null>(null);
    const [employeeDesignation, setEmployeeDesignation] = useState<APIData.EmployeeDesignationDetail | null>(null);
    const [employeeDepartment, setEmployeeDepartment] = useState<APIData.EmployeeDepartmentDetail | null>(null);
    const [employeeStatus, setEmployeeStatus] = useState<APIData.EmployeeStatusDetail | null>(null);
    const [employeeSuperior, setEmployeeSuperior] = useState<APIData.EmployeeSuperiorEmployeeDetail | null>(null);
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
            ServerAPI.getEmployeeDetails().then(response => {
                if (response.data) {
                    const empData = response.data.employee;
                    const empCompany = response.data.company;
                    const empClientPartner = response.data.employee_client_partner;
                    const empContractPartner = response.data.employee_contract_partner;
                    const empBank = response.data.employee_bank;
                    const empCompanyLocation = response.data.company_location;
                    const empSalary = response.data.employee_salary;
                    const empDesignation = response.data.employee_designation;
                    const empDepartment = response.data.employee_department;
                    const empStatus = response.data.employee_status;
                    const superiorEmployee = response.data.employee_superior;
                    setEmployeeCompanyLocation(empCompanyLocation);
                    setEmployeeSalary(empSalary);
                    setEmployeeDesignation(empDesignation);
                    setEmployeeDepartment(empDepartment);
                    setEmployeeStatus(empStatus);
                    setEmployeeSuperior(superiorEmployee);
                    setEmployeeDetails(empData);
                    setEmployeeCompany(empCompany);
                    setEmployeeClientPartner(empClientPartner);
                    setEmployeeContractPartner(empContractPartner);
                    setEmployeeBank(empBank);
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
        <div className="personal-view-details" style={{ width: "100%" }}>
            {!!employeeDetails && <div className='my-3'>
                <div className='form-box p-2'>
                    <div className="view-details-content-edit-button">
                        <div className="personal-view-details-heading">Personal Details</div>
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
                                    style={{ backgroundColor: "white" }}
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
                    </div>
                    <div className='personal-detail-grid'>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">Company Name</label>
                                <br />
                                <span className="view-details-value">{employeeCompany?.company_name}
                                </span>
                            </div>
                        </div>
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
                    </div>
                </div>

                <div className='form-box p-2'>
                    <div className="personal-view-details-heading mb-1">position history</div>
                    <div className='personal-detail-grid'>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">employee status</label>
                                <br />
                                <span className="view-details-value">{!!employeeStatus ? getObjectKeyByValue(EmployeeStatus, employeeStatus.employee_status) : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">working location</label>
                                <br />
                                <span className="view-details-value">{!!employeeCompanyLocation ? employeeCompanyLocation.company_location_name : "N/A"}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">department</label>
                                <br />
                                <span className="view-details-value">{!!employeeDepartment ? employeeDepartment.department_name : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">designation</label>
                                <br />
                                <span className="view-details-value">{!!employeeDesignation ? employeeDesignation.designation_name : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">superior employee</label>
                                <br />
                                <span className="view-details-value">{employeeSuperior && employeeSuperior.employee_superior_first_name ? employeeSuperior.employee_superior_first_name : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">monthly basic pay</label>
                                <br />
                                <span className="view-details-value">{!!employeeSalary ? employeeSalary.employee_salary_basic_pay : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="row py-3 personal-detail-field">
                            <div className="  text-field-empty-custom-user">
                                <label htmlFor="employee_first_name" className="view-details-label">annual ctc</label>
                                <br />
                                <span className="view-details-value">{!!employeeSalary && employeeSalary.employee_salary_ctc > 0 ? employeeSalary.employee_salary_ctc : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </div >


    );
}

export default EmployeeViewDetails;