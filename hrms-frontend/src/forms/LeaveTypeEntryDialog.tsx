import { Drawer } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from '../common/DataTypes';
import { InitialData } from './InitialData';
import { useAppStateAPI } from '../common/AppStateAPI';
import toast from 'react-hot-toast';
import { ServerAPI } from '../common/ServerAPI';
import { API, Gender, MaritalStatus, ProjectStrings } from '../common/Constants';
import { getDataFromAPI, getLoginCompanyID } from '../common/Utilities';

const LeaveTypeEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, id?: number, reloadData: any, }> = ({ showDialog, closeDialog, id, reloadData }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.LeaveType>(InitialData.LeaveType);
    const [formDataSet, setFormDataSet] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const genderOptions: FormDataTypes.SelectOption[] = [{ label: 'All', value: "0" }, { label: "Male", value: Gender.Male + "" }, { label: "Female", value: Gender.Female + "" }, { label: "Transgender", value: Gender.Transgender + "" }];
    const maritialStatusOptions: FormDataTypes.SelectOption[] = [{ label: 'All', value: "0" }, { label: "Single", value: MaritalStatus.Single + "" }, { label: "Married", value: MaritalStatus.Married + "" }, { label: "Widowed", value: MaritalStatus.Widowed + "" }, { label: "Divorsed", value: MaritalStatus.Widowed + "" },];

    useEffect(() => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getLeaveTypeDetail(id).then(response => {
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

    const yupSchema = Yup.object().shape({
        leave_type_name: Yup.string().required(ProjectStrings.ValidationRequired),
        leave_type_abbreviation: Yup.string().required(ProjectStrings.ValidationRequired),
        leave_type_description: Yup.string().required(ProjectStrings.ValidationRequired),
        // leave_type_gender_allowed: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
        // leave_type_allowed_marital_status: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
    });


    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min">
            {formDataSet && (
                <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                    let submitValues: any = { ...values };
                    //setSubmitting(false);
                    //return;
                    console.log('Submitting values');
                    if (id != undefined && id != 0) {
                        addProcessingRequests();
                        ServerAPI.updateLeaveType(submitValues, id).then(response => {
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
                        submitValues['company_id'] = getLoginCompanyID();
                        addProcessingRequests();
                        ServerAPI.addLeaveType(submitValues).then(response => {
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
                                <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} Leave Type</p>
                                <div className="custom-border-grey my-2"></div>
                                <Form className='pl-2 pr-2'>
                                    <div className="px-2 form-field-container">
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Leave Type Name", name: "leave_type_name", placeholder: "Enter Leave Type Name", required: true }} />
                                            </div>
                                        </div>
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Leave Type Abbreviation", name: "leave_type_abbreviation", placeholder: "Enter Leave Type Abbreviation", required: true }} />
                                            </div>
                                        </div>
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Leave Type Description", name: "leave_type_description", placeholder: "Enter Leave Type Description", required: true }} />
                                            </div>
                                        </div>
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "Allowed Gender", name: "leave_type_gender_allowed", options: genderOptions, required: true }} />
                                            </div>
                                        </div>
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "Allowed Marital Status", name: "leave_type_allowed_marital_status", options: maritialStatusOptions, required: true }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row btn-form-submit">
                                        <button type="button" className="button1" onClick={closeDialog}>Cancel</button>
                                        <button type="button" className="button2" disabled={formikProps.isSubmitting} onClick={() => {
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

export default LeaveTypeEntryDialog;
