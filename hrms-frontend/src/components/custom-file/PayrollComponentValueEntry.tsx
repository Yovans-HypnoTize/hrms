import React from "react";


const PayrollComponentValueEntry: React.FC = () => {

    return (

        <div className='custom-tableheight payroll-manual'>
            <div className='custom-tableview'>
                <div className='custom-tableview-scroll'>
                    <div className="table-container">
                        <div className="table-scroll">
                            <p className="detailed-heading mt-3">Enter Values</p>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className="color-native-blue">
                                        <tr>
                                            <th className='table-heading'>Employee</th>
                                            <th className='table-heading'>Allowance</th>
                                            <th className='table-heading'>Deduction</th>
                                            <th className='table-heading'>Allowance 1</th>
                                            <th className='table-heading'>Deduction 1</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Dinesh</td>
                                            <td>2000</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>1000</td>
                                        </tr>
                                        <tr>
                                            <td>Bhaskar</td>
                                            <td>-</td>
                                            <td>1000</td>
                                            <td>-</td>
                                            <td>1000</td>
                                        </tr>
                                        <tr>
                                            <td>Gowtham</td>
                                            <td>-</td>
                                            <td>1000</td>
                                            <td>1000</td>
                                            <td>-</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default PayrollComponentValueEntry;