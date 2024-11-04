import React from 'react'
import { useState, useEffect } from 'react';
import Select from 'react-select';

const ColorSelector = ({ colorColumn, setColorColumn, column_defs }) => {
    var options = []
    if (column_defs !== null) {
        for (var column in column_defs) {
            if (column_defs[column].colorScale != null) {
                options.push( <option value={column}>{column_defs[column].description}</option>)
            }
        }
    }
    
    return (
        <select name={'color'} onChange={setColorColumn} value={colorColumn}>
        {
            options
        }
        </select>
    );
}
export default ColorSelector;
