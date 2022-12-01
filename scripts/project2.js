var crimes_data = gun_crimes;
var chicago_communities = communityData;
let filtered_communities = [];
let selected_years = []
let final_user_selected_params;
let filtered_data_value_counts;

var chicago_communities_coords = [chicago_communities.features.map(d => d.geometry.coordinates[0][0])][0]

const crimes_year_data = crimes_data.filter(crime => crime.Year == 2001)
const data_2001 = get_value_counts(crimes_year_data)
const data_2001_conv = convert_dtype(data_2001)

function get_value_counts(crimes_year_data) {
    var crimes_total = d3.rollup(crimes_year_data, group => group.length, d => d["Community Area"]);
    crimes_year_data = Object.fromEntries(crimes_total);
  
    return crimes_year_data
}

function convert_dtype (data) {
    var Arr = []
    for (let [index, val] of Object.entries(data)) {
      Arr.push({"community":index, "crime_total": val})    
  }
    return Arr
}

function barChart() {
    const margin = {top: 50, right: 10, bottom: 40, left: 10};
    const chart_width = 1000
    const chart_height = 300
    
    const svg = d3.selectAll('#gunviolence')
      .append('svg')
      .attr('width', chart_width + margin.left + margin.right)
      .attr('height', chart_height + margin.top + margin.bottom)
    
    svg.append("text")
      .attr("transform", "translate(100,0)")
      .attr("x", 240)
      .attr("y", 20)
      .attr("font-size", "24px")
      .text("Crimes across Chicago according to communities")
  
    const g = svg.append("g")
    
    var xScale = d3.scaleBand()
      .domain(data_2001_conv.map(d => d.community))
      .range([0, chart_width]).padding(0.2);
  
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(data_2001_conv.map(d => d.crime_total))]).nice()
      .range([chart_height, 0]);
    
    g.append("g")
      .call(d3.axisBottom(xScale))
      .attr("transform", `translate(${50}, ${340})`);
      
    g.append("text")
      .attr("x", 500)
      .attr("y", 380)
      .attr("fill", "black")
      .text("Community Number");
  
    g.append("g")
      .call(d3.axisLeft(yScale).ticks(25))
      .attr("transform", `translate(${50}, ${40})`)
           
    g.append("text")
      .attr("x", -260)
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .text("Total Crimes in 2001");
  
    const bars = g.selectAll(".bar")
      .data(data_2001_conv)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("fill", "blue")
      .attr("x", function(d) { return xScale(d.community) + 50})
      .attr("y", function(d) { return yScale(d.crime_total) + 40; })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return chart_height - yScale(d.crime_total);});
  
    const brush = d3.brushX()
      .extent([[50, 200], [chart_width + 50, 320]])
      .on('brush', onBrush)
      .on('end', get_sel_params)
  
    g.append("g")
      .call(brush);
  
    function onBrush(event) {
      const s0 = event.selection ? event.selection : [1, 2].fill(event.sourceEvent.offsetX),
          d0 = filteredDomain(xScale, ...s0);
      filtered_communities.push(d0)
  
      d3.selectAll('.bar')
      .attr('opacity', d => d0.includes(d.community) ? 1 : 0.2);
    }
  
    function filteredDomain (scale, min, max) {
          let dif = scale(d3.min(scale.domain())) - scale.range()[0],
              iMin = (min - dif) < 0 ? 0 : Math.round((min - dif)/xScale.step()),
              iMax = Math.round((max - dif)/xScale.step());
          if (iMax == iMin) --iMin;
          return scale.domain().slice(iMin-3, iMax-3)
        }
}

function subset_barChart(data) {
  const data_conv = convert_dtype(data)
  
  const margin = {top: 50, right: 100, bottom: 40, left: 50};
  const chart_width = 500
  const chart_height = 350
  
  const svg = d3.create('svg')
    .attr('width', chart_width + margin.left + margin.right)
    .attr('height', chart_height + margin.top + margin.bottom)
  
  const g = svg.append("g")
  
  var xScale = d3.scaleBand()
    .domain(data_conv.map(d => d.community))
    .range([0, chart_width]).padding(0.2);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data_conv.map(d => d.crime_total))]).nice()
    .range([chart_height, 0]);
  
  g.append("g")
    .call(d3.axisBottom(xScale))
    .attr("transform", `translate(${50}, ${390})`);
    
  g.append("text")
    .attr("x", 250)
    .attr("y", 430)
    .attr("fill", "black")
    .text("Community Number");

  g.append("g")
    .call(d3.axisLeft(yScale).ticks(25))
    .attr("transform", `translate(${50}, ${40})`)
         
  g.append("text")
    .attr("x", -260)
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .text("Total Crimes");

  const bars = g.selectAll(".bar")
    .data(data_conv)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("fill", "blue")
    .attr("x", function(d) { return xScale(d.community) + 50})
    .attr("y", function(d) { return yScale(d.crime_total) + 40; })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return chart_height - yScale(d.crime_total);});
}

function draw_multibargraphs() {
  const chart_width = 1200
  const chart_height = 800
  const margin = {top: 50, right: 100, bottom: 50, left: 50};

  const svg_main = d3.create("svg")
    .attr('width', chart_width + margin.left + margin.right)
    .attr('height', chart_height + margin.top + margin.bottom)

  const year1 = svg_main.append("svg")
    year1.node().appendChild(subset_barChart(filtered_data_value_counts[0]))

  const year2 = svg_main.append("svg")
    year2.attr("x", 600)
    year2.node().appendChild(subset_barChart(filtered_data_value_counts[1]))

  const year3 = svg_main.append("svg")
    year3.attr("y", 450)
    year3.node().appendChild(subset_barChart(filtered_data_value_counts[2]))

  const year4 = svg_main.append("svg")
    year4.attr("x", 600)
    year4.attr("y", 450)
    year4.node().appendChild(subset_barChart(filtered_data_value_counts[3]))
}

function get_sel_params() {
  final_communities = filtered_communities.at(-1).map((x) =>parseInt(x))

  yr1 = document.getElementById("year1")
  yr2 = document.getElementById("year2")
  yr3 = document.getElementById("year3")
  yr4 = document.getElementById("year4")
  
  yr1 = yr1.options[yr1.selectedIndex].text;
  yr2 = yr2.options[yr2.selectedIndex].text;
  yr3 = yr3.options[yr3.selectedIndex].text;
  yr4 = yr4.options[yr4.selectedIndex].text;

  selected_years.push(yr1)
  selected_years.push(yr2)
  selected_years.push(yr3)
  selected_years.push(yr4)

  console.log(final_communities)
  console.log(selected_years)
  final_user_selected_params = [final_communities, selected_years]
}

function get_final_comm_count() {
  var arr = []
  for (let i = 0; i<final_user_selected_params[1].length; i++) {
    var filter_data_1 = crimes_data.filter(d => d.Year == final_user_selected_params[1][i])
    var filter_data_2 = filter_data_1.filter(d => final_user_selected_params[0].includes(d["Community Area"]))
    var count = get_value_counts(filter_data_2)
    arr.push(count)
  }
  return arr
}

export function create_visualtizations_3() {
    barChart()
}