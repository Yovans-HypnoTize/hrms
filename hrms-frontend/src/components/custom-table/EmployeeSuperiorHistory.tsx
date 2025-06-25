import React, { useState, useEffect } from 'react';
import { useAppStateAPI } from '../../common/AppStateAPI';
import { ServerAPI } from '../../common/ServerAPI';
import { getFormattedLocalDate } from '../../common/Utilities';

const EmployeeSuperiorHistory: React.FC<{ employeeID: number }> = ({ employeeID }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [superiorEmployeeHistory, setSuperiorEmployeeHistory] = useState<any[]>([]);

    const fetchSuperiorEmployeeHistory = () => {
        addProcessingRequests();
        ServerAPI.getSuperiorEmployeeHistory(employeeID).then((response: any) => {
            if (response) {
                console.log(response)
                setSuperiorEmployeeHistory(response.data);
            }
        }).finally(() => {
            reduceProcessingRequests();
        });
    };

    useEffect(() => {
        fetchSuperiorEmployeeHistory();
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
                                <th className='table-heading'>Superior Employee</th>
                                <th className='table-heading'>Effective Date From</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!!superiorEmployeeHistory && superiorEmployeeHistory.map((entry, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{entry.employee_superior_first_name}</td>
                                    <td>{getFormattedLocalDate(entry.employee_superior_effective_from)}</td>
                                    {/* <td>{entry.employee_superior_effective_from}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeSuperiorHistory;
