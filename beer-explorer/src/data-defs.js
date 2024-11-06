import * as d3 from "d3";

export const column_defs = {
    index : { type : 'numeric', hidden : true },
    brewery_id : { type : 'numeric', hidden : true },
    beer_abv : { type : 'numeric', hidden : false, description : 'ABV %', filter_type : 'range', range_step : .1, summary : true, colorScale : d3.scaleSequential(d3.interpolateOranges) },
    beer_beerid  : { type : 'numeric', hidden : true },
    lat: { type : 'numeric', hidden : false, description : 'Latitude' },
    lng : { type : 'numeric', hidden : false, description : 'Longitude' },
    review_overall : { type : 'numeric', hidden : false, description : 'Avg Review', filter_type : 'range', range_step : .1, range : [ 0, 5 ], summary : true, colorScale : d3.scaleSequential(d3.interpolateRdYlGn) },
    beer_style_id: { type : 'numeric', hidden : true },
    review_count : { type : 'numeric', hidden : false, filter_type : 'range', range_step : 1, description : 'Number of Reviews', summary : true, colorScale : d3.scaleSequentialPow(d3.interpolatePurples).exponent(.1) },
    family : { type : 'text' , description : 'Style Family', group_by : true, filter_type : 'multi', colorScale : d3.scaleOrdinal(d3.schemePaired) },
    state : { type : 'text', description : 'State',  group_by : true, filter_type : 'multi'},
    country : { type : 'text', description : 'Country',  group_by : true, filter_type : 'multi' },
    beer_style : { type : 'text', description : 'Style',  group_by : true, filter_type : 'multi' },
    brewery_name : { type : 'text', description : 'Brewery Name' },
    beer_name : { type : 'text', description : 'Beer Name' }
}

export function selectColumns(s) {
    var numeric_columns = [];
    for (var column in column_defs) {
        if (s(column_defs[column]))
            numeric_columns.push(column);
    }
    return numeric_columns;
}

export function getNumericColumns() {
    return selectColumns((s) => s.type === "numeric")
}

export function getSelectColumns() {
    return selectColumns((s) => s.filter_type === "multi")
}

export default column_defs;