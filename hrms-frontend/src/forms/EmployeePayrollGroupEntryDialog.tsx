import { Drawer } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from '../common/DataTypes';
import { InitialData } from './InitialData';
import { API, PayrollCalculateperDaySalary, ProjectStrings } from '../common/Constants';
import { getDataFromAPI, getLoginCompanyID } from '../common/Utilities';
import { useAppStateAPI } from '../common/AppStateAPI';
import toast from 'react-hot-toast';
import { ServerAPI } from '../common/ServerAPI';

const EmployeePayrollDetailEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, employeeID: number, id?: number, reloadData: any, }> = ({ showDialog, closeDialog, reloadData, id, employeeID }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.EmployeePayroll>(InitialData.EmployeePayroll);
    const [payrollGroupOption, setPayrollGroupOption] = useState<FormDataTypes.SelectOption[]>([]);
    const [formDataSet, setFormDataSet] = useState(false);
    const [editMode, setEditMode] = useState(false);
    // const [selectedPayrollGroupID, setSelectedPayrollGroupID] = useState(0);
    // const [payrollGroups, setPayrollGroups] = useState<APIData.PayrollGroup[]>([]);

    // useEffect(() => {
    //     if (selectedPayrollGroupID && selectedPayrollGroupID !== 0) {
    //         addProcessingRequests();
    //         ServerAPI.getFilteredPayrollGroups(selectedPayrollGroupID, PayrollCalculateperDaySalary.AsDefinedInEmployee).then(response => {
    //             if (response.payroll_groups !== undefined) {
    //                 setPayrollGroups(response.payroll_groups)
    //             }
    //         }).finally(() => {
    //             reduceProcessingRequests();
    //             setFormDataSet(true);
    //         });
    //     } else {
    //         setFormDataSet(true);
    //     }
    // }, [selectedPayrollGroupID]);


    useEffect(() => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getEmployeePayrollGroup(id).then(response => {
                if (response) {
                    setInitialValue(response);
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

    useEffect(() => {
        getDataFromAPI(API.EndPoint.PAYROLL_GROUP, setPayrollGroupOption, addProcessingRequests, reduceProcessingRequests, null, true, 'payroll_group_id', 'payroll_group_name', 'payroll_groups');
        setFormDataSet(true);
    }, []);

    const yupSchema = Yup.object().shape({
        employee_payroll_group_effective_from: Yup.string().required(ProjectStrings.ValidationRequired),
        payroll_group_id: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
    });

    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min">
            {formDataSet && (
                <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                    let submitValues: any = { ...values };
                    submitValues['employee_id'] = employeeID;
                    if (id) {
                        addProcessingRequests();
                        ServerAPI.updateEmployeePayrollGroup(submitValues, id).then(response => {
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
                    } else {
                        addProcessingRequests();
                        ServerAPI.addEmployeePayrollGroup(submitValues).then(response => {
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
                    }
                }} >
                    {(formikProps) => {
                        // if (formikProps.values.payroll_group_id && formikProps.values.payroll_group_id !== selectedPayrollGroupID) {
                        //     setSelectedPayrollGroupID(parseInt(formikProps.values.payroll_group_id + ""));
                        // }
                        return (
                            <div className="tabdetails">
                                <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} Payroll Group</p>
                                <div className="custom-border-grey my-2"></div>
                                <Form className='pl-2 pr-2'>
                                    <div className="px-2 form-field-container">
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Payroll Group Name", name: "payroll_group_id", placeholder: "Select Payroll Group Name", required: true, options: payrollGroupOption }} />
                                            </div>
                                        </div>
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "datepicker", label: "Effective Date From", name: "employee_payroll_group_effective_from", placeholder: "Select Date", required: true, }} />
                                            </div>
                                        </div>
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
                                    <div className="row btn-form-submit">
                                        <button type="button" className="button1" onClick={closeDialog}>Cancel</button>
                                        <button type="button" className="button2" disabled={formikProps.isSubmitting} onClick={() => {
                                            // closeDialog()
                                            formikProps.submitForm();
                                            if (!formikProps.isValid) {
                                                toast.error("Please ensure all fields are Filled and Valid!");
                                            }
                                        }}>{editMode ? 'Save Changes' : 'Add Now'}</button>
                                    </div>
                                </Form>
                            </div>
                        )
                    }}
                </Formik>
            )}
        </Drawer>
    );
};

export default EmployeePayrollDetailEntryDialog;

