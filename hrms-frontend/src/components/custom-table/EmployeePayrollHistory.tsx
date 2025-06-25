import React, { useState, useEffect } from 'react';
import { useAppStateAPI } from '../../common/AppStateAPI';
import { ServerAPI } from '../../common/ServerAPI';
import { getFormattedLocalDate } from '../../common/Utilities';

const EmployeePayrollHistory: React.FC<{ employeeID: number }> = ({ employeeID }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [payrollHistory, setPayrollHistory] = useState<any[]>([]);

    const fetchPayrollHistory = () => {
        addProcessingRequests();
        ServerAPI.getEmployeePayrollHistory(employeeID).then((response: any) => {
            if (response) {
                setPayrollHistory(response.employee_payroll_groups);
            }
        }).finally(() => {
            reduceProcessingRequests();
        });
    };

    useEffect(() => {
        fetchPayrollHistory();
    }, []);

    return (
        <div className="table-container">
            <div className="table-scroll">
                <p className="detailed-heading mt-3">View History</p>
                <div className="table-responsive">
                    <table className="table">
                        <thead className="color-native-blue">
                            <tr>
                                <th className='table-heading'>S.no</th>
                                <th className='table-heading'>Payroll Group</th>
                                <th className='table-heading'>Effective Date From</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payrollHistory.map((entry, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{entry.payroll_group_name}</td>
                                    <td>{getFormattedLocalDate(entry.employee_payroll_group_effective_from)}</td>
                                    {/* <td>{entry.employee_payroll_group_effective_from}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeePayrollHistory;
