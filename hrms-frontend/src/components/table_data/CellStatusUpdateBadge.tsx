import { useEffect, useState } from "react";
import { PageMappings } from "../../common/PageMappings";
import { TableViewMappings } from "../../common/TableViewMappings";
import { ServerAPI } from "../../common/ServerAPI";
import { useAppStateAPI } from "../../common/AppStateAPI";
import ConfirmDialog from "../ConfirmDialog";
import { StatusValues } from "../../common/Constants";

const CellStatusUpdateBadge: React.FC<{ data: any, data_key: string, pageMapping: PageMappings.PageDetail, tableDetail: TableViewMappings.TableDetail, reloadData: any }> = ({ data, data_key, pageMapping, tableDetail, reloadData }) => {

    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const [showStatusUpdateConfirm, setShowStatusUpdateConfirm] = useState(false);
    const [statusClass, setStatusClass] = useState('');
    const [statusString, setStatusString] = useState('');

    useEffect(() => {
        if (data !== undefined && data[data_key] !== undefined) {
            if (data[data_key] == StatusValues.DELETED) {
                setStatusClass("badge-soft-danger");
                setStatusString("Deleted");
            } else if (data[data_key] == StatusValues.ACTIVE) {
                setStatusClass("badge-soft-success");
                setStatusString("Active");
            } else {
                setStatusClass("badge-soft-warning");
                setStatusString("In-Active");
            }
        }
    }, [data]);

    const updateStatus = () => {
        if (tableDetail && pageMapping && pageMapping.statusUpdate !== undefined) {
            let params: { [k: string]: any } = {};
            params[pageMapping.statusUpdate.paramName] = data[tableDetail.primary_column];
            params['status'] = data[data_key] ? 0 : 1;
            addProcessingRequests();
            ServerAPI.executeAPI(pageMapping.statusUpdate.endpoint, ServerAPI.APIMethod.POST, true, null, params).then(response => {
                if (response !== undefined && response.success) {
                    reloadData();
                } else {
                    alert("Something Went Wrong");
                }
            }).finally(() => {
                reduceProcessingRequests();
            });
        }
    }

    return (
        <div className="status-update-badge d-flex d-inline">
            <span className={'badge ' + statusClass}>{statusString}</span>
            {data[data_key] !== StatusValues.DELETED && (
                <div className='toggle-switch mx-2'>
                    <label className='toggle-label'>
                        <input type='checkbox' className="toggle-switch-input" id="customSwitchSuccess"
                            checked={data[data_key] ? true : false}
                            onChange={() => setShowStatusUpdateConfirm(true)}
                        />
                        <span className='slider'></span>
                    </label>
                </div>
            )}
            <ConfirmDialog showConfirm={showStatusUpdateConfirm} confirmHeading={'Status Update'} confirmMsg={`Are you sure you want to set this ${pageMapping.titleSingular} as ${data[data_key] ? 'In-Active' : 'Active'}?`} handleNo={() => {
                setShowStatusUpdateConfirm(false);
            }} handleYes={() => {
                updateStatus();
                setShowStatusUpdateConfirm(false);
            }} />
        </div>

    )

}

export default CellStatusUpdateBadge;