import React from 'react'
import * as d3 from "d3";
import { useState } from 'react';

const DataForm = ({ setData }) => {
    const [rawData, setRawData] = useState(null)
    const [categoryData, setCategoryData] = useState(null)
    const [filter, setFilter] = useState(null)
    const numeric_colums = [
        'index',
        'brewery_id',
        'beer_abv',
        'beer_beerid',
        'lat',
        'lng',
        'review_overall',
        'beer_style_id',
        'review_count',
      ];

    function processData(rawData, families) {
        var famMap = {};
        for (const style of families) {
            famMap[style.style] = style.family;
        }
        
        console.log(rawData)
        for (const d of rawData) {
            for (const column of numeric_colums) {
            d[column] = +d[column];
            }
            d['family'] = famMap[d.beer_style];
        }
        
        return rawData;
    }

    function filterData(rawData, filter) {
        console.log('raw data: ')
        console.log(rawData)

        var filteredData = []
        if (filter == null)
            return rawData;

        console.log(filter)
        for (var dataRow of rawData) {
            if (filter.country == null)
                filteredData.push(dataRow)
            else if (dataRow.country.includes(filter.country))
                filteredData.push(dataRow)
            else
                console.log('skipping ' + dataRow)
        }

        console.log('filtered data: ' + filteredData)

        return filteredData;
    }

    if (categoryData == null) {
        d3.csv(
            "https://raw.githubusercontent.com/milepore/dataviz-project-proposal/refs/heads/master/beer-explorer/data/beer-style-families.csv"
        ).then(function (csvData) {
            setCategoryData(csvData)
        });
        return (
            <div/>
        )
    }

    if (rawData == null) {
        d3.csv(
            "https://raw.githubusercontent.com/milepore/BeerStyleLocationAnalysis/refs/heads/main/individual_beers.csv"
        ).then(function (csvData) {
            var rawData=processData(csvData, categoryData)
            setRawData(rawData);
        });
        return (
            <div/>
        )
    }

    function updateFilter(field, value)
    {
        var newFilter = { ...filter};
        newFilter[field] = value;
        setFilter(newFilter)
        setData(filterData(rawData,newFilter))
    }

    function setCountry(e) {
        updateFilter('country', e.target.value);
    }

    if (filter == null) {
        updateFilter('country', '')
        return (<div/>)
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
