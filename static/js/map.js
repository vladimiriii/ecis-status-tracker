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

/*var colorGradient = [[0, "#FFBF0F"],
[0.1, "#FFCB3F"], 
[0.2, "#FFD86F"], 
[0.3, "#FFE59F"], 
[0.4, "#FFF2CF"], 
[0.5, "#FFFFFF"], 
[0.6, "#DCE0FE"], 
[0.7, "#B9C1FD"], 
[0.8, "#96A2FD"], 
[0.9, "#7383FC"], 
[1, "#5165FC"]];*/


// Reshape data to be used for the map and 
function prepareData() {
	var indicatorData = [];
	
	//Get dataset
	var rawData = allData[ind_num][year];
	
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
function createMap(metaData, indicatorData) {
	$('#container').highcharts('Map', {
		chart: {
			backgroundColor: bg_color,
			margin: 5,
			height: 400,
			style: {
				fontFamily: "CustomFont"
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
							
							// Populate Country Name
							window.curCountry = this.name;
                            $('#modal-title').append(curCountry);
							
							// Populate Indicator Name
							$('#modal-indicator').append(allData['meta']['title'][ind_num]);
							$('#modal-eco-indicator').append(ecoData['meta']['title'][eco_ind_num]);
							
							// Build Indicator Lists
							buildIndicatorList("modal-indicators", allData);
							$("#modal-indicators").val(ind_num);
							buildIndicatorList("ecoIndicators", ecoData);
							
							// Create year buttons
							buildYearsButtons('modal-radio');
							checkYear('md-radio');
					
							// Draw line and bar charts
							drawModalLine('modalLine', curCountry);
							drawModalColumn('modalColumn', curCountry);
							drawModalEcoLine('modalEcoLine', curCountry);
							
							// Get Chart Height and width to ensure they don't resize
							var detailChart = getChartReferenceByClassName('modalLine');
							chartHeight = detailChart["chartHeight"];
							chartWidth = detailChart["chartWidth"];
							
							// Draw Radar Chart
							var countryList = ["EU Average", "ECIS Average", curCountry]
							var radarData = createRadarData(countryList);
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
function rebuildMap() {
	data = prepareData();
	metaData = getMetaData();
	createMap(metaData, data);
}