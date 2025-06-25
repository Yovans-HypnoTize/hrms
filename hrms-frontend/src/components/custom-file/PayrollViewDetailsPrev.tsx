
import React, { useEffect, useState } from 'react';
import { APIData, FormDataTypes } from '../../common/DataTypes';
import { useAppStateAPI } from '../../common/AppStateAPI';
import { ServerAPI } from '../../common/ServerAPI';
import { API, SalaryComponentType, WorkTimeDayType, WorkTimeType } from '../../common/Constants';
import { getDataFromAPI } from '../../common/Utilities';
import { dividerClasses } from '@mui/material';

const PayrollViewDetails: React.FC = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = parseInt(urlParams.get('payroll_id') || '');
    const [payrollDetails, setPayrollDetails] = useState<APIData.PayrollListDetails[]>([]);
    console.log(payrollDetails, "payrollDetails")
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [holidayTypeOption, setHolidayTypeOption] = useState<FormDataTypes.SelectOption[]>([]);
    console.log(holidayTypeOption, "holiday")
    // const workTimeDayOptions: FormDataTypes.SelectOption[] = [{ label: 'Regular Day', value: WorkTimeDayType.RegularDay + "" }, { label: 'Rest Day', value: WorkTimeDayType.RestDay + "" }];
    // const workTimeOptions: FormDataTypes.SelectOption[] = [{ label: 'Normal', value: WorkTimeType.Normal + "" }, { label: 'OT', value: WorkTimeType.Ot + "" }, { label: 'Nd', value: WorkTimeType.Nd + "" }, { label: 'Nd OT', value: WorkTimeType.NdOt + "" }];

    const fetchTotalPayroll = () => {
        addProcessingRequests();
        ServerAPI.getTotalPayrun(id).then((response: any) => {
            if (response) {
                setPayrollDetails([{ employee_payroll_details: response.employee_payroll_details, payroll_summary: response.payroll_summary }]);
            }
        }).finally(() => {
            reduceProcessingRequests();
        });
    }

    useEffect(() => {
        fetchTotalPayroll();
        getDataFromAPI(API.EndPoint.HOLIDAY_TYPES, setHolidayTypeOption, addProcessingRequests, reduceProcessingRequests, null, true, 'holiday_type_id', 'holiday_type_name', 'holiday_types');
    }, [])

    const downloadEmployeeTemplate = () => {
        addProcessingRequests();
        const downloadFunction = ServerAPI.downloadEmpoyeePayrollExcelTemplate;
        downloadFunction(id).then(response => {
        }).finally(() => {
            reduceProcessingRequests();
        });
    }

    return (
        <>
            <a href="#" onClick={downloadEmployeeTemplate}> <img src={window.location.origin + "/assets/images/excel-icon.png"} alt="" style={{ width: "25px", height: "25px", margin: "10px 0" }} /> </a>
            {payrollDetails !== undefined &&
                <>  <div className='row mr-0 ml-0 mb-2 py-2 pl-0 d-flex align-items-center w-100 mt-2' style={{ textTransform: "capitalize" }}>
                    <div className='col-6 pl-0'>
                        <p className='additional-option-title mb-1'>pay run for January 2024 </p>
                    </div>

                    <div className="table-container p-0">
                        <div className="table-scroll">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className="color-native-blue">
                                        <tr>
                                            <th className='table-heading' >S. No </th>
                                            <th className='table-heading' >total employees </th>
                                            <th className='table-heading' >allowances total  </th>
                                            <th className='table-heading' >deductions total</th>
                                            {/* <th className='table-heading' >tax deductions</th> */}
                                            {/* <th className='table-heading' >additional allowances </th> */}
                                            <th className='table-heading' >final amount	</th>
                                        </tr>
                                    </thead>
                                    {payrollDetails.map((payroll, index) => <tbody key={index}>
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td ><span className='pay-run-report'>{payroll.payroll_summary.total_employees}</span></td>
                                            <td ><span className='pay-run-report'> {payroll.payroll_summary.total_allowances}</span></td>
                                            <td ><span className='pay-run-report'> {payroll.payroll_summary.total_deductions}</span></td>
                                            <td ><span className='pay-run-report'> {payroll.payroll_summary.total_final_amount}</span></td>
                                        </tr>
                                    </tbody>)}

                                </table>
                            </div>
                        </div>
                    </div>

                </div>

                    <div className='row mr-0 ml-0 mb-2 py-2 pl-0 d-flex align-items-center w-100 mt-2' style={{ textTransform: "capitalize" }}>
                        <div className='col-6 pl-0'>
                            <p className='additional-option-title mb-1'>Preview Of The Payroll Data</p>
                        </div>
                        <div className="table-container p-0">
                            <div className="table-scroll">
                                <div className="table-responsive">
                                    {payrollDetails.map((payroll, index) =>
                                        <table className="table">
                                            <thead className="color-native-blue">
                                                <tr>
                                                    {payroll.employee_payroll_details.data.map((data) => <>
                                                        <th className='table-heading' >S. No</th>
                                                        <th className='table-heading' >Employee Name</th>
                                                        <th className='table-heading' >No. Of Working Days</th>
                                                        <th className='table-heading' >No. Of leave</th>
                                                        <th className='table-heading' >Working Shift</th>
                                                        <th className='table-heading' >Regular Duration</th>
                                                        <th className='table-heading' >Regular Amount</th>
                                                        <th className='table-heading'>Regular OT Duration</th>
                                                        <th className='table-heading'>Regular OT Amount</th>
                                                        <th className='table-heading' >Nd Duration</th>
                                                        <th className='table-heading' >Nd Amount</th>
                                                        <th className='table-heading' >Nd OT Duration</th>
                                                        <th className='table-heading' >Nd OT Amount</th>
                                                        <th className='table-heading' >Rest Day Duration</th>
                                                        <th className='table-heading' >Rest Day Amount</th>
                                                        <th className='table-heading' >Rest Day Ot Duration</th>
                                                        <th className='table-heading' >Rest Day Ot Amount</th>
                                                        <th className='table-heading' >Rest Day Nd Duration</th>
                                                        <th className='table-heading' >Rest Day Nd Amount</th>
                                                        <th className='table-heading' >Rest Day Nd Ot Duration</th>
                                                        <th className='table-heading' >Rest Day Nd Ot Amount</th>
                                                        {data.employee_payroll_compensations.map((compensation, idx) => (
                                                            <>
                                                                {compensation.holiday_type_id > 0 && (
                                                                    <>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Regular Duration`}</th>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Regular Amount`}</th>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Regular Ot Duration`}</th>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Regular Ot Amount`}</th>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Regular Nd Duration`}</th>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Regular Nd Amount`}</th>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Regular Nd Ot Duration`}</th>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Regular Nd Ot Amount`}</th>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Rest Day Duration`}</th>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Rest Day Amount`}</th>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Rest Day Ot Duration`}</th>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Rest Day Ot Amount`}</th>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Rest Day Nd Duration`}</th>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Rest Day Nd Amount`}</th>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Rest Day Nd Ot Duration`}</th>
                                                                        <th className='table-heading'>{`${compensation.holiday_type_name} - Rest Day Nd Ot Amount`}</th>
                                                                    </>
                                                                )}
                                                            </>
                                                        ))}

                                                        <th className='table-heading' >Loss Of Pay</th>
                                                        <th className='table-heading' >Allowance</th>
                                                        <th className='table-heading' >Deductions</th>
                                                        <th className='table-heading' >Total pay</th>
                                                        {/* <th className='table-heading' >Action</th> */}
                                                        {/* <th className='table-heading' >Status</th> */}</>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody key={index}>
                                                <tr>
                                                    {payroll.employee_payroll_details.data.map((data) => <>
                                                        <td>{index + 1}</td>
                                                        <td ><span className='pay-run-report'>{data.employee_name}</span></td>
                                                        <td ><span className='pay-run-report'>{data.no_of_working_days}</span></td>
                                                        <td ><span className='pay-run-report'>{data.leave_days}</span></td>
                                                        <td ><span className='pay-run-report'>{data.working_shift}</span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Normal && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Normal && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Ot && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Ot && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Nd && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Nd) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.NdOt && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.NdOt && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Normal && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Normal && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Ot && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Ot && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Nd && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Nd && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.NdOt && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.NdOt && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>


                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Normal && compensation.holiday_type_id > 0) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Normal && compensation.holiday_type_id > 0) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Ot && compensation.holiday_type_id > 0) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Ot && compensation.holiday_type_id > 0) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Nd && compensation.holiday_type_id > 0) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Nd && compensation.holiday_type_id > 0) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.NdOt && compensation.holiday_type_id > 0) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RegularDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.NdOt && compensation.holiday_type_id > 0) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Normal && compensation.holiday_type_id > 0) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Normal && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Ot && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Ot && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Nd) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.Nd && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.NdOt && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_duration;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_compensations.map(compensation => {
                                                                if (compensation.employee_payroll_comp_day_type === WorkTimeDayType.RestDay &&
                                                                    compensation.employee_payroll_comp_work_time_type === WorkTimeType.NdOt && compensation.holiday_type_id === 0 || undefined) {
                                                                    return compensation.employee_payroll_comp_calculated_amount;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td ><span className='pay-run-report'>{data.loss_of_pay_days}</span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_components.map(compensation => {
                                                                if (compensation.employee_payroll_component_type === SalaryComponentType.Allowance) {
                                                                    return compensation.employee_payroll_component_calculated_value;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td><span className='pay-run-report'>
                                                            {data.employee_payroll_components.map(compensation => {
                                                                if (compensation.employee_payroll_component_type === SalaryComponentType.Deduction) {
                                                                    return compensation.employee_payroll_component_calculated_value;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            })} </span></td>
                                                        <td ><span className='pay-run-report'>{data.total_pay}</span></td>
                                                    </>)}

                                                    {/* <td> <i className="fas fa-trash-alt text-danger font-16" aria-hidden="true"></i></td> */}

                                                </tr>
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
        </>
    );
};

export default PayrollViewDetails;