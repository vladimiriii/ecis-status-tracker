// Modal Functionality
// Set Chart Width and Chart Height
var chartHeight = null;
var chartWidth = null;
if(screenWidth <= 992){
	chartWidth = 0.95 * screenWidth;
	chartHeight = 0.5 * chartWidth;
} else {
	chartWidth = 0.45 * screenWidth;
	chartHeight = 0.5 * chartWidth;
};

// Column Chart
function drawModalColumn(div, country){
	var yAxis = ecoData['meta']['y_axis'][eco_ind_num];
	var yAxisMax = ecoData['meta']['y_axis_max'][eco_ind_num];
	var yAxisMin = ecoData['meta']['y_axis_min'][eco_ind_num];
	var prefix = ecoData['meta']['prefix'][eco_ind_num];
	var suffix = ecoData['meta']['suffix'][eco_ind_num];
	var title = ecoData['meta']['title'][eco_ind_num];
	var rounding = (isNaN(ecoData['meta']['rounding'][eco_ind_num]) ? 0 : ecoData['meta']['rounding'][eco_ind_num]);
	var background = bg_color;
	//var rounding = 0;
	
	// Extract and format data
	var refinedData = ecoData[eco_ind_num][year];
	
	// Sort keys by value
	var sortedKeys = Object.keys(refinedData).sort(function(a,b){
	    if(!isFinite(refinedData[b]-refinedData[a])) 
	         return !isFinite(refinedData[a]) ? 1 : -1;
	      else
	         return refinedData[b]-refinedData[a]
	  });
	 
	// Create Data Series
	var data = [];
	var categories = [];
	var colors = [];
	for (ctry in sortedKeys) {
		var dataPoint = ((refinedData[sortedKeys[ctry]] == 0) ? NaN : refinedData[sortedKeys[ctry]]);
		data.push(Number(Number(dataPoint).toFixed(rounding)));
		categories.push(sortedKeys[ctry]);
		if (sortedKeys[ctry] == country) {
			colors.push("#e87680");
		} else {
			colors.push("#7c87ff");
		};
	};
	
	var series = [];
	series.push({name: title, data: data, animation: {
            duration: 0
        }});

	// Feed Data to Chart
	$('#' + div).highcharts({
		chart: {
			type: 'column',
			backgroundColor: background, // Background color
            style: {
                fontFamily: 'CustomFont',
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
			},
			max: yAxisMax,
			min: yAxisMin
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
			valuePrefix: prefix,
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

// Indicator Line Chart
function drawModalLine(div, country){
	var yAxis = allData['meta']['y_axis'][ind_num];
	var background = bg_color;
	var rounding = 2; //allData['meta']['rounding'][tab];
	
	// Get Suffixes and Prefixes
	var prefix = allData['meta']['prefix'][ind_num];
	var suffix = allData['meta']['suffix'][ind_num];
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
		
	for (keyOne in allData[ind_num]){
		var entry = {};
		var values = [];
		var colName = 'line_color_';
		var seriesName = country;
		var xAxis = [];
		colName = colName.concat(i);
	
		indices[keyOne] = allData[ind_num][keyOne][country];

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
                fontFamily: "CustomFont"
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
		series: data,
	});
}

// Eco Indicator Line Chart
function drawModalEcoLine(div, country){
	var yAxis = ecoData['meta']['y_axis'][eco_ind_num];
	var background = bg_color;
	var rounding = ecoData['meta']['rounding'][eco_ind_num];
	
	// Get Suffixes and Prefixes
	var prefix = ecoData['meta']['prefix'][eco_ind_num];
	var suffix = ecoData['meta']['suffix'][eco_ind_num];
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
	var entry = {};
	var values = [];
	
	for (keyOne in ecoData[eco_ind_num]){
		var colName = 'line_color_';
		var seriesName = country;
		var xAxis = [];
		colName = colName.concat(i);
	
		indices[keyOne] = ecoData[eco_ind_num][keyOne][country];
		
		// Ensure keys are sorted correctly
	    var keys = [];
	    var k, j, len;	
	  	for (k in indices) {
	    	if (indices.hasOwnProperty(k)) {
				keys.push(k);
	    	};
		};
		
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
	entry['color'] = "#7c87ff";
	data.push(entry);
	
	$('#' + div).highcharts({
		title: {
			text: "", // Chart text from meta data
			x: 0 //center
		},
        chart: {
			backgroundColor: background, // Background color
            style: {
                fontFamily: "CustomFont"
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
		series: data,
	});
}