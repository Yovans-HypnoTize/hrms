import React from "react";
import { APIData } from "../../common/DataTypes";
import { useAppStateAPI } from "../../common/AppStateAPI";
import { ServerAPI } from "../../common/ServerAPI";
import toast from "react-hot-toast";
import { getFormattedLocalTime } from "../../common/Utilities";

const ShiftReports: React.FC<{ dashboardList: APIData.EmployeeDashboard | undefined, reloadData: any }> = ({ dashboardList, reloadData }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();


    const attendancePunch = (punch: number) => {
        addProcessingRequests();
        ServerAPI.attendancePunch(punch).then((response: any) => {
            if (response && response['message']) {
                toast.success(response['message']);
                reloadData();
            } else if (response && response['message']) {
                toast.error(response['message']);
            }
        }).finally(() => {
            reduceProcessingRequests();
        });
    }

    return (
        <>
            {dashboardList !== undefined && dashboardList.data !== undefined && (
                <>
                    <div className="shifts-report-container mt-2">
                        <div className="shifts-report">
                            <div className="shifts-report-heading">In Time</div>
                            <div className="shifts-report-count">{dashboardList.data.dashboard.in_time ? getFormattedLocalTime(dashboardList.data.dashboard.in_time) : "-"}</div>
                        </div>
                        <div className="shifts-report">
                            <div className="shifts-report-heading">Out Time</div>
                            <div className="shifts-report-count">{dashboardList.data.dashboard.out_time ? getFormattedLocalTime(dashboardList.data.dashboard.out_time) : "-"}</div>
                        </div>
                        <div className="shifts-report">
                            <div className="shifts-report-heading">Total Duration</div>
                            <div className="shifts-report-count">{dashboardList.data.dashboard.total_duration ? dashboardList.data.dashboard.total_duration : "-"}</div>
                        </div>
                        {dashboardList.data.dashboard.punched_state === 2 && <div className="shifts-report" style={{ backgroundColor: "white" }}>
                            <button className="btn-primary mb-2 shift-btn w-100" onClick={() => attendancePunch(1)}>Punch In</button>
                            <p className="m-0 pr-2 text-danger font-12" style={{ textAlign: "end", fontFamily: "Montserrat" }}>Not Logged In Yet</p>
                        </div>}
                        {dashboardList.data.dashboard.punched_state === 1 && <div className="shifts-report" style={{ backgroundColor: "white" }}>
                            <button className="btn-danger mb-2 shift-btn w-100" onClick={() => attendancePunch(2)}>Punch Out</button>
                            <p className="m-0 pr-2 text-success font-12" style={{ textAlign: "end", fontFamily: "Montserrat" }}>Login Successfully.</p>
                        </div>}
                    </div>
                    <div className="shifts-report-container mt-4">
                        <div className="shifts-report">
                            <div className="shifts-report-heading">No Of Leave Requested</div>
                            <div className="shifts-report-count">{dashboardList.data.insights.total_request}</div>
                        </div>
                        <div className="shifts-report">
                            <div className="shifts-report-heading">No Of Leave Accepted</div>
                            <div className="shifts-report-count">{dashboardList.data.insights.total_approved}</div>
                        </div>
                        <div className="shifts-report">
                            <div className="shifts-report-heading">No Of Leave Rejected</div>
                            <div className="shifts-report-count">{dashboardList.data.insights.total_rejected}</div>
                        </div>
                        <div className="shifts-report">
                            <div className="shifts-report-heading">No Of Leave Pending</div>
                            <div className="shifts-report-count">{dashboardList.data.insights.total_pending}</div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default ShiftReports;