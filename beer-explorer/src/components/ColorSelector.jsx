import React from 'react'
import { useState, useEffect } from 'react';
// import Select from 'react-select';
import { FormControl, Select, InputLabel, MenuItem} from '@mui/material'

const ColorSelector = ({
    colorColumn,
    setColorColumn,
    column_defs,
    filter = (d) => 1,
    label = "Color By:"
}) => {
    var options = []
    if (column_defs !== null) {
        for (var column in column_defs) {
            if (filter(column) && (column_defs[column].colorScale != null)) {
                options.push( <MenuItem key={column} value={column}>{column_defs[column].description}</MenuItem>)
            }
        }
    }
    
    return (
        <FormControl fullWidth>
            <InputLabel id="color-by-label">{label}</InputLabel>
            <Select
                labelId="color-by-label"
                id="color-by-select"
                value={colorColumn}
                label="Age"
                onChange={(e) => setColorColumn(e.target.value)}>
                {options}
            </Select>
        </FormControl>
        // <select name={'color'} onChange={setColorColumn} value={colorColumn}>
        // {
        //     options
        // }
        // </select>
    );
}
export default ColorSelector;
