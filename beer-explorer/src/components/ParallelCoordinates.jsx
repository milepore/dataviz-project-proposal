import { useEffect, useRef, useState } from "react";
import {
    select,
    transition,
    scaleLinear,
    scalePoint,
    scaleOrdinal,
    schemeCategory10,
    extent,
    line,
    brushY,
    easeLinear,
    hcl,
    axisLeft,
    axisRight,
    axisBottom,
  } from 'd3';
  import { one, Memoize } from 'd3-rosetta';
  import ColorSelector from './ColorSelector';

  // Shifts the hue of a given color.
const hueShift = (hueDelta) => (color) => {
    const newColor = hcl(color);
    newColor.h += hueDelta;
    return newColor.formatHex();
  };
  
const lineGenerator = line();

// adapted from https://vizhub.com/curran/parallel-coordinates-with-brushing

const ParallelCoordinates = (
    {
      data,
      columns,
      columnDefs,
      idValue,
      width = 900,
      height = 600,
      brushWidth = 70,
      marginTop = 30,
      marginRight = 94,
      marginBottom = 50,
      marginLeft = 63,
    }) => {
    
    const [ brushedIntervals, setBrushedIntervals ] = useState({});
    const [ colorColumn, setColorColumn ] = useState('family');

    const updateBrushedInterval = ({column, interval}) => {
        setBrushedIntervals( { ... brushedIntervals, [column] : interval, })
    }

    const ref = useRef();
    useEffect(() => {
        if (data == null) {
            return 
        }
        const selection = select(ref.current);
        selection
            .attr('width', width)
            .attr('height', height)
            .style('background', '#090F10');
    
        const xScale = scalePoint()
            .domain(columns)
            .range([marginLeft, width - marginRight]);
    
        const yScales = {};
        for (const column of columns) {
            yScales[column] =
            columnDefs[column].type === 'numeric'
                ? scaleLinear()
                    .domain(extent(data, (d) => d[column]))
                    .range([height - marginBottom, marginTop])
                : scalePoint()
                    .domain(data.map((d) => d[column]))
                    .range([height - marginBottom, marginTop]);
        }
    
        const colorScale = columnDefs[colorColumn].colorScale;
        const colorValue = (d) => { 
            return d[colorColumn];
        }
    
        // Only recompute the filtered data
        // when `brushedIntervals` changes,
        // but not when width and height change.
        const memoize = Memoize(selection);
        const filteredData = memoize(() => {
            // Uncomment to verify when recomputation happens
            return data.filter((d) => {
                for (const column of columns) {
                    const interval = brushedIntervals[column];
                    if (interval) {
                        const yPixelValue = yScales[column](d[column]);
                        const [yPixelMin, yPixelMax] = interval;
                        if (yPixelValue > yPixelMax || yPixelValue < yPixelMin) {
                            return false;
                        }
                    }
                }
                return true;
            });
        }, [data, columns, brushedIntervals, colorColumn]);

        // Set up a <g> to contain the marks,
        // so that the layering is consistent
        // (marks always appear BEHIND the axes & brushes).
        const g = one(selection, 'g', 'marks');

        // Render the multi-line paths with fade transitions!
        const t = transition().duration(500).ease(easeLinear);
        g.selectAll('path.mark')
            .data(filteredData, idValue)
            .join(
            (enter) =>
                enter
                .append('path')
                .attr('class', 'mark')
                .attr('opacity', 0)
                .call((enter) =>
                    enter.transition(t).attr('opacity', 1),
                ),
            (update) =>
                update.call((update) =>
                update.transition(t).attr('opacity', 1),
                ),
            (exit) =>
                exit.call((exit) =>
                exit.transition(t).attr('opacity', 0).remove(),
                ),
            )
            .attr('fill', 'none')
            .attr('stroke', (d) => colorScale(colorValue(d)))
            .attr('stroke-width', 16 / 10)
            .style('pointer-events', 'none')
            //.style('mix-blend-mode', 'color-burn')
            // .style('mix-blend-mode', 'screen')
            // .attr('stroke-linecap', 'round')
            // .attr('stroke-linejoin', 'round')
            .attr('d', (d) =>
            lineGenerator(
                columns.map((column) => [
                xScale(column),
                yScales[column](d[column]),
                ]),
            ),
            );

        // Add an X axis
        one(selection, 'g', 'x-axis')
            .attr(
            'transform',
            `translate(0,${height - marginBottom})`,
            )
            .style('color', '#FFFFFF')
            .style('font-size', 18)
            .call(
            axisBottom(xScale)
                .tickFormat((str) => str.replace('_', ' '))
                .tickPadding(11),
            )
            .call((selection) => {
            selection.selectAll('line').remove();
            selection.selectAll('path').remove();
            });

        // Add multiple Y axes
        columns.forEach((column, i) => {
            one(selection, 'g', `y-axis-${i}`)
            .attr('transform', `translate(${xScale(column)}, 0)`)
            .call(
                (i === columns.length - 1 ? axisRight : axisLeft)(
                yScales[column],
                )
                .tickPadding(8)
                .tickSize(0)
                .ticks(6),
            )
            .call((selection) => {
                // Style the text
                selection
                .selectAll('text')
                .attr('fill', '#FFFFFF')
                .attr('font-size', 14)
                .attr('paint-order', 'stroke')
                .attr('stroke-width', 50 / 10)
                .attr('stroke-linejoin', 'round')
                .attr('stroke', '#000000')
                .attr('stroke-opacity', 60 / 100);

                // Style the tick lines as circles
                selection
                .selectAll('line')
                .attr('stroke', '#FFFFFF')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', 50 / 10);

                // Remove the domain paths
                selection.select('.domain').remove();
            });
        });

        // // Add the brushes.
        const brush = brushY()
            .extent([
                [-(brushWidth / 2), marginTop],
                [brushWidth / 2, height - marginBottom],
            ])
            .on('start brush end', ({ selection, sourceEvent }, column) => {
                // Only respond to user interactions,
                // not when we programmatically move the brush.
                if (sourceEvent) {
                updateBrushedInterval({
                    column,
                    interval: selection,
                });
                }
            },
            );
        selection
            .selectAll('g.brush')
            .data(columns)
            .join('g')
            .attr('class', 'brush')
            .attr(
            'transform',
            (column) => `translate(${xScale(column)}, 0)`,
            )
            .call(brush)
            .each(function (column) {
            // Programmatically move the brush.
            // This will make the brushed intervals
            // correct when the window is resized vertically.
            if (brushedIntervals[column]) {
                select(this).call(
                brush.move,
                brushedIntervals[column],
                );
            }
        });
    }, [data,
        columns,
        columnDefs,
        idValue,
        width,
        height,
        brushWidth,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        brushedIntervals,
        colorColumn] )

    return <div className="parallel-chart">
        <svg width={width} height={height} id="parallel-chart" ref={ref} />
        <label>Color By:
        <ColorSelector column_defs={columnDefs} colorColumn={colorColumn} setColorColumn={(d) => {setColorColumn(d.target.value)}}/>
        </label>
        </div>;
};

export default ParallelCoordinates;