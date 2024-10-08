# Data Visualization Project

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



## Prototypes

I’ve created a proof of concept visualization of this data. It's a ... and it shows ...

[![image](https://user-images.githubusercontent.com/68416/65240758-9ef6c980-daff-11e9-9ffa-e35fc62683d2.png)](https://vizhub.com/curran/eab039ad1765433cb51aad167d9deae4)

(please put a screenshot of one or more visualizations of this dataset you already made, for previous assignments, and link to them)

You can put images into here by pasting them into issues.

You can make images into links like this:

```
[![image](https://user-images.githubusercontent.com/68416/65240758-9ef6c980-daff-11e9-9ffa-e35fc62683d2.png)](https://vizhub.com/curran/eab039ad1765433cb51aad167d9deae4)
```


Also, you can study the [source](https://raw.githubusercontent.com/curran/dataviz-project-template-proposal/master/README.md) to figure out Markdown formatting. You can use the GitHub built-in editor to edit the document.

## Open Questions

(describe any fear, uncertainty, or doubt you’re having about the feasibility of implementing the sketched system. For example, “I’m not sure where to get the geographic shapes to build a map from this data” or “I don’t know how to resolve the codes to meaningful names” … Feel free to delete this section if you’re confident.)

## Milestones

(for each week, estimate what would be accomplised)
