var screenWidth = screen.width;
var allData = getData();
var ecoData = getEcoData();
var ind_num = "1_1";
var eco_ind_num = "1_01";
var year = "2015";
var activeLoop = false;
var labels = true;
var countryColors = ["#7c87ff", "#e87680", "#421a9b"];
var bg_color = "#E9E9E9";
var mapping = {	
	"Albania":"al",
	"Armenia": "am",
	"Azerbaijan": "az",
	"Bosnia and Herzegovina":"ba",
	"Belarus":"by",
	"Georgia":"ge",
	"Kazakhstan":"kz",
	"Kosovo":"kv",
	"Kyrgyz Republic":"kg",
	"Moldova":"md",
	"Montenegro":"me",
	"Serbia":"rs",
	"Tajikistan":"tj",
	"fYR Macedonia":"mk",
	"Turkey":"tr",
	"Turkmenistan":"tm",
	"Ukraine":"ua",
	"Uzbekistan":"uz",
	"ECIS Average":"ea",
	"EU Average":"eu"
};

// Create Year Buttons function
function buildYearsButtons(div) {
	// Create landing page year buttons
	if (div == 'years-radio'){
	    $("#" + div).empty();
	    for (var key in allData[ind_num]) {
	        var input_radio = "<input type='radio' class='toggle btn-year' name='lp-radio' id='" + key + "' value='"+key+"'><label for='" + key + "' class='btn year-btn'>" + key + "</label>";
	        $("#" + div).append(input_radio);
	    };
	} else {
	    $("#" + div).empty();
	    for (var key in allData[ind_num]) {
	        var input_radio = "<input type='radio' class='toggle btn-year modal-btn' name='md-radio' id='" + key + "' value='"+key+"'><label for='" + key + "' class='btn btn-sm year-btn'>" + key + "</label>";
	        $("#" + div).append(input_radio);
	    };
	};
};

function checkYear(radioId) {
	allKeys = Object.keys(allData[ind_num]);
	
	if ($.inArray(year, allKeys) == -1) { 
		// if currently selected year does not exist for new indicator, set year to latest year
		var yearToCheck = allKeys[allKeys.length - 1];
	} else {
		var yearToCheck = year;
	};
	
	// Set checks
	$('#' + yearToCheck).addClass('checked');
	$('input[id=' + yearToCheck + '][name=' + radioId + ']').prop("checked", true).change();
}

// Build list of indicators
function buildIndicatorList(div, dataset) {
	$("#" + div).empty();
	var indicatorData = dataset["meta"]["title"];
	
	for (key in indicatorData){
        text = "<option value='" + key + "'>" + indicatorData[key] + "</option>";
        $("#" + div).append(text);
	}
};

// Function to automatically cycle through years
function timedLoop(i, time) {
	setTimeout(function(x) {
		if ($('#myModal').is(':visible')) {
		    var years = $('.modal-btn');
			var max_i = years.length;
		} else {
		    var years = $('.btn-year');
			var max_i = years.length;
		}
		
		//Advance loop
		if (i < max_i && !clicked) {
			buttonId = years[i].id;
			$("#" + buttonId).click();
			i = i + 1;
			timedLoop(i, time);
		} else if (i == max_i && !clicked) {
			breakLoop();
		};
	}, time);
};

function breakLoop(){
	activeLoop = false;
	if ($('#myModal').is(':visible')) {
		$("#modal-loop").removeClass('active');
		$("#modal-play-stop").removeClass('glyphicon glyphicon-stop');
		$("#modal-play-stop").addClass('glyphicon glyphicon-play');
	} else {
		$("#loop").removeClass('active');
		$("#play-stop").removeClass('glyphicon glyphicon-stop');
		$("#play-stop").addClass('glyphicon glyphicon-play');
	};
}

// Show/Hide Labels
function showHideLabels() {
	if ($('#label-box').is(':checked')) {
		labels = false;
	} else {
		labels = true;
	};
	rebuildMap(ind_num, year);
}

function fillCountryDropdowns() {
	countryList = Object.keys(mapping);
	var indexList = [];
	
	for (country in countryList){
        text = "<option value='" + mapping[country] + "'>" + countryList[country] + "</option>";
        $("#country-select1").append(text);
		$("#country-select2").append(text);
		$("#country-select3").append(text);
		indexList.push(country);
	};
	
	// Randomly select initial countries
	var initialSelections = _.sample(indexList, 3);
	document.getElementById("country-select1").selectedIndex = initialSelections[0];
	document.getElementById("country-select2").selectedIndex = initialSelections[1];
	document.getElementById("country-select3").selectedIndex = initialSelections[2];
};

function getCountrySelections(){
	var selections = [$("#country-select1 :selected").text(),
	$("#country-select2 :selected").text(),
	$("#country-select3 :selected").text()];
	return selections
};

function getChartReferenceByClassName(className) {
    var foundChart = $('.' + className + '').eq(0).parent().highcharts();
    return foundChart;
};

