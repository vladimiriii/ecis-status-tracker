//Practically all this code comes from https://github.com/alangrafu/radar-chart-d3

// Calculate radar chart size
if(screenWidth <= 992){
	var radarSize = 0.5 * screenWidth;
	var factor = 1.05;
	var extraWidth = 200;
} else {
	var radarSize = 0.27 * screenWidth;
	var factor = 1;
	var extraWidth = 200;
};

console.log(radarSize);

// Configuration Options
var w = radarSize;
var h = radarSize;

//Options for the Radar chart, other than default
var mycfg = {
  	w: w,
  	h: h,
	ExtraWidthX: extraWidth
};

// Generate Data
function createRadarData(countryList) {
	var cleanData = [];
	for (i in countryList) {
		var countryData = [];
		for (key in allData) {
			if (!(key=="meta")) {
				if (year in allData[key]) {
					// Standardize Values
					var rawValue = allData[key][year][countryList[i]];
					if (!isNaN(rawValue)){
						var minValue = allData["meta"]["min_value"][key];
						var maxValue = allData["meta"]["max_value"][key];
						var stdValue = (rawValue - minValue)/(maxValue - minValue);
						
					} else {
						var stdValue = 0;
					};
					
					var record = {axis:allData["meta"]["title"][key], value:stdValue};
					countryData.push(record);
				};
			};
		};
		cleanData.push(countryData);
	};
	return cleanData;
};

