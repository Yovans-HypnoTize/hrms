import { SalaryComponentCalculationType } from "../../common/Constants";

const CellSalaryComponentFormula: React.FC<{ data: any }> = ({ data }) => {

    return (
        <>{data['salary_component_calc_type'] === SalaryComponentCalculationType.FormulaBased ? <>{data['salary_component_calculation_formula']}</> : <>N/A</>}</>
    )
}

export default CellSalaryComponentFormula;