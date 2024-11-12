import React from 'react'
import Select from 'react-select'
import { useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material'

function buildSelectBox(column_defs, selector) {
    var selectBox = []
    for (var column in column_defs) {
        if (selector(column_defs[column])) {
            selectBox.push({ value : column, label : column_defs[column].description})
        }
    }
    return selectBox;
}

const SortBy = ({
    data,
    setSortedData,
    sortedData,
    column_defs,
    label="Sort By:"
 }) => {
    function sortData(data, sortColumn) {
        //var sortBy = sortColumn.value;
        var dataSorted = { 'sortedBy' : sortColumn, 'data' : []}
        if (data == null)
            return;
    
        // copy any metadata in our data
        for (var key in data) {
            dataSorted[key] = data[key]
        }

        dataSorted.data = data.data.sort((a,b) => a[sortColumn.value] - b[sortColumn.value])
        return dataSorted;
    }

    function sort(data, sortColumn) {
        sortedBy = sortColumn;
        var dataSorted = sortData(data, sortColumn)
        setSortedData( dataSorted )
    }

    function updateSort(e) {
        sort(data, e);
    }

    var columns = {};
    if (data != null) {
        for (var column in data.data[0])
            if (column_defs[column] != null)
                columns[column] = column_defs[column];
    }
    const sort_by = buildSelectBox(columns, (c) => (c.type === 'numeric') && !c.hidden)
    var sortedBy = sort_by[0]; 
    if (sortedData != null && sortedData.sortedBy != null)
        sortedBy = sortedData.sortedBy;
    
    if (sortedBy == null) {
        sortedBy = sort_by[0]
    }

    useEffect(() => { sort(data, sortedBy) }, [data, sortedBy]);

    return <Autocomplete
        id="sortBy"
        options={sort_by}
        getOptionLabel={(option) => option.label}
        value={sortedBy || null}
        onChange={(e,v) => updateSort(v)}
        renderInput={(params) => (
        <TextField
            {...params}
            variant="standard"
            label={label}
        />
        )}
    />
}
export default SortBy;
