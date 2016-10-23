// Line Chart specific functions //
var lineColor = '#000000';

function drawLineChart(div, countries){
	var chartTitle = allData['meta']['title'][ind_num];
	var yAxis = allData['meta']['y_axis'][ind_num];
	var background = bg_color;
	var rounding = 2; //allData['meta']['rounding'][tab];
	var legend = false;
	
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
	var i = 1;
	
	for (country in countries){
		var indices = {};
		
		for (keyOne in allData[ind_num]){
			var entry = {};
			var values = [];
			var colName = 'line_color_';
			var seriesName = countries[country];
			var xAxis = [];
			colName = colName.concat(i);
		
			indices[keyOne] = allData[ind_num][keyOne][countries[country]];

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
		entry['color'] = countryColors[country];
		data.push(entry);
		
		// Check if Legend is needed (i.e. there is more than 1 series)
		if (i > 1){
			legend = true;
		}
		i = i + 1;
	}
	
	$('#' + div).highcharts({
		title: {
			text: chartTitle, // Chart text from meta data
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
			enabled: legend,
			itemStyle: {
				color: '#A0A0A0'
			}
		},
		series: data
	});
}