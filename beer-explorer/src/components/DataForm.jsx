import React from 'react'
import * as d3 from "d3";
import { useState } from 'react';

const DataForm = ({ data, setData }) => {
    const [rawData, setRawData] = useState(null)
    const [filter, setFilter] = useState({})

    function applyFilter(rawData, filter) {
        var filteredData = []
        console.log(filter)
        console.log(filter.country)
        console.log(rawData)
        for (var data of rawData) {
            if (filter.country == null)
                filteredData.push(data)
            else if (data.Country.includes(filter.country))
                filteredData.push(data)
            else
                console.log('skipping ' + data)
        }

        console.log('filtered data: ' + filteredData)
        return filteredData;
    }
    
    if (rawData == null) {
        d3.csv(
        "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv"
      ).then(function (csvData) {
        setRawData(csvData)
        setData(applyFilter(csvData, filter))
      });
      return (
        <div/>
      )
    }


    function updateFilter(field, value)
    {
        filter[field] = value;
        setFilter(filter)
        setData(applyFilter(rawData, filter))
    }

    function setCountry(e) {
        updateFilter('country', e.target.value);
    }

    return (
        <form>
            <label>Country:
                <input type="text"
                    value={filter.country}
                    onChange={setCountry}/>
            </label>
        </form>
    )
}
export default DataForm;
