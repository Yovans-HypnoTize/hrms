import { SalaryComponentCalculationType } from "../../common/Constants";

const CellSalaryComponentFixedValue: React.FC<{ data: any }> = ({ data }) => {

    return (
        <>{data['salary_component_calc_type'] === SalaryComponentCalculationType.CommonFixedForAll ? <>{data['salary_component_common_fixed_value']}</> : <>N/A</>}</>
    )
}

export default CellSalaryComponentFixedValue;