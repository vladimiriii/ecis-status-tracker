// Modal Functionality

// Radar Chart


// Bar Chart
function drawModalBar(div, tab, country, year){
	var yAxis = allData['meta']['y_axis'][tab];
	var categories = [country, "ECIS Average", "EU Average"];
	var background = bg_color;
	var rounding = 2;
	
	// Get Maximums and Minimums
	var min = allData['meta']['max_value'][tab];
	var max = allData['meta']['min_value'][tab];
	var minEcis = min;
	var minEu = min;
	var minCtry = min;
	var maxEcis = max;
	var maxEu = max;
	var maxCtry = max; 
	
	for (var yr in allData[tab]){
		var yearData = allData[tab][yr];
		if (i > 0){
			// Min
			if (yearData["ECIS Average"] < minEcis){minEcis = yearData["ECIS Average"]};
			if (yearData["EU Average"] < minEu){minEu = yearData["EU Average"]};
			if (yearData[country] < minCtry){minCtry = yearData[country]};
			
			//Max
			if (yearData["ECIS Average"] > maxEcis){maxEcis = yearData["ECIS Average"]};
			if (yearData["EU Average"] > maxEu){maxEu = yearData["EU Average"]};
			if (yearData[country] > maxCtry){maxCtry = yearData[country]};
		};
		
	};
	
	// Round results
	var minEcis = Number(Number(minEcis).toFixed(rounding));
	var minEu = Number(Number(minEu).toFixed(rounding));
	var minCtry = Number(Number(minCtry).toFixed(rounding));
	var maxEcis = Number(Number(maxEcis).toFixed(rounding));
	var maxEu = Number(Number(maxEu).toFixed(rounding));
	var maxCtry = Number(Number(maxCtry).toFixed(rounding));
	
	// Get data for selected year
	var curEcis = Number(Number(allData[tab][year]["ECIS Average"]).toFixed(rounding));
	var curEu = Number(Number(allData[tab][year]["EU Average"]).toFixed(rounding));
	var curCtry = Number(Number(allData[tab][year][country]).toFixed(rounding));
	
	// Build dataset
	var series = [];
	series.push({name: year, data: [curCtry, curEcis, curEu], color: countryColors[0]});
	series.push({name: 'Minimum', data: [minCtry, minEcis, minEu], color: countryColors[1]});
	series.push({name: 'Maximum', data: [maxCtry, maxEcis, maxEu], color: countryColors[2]});

	// Feed Data to Chart
	$('#' + div).highcharts({
		chart: {
			type: 'bar',
			backgroundColor: background, // Background color
            style: {
                fontFamily: 'UnicaOne',
            }	
		},
		title: {
			text: ""
		},
		xAxis: {
			categories: categories,
			labels: {
				style: {
					color: lineColor			
				}
			}
		},
		yAxis: {
			title: {
				text: yAxis,
				style: {
					color: lineColor			
				}
			},
			labels: {
				style: {
					color: lineColor			
				}
			}
		},
		legend: {
			layout: 'horizontal',
			verticalAlign: 'bottom',
			itemStyle: {
				color: lineColor
			}
		},
		tooltip: {
			headerFormat: '<b>{point.x}</b><br/>',
			shared: true,
			valueSuffix: '%'
		},
		plotOptions: {
			bar: {
	                dataLabels: {
	                    enabled: true,
						style: {
							color: lineColor
						}
	                }
	            }
		},
		series: series
	});
};

// Line Chart
function drawModalLine(div, tab, country){
	var yAxis = allData['meta']['y_axis'][tab];
	var background = bg_color;
	var rounding = 2; //allData['meta']['rounding'][tab];
	
	// Get Suffixes and Prefixes
	var prefix = allData['meta']['prefix'][tab];
	var suffix = allData['meta']['suffix'][tab];
	if (prefix == '_'){
		prefix = '';
	}
	if (suffix == '_'){
		suffix = '';
	}
	
	// Get values for charts
	var data = [];
	var lineColors = [];
	var i = 1;
	var indices = {};
		
	for (keyOne in allData[tab]){
		var entry = {};
		var values = [];
		var colName = 'line_color_';
		var seriesName = country;
		var xAxis = [];
		colName = colName.concat(i);
	
		indices[keyOne] = allData[tab][keyOne][country];

		// Ensure keys are sorted correctly
	    var keys = [];
	    var k, j, len;	
	  	for (k in indices) {
	    	if (indices.hasOwnProperty(k)) {
				keys.push(k);
	    	}
		}
		
		keys.sort();
		len = keys.length;
	};
		
	// Cycle through keys in order
	for (j = 0; j < len; j++) {
	  	k = keys[j];
		value = Number(Number(indices[k]).toFixed(rounding));	
		values.push(value);
		xAxis.push(k);
	};
	
	// Get meta data
	entry['name'] = seriesName;
	entry['data'] = values;
	entry['color'] = "#e87680";
	data.push(entry);
	
	$('#' + div).highcharts({
		title: {
			text: "", // Chart text from meta data
			x: 0 //center
		},
        chart: {
			backgroundColor: background, // Background color
            style: {
                fontFamily: "UnicaOne"
            }
        },
		xAxis: {
			lineColor: lineColor,
			tickColor: lineColor,
			categories: xAxis, // list of index values
			labels: {
				style: {
					color: lineColor
				}
			}
		},
		yAxis: {
			title: {
				text: yAxis,
				style: {
					color: lineColor
				}
			},
			labels: {
				style: {
					color: lineColor
				}
			},
			gridLineColor: lineColor,
			gridLineDashStyle: 'ShortDot',
			plotLines: [{
				value: 0,
				width: 1,
			}]
		},
		tooltip: {
			valuePrefix: prefix,
			valueSuffix: suffix
		},
		legend: {
			enabled: false
		},
		series: data
	});
}