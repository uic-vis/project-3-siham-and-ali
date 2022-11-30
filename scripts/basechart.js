export class BaseChart {
    constructor (data, filter_col, agg_col, svg=null) {
        this.plot_data = data;
        this.filter_col = filter_col;
        this.agg_col = agg_col;
        this.main_svg = svg;
        }
    
    generate_subset(value) {
        const subset_data = this.plot_data.filter(crime => crime[this.filter_col] == value)
        return subset_data
    }

    get_value_count(subset) {
        var value_count_set = d3.rollup(subset, group => group.length, d => d[this.agg_col]);
        return Object.fromEntries(value_count_set);
    }
    
    convert_datatype(subset) {
        var Arr = []
        for (let [index, val] of Object.entries(subset)) {
            Arr.push({"index":index, "value": val})    
        }
        return Arr
    }

    add_Xscale() {}

    add_Yscale() {}
    
    add_data() {}
}
