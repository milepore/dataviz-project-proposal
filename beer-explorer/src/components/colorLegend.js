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
      hoveredValue,
      setHoveredValue
    }
) => {
  var colorLegendBG = one(selection, 'rect', 'color-label-background')
    .attr('transform', `translate(${x-tickSpacing},${y-tickPadding-5})`)
    .attr('rx', '5')
    .attr('ry', '5')

  var colorLegendG = 
    one(selection, 'g', 'color-legend')
    .attr('transform', `translate(${x},${y})`);

  one(colorLegendG, 'text', 'color-legend-label')
    .attr('x', colorLegendLabelX-tickSpacing/2)
    .attr('y', colorLegendLabelY)
    .attr('class', 'color-legend-label')
    .attr('font-family', 'sans-serif')
    .style('user-select', 'none')
    .attr('font-size', 10)
    .attr('color', 'black')
    .text(colorLegendLabel);
    
  // we can have 2 types here - scalar and range
  // if this is scalar, lets make multiple ticks 
  // and support interactivity
  var buildTickCircle = (s) => {
    return s.append('circle')
      .attr('r', 5)
      .attr('fill', colorScale);
  }

  var buildTickSquare = (s) => {
    return s.append('rect')
      .attr('width', 5)
      .attr('height', tickSpacing)
      .attr('fill', colorScale)
  }

  var buildTick = null;
  var numTicks = 0;
  var ticks = [];
  var allVis = true;
  if (colorScale.domain().length != 2) {
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
      if (setHoveredValue != null ) {
        selection
          .on('mouseover', d => setHoveredValue(d.target.__data__))
          .on('mouseout', d => setHoveredValue(null))
          .attr('opacity', d => hoveredValue?d == hoveredValue?1.0:0.1:1.0)
      }

      selection
        .append('text')
          .attr('dy', '0.32em')
          .attr('x', tickPadding)
          .attr('color', 'black')
          .attr('visibility', (d) => {hide=!hide; return (!allVis&&hide)?'hidden':'visible'})
          .style('user-select', 'none')
          .text((d) => d)
      })
      

    colorLegendBG.attr('x', 0).attr('y', 0)
    colorLegendBG.attr('height', tickSpacing * (numTicks +1) + tickPadding)
    colorLegendBG.attr('width', 100);
    colorLegendBG.attr('fill', scaleBackground);
}


