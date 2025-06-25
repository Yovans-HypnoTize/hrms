import { Drawer } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from '../common/DataTypes';
import { InitialData } from './InitialData';
import { API, EmployeeLeftType, EmployeeStatus, ProjectStrings } from '../common/Constants';
import { getDataFromAPI } from '../common/Utilities';
import { useAppStateAPI } from '../common/AppStateAPI';
import toast from 'react-hot-toast';
import { ServerAPI } from '../common/ServerAPI';

const EmployeeStatusEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, employeeID: number, id?: number, reloadData: any, }> = ({ showDialog, closeDialog, reloadData, employeeID, id }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.EmployeeStatus>(InitialData.EmployeeStatus);
    const [formDataSet, setFormDataSet] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const statusOptions: FormDataTypes.SelectOption[] = [{ label: 'Confirmed', value: EmployeeStatus.Confirmed + "" }, { label: 'Left', value: EmployeeStatus.Left + "" }, { label: 'Probation', value: EmployeeStatus.Probation + "" }];
    const employeeLeftTypeOptions = [
        { label: "Relived", value: EmployeeLeftType.Relived + "" },
        { label: "Terminated", value: EmployeeLeftType.Terminated + "" },
        { label: "Abscond", value: EmployeeLeftType.Abscond + "" },
    ]

    useEffect(() => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getEmployeeStatus(id).then(response => {
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
        setFormDataSet(true);
    }, []);


   
    const yupSchema = Yup.object().shape({
        employee_status: Yup.number().nullable().default(null).required(ProjectStrings.ValidationRequired),
        // employee_status_time: Yup.string().nullable().default(null).required(ProjectStrings.ValidationRequired),
        employee_date_of_confirmation: Yup.string().nullable().default(null).when('employee_status', ([employee_status], schema) => {
            if (employee_status === EmployeeStatus.Probation) {
                return schema.required(ProjectStrings.ValidationRequired);
            }
            return schema;
        }),
        employee_date_of_reliving: Yup.string().nullable().default(null).when('employee_status', ([employee_status], schema) => {
            if (employee_status === EmployeeStatus.Left) {
                return schema.required(ProjectStrings.ValidationRequired);
            }
            return schema;
        }),
        employee_status_left_type: Yup.number().nullable().default(null).when('employee_status', ([employee_status], schema) => {
            if (employee_status === EmployeeStatus.Left) {
                return schema.notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired);
            }
            return schema;
        }),
    });



    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min">
            {formDataSet && (
                <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                    let submitValues: any = { ...values };
                    if (parseInt(submitValues['employee_status']) === EmployeeStatus.Confirmed) {
                        if (!submitValues['employee_date_of_confirmation']) {
                            toast.error("Date Of Confirmation Required")
                            setSubmitting(false);
                            return
                        }
                    }
                    if (submitValues['employee_date_of_confirmation'] === '') {
                        submitValues['employee_date_of_confirmation'] = null;
                    }
                    if (submitValues['employee_date_of_reliving'] === '') {
                        submitValues['employee_date_of_reliving'] = null;
                    }
                    if (submitValues['employee_expected_date_of_leaving'] === '') {
                        submitValues['employee_expected_date_of_leaving'] = null;
                    }
                    if (id) {
                        addProcessingRequests();
                        submitValues['employee_id'] = employeeID;
                        ServerAPI.updateEmployeeStatus(submitValues, id).then(response => {
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
                        submitValues['employee_id'] = employeeID;
                        ServerAPI.addEmployeeStatus(submitValues).then(response => {
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
                        return (
                            <div className="tabdetails">
                                <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} Employee Status</p>
                                <div className="custom-border-grey my-2"></div>
                                <Form className='pl-2 pr-2'>
                                    <div className="px-2 form-field-container">
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Employee Status", name: "employee_status", placeholder: "Select Employee Status", required: true, options: statusOptions }} />
                                            </div>
                                        </div>
                                        {formikProps.values.employee_status == EmployeeStatus.Left && (
                                            <>
                                                <div className="row py-3 ">
                                                    <div className="text-field-empty-custom-user">
                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Employee Left Type", name: "employee_status_left_type", placeholder: "Select Left Type", required: true, options: employeeLeftTypeOptions }} />
                                                    </div>
                                                </div>
                                                <div className="row py-3">
                                                    <div className="text-field-empty-custom-user">
                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "datepicker", label: "Date Of Reliving", name: "employee_date_of_reliving", placeholder: "Select Date Of Reliving", required: true }} />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {formikProps.values.employee_status == EmployeeStatus.Probation && (
                                            <div className="row py-3">
                                                <div className="text-field-empty-custom-user">
                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "datepicker", label: "Date Of Confirmation", name: "employee_date_of_confirmation", placeholder: "Select Date Of Confirmation", required: true }} />
                                                </div>
                                            </div>
                                        )}
                                        {formikProps.values.employee_status == EmployeeStatus.Confirmed && (
                                            <div className="row py-3">
                                                <div className="text-field-empty-custom-user">
                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "datepicker", label: "Date Of Confirmation", name: "employee_date_of_confirmation", placeholder: "Select Date Of Confirmation", required: true }} />
                                                </div>
                                            </div>
                                        )}
                                        {/* <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "datepicker", label: "Effective Date From", name: "employee_status_time", placeholder: "Select Date", required: true }} />
                                            </div>
                                        </div> */}
                                    </div>
                                    <div className="row btn-form-submit">
                                        <button type="button" className="button1" onClick={closeDialog}>Cancel</button>
                                        <button type="button" className="button2" disabled={formikProps.isSubmitting} onClick={() => {
                                            // closeDialog()
                                            formikProps.submitForm();
                                            if (!formikProps.isValid) {
                                                console.log(formikProps.errors, "error")
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

export default EmployeeStatusEntryDialog;

