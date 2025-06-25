import { Drawer } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from '../common/DataTypes';
import { InitialData } from './InitialData';
import { API, ProjectStrings } from '../common/Constants';
import { useAppStateAPI } from '../common/AppStateAPI';
import toast from 'react-hot-toast';
import { ServerAPI } from '../common/ServerAPI';

const EmployeeSuperiorEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, employeeID: number, id?: number, reloadData: any, }> = ({ showDialog, closeDialog, reloadData, employeeID, id }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.EmployeeSuperior>(InitialData.EmployeeSuperior);
    const [superiorEmployeeOptions, setSuperiorEmployeeOptions] = useState<FormDataTypes.SelectOption[]>([]);
    const [formDataSet, setFormDataSet] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getEmployeeSuperior(id).then(response => {
                if (response.data) {
                    const superior: APIData.EmployeeSuperior = response.data;
                    setInitialValue({
                        superior_employee_id: superior.superior_employee_id,
                        employee_id: superior.employee_id,
                        employee_superior_effective_from: superior.employee_superior_effective_from,
                        employee_superior_update_login_id: superior.employee_superior_update_login_id
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

    useEffect(() => {
        addProcessingRequests();
        ServerAPI.executeAPI(API.EndPoint.EMPLOYEES_LIST, ServerAPI.APIMethod.GET, true, null).then(response => {
            if (response.data !== undefined && response.message) {
                let supEmployees: FormDataTypes.SelectOption[] = [{ label: 'No Superior', value: '0' }];
                response.data.forEach((item: any) => (supEmployees.push({
                    label: `${item.employee.employee_first_name} ${item.employee.employee_last_name}`,
                    value: item.employee.employee_id
                })));
                setSuperiorEmployeeOptions(supEmployees);
                // toast.success(response.message);
            } else {
                alert("Something Went Wrong");
            }
        }).finally(() => {
            reduceProcessingRequests();
            setFormDataSet(true);
        });
        //getDataFromAPI(API.EndPoint.EMPLOYEES_LIST, setSuperiorEmployeeOption, addProcessingRequests, reduceProcessingRequests, null, true, 'employee_id', 'employee_first_name', 'data', 'employee');
    }, []);

    const yupSchema = Yup.object().shape({
        employee_superior_effective_from: Yup.string().required(ProjectStrings.ValidationRequired),
        superior_employee_id: Yup.number().required(ProjectStrings.ValidationRequired),
    });

    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min">
            {formDataSet && (
                <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                    let submitValues: any = { ...values };
                    submitValues['employee_id'] = employeeID;
                    if(parseInt(submitValues['superior_employee_id']) === 0) {
                        submitValues['superior_employee_id'] = null;
                    }
                    if (id) {
                        addProcessingRequests();
                        ServerAPI.updateSuperiorEmployee(submitValues, id).then(response => {
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
                        ServerAPI.addSuperiorEmployee(submitValues).then(response => {
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
                                <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} Superior</p>
                                <div className="custom-border-grey my-2"></div>
                                <Form className='pl-2 pr-2'>
                                    <div className="px-2 form-field-container">
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Superior Employee", name: "superior_employee_id", placeholder: "Select Superior Employee", required: true, options: superiorEmployeeOptions }} />
                                            </div>
                                        </div>
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "datepicker", label: "Effective Date From", name: "employee_superior_effective_from", placeholder: "Select Date", required: true, allowFutureDate: true }} />
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

export default EmployeeSuperiorEntryDialog;




