import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import BarChart from './BarChart';
import MapView from './MapView';
import DataSummary from './DataSummary';
import DataFilter from './DataFilter';
import ColumnPicker from './ColumnPicker';
import ParallelCoordinates from './ParallelCoordinates';
import { useState } from "react";
import 'react-tabs/style/react-tabs.css';

const ViewSelector = ({ data, column_defs }) => {
    const [ summaryData, setSummaryData ] = useState()
    const [ filteredData, setFilteredData ] = useState()

    const defaultColumns= [ 'review_count', 'review_overall', 'beer_abv', 'family' ]
    const defaultValue = defaultColumns.map((d) => { 
        return {value:d, label:column_defs[d].description}
    });
    const [columns, setColumns] = useState(defaultValue)

    var columnRanges = null;
    if ((data != null) && (data.columnRanges != null))
        columnRanges = data.columnRanges;

    var columnValues = null;
    if ((data != null) && (data.columnValues != null))
        columnValues = data.columnValues;

    return (
        <Tabs>
        <TabList>
        <Tab>Beer Explorer</Tab>
        <Tab>Bar Chart</Tab>
        <Tab>Parallel Lines</Tab>
        </TabList>

        <TabPanel>
        <MapView data={filteredData} column_defs={column_defs} columnRanges={columnRanges} columnValues={columnValues}/>
        <form>
        <DataFilter data={data} setFilteredData={setFilteredData} column_defs={column_defs}/>
        </form>
        </TabPanel>
        <TabPanel>
        <BarChart summaryData={summaryData} column_defs={column_defs}/>
        <form>
        <DataSummary data={filteredData} summaryData={summaryData} setSummaryData={setSummaryData} column_defs={column_defs}/>
        <DataFilter data={data} setFilteredData={setFilteredData} column_defs={column_defs}/>
        </form>
        </TabPanel>
        <TabPanel>
        <ParallelCoordinates data={filteredData} columns={columns.map((d)=>d.value)} columnDefs={column_defs} idValue={(d)=>d.beer_id}/>
        <form>
        <ColumnPicker column_defs={column_defs} columns={columns} setColumns={setColumns}/>
        <DataFilter data={data} setFilteredData={setFilteredData} column_defs={column_defs}/>
        </form>
        </TabPanel>
    </Tabs>
    )
}

export default ViewSelector;