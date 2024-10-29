import * as topojson from "topojson-client";
import { map } from './map';
import * as d3 from "d3";
import { useEffect, useRef, useState, setState } from "react";


const worldAtlasURL =
  'https://unpkg.com/visionscarto-world-atlas@0.1.0/world/110m.json';

const MapView = ({ data }) => {
    const width = 900;
    const height = 600;
    const panningSensitivity = 58;
    const initialScale = width / 1.8 / Math.PI;


    const [ countries, setCountries ] = useState();
    const [ position, _setPosition ] = useState([0,0]);
    const [ scale, _setScale ] = useState(1)

    // need to use ref's so that callbacks can get the active value
    const activePosition = useRef(position);
    function setPosition(newPosition) {
        activePosition.current = newPosition;
        console.log("New position: " + newPosition[0] + ", " + newPosition[1])
        _setPosition(newPosition);
    }

    const activeScale = useRef(scale);
    function setScale(newScale) {
        activeScale.current = newScale;
        _setScale(newScale);
    }

    function resetMap() {
        setPosition([0,0]);
        setScale(1.0);
    }

    const ref = useRef();
    useEffect(() => {
        const svg = d3.select(ref.current)
            .selectAll('svg')
            .data([null]).join('svg');

        // Set up the drag behavior
        svg.call(
            d3.drag().on('drag', (event) => {
                const k = panningSensitivity / (scale * initialScale);
                const currentPosition = activePosition.current;
                setPosition([ currentPosition[0] - event.dx * k, currentPosition[1] + event.dy * k]);
            }),
        );

        // Set up the zoom behavior
        svg.call(
            d3.zoom().on('zoom', ({ transform: { k } }) => { setScale(k) }),
        );        
    }, [])

    useEffect(() => {
        if ((data == null)||(countries==null)) {
            return 
        }

        const svg = d3.select(ref.current)
            .selectAll('svg')
            .data([null]).join('svg');

        if (countries && data) {
            svg.call(map, { countries, reviews : data, position, scale, initialScale })
        }

    }, [countries, data, position, scale]);

    if (countries === undefined) {
        fetch(worldAtlasURL)
            .then((response) => response.json())
            .then((topoJSONData) => {
            const countries = topojson.feature(
                topoJSONData,
                'countries',
            );
            setCountries(countries);
        }, [position, scale, countries, data]);
    }

    return <div>
        <svg width={width} height={height} id="barchart" ref={ref} />
        <button onClick={resetMap}>Reset</button>
        </div>
};

export default MapView;