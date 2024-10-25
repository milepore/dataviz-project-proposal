import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import BarChart from './BarChart';
import DataSummary from './DataSummary';
import { useState } from "react";
import 'react-tabs/style/react-tabs.css';

const ViewSelector = ({ data }) => {
    const [ summaryData, setSummaryData ] = useState()

    return (
        <Tabs>
        <TabList>
        <Tab>Beer Explorer</Tab>
        <Tab>Bar Chart</Tab>
        </TabList>

        <TabPanel>
        MAP
        </TabPanel>
        <TabPanel>
        <BarChart summaryData={summaryData}/>
        <DataSummary data={data} summaryData={summaryData} setSummaryData={setSummaryData}/>
        </TabPanel>
    </Tabs>
    )
}

export default ViewSelector;