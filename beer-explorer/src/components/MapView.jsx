import * as topojson from "topojson-client";
import { map } from './map';
import { colorLegend } from './colorLegend';
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { one } from 'd3-rosetta'
import Button from '@mui/material/Button'
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

const MapView = ({ 
    data,
    column_defs,
    colorColumn = 'family',
    width = window.innerWidth,
    height = width / 1.92
}) => {

    const [ countries, setCountries ] = useState();
    const [ zoom, setZoom ] = useState();

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

        const colors = column_defs[colorColumn].colorScale
        const colorFunction = (d) => {
            return colors(d[colorColumn])
        }

        const svg = d3.select(mapRef.current)
            .selectAll('svg')
            .data([null]).join('svg');


        if (countries && data) {
            one(svg, 'g', 'zoomable')
                .attr('transform', zoom)
                .call(map, { countries, reviews : data, tooltipRef, width, height, tooltipHTML, colorFunction });
        }

        one(svg, 'g', 'colorscale')
            .call(colorLegend, {
                colorScale : column_defs[colorColumn].colorScale,
                x : width-150, y : height-200,
                colorLegendLabel : column_defs[colorColumn].description });

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
        <Button className="resetMap" onClick={resetMap}>Reset</Button>
    </div>
};

export default MapView;