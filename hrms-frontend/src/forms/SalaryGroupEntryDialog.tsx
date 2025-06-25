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
import { getDataFromAPI, getLoginCompanyID } from '../common/Utilities';
import { mdiCompassOutline } from '@mdi/js';

const SalaryGroupEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, id?: number, reloadData: any, }> = ({ showDialog, closeDialog, id, reloadData }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.SalaryGroup>(InitialData.SalaryGroup);
    const [formDataSet, setFormDataSet] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [salaryComponentOption, setSalaryComponentOption] = useState<FormDataTypes.SelectOption[]>([]);

    useEffect(() => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getSalaryGroupDetail(id).then(response => {
                if (response) {
                    const salaryGroup = response;
                    salaryGroup.salary_component_ids = salaryGroup.salary_group_components.map((component: any) => component.salary_component_id);
                    delete salaryGroup.salary_group_components;
                    setInitialValue(salaryGroup);
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
        // addProcessingRequests();
        // ServerAPI.executeAPI(API.EndPoint.SALARY_COMPONENTS, ServerAPI.APIMethod.GET, true, null).then(response => {
        //     if (response.salary_components !== undefined) {
        //         const componentData = response.salary_components.map((item: any) => ({
        //             label: item.salary_component_name,
        //             value: item.salary_component_id
        //         }));
        //         setSalaryComponentOption(componentData);
        //         // toast.success(response.message);
        //     } else {
        //         alert("Something Went Wrong");
        //     }
        // }).finally(() => {
        //     reduceProcessingRequests();
        //     setFormDataSet(true);
        // });
        getDataFromAPI(API.EndPoint.SALARY_COMPONENTS, setSalaryComponentOption, addProcessingRequests, reduceProcessingRequests, null, true, 'salary_component_id', 'salary_component_name', 'salary_components');
        setFormDataSet(true);
    }, []);

    const yupSchema = Yup.object().shape({
        salary_group_name: Yup.string().required(ProjectStrings.ValidationRequired),
        salary_component_ids: Yup.array().min(1, ProjectStrings.ValidationArrayEmpty).of(Yup.number().required(ProjectStrings.ValidationRequired)),
    });


    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min">
            {formDataSet && (
                <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                    let submitValues: any = { ...values };
                    if (id != undefined && id != 0) {
                        addProcessingRequests();
                        ServerAPI.updateSalaryGroup(submitValues, id).then(response => {
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
                        ServerAPI.addSalaryGroup(submitValues).then(response => {
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
                                <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} Salary Group</p>
                                <div className="custom-border-grey my-2"></div>
                                <Form className='pl-2 pr-2'>
                                    <div className="px-2 form-field-container">
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Salary Structures Name", name: "salary_group_name", placeholder: "Enter Salary Structures Name", required: true }} />
                                            </div>
                                        </div>
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "multiselect", label: "Salary Component", name: "salary_component_ids", placeholder: "Select Salary Component", options: salaryComponentOption, required: true }} />
                                            </div>
                                        </div>
                                        <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "switch", label: "Status", name: "salary_group_status" }} />
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

export default SalaryGroupEntryDialog;