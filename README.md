# Data Visualization Project - Beer Explorer

## Project Goal and Overview

I had done some work with Beer Review data in the past.  I wanted to continue to explore some of the attributes of this data.   The goal for the Beer Explorer is to allow a user to explore the relationship between Beer Styles, Review Ratings and Geography.  I hope to allow the users to form their own questions and get answers to them by exploring the beer data.

### Data

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

### Questions & Tasks

The following tasks and questions will drive the visualization and interaction decisions for this project.  The overall motivation is to allow a user
to explore the relationship between beer styles and locations:

* Visualize the rating of beers to their style relative to their geography
* Explore the relationship between beer style, rating and geography
* Allow someone to search for a brewery in a given area with high ratings
* Allow someone to search for a given beer style in a given area with a high rating
* Plot all beer ratings for a given style based on their geography
* Plot all beer ratings in a given area to let someone explore what to drink

### Project format

I ended up hosting this project in GitHub Pages.  The reason was because it was going to be very interactive - and combine both visualization with traditional forms.  In order to do this, React seemed like a great tool to work with.  You can directly access the current version of Beer Explorer here:

[https://milepore.github.io/dataviz-project-proposal/]

## Sketches

In order to allow users to explore the data, I invisioned the following screens and components:

* Beer Style Map Explorer - a map view that renders data about the beer on a world projection.  This allows you to see color and spatial positioning of a beer
* Beer Graph View - allow the user to pick two different values about the selected beers and visualize them together on a single graph
* Radar View - I ended up not implmeenting this view, as I was exploring the data, I wanted some other views instead
* Parallel Coordinates View - allow the user to see the relationship between various attributes of the beers
* Filter View - this component (not so much a view) is common to all our screens.  It allows the user to slice the data by apply a filter across mulitple facets of the data.

These screens are described in more detail and sketch form below:

### Beer Style Explorer - Map View

![Map View](https://raw.githubusercontent.com/milepore/dataviz-project-proposal/refs/heads/master/images/sketch/map.png)]

This screen will Let the user explore the relationship between beer and geography.

* Data filter allows the user to pick the data of all reviews to show.
* Map view uses point marks to encode the location of beers that match the style of the filter
* Point marks are somewhat transparent - allowing density to be a signal
* Color encoding is used (red-green scale maybe) to indicate average review signal
* Could try and use shape signals to shows the style family (not direct style - there are too many, will process and group into families)

The user can change views with the tabs (map/graph/radar or parallel coordinates)

### Graph View

![Graph View](https://raw.githubusercontent.com/milepore/dataviz-project-proposal/refs/heads/master/images/sketch/line-and-bar.png?raw=true)]

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
![Radar View](https://raw.githubusercontent.com/milepore/dataviz-project-proposal/refs/heads/master/images/sketch/radar.png?raw=true)]


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

![Parallel Coordinates View](https://raw.githubusercontent.com/milepore/dataviz-project-proposal/refs/heads/master/images/sketch/parallel-coordinates.png?raw=true)]

Allows exploring how beers with similar attributes are related.

Shows how ABV, Rating and # reviews might be related.

Leverages color channel to show how style family is related.

Uses same filter to break things down

## Implementation

When the Beer Explorer first comes up, the user encounters the entire dataset, plotted on a map, colored by Style Family:

![Default Map View](https://raw.githubusercontent.com/milepore/dataviz-project-proposal/refs/heads/master/images/screens/start-map.png)]

From here, the user can:

* Change the color legend (alternating how the map is colored)
* Alternate between two different Map Navigation Modes:
** Pan/Zoom - zoom in and scroll around the map
** Brush - select a region of the map to set the longitude and latitude filters - so only beer reviews in that location show
* Filter data using a form style control

### Filtering Data

One of the major features of the Beer Explorer is the ability to filter the data in various forms.  There is so much data, that selecting a subset of it really helps discover new things.

![Data Filter](https://raw.githubusercontent.com/milepore/dataviz-project-proposal/refs/heads/master/images/screens/data-filter.png)]

The data filter is available on all of the various screen.  The filter state persists from screen to screen.  The user can filter on a variety of fields:

* Beer Attriutes
  * ABV
  * Beer Style
  * Beer Style Family (a grouping of various Beer Styles)
* Location Fields:
  * Latitude and Longitude
  * State
  * Country
* And there are some values related to the reviews:
  * Average Review Score
  * Number of Reviews

### Bar Chart

Our combination bar chart and line graph looks like our original sketch.

![Bar Chart](https://raw.githubusercontent.com/milepore/dataviz-project-proposal/refs/heads/master/images/screens/bar-chart.png)]

In addition to filtering, the user can also determine how the bars should be sorted, and how to summarize the data - grouping by various categorical fields, and sorting by numeric fields.

### Parallel Lines

We have a parallel lines view.  In this view, I implmeented the ability for the user to pick which axes to show (in the "Chart Columns", along with selecting how to color the graph.  This really lets the user see a bunch of different things through the view.  Additionally, this view supports brushing of values across all the axes.

![Parallel Lines](https://raw.githubusercontent.com/milepore/dataviz-project-proposal/refs/heads/master/images/screens/parallel-lines.png)]

### Grouped Histogram

While exploring some of the data, I realized that I was pretty interested in seeing the pattern of ratings across a few different categories.  I was thinking "I'd like to see the distribution of ratings across geographies, or maybe across style categories".

![Interwoven Histogram](https://raw.githubusercontent.com/milepore/dataviz-project-proposal/refs/heads/master/images/screens/interwoven-histogram.png)]

In order to do that, I created the Gruoped Histogram view.  This view supports both a stacked histogram as well as multiple histograms.  It also can compute the percentages of beers that are in each of the categories, or the absolute number - with percentages making it easy to compare multiple histograms.

![Separate Histograms](https://raw.githubusercontent.com/milepore/dataviz-project-proposal/refs/heads/master/images/screens/separate-histogram.png)]

This let me answer the question "was there any major difference in distribution of ratings across various factors".  For most of the factors that I've looked at - as long as there are sufficient ratings in a given category - it seems like the answer is "no".  Ratings are pretty much bell-curve distributed across all the categories.

it seems like one exception is the "Light" style category - it seems to have a slightly lower peak, and have more lower ratings instead of mid-to-high ratings.  Otherwise they are all very close.

## Project Progress

This project was developed over a series of weeks.  As I got feedback, I would update things.  As I discovered new things I wanted to try, I would do that.  The journey is below:

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
  * I also documntented how I took a VizHub visualization and adapted it to Vite and React and published in GitHub Pages
    * I documented that process here, without all the other projects incase someone can use it: [https://github.com/milepore/vizhub-to-vite]
* Week 13 - Buffer, tuning, look&feel
  * Fix bug with color legend when we only have one value
  * Make state persist between views (just bring setState up to the parent level)
  * Updated memoization to not redraw map and cities each time we change data
* Week 14 - Buffer / finalize / write paper
  * Last week's exploration made me think that I'd like to really be able to see the distribution of various categories on ratings.  So I created a new view - a multiple histogram view.  This view either allows stacked or unstacked histograms showing the ratings distribution for a given category of beers.  It is really helpful because I can take the same thing I did before and show how ratings are mostly equally distributed no matter what style, country, etc.
    * This required bucketing the histogram while splitting the data, pretty straight forward
    * To compare though, I wanted to use percentage of beers in each one - not absolugte numbers (since that seemed to be more about how many beers, not the distribution)
  * Both of these settings are configurable (stacked/not stacked as well as absolute/percentae)
  * Based on this week's lecture, I thought it would be really cool to add the ability to brush to the map.  Basically select a region and filter by longitude and latitude.  The challenge there is that we already have pan/zoom going on.
    * To handle this, I created an "mode" icon in the lower right of the map that you can toggle to turn on brushing or zooming.
  * I also turned off the hover behavior on the color legend on the map.  It was just too slow.  I think rendering the opacity just made it terrible.  In the future I'd love to see if we could make that better, but for now - in the interest of usability, I've turned it off.

## Attribution

* Icons from Beer by Twitter Emoji on IconScout

