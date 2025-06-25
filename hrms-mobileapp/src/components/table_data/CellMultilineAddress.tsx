import React, { useEffect, useState } from "react";

const CellMultilineAddress: React.FC<{ data: any, customKeys?: string[] }> = ({ data, customKeys }) => {
    const [displayStrings, setDisplayStrings] = useState<string[]>([]);

    useEffect(() => {
        if (customKeys) {
            const dispStrings: string[] = [];
            customKeys.forEach(key => {
                if (data[key]) {
                    dispStrings.push(data[key]);
                }
            });
            setDisplayStrings(dispStrings);
        }
    }, [data, customKeys]);

    return (
        <>
            {displayStrings.map((string, index) => (
                <>
                    {index > 0 && displayStrings[index - 1] && ','} {string}
                </>
            ))}
        </>
    );
};

export default CellMultilineAddress;
