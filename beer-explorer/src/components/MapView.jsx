import * as topojson from "topojson-client";
import { map } from './map';
import { colorLegend } from './colorLegend';
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { one } from 'd3-rosetta'
import ColorSelector from './ColorSelector';


function tooltipHTML(d) {
    var html = `<div><strong>Brewery Name:</strong> ${d['brewery_name']}</div>
        <div><strong>Beer Name:</strong> ${d['beer_name']}</div>
        <div><strong>Style:</strong> ${d['beer_style']}</div>
        <div><strong>ABV:</strong> ${d['beer_abv']}</div>
        <div><strong>Rating:</strong> ${d['review_overall']}</div>
        <div><strong>Num Reviews:</strong> ${d['review_count']}</div>
        `
    return html;
}
  
  

const worldAtlasURL =
  'https://unpkg.com/visionscarto-world-atlas@0.1.0/world/110m.json';

const MapView = ({ data, column_defs, columnRanges, columnValues }) => {
    const width = 900;
    const height = 468;

    const [ countries, setCountries ] = useState();
    const [ zoom, setZoom ] = useState();
    const [ colorColumn, setColorColumn ] = useState('family');

    function resetMap() {
        setZoom(null);
    }

    const mapRef = useRef();
    const tooltipRef = useRef();
    
    useEffect(() => {
        const svg = d3.select(mapRef.current)
            .selectAll('svg')
            .data([null]).join('svg');

        svg.call(d3.zoom().on('zoom', (event) => {
            d3.selectAll('.nvtooltip').style('opacity', '0');
            setZoom(event.transform)
        }));
    }, [])

    useEffect(() => {
        if ((data == null)||(countries==null)) {
            return 
        }

        console.log(colorColumn);
        const colors = column_defs[colorColumn].colorScale
        if (column_defs[colorColumn].type == "numeric")
            colors.domain(columnRanges[colorColumn]);
        else
            colors.domain(columnValues[colorColumn]);

        const colorFunction = (d) => {
            return colors(d[colorColumn])
        }

        const svg = d3.select(mapRef.current)
            .selectAll('svg')
            .data([null]).join('svg');

        if (countries && data) {
            one(svg, 'g', 'zoomable')
                .attr('transform', zoom)
                .call(map, { countries, reviews : data, tooltipRef, tooltipHTML, colorFunction });
        }

        one(svg, 'g', 'colorscale')
            .call(colorLegend, { colorScale : column_defs[colorColumn].colorScale });

    }, [countries, data, zoom, colorColumn]);

    if (countries === undefined) {
        fetch(worldAtlasURL)
            .then((response) => response.json())
            .then((topoJSONData) => {
            const countries = topojson.feature(
                topoJSONData,
                'countries',
            );
            setCountries(countries);
        }, [countries, data]);
    }

    return <div>
        <svg width={width} height={height} id="mapview" ref={mapRef} />
        <div id="tooltip" className="tooltip" ref={tooltipRef}/>
        <ColorSelector column_defs={column_defs} colorColumn={colorColumn} setColorColumn={(d) => {setColorColumn(d.target.value)}}/>
        <button onClick={resetMap}>Reset</button>
    </div>
};

export default MapView;