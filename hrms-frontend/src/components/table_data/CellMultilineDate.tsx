import { useEffect, useState } from "react";

const CellMultilineDate: React.FC<{ data: any, customKeys?: string[] }> = ({ data, customKeys }) => {

    const [displayStrings, setDisplayStrings] = useState<string[]>([]);

    useEffect(() => {
        if (customKeys) {
            const dispStrings: string[] = [];
            customKeys.forEach(key => dispStrings.push(data[key]));
            setDisplayStrings(dispStrings);
        }
    }, [data]);

    return (
        <>
            {displayStrings.join(', ')}
        </>
    )
}

export default CellMultilineDate;