import {
    geoNaturalEarth1,
    geoPath,
    geoGraticule,
    scaleLinear,
    select
  } from 'd3';
  import { Memoize } from 'd3-rosetta';
  
  const showTooltip = function (tooltipRef, event, html) {
    console.log(html);
    const tooltipDiv = tooltipRef.current;
    if (tooltipDiv) {
      select(tooltipDiv).transition().duration(200).style("opacity", 0.9);
      select(tooltipDiv)
        .html(html)
        // TODO: some logic when the tooltip could go out from container
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

  export const map = (
    selection,
    {
      countries,
      reviews,
      tooltipRef
    },
  ) => {
    const memo = Memoize(selection);

    memo(() => {
      const projection = geoNaturalEarth1()
      const path = geoPath(projection);
      const graticule = geoGraticule();
    
      selection
        .selectAll('path.graticule')
        .data([null])
        .join('path')
        .attr('class', 'graticule')
        .attr('d', path(graticule()))
        .attr('fill', 'none')
        .attr('stroke', '#BBB')
        .attr('stroke-width', 0.2);

      selection
        .selectAll('path.country')
        .data(countries.features)
        .join('path')
        .attr('d', path)
        .attr('class', 'country');
    
      var colors = scaleLinear()
        .domain([0, 5])
        .range(['red', 'green']);
    
      for (const d of reviews) {
        const [x, y] = projection([d.lng, d.lat]);
        d.x = x;
        d.y = y;
        d.color = colors(d.review_overall);
      }
    
      var circle = selection
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
    
      selection
        .selectAll('path.outline')
        .data([null])
        .join('path')
        .attr('class', 'outline')
        .attr('d', path(graticule.outline()))
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 1);
    }, [countries, reviews]);
  }
  