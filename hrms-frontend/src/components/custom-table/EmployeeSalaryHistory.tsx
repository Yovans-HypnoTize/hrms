import React, { useState, useEffect, useRef } from 'react';
import { useAppStateAPI } from '../../common/AppStateAPI';
import { ServerAPI } from '../../common/ServerAPI';
import { getFormattedLocalDate } from '../../common/Utilities';

const EmployeeSalaryHistory: React.FC<{ employeeID: number }> = ({ employeeID }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [salaryHistory, setSalaryHistory] = useState<any[]>([]);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const fetchSalaryHistory = () => {
        addProcessingRequests();
        ServerAPI.getEmployeeSalaryHistory(employeeID).then((response: any) => {
            if (response) {
                console.log(response)
                setSalaryHistory(response.salaries);
            }
        }).finally(() => {
            reduceProcessingRequests();
        });
    };

    useEffect(() => {
        fetchSalaryHistory();
    }, []);

    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {
            if (tableContainerRef.current?.matches(':hover')) {
                tableContainerRef.current.scrollLeft += event.deltaY;
                event.preventDefault();
            }
        };

        const tableContainer = tableContainerRef.current;
        tableContainer?.addEventListener('wheel', handleScroll);

        return () => {
            tableContainer?.removeEventListener('wheel', handleScroll);
        };
    }, []);

    return (
        <div className="table-container">
            <div className="table-scroll">
                <p className="detailed-heading mt-3">View History</p>
                <div className="table-responsive" ref={tableContainerRef}>
                    <table className="table">
                        <thead className="color-native-blue">
                            <tr>
                                <th className='table-heading'>S.no</th>
                                <th className='table-heading'>Salary Group</th>
                                <th className='table-heading'>Effective Date From</th>
                                <th className='table-heading'>Basic Salary</th>
                                {salaryHistory.length > 0 && salaryHistory[0].employee_salary_component_values.map((allowance: any, index: number) => (
                                    <th key={index}>{allowance.salary_component_name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {salaryHistory.map((entry, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{entry.salary_group_name}</td>
                                    <td>{getFormattedLocalDate(entry.employee_salary_effective_from)}</td>
                                    <td>{entry.employee_monthly_salary}</td>
                                    {/* <td>{entry.employee_salary_effective_from}</td> */}
                                    {entry.employee_salary_component_values.map((allowance: any, allowanceIDX: number) => (
                                        <td key={allowanceIDX}>{allowance.employee_salary_component_value ? allowance.employee_salary_component_value : "N/A"}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeSalaryHistory;
