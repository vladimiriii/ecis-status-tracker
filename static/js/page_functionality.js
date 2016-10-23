var allData = getData();
var ecoData = getEcoData();
var ind_num = "1_1";
var year = "2015";
var activeLoop = false;
var labels = true;
var chartHeight = null;
var chartWidth = null;
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
function buildYearsButtons(indicator, div) {
	// Create landing page year buttons
	if (div == 'years-radio'){
	    $("#" + div).empty();
	    for (var key in allData[indicator]) {
	        var input_radio = "<input type='radio' class='toggle btn-year' name='lp-radio' id='" + key + "' value='"+key+"'><label for='" + key + "' class='btn year-btn'>" + key + "</label>";
	        $("#" + div).append(input_radio);
	    };
	} else {
	    $("#" + div).empty();
	    for (var key in allData[indicator]) {
	        var input_radio = "<input type='radio' class='toggle btn-year modal-btn-year' name='md-radio' id='" + key + "' value='"+key+"'><label for='" + key + "' class='btn btn-sm year-btn'>" + key + "</label>";
	        $("#" + div).append(input_radio);
	    };
	};
};

function checkYear(indicator, year) {
	allKeys = Object.keys(allData[indicator]);
	
	if ($.inArray(year, allKeys) == -1) { 
		// if currently selected year does not exist for new indicator, set year to latest year
		var yearToCheck = allKeys[allKeys.length - 1];
	} else {
		var yearToCheck = year;
	};
	
	// Set checks
	$('#' + yearToCheck).addClass('checked');
	$('input[id=' + yearToCheck + '][value=' + yearToCheck + ']').prop("checked", true).change();
}

// Build list of indicators
function buildIndicatorList(data, div) {
	$("#" + div).empty();
	var indicatorData = data["meta"]["title"];
	
	for (key in indicatorData){
        text = "<option value='" + key + "'>" + indicatorData[key] + "</option>";
        $("#" + div).append(text);
	}
};

// Function to automatically cycle through years
function timedLoop(i, time) {
	setTimeout(function(x) {
		if ($('#myModal').is(':visible')) {
		    var years = $('.modal-btn-year');
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
	buildYearsButtons(ind_num, 'years-radio');
	
	// Get list of indicators
	buildIndicatorList(allData, "indicator-select");
	
	// Populate country dropdowns
	fillCountryDropdowns();
	
	// Create Map
	checkYear(ind_num, year);
	rebuildMap(ind_num, year);
	
	// Create Radar Chart
	var countries = getCountrySelections();
	var radarData = createRadarData(allData, year, countries);
	RadarChart.draw("#radar-chart", radarData, mycfg, countries);
	
	// Create Line Chart
	drawLineChart('line-chart', ind_num, countries);
	
	// Update for year changes
	$(document).on('change', 'input[name="lp-radio"]', function() {
		year = $('input[name="lp-radio"]:checked').val();
		$('input[name="lp-radio"]').removeClass('checked');
		$('input[name="lp-radio"]:checked').addClass('checked');
		
		// Refresh Radar Chart
		$("#radar-chart").empty();
		var countries = getCountrySelections();
		var radarData = createRadarData(allData, year, countries);
		RadarChart.draw("#radar-chart", radarData, mycfg, countries);
		
		// Refresh Map
		rebuildMap(ind_num, year);
		
		// If Modal is Open - update Modal
		if ($('#myModal').is(':visible')) {
			$('input[name="md-radio"][id=' + year + '][value=' + year + ']').prop("checked", true).change();
			$('input[name="md-radio"]').removeClass('checked');
			$('input[name="md-radio"]:checked').addClass('checked');
			
			// Refresh Modal Column Chart
			$("#ModalColumn").empty();
			drawModalColumn('modalColumn', ind_num, curCountry, year);
			
			// Refresh Modal Radar Chart
			$("#modalRadar").empty();
			var countryList = ["EU Average", "ECIS Average", curCountry]
			var radarData = createRadarData(allData, year, countryList);
			RadarChart.draw("#modalRadar", radarData, mycfg, countryList);
		};
		
	});
	
	// Update map on indicator change
	$("#indicator-select").change(function(){
		ind_num = $("#indicator-select").val();
		year = $('input[name="lp-radio"]:checked').val();
		$('#years-radio').empty();
		buildYearsButtons(ind_num, "years-radio");
		checkYear(ind_num, year);
		rebuildMap(ind_num, year);
		
		// Refresh Line Chart
		$("#line-chart").empty();
		var countries = getCountrySelections();
		drawLineChart('line-chart', ind_num, countries);
	});
	
	// Update map on label change
	$("#label-box").change(function(){
		showHideLabels();
	});
	
	// Automated Loop
	$(document).on('click', '#loop', function() {
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
	$(document).on('click', '#country-refresh', function() {
		$("#radar-chart").empty();
		var countries = getCountrySelections();
		var radarData = createRadarData(allData, year, countries);
		RadarChart.draw("#radar-chart", radarData, mycfg, countries);
		
		// Refresh Line Chart
		$("#line-chart").empty();
		drawLineChart('line-chart', ind_num, countries);
	});
	
	/*------------------------------------
	Modal Functions
	------------------------------------*/
	// Modal Automated Loop
	$(document).on('click', '#modal-loop', function() {
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

		// Refresh Year Buttons
		$('#modal-radio').empty();
		buildYearsButtons(ind_num, 'modal-radio');
		checkYear(ind_num, year);
		
		// Refresh Heading
		ind_num = $("#modal-indicators").val();
		$('#modal-indicator').empty();
		$('#modal-indicator').append(allData['meta']['title'][ind_num]);
		
		// Refresh Line Chart
		$('#modalLine').empty();
		drawModalLine('modalLine', ind_num, curCountry);
	});
	
	// Economic Indicator Change
	$("#ecoIndicators").change(function(){
		ind_num = $("#ecoIndicators").val();
		year = $('input[name="md-radio"]:checked').val();

		// Refresh Column Chart
		$('#modalColumn').empty();
		drawModalColumn('modalColumn', ind_num, curCountry, year);
	});
	
	// Close Modal
	$(document).on('click', '#close', function(){
		rebuildMap(ind_num, year);
		var ind_num = $('#modal-indicators').val();
		
		// Clear Old Data
        $('#modal-title').empty();
		$('#modal-indicator').empty();
		$('#modal-radio').empty();
		$('#modalRadar').empty();
		$('#modalColumn').empty();
		$('#modalLine').empty();
		chartHeight = null;
		chartWidth = null;
		
		// Refresh Indicator List
		buildIndicatorList(allData, "indicator-select");
		$("#indicator-select").val(ind_num);
		
		// Refresh Map
		rebuildMap(ind_num, year);
		
		// Refresh Radar Chart
		$("#radar-chart").empty();
		var countries = getCountrySelections();
		var radarData = createRadarData(allData, year, countries);
		RadarChart.draw("#radar-chart", radarData, mycfg, countries);
	});
	
});
