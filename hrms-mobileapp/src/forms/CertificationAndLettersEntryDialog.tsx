import { Drawer } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useAppStateAPI } from '../common/AppStateAPI';
import { LeaveRequestDays, LeaveRequestSession, API, ProjectStrings } from '../common/Constants';
import { APIData, FormDataTypes } from '../common/DataTypes';
import { ServerAPI } from '../common/ServerAPI';
import { getDataFromAPI } from '../common/Utilities';
import FormField from '../components/form-items/FormField';
import { InitialData } from './InitialData';

const CertificationAndLettersEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, reloadData: any, id?: number, }> = ({ showDialog, closeDialog, reloadData, id }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.Certifications>(InitialData.Certifications);
    console.log(initialValue, "initial outside data")
    const [editMode, setEditMode] = useState(false);

    const yupSchema = Yup.object().shape({

    });

    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min workshift">
            <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                let submitValues: any = { ...values };
                if (id !== undefined && id !== 0) {
                    addProcessingRequests();
                    ServerAPI.updateCertifications(submitValues, id).then((response: any) => {
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
                    ServerAPI.addLeaveRequest(submitValues).then((response: any) => {
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
                            {/* <h4 className="title-text text-center">{editMode ? 'Edit' : 'Add New'} Leave Request</h4> */}
                            <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} Certifications & Letters</p>
                            <div className="custom-border-grey my-2"></div>
                            <Form className='pl-2 pr-2'>
                                <div className="px-2 form-field-container">
                                    <div className="row px-2 py-3">
                                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "fileupload", label: "Upload", name: "file", placeholder: "Upload File", required: true }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row leave-request">
                                    <button type="button" className="button1" onClick={closeDialog}>Cancel</button>
                                    <button type="button" className="button2" disabled={formikProps.isSubmitting} onClick={() => {
                                        formikProps.submitForm();
                                        if (!formikProps.isValid) {
                                            console.log(formikProps.errors, "errror")
                                            console.log(formikProps.values, "data")
                                            toast.error("Please ensure all fields are Filled and Valid!");
                                        }
                                    }}>Submit</button>
                                </div>
                            </Form>
                        </div>
                    )
                }}
            </Formik>
        </Drawer>
    );
};

export default CertificationAndLettersEntryDialog;

