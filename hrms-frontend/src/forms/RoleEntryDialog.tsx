import { Drawer } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import React, { useEffect, useState } from 'react';
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from '../common/DataTypes';
import { InitialData } from './InitialData';
import toast from 'react-hot-toast';
import { getDataFromAPI } from '../common/Utilities';
import { useAppStateAPI } from '../common/AppStateAPI';
import { API, ProjectStrings } from '../common/Constants';
import { ServerAPI } from '../common/ServerAPI';
import * as Yup from 'yup';

const RoleEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, reloadData: any, id?: number, }> = ({ showDialog, closeDialog, reloadData, id }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.RestDayGroups>(InitialData.RestDayGroups);
    const [editMode, setEditMode] = useState(false);
    // const [stateOption, setStateOption] = useState<FormDataTypes.SelectOption[]>([]);
    const mobileAvailableOptions: FormDataTypes.SelectOption[] = [{ label: 'Rest Day', value: "Rest Day" }, { label: "Working Day", value: "Working Day" }];
    const [formDataSet, setFormDataSet] = useState(false);

    useEffect(() => {
        setFormDataSet(true);
    }, []);

    // useEffect(() => {
    //     if (id !== undefined && id !== 0) {
    //         addProcessingRequests();
    //         ServerAPI.getRestDayGroupDetail(id).then(response => {
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

    });

    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min10">
            {formDataSet && (
                <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                    let submitValues: any = { ...values };
                    // const selectedCountry = countryOption.find(option => option.value.toString() === values.country_id.toString());

                    // if (selectedCountry) {
                    //     submitValues = {
                    //         ...submitValues,
                    //         country_name: selectedCountry.label
                    //     };
                    // }

                    // if (id != undefined && id != 0) {
                    //     addProcessingRequests();
                    //     ServerAPI.updateRestDayGroup(submitValues, id).then(response => {
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
                    //     addProcessingRequests();
                    //     ServerAPI.addRestDayGroup(submitValues).then(response => {
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
                                {/* <h4 className="title-text text-center">{editMode ? 'Edit' : 'Add New'} Rest Days Group</h4> */}
                                <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} Role</p>
                                <div className="custom-border-grey my-2"></div>
                                <Form className='pl-2 pr-2'>
                                    <div className="px-2 form-field-container">
                                        <div className="row px-2 py-3">
                                            <div className="col-lg-10 col-md-10 col-xl-10 text-field-empty-custom-user holiday-group">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Role Name", name: "company_address_postal_code", placeholder: "Enter Role Name", required: true }} />
                                            </div>
                                        </div>
                                        <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "permission to view role", name: "mobile_app_attendance_allowed", options: mobileAvailableOptions, required: true }} />
                                            </div>
                                        </div>
                                        <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "permission to add role", name: "mobile_app_attendance_allowe", options: mobileAvailableOptions, required: true }} />
                                            </div>
                                        </div>
                                        <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "permission to edit role", name: "mobile_app_attendance_allowed2", options: mobileAvailableOptions, required: true }} />
                                            </div>
                                        </div>
                                        <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "permission to delete role", name: "mobile_app_attendance_allowed3", options: mobileAvailableOptions, required: true }} />
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

export default RoleEntryDialog;