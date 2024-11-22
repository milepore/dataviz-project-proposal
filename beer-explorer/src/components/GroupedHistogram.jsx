import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { colorLegend } from './colorLegend';


function createLeftAxis(
    svg,
    width,
    height,
    margins,
    leftText,
    leftRange
) {
    const yScaleLeft = d3.scaleLinear()
        .domain(leftRange)
        .range([height - margins.bottom, margins.top]);
    const leftTickSpacing = 50;

    const innerHeight = height - margins.top - margins.bottom;
    const leftTicks = innerHeight / leftTickSpacing 

    svg
        .selectAll('g.axisLeft')
        .data([null])
        .join('g')
        .attr('class', 'axisLeft')
        .attr('transform', `translate(${(margins.left)}, 0)`) // Y axis
        .call(d3.axisLeft(yScaleLeft).ticks(leftTicks));

    // Add X and Y labels
    svg
        .selectAll('text.leftText')
        .data([null])
        .join('text')
        .attr('class', 'leftText')
        .attr(
            'transform',
            `translate(${(margins.left)*.25}, ${height / 2}) rotate(-90)`,
        )
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .attr('font-size', 10)
        .attr('font-family', 'sans-serif')
        .style('fill', 'red')
        .text(leftText);

    return yScaleLeft;

}

function createBackground(
    svg,
    width,
    height,
    margins,
) {
    const innerHeight = height - margins.top - margins.bottom;

    // BACKGROUND RECT
    svg
        .selectAll('rect.background')
        .data([null])
        .join('rect')
        .attr('class', 'background')
        .attr('x', margins.left)
        .attr('y', margins.top)
        .attr('width', width - margins.left - margins.right)
        .attr('height', innerHeight)
        .attr('fill', '#B5B5B5')
        .attr('opacity', 0.5); // Adjust opacity as needed
}

function createBottomAxis(
    svg,
    width,
    height,
    margins,
    bottomText,
    bottomRange,
) {
    var innerWidth = width - margins.left - margins.right;
    var groupWidth = innerWidth / bottomRange.length

    // scales for X and Y axes
    const xScale = d3.scaleBand()
        .domain(bottomRange)
        .range([margins.left, width - (margins.right)]);

    //CREATE AXIS .. move them to the center of the canvas
    svg
        .selectAll('g.axisBottom')
        .data([null])
        .join('g')
        .attr('class', 'axisBottom')
        .attr('transform', `translate(0, ${height - margins.bottom})`) // Left X Axis
        .call(d3.axisBottom(xScale).ticks(bottomRange.length))
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-25)");

    svg
        .selectAll('text.bottomText')
        .data([null])
        .join('text')
        .attr('class', 'bottomText')
        .attr('x', width / 2)
        .attr('y', height - margins.bottom / 4)
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .attr('font-size', 10)
        .attr('font-family', 'sans-serif')
        .text(bottomText)

    return xScale
}

/**
 * 
 * @param {*} data an object representing the data, with keys csvData,
 * columnValues and columnRanges
 * @param {*} bucketColumn the column which we will use as the value to bucket
 * our data across the various ranges
 * @param {*} divideColumn the column we will use to divide the various possible values
 * @param {*} ticks the number of buckets that we will create
 * @param {*} valueRange the range of the values (should be able to get this from
 * data.valueRanges[bucketColumn]??)
 * @param {*} percentages should the values we return be percentages of the total
 * for that category to more easily compare values 
 * @return an array, containing 'ticks' values where each value is an object
 * where the key represents all possible values of divideColumn and the value
 * is an integer with the count of those values in fitleredData
 */
function computeData(data, bucketColumn, divideColumn, ticks, valueRange, percentages=true) {
    var filteredData = data.csvData;
    // I'm counting - so I want a data structure like this:
    // [ // array - index is the group
    //    { k1 : x, k2 : y} // for group 1, the values for each divideKey
    // ]

    // lets create an array of ranges
    var valueRanges = [];
    for (var i = 0 ; i < ticks ; i++)
    {
        var valueBottom = valueRange[0] + ( valueRange[1] / (ticks-1) ) * i;
        var valueTop = valueRange[0] + ( valueRange[1] / (ticks-1) ) * (i + 1);
        valueRanges.push([ valueBottom, valueTop ]);
    }

    var totals = {}
    for (var group of data.columnValues[divideColumn]) {
        totals[group] = 0;
    }

    // now lets initialize our values
    var stackedGraphValues = [];
    for (var key in valueRanges) {
        var values = {}
        for (var group of data.columnValues[divideColumn]) {
            values[group] = 0;
        }
        stackedGraphValues.push(values);
    }

    // ok, now lets iterate and divide our stuff into groups
    for (var row of filteredData) {
        // check to see the bucket we are in
        for (var i = 0 ; i < ticks ; i++) {
            if ((row[bucketColumn] >= valueRanges[i][0])&&(row[bucketColumn] <= valueRanges[i][1])){
                stackedGraphValues[i][row[divideColumn]]++;
                totals[row[divideColumn]]++;
            }
        }
    }

    if (percentages) {
        for (var tick in stackedGraphValues)
            for (var group in stackedGraphValues[tick])
                stackedGraphValues[tick][group] = stackedGraphValues[tick][group] / totals[group]
    }

    return [ stackedGraphValues, valueRanges ];
}

