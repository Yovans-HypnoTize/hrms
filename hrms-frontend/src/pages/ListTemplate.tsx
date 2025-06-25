import { Route, Routes } from 'react-router-dom';
import { PageURLNames } from '../common/Constants';
import { useLocation } from 'react-router-dom';
import CommonListing from '../listing/CommonListing';
import PayrollViewDetails from '../components/custom-file/PayrollViewDetails';

const ListTemplate: React.FC = () => {

    const location = useLocation();

    return (
        <div className="hp-main-layout-content text-start">
            <Routes>
                {/* <Route path={PageURLNames.ADMIN_DASHBOARD} element={<CommonListing page={location.pathname} />} /> */}
                <Route path={PageURLNames.COUNTRIES} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.STATES} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.BANKS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.CLIENTS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.COMPANY} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.EMPLOYEE_REPORT} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.ALLOCATED_EMPLOYEE_REPORT} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.PENDING_LEAVE_REQUEST} element={<CommonListing page={location.pathname} />} />

                {/* <Route path={PageURLNames.DASHBOARD} element={<CommonListing page={location.pathname} />} /> */}
                <Route path={PageURLNames.EMPLOYEES} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.SALARY_REVISION} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.LOAN} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.ADDITIONAL_ALLOWANCE} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.ATTENDANCE} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.PROJECTS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.COMPANY_LOCATION} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.COMPANY_DETAILS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.COMPANY_BANK_DETAILS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.HOLIDAY_GROUPS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.HOLIDAY_TYPES} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.HOLIDAYS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.PARTNERS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.DEPARTMENTS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.DESIGNATIONS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.WORK_SHIFTS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.WORK_TIME_COMPENSATIONS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.LEAVE_TYPES} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.LEAVE_PLANS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.LOAN_TYPE} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.REST_DAY_GROUPS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.ATTENDANCE_POLICIES} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.SALARY_COMPONENTS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.SALARY_GROUPS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.PAYROLL_GROUP} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.USERS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.ROLES} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.LEAVE_REQUEST} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.LEAVE_BALANCE} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.LEAVE_CREDITS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.LEAVE_HISTORY} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.PAYROLL_PROCESS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.EMPLOYEE_PAYROLL} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.PAYROLL_REPORTS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.PAYROLL_HISTORY} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.PROCESS_PAY_RUN} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.EMPLOYEE_VIEW_DETAILS} element={<CommonListing page={location.pathname} />} />
                <Route path={PageURLNames.PAYROLL_VIEW_DETAILS} element={<PayrollViewDetails />} />

            </Routes>
        </div>
    )
}

export default ListTemplate;