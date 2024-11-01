import * as topojson from "topojson-client";
import { map } from './map';
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { one } from 'd3-rosetta'


const worldAtlasURL =
  'https://unpkg.com/visionscarto-world-atlas@0.1.0/world/110m.json';

const MapView = ({ data }) => {
    const width = 900;
    const height = 468;

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

        const svg = d3.select(mapRef.current)
            .selectAll('svg')
            .data([null]).join('svg');

        if (countries && data) {
            one(svg, 'g', 'zoomable')
                .attr('transform', zoom)
                .call(map, { countries, reviews : data, tooltipRef });
        }
    }, [countries, data, zoom]);

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
        <button onClick={resetMap}>Reset</button>
    </div>
};

export default MapView;