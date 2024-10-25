import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";


const Barchart = ({ summaryData }) => {
    function createAxes(
        svg,
        width,
        height,
        xMargin,
        yMargin,
        leftText,
        rightText,
        bottomText,
        leftRange,
        rightRange,
        bottomRange,
    ) {
        // scales for X and Y axes
        const xScale = d3.scaleBand()
        .domain(bottomRange)
        .range([xMargin, width - xMargin]);
    
        const yScaleLeft = d3.scaleLinear()
        .domain(leftRange)
        .range([height - yMargin, yMargin]);
    
        const yScaleRight = d3.scaleLinear()
        .domain(d3.extent(rightRange))
        .range([height - yMargin, yMargin]);
    
        // BACKGROUND RECT
        svg
        .selectAll('rect.background')
        .data([null])
        .join('rect')
        .attr('class', 'background')
        .attr('x', xMargin)
        .attr('y', yMargin)
        .attr('width', width - xMargin * 2)
        .attr('height', height - yMargin * 2)
        .attr('fill', '#B5B5B5')
        .attr('opacity', 0.5); // Adjust opacity as needed
    
        //CREATE AXIS .. move them to the center of the canvas
        svg
        .selectAll('g.axisBottom')
        .data([null])
        .join('g')
        .attr('class', 'axisBottom')
        .attr('transform', `translate(0, ${height - yMargin})`) // Left X Axis
        .call(d3.axisBottom(xScale));
    
        svg
        .selectAll('g.axisLeft')
        .data([null])
        .join('g')
        .attr('class', 'axisLeft')
        .attr('transform', `translate(${xMargin}, 0)`) // Y axis
        .call(d3.axisLeft(yScaleLeft));
    
        svg
        .selectAll('g.axisRight')
        .data([null])
        .join('g')
        .attr('class', 'axisRight')
        .attr('transform', `translate(${width - xMargin}, 0)`) // Y axis
        .call(d3.axisRight(yScaleRight));
    
        // Add X and Y labels
        svg
        .selectAll('text.leftText')
        .data([null])
        .join('text')
        .attr('class', 'leftText')
        .attr(
            'transform',
            `translate(${xMargin / 2}, ${height / 2}) rotate(-90)`,
        )
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .style('fill', 'red')
        .text(leftText);
    
        svg
        .selectAll('text.bottomText')
        .data([null])
        .join('text')
        .attr('class', 'bottomText')
        .attr('x', width / 2)
        .attr('y', height - yMargin / 2)
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .text(bottomText);
    
        svg
        .selectAll('text.rightText')
        .data([null])
        .join('text')
        .attr('class', 'rightText')
        .attr(
            'transform',
            `translate(${width - xMargin / 2}, ${height / 2}) rotate(90)`,
        )
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .style('fill', 'black')
        .text(rightText);

        return [ yScaleLeft, yScaleRight, xScale ]
    }

    const width = 900;
    const height = 600;

    const ref = useRef();
    useEffect(() => {

        if (summaryData == null) {
            return 
        }

        var data = summaryData.data;
        var summarizedBy = summaryData.summarizedBy;

        // set the dimensions and margins of the graph
        const barHeight = (d) => d * 3 + 10;
        const spacing = width / (data.length + 1);
        const barCenter = spacing * 0.33;
        const xMargin = 100;
        const yMargin = 100;
        const ratingScale = 50.0;
        const barWidth = spacing * .66;

        const lineGenerator = d3.line(
            // (d) =>
            //   d.index * spacing +
            //   barCenter +
            //   xMargin +
            //   barWidth / 2,
            // (d) => height - (d.avg * ratingScale + yMargin),
            (d) => scaleBottom(d[summarizedBy.value]) + spacing / 2,
            (d) => scaleLeft(d.review_overall)
        );
        
        // append the svg object to the body of the page
        // const svg = d3
        //     .select(ref.current).selectAll("svg")
        //     .data([null]).join("svg")
        //     .attr("width", width + xMargin*2)
        //     .attr("height", height + yMargin*2)
        //     .selectAll("g").data([null]).join("g")
        //     .attr("transform", `translate(${margin.left},${margin.top})`);

        const svg = d3.select(ref.current)
            .selectAll('svg')
            .data([null]).join('svg')
            .attr('width', width)
            .attr('height', height);
        
        var [ scaleLeft, scaleRight, scaleBottom ] = createAxes(
            svg,
            width,
            height,
            xMargin,
            yMargin,
            'Average Rating',
            'Number Beers',
            summarizedBy.label,
            [0, 5],
            [0, Math.max.apply(null, data.map((x) => x.count))],
            data.map((x) => x[summarizedBy.value]),
        );
        
        svg
            .selectAll('rect.datarect')
            .data(data)
            .join('rect')
            .attr('class', 'datarect')
            .attr('x', (d) => scaleBottom(d[summarizedBy.value]))
            .attr('y', (d) => scaleRight(d.count))
            .attr('width', barWidth)
            .attr('height', (d) => scaleRight(0)-scaleRight(d.count));
    
        svg
            .selectAll('path.datapath')
            .data([data])
            .join('path')
            .attr('class', 'datapath')
            .attr('fill', 'none')
            .attr('d', lineGenerator)
            .attr('stroke', 'red')
            .attr('stroke-width', 8)
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round');
    });

    return <svg width={width} height={height} id="barchart" ref={ref} />;
};

export default Barchart;