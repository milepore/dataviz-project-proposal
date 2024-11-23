import React from 'react'
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';

import Accordian from '@mui/material/Accordion'
import AccordianSummary from '@mui/material/AccordionSummary'
import AccordianDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'


import BarChart from './BarChart';
import MapView from './MapView';
import DataSummary from './DataSummary';
import DataFilter from './DataFilter';
import ColumnPicker from './ColumnPicker';
import ParallelCoordinates from './ParallelCoordinates';
import ColorSelector from './ColorSelector';
import GroupedHistogram from './GroupedHistogram';
import SortBy from './SortBy';

import { sort_column_defs } from '../data-defs';

import { useState, useEffect } from "react";
import 'react-tabs/style/react-tabs.css';

function computeSize() {
    const margin = 100;
    var width = window.innerWidth - margin;
    var height = width / 1.92;
    const maxHeight = Math.min(window.innerHeight - 300, window.innerHeight*.75)
    if (height > maxHeight) {
        height = maxHeight;
        width = height * 1.92;
    }
    return [width, height];
}

const ViewSelector = ({ data, column_defs }) => {
    const [ summaryData, setSummaryData ] = useState()
    const [ sortedData, setSortedData ] = useState()
    const [ filteredData, setFilteredData ] = useState()
    const [ colorColumn, setColorColumn ] = useState('family');
    const [ percentages, setPercentages ] = useState(true)
    const [ tab, setTab ] = useState('1');
    const [ filter, setFilter ] = useState({});
    const [ brushedIntervals, setBrushedIntervals ] = useState({});
    const [ stacked, setStacked ] = useState(true)


    const defaultColumns= [  'beer_abv', 'review_count', 'review_overall', 'family' ]
    const defaultValue = defaultColumns.map((d) => { 
        return {value:d, label:column_defs[d].description}
    });
    const [columns, setColumns] = useState(defaultValue)
    const [size, setSize] = useState(computeSize())

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    useEffect(() => {
        function handleResize() {
            setSize(computeSize())
        }

        // Attach the event listener to the window object
        window.addEventListener('resize', handleResize);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
            <DataFilter data={data} setFilteredData={setFilteredData} column_defs={column_defs} filter={filter} setFilter={setFilter}/>
        </AccordianDetails>
    </Accordian>
    )

    const [ width, height ] = size;

    return (
        <TabContext value={tab}>
        <TabList onChange={handleChange}>
        <Tab label="Map View" value="1"/>
        <Tab label="Bar Chart" value="2"/>
        <Tab label="Parallel Lines" value="3"/>
        <Tab label="Grouped Histogram" value="4"/>
        </TabList>

        <TabPanel value="1">
            <MapView
                data={filteredData}
                column_defs={column_defs}
                colorColumn={colorColumn}
                width={width}
                height={height}
                setFilter={setFilter}
                filter={filter}
            />
            <ColorSelector column_defs={column_defs} colorColumn={colorColumn} setColorColumn={setColorColumn}/>
            {dataFilter}
        </TabPanel>
        <TabPanel value="2">
            <BarChart
                summaryData={sortedData}
                column_defs={column_defs}
                width={width}
                height={height}
            />
            <Accordian>
            <AccordianSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="chart-control"
                id="chart-control"
                >Chart Settings</AccordianSummary>
                <AccordianDetails>
                    <SortBy data={summaryData} sortedData={sortedData} setSortedData={setSortedData} column_defs={sort_column_defs}/>
                    <DataSummary data={filteredData} summaryData={summaryData} setSummaryData={setSummaryData} column_defs={column_defs}/>
                </AccordianDetails>
            </Accordian>
            {dataFilter}
        </TabPanel>
        <TabPanel value="3">
            <ParallelCoordinates
                data={filteredData}
                columns={columns.map((d)=>d.value)}
                colorColumn={colorColumn}
                columnDefs={column_defs}
                idValue={(d)=>d.beer_id}
                width={width}
                height={height}
                brushedIntervals={brushedIntervals}
                setBrushedIntervals={setBrushedIntervals}
            />
            <Accordian>
                <AccordianSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="chart-control"
                    id="chart-control"
                    >Chart Settings</AccordianSummary>
                <AccordianDetails>
                    <ColorSelector column_defs={column_defs} colorColumn={colorColumn} setColorColumn={setColorColumn}/>
                    <ColumnPicker column_defs={column_defs} columns={columns} setColumns={setColumns} label="Chart Columns"/>
                </AccordianDetails>
            </Accordian>

            {dataFilter}
        </TabPanel>

        <TabPanel value="4">
            <GroupedHistogram
                data={filteredData}
                column_defs={column_defs}
                width={width}
                height={height}
                bucketColumn={'review_overall'}
                divideColumn={colorColumn}
                ticks={11}
                percentages={percentages}
                stacked={stacked}
            />
            <Accordian>
                <AccordianSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="chart-control"
                    id="chart-control"
                    >Chart Settings</AccordianSummary>
                <AccordianDetails>
                    <FormControlLabel control={<Checkbox 
                        checked={stacked}
                        onChange={(e) => setStacked(e.target.checked)}
                    />} label="Stacked" />
                    <FormControlLabel control={<Checkbox 
                        checked={percentages}
                        onChange={(e) => setPercentages(e.target.checked)}
                    />} label="Compute Percentages" />
                    <ColorSelector column_defs={column_defs} colorColumn={colorColumn} setColorColumn={setColorColumn} filter={(d) => (column_defs[d].type == 'text')}/>
                </AccordianDetails>
            </Accordian>

            {dataFilter}
        </TabPanel>


    </TabContext>
    )
}

export default ViewSelector;