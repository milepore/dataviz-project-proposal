import React from 'react'
import * as d3 from "d3";
import { useState, useEffect } from 'react';
import Select from 'react-select';
import RangeSlider from 'react-range-slider-input';
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
                        const filterValues = filter[column].map((e) => e.value);
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

    function getFilterValue(fieldName) {
        var value = filter[fieldName]
        if (value == null)
            return ""
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
            // get a list of all value for this field
            var options = getFieldValues(fieldName).map((d) => {return { value : d, label : d}});
            return <label>{column_defs[fieldName].description}: <Select size={5} name={fieldName} isMulti={true} value={getFilterValue(fieldName)} onChange={(e) => updateMultiFilter(fieldName, e)} options={options}>
            </Select></label>
        } else if (fieldDef.filter_type === 'range') {
            // get a list of all value for this field
            if (data == null || data.columnRanges == null) return;
            const range = data.columnRanges[fieldName];
            var value = getFilterValue(fieldName);
            if (value == "") value = range;
            return <label>{column_defs[fieldName].description} [{value[0]} - {value[1]}]:
                <RangeSlider id={fieldName+"-range"} className="rangeFilter"
                    min={range[0]} max={range[1]}
                    value={value}
                    step={column_defs[fieldName].range_step}
                    onInput={(e) => updateRangeFilter(fieldName, e)}/>
                </label>
        }
    }

    if (filter == null) {
        updateFilter('country', '')
    }

    useEffect(() => { filterData(data, filter) }, [data, filter]);

    return (Object.entries(column_defs).map((item) => makeFilterElement(item))    )
}
export default DataFilter;
