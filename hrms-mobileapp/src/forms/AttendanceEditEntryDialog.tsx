import React, { useEffect, useState } from "react";
import { useAppStateAPI } from "../common/AppStateAPI";
import { ServerAPI } from '../common/ServerAPI';
import { APIData, FormDataTypes } from "../common/DataTypes";
import toast from "react-hot-toast";
import { AttendanceType, Endpoints } from "../common/Constants";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from 'dayjs';
import { RiCalendarLine } from "react-icons/ri";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { Drawer } from "@mui/material";
const { RangePicker } = DatePicker;
import Select, { SingleValue } from 'react-select';
import { getFormattedLocalDate } from "../common/Utilities";

const AttendanceEditEntryDialog: React.FC<{ showDialog: boolean, closeDialog: () => void, reloadData: any, }> = ({ showDialog, closeDialog, reloadData }) => {

    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [attendanceList, setAttendanceList] = useState<APIData.EmployeeEditAttendance[]>([]);
    const [attendanceEditValue, setAttendanceEditValue] = useState<APIData.EmployeeEditAttendance[]>([]);
    // const [searchString, setSearchString] = useState('');
    const [attendanceDate, setAttendanceDate] = useState<string[]>([]);
    const [dateRangeSet, setDateRangeSet] = useState(false);
    const [dateRangeFrom, setDateRangeFrom] = useState('');
    const [dateRangeTo, setDateRangeTo] = useState('');
    const [dayJSRange, setDayJSRange] = useState<[Dayjs?, Dayjs?]>([]);
    const attendanceTypeOptions: FormDataTypes.SelectOption[] = [{ label: 'Present', value: AttendanceType.FulldayPresent + "" }, { label: "Absent", value: AttendanceType.Absent + "" }, { label: "Rest Day", value: AttendanceType.RestDay + "" }];
    const customStyles = { control: (provided: any) => ({ ...provided, border: '2px solid #D3D3D3', '&:hover': { borderColor: '#0E7AD5' }, borderRadius: '10px' }) };
    useEffect(() => {
        if (dateRangeFrom && dateRangeTo) {
            setDayJSRange([dayjs(dateRangeFrom), dayjs(dateRangeTo)]);
            attendanceLists(); // Fetch attendance data after date range selection
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

    const generateDateRange = (startDate: string, endDate: string) => {
        const start = dayjs(startDate);
        const end = dayjs(endDate);
        const dateArray = [];
        let currentDate = start;

        while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
            dateArray.push(currentDate.format('YYYY-MM-DD'));
            currentDate = currentDate.add(1, 'day');
        }

        return dateArray;
    };

    const attendanceLists = () => {
        let params: { [k: string]: any } = {};
        params['from_date'] = dateRangeFrom;
        params['to_date'] = dateRangeTo;
        params['page'] = 1;
        params['per_page'] = 10000;
        addProcessingRequests();

        ServerAPI.executeAPI(Endpoints.EMPLOYEE_PENDING_ATTENDANCE, ServerAPI.APIMethod.GET, true, null, params).then(response => {
            const fetchedAttendance = response.data && response.data ? response.data : [];

            const allDates = generateDateRange(dateRangeFrom, dateRangeTo);
            const updatedAttendanceList = allDates.map(date => {
                const existingAttendance = fetchedAttendance.find((att: any) => att.employee_attendance_date === date);
                return existingAttendance || {
                    employee_attendance_id: null,
                    employee_attendance_date: date,
                    attendance_type: '',
                    employee_attendance_first_in_time: null,
                    employee_attendance_last_out_time: null,
                    employee_attendance_regular_duration: null,
                    employee_attendance_ot_duration: null,
                    employee_attendance_nd_duration: null,
                    employee_attendance_nd_ot_duration: null,
                    lop_duration: null
                };
            });

            setAttendanceList(updatedAttendanceList);
        }).finally(() => {
            reduceProcessingRequests();
        });
    };



    const handleInputChange = (date: string, field: keyof APIData.EmployeeEditAttendance, value: string | number) => {
        setAttendanceEditValue(prevState => {
            const updatedAttendanceList = [...prevState];
            const filteredAttendanceList = attendanceList.filter((item) => item.employee_attendance_date === date);
            const existingIndex = updatedAttendanceList.findIndex(item => item.employee_attendance_date === date);

            if (existingIndex === -1) {
                updatedAttendanceList.push({
                    ...filteredAttendanceList[0],
                    [field]: value
                });
            } else {
                updatedAttendanceList[existingIndex] = {
                    ...updatedAttendanceList[existingIndex],
                    [field]: value,
                };
            }

            return updatedAttendanceList;
        });
    };

    const submitEditAttendance = () => {
        addProcessingRequests();
        const filteredAttendance = attendanceEditValue.filter(att => att.approval_status !== "10");
        ServerAPI.updateEmployeeAttendance(filteredAttendance).then(response => {
            if (response && response['message']) {
                toast.success(response['message']);
                reloadData();
                closeDialog();
            } else if (response && response['message']) {
                toast.error(response['message']);
            }
        }).finally(() => {
            reduceProcessingRequests();
        });
    }

    return (
        <Drawer anchor="right" open={showDialog} onClose={closeDialog} className="drawer-max-1">
            <div className='tabdetails'>
                <p className="detailed-heading mt-3">Update Attendance</p>
                <div className='col-8 d-flex justify-content-start p-0 mt-3' style={{ gap: "10px" }}>
                    {/* <>
                        <input type="text" className='search-option' placeholder='Search By Keywords' value={searchString} onChange={(e: any) => {
                            setSearchString(e.target.value);
                        }} />
                        <Icon path={mdiMagnify} size={1} className='search-icon' />
                    </> */}
                    <RangePicker
                        value={dateRangeSet ? dayJSRange as [Dayjs, Dayjs] : undefined}
                        onChange={handleRangeChange}
                        allowClear={true}
                        getPopupContainer={trigger => trigger?.parentNode as HTMLElement}
                        suffixIcon={<RiCalendarLine className="remix-icon hp-text-color-black-100" />}
                    />

                    {dateRangeSet && <div className="mt-2" style={{ cursor: "pointer" }} onClick={() => { setDateRangeSet(false); setDateRangeFrom(""); setDateRangeTo("") }}><CloseOutlinedIcon /></div>}
                </div>
                {dateRangeSet && attendanceList.length > 0 && (<>
                    <div className='custom-tableview-scroll'>
                        <div className="table-container">
                            <div className="table-scroll">
                                <div className="table-responsive manual-entry">
                                    <table className="table">
                                        <thead className="color-native-blue">
                                            <tr>
                                                <th className='table-heading'>Date</th>
                                                <th className='table-heading'>Attendance Type</th>
                                                <th className='table-heading'>In Time</th>
                                                <th className='table-heading'>Out Time</th>
                                                <th className='table-heading'>Regular Duration (Minutes)</th>
                                                <th className='table-heading'>Over Time Duration (Minutes)</th>
                                                <th className='table-heading'>Night Differential Duration (Minutes)</th>
                                                <th className='table-heading'>Night Differential Over Time Duration (Minutes)</th>
                                                <th className='table-heading'>LOP Duration (Minutes)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendanceList.map((att, index) => {
                                                const isApproved = att.approval_status === "10";
                                                return (
                                                    <tr key={index} style={isApproved ? { backgroundColor: "#ddd" } : {}}>
                                                        <td>{att.employee_attendance_date ? getFormattedLocalDate(att.employee_attendance_date) : "N/A"}</td>
                                                        <td>
                                                            <div className="additional-filter-1 additional-filter" style={{ width: "145px" }}>
                                                                <div className="mb-24 attendance-edit">
                                                                    <Select
                                                                        styles={customStyles}
                                                                        onChange={(selectedOption: SingleValue<FormDataTypes.SelectOption>) =>
                                                                            handleInputChange(att.employee_attendance_date, 'attendance_type', selectedOption?.value || '')
                                                                        }
                                                                        value={attendanceTypeOptions.find(option => option.value === (attendanceEditValue.find(val => val.employee_attendance_date === att.employee_attendance_date)?.attendance_type || att.attendance_type))}
                                                                        options={attendanceTypeOptions}
                                                                        className="basic-multi-select"
                                                                        placeholder="Select Type"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {/* <td><input type="text" value={att.attendance_type} onChange={(e) => handleInputChange(att.employee_attendance_id, 'attendance_type', e.target.value)} /></td> */}
                                                        <td>
                                                            <ReactDatePicker
                                                                value={attendanceEditValue.find(val => val.employee_attendance_date === att.employee_attendance_date)?.employee_attendance_first_in_time ?? att.employee_attendance_first_in_time ?? ''}
                                                                onChange={(date: Date) => handleInputChange(att.employee_attendance_date, "employee_attendance_first_in_time", format(date, "HH:mm:ss"))}
                                                                showTimeSelect
                                                                timeFormat="HH:mm:ss"
                                                                timeIntervals={1}
                                                                dateFormat="HH:mm:ss"
                                                                className="form-control height-date-picker"
                                                                placeholderText=""
                                                                disabled={isApproved}
                                                                popperContainer={({ children }) => <div>{children}</div>}
                                                                popperPlacement="bottom-end"
                                                            />
                                                        </td>
                                                        <td>
                                                            <ReactDatePicker
                                                                value={attendanceEditValue.find(val => val.employee_attendance_date === att.employee_attendance_date)?.employee_attendance_last_out_time ?? att.employee_attendance_last_out_time ?? ''}
                                                                onChange={(date: Date) => handleInputChange(att.employee_attendance_date, "employee_attendance_last_out_time", format(date, "HH:mm:ss"))}
                                                                showTimeSelect
                                                                timeFormat="HH:mm:ss"
                                                                timeIntervals={1}
                                                                dateFormat="HH:mm:ss"
                                                                className="form-control height-date-picker"
                                                                placeholderText=""
                                                                disabled={isApproved}
                                                                popperContainer={({ children }) => <div>{children}</div>}
                                                                popperPlacement="bottom-end"
                                                            />
                                                        </td>
                                                        <td><input type="text" disabled={isApproved} value={attendanceEditValue.find(val => val.employee_attendance_date === att.employee_attendance_date)?.employee_attendance_regular_duration ?? att.employee_attendance_regular_duration ?? '0'} onChange={(e) => handleInputChange(att.employee_attendance_date, 'employee_attendance_regular_duration', e.target.value === '' ? '' : parseInt(e.target.value))} /></td>
                                                        <td><input type="text" disabled={isApproved} value={attendanceEditValue.find(val => val.employee_attendance_date === att.employee_attendance_date)?.employee_attendance_ot_duration ?? att.employee_attendance_ot_duration ?? '0'} onChange={(e) => handleInputChange(att.employee_attendance_date, 'employee_attendance_ot_duration', e.target.value === '' ? '' : parseInt(e.target.value))} /></td>
                                                        <td><input type="text" disabled={isApproved} value={attendanceEditValue.find(val => val.employee_attendance_date === att.employee_attendance_date)?.employee_attendance_nd_duration ?? att.employee_attendance_nd_duration ?? '0'} onChange={(e) => handleInputChange(att.employee_attendance_date, 'employee_attendance_nd_duration', e.target.value === '' ? '' : parseInt(e.target.value))} /></td>
                                                        <td><input type="text" disabled={isApproved} value={attendanceEditValue.find(val => val.employee_attendance_date === att.employee_attendance_date)?.employee_attendance_nd_ot_duration ?? att.employee_attendance_nd_ot_duration ?? '0'} onChange={(e) => handleInputChange(att.employee_attendance_date, 'employee_attendance_nd_ot_duration', e.target.value === '' ? '' : parseInt(e.target.value))} /></td>
                                                        <td><input type="text" disabled={isApproved} value={attendanceEditValue.find(val => val.employee_attendance_date === att.employee_attendance_date)?.lop_duration ?? att.lop_duration ?? '0'} onChange={(e) => handleInputChange(att.employee_attendance_date, 'lop_duration', e.target.value === '' ? '' : parseInt(e.target.value))} /></td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row btn-form-submit" style={{ zIndex: "0" }}>
                        <button type="button" className="button1" onClick={closeDialog}>Cancel</button>
                        <button type="button" className="button2" disabled={false} onClick={submitEditAttendance}>Save Changes</button>
                    </div></>
                )}
            </div>

        </Drawer >
    )
}

export default AttendanceEditEntryDialog;
