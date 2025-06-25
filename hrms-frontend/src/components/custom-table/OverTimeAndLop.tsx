import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { Link, Router } from 'react-router-dom';
import { link } from 'fs';




const OverTimeAndLop: React.FC = () => {

    return (
        <div className="table-container">
            <div className="table-scroll">
                <div className="table-responsive">
                    <table className="table">
                        <thead className="color-native-blue">
                            <tr>
                                <th className='table-heading' >S.no </th>
                                <th className='table-heading' >employee  </th>
                                <th className='table-heading' >over time</th>
                                <th className='table-heading' >regular over time</th>
                                <th className='table-heading' >night differential over time </th>
                                <th className='table-heading' >Loss of pay days	</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>vishnu senthil</td>
                                <td>15:00</td>
                                <td>8:00</td>
                                <td>6:00</td>
                                <td>6</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OverTimeAndLop;