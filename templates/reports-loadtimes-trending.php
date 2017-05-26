<?php
// error_reporting(E_ALL);
// ini_set('display_errors', '1');
	include_once 'base/header.php';

	// Set default server time zone
	date_default_timezone_set('UTC');
	$usersTimezone = new DateTimeZone('America/New_York');

	$endpointTrendArray = array();
	$loadtimesSubArray = array();

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
?>
	<div class="panel-body api_results">
		<div class="api_results">
			<div class="panel panel-default">
				<div class="panel-heading">Trending endpoints with high loadtimes</div>
				<div class="panel-body">
					<p class="text-muted small"><i>* If the table doesn't style properly, click one of the sorting headers to update the view.</i></p>
					<table id="zctb-trending" class="display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
						<thead>
							<tr>
								<th>Endpoint URL</th>
								<th>Avg. Loadtime (ms)</th>
							</tr>
						</thead>
						<tfoot>
							<tr>
								<th>Endpoint URL</th>
								<th>Avg. Loadtime (ms)</th>
							</tr>
						</tfoot>
						<tbody>
							<?php
								foreach ($endpointTrendArray as $key => $value) {
									$loadtimeAverage = array_sum($value) / count($value);
									echo '<tr><td>'.$key.'</td><td>'.round($loadtimeAverage).'</td></tr>';

									// foreach ($value as $loadtimeKey => $loadtimeVal) {
									// 	echo $loadtimeVal.'<br />';
									// }

								}
							?>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
<?php include_once 'base/footer.php' ?>