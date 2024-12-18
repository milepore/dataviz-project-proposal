import React from 'react'
import Select from 'react-select'
import { useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material'

const summary_columns = [ 'beer_abv', 'review_count', 'review_overall' ] 

function buildSelectBox(column_defs, selector) {
    var selectBox = []
    for (var column in column_defs) {
        if (selector(column_defs[column])) {
            selectBox.push({ value : column, label : column_defs[column].description})
        }
    }
    return selectBox;
}



const DataSummary = ({
    data,
    summaryData,
    setSummaryData,
    column_defs,
    label="Summarize By:"
 }) => {
    function summarizeData(data, summaryColumn) {
        var summarizeBy = summaryColumn.value;
        var summaryData = { 'summarizedBy' : summaryColumn, 'data' : []}
        if (data == null)
            return;
    
        const dataRows = data.csvData;

        var summaryMap = {}
        var summaryKey;
        for (var dataRow of dataRows) {
            var column;
            summaryKey = dataRow[summarizeBy]
            if (summaryMap[summaryKey] == null) {
                summaryMap[summaryKey] = { count: 0 }
                for (column of summary_columns)
                    summaryMap[summaryKey][column] = 0
            }
    
            summaryMap[summaryKey].count++;
            for (column of summary_columns)
                summaryMap[summaryKey][column] += dataRow[column];
        }
    
        // now the summary map will look like:
        // { { country : { count : x, column1 : value, column2: value }}, ...}
        // we want to convert it to:
        // { summarizedBy : { key, value }, data : [ { country : value, count : count, column1 : value, column2 : value ]}}
        var summaryRows = [];
        var rowCount = 0;
        for (summaryKey in summaryMap) {
            var summaryObject = summaryMap[summaryKey];
            var summaryRow = { index : rowCount++, count : summaryObject.count }
            summaryRow[summarizeBy] = summaryKey; 
            for (const [column, value] of Object.entries(summaryObject)) {
                if (!column.endsWith('count')) {
                    summaryRow[column] = value / summaryObject.count;
                } else {
                    summaryRow[column] = value;
                }
            }
            summaryRows.push(summaryRow);
        }
    
        summaryData.data = summaryRows;
        return summaryData;
    }

    function summarize(data, summaryColumn) {
        var summarizedData = summarizeData(data, summaryColumn)
        setSummaryData( summarizedData )
    }
    
    const summarize_by = buildSelectBox(column_defs, (c) => c.group_by === true)
    var summarizeBy = summarize_by[0]; 
    if (summaryData != null && summaryData.summarizedBy != null)
        summarizeBy = summaryData.summarizedBy;

    
    function updateSummary(e) {
        summarizeBy = e;
        summarize(data, e);
    }

    if (summarizeBy == null) {
        summarizeBy = summarize_by[0]
    }

    useEffect(() => { summarize(data, summarizeBy) }, [data, summarizeBy]);

    return <Autocomplete
        id="summarizeBy"
        options={summarize_by}
        getOptionLabel={(option) => option.label}
        value={summarizeBy}
        onChange={(e,v) => updateSummary(v)}
        renderInput={(params) => (
        <TextField
            {...params}
            variant="standard"
            label={label}
        />
        )}
    />

}

export { buildSelectBox };
export default DataSummary;
