import React from 'react'
import Select from 'react-select'
import { useEffect } from 'react';

const summary_columns = [ 'beer_abv', 'review_count', 'review_overall' ] 
const summarize_by = [
    { value : 'family' , label : 'Style Family'},
    { value : 'state', label : 'State' },
    { value : 'country', label : 'Country' },
    { value : 'beer_style', label : 'Style' }
]

function buildSelectBox(column_defs, selector) {
    var selectBox = []
    for (var column in column_defs) {
        if (selector(column_defs[column])) {
            selectBox.push({ value : column, label : column_defs[column].description})
        }
    }
    return selectBox;
}

const DataSummary = ({ data, summaryData, setSummaryData, column_defs }) => {
    const summarize_by = buildSelectBox(column_defs, (c) => c.group_by == true)
    var summarizeBy = summarize_by[0]; 
    if (summaryData != null && summaryData.summarizedBy != null)
        summarizeBy = summaryData.summarizedBy;

    function summarizeData(data, summaryColumn) {
        var summarizeBy = summaryColumn.value;
        var summaryData = { 'summarizedBy' : summaryColumn, 'data' : []}
        console.log("Summarizing by: " + summarizeBy)
        if (data == null)
            return;

        var summaryMap = {}
        for (var dataRow of data) {
            summaryKey = dataRow[summarizeBy]
            if (summaryMap[summaryKey] == null) {
                summaryMap[summaryKey] = { count: 0 }
                for (var column of summary_columns)
                    summaryMap[summaryKey][column] = 0
            }

            summaryMap[summaryKey].count++;
            for (var column of summary_columns)
                summaryMap[summaryKey][column] += dataRow[column];
        }

        // now the summary map will look like:
        // { { country : { count : x, column1 : value, column2: value }}, ...}
        // we want to convert it to:
        // { summarizedBy : { key, value }, data : [ { country : value, count : count, column1 : value, column2 : value ]}}
        var summaryRows = [];
        var rowCount = 0;
        for (var summaryKey in summaryMap) {
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

    function updateSummary(e) {
        console.log(e)
        summarizeBy = e;
        summarize(data, e);
    }

    if (summarizeBy == null) {
        summarizeBy = summarize_by[0]
    }

    useEffect(() => { summarize(data, summarizeBy) }, [data, summarizeBy]);

    return (
        <form>
            <label>Summarize By:
                <Select options ={summarize_by}
                    value={summarizeBy.value}
                    onChange={updateSummary}/>
            </label>
        </form>
    )
}
export default DataSummary;
