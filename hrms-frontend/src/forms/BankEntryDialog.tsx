import { Drawer } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import React, { useEffect, useState } from 'react';
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from '../common/DataTypes';
import { InitialData } from './InitialData';
import { API, ProjectStrings } from '../common/Constants';
import { getDataFromAPI } from '../common/Utilities';
import { useAppStateAPI } from '../common/AppStateAPI';
import toast from 'react-hot-toast';
import { ServerAPI } from '../common/ServerAPI';
import * as Yup from 'yup';

const BankEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, reloadData: any, id?: number }> = ({ showDialog, closeDialog, reloadData, id }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.Banks>(InitialData.Banks);
    const [countryOption, setCountryOption] = useState<FormDataTypes.SelectOption[]>([]);
    const [formDataSet, setFormDataSet] = useState(false);
    const [editMode, setEditMode] = useState(false);
    useEffect(() => {
        getDataFromAPI(API.EndPoint.COUNTRY_LIST, setCountryOption, addProcessingRequests, reduceProcessingRequests, null, true, 'country_id', 'country_name', 'countries');
    }, []);


    useEffect(() => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getBanksDetail(id).then(response => {
                if (response) {
                    setInitialValue({
                        bank_name: response.bank_name,
                        country_ids: response.countries.map((country: any) => country.country_id)
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

    const yupSchema = Yup.object().shape({
        bank_name: Yup.string().required(ProjectStrings.ValidationRequired),
        country_ids: Yup.array().min(1, ProjectStrings.ValidationArrayEmpty).of(Yup.number().required(ProjectStrings.ValidationRequired)),
    });

    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min">
            <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                let submitValues: any = { ...values };
                // const selectedCountry = countryOption.find(option => option.value.toString() === values.country_id.toString());

                // if (selectedCountry) {
                //     submitValues = {
                //         ...submitValues,
                //         country_name: selectedCountry.label
                //     };
                // }

                if (id != undefined && id != 0) {
                    addProcessingRequests();
                    ServerAPI.updateBanks(submitValues, id).then(response => {
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
                    ServerAPI.addBanks(submitValues).then(response => {
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
                            <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} Bank</p>
                            <div className="custom-border-grey my-2"></div>
                            <Form className='pl-2 pr-2'>
                                <div className="px-2 form-field-container">
                                    <div className="row py-3">
                                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Bank Name", name: "bank_name", placeholder: "Enter Bank Name", required: true, }} />
                                        </div>
                                    </div>
                                    <div className="row py-3">
                                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "multiselect", label: "Country Name", name: "country_ids", placeholder: "Select Country Name", required: true, options: countryOption }} />
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
        </Drawer>
    );
};

export default BankEntryDialog;