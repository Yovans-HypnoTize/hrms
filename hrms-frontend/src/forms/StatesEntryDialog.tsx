import { Drawer } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from '../common/DataTypes';
import { InitialData } from './InitialData';
import { API, ProjectStrings } from '../common/Constants';
import { getDataFromAPI } from '../common/Utilities';
import { useAppStateAPI } from '../common/AppStateAPI';
import toast from 'react-hot-toast';
import { ServerAPI } from '../common/ServerAPI';

const StateEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, id?: number, reloadData: any, }> = ({ showDialog, closeDialog, reloadData, id }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.States>(InitialData.States);
    const [countryOption, setCountryOption] = useState<FormDataTypes.SelectOption[]>([]);
    const [formDataSet, setFormDataSet] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        getDataFromAPI(API.EndPoint.COUNTRY_LIST, setCountryOption, addProcessingRequests, reduceProcessingRequests, null, true, 'country_id', 'country_name', 'countries');
        setFormDataSet(true);
        console.log(countryOption, "country")
    }, []);

    useEffect(() => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getStateDetail(id).then(response => {
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
        state_name: Yup.string().required(ProjectStrings.ValidationRequired),
        country_id: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
    });

    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min">
            {formDataSet && (
                <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                    let submitValues: any = { ...values };
                    if (id != undefined && id != 0) {
                        addProcessingRequests();
                        ServerAPI.updateState(submitValues, id).then(response => {
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
                        ServerAPI.addState(submitValues).then(response => {
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
                                <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} State</p>
                                <div className="custom-border-grey my-2"></div>
                                <Form className='pl-2 pr-2'>
                                    <div className="px-2 form-field-container">
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Country Name", name: "country_id", placeholder: "Select Country Name", required: true, options: countryOption }} />
                                            </div>
                                        </div>
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "State Name", name: "state_name", placeholder: "Enter State Name", required: true }} />
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

export default StateEntryDialog;

