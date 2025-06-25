import { APIData } from "../../common/DataTypes";
import { getMonthDate } from "../../common/Utilities";

const DashboardNotifications: React.FC<{ dashboardList: APIData.EmployeeDashboard | undefined }> = ({ dashboardList }) => {
    return (
        <>
            {dashboardList !== undefined &&
                <>
                    {dashboardList.upcoming_birthday.length > 0 ?
                        (<div className="dashboard-list">
                            <div className="dashboard-notification-heading mt-4 pb-2">Upcoming Birthdays</div>
                            {dashboardList.upcoming_birthday.map((bDay, bDayIDX) => (
                                <div className="dashboard-notification-container notification" key={bDayIDX}>
                                    <div className="dashboard-notification-section">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <p className="dashboard-notification-content-heading m-0">{bDay.employee_first_name}</p>
                                            <div style={{ display: "flex", justifyContent: "end", alignItems: "center", gap: "10px" }}>
                                                <p className="dashboard-notification-date m-0">{getMonthDate(bDay.birthday_date)}</p>
                                                <div><img src={window.location.origin + "/assets/svg/notification-dot.svg"} alt="" /></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>) : ""}
                    {dashboardList.upcoming_holiday.length > 0 ?
                        (<div className="dashboard-list">
                            <div className="dashboard-notification-heading mt-4 pb-2">Upcoming Holidays</div>
                            {dashboardList.upcoming_holiday.map((hDay, hDayIDX) => (
                                <div className="dashboard-notification-container notification" key={hDayIDX}>
                                    <div className="dashboard-notification-section">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <p className="dashboard-notification-content-heading m-0" >{hDay.holiday_name}</p>
                                            <div style={{ display: "flex", justifyContent: "end", alignItems: "center", gap: "10px" }}>
                                                <p className="dashboard-notification-date m-0">{getMonthDate(hDay.holiday_date)}</p>
                                                <div><img src={window.location.origin + "/assets/svg/notification-dot.svg"} alt="" /></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>) : ""}
                    {/* <div className="notification-view-more mt-1">
                <div className="view-more-heading"> view all</div>
                <div><img src={window.location.origin + "/assets/svg/view-more.svg"} alt="" /></div>
            </div> */}
                </>
            }
        </>
    );
}

export default DashboardNotifications;