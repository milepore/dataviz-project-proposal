import React from 'react'
import * as d3 from "d3";
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { getNumericColumns, getSelectColumns } from '../data-defs';

const DataForm = ({ setData, column_defs }) => {
    const [rawData, setRawData] = useState(null)
    const [categoryData, setCategoryData] = useState(null)
    const [filter, setFilter] = useState({})
    const numeric_colums = getNumericColumns(column_defs);
    const select_columns = getSelectColumns(column_defs);

    function processData(csvData, families) {
        var columnValues = {}

        if (csvData == null || families == null)
            return;
        var famMap = {};
        for (const style of families) {
            famMap[style.style] = style.family;
        }
        
        for (var c of select_columns) {
            columnValues[c] = [];
        }

        for (const d of csvData) {
            for (const column of numeric_colums) {
                d[column] = +d[column];
            }
            d['family'] = famMap[d.beer_style];
            for (var c of select_columns) {
                if (!columnValues[c].includes(d[c])) {
                    columnValues[c].push(d[c])
                }
            }
        }
        
        return {
            csvData : csvData,
            columnValues : columnValues
        };
    }

    function filterData(rawData, filter) {
        if (rawData == null || filter == null)
            return;

        var filteredData = []
        if (filter == null)
            return rawData;

        var csvData = rawData.csvData;

        for (var dataRow of csvData) {
            var includeRow = true;

            // filter each column
            for (var column in column_defs) {
                if (column_defs[column].filter_type == "multi") {
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

        setData(filteredData)
    }

    if (categoryData == null) {
        d3.csv(
            "https://raw.githubusercontent.com/milepore/dataviz-project-proposal/refs/heads/master/beer-explorer/data/beer-style-families.csv"
        ).then(function (csvData) {
            setCategoryData(csvData)
        });
    }

    if (rawData == null) {
        d3.csv(
            "https://raw.githubusercontent.com/milepore/dataviz-project-proposal/refs/heads/master/individual_beers.csv"
        ).then(function (csvData) {
            var rawData=processData(csvData, categoryData)
            setRawData(rawData);
        });
    }

    function getFieldValues(fieldName) {
        if (rawData == null)
            return [];
        var options = rawData.columnValues[fieldName]
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
        if (fieldDef.filter_type == 'multi') {
            // get a list of all value for this field
            var options = getFieldValues(fieldName).map((d) => {return { value : d, label : d}});
            // create select
            var value = filter[fieldName];
            return <label>{column_defs[fieldName].description}: <Select size={5} name={fieldName} isMulti={true} value={getFilterValue(fieldName)} onChange={(e) => updateMultiFilter(fieldName, e)} options={options}>
                {
                    options.sort().map((d) => <option value={d}>{d}</option>)
                }
            </Select></label>
        }
    }

    if (filter == null) {
        updateFilter('country', '')
    }

    useEffect(() => { filterData(rawData, filter) }, [rawData, filter]);

    var country = ""
    if (filter != null) {
        country=filter.country;
    }

    return (
        <form>
            {
                Object.entries(column_defs).map((item) => makeFilterElement(item))
            }
        </form>
    )
}
export default DataForm;
