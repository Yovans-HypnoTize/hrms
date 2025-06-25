
const CellNAForZero: React.FC<{ data: any, data_key: string }> = ({ data, data_key }) => {

    return (
        <>{data[data_key] ? data[data_key] : 'N/A'}</>
    )
}

export default CellNAForZero;