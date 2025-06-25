import { Drawer } from '@mui/material';
import { FieldArray, Form, Formik, FormikHelpers, FormikValues } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from '../common/DataTypes';
import { InitialData } from './InitialData';
import toast from 'react-hot-toast';
import { getDataFromAPI, getLoginCompanyID } from '../common/Utilities';
import { useAppStateAPI } from '../common/AppStateAPI';
import { API, LeaveCreditPeriod, LeaveCreditType, LeaveTypeUnclaimedOperation, ProjectStrings } from '../common/Constants';
import { ServerAPI } from '../common/ServerAPI';
import * as Yup from 'yup';

const LeavePlanEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, reloadData: any, id?: number, }> = ({ showDialog, closeDialog, reloadData, id }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [initialValue, setInitialValue] = useState<APIData.LeavePlan>(InitialData.LeavePlan);
    const formikRef = useRef<APIData.LeavePlan>(null)
    const [editMode, setEditMode] = useState(false);
    console.log(formikRef.current?.leave_plan_leave_types, "ref leave plan")
    // const [stateOption, setStateOption] = useState<FormDataTypes.SelectOption[]>([]);
    const availableProbation: FormDataTypes.SelectOption[] = [{ label: 'Yes', value: "1" }, { label: "No", value: "0" }];
    const creditNoticePeriod: FormDataTypes.SelectOption[] = [{ label: 'Yes', value: "1" }, { label: "No", value: "0" }];
    const availedNoticePeriod: FormDataTypes.SelectOption[] = [{ label: 'Yes', value: "1" }, { label: "No", value: "0" }];
    const creditLeaves: FormDataTypes.SelectOption[] = [{ label: 'Yes', value: "1" }, { label: "No", value: "0" }];
    const [formDataSet, setFormDataSet] = useState(false);
    const [leaveTypeOption, setLeaveTypeOption] = useState<FormDataTypes.SelectOption[]>([]);
    const LeaveAllocationTypeOptions: FormDataTypes.SelectOption[] = [{ label: 'Pre Credit', value: LeaveCreditType.PreCredit + "" }, { label: "Claimed Based", value: LeaveCreditType.ClaimBased + "" }];
    const LeaveCreditPeriodOptions: FormDataTypes.SelectOption[] = [{ label: 'Yearly', value: LeaveCreditPeriod.Yearly + "" }, { label: "Monthly", value: LeaveCreditPeriod.Monthly + "" }];
    const LeaveUnclaimedOperationOptions: FormDataTypes.SelectOption[] = [{ label: 'Lapse', value: LeaveTypeUnclaimedOperation.Lapse + "" }, { label: "Encash", value: LeaveTypeUnclaimedOperation.Encash + "" }, { label: "Carry-Over", value: LeaveTypeUnclaimedOperation.CarryOver + "" }];

    useEffect(() => {
        getDataFromAPI(API.EndPoint.LEAVE_TYPES, setLeaveTypeOption, addProcessingRequests, reduceProcessingRequests, null, true, 'leave_type_id', 'leave_type_name', 'leave_types');
        setFormDataSet(true);
    }, []);

    // useEffect(() => {
    //     if (id !== undefined && id !== 0) {
    //         addProcessingRequests();
    //         ServerAPI.getLeavePlanDetail(id).then(response => {
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

    useEffect(() => {
        if (id !== undefined && id !== 0) {
            addProcessingRequests();
            ServerAPI.getLeavePlanDetail(id).then(response => {
                if (response) {
                    const leavePlanLeaveTypes = response.leave_types.map((leaveType: any) => ({
                        leave_type_id: leaveType.leave_type_id,
                        leave_plan_leave_type_allocation_type: leaveType.leave_plan_leave_type_allocation_type,
                        leave_plan_leave_type_available_for_probation: leaveType.leave_plan_leave_type_available_for_probation,
                        leave_plan_leave_type_can_avail_in_notice_period: leaveType.leave_plan_leave_type_can_avail_in_notice_period,
                        leave_plan_leave_type_credit_day: leaveType.leave_plan_leave_type_credit_day,
                        leave_plan_leave_type_credit_month: leaveType.leave_plan_leave_type_credit_month,
                        leave_plan_leave_type_credit_period: leaveType.leave_plan_leave_type_credit_period,
                        leave_plan_leave_type_credit_eligible_worked_days: leaveType.leave_plan_leave_type_credit_eligible_worked_days,
                        leave_plan_leave_type_credit_count: leaveType.leave_plan_leave_type_credit_count,
                        leave_plan_leave_type_unclaimed_operation_year_end: leaveType.leave_plan_leave_type_unclaimed_operation_year_end,
                        leave_plan_leave_type_unclaimed_operation_month_end: leaveType.leave_plan_leave_type_unclaimed_operation_month_end,
                        leave_plan_leave_type_carry_over_percent_year_end: leaveType.leave_plan_leave_type_carry_over_percent_year_end,
                        leave_plan_leave_type_carry_over_percent_month_end: leaveType.leave_plan_leave_type_carry_over_percent_month_end,
                        leave_plan_leave_type_encashment_percent_year_end: leaveType.leave_plan_leave_type_encashment_percent_year_end,
                        leave_plan_leave_type_encashment_percent_month_end: leaveType.leave_plan_leave_type_encashment_percent_month_end,
                        leave_plan_leave_type_credit_in_notice_period: leaveType.leave_plan_leave_type_credit_in_notice_period,
                        leave_plan_leave_type_credit_doj_eligibility: leaveType.leave_plan_leave_type_credit_doj_eligibility,
                        leave_plan_leave_type_credit_eligible_doj_month: leaveType.leave_plan_leave_type_credit_eligible_doj_month,
                        leave_plan_leave_type_credit_eligible_doj_day: leaveType.leave_plan_leave_type_credit_eligible_doj_day
                    }));
                    setInitialValue({
                        company_id: response.company_id,
                        // leave_plan_id: response.leave_plan_id,
                        leave_plan_name: response.leave_plan_name,
                        leave_plan_status: response.leave_plan_status,
                        leave_plan_leave_types: leavePlanLeaveTypes
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
        leave_plan_name: Yup.string().required(ProjectStrings.ValidationRequired),
        leave_plan_leave_types: Yup.array().of(Yup.object().shape({
            leave_type_ids: Yup.array().min(1, ProjectStrings.ValidationArrayEmpty).of(Yup.number().required(ProjectStrings.ValidationRequired)),
            leave_plan_leave_type_allocation_type: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
            // leave_plan_leave_type_unclaimed_operation: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
            // leave_plan_leave_type_credit_period: Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired),
            // leave_plan_leave_type_credit_month: Yup.number().when('leave_plan_leave_type_credit_period', ([leave_plan_leave_type_credit_period], schema) => {
            //     if (parseInt(leave_plan_leave_type_credit_period) === LeaveCreditPeriod.Yearly) {
            //         return Yup.number().notOneOf([0], ProjectStrings.ValidationSelect).required(ProjectStrings.ValidationRequired);
            //     }
            //     return schema;
            // }),
            // leave_plan_leave_type_credit_day: Yup.number().required(ProjectStrings.ValidationRequired).min(1, 'Credit Day of Month must be greater than or equal to 1').max(31, 'Credit Day of Month must be less than or equal to 31'),
            // leave_plan_leave_type_credit_eligible_worked_days: Yup.number().required(ProjectStrings.ValidationRequired),
            // leave_plan_leave_type_credit_count: Yup.number().required(ProjectStrings.ValidationRequired),
            // leave_plan_leave_type_credit_day: Yup.number().when('leave_plan_leave_type_allocation_type', ([leave_plan_leave_type_allocation_type], schema) => {
            //     if (parseInt(leave_plan_leave_type_allocation_type) === LeaveCreditType.PreCredit) {
            //         return Yup.number().required(ProjectStrings.ValidationRequired).min(1, 'Credit Day of Month must be greater than or equal to 1').max(31, 'Credit Day of Month must be less than or equal to 31')
            //     }
            //     return schema;
            // }),
            // leave_plan_leave_type_carry_over_percentage: Yup.number().when('leave_plan_leave_type_unclaimed_operation', ([leave_plan_leave_type_unclaimed_operation], schema) => {
            //     if (parseInt(leave_plan_leave_type_unclaimed_operation) === LeaveTypeUnclaimedOperation.CarryOver) {
            //         return Yup.number()
            //             .required(ProjectStrings.ValidationRequired)
            //             .min(0, 'Value cannot be negative')
            //             .notOneOf([0], 'Value cannot be 0');
            //     }
            //     return schema;
            // }),
            // leave_plan_leave_type_encashment_percentage: Yup.number().when('leave_plan_leave_type_unclaimed_operation', ([leave_plan_leave_type_unclaimed_operation], schema) => {
            //     if (parseInt(leave_plan_leave_type_unclaimed_operation) === LeaveTypeUnclaimedOperation.Encash) {
            //         return Yup.number()
            //             .required(ProjectStrings.ValidationRequired)
            //             .min(0, 'Value cannot be negative')
            //             .notOneOf([0], 'Value cannot be 0');
            //     }
            //     return schema;
            // }),
        })).min(1, ProjectStrings.ValidationArrayEmpty),
    });


    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-min-1">
            {formDataSet && (
                <Formik enableReinitialize={true} validateOnChange={false} validationSchema={yupSchema} initialValues={initialValue} onSubmit={(values, { setSubmitting }) => {
                    let submitValues: any = { ...values };

                    for (const leaveType of submitValues.leave_plan_leave_types) {
                        if (leaveType.leave_plan_leave_type_allocation_type === LeaveCreditType.PreCredit + "") {
                            if (leaveType.leave_plan_leave_type_unclaimed_operation_year_end === LeaveTypeUnclaimedOperation.CarryOver + "") {
                                if (!leaveType.leave_plan_leave_type_carry_over_percent_year_end) {
                                    toast.error("CarryOver percentage of Year should be greater than 0");
                                    setSubmitting(false);
                                    return
                                }
                            }

                            if (leaveType.leave_plan_leave_type_unclaimed_operation_month_end === LeaveTypeUnclaimedOperation.CarryOver + "") {
                                if (!leaveType.leave_plan_leave_type_carry_over_percent_month_end) {
                                    toast.error("CarryOver percentage of Month should be greater than 0");
                                    setSubmitting(false);
                                    return
                                }
                            }

                            if (!leaveType.leave_plan_leave_type_credit_period) {
                                toast.error("Credit interval is required");
                                setSubmitting(false);
                                return
                            }
                            if (leaveType.leave_plan_leave_type_credit_period === LeaveCreditPeriod.Yearly + "") {
                                if (!leaveType.leave_plan_leave_type_unclaimed_operation_year_end) {
                                    toast.error("Unclaimed Operation for Year is required");
                                    setSubmitting(false);
                                    return
                                }
                            }
                            if (leaveType.leave_plan_leave_type_unclaimed_operation_year_end === LeaveTypeUnclaimedOperation.CarryOver + "" || leaveType.leave_plan_leave_type_credit_period === LeaveCreditPeriod.Monthly + "") {
                                if (!leaveType.leave_plan_leave_type_unclaimed_operation_month_end) {
                                    toast.error("Unclaimed Operation for Month is required");
                                    setSubmitting(false);
                                    return
                                }
                            }
                            if (leaveType.leave_plan_leave_type_unclaimed_operation_year_end === LeaveTypeUnclaimedOperation.Encash + "") {
                                if (!leaveType.leave_plan_leave_type_encashment_percent_year_end) {
                                    toast.error("Encashment percentage of Year should be greater than 0");
                                    setSubmitting(false);
                                    return
                                }
                            }
                            if (leaveType.leave_plan_leave_type_unclaimed_operation_month_end === LeaveTypeUnclaimedOperation.Encash + "") {
                                if (!leaveType.leave_plan_leave_type_encashment_percent_month_end) {
                                    toast.error("Encashment percentage of Month should be greater than 0");
                                    setSubmitting(false);
                                    return
                                }
                            }
                            if (leaveType.leave_plan_leave_type_credit_period === LeaveCreditPeriod.Yearly + "") {
                                if (!leaveType.leave_plan_leave_type_credit_month) {
                                    toast.error("Credit Month Required");
                                    setSubmitting(false);
                                    return;
                                }
                            }
                            if (leaveType.leave_plan_leave_type_credit_period === LeaveCreditPeriod.Yearly + "" && leaveType.leave_plan_leave_type_credit_doj_eligibility === "1") {
                                if (!leaveType.leave_plan_leave_type_credit_eligible_doj_month) {
                                    toast.error("Date of Joining Month Required");
                                    setSubmitting(false);
                                    return;
                                }
                            }
                            if (leaveType.leave_plan_leave_type_credit_doj_eligibility === "1") {
                                if (!leaveType.leave_plan_leave_type_credit_eligible_doj_day || leaveType.leave_plan_leave_type_credit_eligible_doj_day > 31) {
                                    toast.error("Date of Joining Day must be between 1 and 31");
                                    setSubmitting(false);
                                    return;
                                }
                            }
                            // if (leaveType.leave_plan_leave_type_allocation_type === LeaveCreditType.PreCredit + "") {
                            if (!leaveType.leave_plan_leave_type_credit_count || leaveType.leave_plan_leave_type_credit_count > 31) {
                                toast.error("Credit Day of Month must be between 1 and 31");
                                setSubmitting(false);
                                return;
                            }
                            if (!leaveType.leave_plan_leave_type_credit_day || leaveType.leave_plan_leave_type_credit_day > 31) {
                                toast.error("No of Days to credit must be between 1 and 31");
                                setSubmitting(false);
                                return;
                            }
                            // }
                        }
                    }
                    // submitValues.leave_plan_leave_types.leave_plan_leave_type_encashment_percent_month_end = parseInt(submitValues.leave_plan_leave_types.leave_plan_leave_type_encashment_percent_month_end);
                    // submitValues.leave_plan_leave_types.leave_plan_leave_type_encashment_percent_year_end = parseInt(submitValues.leave_plan_leave_types.leave_plan_leave_type_encashment_percent_year_end);
                    // submitValues.leave_plan_leave_types.leave_plan_leave_type_unclaimed_operation_month_end = parseInt(submitValues.leave_plan_leave_types.leave_plan_leave_type_unclaimed_operation_month_end);
                    // submitValues.leave_plan_leave_types.leave_plan_leave_type_unclaimed_operation_year_end = parseInt(submitValues.leave_plan_leave_types.leave_plan_leave_type_unclaimed_operation_year_end);
                    // submitValues.leave_plan_leave_types.leave_plan_leave_type_credit_period = parseInt(submitValues.leave_plan_leave_types.leave_plan_leave_type_credit_period);

                    submitValues.leave_plan_leave_types.map((item: any, index: number) => {
                        item.leave_plan_leave_type_encashment_percent_month_end = parseInt(item.leave_plan_leave_type_encashment_percent_month_end);
                        item.leave_plan_leave_type_encashment_percent_year_end = parseInt(item.leave_plan_leave_type_encashment_percent_year_end);
                        item.leave_plan_leave_type_unclaimed_operation_month_end = parseInt(item.leave_plan_leave_type_unclaimed_operation_month_end);
                        item.leave_plan_leave_type_unclaimed_operation_year_end = parseInt(item.leave_plan_leave_type_unclaimed_operation_year_end);
                        item.leave_plan_leave_type_credit_period = parseInt(item.leave_plan_leave_type_credit_period);
                        if (item.leave_plan_leave_type_unclaimed_operation_year_end !== LeaveTypeUnclaimedOperation.CarryOver &&
                            item.leave_plan_leave_type_credit_period !== LeaveCreditPeriod.Monthly) {
                            item.leave_plan_leave_type_unclaimed_operation_month_end = 0;
                            item.leave_plan_leave_type_encashment_percent_month_end = 0;
                            item.leave_plan_leave_type_carry_over_percent_month_end = 0;
                        }
                        if (item.leave_plan_leave_type_unclaimed_operation_year_end === LeaveTypeUnclaimedOperation.Encash) {
                            item.leave_plan_leave_type_carry_over_percent_year_end = 0;
                        }
                        if (item.leave_plan_leave_type_unclaimed_operation_year_end === LeaveTypeUnclaimedOperation.CarryOver) {
                            item.leave_plan_leave_type_encashment_percent_year_end = 0;
                        }
                        if (item.leave_plan_leave_type_unclaimed_operation_month_end === LeaveTypeUnclaimedOperation.Encash && item.leave_plan_leave_type_credit_period === LeaveCreditPeriod.Monthly) {
                            item.leave_plan_leave_type_encashment_percent_year_end = 0;
                        }
                        if (item.leave_plan_leave_type_unclaimed_operation_month_end === LeaveTypeUnclaimedOperation.Encash) {
                            item.leave_plan_leave_type_carry_over_percent_month_end = 0;
                        }
                        if (item.leave_plan_leave_type_unclaimed_operation_month_end === LeaveTypeUnclaimedOperation.CarryOver && item.leave_plan_leave_type_credit_period === LeaveCreditPeriod.Monthly) {
                            item.leave_plan_leave_type_carry_over_percent_year_end = 0;
                        }
                        if (item.leave_plan_leave_type_unclaimed_operation_month_end === LeaveTypeUnclaimedOperation.CarryOver) {
                            item.leave_plan_leave_type_encashment_percent_month_end = 0;
                        }
                        if (item.leave_plan_leave_type_credit_period === LeaveCreditPeriod.Yearly) {
                            item.leave_plan_leave_type_unclaimed_operation_month_end = 0;
                        }
                        if (item.leave_plan_leave_type_credit_period === LeaveCreditPeriod.Monthly) {
                            item.leave_plan_leave_type_unclaimed_operation_year_end = 0;
                        }
                        if (item.leave_plan_leave_type_unclaimed_operation_year_end === LeaveTypeUnclaimedOperation.Lapse) {
                            item.leave_plan_leave_type_encashment_percent_year_end = 0;
                            item.leave_plan_leave_type_carry_over_percent_year_end = 0;
                        }
                    });


                    if (id != undefined && id != 0) {
                        addProcessingRequests();
                        ServerAPI.updateLeavePlan(submitValues, id).then(response => {
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
                        // submitValues['leave_plan_leave_type_can_avail_in_notice_period'] = '1' ? true : false;
                        // submitValues['leave_plan_leave_type_credit_in_notice_period'] = '1' ? true : false;
                        // submitValues['leave_plan_leave_type_available_for_probation'] = '1' ? true : false;
                        submitValues['company_id'] = getLoginCompanyID();
                        addProcessingRequests();
                        ServerAPI.addLeavePlan(submitValues).then(response => {
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
                                {/* <h4 className="title-text text-center">{editMode ? 'Edit' : 'Add New'} Rest Days Group</h4> */}
                                <p className="detailed-heading mt-3">{editMode ? 'Edit' : 'Add New'} Leave Plan</p>
                                <div className="custom-border-grey my-2"></div>
                                <Form className='pl-2 pr-2'>
                                    <div className="px-2 form-field-container">
                                        <div className="row px-2 py-3">
                                            <div className="col-lg-10 col-md-10 col-xl-10 text-field-empty-custom-user holiday-group">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "textbox", label: "Leave Plan Name", name: "leave_plan_name", placeholder: "Enter Leave Plan Name", required: true }} />
                                            </div>
                                            {formikProps.values.leave_plan_leave_types && formikProps.values.leave_plan_leave_types.length === 0 && (
                                                <div className="col-lg-2 col-md-2 col-xl-2 m-auto">
                                                    {/* <button type="button" className="add-multiple-leave-palns-img" onClick={() => formikProps.setFieldValue('leave_plan_leave_types', [InitialData.LeavePlanLeaveType])}><img src="/assets/svg/leave-add.svg" alt="" width={"35px"} height={"35px"} /> </button> */}
                                                    <div className='add-multiple-leave-palns-img' onClick={() => formikProps.setFieldValue('leave_plan_leave_types', [InitialData.LeavePlanLeaveType])}> <img src={window.location.origin + "/assets/svg/leave-add.svg"} alt="" width={"35px"} height={"35px"} /> </div>
                                                </div>
                                            )}
                                        </div>
                                        <FieldArray name="leave_plan_leave_types">
                                            {({ insert, remove, push }) => (
                                                <div>
                                                    {formikProps.values.leave_plan_leave_types != undefined && formikProps.values.leave_plan_leave_types.length > 0 &&
                                                        <>
                                                            {formikProps.values.leave_plan_leave_types.map((data, index) => {
                                                                const uniqueKey = `${index}-${data.leave_type_id}`;

                                                                return (
                                                                    <div className='form-box' key={uniqueKey}>
                                                                        <div className="row px-2 py-3">
                                                                            <div className="col-lg-10 col-md-10 col-xl-10 text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Leave Type", name: `leave_plan_leave_types.${index}.leave_type_id`, placeholder: "Select Leave Type", options: leaveTypeOption, required: true }} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row px-2 py-3">
                                                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "Select leave credit type", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_allocation_type`, options: LeaveAllocationTypeOptions, required: true }} />
                                                                            </div>
                                                                        </div>
                                                                        {formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_allocation_type.toString() === LeaveCreditType.PreCredit + "" && (
                                                                            <>
                                                                                <div className="row py-3">
                                                                                    <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Credit Interval", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_credit_period`, placeholder: "Select Credit Interval", options: LeaveCreditPeriodOptions, required: true }} />
                                                                                    </div>

                                                                                    {formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_credit_period.toString() === LeaveCreditPeriod.Yearly + "" && (
                                                                                        <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                                                                            <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Credit Month", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_credit_month`, options: Array.from({ length: 12 }, (_, i) => ({ label: `${new Date(0, i).toLocaleString('en', { month: 'long' }) || ""}`, value: `${i + 1}` })), required: true }} />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="row py-3">
                                                                                    <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "Credit Day Of Month", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_credit_day`, placeholder: "Enter Credit Day Of Month", required: true }} />
                                                                                    </div>
                                                                                    <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "Eligible Worked Day For Credit", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_credit_eligible_worked_days`, placeholder: "Enter Eligible Worked Day", required: true }} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="row py-3">
                                                                                    <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "Number Of Days To Credit", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_credit_count`, placeholder: "Enter No Of Days", required: true }} />
                                                                                    </div>
                                                                                    {formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_credit_period.toString() === LeaveCreditPeriod.Yearly + "" && <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user holiday-group">
                                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Process For Unclaimed Operation Year", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_unclaimed_operation_year_end`, placeholder: "Select Process", options: LeaveUnclaimedOperationOptions, required: true }} />
                                                                                    </div>}
                                                                                    {(formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_credit_period.toString() === LeaveCreditPeriod.Monthly + "" || formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_unclaimed_operation_year_end.toString() === LeaveTypeUnclaimedOperation.CarryOver + "") && <div className={`col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user holiday-group ${formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_unclaimed_operation_year_end.toString() === LeaveTypeUnclaimedOperation.CarryOver + "" && formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_credit_period.toString() === LeaveCreditPeriod.Yearly + "" ? "mt-4" : ''}`}>
                                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Process For Unclaimed Operation Month", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_unclaimed_operation_month_end`, placeholder: "Select Process", options: LeaveUnclaimedOperationOptions, required: true }} />
                                                                                    </div>}
                                                                                </div>
                                                                                <div className="row px-2 py-3">
                                                                                    <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "Will be available for probation?", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_available_for_probation`, options: availableProbation, required: true }} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="row px-2 py-3">
                                                                                    <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "Credit Leaves only if Date of Joining is on or before specific date", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_credit_doj_eligibility`, options: creditLeaves, required: true }} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="row py-3">
                                                                                    {(formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_credit_period.toString() === LeaveCreditPeriod.Yearly + "" && formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_credit_doj_eligibility == 1) &&
                                                                                        <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                                                                            <FormField formik={formikProps} fieldProps={{ fieldType: "select", label: "Date of Joining Month", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_credit_eligible_doj_month`, placeholder: "Select Date of Joining Month", options: Array.from({ length: 12 }, (_, i) => ({ label: `${new Date(0, i).toLocaleString('en', { month: 'long' }) || ""}`, value: `${i + 1}` })), required: true }} />
                                                                                        </div>}
                                                                                    {formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_credit_doj_eligibility == 1 && <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                                                                        <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "Date of Joining Day", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_credit_eligible_doj_day`, placeholder: "Enter Date of Joining Day", options: LeaveUnclaimedOperationOptions, required: true }} />
                                                                                    </div>}

                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        <div className="row px-2 py-3">
                                                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "Will be credited during notice period?", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_credit_in_notice_period`, options: creditNoticePeriod, required: true }} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row px-2 py-3">
                                                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                                                <FormField formik={formikProps} fieldProps={{ fieldType: "radio", label: "Can be availed during notice period?", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_can_avail_in_notice_period`, options: availedNoticePeriod, required: true }} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row py-3">
                                                                            {formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_unclaimed_operation_year_end == LeaveTypeUnclaimedOperation.CarryOver && formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_credit_period.toString() !== LeaveCreditPeriod.Monthly + "" && (
                                                                                <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "Carry Over Percentage Year", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_carry_over_percent_year_end`, placeholder: "Enter Carry Over Percentage", required: true }} />
                                                                                </div>
                                                                            )}
                                                                            {formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_unclaimed_operation_month_end == LeaveTypeUnclaimedOperation.CarryOver && (
                                                                                <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "Carry Over Percentage Month", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_carry_over_percent_month_end`, placeholder: "Enter Carry Over Percentage", required: true }} />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="row py-3">
                                                                            {formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_unclaimed_operation_month_end == LeaveTypeUnclaimedOperation.Encash && (
                                                                                <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "Encashment Percentage Month", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_encashment_percent_month_end`, placeholder: "Enter Encashment Percentage", required: true }} />
                                                                                </div>
                                                                            )}
                                                                            {formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_unclaimed_operation_year_end == LeaveTypeUnclaimedOperation.Encash && formikProps.values.leave_plan_leave_types[index].leave_plan_leave_type_credit_period.toString() !== LeaveCreditPeriod.Monthly + "" && (
                                                                                <div className="col-lg-6 col-md-6 col-xl-6 text-field-empty-custom-user">
                                                                                    <FormField formik={formikProps} fieldProps={{ fieldType: "number", label: "Encashment Percentage Year", name: `leave_plan_leave_types.${index}.leave_plan_leave_type_encashment_percent_year_end`, placeholder: "Enter Encashment Percentage", required: true }} />
                                                                                </div>
                                                                            )}

                                                                        </div>
                                                                        <div className='text-field-empty-custom-user add-multiple-leave-palns-container d-flex justify-content-end' style={{ gap: "10px", zIndex: "999", }}>
                                                                            <div className='add-multiple-leave-palns-img' onClick={() => push(InitialData.LeavePlanLeaveType)}> <img src={window.location.origin + "/assets/svg/leave-add.svg"} alt="" width={"35px"} height={"35px"} /> </div>
                                                                            <div className='add-multiple-leave-palns-img' onClick={() => remove(index)}> <img src={window.location.origin + "/assets/svg/leave-sub.svg"} alt="" width={"35px"} height={"35px"} /></div>
                                                                        </div>
                                                                    </div>
                                                                )

                                                            })}
                                                        </>}
                                                </div>
                                            )}
                                        </FieldArray>


                                        <div className="row px-2 py-3">
                                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                                                <FormField formik={formikProps} fieldProps={{ fieldType: "switch", label: "Status", name: "leave_plan_status" }} />
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
                                        }}>Submit</button>
                                    </div>
                                </Form>
                            </div>
                        )
                    }}
                </Formik>
            )
            }
        </Drawer >
    );
};

export default LeavePlanEntryDialog;