const GroupedHistogram = ({ data,
    width = window.innerWidth,
    height = width / 1.5,
    column_defs,
    bucketColumn,
    divideColumn,
    ticks,
    percentages = true,
    stacked = false
 }) => {

    const ref = useRef();
    useEffect(() => {

        if (data == null) {
            return 
        }

        const valueRange = column_defs[bucketColumn].range;
        var [ multipleGraphValues, ranges ] = computeData(data, bucketColumn, divideColumn, ticks, valueRange, percentages)

        var maxValue = 0;
        for (var values of multipleGraphValues) {
            var rowMax = Math.max(...Object.values(values));
            maxValue = Math.max(maxValue, rowMax);
        }

        // set the dimensions and margins of the graph
        const margins = {
            top : 25,
            bottom : 50,
            left : 50, 
            right : 120
        }

        const svg = d3.select(ref.current)
            .attr('width', width)
            .attr('height', height);

        createBackground(svg, width, height, margins)
        var scaleLeft = createLeftAxis(svg, width, height, margins, 
            percentages ? 'Percentage of Beers' : 'Number of Beers',
            [ 0, maxValue])

        var colorScale = column_defs[divideColumn].colorScale;
        const innerWidth = width - margins.left - margins.right;


        if (stacked) {
            var scaleBottom = createBottomAxis(
                svg,
                width,
                height,
                margins,
                'Rating',
                valueRange,
            );


            const categoryWidth = ( innerWidth / ticks );
            const numberGroups = data.columnValues[divideColumn].length;
            const barWidth = categoryWidth / (numberGroups + 2); // so we have space
            // make a bunch of groups called 'datagroup', then make bars in each
            svg.selectAll('g.datagroup').data(multipleGraphValues).join('g').attr('class', 'datagroup')
                // by doing a transform, we don't need to worry about 
                .attr('transform', (d, i) => `translate(${i*categoryWidth+margins.left},0)`)
                .selectAll('rect.databar').data((d) => (Object.entries(d))).join('rect').attr('class', 'databar')
                    .attr('x', (d,i) => (barWidth) * i)
                    .attr('y', (d) => scaleLeft(d[1]))
                    .attr('width', barWidth)
                    .attr('height', (d) => scaleLeft(0) - scaleLeft(d[1]))
                    .attr('fill', (d) => colorScale(d[0]))

            svg.selectAll('g.colorscale').data([null]).join('g').attr('class', 'colorscale')
                    .call(colorLegend, {
                        colorScale : column_defs[divideColumn].colorScale,
                        x : width-margins.right+10, y : margins.top,
                        colorLegendLabel : column_defs[divideColumn].description,
                        // hoveredValue : hoveredValue,
                        // setHoveredValue : setStyleOverlay
                    });
        } else {
            var scaleBottom = createBottomAxis(
                svg,
                width,
                height,
                margins,
                'Category',
                data.columnValues[divideColumn],
            );

            // will need to do bottom scale differently, maybe one for each?
            const numberGroups = data.columnValues[divideColumn].length;
            const categoryWidth = ( innerWidth / numberGroups );
            const barWidth = categoryWidth / (ticks + 2); // so we have space

            // make a bunch of groups called 'datagroup', each one corresponding to a value of the
            // divide column
            svg.selectAll('g.datagroup').data(data.columnValues[divideColumn]).join('g').attr('class', 'datagroup')
                // by doing a transform, we don't need to worry about 
                .attr('transform', (d, i) => `translate(${i*categoryWidth+margins.left},0)`)
                .selectAll('rect.databar').data((d) => (
                        Object.entries(multipleGraphValues).map((e) => { 
                            return { category : d, key : e[0], value : e[1][d] }
                        }))).join('rect').attr('class', 'databar')
                    .attr('x', (d,i) => (barWidth) * i)
                    .attr('y', (d) => scaleLeft(d.value))
                    .attr('width', barWidth)
                    .attr('height', (d) => scaleLeft(0) - scaleLeft(d.value))
                    .attr('fill', (d) => colorScale(d.category))

            svg.selectAll('g.colorscale').data([null]).join('g').attr('class', 'colorscale')
                    .call(colorLegend, {
                        colorScale : column_defs[divideColumn].colorScale,
                        x : width-margins.right+10, y : margins.top,
                        colorLegendLabel : column_defs[divideColumn].description,
                        // hoveredValue : hoveredValue,
                        // setHoveredValue : setStyleOverlay
                    });

        }
    });

    return <svg width={width} height={height} id="grouped-histogram" ref={ref} />;
};

export default GroupedHistogram;