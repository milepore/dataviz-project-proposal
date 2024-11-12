# Data Visualization Project

## Live Project

This project is no longer hosted in DataViz - because using a bunch of react components (like react-select) made building the filters and interactivity easier.  Instead its hosted here on github pages.  You can access the current working build here:

[https://milepore.github.io/dataviz-project-proposal/]

I was able to publish this using the gh-pages plugin.  Unfortunately that sometimes means that caching takes place so if you see weird behavior, just refresh your browser.  The Cache TTL is about 10 minutes by default on github pages, so it isn't too big an issue.

## Data

The data I propose to visualize for my project is a series of Beer Reviews from BeerAdvocate from 2000 to 2011 that has been augmented with location information for the breweries of the beers reviewed.

This data was derrived from a project that I did for a Machine Learning course and can be found at this GitHub location:
[https://github.com/milepore/BeerStyleLocationAnalysis]

The data was derrived from a combination of the BeerAdvocate dataset [https://data.world/socialmediadata/beeradvocate] - aproxamately 1.5M beer reviews from 2000-2011.  This data was augmented by internet scraped location information, which was converted to GPS location via the Google Places API.

This gave us about 1M location-enhanced review records.  This was too much to visualize, so we added a summary by beer.  This gives us about 32,000 individual beer ratings with the following fields:
* Brewery (name, ID)
* Brewery Location (City, State, Country, Latitude, Longitude)
* Style (categorical)
* Beer Name
* Beer ABV
* Average Rating
* Number of reviews

Additionally we are going to augment this data with a "style category" field - where we take the 100+ styles that we have and reduce it to 15 style families.

The dataset has been made available in vizhub at:
[https://vizhub.com/milepore/beer_ratings_and_locations]

## Questions & Tasks

The following tasks and questions will drive the visualization and interaction decisions for this project.  The overall motivation is to allow a user
to explore the relationship between beer styles and locations:

* Visualize the rating of beers to their style relative to their geography
* Explore the relationship between beer style, rating and geography
* Allow someone to search for a brewery in a given area with high ratings
* Allow someone to search for a given beer style in a given area with a high rating
* Plot all beer ratings for a given style based on their geography
* Plot all beer ratings in a given area to let someone explore what to drink


## Sketches

I have created the following screen sketches for this project:

### Beer Style Explorer - Map View

![Map View](https://github.com/milepore/dataviz-project-proposal/blob/master/map.png?raw=true)]

This screen will Let the user explore the relationship between beer and geography.

* Data filter allows the user to pick the data of all reviews to show.
* Map view uses point marks to encode the location of beers that match the style of the filter
* Point marks are somewhat transparent - allowing density to be a signal
* Color encoding is used (red-green scale maybe) to indicate average review signal
* Could try and use shape signals to shows the style family (not direct style - there are too many, will process and group into families)

The user can change views with the tabs (map/graph/radar or parallel coordinates)

### Graph View

![Graph View](https://github.com/milepore/dataviz-project-proposal/blob/master/line-and-bar.png?raw=true)]

This shows the relationship between two different variables using bar marks and line marks

* Utilizing the same data filter section to allow you to pick the set of data you care about
* Each Variable can be set by the user to allow changing the graph up

Bar/Line (left and right axis) can be set to:
* # Beers
* # Breweries
* Avg Rating
* ABV
* # Reviews

Grouping can be set to:
* Style
* Country
* State (maybe)

### Radar View
![Radar View](https://github.com/milepore/dataviz-project-proposal/blob/master/radar.png?raw=true)]


I am undecided if I will implment this one.  I really like the way that these show changes as you go from one set of selected data to another -
especially if they are animated, but I may switch this out for the parallel coordinates view.

This view allows exploring a single attribute of the beer reviews selected across groupings

In this case, we are exploring rating vs style grouping

Signals are point / area across the various axis

Radius can be set to:
* # Beers
* # Breweries
* Avg Rating
* ABV
* # Reviews

Grouping can be set to:
* Style

### Parallel Coordinates View

![Parallel Coordinates View](https://github.com/milepore/dataviz-project-proposal/blob/master/parallel-coordinates.png?raw=true)]

Allows exploring how beers with similar attributes are related.

Shows how ABV, Rating and # reviews might be related.

Leverages color channel to show how style family is related.

Uses same filter to break things down

## Prototypes

I’ve created a proof of concept visualization of this data. It's is the graph view, and shows several styles of beers, and the realationship of number of beers to average rating:

[![image](https://github.com/milepore/dataviz-project-proposal/blob/master/vizhub-pseudo-viz-line%20and%20bar.png?raw=true)]((https://vizhub.com/milepore/30ff36601d1747a4a109335ddb479d9e))



## Open Questions

The biggest uncertianties that I'm worried about is making the interactive filter elements work with D3.  While I have some experience using react, it has been pretty limited.  I may try and get that to work, or I might just do soem forms in vizhub.  Will explore the overall implementation.

The downside to this is that the filter doesn't have a ton to do with the actual visualizations, but everything to do with the tasks the user has to perform.  The visualizations, I'm not worried about too much at this point - although the map seems like it might be a little complicated, but I'm not super-worried yet.

## Milestones and Live Progress

* Week 9 - Map View of World Reviews
  * Crated map of world reviews, with pan and zoom [https://vizhub.com/milepore/beer_reviews_on_map]
  * Updated data to include style families [https://vizhub.com/milepore/beer_ratings_and_locations]
  * Updated data source to include # reviews
* Week 10 - Migrated (per professor's suggestion) to react application instead of Vizhub
  * Got filter view working - for multi-select (state, country, style) fields
  * Got map ported over to react - that was a bit of a pain
    * Getting the various pan/zoom to work with react state models was challenging, but works now
  * Got summarization filter working for non-map views
  * Got Graph view looking at real data
* Week 11 - Progress
  * General Progress
  * Build another view - Parallel Coordinates
    * Make it possible to pick which of our dimensions show up in the chart
    * Added tooltip to map view to allow looking at individual beer ratings
    * Restructure code to remove the filter and data loading components
    * Move from create-react-app to VITE for development
  * Play around with color
    * Implement color picker and legend with map view
      * Support 4 different values for color and reasonable color schemes for them
    * Incorporate color picker and scales to parallel coordinates
* Week 12 - Enhance data views with way more interactivity
  * Added range filteres more filters to the filter views
  * Updated all the controls to use Material UI (way better L&F)
  * Got rid of a nested SVG elment (<svg><svg>...</svg></svg>) - that seemed to be causing a bunch of problems with the scrolling, it is much better now
  * Per suggestions, added state outlines and city names to the map
  * Minor L&F updates (colors, spacing, legends, fonts)
  * Added automatic sizing to the pages and SVG elements.  Should support mobile and responsive things now (including auto-resize).
  * Worked through the performance issues with 32k points changing their visibility and got hovering working (though not as smoothly as I'd like) for the color legend by using CSS instead of rerendering.
  * Added Sort-By component for bar chart
  * Fixed coloring in the parallel chart view
  * Organized the controls to make it easier to modify the filters and have it apply to multiple views
  * Multiple bug fixes - mostly around the ordering of events and rendering
* Week 13 - Buffer, tuning, look&feel / CSS
* Week 14 - Buffer / finalize / write paper  

