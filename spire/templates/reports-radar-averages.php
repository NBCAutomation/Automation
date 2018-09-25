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
?>
	<div class="panel-body api_results">
		<h4>AVG. Radar Online% by Radar</h4>
		<div class="panel-body">
			<?php
				foreach ($weatherRadarStationAverages as $radarKey => $radarData) {
			?>
			<div class="panel panel-default">
				<div class="panel-heading" role="tab" id="headingOne">
						<h5><?php echo $radarKey; ?></h5>
				</div>
					<div class="panel-body">
					<div class="percent_container">
						<div class="c100 p<?php echo round($radarData['yesterday']); ?> green">
							<span><?php echo round($radarData['yesterday']); ?>%</span>
							<div class="slice">
								<div class="bar"></div>
								<div class="fill"></div>
							</div>
						</div>
						<h4>Yesterday</h4>
					</div>
					<div class="percent_container">
						<div class="c100 p<?php echo round($radarData['today']); ?> green">
							<span><?php echo round($radarData['today']); ?>%</span>
							<div class="slice">
								<div class="bar"></div>
								<div class="fill"></div>
							</div>
						</div>
						<h4>Today</h4>
					</div>
					<div class="percent_container">
						<div class="c100 p<?php echo round($radarData['week']); ?> green">
							<span><?php echo round($radarData['week']); ?>%</span>
							<div class="slice">
								<div class="bar"></div>
								<div class="fill"></div>
							</div>
						</div>
						<h4>Current Week</h4>
					</div>
					<div class="percent_container">
						<div class="c100 p<?php echo round($radarData['month']); ?> green">
							<span><?php echo round($radarData['month']); ?>%</span>
							<div class="slice">
								<div class="bar"></div>
								<div class="fill"></div>
							</div>
						</div>
						<h4>Month</h4>
					</div>
				</div>
			</div>
			<hr />
			<?php
				}
			?>
		</div>
	</div>
<?php include_once 'base/footer.php' ?>