import { useHistory } from "react-router";
import { PageLinks } from "../../common/Constants";
import { TableViewMappings } from "../../common/TableViewMappings";
import { Link } from "react-router-dom";


const ListButtonViewDetails: React.FC<{ data: any, tableDetail: TableViewMappings.TableDetail }> = ({ data, tableDetail }) => {
    const history = useHistory();

    return (
        <button type="button" className="table-button" title="singleButton" onClick={() => history.push(`${PageLinks.PAYSLIP}?employee_id=${data[tableDetail.primary_column]}`, { state: { id: data[tableDetail.primary_column] } })}>
            View Details
        </button>
        // <Link to={`${PageLinks.EMPLOYER_PERSONAL_VIEW_DETAILS}/${data[tableDetail.primary_column]}`} className="table-button" title="singleButton">
        //     View Details
        // </Link>
    )
}

export default ListButtonViewDetails;
