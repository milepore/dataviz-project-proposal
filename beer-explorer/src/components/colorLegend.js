import * as d3 from "d3";
import { one } from 'd3-rosetta'

// adapted from https://vizhub.com/curran/a446f43c024a49608f7ae418cde946a2?edit=files&file=colorLegend.js

export const colorLegend = (
  selection,  
  {
      colorScale,
      x = 200,
      y = 50,
      colorLegendLabelX = 0,
      colorLegendLabelY = 0,
      colorLegendLabel = 'Colors',
      tickSpacing = 10,
      tickPadding = 7,
      scaleBackground = 'white',
      width = 5,
      hoveredValue,
      setHoveredValue
    }
) => {
  var colorLegendBG = one(selection, 'rect', 'color-label-background')
  .attr('transform', `translate(${x-tickSpacing},${y-tickPadding})`);

  var colorLegendG = 
    one(selection, 'g', 'color-legend')
    .attr('transform', `translate(${x},${y})`);

  one(colorLegendG, 'text', 'color-legend-label')
    .attr('x', colorLegendLabelX)
    .attr('y', colorLegendLabelY)
    .attr('class', 'color-legend-label')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .text(colorLegendLabel);
    
  // we can have 2 types here - scalar and range
  // if this is scalar, lets make multiple ticks 
  // and support interactivity
  var buildTickCircle = (s) => {
    s.append('circle')
      .attr('r', 5)
      .attr('fill', colorScale);
  }

  var buildTickSquare = (s) => {
    s.append('rect')
      .attr('width', 5)
      .attr('height', tickSpacing)
      .attr('fill', colorScale)
  }

  var buildTick = null;
  var numTicks = 0;
  var ticks = [];
  var allVis = true;
  if (colorScale.domain().length > 2) {
    buildTick = buildTickCircle;
    numTicks = colorScale.domain().length;
    ticks = colorScale.domain();
  } else {
    buildTick = buildTickSquare;
    numTicks = 9;
    allVis = false;
    let domain = colorScale.domain();
    for (let i = 0 ; i < numTicks ; i++) {
      let val = domain[0] + (domain[1] - domain[0])*(i/(numTicks-1))
      ticks.push(val)
    }
  }

  var hide = true;
  colorLegendG
      .selectAll('g.tick')
      .data(ticks)
      .join('g')
      .attr('class', 'tick')
      .attr(
        'transform',
        (d, i) => `translate(0, ${(i+1) * tickSpacing})`
      )
      .attr('font-size', 10)
      .attr('font-family', 'sans-serif')
      .call((selection) => {
        selection.selectAll('*').remove()
        buildTick(selection)
        selection
          .append('text')
          .attr('dy', '0.32em')
          .attr('x', tickPadding)
          .attr('visibility', (d) => {hide=!hide; return (!allVis&&hide)?'hidden':'visible'})
          .style('user-select', 'none')
          .text((d) => d);
      })

    colorLegendBG.attr('x', 0).attr('y', 0)
    colorLegendBG.attr('height', tickSpacing * (numTicks +1) + tickPadding)
    colorLegendBG.attr('width', 100);
    colorLegendBG.attr('fill', scaleBackground);
}


