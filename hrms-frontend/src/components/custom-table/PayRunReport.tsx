import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { Link, Router } from 'react-router-dom';
import { link } from 'fs';




const PayRunReport: React.FC = () => {

    return (
        <>
            <div className='row mr-0 ml-0 mb-2 py-2 pl-0 d-flex align-items-center w-100 mt-2' style={{ textTransform: "capitalize" }}>
                <div className='col-6 pl-0'>
                    <p className='additional-option-title mb-1'>pay run for January 2024 </p>
                </div>

                <div>
                    <div className="table-container">
                        <div className="table-scroll">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className="color-native-blue">
                                        <tr>
                                            <th className='table-heading' >total employees </th>
                                            <th className='table-heading' >allowances total  </th>
                                            <th className='table-heading' >deductions total</th>
                                            <th className='table-heading' >tax deductions</th>
                                            <th className='table-heading' >additional allowances </th>
                                            <th className='table-heading' >final amount	</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td ><span className='pay-run-report'> 600</span></td>
                                            <td ><span className='pay-run-report'>12,000.00  </span></td>
                                            <td ><span className='pay-run-report'>8,000.00  </span></td>
                                            <td ><span className='pay-run-report'>12,000.00  </span></td>
                                            <td ><span className='pay-run-report'>2,000.00  </span></td>
                                            <td ><span className='pay-run-report'>95,000.00  </span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="table-container">
                <div className="table-scroll">
                    <div className="table-responsive">
                        <table className="table">
                            <thead className="color-native-blue">
                                <tr>
                                    <th className='table-heading' >S.no </th>
                                    <th className='table-heading' >employee  </th>
                                    <th className='table-heading' >Leave Request From</th>
                                    <th className='table-heading' >Leave Request Upto</th>
                                    <th className='table-heading' >Reason </th>
                                    <th className='table-heading' >No Of Days	</th>
                                    <th className='table-heading' >Leave Type	</th>
                                    <th className='table-heading' >Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>vishnu senthil</td>
                                    <td>03/02/2001</td>
                                    <td>06/02/2001</td>
                                    <td>lorem ipsum lorem... </td>
                                    <td>3</td>
                                    <td>sick leave</td>
                                    <td><div className='double-btn-container'>
                                        <button type="button" className="table-button-left" title="doubleButton"  >
                                            Deny
                                        </button>
                                        <button type="button" className="table-button-right" title="doubleButton" >
                                            Accept
                                        </button>
                                    </div></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PayRunReport;