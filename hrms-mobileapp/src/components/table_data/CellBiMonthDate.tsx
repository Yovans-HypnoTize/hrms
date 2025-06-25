import { formatDateRange, formatDate, getFormattedLocalDate } from "../../common/Utilities";
import moment from 'moment';



const CellBiMonthDate: React.FC<{ data: any, data_key: string }> = ({ data, data_key }) => {

    const formatBiDate = (dateStr: string): string => {
        if (dateStr.includes(' - ')) {
            const dates = dateStr.split(' - ').map(d => d.trim());
            if (dates.length === 2) {
                return formatDateRange(dateStr);
            }
        }
        return getFormattedLocalDate(dateStr);
    };

    return (
        <>{formatBiDate(data[data_key])}</>
    );
}

export default CellBiMonthDate;