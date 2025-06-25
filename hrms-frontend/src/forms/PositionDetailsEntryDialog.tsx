import { Drawer } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from '../common/DataTypes';
import { InitialData } from './InitialData';
import toast from 'react-hot-toast';
import { getDataFromAPI, getLoginCompanyID } from '../common/Utilities';
import { useAppStateAPI } from '../common/AppStateAPI';
import { API, EmployeeStatus, Gender, MaritalStatus, PaymentMode, ProjectStrings } from '../common/Constants';
import { ServerAPI } from '../common/ServerAPI';
import * as Yup from 'yup';
import { PageMappings } from '../common/PageMappings';
import { useNavigate } from 'react-router';

const PositionDetailsEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, reloadData: any, id?: number, }> = ({ showDialog, closeDialog, reloadData, id }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.Employee>(InitialData.Employee);
    const [editMode, setEditMode] = useState(false);
    // const [clientOption, setClientOption] = useState<FormDataTypes.SelectOption[]>([]);
    const [attendancePolicyOptions, setAttendancePolicyOptions] = useState<FormDataTypes.SelectOption[]>([]);
    const [payrollGroupOptions, setPayrollGroupOptions] = useState<FormDataTypes.SelectOption[]>([]);
    const [formDataSet, setFormDataSet] = useState(false);
    const [partnerOptions, setPartnerOptions] = useState<FormDataTypes.SelectOption[]>([]);
    const [bankOption, setBankOption] = useState<FormDataTypes.SelectOption[]>([]);

    const contractOptions = [{ label: "Yes", value: "1" }, { label: "No", value: "0" }];
    const clientOptions = [{ label: "Yes", value: "1" }, { label: "No", value: "0" }];
    const noticePeriodOptions = [{ label: "Yes", value: "1" }, { label: "No", value: "0" }];
    const paymodeOptions = [
        { label: "Bank Transfer", value: PaymentMode.BankTransfer + "" },
        { label: "Cheque", value: PaymentMode.Cheque + "" },
        { label: "Cash", value: PaymentMode.Cash + "" },
    ]

    useEffect(() => {
        // getDataFromAPI(API.EndPoint.CLIENT_LIST, setClientOption, addProcessingRequests, reduceProcessingRequests, null, true, 'client_id', 'client_name', 'clients');
        getDataFromAPI(API.EndPoint.ATTENDANCE_POLICY, setAttendancePolicyOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'attendance_policy_id', 'attendance_policy_name', 'attendance_policies');
        getDataFromAPI(API.EndPoint.PAYROLL_GROUP, setPayrollGroupOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'payroll_group_id', 'payroll_group_name', 'payroll_groups');
        getDataFromAPI(API.EndPoint.PARTNER_LIST, setPartnerOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'partner_id', 'partner_name', 'partners');
        getDataFromAPI(API.EndPoint.BANK_LIST, setBankOption, addProcessingRequests, reduceProcessingRequests, null, true, 'bank_id', 'bank_name', 'banks_details');
        setFormDataSet(true);
    }, []);


    useEffect(() => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getEmployeeDetails(id).then(response => {
                if (response.data && response.data.employee) {
                    const employeeData = response.data.employee;
                    setInitialValue(employeeData);
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
        employee_payroll_group_id: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
        employee_leave_plans_id: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
        employee_attendance_policy_id: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
        employee_address_country_id: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
        employee_contract_partner_id: Yup.number().when('employee_is_contract', {
            is: (val: string) => val === "1",
            then: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired) as any
        }),
        employee_client_partner_id: Yup.number().when('employee_working_for_client', {
            is: (val: string) => val === "1",
            then: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired) as any
        })
    });

    return (
        < >
            <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-max">

                {formDataSet && (
                    <Formik enableReinitialize={true} validateOnChange={false} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                        let submitValues: any = { ...values };
                        submitValues['employee_is_contract'] = parseInt(submitValues['employee_is_contract']);
                        submitValues['employee_working_for_client'] = parseInt(submitValues['employee_working_for_client']);
                        submitValues['employee_salary_payment_mode'] = parseInt(submitValues['employee_salary_payment_mode']);
                        submitValues['employee_status_id'] = parseInt(submitValues['employee_status_id']);
                        submitValues['employee_expected_date_of_leaving'] = '2023-03-03';
                        //submitValues['employee_photo'] === '123.png';
                        submitValues['employee_date_of_confirmation'] = '2000-02-02';
                        submitValues['employee_date_of_reliving'] = '2024-09-09';
                        submitValues['employee_bank_identification_number'] = '134';
                        //submitValues['employee_blood_group'] === 'o';
                        //submitValues['employee_photo_filename'] === 'png';
                        delete submitValues['employee_address_country_id'];

                        console.log(submitValues, "Submit value")
                        console.log(initialValue, "initial value")

                        addProcessingRequests();
                        submitValues['company_id'] = getLoginCompanyID();
                        ServerAPI.addEmployee(submitValues).then(response => {
                            if (response && response['message']) {
                                toast.success(response['message']);
                                reloadData();
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
                                        <p className="detailed-heading mt-3">Edit Position Details</p>
                                        <div className="custom-border-grey my-2"></div>
                                        <Form className=' '>
                                            <div className="px-2 form-field-container">
                                                <div className='professional-details'>
                                                    <div className='employee-personal-detail-form'>
                                                        <div className="tabdetails">
                                                            <Form className=' '>
                                                                <div className="px-2 form-field-container">
                                                                    <div className='personal-detail-grid'>
                                                                        <div className='personal-detail-field radio-section'>
                                                                            <div className="row py-3">
                                                                                <div className="text-field-empty-custom-user">
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "employee is contract", name: "employee_is_contract", options: contractOptions, required: true }} />
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
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "Employee working for client", name: "employee_working_for_client", options: clientOptions, required: true }} />
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
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: " bank name  ", name: "bank_id", placeholder: "select bank name", options: bankOption, required: true }} />
                                                                            </div>
                                                                        </div>

                                                                        <div className="row py-3  personal-detail-field">
                                                                            <div className="text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: " branch name", name: "employee_bank_account_bank_branch", placeholder: "enter bank branch name", required: true }} />
                                                                            </div>
                                                                        </div>

                                                                        <div className="row py-3  personal-detail-field">
                                                                            <div className="text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "account name", name: "employee_bank_account_name", placeholder: "enter account  name", required: true }} />
                                                                            </div>
                                                                        </div>

                                                                        <div className="row py-3  personal-detail-field">
                                                                            <div className="text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "account number", name: "employee_bank_account_number", placeholder: "enter account number", required: true }} />
                                                                            </div>
                                                                        </div>

                                                                        <div className="row py-3  personal-detail-field">
                                                                            <div className="text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "in notice period", name: "employee_in_notice_period", options: noticePeriodOptions, required: true }} />
                                                                            </div>
                                                                        </div>

                                                                        <div className="row py-3  personal-detail-field">
                                                                            <div className="text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "payment mode", name: "employee_salary_payment_mode", placeholder: "select payment mode", required: true, options: paymodeOptions }} />
                                                                            </div>
                                                                        </div>

                                                                        {/* <div className="row py-3  personal-detail-field">
                                                                                <div className="text-field-empty-custom-user">
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "pay from account", name: "transmission_type_uuid", placeholder: "select company account", required: true, options: currencyOptions }} />
                                                                                </div>
                                                                            </div> */}

                                                                        <div className="row py-3  personal-detail-field">
                                                                            <div className="text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "attendance policy name", name: "employee_attendance_policy_id", placeholder: "select policy name", required: true, options: attendancePolicyOptions }} />
                                                                            </div>
                                                                        </div>

                                                                        <div className="row py-3  personal-detail-field">
                                                                            <div className="text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "payroll group", name: "employee_payroll_group_id", placeholder: "select payroll group", required: true, options: payrollGroupOptions }} />
                                                                            </div>
                                                                        </div>

                                                                        {/* <div className="row py-3  personal-detail-field">
                                                                                <div className="text-field-empty-custom-user">
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "salary group name", name: "employee_salary_group_id", placeholder: "select salary group", required: true, options: salaryGroupOptions }} />
                                                                                </div>
                                                                            </div> */}
                                                                    </div>


                                                                </div>
                                                                <div className="row btn-form-submit">
                                                                    <button type="button" className="button2" disabled={formikProps.isSubmitting} onClick={() => {
                                                                        formikProps.submitForm();
                                                                        if (!formikProps.isValid) {
                                                                            toast.error("Please ensure all fields are Filled and Valid!");
                                                                        }
                                                                    }}>Save & Next</button>
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

export default PositionDetailsEntryDialog;