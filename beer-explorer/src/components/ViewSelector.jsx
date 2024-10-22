import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import BarChart from './BarChart'
import { useState } from "react";
import 'react-tabs/style/react-tabs.css';

const ViewSelector = ({ data, setData }) => {

    return (
        <Tabs>
        <TabList>
        <Tab>Map</Tab>
        <Tab>Bar Chart</Tab>
        </TabList>

        <TabPanel>
        MAP
        </TabPanel>
        <TabPanel data={data} setData={setData}>
        <BarChart data={data} setData={setData}/>
        </TabPanel>
    </Tabs>
    )
}

export default ViewSelector;