import React, { useState, useEffect } from 'react';
import { useAppStateAPI } from '../../common/AppStateAPI';
import { ServerAPI } from '../../common/ServerAPI';
import { getFormattedLocalDate } from '../../common/Utilities';

const EmployeeAttendanceHistory: React.FC<{ employeeID: number }> = ({ employeeID }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);

    const fetchAttendanceHistory = () => {
        addProcessingRequests();
        ServerAPI.getEmployeeAttendanceHistory(employeeID).then((response: any) => {
            if (response) {
                setAttendanceHistory(response.employee_attendance_policies);
            }
        }).finally(() => {
            reduceProcessingRequests();
        });
    };

    useEffect(() => {
        fetchAttendanceHistory();
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
                                <th className='table-heading'>Attendance Policy</th>
                                <th className='table-heading'>Effective Date From</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceHistory.map((entry, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{entry.attendance_policy_name}</td>
                                    <td>{getFormattedLocalDate(entry.employee_attendance_policy_effective_from)}</td>
                                    {/* <td>{entry.employee_attendance_policy_effective_from}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeAttendanceHistory;
