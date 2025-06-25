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
import { API, ProjectStrings } from '../common/Constants';
import { getDataFromAPI } from '../common/Utilities';

const BankAccountEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, id?: number, reloadData: any, }> = ({ showDialog, closeDialog, id, reloadData }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.Banks>(InitialData.Banks);
    const [formDataSet, setFormDataSet] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [bankOption, setBankOption] = useState<FormDataTypes.SelectOption[]>([]);

    useEffect(() => {
        getDataFromAPI(API.EndPoint.BANK_LIST, setBankOption, addProcessingRequests, reduceProcessingRequests, null, true, 'bank_id', 'bank_name', 'banks_details');
        setFormDataSet(true);
    }, []);


    // useEffect(() => {
    //     if (id !== undefined && id !== 0) {
    //         addProcessingRequests();
    //         ServerAPI.getClientsDetail(id).then(response => {
    //             if (response) {
    //                 setInitialValue(response);
    //                 setFormDataSet(true);
    //                 setEditMode(true);
    //             }
    //         }).finally(() => {
    //             reduceProcessingRequests();
    //         });
    //     } else {
    //         setFormDataSet(true);
    //     }
    // }, [id]);

    const yupSchema = Yup.object().shape({
        bank_name: Yup.string().notOneOf(["0"], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
    });


    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min">
            {formDataSet && (
                <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                    let submitValues: any = { ...values };

                    // if (id != undefined && id != 0) {
                    //     addProcessingRequests();
                    //     ServerAPI.updateClients(submitValues, id).then(response => {
                    //         if (response && response['message']) {
                    //             toast.success(response['message']);
                    //             reloadData();
                    //             closeDialog();
                    //         } else if (response && response['message']) {
                    //             toast.error(response['message']);
                    //         }
                    //     }).finally(() => {
                    //         setSubmitting(false);
                    //         reduceProcessingRequests();
                    //     });
                    // } else {
                    //     submitValues['company_id'] = getLoginCompanyID();
                    //     addProcessingRequests();
                    //     ServerAPI.addClients(submitValues).then(response => {
                    //         if (response && response['message']) {
                    //             toast.success(response['message']);
                    //             reloadData();
                    //             closeDialog();
                    //         } else if (response && response['message']) {
                    //             toast.error(response['message']);
                    //         }
                    //     }).finally(() => {
                    //         setSubmitting(false);
                    //         reduceProcessingRequests();
                    //     });
                    // }
                }} >
                    {(formikProps) => {
                        return (
                            <div className="tabdetails">
                                <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} Bank Account</p>
                                <div className="custom-border-grey my-2"></div>
                                <Form className='pl-2 pr-2'>
                                    <div className="px-2 form-field-container">
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Bank Name", name: "bank_id", placeholder: "Select Bank Name", options: bankOption, required: true }} />
                                            </div>
                                        </div>
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Bank Branch Name", name: "client_name", placeholder: "Enter Branch Name", required: true }} />
                                            </div>
                                        </div>
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Account Holder Name", name: "client_name", placeholder: "Enter Account Holder Name", required: true }} />
                                            </div>
                                        </div>
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "Account Number", name: "client_name", placeholder: "Enter Account Number", required: true }} />
                                            </div>
                                        </div>
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "IFSC Code", name: "client_name", placeholder: "Enter IFSC Code", required: true }} />
                                            </div>
                                        </div>
                                        {/* <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "switch", label: "Status", name: "body_type_status" }} />
                                            </div>
                                        </div> */}
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

export default BankAccountEntryDialog;