var RadarChart = {
  	draw: function(id, d, options, countryList){
		var cfg = {
			radius: 4, //The size of the colored circles at each point
			w: 400, //Width of the circle
			h: 400, //Height of the circle
			factor: factor,
			factorLegend: .85,
			levels: 4, //How many levels or inner circles should there be drawn
			maxValue: 0.8, //What is the value that the biggest circle will represent
			radians: 2 * Math.PI,
			opacityArea: 0.5, //The opacity of the area of the blob
			ToRight: 5,
			TranslateX: 80,
			TranslateY: 30,
			ExtraWidthX: 100,
			ExtraWidthY: 100,
			color: countryColors //Colors for series
		};
		
		if('undefined' !== typeof options){
	  		for(var i in options){
				if('undefined' !== typeof options[i]){
		  			cfg[i] = options[i];
				}
	  	  	}
		}

	cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
	var allAxis = (d[0].map(function(i, j){return i.axis}));
	var total = allAxis.length;
	var radius = cfg.factor * Math.min(cfg.w/2, cfg.h/2);
	var labelFormat = d3.format(".0%");
	var tooltipFormat = d3.format(".1%");
	d3.select(id).select("svg").remove();
	
	var g = d3.select(id)
			.append("svg")
			.attr("width", cfg.w+cfg.ExtraWidthX)
			.attr("height", cfg.h+cfg.ExtraWidthY)
			.append("g")
			.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
			;
	
	//Circular segments
	for(var j=0; j<cfg.levels; j++){
	  	var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  	g.selectAll(".levels")
	   		.data(allAxis)
	   		.enter()
	   		.append("svg:line")
	   		.attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
	   		.attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
	   		.attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
	   		.attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
	   		.attr("class", "line")
	   		.style("stroke", "grey")
	   		.style("stroke-opacity", "1")
	   		.style("stroke-width", "1px")
	   		.attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
	}

	//Text indicating at what % each level is
	for(var j=0; j<cfg.levels; j++){
	  	var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  	g.selectAll(".levels")
			.data([1]) //dummy data
			.enter()
			.append("svg:text")
			.attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
			.attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
			.attr("class", "legend")
			.style("font-family", "UnicaOne")
			.style("font-size", "12px")
			.attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
			.attr("fill", "black")
			.text(labelFormat((j+1)*cfg.maxValue/cfg.levels))
			.on('mouseover', function (){
				d3.select(this).style("cursor", "default");
			});
	}
	
	series = 0;
	var axis = g.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	
	// Spokes
	axis.append("line")
		.attr("x1", cfg.w/2)
		.attr("y1", cfg.h/2)
		.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
		.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
		.attr("class", "line")
		.style("stroke", "grey")
		.style("stroke-width", "1px");
	
	// Spoke Labels
	axis.append("text")
		.attr("class", "legend")
		.text(function(d){return d})
		.style("font-family", "UnicaOne")
		.style("font-size", "11px")
		.style("color", "black")
		.attr("text-anchor", "middle")
		.attr("dy", "1.5em")
		.attr("transform", function(d, i){return "translate(0, -10)"})
		.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
		.attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);})
		.on('mouseover', function (){
			d3.select(this).style("cursor", "default");
		});
	
	// Polygons for each series
	var tooltip;
	d.forEach(function(y, x){
		dataValues = [];
	  	g.selectAll(".nodes")
			.data(y, function(j, i){
		  	  	dataValues.push([
					cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
					cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		  	  	]);
			});
			
		dataValues.push(dataValues[0]);
			
		g.selectAll(".area")
			.data([dataValues])
			.enter()
			.append("polygon")
			.attr("class", "radar-chart-serie" + series)
			.style("stroke-width", "2px")
			.style("stroke", cfg["color"][series])
			.attr("points", function(d) {
		 		var str="";
		 	   	for(var pti = 0; pti < d.length; pti++){
					str = str + d[pti][0] + "," + d[pti][1] + " ";
		 	   	}
		 	   	return str;
			})
			.style("fill", function(j, i){return cfg["color"][series]})
			.style("fill-opacity", cfg.opacityArea)
			.on('mouseover', function (d){
				z = "polygon." + d3.select(this).attr("class");
				g.selectAll("polygon")
					.transition(200)
					.style("fill-opacity", 0.1); 
				g.selectAll(z)
					.transition(200)
					.style("fill-opacity", .7);
				
			})
			.on('mouseout', function(){
				tooltip
					.transition(200)
					.style('opacity', 0);
				g.selectAll("polygon")
					.transition(200)
					.style("fill-opacity", cfg.opacityArea);
			});
		series++;
	});
	
	series=0;
	
	d.forEach(function(y, x){
	  	g.selectAll(".nodes")
			.data(y).enter()
			.append("svg:circle")
			.attr("class", "radar-chart-serie"+series)
			.attr('r', cfg.radius)
			.attr("alt", function(j){return Math.max(j.value, 0)})
			.attr("cx", function(j, i){
				dataValues.push([
					cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
					cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
				]);
				return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
			})
			.attr("cy", function(j, i){
				return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
			})
			.attr("data-id", function(j){return j.axis})
			.style("fill", cfg["color"][series]).style("fill-opacity", .9)
			.on('mouseover', function (d){
				newX = parseFloat(d3.select(this).attr('cx')) - 10;
				newY = parseFloat(d3.select(this).attr('cy')) - 5;
				d3.select(this).style("cursor", "pointer");
				// Tooltip
				tooltip
					.attr('x', newX)
					.attr('y', newY)
					.text(function(){
						if(d.value == 0){
							return countryList[x] + ": " + "No Data"
						} else {
							return countryList[x] + ": " + tooltipFormat(d.value)
						}}) // Tooltip text
					.transition(200)
					.style('opacity', 1)
					.style("font-size", "14px")
					
				z = "polygon."+d3.select(this).attr("class");
				g.selectAll("polygon")
					.transition(200)
					.style("fill-opacity", 0.1); 
				g.selectAll(z)
					.transition(200)
					.style("fill-opacity", .7);
			})
			.on('mouseout', function(){
				d3.select(this).style("cursor", "default");
				g.selectAll("polygon")
					.transition(200)
					.style("fill-opacity", cfg.opacityArea);
			})
			.append("svg:title")
			.text(function(j){return Math.max(j.value, 0)});
		series++;
	});
	
	//Tooltip
	tooltip = g.append('text')
		.style('opacity', 0.5)
		.style('font-family', 'UnicaOne')
		.style("font-size", "20px")
		.style("color", "black")
		.style("text-anchor", "middle");
			   
	}
};