import {BaseChart} from './basechart.js';

export class BarChart extends BaseChart {
    constructor (data, filter_col, agg_col, svg) {
        super(data, filter_col, agg_col, svg)
        this.g = this.main_svg.append("g")
        this.chart_height = 300
        this.chart_width = 600
    }

    add_Xscale() {
        var xScale = d3.scaleBand()
                .domain(this.converted_susbet.map(d => d.index))
                .range([0, this.chart_width]).padding(0.2);

        this.g.append("text")
                .attr("x", 350)
                .attr("y", 580)
                .attr("fill", "black")
                .text("Crime Type");

        this.g.append("g")
              .call(d3.axisBottom(xScale))
              .attr("transform", "translate(100, 400)")
              .selectAll("text")
              .attr("x", -90)
              .attr("y", 0)
              .attr("transform", "rotate(-90)");

        return xScale
    }

    add_Yscale () {
        var yScale = d3.scaleLinear()
                .domain([0, d3.max(this.converted_susbet.map(d => d.value))]).nice()
                .range([this.chart_height, 0]);

        this.g.append("g")
            .call(d3.axisLeft(yScale).ticks(25))
            .attr("transform", "translate(100, 100)");
        
        this.g.append("text")
            .attr("x", -260)
            .attr("y", 50)
            .attr("transform", "rotate(-90)")
            .text("Count");

        return yScale
    }

    add_data(feature) {
        var community_no = feature.area_num_1
        
        this.main_svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 100)
        .attr("y", 20)
        .attr("font-size", "24px")
        .text("Crimes between 2017-2022 for " + feature.community.toProperCase())

        var subset = this.generate_subset(community_no)
        var subset_value_count = this.get_value_count(subset)
        this.converted_susbet = this.convert_datatype(subset_value_count)

        this.converted_susbet.sort(function(a, b) {
            var textA = a.index.toUpperCase();
            var textB = b.index.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        // console.log(this.converted_susbet)
        
        this.xScale = this.add_Xscale()
        this.yScale = this.add_Yscale()

        var xs = this.xScale
        var ys = this.yScale

        var height = this.chart_height
        const bars = this.g.selectAll(".bar")
                      .data(this.converted_susbet)
                      .enter().append("rect")
                      .attr("class", "bar")
                      .attr("fill", "blue")
                      .attr("x", function(d) { return xs(d.index) + 100})
                      .attr("y", function(d) { return ys(d.value) + 100})
                      .attr("width", xs.bandwidth())
                      .attr("height", function(d) { return height - ys(d.value);});
    }
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};