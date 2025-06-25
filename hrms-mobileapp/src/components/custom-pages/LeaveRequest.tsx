import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useAppStateAPI } from '../../common/AppStateAPI';
import { ServerAPI } from '../../common/ServerAPI';
import { APIData } from '../../common/DataTypes';
import { getFormattedLocalDate, getObjectKeyByValue } from '../../common/Utilities';
import { LeaveRequestStatus } from '../../common/Constants';
import LeaveRequestEntryDialog from '../../forms/LeaveRequestEntryDialog';

const LeaveRequest: React.FC = () => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [leaveReqPopup, setLeaveReqPopup] = useState(false);
    const [leaveRequest, setLeaveRequest] = useState<APIData.SubordinateLeaveRequest[]>();

    const getLeaveRequest = () => {
        addProcessingRequests();
        ServerAPI.employeeLeaveRequest().then(response => {
            if (response.data) {
                setLeaveRequest(response.data);
            }
        }).finally(() => {
            reduceProcessingRequests();
        });
    };

    useEffect(() => {
        getLeaveRequest();
    }, [])

    return (
        <div className='subordinate mt-1'>
            <div className='d-flex justify-content-between align-items-center'>
                <h4 className="header-title mt-0 mb-0">Leave Request</h4>
                <button className='toggle-button active h-100' style={{ minHeight: "50px", minWidth: "93px" }} onClick={() => setLeaveReqPopup(true)}>Request Leave</button>
            </div>
            <div className='d-flex flex-wrap flex-row mt-3' style={{ gap: "10px" }}>
                {leaveRequest && leaveRequest.length > 0 ? leaveRequest.map((leave, leaveIDX) => (
                    <div className="table-container subordinate-leave" key={leaveIDX}>
                        <div className="table-scroll">
                            <div className="table-responsive">
                                <div className='pl-2'>
                                    <div className='d-flex align-items-center justify-content-between pr-3 pt-2 pb-2 pl-1' style={{ gap: "10px" }}>
                                        <p className='leave-req-name m-0'>{leave.leave_type_name}</p>
                                        <p className='m-0 d-flex justify-content-center align-items-center status-btn' style={{ color: leave.employee_leave_req_day_approval_status === 0 ? "black" : "white", backgroundColor: leave.employee_leave_req_day_approval_status === 10 ? "green" : leave.employee_leave_req_day_approval_status === 5 ? "red" : leave.employee_leave_req_day_approval_status === 0 ? "yellow" : "#000" }}>{getObjectKeyByValue(LeaveRequestStatus, leave.employee_leave_req_day_approval_status)}</p>
                                    </div>
                                    <div><span className='leave-req-name m-1' style={{ fontWeight: "400" }}>{leave.employee_leave_req_no_of_days ? `${leave.employee_leave_req_no_of_days} Days` : "N/A"} |</span> <span className='leave-req-name m-0' style={{ color: "rgba(85, 85, 85, 0.8)" }}>{`${getFormattedLocalDate(leave.employee_leave_req_period_from)} - ${getFormattedLocalDate(leave.employee_leave_req_period_to)}`}</span></div>
                                    <p className='leave-req-name m-1' style={{ color: "rgba(85, 85, 85, 0.8)" }}>{leave.employee_leave_req_reason}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : <div className="table-container">
                    <div className="table-scroll">
                        <div className="table-responsive pl-2">
                            <h6 className='my-3'>No Data Available</h6>
                        </div></div> </div>}
                <LeaveRequestEntryDialog showDialog={leaveReqPopup} closeDialog={() => setLeaveReqPopup(false)} reloadData={() => getLeaveRequest()} />
            </div>
        </div>
    );
};

export default LeaveRequest;