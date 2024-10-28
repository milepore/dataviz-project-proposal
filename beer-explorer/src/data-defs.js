
export const column_defs = {
    index : { type : 'numeric', hidden : true },
    brewery_id : { type : 'numeric', hidden : true },
    beer_abv : { type : 'numeric', hidden : false, description : 'ABV %', summary : true },
    beer_beerid  : { type : 'numeric', hidden : true },
    lat: { type : 'numeric', hidden : false, description : 'Latitude' },
    lng : { type : 'numeric', hidden : false, description : 'Longitude' },
    review_overall : { type : 'numeric', hidden : false, description : 'Avg Review', range : [ 0, 5 ], summary : true },
    beer_style_id: { type : 'numeric', hidden : true },
    review_count : { type : 'numeric', hidden : false, description : 'Number of Reviews', summary : true },
    family : { type : 'text' , description : 'Style Family', group_by : true },
    state : { type : 'text', description : 'State',  group_by : true, filter_type : 'multi'},
    country : { type : 'text', description : 'Country',  group_by : true, filter_type : 'multi' },
    beer_style : { type : 'text', description : 'Style',  group_by : true, filter_type : 'multi' },
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
    return selectColumns((s) => s.type == "numeric")
}

export function getSelectColumns() {
    return selectColumns((s) => s.filter_type == "multi")
}