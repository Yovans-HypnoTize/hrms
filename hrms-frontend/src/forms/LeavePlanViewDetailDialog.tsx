import { Drawer } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from '../common/DataTypes';
import { InitialData } from './InitialData';
import { API, ProjectStrings } from '../common/Constants';
import { getDataFromAPI, } from '../common/Utilities';
import { useAppStateAPI } from '../common/AppStateAPI';
import toast from 'react-hot-toast';
import { ServerAPI } from '../common/ServerAPI';

const LeavePlanViewDetail: React.FC<{ showDialog: boolean, closeDialog: () => void, employeeID: number, id?: number, reloadData: any, }> = ({ showDialog, closeDialog, reloadData, employeeID, id }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.EmployeeLeavePlan>(InitialData.EmployeeLeavePlan);
    const [leavePlanOption, setLeavePlanOption] = useState<FormDataTypes.SelectOption[]>([]);
    const [formDataSet, setFormDataSet] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getEmployeeLeavePlan(id).then(response => {
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
        getDataFromAPI(API.EndPoint.LEAVE_PLAN, setLeavePlanOption, addProcessingRequests, reduceProcessingRequests, null, true, 'leave_plan_id', 'leave_plan_name', 'leave_plans');
        setFormDataSet(true);
    }, []);

    const yupSchema = Yup.object().shape({
        employee_leave_plan_effective_from: Yup.string().required(ProjectStrings.ValidationRequired),
        leave_plan_id: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
    });

    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min">
            {formDataSet && (
                <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                    let submitValues: any = { ...values };
                    submitValues['employee_id'] = employeeID;
                    if (id) {
                        addProcessingRequests();
                        ServerAPI.updateEmployeeLeavePlan(submitValues, id).then(response => {
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
                        ServerAPI.addEmployeeLeavePlan(submitValues).then(response => {
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
                                <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} Leave Plan</p>
                                <div className="custom-border-grey my-2"></div>
                                <Form className='pl-2 pr-2'>
                                    <div className="px-2 form-field-container">
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Leave Plan Name", name: "leave_plan_id", placeholder: "Select Leave Plan Name", required: true, options: leavePlanOption }} />
                                            </div>
                                        </div>
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "datepicker", label: "Effective Date From", name: "employee_leave_plan_effective_from", placeholder: "Select Date", required: true }} />
                                            </div>
                                        </div>
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

export default LeavePlanViewDetail;

