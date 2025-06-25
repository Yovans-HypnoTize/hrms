import { useEffect, useState } from "react";
import { StatusValues } from "../../common/Constants";

const CellLeaveStatus: React.FC<{ data: any, data_key: string }> = ({ data, data_key }) => {

    const [statusClass, setStatusClass] = useState('');
    const [testDriveStatusString, setTestDriveStatusString] = useState('');

    useEffect(() => {
        if (data !== undefined && data[data_key] !== undefined) {
            if (data[data_key] == StatusValues.Pending) {
                setStatusClass("badge-soft-warning");
                setTestDriveStatusString("Pending");
            } else if (data[data_key] == StatusValues.Approved) {
                setStatusClass("badge-soft-success");
                setTestDriveStatusString("Approved");
            } else if (data[data_key] == StatusValues.Rejected) {
                setStatusClass("badge-soft-danger");
                setTestDriveStatusString("Rejected");
            }
        }
    }, [data]);

    return (
        <span className={'badge ' + statusClass}>{testDriveStatusString}</span>
    )

}

export default CellLeaveStatus;
