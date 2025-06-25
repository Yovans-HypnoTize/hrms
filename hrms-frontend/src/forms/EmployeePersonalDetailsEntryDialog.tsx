import { Drawer } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from '../common/DataTypes';
import toast from 'react-hot-toast';
import { getDataFromAPI, getLoginCompanyID } from '../common/Utilities';
import { useAppStateAPI } from '../common/AppStateAPI';
import { API, Gender, MaritalStatus, PayrollCalculateperDaySalary, ProjectStrings } from '../common/Constants';
import { ServerAPI } from '../common/ServerAPI';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';

const EmployeePersonalDetailsEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, reloadData: any, id?: number, }> = ({ showDialog, closeDialog, reloadData, id }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.EmployeeEdit>();
    const [editMode, setEditMode] = useState(false);
    // const [clientOption, setClientOption] = useState<FormDataTypes.SelectOption[]>([]);
    const [countryOptions, setCountryOptions] = useState<FormDataTypes.SelectOption[]>([]);
    const [stateOptions, setStateOptions] = useState<FormDataTypes.SelectOption[]>([]);
    const [formDataSet, setFormDataSet] = useState(false);
    const navigate = useNavigate();
    const [leavePlanOption, setleavePlanOption] = useState<FormDataTypes.SelectOption[]>([]);
    const [selectedCountryID, setSelectedCountryID] = useState(0);
    const [showPhilTextField, setShowPhilTextField] = useState(false);
    const [employeePhoto, setEmployeePhoto] = useState('');
    const [selectedPayrollGroupID, setSelectedPayrollGroupID] = useState(0);
    const [payrollGroups, setPayrollGroups] = useState<APIData.PayrollGroup[]>([]);
    console.log(selectedPayrollGroupID, "payroll group id")

    useEffect(() => {
        if (selectedPayrollGroupID && selectedPayrollGroupID !== 0) {
            addProcessingRequests();
            ServerAPI.getFilteredPayrollGroups(selectedPayrollGroupID, PayrollCalculateperDaySalary.AsDefinedInEmployee).then(response => {
                if (response.payroll_groups !== undefined) {
                    setPayrollGroups(response.payroll_groups)
                }
            }).finally(() => {
                reduceProcessingRequests();
                setFormDataSet(true);
            });
        } else {
            setFormDataSet(true);
        }
    }, [selectedPayrollGroupID]);


    useEffect(() => {
        if (getLoginCompanyID()) {
            addProcessingRequests();
            ServerAPI.getCompanyDetail(getLoginCompanyID()).then(response => {
                if (response) {
                    const countryName = response.country_name;
                    if (countryName === "Philippines") {
                        setShowPhilTextField(true);
                    } else {
                        setShowPhilTextField(false);
                    }
                }
            }).finally(() => {
                reduceProcessingRequests();
                setFormDataSet(true);
            });
        } else {
            setFormDataSet(true);
        }
    }, [getLoginCompanyID()])

    useEffect(() => {
        if (selectedCountryID) {
            let params: { [k: string]: any } = {};
            params['country_id'] = selectedCountryID;
            getDataFromAPI(API.EndPoint.STATE_LIST, setStateOptions, addProcessingRequests, reduceProcessingRequests, params, true, 'state_id', 'state_name', 'states');
        } else {
            setStateOptions([]);
        }

    }, [selectedCountryID])

    const genderOptions = [
        { label: "Male", value: Gender.Male + "" },
        { label: "Female", value: Gender.Female + "" },
        { label: "Transgender", value: Gender.Transgender + "" },
    ];
    const maritalStatusOptions = [{ label: "Single", value: MaritalStatus.Single + "" }, { label: "Married", value: MaritalStatus.Married + "" }, { label: "Widowed", value: MaritalStatus.Widowed + "" }, { label: "Divorsed", value: MaritalStatus.Widowed + "" },];
    // const currencyOptions = [
    //     { label: "PHP", value: "Philippine" },
    //     { label: "INR", value: "india" },
    // ];
    const loginOptions = [{ label: "Yes", value: "1" }, { label: "No", value: "0" }];
    const bloodGroupOptions = [
        { label: "A+", value: "A+" },
        { label: "A-", value: "A-" },
        { label: "B+", value: "B+" },
        { label: "B-", value: "B-" },
        { label: "O+", value: "O+" },
        { label: "O-", value: "O-" },
        { label: "AB+", value: "AB+" },
        { label: "AB-", value: "AB-" },
    ]

    useEffect(() => {
        // getDataFromAPI(API.EndPoint.CLIENT_LIST, setClientOption, addProcessingRequests, reduceProcessingRequests, null, true, 'client_id', 'client_name', 'clients');
        getDataFromAPI(API.EndPoint.COUNTRY_LIST, setCountryOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'country_id', 'country_name', 'countries');
        getDataFromAPI(API.EndPoint.LEAVE_PLAN, setleavePlanOption, addProcessingRequests, reduceProcessingRequests, null, true, 'leave_plan_id', 'leave_plan_name', 'leave_plans');
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
                    setSelectedPayrollGroupID(response.data.employee_payroll_group.payroll_group_id);
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
        employee_first_name: Yup.string().required(ProjectStrings.ValidationRequired),
        employee_last_name: Yup.string().required(ProjectStrings.ValidationRequired),
        employee_mobile: Yup.string()
            .matches(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid number.", excludeEmptyString: false })
            .required(ProjectStrings.ValidationRequired),
        employee_code: Yup.string().required(ProjectStrings.ValidationRequired),
        employee_address_postal_code: Yup.string().required(ProjectStrings.ValidationRequired),
        employee_tax_identification_number: Yup.string().required(ProjectStrings.ValidationRequired),
        employee_emergency_contact_number: Yup.string().required(ProjectStrings.ValidationRequired),
        employee_emergency_contact_name: Yup.string().required(ProjectStrings.ValidationRequired),
        employee_dob: Yup.string().required(ProjectStrings.ValidationRequired),
        employee_gender: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
        employee_email: Yup.string().matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, { message: "Please enter valid Email.", excludeEmptyString: false }).required(ProjectStrings.ValidationRequired),
    });


    return (
        < >
            <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-max">

                {formDataSet && initialValue && (
                    <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                        let submitValues: any = { ...values };
                        submitValues['employee_gender'] = parseInt(submitValues['employee_gender']);
                        submitValues['employee_marital_status'] = parseInt(submitValues['employee_marital_status']);
                        submitValues['employee_philip_philhealth_number'] = submitValues['employee_philip_philhealth_number'] + "";
                        submitValues['employee_philip_pag_Ibig_number'] = submitValues['employee_philip_pag_Ibig_number'] + "";
                        submitValues['employee_philip_sss_number'] = submitValues['employee_philip_sss_number'] + "";
                        submitValues['employee_mobile'] = submitValues['employee_mobile'] + "";
                        submitValues['employee_emergency_contact_number'] = submitValues['employee_emergency_contact_number'] + "";
                        submitValues['employee_tax_identification_number'] = submitValues['employee_tax_identification_number'].toString();
                        submitValues['employee_address_postal_code'] = submitValues['employee_address_postal_code'].toString();
                        submitValues['employee_photo_filename'] = employeePhoto;
                        delete submitValues['employee_address_country_id'];

                        console.log(submitValues, "Submit value")
                        console.log(initialValue, "initial value")

                        // if (payrollGroups.length > 0) {
                        //     if (payrollGroups[0].payroll_group_calc_per_day_salary_by === PayrollCalculateperDaySalary.AsDefinedInEmployee) {
                        //         if (!submitValues['employee_month_salary_days'] || submitValues['employee_month_salary_days'] > 31) {
                        //             toast.error("Employee Month Salary Days Should be Greater than 0 and Less than 31")
                        //             setSubmitting(false);
                        //             return
                        //         }
                        //     }
                        // }

                        if (showPhilTextField) {
                            if (!submitValues['employee_philip_sss_number']) {
                                toast.error("Employee SSS Number Required")
                                setSubmitting(false);
                                return
                            }
                            if (!submitValues['employee_philip_pag_Ibig_number']) {
                                toast.error("Employee Ibig Required")
                                setSubmitting(false);
                                return
                            }
                            if (!submitValues['employee_philip_philhealth_number']) {
                                toast.error("Employee Philheath Required")
                                setSubmitting(false);
                                return
                            }
                        } else {
                            submitValues['employee_philip_philhealth_number'] = null;
                            submitValues['employee_philip_pag_Ibig_number'] = null;
                            submitValues['employee_philip_sss_number'] = null;
                        }

                        // if (submitValues['employee_philip_philhealth_number'].toString() === '') {
                        // }
                        // if (submitValues['employee_philip_pag_Ibig_number'].toString() === '') {
                        // }
                        // if (submitValues['employee_philip_sss_number'].toString() === '') {
                        // }


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
                            if (formikProps.values.employee_address_country_id && formikProps.values.employee_address_country_id !== selectedCountryID) {
                                setSelectedCountryID(parseInt(formikProps.values.employee_address_country_id + ""));
                                console.log('country_id', formikProps.values.employee_address_country_id);
                            } else if (
                                formikProps.values.employee_photo &&
                                formikProps.values.employee_photo !== employeePhoto
                            ) {
                                const fileExtension = formikProps.values.employee_photo.split('.').pop();
                                if (fileExtension) {
                                    setEmployeePhoto(fileExtension);
                                    console.log(fileExtension, "photo");
                                }
                            }
                            //  else if (formikProps.values.payroll_group_id && formikProps.values.payroll_group_id !== selectedPayrollGroupID) {
                            //     setSelectedPayrollGroupID(parseInt(formikProps.values.payroll_group_id + ""));
                            // }
                            return (
                                <div className='employee-personal-detail-form'>
                                    <div className="tabdetails">
                                        <p className="detailed-heading mt-3">Edit Personal Details</p>
                                        <div className="custom-border-grey my-2"></div>

                                        <Form className=' '>
                                            <div className="px-2 form-field-container">
                                                <div className='personal-details'>
                                                    <div className='personal-detail-grid'>
                                                        <div className="row py-3 personal-detail-field">
                                                            <div className="  text-field-empty-custom-user">
                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "First Name", name: "employee_first_name", placeholder: "Enter First Name", required: true }} />
                                                            </div>
                                                        </div>

                                                        <div className="row py-3 personal-detail-field">
                                                            <div className="  text-field-empty-custom-user">
                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Middle Name", name: "employee_middle_name", placeholder: "Enter Middle Name" }} />
                                                            </div>
                                                        </div>

                                                        <div className="row py-3 personal-detail-field">
                                                            <div className="  text-field-empty-custom-user">
                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Last Name", name: "employee_last_name", placeholder: "Enter Last Name", required: true }} />
                                                            </div>
                                                        </div>

                                                        <div className="row py-3  personal-detail-field">
                                                            <div className="text-field-empty-custom-user">
                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Employee Code", name: "employee_code", placeholder: "Enter Employee Code", required: true }} />
                                                            </div>
                                                        </div>

                                                        <div className="row py-3  personal-detail-field">
                                                            <div className="text-field-empty-custom-user">
                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "Mobile Number", name: "employee_mobile", placeholder: "Enter Mobile Number", required: true }} />
                                                            </div>
                                                        </div>

                                                        <div className="row py-3  personal-detail-field">
                                                            <div className="text-field-empty-custom-user">
                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Official Email", name: "employee_email", placeholder: "Enter Email", required: true }} />
                                                            </div>
                                                        </div>

                                                        <div className="row py-3  personal-detail-field">
                                                            <div className="text-field-empty-custom-user">
                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Gender", name: "employee_gender", placeholder: "Select Gender", required: true, options: genderOptions }} />
                                                            </div>
                                                        </div>

                                                        <div className="row py-3  personal-detail-field">
                                                            <div className="text-field-empty-custom-user">
                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "datepicker", label: "Date Of Birth", name: "employee_dob", placeholder: "Select Date Of Birth", required: true }} />
                                                            </div>
                                                        </div>

                                                        <div className="row py-3  personal-detail-field">
                                                            <div className="text-field-empty-custom-user">
                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Maritial Status", name: "employee_marital_status", placeholder: "Select Maritial Status", options: maritalStatusOptions }} />
                                                            </div>
                                                        </div>
                                                        <div className="row py-3  personal-detail-field">
                                                            <div className="text-field-empty-custom-user">
                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "fileupload", name: "employee_photo", label: "Employee Photo", accept: "image/*", required: true }} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* <div><hr /></div>
                                                        <div className='permanant-address'>
                                                            <div className='permanant-address-heading'>permanent address</div>
                                                            <div className='personal-detail-grid'>
                                                                <div className="row py-3 personal-detail-field">
                                                                    <div className="  text-field-empty-custom-user">
                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Address Line 1", name: "employee_address_line1", placeholder: "enter Company Address", required: true }} />
                                                                    </div>
                                                                </div>

                                                                <div className="row py-3 personal-detail-field">
                                                                    <div className="  text-field-empty-custom-user">
                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Address Line 2", name: "employee_address_line2", placeholder: "enter Company Address", required: true }} />
                                                                    </div>
                                                                </div>

                                                                <div className="row py-3 personal-detail-field">
                                                                    <div className="  text-field-empty-custom-user">
                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: " city", name: "employee_address_city", placeholder: "enter city", required: true }} />
                                                                    </div>
                                                                </div>

                                                                <div className="row py-3  personal-detail-field">
                                                                    <div className="text-field-empty-custom-user">
                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Country", name: "transmission_type_uuid", placeholder: "Select country", required: true, options: countryOptions }} />
                                                                    </div>
                                                                </div>

                                                                <div className="row py-3  personal-detail-field">
                                                                    <div className="text-field-empty-custom-user">
                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "State", name: "company_address_postal_code", placeholder: "select state", required: true, options: stateOptions }} />
                                                                    </div>
                                                                </div>

                                                                <div className="row py-3  personal-detail-field">
                                                                    <div className="text-field-empty-custom-user">
                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "  Zip / Postcode", name: "employee_address_postal_code", placeholder: "Enter postcode", required: true }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> */}

                                                    <div><hr /></div>
                                                    <div className='permanant-address'>
                                                        <div className='permanant-address-heading'>Address</div>
                                                        <div className='personal-detail-grid'>
                                                            <div className="row py-3 personal-detail-field">
                                                                <div className="  text-field-empty-custom-user">
                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Address Line 1", name: "employee_address_line1", placeholder: "Enter Address Line 1" }} />
                                                                </div>
                                                            </div>

                                                            <div className="row py-3 personal-detail-field">
                                                                <div className="  text-field-empty-custom-user">
                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Address Line 2", name: "employee_address_line2", placeholder: "Enter Address Line 2" }} />
                                                                </div>
                                                            </div>

                                                            <div className="row py-3 personal-detail-field">
                                                                <div className="  text-field-empty-custom-user">
                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "City", name: "employee_address_city", placeholder: "Enter City" }} />
                                                                </div>
                                                            </div>

                                                            <div className="row py-3  personal-detail-field">
                                                                <div className="text-field-empty-custom-user">
                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Country", name: "employee_address_country_id", placeholder: "Select Country", options: countryOptions }} />
                                                                </div>
                                                            </div>

                                                            <div className="row py-3  personal-detail-field">
                                                                <div className="text-field-empty-custom-user">
                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "State", name: "employee_address_state_id", placeholder: "Select State", options: stateOptions }} />
                                                                </div>
                                                            </div>

                                                            <div className="row py-3  personal-detail-field">
                                                                <div className="text-field-empty-custom-user">
                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "  Zip / Postcode", name: "employee_address_postal_code", placeholder: "Enter Postcode", required: true }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div><hr /></div>
                                                    <div className='permanant-address'>
                                                        <div className='personal-detail-grid'>
                                                            <div className="row py-3 personal-detail-field">
                                                                <div className="  text-field-empty-custom-user">
                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Blood Group", name: "employee_blood_group", placeholder: "Select Blood Group", options: bloodGroupOptions }} />
                                                                </div>
                                                            </div>

                                                            <div className="row py-3 personal-detail-field">
                                                                <div className="  text-field-empty-custom-user">
                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Father’s Name", name: "employee_father_name", placeholder: "  Enter Father’s Name" }} />
                                                                </div>
                                                            </div>

                                                            <div className="row py-3  personal-detail-field">
                                                                <div className="text-field-empty-custom-user">
                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Mother’s Name", name: "employee_mother_name", placeholder: "  Enter Mother Name" }} />
                                                                </div>
                                                            </div>

                                                            <div className="row py-3  personal-detail-field">
                                                                <div className="text-field-empty-custom-user">
                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Spouse Name", name: "employee_spouse_name", placeholder: "  Enter Spouse Name" }} />
                                                                </div>
                                                            </div>

                                                            <div className="row py-3  personal-detail-field">
                                                                <div className="text-field-empty-custom-user">
                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "Emergency Contact Number", name: "employee_emergency_contact_number", placeholder: "Enter Emergency Contact Number", required: true }} />
                                                                </div>
                                                            </div>
                                                            <div className="row py-3  personal-detail-field">
                                                                <div className="text-field-empty-custom-user">
                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Emergency Contact Name", name: "employee_emergency_contact_name", placeholder: "Enter Emergency Contact Name", required: true }} />
                                                                </div>
                                                            </div>
                                                            <div className="row py-3  personal-detail-field">
                                                                <div className="text-field-empty-custom-user">
                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Tax Identification Number", name: "employee_tax_identification_number", placeholder: "Enter Tax Identification Number", required: true }} />
                                                                </div>
                                                            </div>
                                                            {showPhilTextField && (
                                                                <>
                                                                    <div className="row py-3 personal-detail-field">
                                                                        <div className="text-field-empty-custom-user ">
                                                                            <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Employee SSS Number", name: "employee_philip_sss_number", placeholder: "Enter Employee SSS Number", required: true }} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="row py-3 personal-detail-field">
                                                                        <div className="text-field-empty-custom-user">
                                                                            <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Employee IBIG Number", name: "employee_philip_pag_Ibig_number", placeholder: "Enter Employee IBIG Number", required: true }} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="row py-3 personal-detail-field">
                                                                        <div className="text-field-empty-custom-user">
                                                                            <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Employee Philheath Number", name: "employee_philip_philhealth_number", placeholder: "Enter Employee Philheath Number", required: true }} />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                            {/* {payrollGroups.length > 0 && payrollGroups[0].payroll_group_calc_per_day_salary_by === PayrollCalculateperDaySalary.AsDefinedInEmployee &&
                                                                <div className="row py-3 personal-detail-field">
                                                                    <div className="text-field-empty-custom-user">
                                                                        <FormField
                                                                            formik={formikProps}
                                                                            fieldProps={{
                                                                                fieldType: "textbox",
                                                                                label: "Employee Month Salary Days",
                                                                                name: "employee_month_salary_days",
                                                                                placeholder: "Enter Employee Month Salary Days",
                                                                                required: true
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            } */}
                                                        </div>
                                                    </div>
                                                    <div className="row btn-form-submit">
                                                        <button type="button" className="button1" onClick={() => closeDialog()}>Cancel</button>
                                                        <button type="button" className="button2" disabled={formikProps.isSubmitting} onClick={() => {
                                                            formikProps.submitForm();
                                                            if (!formikProps.isValid) {
                                                                toast.error("Please ensure all fields are Filled and Valid!");
                                                            }
                                                        }}>Save Changes</button>
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

export default EmployeePersonalDetailsEntryDialog;