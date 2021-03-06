<?php
// error_reporting(E_ALL);
// ini_set('display_errors', '1');
	include_once 'base/header.php';

	// Set default server time zone
	date_default_timezone_set('UTC');
	$usersTimezone = new DateTimeZone('America/New_York');

	if ($trending) {
		// var_dump($trendingSearchResults[0]);
		// $searchResults = $trendingSearchResults[0];

		$endpointTrendArray = array();
		$loadtimesSubArray = array();

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
						$loadtimesSubArray[$key.'_loadtime'] = $value['max_load_time'];
					}
				}
			}
			$endpointTrendArray[$columnkey] = $loadtimesSubArray;
			$loadtimesSubArray = [];
		}
		
		$downloadFile = $endpointTrendArray;
		$downloadDataType = 'trending';
	} else {
		$downloadFile = $searchResults;
		$downloadDataType = 'default';
	}
?>
	<div class="panel-body api_results">
	<div class="panel panel-default">
		<div class="panel-heading" role="tab" id="headingOne">
			<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
				<i class="fa fa-bars" aria-hidden="true"></i> &nbsp;Search form
			</a>
		</div>
		<div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
			<div class="panel-body">
				<form method="post" class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-2 control-label">Search Range</label>
						<div class="col-sm-10">
							<select class="form-control" name="range">
								<option value="7">Default (7 Days)</option>
								<?php
								    for ($i=1; $i <= 60; $i++)
								    {
								        ?>
								            <option value="<?php echo $i;?>"><?php echo $i;?></option>
								        <?php
								    }
								?>
							</select>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">Time ></label>
						<div class="col-sm-10">
							<input type="text" class="form-control" name="mintime"><span class="help-block m-b-none"> Default 300, any loadtime > 300 ms  </span>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">Search term</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" name="term"><span class="help-block m-b-none">Ex Like: 'news-apps/content', or specific content ID. </span>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">Combine occurrences</label>
						<div class="col-sm-10">
							<input id="checkbox1" type="checkbox" name="trending" value="true"><span class="help-block m-b-none">Combine multiple occurrences of the endpoint and create averages based on those occurrences. </span>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-8 col-sm-offset-2">
							<input type="hidden" name="queryLoadtimes" value="true">
							<button class="btn btn-primary" type="submit">Search</button>
						</div>
					</div>
					<?php
						if ($formResponse) {
							
						}
					?>
				</form>
			</div>
		</div>
	</div>

	<div class="api_results">
		<div class="panel-body">
			<div class="tab-pane fade active in">
				<?php
					if ($apiSectionContentLoadTimes) { 
						Spire::formatLoadTimesTable($apiSectionContentLoadTimes);
					} elseif ($formResponse) {
						if (! $searchMinResponseTime) { $searchMinResponseTime = '300'; }
						if (! $searchTerm) { $searchTerm = 'none'; }

						echo '<h4>Search Results:</h4>';
						echo '<p><i>&nbsp; Last <b>'.$searchDayRange.'</b> days, loadtime > <b>'.$searchMinResponseTime.'</b> ms, keyword: <b>'.$searchTerm.'</b></i></p>';
						echo '<div class="hr-dashed"></div>';
					?>
					<form method="post" class="form-horizontal">
						<div class="form-group">
							<div class="col-sm-8 col-sm">
								<input type="hidden" name="processDownload" value="true">
								<input type="hidden" name="downloadData" value="<?php echo urlencode(Spire::downloadLoadTimeResults($downloadFile, $downloadDataType)); ?>">
								<button class="btn btn-primary" type="submit">Export Reuslts</button>
							</div>
						</div>
					</form>
					<?php
						if (! $trending) {
							Spire::formatLoadTimeSearchResultsTable($searchResults);
						} else {
					?>
						<div class="panel panel-default">
							<div class="panel-heading">Trending endpoints</div>
							<div class="panel-body">
								<p class="text-muted small"><i>* If the table doesn't style properly, click one of the sorting headers to update the view.</i></p>
								<table id="trending-table" class="display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
									<thead>
										<tr>
											<th>Endpoint URL</th>
											<th>Avg. Loadtime (ms)</th>
										</tr>
									</thead>
									<tfoot>
										<tr>
											<th>Endpoint</th>
											<th>Avg. Loadtime (ms)</th>
										</tr>
									</tfoot>
									<tbody>
										<?php
											foreach ($endpointTrendArray as $key => $value) {
												$loadtimeAverage = array_sum($value) / count($value);
												echo '<tr><td>'.$key.'</td><td>'.round($loadtimeAverage).'</td></tr>';
											}
										?>
									</tbody>
								</table>
							</div>
						</div>
					<?php
						}
					}
				?>
			</div>
		</div>
	</div>
<?php include_once 'base/footer.php' ?>