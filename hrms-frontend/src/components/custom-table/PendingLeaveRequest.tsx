import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { Link, Router } from 'react-router-dom';
import { link } from 'fs';




const PendingLeaveRequest: React.FC = () => {

    return (
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
    );
};

export default PendingLeaveRequest;