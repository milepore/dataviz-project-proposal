import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import BarChart from './BarChart';
import MapView from './MapView';
import DataSummary from './DataSummary';
import ColumnPicker from './ColumnPicker';
import ParallelCoordinates from './ParallelCoordinates';
import column_defs from '../data-defs';
import { useState } from "react";
import 'react-tabs/style/react-tabs.css';

const ViewSelector = ({ data, column_defs }) => {
    const [ summaryData, setSummaryData ] = useState()
    const [columns, setColumns] = useState([])


    return (
        <Tabs>
        <TabList>
        <Tab>Beer Explorer</Tab>
        <Tab>Bar Chart</Tab>
        <Tab>Parallel Lines</Tab>
        </TabList>

        <TabPanel>
        <MapView data={data}/>
        </TabPanel>
        <TabPanel>
        <BarChart summaryData={summaryData} column_defs={column_defs}/>
        <DataSummary data={data} summaryData={summaryData} setSummaryData={setSummaryData} column_defs={column_defs}/>
        </TabPanel>
        <TabPanel>
        <ParallelCoordinates data={data} columns={columns.map((d)=>d.value)} columnDefs={column_defs} colorValue={(d)=>d.family} idValue={(d)=>d.beer_id}/>
        <ColumnPicker column_defs={column_defs} columns={columns} setColumns={setColumns}/>
        </TabPanel>
    </Tabs>
    )
}

export default ViewSelector;