import { useNavigate } from "react-router";
import { PageLinks } from "../../common/Constants";
import { TableViewMappings } from "../../common/TableViewMappings";
import { Link } from "react-router-dom";


const ListButtonViewDetails: React.FC<{ data: any, tableDetail: TableViewMappings.TableDetail }> = ({ data }) => {
    const navigate = useNavigate();

    return (
        <button type="button" className="table-button" title="singleButton" onClick={() => navigate(`${PageLinks.EMPLOYER_PERSONAL_VIEW_DETAILS}?employee_id=${data.employee.employee_id}`)}>
            View Details
        </button>
    )
}

export default ListButtonViewDetails;
