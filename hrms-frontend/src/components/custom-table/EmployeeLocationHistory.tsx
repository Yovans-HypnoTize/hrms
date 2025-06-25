import React, { useState, useEffect } from 'react';
import { useAppStateAPI } from '../../common/AppStateAPI';
import { ServerAPI } from '../../common/ServerAPI';
import { getFormattedLocalDate } from '../../common/Utilities';

const EmployeeLocationHistory: React.FC<{ employeeID: number }> = ({ employeeID }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [locationHistory, setLocationHistory] = useState<any[]>([]);

    const fetchAttendanceHistory = () => {
        addProcessingRequests();
        ServerAPI.getEmployeeLocationHistory(employeeID).then((response: any) => {
            if (response) {
                setLocationHistory(response.employee_locations);
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
                                <th className='table-heading'>Working Location</th>
                                <th className='table-heading'>Effective Date From</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locationHistory.map((entry, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{entry.company_location_name}</td>
                                        <td>{getFormattedLocalDate(entry.employee_location_effective_from)}</td>
                                        {/* <td>{entry.employee_location_effective_from}</td> */}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeLocationHistory;
