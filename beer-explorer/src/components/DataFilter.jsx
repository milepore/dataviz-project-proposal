import React from 'react'
import * as d3 from "d3";
import { useState, useEffect } from 'react';
import Select from 'react-select';

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
        console.log('filter ' + fieldName + ' to ' + value)

        var newFilter = { ...filter};
        newFilter[fieldName] = value;
        setFilter(newFilter)
    }

    function updateMultiFilter(fieldName, e) {
        updateFilter(fieldName, e);
    }

    function makeFilterElement( [ fieldName, fieldDef ] ) {
        console.log(fieldDef)
        if (fieldDef.filter_type === 'multi') {
            // get a list of all value for this field
            var options = getFieldValues(fieldName).map((d) => {return { value : d, label : d}});
            // create select
            return <label>{column_defs[fieldName].description}: <Select size={5} name={fieldName} isMulti={true} value={getFilterValue(fieldName)} onChange={(e) => updateMultiFilter(fieldName, e)} options={options}>
            </Select></label>
        }
    }

    if (filter == null) {
        updateFilter('country', '')
    }

    useEffect(() => { filterData(data, filter) }, [data, filter]);

    return (Object.entries(column_defs).map((item) => makeFilterElement(item))    )
}
export default DataFilter;
