<?php
// error_reporting(E_ALL);
// ini_set('display_errors', '1');
	include_once 'base/header.php';

	// Set default server time zone
	date_default_timezone_set('UTC');
	$usersTimezone = new DateTimeZone('America/New_York');
	$contentChecks = $staleContentData['data'];

$db = new DbHandler();
			// Weather radar stations
	    	$radarStat = array(
		    	"0845" => "First Alert Live Doppler - Los Angeles",
	            "0846" => "First Alert Live Doppler - Orange County",
	            "0847" => "First Alert Live Doppler - San Diego",
	            "0848" => "StormRanger - Los Angeles",
	            "0849" => "NBC 5 S-Band Radar - DFW",
	            "0850" => "StormRanger - DFW",
	            "0851" => "StormRanger - Philadelphia",
	            "0854" => "NBC Boston Fixed",
	            "0855" => "StormTracker 4 - New York",
	            "0856" => "Live Doppler 5 - Chicago",
	            "0837" => "TeleDoppler - Puerto Rico",
	            "0853" => "First Alert Doppler 6000",
	            "0870" => "StormRanger 2 - New York/Boston",
	            "0871" => "StormRanger 2 - Philadelphia",
	            "0872" => "StormRanger 2 - DFW"
	        );

	        $weatherRadarStationAverages = array();
	        $weatherRadarStationAverage = array();

	    	foreach ($radarStat as $radarID => $radarName) {
	    		$__today = "today_".$radarID;
	    		$__yesterday = "yesterday_".$radarID;
	    		$__week = "week_".$radarID;
	    		$__month = "month_".$radarID;



	    		$__today = $db->getWeatherRadarCheckAvg('today', $radarID);
	    		$__yesterday = $db->getWeatherRadarCheckAvg('yesterday', $radarID);
	    		$__week = $db->getWeatherRadarCheckAvg('week', $radarID);
	    		$__month = $db->getWeatherRadarCheckAvg('currentMonth', $radarID);

	    		$weatherRadarStationAverage["today"] = $__today['data']['avgUptime'];
	    		$weatherRadarStationAverage["yesterday"] = $__yesterday['data']['avgUptime'];
	    		$weatherRadarStationAverage["week"] = $__week['data']['avgUptime'];
	    		$weatherRadarStationAverage["month"] = $__month['data']['avgUptime'];

	    		$weatherRadarStationAverages[$radarID.' - '.$radarName] = $weatherRadarStationAverage;

	    		$weatherRadarStationAverage = array();
	    	}
	    	// echo "<pre>";
	    	// var_dump($weatherRadarStationAverages);
	    	// echo "</pre>";
	    	// exit();
?>
	<div class="panel-body api_results">
		<div class="panel panel-default">
			<div class="panel-heading" role="tab" id="headingOne">
				<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
					<i class="fa fa-bars" aria-hidden="true"></i> &nbsp;Search form
				</a>
			</div>
		</div>
		<div class="panel-body">
			<?php
				foreach ($weatherRadarStationAverages as $key => $value) {
					echo $key;
				}
			?>
		</div>
	</div>
<?php include_once 'base/footer.php' ?>