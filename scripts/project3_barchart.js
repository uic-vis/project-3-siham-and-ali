import {log, logTail} from '@sorig/console-log-without-leaving-your-notebook'

crimes_data = FileAttachment("Crimes@2.json").json()
chicago_communities = FileAttachment("Chicago Communities@1.geojson").json()
chicago_communities_coords = [chicago_communities.features.map(d => d.geometry.coordinates[0][0])][0]

data_2001 = {
  const crimes_year_data = crimes_data.filter(crime => crime.Year == 2001)
  const data_2001 = get_value_counts(crimes_year_data)
  return data_2001
}
data_2001_conv = convert_dtype(data_2001)

cScale = d3.scaleSequential(d3.interpolateYlOrRd).domain(d3.extent(Object.values(data_2001)));
filtered_communities = []
ranged_data = generate_minmax_data(2001, 2022)


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
  const margin = {top: 50, right: 100, bottom: 40, left: 50};
  const chart_width = 1100
  const chart_height = 300
  
  const svg = d3.create('svg')
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
    // .on('end', endBrush)

  g.append("g")
    .call(brush);

  function onBrush(event) {
    const s0 = event.selection ? event.selection : [1, 2].fill(event.sourceEvent.offsetX),
        d0 = filteredDomain(xScale, ...s0);
    filtered_communities.push(d0)
    // console.log(d0)

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

  return svg.node()
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

  return svg.node()
}

function generate_minmax_data(start, end) {
  var min_data = []
  var max_data = []
  for (let i = 0; i<chicago_communities.features.length; i++) {
    var crime_community = crimes_data.filter(crime => crime["Community Area"] == (i+1))
    var crimesCount_year = d3.rollup(crime_community, group => group.length, d => d["Year"]);

    const arr = Array.from(crimesCount_year, item => ({[item[0]]: item[1]}))
    crimesCount_year = Object.assign({}, ...arr);
    
    const max_val = d3.max(Object.values(crimesCount_year))
    const max_year = Object.keys(crimesCount_year).find(key => crimesCount_year[key] === max_val)
    const obj_max = {"max_year": max_year, "max_val": max_val, "community":i+1}
    
    const min_val = d3.min(Object.values(crimesCount_year))
    const min_year = Object.keys(crimesCount_year).find(key => crimesCount_year[key] === min_val)
    const obj_min = {"min_year": min_year, "min_val": min_val, "community":i+1}
    
    min_data.push(obj_min)
    max_data.push(obj_max)
  }
  return [min_data, max_data]
}

function ranged_bargraph() {
  
  const margin = {top: 50, right: 100, bottom: 40, left: 50};
  const chart_width = 1100
  const chart_height = 700
  
  const svg = d3.create('svg')
    .attr('width', chart_width + margin.left + margin.right)
    .attr('height', chart_height + margin.top + margin.bottom)
  
  const g = svg.append("g")
  
  var xScale = d3.scaleBand()
    .domain(ranged_data[1].map(d => d.community))
    .range([0, chart_width]).padding(0.2);

  var yScale = d3.scaleLinear()
    .domain([0, 700]).nice()
    .range([chart_height, 0]);
  
  g.append("g")
    .call(d3.axisBottom(xScale))
    .attr("transform", `translate(${50}, ${740})`);
    
  g.append("text")
    .attr("x", 550)
    .attr("y", 780)
    .attr("fill", "black")
    .text("Community Number");

  g.append("g")
    .call(d3.axisLeft(yScale).ticks(25))
    .attr("transform", `translate(${50}, ${40})`)
         
  g.append("text")
    .attr("x", -370)
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .text("Total Crimes");

  const bars_max = g.selectAll(".bar")
    .data(ranged_data[1])
    .enter().append("rect")
    .attr("class", "bar")
    .attr("fill", "red")
    .attr("x", function(d) { return xScale(d.community) + 50})
    .attr("y", function(d) { return yScale(d.max_val) + 40; })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return chart_height - yScale(d.max_val);})
    // .text((d) => `Year: ${d.max_year}, Crime Total: ${d.max_val}`);
  
  const g1 = svg.append("g")

  const bars_min = g1.selectAll(".bar")
    .data(ranged_data[0])
    .enter().append("rect")
    .attr("class", "bar")
    .attr("fill", "blue")
    .attr("x", function(d) { return xScale(d.community) + 50})
    .attr("y", function(d) { return yScale(d.min_val) + 40; })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return chart_height - yScale(d.min_val);})
    // .text(d => `Year: ${d.min_year}, Crime Total: ${d.min_val}`);
  
  return svg.node()
}
