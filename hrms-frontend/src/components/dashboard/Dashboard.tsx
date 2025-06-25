import ReactApexChart from 'react-apexcharts';
import { APIData } from '../../common/DataTypes';

const Dashboard: React.FC<{ dashboardList: APIData.EmployeeDashboard | undefined }> = ({ dashboardList }) => {
    function getColorClass(index: any) {
        const colorClasses = ['first', 'second', 'third', 'fourth', 'fifth'];
        return colorClasses[index % colorClasses.length];
    }
    const salesByCategory: any = {
        series: [20, 40, 40],
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                // colors: isDark ? '#0e1726' : '#fff',
            },
            // colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                // color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Client', 'Department', 'Gender',],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };

    return (
        <div>
            {/* <div className="grid xl:grid-cols-3 gap-6 mb-6">
                    <div className="panel h-full">
                        <div className="flex items-center mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Employee Distribution</h5>
                        </div>
                        <div>
                            <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} />
                            </div>
                        </div>
                    </div>
                </div> */}

            {dashboardList !== undefined &&
                <div className="panel h-full sm:col-span-3 xl:col-span-2">
                    {dashboardList.distribution_client.length > 0 ? <>
                        <div className="d-flex align-items-start justify-content-between mb-3">
                            <h5 className="font-semibold text-lg dark:text-white-light">Employee Distribution by Clients</h5>
                        </div>
                        <div className="d-flex flex-col mb-3">
                            {dashboardList.distribution_client.map((client, clientIDX) => (
                                <div className="d-flex align-items-center mb-4">
                                    <div className="w-9 h-9">
                                        <img src="/assets/svg/status-employee.svg" alt="" />
                                    </div>
                                    <div className="px-3 flex-initial w-full">
                                        <div className="w-summary-info d-flex justify-content-between font-semibold text-white-dark mb-1 mt-2 ml-2" style={{ height: "20px" }}>
                                            <h6>{client.client_name}</h6>
                                            <p className="ltr:ml-auto rtl:mr-auto text-xs">{`${client.distribution} %`}</p>
                                        </div>
                                        <div>
                                            <div className={`w-full rounded-full h-5 p-1 bg-dark-light overflow-hidden shadow-3xl dark:bg-dark-light/10 dark:shadow-none ${getColorClass(clientIDX)}`}>
                                                <div
                                                    className="bg-gradient-to-r from-[#a71d31] to-[#3f0d12] w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-white before:w-2 before:h-2 before:rounded-full before:m-auto"
                                                    style={{ width: `${client.distribution}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </> : ""}

                    {dashboardList.distribution_gender.length > 0 ? <>
                        <div className="d-flex align-items-start justify-content-between mb-3">
                            <h5 className="font-semibold text-lg dark:text-white-light">Employee Distribution by Gender</h5>
                        </div>
                        <div className="d-flex flex-col mb-3">
                            {dashboardList.distribution_gender.map((gender, genderIDX) => (
                                <div className="d-flex align-items-center mb-4" key={genderIDX}>
                                    <div className="w-9 h-9">
                                        <img src="/assets/svg/status-employee.svg" alt="" />
                                    </div>
                                    <div className="px-3 flex-initial w-full">
                                        <div className="w-summary-info d-flex justify-content-between font-semibold text-white-dark mb-1 mt-2 ml-2" style={{ height: "20px" }}>
                                            <h6>{gender.gender}</h6>
                                            <p className="ltr:ml-auto rtl:mr-auto text-xs">{`${gender.distribution} %`}</p>
                                        </div>
                                        <div>
                                            <div className={`w-full rounded-full h-5 p-1 bg-dark-light overflow-hidden shadow-3xl dark:bg-dark-light/10 dark:shadow-none ${getColorClass(genderIDX)}`}>
                                                <div
                                                    className="bg-gradient-to-r from-[#009ffd] to-[#2a2a72] w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-white before:w-2 before:h-2 before:rounded-full before:m-auto"
                                                    style={{ width: `${gender.distribution}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </> : ""}
                    {dashboardList.distribution_department.length > 0 ? <>
                        <div className="d-flex align-items-start justify-content-between mb-3">
                            <h5 className="font-semibold text-lg dark:text-white-light">Employee Distribution by Department</h5>
                        </div>
                        <div className="d-flex flex-col mb-3">
                            {dashboardList.distribution_department.map((department, departmentIDX) => (
                                <div className="d-flex align-items-center mb-4">
                                    <div className="w-9 h-9">
                                        <img src="/assets/svg/status-employee.svg" alt="" />
                                    </div>
                                    <div className="px-3 flex-initial w-full">
                                        <div className="w-summary-info d-flex justify-content-between font-semibold text-white-dark mb-1 mt-2 ml-2" style={{ height: "20px" }}>
                                            <h6>{department.department_name}</h6>
                                            <p className="ltr:ml-auto rtl:mr-auto text-xs">{`${department.distribution} %`}</p>
                                        </div>
                                        <div>
                                            <div className={`w-full rounded-full h-5 p-1 bg-dark-light overflow-hidden shadow-3xl dark:bg-dark-light/10 dark:shadow-none ${getColorClass(departmentIDX)}`}>
                                                <div
                                                    className="bg-gradient-to-r from-[#009ffd] to-[#2a2a72] w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-white before:w-2 before:h-2 before:rounded-full before:m-auto"
                                                    style={{ width: `${department.distribution}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </> : ""}
                </div>
            }
        </div >
    )
}
export default Dashboard;