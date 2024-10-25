import React from 'react'
import Select from 'react-select'
import { useState } from 'react';

const summary_columns = [ 'beer_abv', 'review_count', 'review_overall' ] 
const summarize_by = [
    { value : 'family' , label : 'Style Family'},
    { value : 'state', label : 'State' },
    { value : 'country', label : 'Country' },
    { value : 'beer_style', label : 'Style' }
]

const DataSummary = ({ data, summaryData, setSummaryData }) => {
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
        // for (var column in summary_columns) {
        //     summaryMap[column] = { column : column, count: 0, value : 0 }
        // }
        console.log(data)
        for (var dataRow of data) {
            console.log(dataRow)
            summaryKey = dataRow[summarizeBy]
            if (summaryMap[summaryKey] == null) {
                console.log("Adding key for " + summaryKey)
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
        var summaryData = [];
        for (var summaryKey in summaryMap) {
            var summaryObject = summaryMap[summaryKey];
            var summaryRow = { count : summaryObject.count }
            summaryRow[summarizeBy] = summaryKey; 
            for (const [column, value] of Object.entries(summaryObject)) {
                if (!column.endsWith('count')) {
                    summaryRow[column] = value / summaryObject.count;
                } else {
                    summaryRow[column] = value;
                }
            }
            summaryData.push(summaryRow);
        }

        summaryData.data = summaryData;
        console.log(summaryData)
        return summaryData;
    }

    function summarize(data, summaryColumn) {
        var summarizedData = summarizeData(data, summaryColumn)
        setSummaryData( summarizedData )
    }

    function updateSummary(e) {
        console.log(e)
        summarize(data, e);
    }

    if (summarizeBy == null) {
        updateSummary(summarize_by[0])
        return ( <p>Loading...</p> );
    }

    return (
        <form>
            <label>Summarize By:
                <Select options ={summarize_by}
                    value={summarizeBy}
                    onChange={updateSummary}/>
            </label>
        </form>
    )
}
export default DataSummary;
