import React from 'react';
interface RowData {
    bank_id: number;
    bank_name: string;
    countries: { country_id: number; country_name: string }[];
}

interface BankCountryColumnProps {
    banks_details: RowData;
}

const BankCountryColumn: React.FC<BankCountryColumnProps> = ({ banks_details }) => {
    if (banks_details && banks_details.countries && banks_details.countries.length > 0) {
        const countries = banks_details.countries;
        const country = countries[0];

        return <span>{country.country_name}</span>;
    } else {
        return <span>No Country</span>;
    }
};


export default BankCountryColumn;


