<?php
// error_reporting(E_ALL);
// ini_set('display_errors', '1');
	include_once 'base/header.php';

	// Set default server time zone
	date_default_timezone_set('UTC');
	$usersTimezone = new DateTimeZone('America/New_York');
?>
	<!-- <div class="panel-body api_results">
	<div class="panel panel-default">
		<div class="panel-heading" role="tab" id="headingOne">
			<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
				<i class="fa fa-bars" aria-hidden="true"></i> &nbsp;Average API Endpoint Loadtime DTD (uncached)
			</a>
		</div>
		<div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
			<div class="panel-body">
				<p class="text-muted small">* Note: times are in ms</p>
				<div class="chart">
					<canvas id="lineChart" height="310" width="600"></canvas>
				</div>
				<div id="legendDiv">
					<ul>
						<li class="manifest"><div></div>Manifest</li>
						<li class="navigation"><div></div>Navigation</li>
						<li class="section"><div></div>Section</li>
						<li class="content"><div></div>Content</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<div class="api_results">
		<div class="panel panel-default">
			<div class="panel-heading"><i class="fa fa-clock-o"></i> Average loadtimes today</div>
			<div class="panel-body">
				<div class="row">
					<div class="col-md-12">
						<div class="row">
							<div class="col-md-3">
								<div class="panel panel-default">
									<div class="panel-body loadTime_manifest text-light">
										<div class="stat-panel text-center">
											<div class="stat-panel-number h4 "><?php echo round($apiManifestAverageLoadTime); ?> ms</div>
											<div class="stat-panel-title text-uppercase">Manifest</div>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-3">
								<div class="panel panel-default">
									<div class="panel-body loadTime_navigation text-light">
										<div class="stat-panel text-center">
											<div class="stat-panel-number h4 "><?php echo round($apiNavAverageLoadTime); ?> ms</div>
											<div class="stat-panel-title text-uppercase">Navigation</div>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-3">
								<div class="panel panel-default">
									<div class="panel-body loadTime_section text-light">
										<div class="stat-panel text-center">
											<div class="stat-panel-number h4 "><?php echo round($apiSectionContentAverageLoadTime); ?> ms</div>
											<div class="stat-panel-title text-uppercase">Section</div>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-3">
								<div class="panel panel-default">
									<div class="panel-body loadTime_content text-light">
										<div class="stat-panel text-center">
											<div class="stat-panel-number h4 "><?php echo round($apiContentAverageLoadTime); ?> ms</div>
											<div class="stat-panel-title text-uppercase">Content</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div> -->

	<div class="api_results">
		<?php

		$endpointTrendArray = array();
		$loadtimesSubArray = array();

		echo "<pre>";
			// var_dump($trendingSearchResults[0]);

			foreach ($data as $trendingSearchResults) {
				foreach ($data['trendingSearchResults'][0] as $key => $value) {
					$endpointArrayKey = array_shift(explode('contentId=', strstr($value['endpoint'], '/apps')));
					$endpointTrendArray[$endpointArrayKey] = [];
				}
			}

			foreach ($endpointTrendArray as $columnkey => $columnvalue) {
				foreach ($data as $trendingSearchResults) {
					foreach ($data['trendingSearchResults'][0] as $key => $value) {
						if (strpos($value['endpoint'], $columnkey)) {
							// echo $value['max_load_time'].'<br />';
							// array_push($loadtimesSubArray, $value['max_load_time']);
							$loadtimesSubArray[$key.'_loadtime'] = $value['max_load_time'];
						}
					}
				}
				$endpointTrendArray[$columnkey] = $loadtimesSubArray;
				$loadtimesSubArray = [];
			}


			foreach ($endpointTrendArray as $key => $value) {
				echo $key;
				$loadtimeAverage = array_sum($value) / count($value);
				echo round($loadtimeAverage).'<br/>';

				// foreach ($value as $loadtimeKey => $loadtimeVal) {
				// 	echo $loadtimeVal.'<br />';
				// }

			}

			// foreach ($endpointTrendArray as $columnkey => $columnvalue) {
			// 	if ($endpointArrayKey === $columnkey) {
			// 		// echo "key found";
			// 		$loadtimesSubArray[$key.'_loadtime'] = $value['max_load_time'];

			// 		if (stripos($value['endpoint'], $endpointArrayKey)) {
			// 			echo $endpointArrayKey.'<br />';
			// 			echo $key.' -- '.$value['endpoint'].' -- '.$value['max_load_time'].'<br />';
			// 			echo "------<br />";
			// 			// echo $key.' -- '.$value['endpoint'].' -- '.$value['max_load_time'].'<br />';
			// 		// 	$endpointTrendArray[$endpointArrayKey] = $loadtimesSubArray;	
			// 		}
			// 	} else {
			// 		// echo "not found<br/>";
			// 	}
			// }

			// var_dump($endpointTrendArray);
		echo "</pre>";
		?>
	</div>
<?php include_once 'base/footer.php' ?>