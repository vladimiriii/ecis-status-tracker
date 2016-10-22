// Modal Functionality
// Column Chart
function drawModalColumn(div, indicator, country, year){
	var ecoData = getEcoData();
	
	var yAxis = ecoData['meta']['y_axis'][indicator];
	var suffix = ecoData['meta']['suffix'][indicator];
	var title = ecoData['meta']['title'][indicator];
	var background = bg_color;
	var rounding = 2;
	
	// Extract and format data
	ecoData = ecoData[indicator][year];
	var sortedKeys = Object.keys(ecoData).sort(function(a,b){return ecoData[b]-ecoData[a]});
	
	var data = [];
	var categories = [];
	var colors = [];
	for (ctry in sortedKeys) {
		data.push(ecoData[sortedKeys[ctry]]);
		categories.push(sortedKeys[ctry]);
		if (sortedKeys[ctry] == country) {
			colors.push("#e87680");
		} else {
			colors.push("#7c87ff");
		};
	};
	
	var series = [];
	series.push({name: title, data: data});

	// Feed Data to Chart
	$('#' + div).highcharts({
		chart: {
			type: 'column',
			backgroundColor: background, // Background color
            style: {
                fontFamily: 'UnicaOne',
            },
			height: chartHeight,
			width: chartWidth	
		},
		title: {
			text: ""
		},
		xAxis: {
			categories: categories,
			labels: {
				style: {
					color: "black"		
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
		plotOptions: {
            column: {
                colorByPoint: true
            }
        },
		colors: colors,
		legend: {
			enabled: false
		},
		tooltip: {
			headerFormat: '<b>{point.x}</b><br/>',
			shared: true,
			valueSuffix: suffix
		},
		/*plotOptions: {
			column: {
				color: "#e87680"
			}
		},*/
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
            },
			className: 'modalLine',
			height: chartHeight,
			width: chartWidth
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