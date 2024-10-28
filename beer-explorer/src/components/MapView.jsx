import * as topojson from "topojson-client";
import { map } from './map';
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

const worldAtlasURL =
  'https://unpkg.com/visionscarto-world-atlas@0.1.0/world/110m.json';

const MapView = ({ data }) => {
    const width = 900;
    const height = 600;
    const [ countries, setCountries ] = useState();
    const [ position, setPosition ] = useState([0,0]);
    const [ scale, setScale ] = useState(1)

    const ref = useRef();
    useEffect(() => {

        if (data == null) {
            return 
        }

        const panningSensitivity = 580;
        const initialScale = width / 1.8 / Math.PI;

        const svg = d3.select(ref.current)
            .selectAll('svg')
            .data([null]).join('svg')
            .attr('width', width)
            .attr('height', height);

        if (countries && data) {
            svg.call(map, { countries, reviews : data, position, scale, initialScale })
        }

        // Set up the drag behavior
        // svg.call(
        //     d3.drag().on('drag', (event) => {
        //         const k = panningSensitivity / (scale * initialScale);
        //         setPosition([ position[0] - event.dx * k, position[1] + event.dy * k])
        //     }),
        // );
        svg.call(
            d3.drag().on('drag', (event) => {
                const k = panningSensitivity / (scale * initialScale);
                const p = [ position[0] - event.dx * k, position[1] + event.dy * k];
                console.log(position);
                console.log(p);
                console.log(event)
                console.log(k)
                setPosition(p)
            }),
        );

        // Set up the zoom behavior
        svg.call(
            d3.zoom().on('zoom', ({ transform: { k } }) => { console.log("scale from " + scale + " to " + k); setScale(k) }),
        );
    }, [ scale, position, data]);

    if (countries === undefined) {
        fetch(worldAtlasURL)
            .then((response) => response.json())
            .then((topoJSONData) => {
            const countries = topojson.feature(
                topoJSONData,
                'countries',
            );
            setCountries(countries);
        });
    }

    return <svg width={width} height={height} id="barchart" ref={ref} />;
};

export default MapView;