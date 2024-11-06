import React from 'react'
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';

import Accordian from '@mui/material/Accordion'
import AccordianSummary from '@mui/material/AccordionSummary'
import AccordianDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import BarChart from './BarChart';
import MapView from './MapView';
import DataSummary from './DataSummary';
import DataFilter from './DataFilter';
import ColumnPicker from './ColumnPicker';
import ParallelCoordinates from './ParallelCoordinates';
import ColorSelector from './ColorSelector';

import { useState } from "react";
import 'react-tabs/style/react-tabs.css';

const ViewSelector = ({ data, column_defs }) => {
    const [ summaryData, setSummaryData ] = useState()
    const [ filteredData, setFilteredData ] = useState()
    const [ colorColumn, setColorColumn ] = useState('family');
    const [ tab, setTab ] = useState('1');

    const defaultColumns= [ 'review_count', 'review_overall', 'beer_abv', 'family' ]
    const defaultValue = defaultColumns.map((d) => { 
        return {value:d, label:column_defs[d].description}
    });
    const [columns, setColumns] = useState(defaultValue)

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    var columnRanges = null;
    if ((data != null) && (data.columnRanges != null))
        columnRanges = data.columnRanges;

    var columnValues = null;
    if ((data != null) && (data.columnValues != null))
        columnValues = data.columnValues;

    const dataFilter = (
        <Accordian>
        <AccordianSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="filter-content"
            id="filter-header"
        >Data Filter</AccordianSummary>
        <AccordianDetails>
            <DataFilter data={data} setFilteredData={setFilteredData} column_defs={column_defs}/>
        </AccordianDetails>
    </Accordian>
    )

    return (
        <TabContext value={tab}>
        <TabList onChange={handleChange}>
        <Tab label="Map View" value="1"/>
        <Tab label="Bar Chart" value="2"/>
        <Tab label="Parallel Lines" value="3"/>
        </TabList>

        <TabPanel value="1">
        <MapView data={filteredData} column_defs={column_defs} colorColumn={colorColumn}/>
        <ColorSelector column_defs={column_defs} colorColumn={colorColumn} setColorColumn={setColorColumn}/>
        {dataFilter}
        </TabPanel>
        <TabPanel value="2">
        <BarChart summaryData={summaryData} column_defs={column_defs}/>
        <DataSummary data={filteredData} summaryData={summaryData} setSummaryData={setSummaryData} column_defs={column_defs}/>
        {dataFilter}
        </TabPanel>
        <TabPanel value="3">
        <ParallelCoordinates data={filteredData} columns={columns.map((d)=>d.value)} columnDefs={column_defs} idValue={(d)=>d.beer_id}/>
        <form>
        <label>Color By:
        <ColorSelector column_defs={column_defs} colorColumn={colorColumn} setColorColumn={(d) => {setColorColumn(d.target.value)}}/>
        </label>
        <label>Chart Columns:
        <ColumnPicker column_defs={column_defs} columns={columns} setColumns={setColumns}/>
        </label>
        </form>
        {dataFilter}
        </TabPanel>
    </TabContext>
    )
}

export default ViewSelector;