
import React, { useEffect, useRef, useState } from 'react';
import { APIData, FormDataTypes } from '../../common/DataTypes';
import { useAppStateAPI } from '../../common/AppStateAPI';
import { ServerAPI } from '../../common/ServerAPI';
import { SalaryComponentType, TotalPayrunStatus, WorkTimeDayType, WorkTimeType } from '../../common/Constants';
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';

interface DispHolidayType {
    holiday_type_id: number;
    holiday_type_name: string;
}

interface DispWorktimeType {
    holiday_type_id: number | null;
    holiday_type_name: string;
    day_type: number;
    day_type_name: string;
    work_time_type: number;
    work_time_type_name: string;
}

interface DispComponent {
    component_type: number;
    component_name: string;
    component_abbreviation: string;
    component_description: string;
}

const PayrollViewDetails: React.FC = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = parseInt(urlParams.get('payroll_id') || '');
    const month = urlParams.get('payroll_month') || '';
    const [payrollDetails, setPayrollDetails] = useState<APIData.PayrollListDetails>();
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [displayWorkTimeTypes, setDisplayWorkTimeTypes] = useState<DispWorktimeType[]>([]);
    const [totalpayrunStatus, setTotalpayrunStatus] = useState("");
    const tableContainerRef = useRef<HTMLDivElement>(null);
    var searchTimeout: any = null;
    const [searchString, setSearchString] = useState('');
    console.log(totalpayrunStatus, "status")
    const dayTypes: FormDataTypes.SelectOption[] = [
        { value: WorkTimeDayType.RegularDay + "", label: 'Regular' },
        { value: WorkTimeDayType.RestDay + "", label: 'Rest' }
    ];
    const workTimeTypes: FormDataTypes.SelectOption[] = [
        { value: WorkTimeType.Normal + "", label: 'Work' },
        { value: WorkTimeType.Ot + "", label: 'OT' },
        { value: WorkTimeType.Nd + "", label: 'ND' },
        { value: WorkTimeType.NdOt + "", label: 'ND OT' },
    ];
    const [availableCompoents, setAvailableCompoents] = useState<DispComponent[]>([]);

    const fetchTotalPayroll = () => {
        addProcessingRequests();
        ServerAPI.getTotalPayrun(id).then((response: any) => {
            if (response) {
                const empPayrollData: APIData.PayrollListDetails = response;
                const availComps: DispComponent[] = [];
                empPayrollData.employee_payroll_details.data.forEach(empData => {
                    empData.employee_payroll_components.forEach(empCompData => {
                        const existComp = availComps.find(comp => comp.component_name === empCompData.employee_payroll_component_name);
                        if (!existComp) {
                            availComps.push({
                                component_type: empCompData.employee_payroll_component_type,
                                component_name: empCompData.employee_payroll_component_name,
                                component_abbreviation: empCompData.employee_payroll_component_abbreviation,
                                component_description: empCompData.employee_payroll_component_description
                            });
                        }
                    })
                })
                setPayrollDetails(empPayrollData);
                setAvailableCompoents(availComps);
                setTotalpayrunStatus(response.payroll_summary.payslip_status);
                console.log(response.payroll_summary.payslip_status, "Total Payrun Status"); // Log the status here
                // console.log(availComps, "available compoenents")
            }
        }).finally(() => {
            reduceProcessingRequests();
        });
    }

    useEffect(() => {
        fetchHolidayTypes();
        fetchTotalPayroll();

    }, [])

    useEffect(() => {
        const reloadTotalPayroll = () => {
            if (!totalpayrunStatus && totalpayrunStatus !== "20") {
                const timeoutId = setTimeout(() => {
                    fetchTotalPayroll();
                }, 5000);
                return () => clearTimeout(timeoutId);
            }
            console.log("vlllv")
        };
        reloadTotalPayroll();
    }, [totalpayrunStatus])

    const fetchHolidayTypes = () => {
        addProcessingRequests();
        ServerAPI.getHolidayTypes().then((response: any) => {
            if (response) {
                const holTypes: DispHolidayType[] = [{ holiday_type_id: 0, holiday_type_name: '' }];
                if (response.holiday_types && response.holiday_types.length > 0) {
                    response.holiday_types.forEach((holType: DispHolidayType) => {
                        holTypes.push({ holiday_type_id: holType.holiday_type_id, holiday_type_name: holType.holiday_type_name });
                    });
                    // console.log(holTypes, "holiday types data structure")
                }
                const dispData: DispWorktimeType[] = [];
                holTypes.forEach((holType: DispHolidayType) => {
                    dayTypes.forEach(dayType => {
                        workTimeTypes.forEach(workTimeType => {
                            const dispWorkTimeType: DispWorktimeType = {
                                holiday_type_id: holType.holiday_type_id > 0 ? holType.holiday_type_id : null,
                                holiday_type_name: holType.holiday_type_name,
                                day_type: parseInt(dayType.value),
                                day_type_name: dayType.label,
                                work_time_type: parseInt(workTimeType.value),
                                work_time_type_name: workTimeType.label
                            }
                            dispData.push(dispWorkTimeType);
                        });
                    });
                });
                setDisplayWorkTimeTypes(dispData.slice(1));
                // console.log('Framed Display Data', dispData.slice(1));
            }
        }).finally(() => {
            reduceProcessingRequests();
        });
    }

    const downloadEmployeeTemplate = () => {
        addProcessingRequests();
        const downloadFunction = ServerAPI.downloadEmpoyeePayrollExcelTemplate;
        downloadFunction(id).then(response => {
        }).finally(() => {
            reduceProcessingRequests();
        });
    }

    const formatMonthYear = (dateStr: string): string => {
        // Create a Date object from the date string
        const date = new Date(dateStr);

        // Use toLocaleDateString to format the month and year
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    // useEffect(() => {
    //     const handleScroll = (event: WheelEvent) => {
    //         if (tableContainerRef.current?.matches(':hover')) {
    //             tableContainerRef.current.scrollLeft += event.deltaY;
    //             event.preventDefault();
    //         }
    //     };

    //     const tableContainer = tableContainerRef.current;
    //     tableContainer?.addEventListener('wheel', handleScroll);

    //     return () => {
    //         tableContainer?.removeEventListener('wheel', handleScroll);
    //     };
    // }, []);

    return (
        <>
            <div className='d-flex justify-content-end w-100'>
            </div>
            {payrollDetails !== undefined &&
                <>
                    <div className='row mr-0 ml-0 mb-2 py-2 pl-0 d-flex align-items-center w-100 mt-2' style={{ textTransform: "capitalize" }}>
                        <div className='col-12 pl-0 payslip-buttons'>
                            <p className='additional-option-title mb-1'>Process Pay Run {month ? 'for ' + formatMonthYear(month) : ''}</p>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <a href="#" onClick={downloadEmployeeTemplate}> <img src={window.location.origin + "/assets/images/excel-icon.png"} alt="" style={{ width: "25px", height: "25px", margin: "10px 0" }} /> </a>
                                {payrollDetails.payroll_summary.payslip_status === TotalPayrunStatus.Completed ? <a className='toggle-button active h-100 payslip-a' href={payrollDetails.payroll_summary.payslipzip_url} download>Download Payslip Zip</a> : <button className='toggle-button h-100 payslip-a' style={{ backgroundColor: "#F2F2F2", color: "#cdcccd" }} disabled>Processing Payslip Zip</button>}
                            </div>
                        </div>

                        <div className="table-container p-0">
                            <div className="table-scroll">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className="color-native-blue">
                                            <tr>
                                                <th className='table-heading' >S. No </th>
                                                <th className='table-heading' >total employees </th>
                                                {/* <th className='table-heading' >allowances total  </th>
                                                <th className='table-heading' >deductions total</th> */}
                                                {/* <th className='table-heading' >tax deductions</th> */}
                                                {/* <th className='table-heading' >additional allowances </th> */}
                                                <th className='table-heading' >final amount	</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td ><span className='pay-run-report'>{payrollDetails.payroll_summary.total_employees}</span></td>
                                                {/* <td ><span className='pay-run-report'> {payrollDetails.payroll_summary.total_allowances}</span></td>
                                                <td ><span className='pay-run-report'> {payrollDetails.payroll_summary.total_deductions}</span></td> */}
                                                <td ><span className='pay-run-report'> {payrollDetails.payroll_summary.total_final_amount}</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row mr-0 ml-0 mb-2 py-2 pl-0 d-flex align-items-center w-100 mt-2' style={{ textTransform: "capitalize" }}>
                        <div className='col-12 pl-0 details_payroll'>
                            <p className='additional-option-title mb-1'>Preview Of The Payroll Data</p>
                            <div className='d-flex justify-content-start p-0 mt-3' style={{ gap: "10px" }}>
                                <> <input type="text" className='search-option' placeholder='Search By Keywords' value={searchString} onChange={(e: any) => {
                                    if (searchTimeout) clearTimeout(searchTimeout);
                                    setSearchString(e.target.value);
                                }} />
                                    <Icon path={mdiMagnify} size={1} className='search-icon' />
                                </>
                            </div>
                        </div>
                        {/* <div className='col-6 pl-0 d'>
                        </div> */}
                        <div className="table-container p-0">
                            <div className="table-scroll">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className="color-native-blue">
                                            <tr>
                                                <th className='table-heading' >S. No</th>
                                                <th className='table-heading' >Employee Name</th>
                                                <th className='table-heading' >No. Of Working Days</th>
                                                <th className='table-heading' >No. Of leave</th>
                                                {/* <th className='table-heading' >Working Shift</th> */}
                                                <th className='table-heading' >Regular Work Duration</th>
                                                {displayWorkTimeTypes.map((dispWorkTimeType, wkIndex) =>
                                                    <th className='table-heading' key={wkIndex} > {dispWorkTimeType.holiday_type_name + ' ' + dispWorkTimeType.day_type_name + ' ' + dispWorkTimeType.work_time_type_name} Duration</th>
                                                )}
                                                <th className='table-heading' >Regular Work Amount</th>
                                                {displayWorkTimeTypes.map((dispWorkTimeType, wkIndex) =>
                                                    <th className='table-heading' key={wkIndex}>{dispWorkTimeType.holiday_type_name + ' ' + dispWorkTimeType.day_type_name + ' ' + dispWorkTimeType.work_time_type_name} Amount</th>
                                                )}
                                                <th className='table-heading' >Basic Pay</th>
                                                <th className='table-heading' >Loss Of Pay</th>
                                                {availableCompoents.filter(cmp => cmp.component_type === SalaryComponentType.Allowance).map((availableComp, cmpIdx) => <th className='table-heading' key={cmpIdx}>{availableComp.component_abbreviation}</th>)}
                                                {availableCompoents.filter(cmp => cmp.component_type === SalaryComponentType.Deduction).map((availableComp, cmpIdx) => <th className='table-heading' key={cmpIdx}>{availableComp.component_abbreviation}</th>)}
                                                {availableCompoents.filter(cmp => cmp.component_type === SalaryComponentType.EmployerContribution).map((availableComp, cmpIdx) => <th className='table-heading' key={cmpIdx}>{availableComp.component_abbreviation}</th>)}
                                                <th className='table-heading' >Tax Withholding</th>
                                                <th className='table-heading' >Net pay</th>
                                                <th className='table-heading' >Employee Payslip</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payrollDetails.employee_payroll_details.data.filter((emp) => emp.employee_name.toLowerCase().includes(searchString.toLowerCase())).map((data, empIndex) => <>
                                                <tr key={empIndex}>
                                                    <td>{empIndex + 1}</td>
                                                    <td><span className='pay-run-report'>{data.employee_name}</span></td>
                                                    <td><span className='pay-run-report'>{data.no_of_working_days}</span></td>
                                                    <td><span className='pay-run-report'>{data.leave_days}</span></td>
                                                    {/* <td><span className='pay-run-report'>{data.working_shift}</span></td> */}
                                                    <td><span className='pay-run-report'>{data.regular_duration}</span></td>
                                                    {displayWorkTimeTypes.map((dispWorkTimeType, wkIndex) => {
                                                        const matchedWorkTime = data.employee_payroll_compensations.find((comp) => comp.holiday_type_id === dispWorkTimeType.holiday_type_id && comp.employee_payroll_comp_day_type === dispWorkTimeType.day_type && comp.employee_payroll_comp_work_time_type === dispWorkTimeType.work_time_type);
                                                        // console.log('Match', dispWorkTimeType, matchedWorkTime);
                                                        return (
                                                            matchedWorkTime ?
                                                                <td><span className='pay-run-report' key={wkIndex}>{matchedWorkTime.employee_payroll_comp_duration}</span></td>
                                                                :
                                                                <td><span className='pay-run-report' key={wkIndex}>-</span></td >
                                                        )
                                                    })}
                                                    <td><span className='pay-run-report'>{data.regular_pay}</span></td>
                                                    {displayWorkTimeTypes.map((dispWorkTimeType, wkIndex) => {
                                                        const matchedWorkTime = data.employee_payroll_compensations.find((comp) => comp.holiday_type_id === dispWorkTimeType.holiday_type_id && comp.employee_payroll_comp_day_type === dispWorkTimeType.day_type && comp.employee_payroll_comp_work_time_type === dispWorkTimeType.work_time_type);
                                                        // console.log('Match', dispWorkTimeType, "dispWorkTimeType", matchedWorkTime, "matchWorkTime");
                                                        return (
                                                            matchedWorkTime ?
                                                                <td><span className='pay-run-report' key={wkIndex}>{matchedWorkTime.employee_payroll_comp_calculated_amount}</span></td>
                                                                :
                                                                <td><span className='pay-run-report' key={wkIndex}>-</span></td >
                                                        )
                                                    })}
                                                    <td><span className='pay-run-report'>{data.basic_pay}</span></td>
                                                    <td><span className='pay-run-report'>{data.loss_of_pay}</span></td>
                                                    {availableCompoents.filter(cmp => cmp.component_type === SalaryComponentType.Allowance).map((availableComp, cmpIdx) => {
                                                        const matchedEmpComponent = data.employee_payroll_components.find(empComponent => empComponent.employee_payroll_component_name === availableComp.component_name);
                                                        return (
                                                            matchedEmpComponent ?
                                                                <th className='table-heading' key={cmpIdx}>{matchedEmpComponent.employee_payroll_component_calculated_value}</th>
                                                                :
                                                                <th className='table-heading' key={cmpIdx}>-</th>
                                                        )
                                                    })}
                                                    {availableCompoents.filter(cmp => cmp.component_type === SalaryComponentType.Deduction).map((availableComp, cmpIdx) => {
                                                        const matchedEmpComponent = data.employee_payroll_components.find(empComponent => empComponent.employee_payroll_component_name === availableComp.component_name);
                                                        return (
                                                            matchedEmpComponent ?
                                                                <th className='table-heading' key={cmpIdx}>{matchedEmpComponent.employee_payroll_component_calculated_value}</th>
                                                                :
                                                                <th className='table-heading' key={cmpIdx}>-</th>
                                                        )
                                                    })}
                                                    {availableCompoents.filter(cmp => cmp.component_type === SalaryComponentType.EmployerContribution).map((availableComp, cmpIdx) => {
                                                        const matchedEmpComponent = data.employee_payroll_components.find(empComponent => empComponent.employee_payroll_component_name === availableComp.component_name);
                                                        return (
                                                            matchedEmpComponent ?
                                                                <th className='table-heading' key={cmpIdx}>{matchedEmpComponent.employee_payroll_component_calculated_value}</th>
                                                                :
                                                                <th className='table-heading' key={cmpIdx}>-</th>
                                                        )
                                                    })}
                                                    <td style={{ textAlign: "center" }}><span className='pay-run-report'>{data.employee_payroll_wht ? data.employee_payroll_wht : "-"}</span></td>
                                                    <td><span className='pay-run-report'>{data.net_pay}</span></td>

                                                    <td style={{ textAlign: "center" }}>
                                                        <span className='pay-run-report'>
                                                            {(payrollDetails.payroll_summary.payslip_status === TotalPayrunStatus.Completed || payrollDetails.payroll_summary.payslip_status === TotalPayrunStatus.EmployeeCompleted) ? <a className='toggle-button h-100 payslip-a' href={data.payslip_url} download>
                                                                <i className="mdi mdi-file-download" style={{ fontSize: '30px', color: '#0E7AD5' }}></i>
                                                            </a> : <i className="mdi mdi-timer-sand" style={{ fontSize: '25px', color: '#0E7AD5' }}></i>}

                                                        </span>
                                                    </td>
                                                </tr>
                                            </>)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    );
};

export default PayrollViewDetails;