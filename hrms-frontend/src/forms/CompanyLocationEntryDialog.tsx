import { Drawer } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import React, { useEffect, useState } from 'react';
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from '../common/DataTypes';
import { InitialData } from './InitialData';
import toast from 'react-hot-toast';
import { getDataFromAPI, getLoginCompanyID } from '../common/Utilities';
import { useAppStateAPI } from '../common/AppStateAPI';
import { API, ProjectStrings } from '../common/Constants';
import { ServerAPI } from '../common/ServerAPI';
import * as Yup from 'yup';

const CompanyLocationEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, reloadData: any, id?: number, }> = ({ showDialog, closeDialog, reloadData, id }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.CompanyLocation>(InitialData.CompanyLocation);
    const [editMode, setEditMode] = useState(false);
    const [countryOption, setCountryOption] = useState<FormDataTypes.SelectOption[]>([]);
    const [stateOptions, setStateOptions] = useState<FormDataTypes.SelectOption[]>([]);
    const [formDataSet, setFormDataSet] = useState(false);
    const [selectedCountryID, setSelectedCountryID] = useState(0);


    useEffect(() => {
        if (selectedCountryID) {
            let params: { [k: string]: any } = {};
            params['country_id'] = selectedCountryID;
            getDataFromAPI(API.EndPoint.STATE_LIST, setStateOptions, addProcessingRequests, reduceProcessingRequests, params, true, 'state_id', 'state_name', 'states');
        } else {
            setStateOptions([]);
        }

    }, [selectedCountryID])

    useEffect(() => {
        getDataFromAPI(API.EndPoint.COUNTRY_LIST, setCountryOption, addProcessingRequests, reduceProcessingRequests, null, true, 'country_id', 'country_name', 'countries');
        // getDataFromAPI(API.EndPoint.STATE_LIST, setStateOption, addProcessingRequests, reduceProcessingRequests, null, true, 'state_id', 'state_name', 'states');
        setFormDataSet(true);
    }, []);

    useEffect(() => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getCompanyLocationDetail(id).then(response => {
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
        company_location_name: Yup.string().required(ProjectStrings.ValidationRequired),
        company_location_address_line1: Yup.string().required(ProjectStrings.ValidationRequired),
        //company_location_address_line2: Yup.string().required(ProjectStrings.ValidationRequired),
        company_location_address_city: Yup.string().required(ProjectStrings.ValidationRequired),
        company_location_address_postal_code: Yup.string().required(ProjectStrings.ValidationRequired),
        // country_id: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
        state_id: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),

    });

    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min">
            {formDataSet && (
                <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                    let submitValues: any = { ...values };
                    submitValues['company_location_address_postal_code'] = submitValues['company_location_address_postal_code'].toString();
                    // const selectedCountry = countryOption.find(option => option.value.toString() === values.country_id.toString());

                    // if (selectedCountry) {
                    //     submitValues = {
                    //         ...submitValues,
                    //         country_name: selectedCountry.label
                    //     };
                    // }

                    if (id != undefined && id != 0) {
                        addProcessingRequests();
                        ServerAPI.updateCompanyLocation(submitValues, id).then(response => {
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
                        ServerAPI.addCompanyLocation(submitValues).then(response => {
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
                        if (formikProps.values.country_id && formikProps.values.country_id !== selectedCountryID) {
                            setSelectedCountryID(parseInt(formikProps.values.country_id + ""));
                        }
                        return (
                            <div className="tabdetails">
                                {/* <h4 className="title-text text-center">{editMode ? 'Edit' : 'Add New'} Company Location</h4> */}
                                <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} Company Location</p>
                                <div className="custom-border-grey my-2"></div>
                                <Form className='pl-2 pr-2'>
                                    <div className="px-2 form-field-container">
                                        <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Company Location", name: "company_location_name", placeholder: "Enter Company Location", required: true }} />
                                            </div>
                                        </div>
                                        <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Address Line 1", name: "company_location_address_line1", placeholder: "Enter Company Address", required: true }} />
                                            </div>
                                        </div>
                                        <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Address Line 2", name: "company_location_address_line2", placeholder: "Enter Company Address" }} />
                                            </div>
                                        </div>
                                        <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "City Name", name: "company_location_address_city", placeholder: "Enter City Name", required: true }} />
                                            </div>
                                        </div>
                                        <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Country Name", name: "country_id", placeholder: "Select Country Name", options: countryOption, required: true }} />
                                            </div>
                                        </div>
                                        <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "State Name", name: "state_id", placeholder: "Select State Name", required: true, options: stateOptions }} />
                                            </div>
                                        </div>
                                        <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "Zip / Postcode", name: "company_location_address_postal_code", placeholder: "Enter Zip / Postcode", required: true }} />
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
                                                console.log(formikProps.errors);
                                            }
                                        }}>Submit</button>
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

export default CompanyLocationEntryDialog;