import { Drawer } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import React, { useState } from 'react';
import FormField from "../components/form-items/FormField";
import { APIData } from '../common/DataTypes';
import { InitialData } from './InitialData';

const EmployersStaticFormDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, }> = ({ showDialog, closeDialog }) => {

    const [initialValue, setInitialValue] = useState<APIData.ModelVariant>(InitialData.ModelVariant);
    const holidayOptions = [
        { label: "New Year's Day", value: "01-01" },
        { label: "Valentine's Day", value: "02-14" },
        { label: "April Fools' Day", value: "04-01" },
        { label: "Independence Day", value: "07-04" },
        { label: "Halloween", value: "10-31" },
        { label: "Christmas Day", value: "12-25" }
    ];


    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-fit">
            <Formik enableReinitialize={true} validateOnChange={false} initialValues={initialValue} onSubmit={function (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>): void | Promise<any> {
                throw new Error('Function not implemented.');
            }}>
                {(formikProps) => {
                    return (
                        <div className="tabdetails">
                            <p className="detailed-heading mt-3">Add Holiday</p>
                            <div className="custom-border-grey my-2"></div>
                            <Form className='pl-2 pr-2'>
                                <div className="px-2 form-field-container">
                                    <div className="row py-3">
                                        <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Holiday Name", name: "variant_name", placeholder: "Enter Holiday Name", required: true }} />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "number", name: "hierarchy_level", label: "Holiday Count", placeholder: "Enter Holiday Count", required: true }} />
                                        </div>
                                    </div>
                                    <div className="row py-3">
                                        <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "multiselect", label: "Holiday Type", name: "transmission_type_uuid", placeholder: "Select Holiday Type", required: true, options: holidayOptions }} />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Holiday Type", name: "transmission_type_uuid", placeholder: "Select Holiday Type", required: true, options: holidayOptions }} />
                                        </div>
                                    </div>
                                    <div className="row py-3">
                                        <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "datepicker", label: "Holiday date", name: "exchange_finance_ew.extended_warranty_end_date", placeholder: "Enter Holiday date", required: true }} />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "password", label: "Password", name: "transmission_type_uuid", placeholder: "Enter Password", required: true }} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "Status", name: "body_type_status", options: holidayOptions }} />
                                        </div>

                                    </div>
                                    <div className="row py-3">
                                        <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "checkbox", label: "Holiday", name: "transmission_type_uuid", placeholder: "Holiday Option", required: true, options: holidayOptions }} />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "switch", label: "Status", name: "body_type_status" }} />
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    )
                }}
            </Formik>
        </Drawer>
    );
};

export default EmployersStaticFormDialog;