import React, { useState, useEffect } from 'react';
import { useAppStateAPI } from '../../common/AppStateAPI';
import { ServerAPI } from '../../common/ServerAPI';
import { getFormattedLocalDate } from '../../common/Utilities';

const EmployeeLeavePlanHistory: React.FC<{ employeeID: number }> = ({ employeeID }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [leavePLanHistory, setLeavePLanHistory] = useState<any[]>([]);

    const fetchStatusHistory = () => {
        addProcessingRequests();
        ServerAPI.getLeavePlanHistory(employeeID).then((response: any) => {
            if (response) {
                console.log(response)
                setLeavePLanHistory(response.employee_leave_plans);
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
                                <th className='table-heading'>Leave Plan</th>
                                <th className='table-heading'>Effective Date From</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leavePLanHistory.map((entry, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{entry.leave_plan_name}</td>
                                    <td>{getFormattedLocalDate(entry.employee_leave_plan_effective_from)}</td>
                                    {/* <td>{entry.employee_leave_plan_effective_from}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeLeavePlanHistory;
