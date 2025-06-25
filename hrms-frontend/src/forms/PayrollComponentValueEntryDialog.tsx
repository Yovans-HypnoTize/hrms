import React, { useEffect, useState } from "react";
import { Drawer } from '@mui/material';
import { useAppStateAPI } from "../common/AppStateAPI";
import { ServerAPI } from '../common/ServerAPI';
import { APIData } from "../common/DataTypes";
import toast from "react-hot-toast";
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';

const PayrollComponentValueEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, payrollGroupID?: number, payrollMonth?: string, startDate?: string, payrollID?: number, reloadData: any, }> = ({ showDialog, closeDialog, payrollGroupID, payrollMonth, startDate, payrollID, reloadData }) => {

    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [payrollManualComponents, setPayrollManualComponents] = useState<APIData.PayrollManualComponents>();
    const [payrollManualValues, setPayrollManualValues] = useState<APIData.PayrollManualValue[]>([]);
    var searchTimeout: any = null;
    const [searchString, setSearchString] = useState('');


    useEffect(() => {
        if (payrollID) {
            addProcessingRequests();
            ServerAPI.getPayrollManualComponentValues(payrollID).then(response => {
                if (response) {
                    setPayrollManualComponents(response.data);
                }
            }).finally(() => {
                reduceProcessingRequests();
            });
        } else if (payrollGroupID && payrollMonth) {
            addProcessingRequests();
            ServerAPI.getPayrollManualComponents(payrollGroupID, payrollMonth).then(response => {
                if (response) {
                    setPayrollManualComponents(response.data);
                }
            }).finally(() => {
                reduceProcessingRequests();
            });
        }
    }, [payrollGroupID, payrollMonth, payrollID]);

    useEffect(() => {
        const manualValues: APIData.PayrollManualValue[] = [];
        if (payrollManualComponents) {
            payrollManualComponents.employees.forEach(employee => {
                employee.salary_components.forEach(salComp => manualValues.push({
                    employee_id: employee.employee_id,
                    salary_component_id: salComp.salary_component_id,
                    employee_payroll_component_calculated_value: salComp.employee_payroll_component_calculated_value ? parseInt(salComp.employee_payroll_component_calculated_value) : 0
                }))
            })
        }
        setPayrollManualValues(manualValues);
    }, [payrollManualComponents]);

    const submitPayrollManualValues = () => {
        if (payrollID) {
            let payload = {
                payroll_manual_values: payrollManualValues
            }
            addProcessingRequests();
            ServerAPI.updatePayrollManualValues(payload, payrollID).then(response => {
                if (response && response['message']) {
                    toast.success(response['message']);
                    reloadData();
                    closeDialog();
                } else if (response && response['message']) {
                    toast.error(response['message']);
                }
            }).finally(() => {
                reduceProcessingRequests();
            });
        } else if (payrollGroupID && payrollMonth) {
            let payload = {
                payroll_group_id: payrollGroupID,
                pay_run_month: payrollMonth,
                start_date: startDate,
                payroll_manual_values: payrollManualValues
            }
            addProcessingRequests();
            ServerAPI.addPayrollManualValues(payload).then(response => {
                if (response && response['message']) {
                    toast.success(response['message']);
                    reloadData();
                    closeDialog();
                } else if (response && response['message']) {
                    toast.error(response['message']);
                }
            }).finally(() => {
                reduceProcessingRequests();
            });
        }

    }

    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-max-1">
            {!!payrollManualComponents && (
                <div className='tabdetails'>
                    <div className='custom-tableview-scroll'>
                        <div className="table-container">
                            <div className="table-scroll">
                                <p className="detailed-heading mt-3">Enter Payroll Values</p>
                                <div className='col-4 d-flex justify-content-start p-0 mt-3' style={{ gap: "10px" }}>
                                    <> <input type="text" className='search-option' placeholder='Search By Keywords' value={searchString} onChange={(e: any) => {
                                        if (searchTimeout) clearTimeout(searchTimeout);
                                        setSearchString(e.target.value);
                                    }} />
                                        <Icon path={mdiMagnify} size={1} className='search-icon' />
                                    </>
                                </div>
                                <div className="table-responsive manual-entry">
                                    <table className="table">
                                        <thead className="color-native-blue">
                                            <tr>
                                                <th className='table-heading'>Employee</th>
                                                {payrollManualComponents.manual_salary_components.map((component, compIndex) => <th className='table-heading' key={compIndex}>{component.salary_component_name}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payrollManualComponents.employees.filter(emp => emp.salary_components !== undefined && emp.salary_components.length > 0 &&
                                                `${emp.employee_first_name} ${emp.employee_last_name}`
                                                    .toLowerCase()
                                                    .includes(searchString.toLowerCase())).map((employee, empIndex) =>
                                                        <tr key={empIndex}>
                                                            <td>{employee.employee_first_name} {employee.employee_last_name}</td>
                                                            {payrollManualComponents.manual_salary_components.map((component, compIndex) => {
                                                                const manualVal = payrollManualValues.find(payrollVal => component.salary_component_id === payrollVal.salary_component_id && employee.employee_id === payrollVal.employee_id);
                                                                return (
                                                                    <td key={compIndex}>
                                                                        {!!manualVal ? <input type="text" value={manualVal.employee_payroll_component_calculated_value ?? ''} onChange={e => {
                                                                            const newValue = parseInt(e.target.value);
                                                                            const newValues = payrollManualValues.map(value => {
                                                                                if (value.employee_id === employee.employee_id && value.salary_component_id === manualVal.salary_component_id) {
                                                                                    return { ...value, employee_payroll_component_calculated_value: isNaN(newValue) ? 0 : newValue }
                                                                                } else {
                                                                                    return { ...value }
                                                                                }
                                                                            })
                                                                            setPayrollManualValues(newValues);
                                                                        }} /> : '-'}
                                                                    </td>
                                                                )
                                                            })}
                                                        </tr>
                                                    )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row btn-form-submit">
                        <button type="button" className="button1" onClick={closeDialog}>Cancel</button>
                        <button type="button" className="button2" disabled={false} onClick={submitPayrollManualValues}>Save Changes</button>
                    </div>
                </div>
            )}
        </Drawer>
    )
}

export default PayrollComponentValueEntryDialog;