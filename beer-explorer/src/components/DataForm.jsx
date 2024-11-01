import React from 'react'
import * as d3 from "d3";
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { getNumericColumns, getSelectColumns } from '../data-defs';

const DataForm = ({ setData, column_defs }) => {
    const [rawData, setRawData] = useState(null)
    const [categoryData, setCategoryData] = useState(null)
    const select_columns = getSelectColumns(column_defs);
    const numeric_colums = getNumericColumns(column_defs);

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
            for (c of select_columns) {
                if (!columnValues[c].includes(d[c])) {
                    columnValues[c].push(d[c])
                }
            }
        }

        // now we want to sort all our column values
        for (c in columnValues) {
            columnValues[c] = columnValues[c].sort();
        }
        
        return {
            csvData : csvData,
            columnValues : columnValues
        };
    }


    if (categoryData == null) {
        d3.csv(
            "../data/beer-style-families.csv"
        ).then(function (csvData) {
            setCategoryData(csvData)
        });
    }

    if (rawData == null) {
        d3.csv(
            "../data/individual_beers.csv"
        ).then(function (csvData) {
            setRawData(csvData);
            var rawData=processData(csvData, categoryData)
            console.log("setting data..");
            setData(rawData);
        });
    }

    return (<div id="datadiv"/>)
}
export default DataForm;
