import React from 'react';
import { Route } from 'react-router-dom';
import { PageLinks, PageURLNames } from '../common/Constants';
import { useLocation } from 'react-router-dom';
import CommonListing from '../listing/CommonListing';
import { IonRouterOutlet } from '@ionic/react';
import PageDashboard from './PageDashboard';
import SubordinatePendingLeaveRequest from '../components/custom-pages/SubordinatePendingLeaveRequest';
import SubordinateAllLeaveRequest from '../components/custom-pages/SubordinateAllLeaveRequest';
import LeaveRequest from '../components/custom-pages/LeaveRequest';
import EmployeeViewDetails from '../components/custom-pages/EmployeeDetails';
import OrganizationalChart from '../components/custom-pages/OrganizationalChart';

const ListTemplate: React.FC = () => {
    const location = useLocation();
    const currentPage = location.pathname;

    return (
        <div className="hp-main-layout-content text-start">
            <IonRouterOutlet>
                {/* <Route path={PageURLNames.SUBORDINATE_LEAVE_BALANCE_LIST} exact render={(props) => <CommonListing {...props} page={currentPage} />} /> */}
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.DASHBOARD}`} exact render={PageDashboard} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.SUBORDINATE_LEAVE_BALANCE_LIST}`} exact render={(props) => <CommonListing {...props} page={currentPage} />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.LEAVE_BALANCE}`} exact render={(props) => <CommonListing {...props} page={currentPage} />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.LEAVE_REQUEST}`} exact render={(props) => <CommonListing {...props} page={currentPage} />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.LEAVE_HISTORY}`} exact render={(props) => <CommonListing {...props} page={currentPage} />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.EMPLOYEE_REPORT}`} exact render={(props) => <CommonListing {...props} page={currentPage} />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.PENDING_LEAVE_REQUEST}`} exact render={(props) => <CommonListing {...props} page={currentPage} />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.ALLOCATED_EMPLOYEE_REPORT}`} exact render={(props) => <CommonListing {...props} page={currentPage} />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.SUBORDINATE_LEAVE_HISTORY_LIST}`} exact render={(props) => <CommonListing {...props} page={currentPage} />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.PAYSLIP}`} exact render={(props) => <CommonListing {...props} page={currentPage} />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.CERTIFICATION_LETTER}`} exact render={(props) => <CommonListing {...props} page={currentPage} />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.EMPLOYEE_CONFIRMED_ATTENDANCE}`} exact render={(props) => <CommonListing {...props} page={currentPage} />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.EMPLOYEE_PENDING_ATTENDANCE}`} exact render={(props) => <CommonListing {...props} page={currentPage} />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.SUBORDINATE_PENDING_ATTENDANCE}`} exact render={(props) => <CommonListing {...props} page={currentPage} />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.SUBORDINATE_PENDING_APPROVAL}`} exact render={(props) => <SubordinatePendingLeaveRequest />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.SUBORDINATE_LEAVE_REQUEST_LIST}`} exact render={(props) => <SubordinateAllLeaveRequest />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.LEAVE_REQUEST_LIST}`} exact render={(props) => <SubordinateAllLeaveRequest />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.ALL_LEAVE_REQUEST}`} exact render={(props) => <LeaveRequest />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.EMPLOYEE_PROFILE}`} exact render={(props) => <EmployeeViewDetails />} />
                <Route path={`${PageLinks.PAGE_EMPLOYEE}${PageLinks.LIST}/${PageURLNames.EMPLOYEE_PROFILE}`} exact render={(props) => <OrganizationalChart />} />
            </IonRouterOutlet>
        </div>
    );
}

export default ListTemplate;
