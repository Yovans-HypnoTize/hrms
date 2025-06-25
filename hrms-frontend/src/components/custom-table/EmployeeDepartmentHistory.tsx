import React, { useState, useEffect } from 'react';
import { useAppStateAPI } from '../../common/AppStateAPI';
import { ServerAPI } from '../../common/ServerAPI';
import { getFormattedLocalDate } from '../../common/Utilities';

const EmployeeDepartmentHistory: React.FC<{ employeeID: number }> = ({ employeeID }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [departmentHistory, setDepartmentHistory] = useState<any[]>([]);

    const fetchDepartmentHistory = () => {
        addProcessingRequests();
        ServerAPI.getEmployeeDepartmentHistory(employeeID).then((response: any) => {
            if (response) {
                setDepartmentHistory(response.data);
            }
        }).finally(() => {
            reduceProcessingRequests();
        });
    };

    useEffect(() => {
        fetchDepartmentHistory();
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
                                <th className='table-heading'>Department</th>
                                <th className='table-heading'>Effective Date From</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departmentHistory.map((entry, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{entry.department_name}</td>
                                    <td>{getFormattedLocalDate(entry.employee_department_effective_from)}</td>
                                    {/* <td>{entry.employee_department_effective_from}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDepartmentHistory;
