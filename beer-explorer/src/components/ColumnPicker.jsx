import React from 'react'
import * as d3 from "d3";
import { useState, useEffect } from 'react';
import Select from 'react-select';

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

const ColumnPicker = ({ column_defs, columns, label = "Columns", setColumns }) => {
    var options = []
    if (column_defs !== null) {
        for (var column in column_defs) {
            if ((column_defs[column].description != null)&&(column_defs[column].hidden!=true)) {
                options.push( { value : column, label : column_defs[column].description })
            }
        }
    }
    
    return (
            // <label>Columns: <Select size={5} name={'columns'} isMulti={true} onChange={setColumns} value={columns} options={options}/></label>

            <Autocomplete
                multiple
                id={"columnPicker"}
                options={options}
                value={columns}
                onChange={(e,v) => setColumns(v)}
                isOptionEqualToValue={(a,b) => { return a.value == b.value }}
                renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label={label}
                />
                )}
                />


        )
}
export default ColumnPicker;
