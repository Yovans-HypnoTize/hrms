
import { useLocation } from "react-router-dom";
import { PageLinks } from "../../common/Constants";

const CellDownload: React.FC<{ data: any, data_key: string }> = ({ data, data_key }) => {
    const location = useLocation();

    return (
        <>{data[data_key] && <a style={{ fontSize: "12px", fontWeight: "400", padding: "7px", whiteSpace: "nowrap" }} className='toggle-button active payslip-a' href={data[data_key]} download target="blank">{location.pathname === PageLinks.PAYSLIP ? "Download Payslip" : "Download"}</a>}</>
    )
}

export default CellDownload;