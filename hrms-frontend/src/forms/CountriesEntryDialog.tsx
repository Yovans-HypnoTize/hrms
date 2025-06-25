import { Drawer } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import * as Yup from 'yup';
import { Form, Formik, FormikProps } from "formik";
import { ServerAPI } from "../common/ServerAPI";
import toast from "react-hot-toast";
import React from "react";
import { useAppStateAPI } from "../common/AppStateAPI";
import { APIData, FormDataTypes } from "../common/DataTypes";
import { InitialData } from "./InitialData";
import FormField from "../components/form-items/FormField";
import { API, ProjectStrings } from "../common/Constants";
import { getDataFromAPI } from "../common/Utilities";

const CountriesEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, id?: number, reloadData: () => void }> = ({ showDialog, closeDialog, id, reloadData, }) => {

    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const formikRef = useRef<FormikProps<APIData.Countries>>(null);
    const [initialValue, setInitialValue] = useState<APIData.Countries>(InitialData.Countries);
    const [formDataSet, setFormDataSet] = useState(false);
    const [editMode, setEditMode] = useState(false);

    console.log(id, "id")
    console.log(formDataSet, "set")
    console.log(initialValue, "edit")


    useEffect(() => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getCountriesDetail(id).then(response => {
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
        country_name: Yup.string().required(ProjectStrings.ValidationRequired),
    });
    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min">
            {formDataSet && (
                <Formik validationSchema={yupSchema} enableReinitialize={true} validateOnChange={false} initialValues={initialValue} innerRef={formikRef} onSubmit={(values, { setSubmitting }) => {
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
                        ServerAPI.updateCountries(submitValues, id).then(response => {
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
                        ServerAPI.addCountries(submitValues).then(response => {
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
                                {/* <h4 className="title-text text-center">{editMode ? 'Edit' : 'Add New'} Country</h4> */}
                                <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} Country</p>
                                <div className="custom-border-grey my-2"></div>
                                {/* <p className="detailed-heading">Fuel Details</p>
                                <div className="custom-border-grey my-2"></div> */}
                                <Form>
                                    <div className="px-2 form-field-container">
                                        <div className="row px-2 pt-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Country Name", name: "country_name", placeholder: "Enter Country Name", required: true }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row btn-form-submit">
                                        <button type="button" className="button1" onClick={() => closeDialog()}>Cancel</button>
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
    )
}

export default CountriesEntryDialog;
