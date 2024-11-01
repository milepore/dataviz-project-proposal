import React from 'react'
import * as d3 from "d3";
import { useState, useEffect } from 'react';
import Select from 'react-select';

const ColumnPicker = ({ column_defs, columns, setColumns }) => {
    var options = []
    if (column_defs !== null) {
        for (var column in column_defs) {
            if (column_defs[column].description !== null) {
                options.push( { value : column, label : column_defs[column].description })
            }
        }
    }
    
    return (
            <label>Columns: <Select size={5} name={'columns'} isMulti={true} onChange={setColumns} value={columns} options={options}/></label>
    )
}
export default ColumnPicker;
