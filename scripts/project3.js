import total_crimes_data from "../Total.json" assert {type: 'json'};

let sel_month;
let sel_year;
let cScale;

export function create_visualtizations_2() {
    var map = L.map('chicago-map-2', {minZoom: 10, maxZoom: 19, layers: []})
               .setView([41.8338, -87.7327], 10);
    
    var community = L.map('single-community-zoom', {minZoom: 10, maxZoom: 19})
    
    var base_layer = L.geoJson(communityData, {style: {
                fillColor: "white",
                fillOpacity: 1.0,
                weight: 0.5,
                color: "black",
            }, onEachFeature: selection}).addTo(map);
    
    var selected_com = L.layerGroup().addTo(community)

    function selection(feature, layer) {
        layer.on({
            mouseover: highlight_community,
            mouseout: reset_highlight,
            click: update_single_community,
        });}
    
    function highlight_community(feature) {
        var layer = feature.target;
        layer.setStyle({fillColor:"blue", fillOpacity: 0.6, weight: 0.5});
        }

    function reset_highlight(feature) {
        var layer = feature.target;

        layer.setStyle({
            fillColor: "white",
            fillOpacity: 1.0,
            color: "black",
            weight: 0.5
        })}
    
    function update_single_community(feature) {
        sel_month = document.getElementById("months")
        sel_year = document.getElementById("years")

        sel_month = sel_month.options[sel_month.selectedIndex].text;
        sel_year = sel_year.options[sel_year.selectedIndex].text;

        selected_com.clearLayers()

        community.setView([feature.latlng.lat, feature.latlng.lng], 13);
        
        var sel_layer = L.geoJson(feature.target.feature, {style: {
            fillColor: "white",
            fillOpacity: 1.0,
            weight: 0.5,
            color: "black",
        }});

        selected_com.addLayer(sel_layer)

        var community_no = feature.target.feature.properties.area_num_1
        
        if (sel_month == "---Choose a Month---") {
            sel_month = null;
        }

        if (sel_year == "---Choose a year---") {
            sel_year = null;
        }
        
        var subset = generate_data_subset(community_no, sel_month, sel_year)
        var school_subset = generate_school_subset(feature.target)

        cScale = generate_cScale(subset)
        add_data(subset, school_subset)
    }

    function generate_data_subset(comm, month, year) {
        var sub = total_crimes_data.filter(crime => crime["Community Area"] == comm)

        if (month != null) {
            sub = sub.filter(crime => crime["Month"] == month)
        }
        if (year != null) {
            sub = sub.filter(crime => crime["Year"] == year)
        }
        return sub
    }

    function generate_school_subset(feature) {

        var polygon_points = feature.feature.geometry.coordinates[0][0]
        var hull = d3.polygonHull(polygon_points);

        var schools_subset = []

        for (const point of schools.features){
            var test_point = point.geometry.coordinates
            if (d3.polygonContains(hull, test_point)) {
                schools_subset.push(point)
            }
        }

        return schools_subset
    }

    function generate_cScale(subset) {
        subset = subset.map(d => d["Primary Type"]);

        var myColor = d3.scaleOrdinal().domain(subset)
            .range(d3.schemeSet3);
        return myColor
    }

    function add_data(subset, school_subset) {
        var colors_set_list = new Set()
        for (const row of subset) {
            colors_set_list.add(cScale(row["Primary Type"]))

            var circle = L.circle([row.Latitude, row.Longitude], {
                color: cScale(row["Primary Type"]),
                fillColor: '#f03',
                fillOpacity: 1.0,
                radius: 15
            });
            selected_com.addLayer(circle)
        }

        var school_layer = L.geoJson(school_subset, {style: {
                            fillColor: "brown",
                            fillOpacity: 1.0,
                            weight: 0.5,
                            color: "black"}, onEachFeature: tooltip})
        selected_com.addLayer(school_layer)

        var legend = L.control({ position: "topright" });

        legend.onAdd = function(community) {
            var div = L.DomUtil.create("div", "legend");
            div.innerHTML += "<h4>Legend</h4>";
            div.innerHTML += '<i style="background: ' + Array.from(colors_set_list)[0] +'">' + '</i><span>Theft</span><br>'
            div.innerHTML += '<i style="background: ' + Array.from(colors_set_list)[1] +'">' + '</i><span>Narcotics</span><br>'
            div.innerHTML += '<i style="background: ' + Array.from(colors_set_list)[2] +'">' + '</i><span>Weapons</span><br>'
            div.innerHTML += '<i style="background: ' + Array.from(colors_set_list)[3] +'">' + '</i><span>Kidnapping</span><br>'
            div.innerHTML += '<i style="background: ' + Array.from(colors_set_list)[4] +'">' + '</i><span>Sexual Assault</span><br>'
            return div;
          };
          
          legend.addTo(community);
    }

    function tooltip(feature, layer) {
        layer.on({
            mouseover: add_tooltip,
            mouseout: remove_tooltip
        });
    }

    function add_tooltip(feature) {
        var layer = feature.target;
        layer.bindPopup("School Name:" + layer.feature.properties.long_name + '<br />')
            .openPopup();
    }

    function remove_tooltip(feature) {
        var layer = feature.target;
        layer.closePopup();
    }
}
