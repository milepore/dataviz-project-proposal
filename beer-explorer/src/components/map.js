import {
    geoEquirectangular,
    geoPath,
    geoGraticule,
    select
  } from 'd3';
import { Memoize } from 'd3-rosetta';

const oceanColor = '#EEEEFF';
const landColor = '#002000';
const labelColor = '#808000';

const showTooltip = function (tooltipRef, event, html) {
  const tooltipDiv = tooltipRef.current;
  if (tooltipDiv) {
    select(tooltipDiv).transition().duration(200).style("opacity", 0.9);
    select(tooltipDiv)
      .html(html)
      .style("left", event.pageX + "px")
      .style("top", event.pageY - 28 + "px");
  }
};

const hideTooltip = (tooltipRef) => {
  const tooltipDiv = tooltipRef.current;
  if (tooltipDiv) {
    select(tooltipDiv).transition().duration(200).style("opacity", 0);
  }
};

export const map = (
  selection,
  {
    features,
    data,
    labels = [],
    colorFunction,
    tooltipRef,
    width,
    height,
    tooltipHTML,
  },
) => {
  const memo = Memoize(selection);

  memo(() => {
    const projection = geoEquirectangular()
      .scale(width / 1.75 / Math.PI) 
      .rotate([0, 0]) 
      .center([0, 0]) 
      .translate([width / 2, height / 2])
    const path = geoPath(projection);
    const graticule = geoGraticule();

    const gMap = selection
      .selectAll('g.map')
      .data([null])
      .join('g')
      .attr('class','map');

    const mapExtent1 = projection([-180, 90])
    const mapExtent2 = projection([180, -90])

    const ocean = gMap
      .selectAll('rect.ocean')
      .data([null])
      .join('rect')
      .attr('class','ocean')
      .attr('width', mapExtent2[0] - mapExtent1[0])
      .attr('height', mapExtent2[1] - mapExtent1[1])
      .attr('x', mapExtent1[0])
      .attr('y', mapExtent1[1])
      .attr('fill', oceanColor)

    gMap
      .selectAll('path.graticule')
      .data([null])
      .join('path')
      .attr('class', 'graticule')
      .attr('d', path(graticule()))
      .attr('fill', 'none')
      .attr('stroke', '#BBB')
      .attr('stroke-width', 0);
    for (var feature of  Object.keys(features).sort()) {
      const featureGroup = gMap
        .selectAll('g.' + feature)
        .data([null])
        .join('g')
        .attr('class',feature);

      featureGroup
        .selectAll('path.' + feature)
        .data(features[feature].features)
        .join('path')
        .attr('d', path)
        .attr('class', feature)
        .attr('fill',landColor)
        .attr('stroke','#B0B0B0')
        .attr('stroke-width','0.2')
    }

    const labelsG = gMap.selectAll('g.labels')
      .data([null])
      .join('g')
      .attr('class', 'labels');

    for (const l of labels) {
      const [x, y] = projection([l.lng, l.lat]);
      l.x = x;
      l.y = y;
    }

    const labelsText = labelsG
      .selectAll('text')
      .data(labels, (d) => d.id)
      .join('text')
      .attr('alignment-baseline', 'middle')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('font-size', (d) =>
        Math.sqrt(d.population / 800000),
      )
      .attr('stroke', labelColor)
      .attr('fill', labelColor)
      .attr('stroke-width', .02)//(d) => d.population / 30000000)
      .text((d) => d.city);

    const reviews = data ? data.csvData : [];
    for (const d of reviews) {
      const [x, y] = projection([d.lng, d.lat]);
      d.x = x;
      d.y = y;
      d.color = colorFunction(d);
    }
  
    const gData = selection
      .selectAll('g.data')
      .data([null])
      .join('g')
      .attr('class','data');


    var circle = gData
      .selectAll('circle.beer')
      .data(reviews)
      .join('circle')
      .attr('class', (d) => ('beer ' + d.family))
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', 0.2)
      .attr('fill', (d) => d.color)
      .attr('stroke', (d) => d.color)
      .on('mouseover', (event, d) => showTooltip(tooltipRef, event, tooltipHTML(d)))
      .on('mouseout', (event, d) => hideTooltip(tooltipRef))
  
    gMap
      .selectAll('path.outline')
      .data([null])
      .join('path')
      .attr('class', 'outline')
      .attr('d', path(graticule.outline()))
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);
  }, [features, data, colorFunction, width, height]);
}
