import {
    geoNaturalEarth1,
    geoPath,
    geoGraticule,
    scaleLinear,
  } from 'd3';
  import { one, Memoize } from 'd3-rosetta';
  
  export const map = (
    selection,
    {
      countries,
      reviews
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
    
      selection
        .selectAll('circle')
        .data(reviews)
        .join('circle')
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('r', 0.2)
        .attr('fill', (d) => d.color)
        .attr('stroke', (d) => d.color);
    
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
  