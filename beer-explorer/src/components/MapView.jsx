import * as topojson from "topojson-client";
import { map } from './map';
import { colorLegend } from './colorLegend';
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { one } from 'd3-rosetta'
import Button from '@mui/material/Button'


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

const worldAtlasURL = 'https://unpkg.com/visionscarto-world-atlas@0.1.0/world/110m.json';
// const worldAtlasURL = 'https://unpkg.com/visionscarto-world-atlas@0.1.0/world/50m.json';
const statesURL = 'https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-10m.json';
const citiesURL =
  'https://gist.githubusercontent.com/curran/a59ef43debb9fcfd38858d0be4f3b087/raw/a56bdbdb758eebf6a387d47e4d428258e5cb2abd/worldcitiesReduced.csv';
const populationThresholdForLabels = 2000000;

const brushIcon = 'select-area-icon.svg'
const zoomIcon = 'zoom-pan.svg'

const styleSheet = new CSSStyleSheet() 
document.adoptedStyleSheets.push(styleSheet)

const MapView = ({ 
    data,
    column_defs,
    colorColumn = 'family',
    width = window.innerWidth,
    height = width / 1.92,
    setFilter,
    filter
}) => {

    const [ features, setFeatures ] = useState({});
    const [ zoom, setZoom2 ] = useState();
    const [ cities, setCities ] = useState();
    const [ hoveredValue, setHoveredValue ] = useState(null)
    const [ mode, setMode ] = useState('zoom');
    const [ projection, setProjection ] = useState(null);

    function setStyleOverlay(beerStyle) {
        // get our beer style sheet
        var cssText;
        if (beerStyle == "" || beerStyle == null)
        {
            cssText = `
circle.beer {
    opacity: .25;
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -o-transition: none !important;
    transition: none !important;
}`
        } else {
            cssText = `
circle.beer {
    opacity: .05;
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -o-transition: none !important;
    transition: none !important;
}

circle.beer.${beerStyle} {
    opacity: 1;
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -o-transition: none !important;
    transition: none !important;
}
    `
        }
    
        styleSheet.replace(cssText);
        setHoveredValue(beerStyle)
    }
    
    // limit zooming out to 1.0 zoom, since 1.0 is the whole map
    function setZoom(z) {
        if (z!=null && z.k < 1.0)
            z.k = 1.0
        return setZoom2(z)
    }
    function resetMap() {
        setZoom(null);
    }

    const mapRef = useRef();
    const tooltipRef = useRef();
    useEffect(() => {
        const svg = d3.select(mapRef.current)
        one(svg, 'g', 'zoomable')
        one(svg, 'g', 'colorscale')
        one(svg, 'g', 'modeIcon')
    }, [])


    useEffect(() => {
        const svg = d3.select(mapRef.current)
        const zoomable = svg.select('g.zoomable');

        const iconG = svg.select('g.modeIcon')
        const mapBrush = d3.brush()

        iconG.on('click', () => mode == 'zoom' ? setMode('brush'):setMode('zoom'));
        one(iconG, 'rect', 'iconBG')
            .attr("width", 25)
            .attr("height", 25)
            .attr("x", width - 50)
            .attr("y", height - 50)
            .attr("fill", "white")

        var iconFile
        if (mode == 'zoom') {
            // turn off brushing
            zoomable.on(".brush", null);
            svg.call(d3.zoom().on('zoom', (event) => {
                d3.selectAll('.nvtooltip').style('opacity', '0');
                setZoom(event.transform)
            }));
            iconFile = zoomIcon
        } else {
            // turn off zooming
            svg.on(".zoom", null);
            // do brushing
            const mapBrush = d3.brush().on("end", (e) => { 
                if (projection) {
                    var newFilter = { ...filter};
                    if (e.selection == null) {
                        newFilter.lat = undefined;
                        newFilter.lng = undefined;                        
                    } else {
                        var l1 = projection.projection.invert(e.selection[0])
                        var l2 = projection.projection.invert(e.selection[1])
                        newFilter.lat = [ l1[1], l2[1]].sort();
                        newFilter.lng = [ l1[0], l2[0]].sort();
                    }

                    setFilter(newFilter)
                }
            });
            zoomable.call(mapBrush)
            iconFile = brushIcon
        }
        one(iconG, 'image', 'icon')
            .attr("xlink:href",iconFile)
            .attr("width", 25)
            .attr("height", 25)
            .attr("x", width - 50)
            .attr("y", height - 50)
    }, [mode, projection])

    useEffect(() => {
        if ((data == null)||(features['Countries']==null)||(features['States']==null)) {
            return 
        }

        const colors = column_defs[colorColumn].colorScale
        const colorFunction = (d) => {
            return colors(d[colorColumn])
        }

        const svg = d3.select(mapRef.current)
        if (features['Countries'] && features['States'] && data) {
            one(svg, 'g', 'zoomable')
                .attr('transform', zoom)
                .call(map, { features, labels : cities, data : data, tooltipRef, width, height, tooltipHTML, colorFunction, setProjection: setProjection });
        }
    }, [features, cities, data, zoom, colorColumn, width, height]);

    useEffect(() => {
        const svg = d3.select(mapRef.current)

        one(svg, 'g', 'colorscale')
            .call(colorLegend, {
                colorScale : column_defs[colorColumn].colorScale,
                x : width-150, y : height-200,
                colorLegendLabel : column_defs[colorColumn].description,
                // hoveredValue : hoveredValue,
                // setHoveredValue : setStyleOverlay
             });
    }, [colorColumn, data, width, height, hoveredValue]);

    if (features['Countries'] === undefined) {
        fetch(worldAtlasURL)
            .then((response) => response.json())
            .then((topoJSONData) => {
            const countries = topojson.feature(
                topoJSONData,
                'countries',
            );
            setFeatures({
                'Countries' : countries,
                ...features
            });;
        }, [features]);
    }

    if (features['States'] === undefined) {
        fetch(statesURL)
            .then((response) => response.json())
            .then((topoJSONData) => {
            const states = topojson.feature(
                topoJSONData,
                'states',
            );
            setFeatures({
                'States' : states,
                ...features
            });;
        }, [features]);
    }

    if (cities === undefined) {
        d3.csv(citiesURL, (d, i) => {
            d.lat = +d.lat;
            d.lng = +d.lng;
            d.population = +d.population;
            d.id = i;
            return d;
        }).then((cities) => {
            setCities(cities.filter((d) => d.population > populationThresholdForLabels))
        });
    }

    return <div>
        <svg width={width} height={height} id="mapview" ref={mapRef} />
        <div id="tooltip" className="tooltip" ref={tooltipRef}/>
        <Button className="resetMap" onClick={resetMap}>Reset Zoom</Button>
    </div>
};

export default MapView;