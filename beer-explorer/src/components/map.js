import {
    geoEquirectangular,
    geoPath,
    geoGraticule,
    select
  } from 'd3';
  import { Memoize } from 'd3-rosetta';

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
      reviews,
      colorFunction,
      tooltipRef,
      width,
      height,
      tooltipHTML
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

      gMap
        .selectAll('path.graticule')
        .data([null])
        .join('path')
        .attr('class', 'graticule')
        .attr('d', path(graticule()))
        .attr('fill', 'none')
        .attr('stroke', '#BBB')
        .attr('stroke-width', 0.2);

        for (var feature in features) {
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
            .attr('fill','black')
            .attr('stroke','#B0B0B0')
            .attr('stroke-width','0.2')
        }
    
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
        .attr('class', 'beer')
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
    }, [features, reviews, colorFunction]);
  }
  