import { Drawer } from '@mui/material';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useRef, useState } from 'react';
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from '../common/DataTypes';
import { InitialData } from './InitialData';
import { useAppStateAPI } from '../common/AppStateAPI';
import toast from 'react-hot-toast';
import { ServerAPI } from '../common/ServerAPI';
import { API, ProjectStrings, SalaryComponentBimonthlyCycle, SalaryComponentCalculationDayType, SalaryComponentCalculationType, SalaryComponentType } from '../common/Constants';
import { getDataFromAPI, getLoginCompanyID } from '../common/Utilities';

const SalaryComponentEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, id?: number, reloadData: any, }> = ({ showDialog, closeDialog, id, reloadData }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.SalaryComponent>(InitialData.SalaryComponent);
    const formikRef = useRef<FormikProps<APIData.SalaryComponent>>(null);
    const [formDataSet, setFormDataSet] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const StatisticalOptions: FormDataTypes.SelectOption[] = [{ label: 'Yes', value: "1" }, { label: "No", value: "0" }];
    const taxApplicableOptions: FormDataTypes.SelectOption[] = [{ label: 'Yes', value: "1" }, { label: "No", value: "0" }];
    const componentTypeOptions: FormDataTypes.SelectOption[] = [{ label: 'Allowance', value: SalaryComponentType.Allowance + "" }, { label: 'Deduction', value: SalaryComponentType.Deduction + "" }, { label: 'Employer Contribution', value: SalaryComponentType.EmployerContribution + "" }];
    const calculationTypeOptions: FormDataTypes.SelectOption[] = [{ label: 'Formula Based', value: SalaryComponentCalculationType.FormulaBased + "" }, { label: 'Fixed - Common For All', value: SalaryComponentCalculationType.CommonFixedForAll + "" }, { label: 'Fixed - Employee Wise', value: SalaryComponentCalculationType.CommonFixedEmployeeWise + "" }, { label: 'Employee Manual Entry', value: SalaryComponentCalculationType.EmployeeManualEntry + "" }, { label: 'Custom', value: SalaryComponentCalculationType.Custom + "" }];
    const calculationDayTypeOptions: FormDataTypes.SelectOption[] = [{ label: 'All Days', value: SalaryComponentCalculationDayType.AllDays + "" }, { label: 'Working Days', value: SalaryComponentCalculationDayType.WorkingDays + "" }];
    const ApplicableCycleOptions: FormDataTypes.SelectOption[] = [{ label: 'All Cycles', value: SalaryComponentBimonthlyCycle.AllCycles + "" }, { label: 'First Cycle', value: SalaryComponentBimonthlyCycle.FirstCycle + "" }, { label: 'Second Cycle', value: SalaryComponentBimonthlyCycle.SecondCycle + "" }];

    useEffect(() => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getSalaryComponentDetail(id).then(response => {
                if (response) {
                    let respData = { ...response, salary_component_type: response.salary_component_type + '' }
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
        salary_component_name: Yup.string().required(ProjectStrings.ValidationRequired),
        salary_component_bi_month_applicable_cycle: Yup.string().required(ProjectStrings.ValidationRequired),
        salary_component_abbreviation: Yup.string()
            .matches(/^[\w]+$/, 'Only underscores are allowed in the abbreviation')
            .required(ProjectStrings.ValidationRequired),
        salary_component_description: Yup.string().required(ProjectStrings.ValidationRequired),
        salary_component_type: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
        salary_component_calc_type: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
        salary_component_calculation_formula: Yup.string().when(['salary_component_calc_type'], ([salary_component_calc_type], schema) => {
            if (parseInt(salary_component_calc_type) === SalaryComponentCalculationType.FormulaBased) {
                return schema.required(ProjectStrings.ValidationRequired);
            }
            return schema.nullable();
        }),
        salary_component_common_fixed_value: Yup.number().when('salary_component_calc_type', ([salary_component_calc_type], schema) => {
            if (parseInt(salary_component_calc_type) === SalaryComponentCalculationType.CommonFixedForAll) {
                return Yup.number()
                    .required(ProjectStrings.ValidationRequired)
                    .min(0, 'Value cannot be negative')
                    .notOneOf([0], 'Value cannot be 0');
            } else {
                return schema.nullable();
            }
        }),
        salary_component_calc_day_type: Yup.number().when('salary_component_calc_type', ([salary_component_calc_type], schema) => {
            if (parseInt(salary_component_calc_type) === SalaryComponentCalculationType.CommonFixedForAll || parseInt(salary_component_calc_type) === SalaryComponentCalculationType.CommonFixedEmployeeWise) {
                return Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired)
            }
            return schema;
        }),
    });

    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min">
            {formDataSet && (
                <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} innerRef={formikRef} onSubmit={(values, { setSubmitting }) => {
                    let submitValues: any = { ...values };
                    console.log('submitValues', submitValues);
                    submitValues['salary_component_calc_type'] = parseInt(submitValues['salary_component_calc_type']);
                    submitValues['salary_component_type'] = parseInt(submitValues['salary_component_type']);
                    submitValues['salary_component_calc_day_type'] = parseInt(submitValues['salary_component_calc_day_type']);
                    submitValues['salary_component_tax_applicable'] = parseInt(submitValues['salary_component_tax_applicable']);
                    submitValues['salary_component_is_statistical'] = parseInt(submitValues['salary_component_is_statistical']);
                    submitValues['salary_component_bi_month_applicable_cycle'] = parseInt(submitValues['salary_component_bi_month_applicable_cycle']);

                    if (submitValues['salary_component_calc_type'] === SalaryComponentCalculationType.CommonFixedForAll ||
                        submitValues['salary_component_calc_type'] === SalaryComponentCalculationType.CommonFixedEmployeeWise ||
                        submitValues['salary_component_calc_type'] === SalaryComponentCalculationType.EmployeeManualEntry ||
                        submitValues['salary_component_calc_type'] === SalaryComponentCalculationType.Custom) {
                        submitValues['salary_component_calculation_formula'] = null;
                    }

                    if (submitValues['salary_component_calc_type'] === SalaryComponentCalculationType.FormulaBased ||
                        submitValues['salary_component_calc_type'] === SalaryComponentCalculationType.CommonFixedEmployeeWise ||
                        submitValues['salary_component_calc_type'] === SalaryComponentCalculationType.EmployeeManualEntry ||
                        submitValues['salary_component_calc_type'] === SalaryComponentCalculationType.Custom) {
                        submitValues['salary_component_common_fixed_value'] = null;
                    }

                    // else if (submitValues['salary_component_calc_type'] === SalaryComponentCalculationType.FormulaBased) {
                    //     if (submitValues['salary_component_calculation_formula'] === "") {
                    //         toast.error("Formula Required");
                    //         setSubmitting(false);
                    //         return
                    //     }
                    // }

                    if (id != undefined && id != 0) {
                        addProcessingRequests();
                        ServerAPI.updateSalaryComponent(submitValues, id).then(response => {
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
                        ServerAPI.addSalaryComponent(submitValues).then(response => {
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
                }}>
                    {(formikProps) => (
                        <div className="tabdetails">
                            <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} Salary Component</p>
                            <div className="custom-border-grey my-2"></div>
                            <Form className='pl-2 pr-2'>
                                <div className="px-2 form-field-container">
                                    <div className="row py-3">
                                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Component Type", name: "salary_component_type", placeholder: "Select Component Type", required: true, options: componentTypeOptions }} />
                                        </div>
                                    </div>
                                    <div className="row py-3">
                                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Salary Component Name", name: "salary_component_name", placeholder: "Enter Salary Component Name", required: true }} />
                                        </div>
                                    </div>
                                    <div className="row py-3">
                                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Salary Component Abbreviation", name: "salary_component_abbreviation", placeholder: "Enter Salary Component Abbreviation", required: true }} />
                                        </div>
                                    </div>
                                    <div className="row py-3">
                                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Description", name: "salary_component_description", placeholder: "Enter Description", required: true }} />
                                        </div>
                                    </div>
                                    <div className="row py-3">
                                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Calculation Type", name: "salary_component_calc_type", placeholder: "Select Calculation Type", options: calculationTypeOptions, required: true }} />
                                        </div>
                                    </div>
                                    {(parseInt(formikProps.values.salary_component_calc_type + "") === SalaryComponentCalculationType.CommonFixedForAll || parseInt(formikProps.values.salary_component_calc_type + "") === SalaryComponentCalculationType.CommonFixedEmployeeWise) &&
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Calculation Day Type", name: "salary_component_calc_day_type", placeholder: "Select Calculation Day Type", options: calculationDayTypeOptions, required: true }} />
                                            </div>
                                        </div>
                                    }
                                    {parseInt(formikProps.values.salary_component_calc_type + "") === SalaryComponentCalculationType.CommonFixedForAll &&
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "Fixed Amount", name: "salary_component_common_fixed_value", placeholder: "Enter Fixed Amount", required: true }} />
                                            </div>
                                        </div>
                                    }
                                    {parseInt(formikProps.values.salary_component_calc_type + "") === SalaryComponentCalculationType.FormulaBased &&
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Formula", name: "salary_component_calculation_formula", placeholder: "Enter Formula", required: true }} />
                                                <small>basic_pay - Monthly Basic Pay</small>
                                            </div>
                                        </div>
                                    }
                                    <div className="row py-3">
                                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "Applicable Cycle in Bi-Monthly", name: "salary_component_bi_month_applicable_cycle", options: ApplicableCycleOptions, required: true }} />
                                        </div>
                                    </div>
                                    <div className="row py-3">
                                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "Statistical Component", name: "salary_component_is_statistical", options: StatisticalOptions, required: true }} />
                                        </div>
                                    </div>
                                    {parseInt(formikProps.values.salary_component_type + "") === SalaryComponentType.Allowance &&
                                        <div className="row py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "Tax Applicable For Component", name: "salary_component_tax_applicable", options: taxApplicableOptions, required: true }} />
                                            </div>
                                        </div>
                                    }
                                    <div className="row px-2 py-3">
                                        <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                            <FormField formik={formikProps} fieldProps={{ fieldType: "switch", label: "Status", name: "salary_component_status" }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row btn-form-submit">
                                    <button type="button" className="button1" onClick={closeDialog}>Cancel</button>
                                    <button type="button" className="button2" disabled={formikProps.isSubmitting} onClick={() => {
                                        console.log(formikProps.errors, "formik error")
                                        formikProps.submitForm();
                                        if (!formikProps.isValid) {
                                            toast.error("Please ensure all fields are filled and valid!");
                                        }
                                    }}>{editMode ? 'Save Changes' : 'Add Now'}</button>
                                </div>
                            </Form>
                        </div>
                    )}
                </Formik>
            )}
        </Drawer>
    );
};

export default SalaryComponentEntryDialog;
