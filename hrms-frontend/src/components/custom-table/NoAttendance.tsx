import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { Link, Router } from 'react-router-dom';
import { link } from 'fs';




const NoAttendance: React.FC = () => {

    return (
        <div className="table-container">
            <div className="table-scroll">
                <div className="table-responsive">
                    <table className="table">
                        <thead className="color-native-blue">
                            <tr>
                                <th className='table-heading' >S.no </th>
                                <th className='table-heading' >employee  </th>
                                <th className='table-heading' >Date</th>
                                <th className='table-heading' >Attendance</th>
                                <th className='table-heading' >Action </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>vishnu senthil</td>
                                <td>03/02/2001</td>
                                <td>no attendance</td>

                                <td><div className='double-btn-container'>
                                    <button type="button" className="table-button-left" title="doubleButton"  >
                                        mark as absent
                                    </button>
                                    <button type="button" className="table-button-right" title="doubleButton" >
                                        apply leave
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

export default NoAttendance;