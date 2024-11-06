import React from 'react'
import * as d3 from "d3";
import { useState, useEffect } from 'react';

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel';

// import RangeSlider from 'react-range-slider-input';
import Slider from '@mui/material/Slider';
import 'react-range-slider-input/dist/style.css';


const DataFilter = ({ data, setFilteredData, column_defs }) => {
    const [filter, setFilter] = useState({})

    function filterData(data, filter) {
        if (data == null || filter == null)
            return;

        var filteredData = []
        if (filter == null)
            return data;

        var csvData = data.csvData;

        for (var dataRow of csvData) {
            var includeRow = true;

            // filter each column
            for (var column in column_defs) {
                if (column_defs[column].filter_type === "multi") {
                    if ((filter[column] != null)&&(filter[column].length != 0)) {
                        const filterValues = filter[column];
                        if (!filterValues.includes(dataRow[column]))
                            includeRow = false
                    }
                } else if (column_defs[column].filter_type === "range") {
                    const filterValue = filter[column];
                    if (filterValue != null) {
                        if (dataRow[column] < filterValue[0] || dataRow[column] > filterValue[1])
                            includeRow=false;
                    }
                }
            }

            if (includeRow) {
                filteredData.push(dataRow)
            }
        }

        setFilteredData(filteredData)
    }

    function getFieldValues(fieldName) {
        if (data == null)
            return [];
        var options = data.columnValues[fieldName]
        if (options == null)
            options = []
        return options;
    }

    function getFilterValue(fieldName, defValue = "") {
        var value = filter[fieldName]
        if (value == null)
            return defValue
        return value;
    }

    function updateFilter(fieldName, value) {
        var newFilter = { ...filter};
        newFilter[fieldName] = value;
        setFilter(newFilter)
    }

    function updateMultiFilter(fieldName, e) {
        updateFilter(fieldName, e);
    }

    function updateRangeFilter(fieldName, e) {
        updateFilter(fieldName, e);
    }

    function makeFilterElement( [ fieldName, fieldDef ] ) {
        if (fieldDef.filter_type === 'multi') {
            var options=getFieldValues(fieldName)
            return <Autocomplete
                multiple
                id={"filter-" + fieldName}
                options={options}
                getOptionLabel={(option) => option}
                value={getFilterValue(fieldName, [])}
                onChange={(e,v) => updateMultiFilter(fieldName, v)}
                renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label={column_defs[fieldName].description}
                />
                )}
                />
        } else if (fieldDef.filter_type === 'range') {
            // get a list of all value for this field
            if (data == null || data.columnRanges == null) return;
            const range = data.columnRanges[fieldName];
            var value = getFilterValue(fieldName);
            if (value == "") value = range;
            // return <label>{column_defs[fieldName].description} [{value[0]} - {value[1]}]:
            //     <RangeSlider id={fieldName+"-range"} className="rangeFilter"
            //         min={range[0]} max={range[1]}
            //         value={value}
            //         step={column_defs[fieldName].range_step}
            //         onInput={(e) => updateRangeFilter(fieldName, e)}/>
            //     </label>
            return <FormLabel>{column_defs[fieldName].description}
                    <Slider
                        getAriaLabel={() => column_defs[fieldName].description}
                        value={value}
                        step={column_defs[fieldName].range_step}
                        min={range[0]} max={range[1]}
                        onChange={(e,v) => updateRangeFilter(fieldName,v)}
                        valueLabelDisplay="auto"
                        // getAriaValueText={valuetext}
                    />
                </FormLabel>
    
        }
    }

    if (filter == null) {
        updateFilter('country', '')
    }

    useEffect(() => { filterData(data, filter) }, [data, filter]);

    return (Object.entries(column_defs).map((item) => makeFilterElement(item))    )
}
export default DataFilter;
