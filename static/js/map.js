var colorGradient = [[0, "#FF4A4A"],
[0.1,"#FD6E54"],
[0.2,"#FC925E"],
[0.3,"#FBB668"],
[0.4, "#FADA72"],
[0.5, "#F9FF7D"],
[0.6, "#CEFF77"],
[0.7, "#A4FF71"],
[0.8, "#7AFF6B"],
[0.9, "#50FF65"],
[1, "#26FF60"]];

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
				nullColor: "C1E6C5"
			},
			enabled: true,
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        select: function () {
							//Trigger Modal
                            $('#popup-button').click();
							
							// Populate Title
							window.curCountry = this.name;
                            $('#modal-title').append(curCountry);
							
							// Populate Indicator Name
							var ind_num = $('#indicator-select').val();
							$('#modal-indicator').append(allData['meta']['title'][ind_num]);
							
							// Build Indicator List
							buildIndicatorList(allData, "modal-indicators");
							$("#modal-indicators").val(ind_num);
							
							// Create year buttons
							var year = $('input[name="lp-radio"]:checked').val();
							buildYearsButtons(ind_num, 'modal-radio');
							checkYear(ind_num, year);
							
							// Draw line and bar charts
							drawModalLine('modalLine', ind_num, curCountry);
							drawModalColumn('modalColumn', ind_num, curCountry, year);
							
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
			stops: colorGradient,
			/*minColor: "#ff4d4d",
			maxColor: "#325fff",*/
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
	                color: '#ccfbff'
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