<?php
// error_reporting(E_ALL);
// ini_set('display_errors', '1');
	include_once 'base/header.php';

	// Set default server time zone
	date_default_timezone_set('UTC');
	$usersTimezone = new DateTimeZone('America/New_York');
	echo '<pre>';
	var_dump($apiManifestLoadTimes[0]);
	echo '</pre>';
	// $apiNavLoadTimes
	// $apiContentLoadTimes
	// $apiSectionContentLoadTimes
?>
	<div class="panel-body api_results">
	<div class="panel panel-default">
		<div class="panel-heading" role="tab" id="headingOne">
				<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
				<i class="fa fa-bars" aria-hidden="true"></i> &nbsp;Average API Endpoint Loadtime (uncached)
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
	</div>

	<div class="api_results">
		<ul class="nav nav-tabs">
			<li class="active"><a href="#today_reports_tab" data-toggle="tab" aria-expanded="false">Today's Reports</a></li>
			<li class=""><a href="#yesterday_reports_tab" data-toggle="tab" aria-expanded="true">Yesterday's Reports</a></li>
			<li class=""><a href="#alltime_reports_tab" data-toggle="tab" aria-expanded="true">All Reports</a></li>
			<li class=""><a href="#alltime_reports_tab" data-toggle="tab" aria-expanded="true">All Reports</a></li>
		</ul>
		<br />
		<div class="tab-content">
			<div class="tab-pane fade active in" id="today_reports_tab">
				<div class="panel-body">
					<div class="tab-pane fade active in" id="errors_tab">
						<?php if ($todayFailureReports) { 
								Spire::returnFormattedDataTable($todayFailureReports, $view);
							} else {
								echo "No error reports currently.";
							}
						?>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="yesterday_reports_tab">
				<div class="tab-pane fade active in" id="today_reports_tab">
					<div class="panel-body">
						<ul class="nav nav-tabs">
							<li class="active"><a href="#yesterday_errors_tab" data-toggle="tab" aria-expanded="false"><i class="fa fa-exclamation" aria-hidden="true"></i> &nbsp;Errors</a></li>
							<li class=""><a href="#yesterday_all_reports_tab" data-toggle="tab" aria-expanded="true"><i class="fa fa-file" aria-hidden="true"></i> &nbsp;All</a></li>
						</ul>
						<br>
						<div class="tab-content">
							<div class="tab-pane fade active in" id="yesterday_errors_tab">
								<?php if ($yesterdayFailureReports) { 
										Spire::returnFormattedDataTable($yesterdayFailureReports, $view);
									} else {
										echo "No error reports currently.";
									}
								?>
							</div>
							<!-- // End errors tab -->
							<!-- // All reports tab -->
							<div class="tab-pane" id="yesterday_all_reports_tab">
								<?php if ($yesterdayReports) { 
										Spire::returnFormattedDataTable($yesterdayReports, $view);
									} else {
										echo "No error reports currently.";
									}
								?>
							</div>
							<!-- // End all reports tab -->
						</div>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="alltime_reports_tab">
				<div class="alert alert-dismissible alert-info">
					<p><i class="fa fa-info-circle" aria-hidden="true"></i> This page may take a few moments to load after clicking the linke. Once the page/query cache is built, subsequent loads should load faster.</p>
				</div>
				<a href="/reports/<?php echo $view; ?>/all" class="btn btn-primary">View all reports</a>
			</div>
		</div>
	</div>
<?php include_once 'base/footer.php' ?>