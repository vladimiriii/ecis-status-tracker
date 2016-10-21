// Reshape data to be used for the map and 
function prepareData(indicator, year) {
	var indicatorData = [];
	
	//Get dataset
	var rawData = allData[indicator][year];
	
	for (var key in rawData) {
		// Remove null values
		if (!isNaN(rawData[key])) { 
			record = {"hc-key":mapping[key], "value":rawData[key]};
			indicatorData.push(record);
		}
	};
	
	return indicatorData
};

// Extract meta data
function getMetaData() {
	
	//Get meta data
	return allData["meta"];
	
};

//Build map
function createMap(ind_num, metaData, indicatorData, year, bg_color) {
	$('#container').highcharts('Map', {

		chart: {
			backgroundColor: bg_color,
			margin: 5,
			height: 400,
			style: {
				fontFamily: "UnicaOne"
			}
		},
		title: {
	        text: metaData["title"][ind_num] + " - " + year,
			style: {
				color: "#FFFFFF"
			}
	    },
		plotOptions: {
			map: {
				nullColor: "#47476b"
			},
			enabled: true,
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        select: function () {
							//Trigger Modal
                            $('#popup-button').click();
							console.log(clicked, activeLoop);
							
							// Populate Title
							window.curCountry = this.name
                            $('#modal-title').append(curCountry);
							
							// Populate Indicator Name
							var ind_num = $('#indicator-select').val();
							$('#modal-indicator').append(allData['meta']['title'][ind_num]);
							
							// Create year buttons
							var year = $('input[name="lp-radio"]:checked').val();
							buildYearsButtons(ind_num, 'modal-radio');
							checkYear(ind_num, year);
							
							// Draw line and bar charts
							drawModalLine('modalLine', ind_num, curCountry);
							drawModalBar('modalBar', ind_num, curCountry, year);
							
							// Draw Radar Chart
							var countryList = ["EU Average", "ECIS Average", curCountry]
							var radarData = createRadarData(allData, year, countryList);
							RadarChart.draw("#modalRadar", radarData, mycfg, countryList);
							
                        }
                    }
                }
			}
		},
	    mapNavigation: {
	        enabled: true,
			enableMouseWheelZoom: false,
	        buttonOptions: {
	            verticalAlign: 'bottom'
	        }
	    },
		navigation: {
			buttonOptions: {
				enabled: false
			}
		},
	    colorAxis: {
			min: metaData["min_value"][ind_num],
			max: metaData["max_value"][ind_num],
			tickInterval: metaData["tick_value"][ind_num],
			minColor: "#ff4d4d",
			maxColor: "#00e673",
			labels: {
				style: {
					color: "#FFFFFF"
				}	
			}
	    },
		tooltip: {
			valueDecimals: 2
		},
	    series: [{
	        data: indicatorData,
	        mapData: Highcharts.maps['custom'],
	        joinBy: 'hc-key',
			allowPointSelect: true,
	        name: metaData["title"][ind_num],
	        states: {
	            hover: {
	                color: '#c7c7d2'
	            }
	        },
	        dataLabels: {
	            enabled: labels,
	            format: '{point.name}'
	        }
	    }]
	})
};

// Full Map Build Process
function rebuildMap(series, year) {
	data = prepareData(ind_num, year);
	metaData = getMetaData();
	createMap(ind_num, metaData, data, year);
}