import React, { useEffect, useState } from "react";
import { useAppStateAPI } from "../../common/AppStateAPI";
import { ServerAPI } from '../../common/ServerAPI';
import { APIData, FormDataTypes } from "../../common/DataTypes";
import toast from "react-hot-toast";
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';
import { Endpoints, LeaveRequestStatus, StatusValues } from "../../common/Constants";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from 'dayjs';
import { RiCalendarLine } from "react-icons/ri";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getFormattedLocalDate, getObjectKeyByValue } from "../../common/Utilities";
const { RangePicker } = DatePicker;
import Select from 'react-select';

const SubordinateAllLeaveRequest: React.FC = () => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [subordinateLeaveRequest, setSubordinateLeaveRequest] = useState<APIData.SubordinateLeaveRequest[]>();
    const [searchString, setSearchString] = useState('');
    const [dateRangeSet, setDateRangeSet] = useState(false);
    const [dateRangeFrom, setDateRangeFrom] = useState('');
    const [dateRangeTo, setDateRangeTo] = useState('');
    const [leaveTypeList, setLeaveTypeList] = useState<FormDataTypes.SelectOption[]>([]);
    const [seletedLeaveType, setSelectedLeaveType] = useState("");
    const [dayJSRange, setDayJSRange] = useState<[Dayjs?, Dayjs?]>([]);
    const customStyles = { control: (provided: any) => ({ ...provided, border: '2px solid #D3D3D3', '&:hover': { borderColor: '#0E7AD5' }, borderRadius: '10px' }) };
    var searchTimeout: any = null;
    const statusOptions: FormDataTypes.SelectOption[] = [{ label: 'Rejected', value: StatusValues.Rejected + "" }, { label: "Approved", value: StatusValues.Approved + "" }, { label: "Pending", value: StatusValues.Pending + "" }];
    const [seletedStatus, setSelectedStatus] = useState("");

    const handleStatusChange = (selectedOption: FormDataTypes.SelectOption | null) => {
        setSelectedStatus(selectedOption?.value || "");
    };

    useEffect(() => {
        if (dateRangeFrom && dateRangeTo) {
            setDayJSRange([dayjs(dateRangeFrom), dayjs(dateRangeTo)])
        }
    }, [dateRangeFrom, dateRangeTo]);

    const handleRangeChange = (value: any) => {
        if (value) {
            setDateRangeFrom(dayjs(value[0]).format('YYYY-MM-DD'));
            setDateRangeTo(dayjs(value[1]).format('YYYY-MM-DD'));
            setDateRangeSet(true);
        } else {
            setDateRangeSet(false);
        }
    }

    const handleLeaveTypeChange = (selectedOption: FormDataTypes.SelectOption | null) => {
        setSelectedLeaveType(selectedOption?.value || "");
    };


    const getSubordinateLeave = () => {
        let params: { [k: string]: any } = {};
        params['from_date'] = dateRangeFrom;
        params['to_date'] = dateRangeTo;
        params['search'] = searchString;
        params['leave_type'] = seletedLeaveType;
        params['status'] = seletedStatus;
        addProcessingRequests();
        ServerAPI.executeAPI(Endpoints.SUBORDINATE_LEAVE_REQUEST, ServerAPI.APIMethod.GET, true, null, params).then(response => {
            if (response.data) {
                setSubordinateLeaveRequest(response.data);
            }
        }).finally(() => {
            reduceProcessingRequests();
        });
    };

    // const getLeaveType = () => {
    //     addProcessingRequests();
    //     ServerAPI.executeAPI(Endpoints.EMPLOYEE_LEAVE_TYPES, ServerAPI.APIMethod.GET, true, null).then(response => {
    //         if (response.data) {
    //             const leaveType = response.data.map((leave: any) => ({
    //                 label: leave.leave_type_name,
    //                 value: leave.leave_type_id
    //             }))
    //             setLeaveTypeList(leaveType);
    //         }
    //     }).finally(() => {
    //         reduceProcessingRequests();
    //     });
    // };

    useEffect(() => {
        getSubordinateLeave();
    }, [dateRangeFrom, dateRangeTo, searchString, seletedLeaveType, seletedStatus])

    // useEffect(() => {
    //     getLeaveType();
    // }, [])

    return (
        <div className='subordinate mt-1'>
            <div className='col-12 d-flex justify-content-start align-items-center p-0 mt-3 flex-wrap' style={{ gap: "15px" }}>
                <h4 className="header-title mt-0 mb-0">All Leave Request</h4>
                <RangePicker
                    value={dateRangeSet ? dayJSRange as [Dayjs, Dayjs] : undefined}
                    onChange={handleRangeChange}
                    allowClear={true}
                    suffixIcon={<RiCalendarLine className="remix-icon hp-text-color-black-100" />}
                />
                {dateRangeSet && <div className="mt-2" style={{ cursor: "pointer" }} onClick={() => { setDateRangeSet(false); setDateRangeFrom(""); setDateRangeTo("") }}><CloseOutlinedIcon /></div>}
                <div className="additional-filter">
                    <div className="mb-24">
                        <Select
                            styles={customStyles}
                            onChange={handleLeaveTypeChange}
                            value={leaveTypeList.find(option => option.value === seletedLeaveType) || null}
                            options={leaveTypeList}
                            className="basic-multi-select"
                            placeholder={"Filter Leave Type"}
                        />
                    </div>
                </div>
                <div className="additional-filter">
                    <div className="mb-24">
                        <Select
                            styles={customStyles}
                            onChange={handleStatusChange}
                            value={statusOptions.find(option => option.value === seletedStatus) || null}
                            options={statusOptions}
                            className="basic-multi-select"
                            placeholder={"Filter Status"}
                        />
                    </div>
                </div>
                {(seletedLeaveType != "" || seletedStatus != "") && <div style={{ cursor: "pointer" }} className='ml-2' onClick={() => { setSelectedLeaveType(""); setSelectedStatus("") }}><CloseOutlinedIcon /></div>}
            </div>
            <div className="pb-2 pt-4" style={{ position: "relative", width: "250px" }}>
                <input type="text" className='search-option w-100' placeholder='Search By Keywords' value={searchString} onChange={(e: any) => {
                    if (searchTimeout) clearTimeout(searchTimeout);
                    setSearchString(e.target.value);
                }} />
                <Icon path={mdiMagnify} size={1} className='search-icon' />
            </div>
            <div className='d-flex flex-wrap flex-row mt-2' style={{ gap: "10px" }}>
                {subordinateLeaveRequest && subordinateLeaveRequest.length > 0 ? subordinateLeaveRequest.map((leave, leaveIDX) => (
                    <div className="table-container subordinate-leave" key={leaveIDX}>
                        <div className="table-scroll">
                            <div className="table-responsive">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className='d-flex align-items-center p-2 w-90' style={{ gap: "10px" }}>
                                        <img src={leave.employee_photo ? leave.employee_photo : window.location.origin + "/assets/images/profile-dummy.png"} width={40} height={40} alt="" />
                                        <div>
                                            <p className='leave-req-name m-0'>{leave.employee_name}</p>
                                            <p className='leave-req-num m-0'>{leave.employee_mobile}</p>
                                        </div>
                                    </div>
                                    <p className='m-0 w-10 mt-2 d-flex justify-content-center align-items-center status-btn mr-2' style={{ color: leave.employee_leave_req_day_approval_status === 0 ? "black" : "white", backgroundColor: leave.employee_leave_req_day_approval_status === 10 ? "green" : leave.employee_leave_req_day_approval_status === 5 ? "red" : leave.employee_leave_req_day_approval_status === 0 ? "yellow" : "#000" }}>{getObjectKeyByValue(LeaveRequestStatus, leave.employee_leave_req_day_approval_status)}</p>
                                </div>
                                <div className='pl-2'>
                                    <p className='leave-req-name mb-1'>{leave.leave_type_name}</p>
                                    <div><span className='leave-req-name' style={{ fontWeight: "400" }}>{leave.employee_leave_req_no_of_days ? `${leave.employee_leave_req_no_of_days} Days` : "N/A"} |</span> <span className='leave-req-name m-0' style={{ color: "rgba(85, 85, 85, 0.8)" }}>{`${getFormattedLocalDate(leave.employee_leave_req_period_from)} - ${getFormattedLocalDate(leave.employee_leave_req_period_to)}`}</span></div>
                                    <p className='leave-req-name mb-2' style={{ color: "rgba(85, 85, 85, 0.8)" }}>{leave.employee_leave_req_reason}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : <div className="table-container">
                    <div className="table-scroll">
                        <div className="table-responsive pl-2">
                            <h6 className='my-3'>No Data Available</h6>
                        </div></div> </div>}
            </div>
        </div>
    );
};

export default SubordinateAllLeaveRequest;