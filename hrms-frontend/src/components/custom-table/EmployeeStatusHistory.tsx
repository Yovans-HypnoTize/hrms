import React, { useState, useEffect } from 'react';
import { useAppStateAPI } from '../../common/AppStateAPI';
import { ServerAPI } from '../../common/ServerAPI';
import { getFormattedLocalDate, getObjectKeyByValue } from '../../common/Utilities';
import { EmployeeStatus } from '../../common/Constants';

const EmployeeStatusHistory: React.FC<{ employeeID: number }> = ({ employeeID }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [statusHistory, setStatusHistory] = useState<any[]>([]);

    const fetchStatusHistory = () => {
        addProcessingRequests();
        ServerAPI.getEmployeeStatusHistory(employeeID).then((response: any) => {
            if (response) {
                setStatusHistory(response.employee_statuses);
            }
        }).finally(() => {
            reduceProcessingRequests();
        });
    };

    useEffect(() => {
        fetchStatusHistory();
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
                                <th className='table-heading'>Employee Status</th>
                                <th className='table-heading'>Effective Date From</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statusHistory.map((entry, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{getObjectKeyByValue(EmployeeStatus, entry.employee_status)}</td>
                                    <td>{getFormattedLocalDate(entry.employee_status_time)}</td>
                                    {/* <td>{entry.employee_status_time}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeStatusHistory;
