import { Drawer } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from '../common/DataTypes';
import toast from 'react-hot-toast';
import { getDataFromAPI, getLoginCompanyID } from '../common/Utilities';
import { useAppStateAPI } from '../common/AppStateAPI';
import { API, EmployeeStatus, PaymentMode, ProjectStrings } from '../common/Constants';
import { ServerAPI } from '../common/ServerAPI';
import * as Yup from 'yup';

const EmployeeProfessionalDetailsEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, reloadData: any, id?: number, }> = ({ showDialog, closeDialog, reloadData, id }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.EmployeeEdit>();
    const [editMode, setEditMode] = useState(false);
    // const [clientOption, setClientOption] = useState<FormDataTypes.SelectOption[]>([]);
    // const [locationOptions, setLocationOptions] = useState<FormDataTypes.SelectOption[]>([]);
    // const [departmentOptions, setDepartmentOptions] = useState<FormDataTypes.SelectOption[]>([]);
    // const [designationOptions, setDesignationOptions] = useState<FormDataTypes.SelectOption[]>([]);
    const [companyOptions, setCompanyOptions] = useState<FormDataTypes.SelectOption[]>([]);
    const [salaryGroupOptions, setSalaryGroupOptions] = useState<FormDataTypes.SelectOption[]>([]);
    const [formDataSet, setFormDataSet] = useState(false);
    const [selectedCountryID, setSelectedCountryID] = useState(0);
    const [partnerOptions, setPartnerOptions] = useState<FormDataTypes.SelectOption[]>([]);
    const [bankOption, setBankOption] = useState<FormDataTypes.SelectOption[]>([]);

    const employeeStatusOptions = [
        { label: "Probation", value: EmployeeStatus.Probation + "" },
        { label: "Confirmed", value: EmployeeStatus.Confirmed + "" },
        { label: "Left", value: EmployeeStatus.Left + "" },
    ]
    const contractOptions = [{ label: "Yes", value: "1" }, { label: "No", value: "0" }];
    const clientOptions = [{ label: "Yes", value: "1" }, { label: "No", value: "0" }];
    const noticePeriodOptions = [{ label: "Yes", value: "1" }, { label: "No", value: "0" }];
    const paymodeOptions = [
        { label: "Bank Transfer", value: PaymentMode.BankTransfer + "" },
        { label: "Cheque", value: PaymentMode.Cheque + "" },
        { label: "Cash", value: PaymentMode.Cash + "" },
    ]
    const loginOptions = [{ label: "Yes", value: "1" }, { label: "No", value: "0" }];

    useEffect(() => {
        // getDataFromAPI(API.EndPoint.CLIENT_LIST, setClientOption, addProcessingRequests, reduceProcessingRequests, null, true, 'client_id', 'client_name', 'clients');
        // getDataFromAPI(API.EndPoint.COMPANY_LOCATION, setLocationOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'company_location_id', 'company_location_name', 'company_locations');
        // getDataFromAPI(API.EndPoint.CLIENT_DEPARTMENT_LIST, setDepartmentOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'department_id', 'department_name', 'departments');
        // getDataFromAPI(API.EndPoint.CLIENT_DESIGNATION_LIST, setDesignationOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'designation_id', 'designation_name', 'designations');
        //getDataFromAPI(API.EndPoint.EMPLOYEES_LIST, setSuperiorOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'employee_id', 'employee_first_name', 'data', 'employee');
        // getDataFromAPI(API.EndPoint.ATTENDANCE_POLICY, setAttendancePolicyOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'attendance_policy_id', 'attendance_policy_name', 'attendance_policies');
        // getDataFromAPI(API.EndPoint.PAYROLL_GROUP, setPayrollGroupOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'payroll_group_id', 'payroll_group_name', 'payroll_groups');
        getDataFromAPI(API.EndPoint.PARTNER_LIST, setPartnerOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'partner_id', 'partner_name', 'partners');
        getDataFromAPI(API.EndPoint.BANK_LIST, setBankOption, addProcessingRequests, reduceProcessingRequests, null, true, 'bank_id', 'bank_name', 'banks_details');
        getDataFromAPI(API.EndPoint.COMPANY_LIST, setCompanyOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'compnay_id', 'company_name', 'companies');
        getDataFromAPI(API.EndPoint.SALARY_GROUP, setSalaryGroupOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'salary_group_id', 'salary_group_name', 'salary_groups');

        setFormDataSet(true);
    }, []);


    useEffect(() => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getEmployeeDetails(id).then(response => {
                if (response.data && response.data.employee) {
                    const employeeData = response.data.employee;
                    setInitialValue({
                        employee_code: employeeData.employee_code,
                        employee_first_name: employeeData.employee_first_name,
                        employee_middle_name: employeeData.employee_middle_name,
                        employee_last_name: employeeData.employee_last_name,
                        employee_mobile: employeeData.employee_mobile,
                        employee_email: employeeData.employee_email,
                        employee_login_available: employeeData.employee_login_available,
                        employee_login_password: employeeData.employee_login_password,
                        employee_photo: employeeData.employee_photo,
                        employee_photo_filename: employeeData.employee_photo_filename,
                        employee_gender: employeeData.employee_gender,
                        employee_dob: employeeData.employee_dob,
                        employee_address_line1: employeeData.employee_address_line1,
                        employee_address_line2: employeeData.employee_address_line2,
                        employee_address_city: employeeData.employee_address_city,
                        employee_address_postal_code: employeeData.employee_address_postal_code,
                        employee_marital_status: employeeData.employee_marital_status,
                        employee_blood_group: employeeData.employee_blood_group,
                        employee_father_name: employeeData.employee_father_name,
                        employee_mother_name: employeeData.employee_mother_name,
                        employee_spouse_name: employeeData.employee_spouse_name,
                        employee_emergency_contact_name: employeeData.employee_emergency_contact_name,
                        employee_emergency_contact_number: employeeData.employee_emergency_contact_number,
                        employee_doj: employeeData.employee_doj,
                        employee_probation_period: employeeData.employee_probation_period,
                        employee_date_of_confirmation: employeeData.employee_date_of_confirmation,
                        employee_tax_identification_number: employeeData.employee_tax_identification_number,
                        employee_is_contract: employeeData.employee_is_contract,
                        employee_address_country_id: employeeData.employee_address_country_id,
                        employee_address_state_id: employeeData.employee_address_state_id,
                        employee_contract_partner_id: employeeData.employee_contract_partner_id,
                        employee_working_for_client: employeeData.employee_working_for_client,
                        employee_client_partner_id: employeeData.employee_client_partner_id,
                        employee_salary_payment_mode: employeeData.employee_salary_payment_mode,
                        bank_id: employeeData.bank_id,
                        employee_bank_identification_number: employeeData.employee_bank_identification_number,
                        employee_bank_account_bank_branch: employeeData.employee_bank_account_bank_branch,
                        employee_bank_account_number: employeeData.employee_bank_account_number,
                        employee_bank_account_name: employeeData.employee_bank_account_name,
                        employee_salary_source_company_bank_acc_id: employeeData.employee_salary_source_company_bank_acc_id,
                        employee_in_notice_period: employeeData.employee_in_notice_period,
                        employee_expected_date_of_leaving: employeeData.employee_expected_date_of_leaving,
                        employee_date_of_reliving: employeeData.employee_date_of_reliving,
                        company_id: employeeData.company_id,
                        employee_philip_sss_number: employeeData.employee_philip_sss_number,
                        employee_philip_pag_Ibig_number: employeeData.employee_philip_pag_Ibig_number,
                        employee_philip_philhealth_number: employeeData.employee_philip_philhealth_number,
                        employee_month_salary_days: employeeData.employee_month_salary_days,
                    });
                    setFormDataSet(true);
                    setEditMode(true);
                }
            }).finally(() => {
                reduceProcessingRequests();
            });
        } else {
            setFormDataSet(true);
        }
    }, [id]);


    let yupSchema = Yup.object().shape({
        employee_login_available: Yup.number().required(ProjectStrings.ValidationRequired),
        employee_doj: Yup.string().required(ProjectStrings.ValidationRequired),
        employee_login_password: Yup.string().when('employee_login_available', ([employee_login_available], schema) => {
            console.log(employee_login_available)
            if (employee_login_available == 1) {
                return Yup.string().required(ProjectStrings.ValidationRequired);
            }
            return schema.nullable();
        }),
        // employee_expected_date_of_leaving: Yup.string().when('employee_in_notice_period', ([employee_in_notice_period], schema) => {
        //     if (parseInt(employee_in_notice_period) === 1)
        //         return Yup.string().required(ProjectStrings.ValidationRequired);
        //     return schema;
        // }),
    });

    return (
        < >
            <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-max">

                {formDataSet && initialValue && (
                    <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                        let submitValues: any = { ...values };
                        submitValues['employee_superior_id'] = null;
                        submitValues['employee_login_available'] = parseInt(submitValues['employee_login_available']);
                        //submitValues['employee_blood_group'] === 'o';
                        //submitValues['employee_photo_filename'] === 'png';
                        delete submitValues['employee_address_country_id'];

                        if (parseInt(submitValues['employee_is_contract']) === 1) {
                            if (!submitValues['employee_contract_partner_id']) {
                                toast.error("Contract Partner Id Required")
                                setSubmitting(false);
                                return
                            }
                        }
                        if (parseInt(submitValues['employee_working_for_client']) === 1) {
                            if (!submitValues['employee_client_partner_id']) {
                                toast.error("Client Partner Id Required")
                                setSubmitting(false);
                                return
                            }
                        }
                        if (parseInt(submitValues['employee_in_notice_period']) === 1) {
                            if (!submitValues['employee_expected_date_of_leaving']) {
                                toast.error("Expected Leaving Date Required")
                                setSubmitting(false);
                                return
                            }
                        }

                        console.log(submitValues, "Submit value")
                        console.log(initialValue, "initial value")

                        addProcessingRequests();
                        submitValues['company_id'] = getLoginCompanyID();
                        ServerAPI.updateEmployee(submitValues, id).then(response => {
                            if (response && response['message']) {
                                toast.success(response['message']);
                                reloadData();
                                closeDialog();
                            } else if (response && response['message']) {
                                toast.error(response['message']);
                            }
                        }).finally(() => {
                            setSubmitting(false);
                            reduceProcessingRequests();
                        });
                    }} >
                        {(formikProps) => {
                            return (
                                <div className='employee-personal-detail-form'>
                                    <div className="tabdetails">
                                        <p className="detailed-heading mt-3">Edit Professional Details</p>
                                        <div className="custom-border-grey my-2"></div>
                                        <Form className=' '>
                                            <div className="px-2 form-field-container">
                                                <div className='position-history'>
                                                    <div className='employee-personal-detail-form'>
                                                        <div className="tabdetails">
                                                            <Form className=' '>
                                                                <div className="px-2 form-field-container">
                                                                    <div className='personal-detail-grid'>
                                                                        <div className='personal-detail-field radio-section'>
                                                                            <div className="row py-3">
                                                                                <div className="text-field-empty-custom-user">
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "employee is contract", name: "employee_is_contract", options: contractOptions, }} />
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {formikProps.values.employee_is_contract == 1 && (
                                                                            <div className="row py-3 personal-detail-field">
                                                                                <div className="text-field-empty-custom-user">
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "contract partner", name: "employee_contract_partner_id", placeholder: "select partner", required: true, options: partnerOptions }} />
                                                                                </div>
                                                                            </div>
                                                                        )}


                                                                        <div className="personal-detail-field radio-section">
                                                                            <div className="row py-3">
                                                                                <div className="text-field-empty-custom-user">
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "Employee working for client", name: "employee_working_for_client", options: clientOptions, }} />
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {formikProps.values.employee_working_for_client == 1 && (
                                                                            <div className="row py-3 personal-detail-field">
                                                                                <div className="text-field-empty-custom-user">
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Client partner", name: "employee_client_partner_id", placeholder: "Select client", required: true, options: partnerOptions }} />
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        <div className="row py-3 personal-detail-field">
                                                                            <div className="  text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: " bank name  ", name: "bank_id", placeholder: "select bank name", options: bankOption, }} />
                                                                            </div>
                                                                        </div>

                                                                        <div className="row py-3  personal-detail-field">
                                                                            <div className="text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: " branch name", name: "employee_bank_account_bank_branch", placeholder: "enter bank branch name" }} />
                                                                            </div>
                                                                        </div>

                                                                        <div className="row py-3  personal-detail-field">
                                                                            <div className="text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "account name", name: "employee_bank_account_name", placeholder: "enter account  name" }} />
                                                                            </div>
                                                                        </div>

                                                                        <div className="row py-3  personal-detail-field">
                                                                            <div className="text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "account number", name: "employee_bank_account_number", placeholder: "enter account number" }} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row py-3  personal-detail-field">
                                                                            <div className="text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "in notice period", name: "employee_in_notice_period", options: noticePeriodOptions }} />
                                                                            </div>
                                                                        </div>
                                                                        {formikProps.values.employee_in_notice_period == 1 && (
                                                                            <div className="row py-3 personal-detail-field">
                                                                                <div className="text-field-empty-custom-user">
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "datepicker", label: " Expected Date Of Reliving", name: "employee_expected_date_of_leaving", placeholder: "Select Expected Date Of Reliving", required: true, allowFutureDate: true }} />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <div className="row py-3  personal-detail-field">
                                                                            <div className="text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "payment mode", name: "employee_salary_payment_mode", placeholder: "select payment mode", options: paymodeOptions }} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row py-3 personal-detail-field radio-section">
                                                                            <div className="text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "Login available", name: "employee_login_available", options: loginOptions, required: true }} />
                                                                            </div>
                                                                        </div>

                                                                        {parseInt(formikProps.values.employee_login_available + "") === 1 && (
                                                                            <div className="row py-3 personal-detail-field">
                                                                                <div className="text-field-empty-custom-user">
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Login password", name: "employee_login_password", placeholder: "Enter password", required: true }} />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <div className="row py-3  personal-detail-field">
                                                                            <div className="text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "datepicker", label: "date of joining", name: "employee_doj", placeholder: "select date of joining", required: true, allowFutureDate: false }} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row btn-form-submit">
                                                                    <button type="button" className="button1" onClick={() => closeDialog()}>Cancel</button>
                                                                    <button type="button" className="button2" disabled={formikProps.isSubmitting} onClick={() => {
                                                                        formikProps.submitForm();
                                                                        if (!formikProps.isValid) {
                                                                            console.log(formikProps.errors, "formikError")
                                                                            toast.error("Please ensure all fields are Filled and Valid!");
                                                                        }
                                                                    }}>Save Changes</button>
                                                                </div>
                                                            </Form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            )
                        }}
                    </Formik>
                )}
            </Drawer>
        </>
    );
};

export default EmployeeProfessionalDetailsEntryDialog;