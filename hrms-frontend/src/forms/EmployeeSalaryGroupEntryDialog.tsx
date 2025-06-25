import { Drawer } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from '../common/DataTypes';
import { InitialData } from './InitialData';
import { API, CompanySalaryType, ProjectStrings, SalaryComponentCalculationType } from '../common/Constants';
import { getDataFromAPI, getLoginCompanyID } from '../common/Utilities';
import { useAppStateAPI } from '../common/AppStateAPI';
import toast from 'react-hot-toast';
import { ServerAPI } from '../common/ServerAPI';

interface EmployeeSalaryComponent {
    salary_component_id: number;
    employee_salary_component_value: string;
}
const EmployeeSalaryDetailEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, id?: number, employeeID: number, reloadData: any, }> = ({ showDialog, closeDialog, reloadData, employeeID, id }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.EmployeeSalary>(InitialData.EmployeeSalary);
    const [salaryGroupOptions, setSalaryGroupOptions] = useState<FormDataTypes.SelectOption[]>([]);
    const [formDataSet, setFormDataSet] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedSalaryGroupID, setSelectedSalaryGroupID] = useState(0);
    const [salaryType, setSalaryType] = useState(0);
    const [salaryComponents, setSalaryComponents] = useState<APIData.SalaryGroupComponent[]>([]);
    console.log(salaryType, "salarytype")

    useEffect(() => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getEmployeeSalaryGroup(id).then(response => {
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
        if (getLoginCompanyID() !== undefined && getLoginCompanyID() !== 0) {
            addProcessingRequests();
            ServerAPI.getCompanyDetail(getLoginCompanyID()).then(response => {
                if (response) {
                    console.log(response, "companies details")
                    setSalaryType(response.company_salary_definition_type)
                    console.log(response.company_salary_definition_type)
                }
            }).finally(() => {
                reduceProcessingRequests();
            });
        } else {
            setFormDataSet(true);
        }
    }, [getLoginCompanyID()]);

    useEffect(() => {
        if (selectedSalaryGroupID && selectedSalaryGroupID !== 0) {
            addProcessingRequests();
            ServerAPI.getSalaryGroupComponents(selectedSalaryGroupID, SalaryComponentCalculationType.CommonFixedEmployeeWise).then(response => {
                if (response.salary_group_components !== undefined) {
                    setSalaryComponents(response.salary_group_components)
                }
            }).finally(() => {
                reduceProcessingRequests();
                setFormDataSet(true);
            });
        } else {
            setFormDataSet(true);
        }
    }, [selectedSalaryGroupID]);

    useEffect(() => {
        getDataFromAPI(API.EndPoint.SALARY_GROUP, setSalaryGroupOptions, addProcessingRequests, reduceProcessingRequests, null, true, 'salary_group_id', 'salary_group_name', 'salary_groups');
        setFormDataSet(true);
    }, []);


    const yupSchema = Yup.object().shape({
        employee_salary_effective_from: Yup.string().required(ProjectStrings.ValidationRequired),
        employee_monthly_salary: Yup.number().required(ProjectStrings.ValidationRequired),
        // employee_salary_ctc: Yup.number().required(ProjectStrings.ValidationRequired),
        salary_group_id: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
    });

    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min">
            {formDataSet && (
                <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                    const employeeSalaryComponentValues: EmployeeSalaryComponent[] = [];

                    salaryComponents.forEach((component, index) => {
                        const employeeSalaryComponentValue = values.employee_salary_component_values[index]?.employee_salary_component_value;

                        employeeSalaryComponentValues.push({
                            salary_component_id: component.salary_component_id,
                            employee_salary_component_value: employeeSalaryComponentValue ? employeeSalaryComponentValue.toString() : "" || ''
                        });
                    });
                    let submitValues: any = { ...values, employee_salary_component_values: employeeSalaryComponentValues };
                    if (salaryType === CompanySalaryType.AnnualCtcBased) {
                        if (!submitValues['employee_salary_ctc'] || submitValues['employee_salary_ctc'] === 0) {
                            toast.error("Annual CTC is required");
                            setSubmitting(false);
                            return
                        }
                    }
                    submitValues['employee_id'] = employeeID;
                    if (id) {
                        addProcessingRequests();
                        ServerAPI.updateEmployeeSalary(submitValues, id).then(response => {
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
                        ServerAPI.addEmployeeSalary(submitValues).then(response => {
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
                        if (formikProps.values.salary_group_id && formikProps.values.salary_group_id !== selectedSalaryGroupID) {
                            setSelectedSalaryGroupID(parseInt(formikProps.values.salary_group_id + ""));
                        }
                        return (
                            <div className="tabdetails">
                                <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} Salary</p>
                                <div className="custom-border-grey my-2"></div>
                                <Form className='pl-2 pr-2'>
                                    <div className="px-2 form-field-container">
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Salary Group Name", name: "salary_group_id", placeholder: "Select Salary Group Name", required: true, options: salaryGroupOptions }} />
                                            </div>
                                        </div>
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "Monthly Basic pay", name: "employee_monthly_salary", placeholder: "Enter Monthly Basic pay", required: true }} />
                                            </div>
                                        </div>
                                        {salaryType === CompanySalaryType.AnnualCtcBased && <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "Annual CTC", name: "employee_salary_ctc", placeholder: "Enter Annual CTC", required: true }} />
                                            </div>
                                        </div>}

                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "datepicker", label: "Effective Date From", name: "employee_salary_effective_from", placeholder: "Select Date", required: true }} />
                                            </div>
                                        </div>
                                        {salaryComponents.length > 0 && salaryComponents.map((component, index) => (
                                            <div key={index} className="row py-3">
                                                <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: `${component.salary_component_name}`, name: `employee_salary_component_values.${index}.employee_salary_component_value`, placeholder: "Enter Salary Component Value", required: true }} />
                                                </div>
                                            </div>
                                        ))}
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

export default EmployeeSalaryDetailEntryDialog;