// When page is loaded
$(document).ready(function(){

	// Create year buttons
	buildYearsButtons('years-radio');
	
	// Get list of indicators
	buildIndicatorList('indicator-select', allData);
	
	// Populate country dropdowns
	fillCountryDropdowns();
	
	// Create Map
	checkYear('lp-radio');
	rebuildMap();
	
	// Create Radar Chart
	var countries = getCountrySelections();
	var radarData = createRadarData(countries);
	RadarChart.draw("#radar-chart", radarData, mycfg, countries);
	
	// Create Line Chart
	drawLineChart('line-chart', countries);
	
	// Update for year change
	$('#years-radio').on('change', 'input[name="lp-radio"]', function() {
		year = $('input[type="radio"][name="lp-radio"]:checked').val();
		$('input[name="lp-radio"]').removeClass('checked');
		$('input[name="lp-radio"]:checked').addClass('checked');
		
		// Refresh Radar Chart
		$("#radar-chart").empty();
		var countries = getCountrySelections();
		var radarData = createRadarData(countries);
		RadarChart.draw("#radar-chart", radarData, mycfg, countries);
		
		// Refresh Map
		rebuildMap(ind_num);
		
		// Modal Year Change
		if ($('#myModal').is(':visible')) {
			$('input[type="radio"][name="md-radio"]').removeClass('checked');
			checkYear('md-radio');
	
			// Refresh Modal Column Chart
			$("#ModalColumn").empty();
			drawModalColumn('modalColumn', curCountry);
			
			// Refresh Eco Indicator
			$('#modal-eco-indicator').empty();
			$('#modal-eco-indicator').append(ecoData['meta']['title'][eco_ind_num]);
	
			// Refresh Modal Radar Chart
			$("#modalRadar").empty();
			var countryList = ["EU Average", "ECIS Average", curCountry]
			var radarData = createRadarData(countryList);
			RadarChart.draw("#modalRadar", radarData, mycfg, countryList);
		};
	});
	
	// Update for indicator change
	$("#indicator-select").change(function(){
		ind_num = $("#indicator-select").val();
		
		// Rebuild Radio Buttons
		$('#years-radio').empty();
		buildYearsButtons("years-radio");
		checkYear('lp-radio');
		
		// Refresh Map
		rebuildMap();
		
		// Refresh Line Chart
		$("#line-chart").empty();
		var countries = getCountrySelections();
		drawLineChart('line-chart', countries);
	});
	
	// Update map on label change
	$("#label-box").change(function(){
		showHideLabels();
	});
	
	// Automated Loop
	$('#loop-button').on('click', '#loop', function() {
		if (activeLoop){
			clicked = true;
			breakLoop();
		} else {
			clicked = false;
			activeLoop = true;
			$(this).addClass('active');
			$("#play-stop").removeClass('glyphicon glyphicon-play');
			$("#play-stop").addClass('glyphicon glyphicon-stop');
			timedLoop(0, 500);
		};
	});
	
	// Refresh Countries
	$('.refresh-btn').on('click', '#country-refresh', function() {
		$("#radar-chart").empty();
		var countries = getCountrySelections();
		var radarData = createRadarData(countries);
		RadarChart.draw("#radar-chart", radarData, mycfg, countries);
		
		// Refresh Line Chart
		$("#line-chart").empty();
		drawLineChart('line-chart', countries);
	});

	/*------------------------------------
	Modal Functions
	------------------------------------*/
	// Modal Automated Loop
	$('#modal-loop-button').on('click', '#modal-loop', function() {
		if (activeLoop){
			clicked = true;
			breakLoop();
		} else {
			clicked = false;
			activeLoop = true;
			$(this).addClass('active');
			$("#modal-play-stop").removeClass('glyphicon glyphicon-play');
			$("#modal-play-stop").addClass('glyphicon glyphicon-stop');
			timedLoop(0, 500);
		};
	});
	
	// Modal Indicator Change
	$("#modal-indicators").change(function(){			
		// Refresh Heading
		ind_num = $("#modal-indicators").val();
		$('#modal-indicator').empty();
		$('#modal-indicator').append(allData['meta']['title'][ind_num]);
		
		// Refresh Line Chart
		$('#modalLine').empty();
		drawModalLine('modalLine', curCountry);
	});
	
	// Economic Indicator Change
	$("#ecoIndicators").change(function(){
		eco_ind_num = $("#ecoIndicators").val();
		$('#modal-eco-indicator').empty();
		$('#modal-eco-indicator').append(ecoData['meta']['title'][eco_ind_num]);

		// Refresh Column Chart
		$('#modalColumn').empty();
		drawModalColumn('modalColumn', curCountry);
		
		// Refresh Eco Line Chart
		$('#modalEcoLine').empty();
		drawModalEcoLine('modalEcoLine', curCountry);
		
	});
	
	// Close Modal
	$('.modal-header').on('click', '#close', function(){
		rebuildMap();
		
		// Check Year
		checkYear('lp-radio');
		
		// Clear Old Data
        $('#modal-title').empty();
		$('#modal-indicator').empty();
		$('#modal-eco-indicator').empty();
		$('#modal-radio').empty();
		$('#modalRadar').empty();
		$('#modalColumn').empty();
		$('#modalLine').empty();
		eco_ind_num = "1_01";
		
		// Select Indicator Indicator List
		$("#indicator-select").val(ind_num);
		
		// Refresh Map
		rebuildMap();
		
		// Refresh Radar Chart
		$("#radar-chart").empty();
		var countries = getCountrySelections();
		var radarData = createRadarData(countries);
		RadarChart.draw("#radar-chart", radarData, mycfg, countries);
	});
	
	// Refresh Charts on Window Resize
	//$(window).resize(function(){location.reload();});
	
});
