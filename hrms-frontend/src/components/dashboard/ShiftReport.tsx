import React from "react";
import { APIData } from "../../common/DataTypes";

const ShiftReports: React.FC<{ dashboardList: APIData.EmployeeDashboard | undefined }> = ({ dashboardList }) => {
    return (
        <>
            {dashboardList !== undefined &&
                <div className="shifts-report-container">
                    <div className="shifts-report">
                        <div className="shifts-report-heading">No of Employee</div>
                        <div className="shifts-report-count">{dashboardList.total_employee}</div>
                    </div>
                    <div className="shifts-report">
                        <div className="shifts-report-heading">Present</div>
                        <div className="shifts-report-count">{dashboardList.total_present}</div>
                    </div>
                    <div className="shifts-report">
                        <div className="shifts-report-heading">Absent</div>
                        <div className="shifts-report-count">{dashboardList.total_absent}</div>
                    </div>
                    <div className="shifts-report">
                        <div className="shifts-report-heading">On Leave</div>
                        <div className="shifts-report-count">{dashboardList.total_leave}</div>
                    </div>
                </div>
            }
        </>
    )
}

export default ShiftReports;