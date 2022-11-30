import {BaseChart} from './basechart.js';


export class LineChart extends BaseChart {
    constructor (data, filter_col, agg_col, svg) {
        super(data, filter_col, agg_col, svg)
        this.chart_height = 300
        this.chart_width = 600
        this.max_y = 0;
        this.subset_list = [];
        this.g = this.main_svg.append("g")
                    .attr('transform', 'translate(+100, +50)')
    }

    add_Xscale() {
        var xScale = d3.scaleBand()
                .domain(this.converted_subset.map(d => d.index))
                .range([0, this.chart_width]);

        this.g.append("g")
              .call(d3.axisBottom(xScale))
              .attr("transform", "translate(0, 300)")
              .selectAll("text")
              .attr("x", -90)
              .attr("y", 0)
              .attr("transform", "rotate(-90)");

        this.g.append("text")
              .attr("x", 250)
              .attr("y", 500)
              .attr("fill", "black")
              .text("Crime Type");

        return xScale
    }

    add_Yscale () {
        var yScale = d3.scaleLinear()
                .domain([0, this.max_y]).nice()
                .range([this.chart_height, 0]);

        this.g.append("g")
            .call(d3.axisLeft(yScale).ticks(25))
        
        this.g.append("text")
            .attr("x", -150)
            .attr("y", -50)
            .attr("transform", "rotate(-90)")
            .text("Count");
        
        return yScale
    }

    add_cScale(history) {
        history = Array.from(history);
        history = history.map(d => d.community);

        var myColor = d3.scaleOrdinal().domain(history)
            .range(d3.schemeSet3);
        return myColor
    }

    add_data(history) {
        for (const feature of history) {
            // console.log(feature)
            var subset = this.generate_subset(feature.area_num_1)
            var subset_value_count = this.get_value_count(subset)
            // console.log(subset_value_count)
            this.converted_subset = this.convert_datatype(subset_value_count)

            this.converted_subset.sort(function(a, b) {
                var textA = a.index.toUpperCase();
                var textB = b.index.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });

            console.log(this.converted_subset)

            this.subset_list.push(this.converted_subset)
            var current_max = d3.max(this.converted_subset.map(d => d.value))

            if (this.max_y < current_max) {
                this.max_y = current_max
            }
        }

        this.xScale = this.add_Xscale()
        this.yScale = this.add_Yscale()
        this.cScale = this.add_cScale(history)

        this.main_svg.append("text")
                    .attr("transform", "translate(100,0)")
                    .attr("x", 0)
                    .attr("y", 20)
                    .attr("font-size", "24px")
                    .text("Variation of crime across user selected communities for 2017-2022")

        var curve = d3.curveLinear

        for (let j = 0; j < this.subset_list.length; j++) {
            const line = d3.line()
                        .defined(i => this.subset_list[j][i])
                        .curve(curve)
                        .x(i => this.xScale(this.subset_list[j].map(d => d.index)[i]) + 37)
                        .y(i => this.yScale(this.subset_list[j].map(d => d.value)[i]));

            history = Array.from(history);
            console.log(history[j])
            this.g.append("path")
                .attr("fill", "none")
                .attr("stroke", this.cScale(history[j].community))
                .attr("stroke-width", 1.5)
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("stroke-opacity", 1)
                .attr("d", line(d3.range(this.subset_list[j].map(d => d.index).length)));
        }

        this.g.append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(650, 50)");

        var legend = d3.legendColor()
            .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
            .shapePadding(10)
            .scale(this.cScale);

        this.g.select(".legendOrdinal")
            .call(legend);
        
    }
}