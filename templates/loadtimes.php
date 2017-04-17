<?php
// error_reporting(E_ALL);
// ini_set('display_errors', '1');
	include_once 'base/header.php';

	// Set default server time zone
	date_default_timezone_set('UTC');
	$usersTimezone = new DateTimeZone('America/New_York');
?>
	<div class="panel-body api_results">
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
	</div>

	<div class="api_results">
		<ul class="nav nav-tabs">
			<li class="active"><a href="#manifests_tab" data-toggle="tab" aria-expanded="false">Manifest</a></li>
			<li class=""><a href="#navigation_tab" data-toggle="tab" aria-expanded="true">Navigation</a></li>
			<li class=""><a href="#content_tab" data-toggle="tab" aria-expanded="true">Content</a></li>
			<li class=""><a href="#section_content_tab" data-toggle="tab" aria-expanded="true">Section Content</a></li>
			<li class=""><a href="#alltime_reports_tab" data-toggle="tab" aria-expanded="true">All Loadtimes</a></li>
		</ul>
		<br />
		<div class="tab-content">
			<div class="tab-pane fade active in" id="manifests_tab">
				<div class="panel-body">
					<div class="tab-pane fade active in">
						<?php if ($apiManifestLoadTimes) { 
								Spire::formatLoadTimesTable($apiManifestLoadTimes);
							} else {
								echo "No loadtimes to display currently.";
							}
						?>
					</div>
				</div>
			</div>
			<div class="tab-pane" id="navigation_tab">
				<div class="panel-body">
					<div class="tab-pane fade active in">
						<?php if ($apiNavLoadTimes) { 
								Spire::formatLoadTimesTable($apiNavLoadTimes);
							} else {
								echo "No loadtimes to display currently.";
							}
						?>
					</div>
				</div>
			</div><div class="tab-pane" id="content_tab">
				<div class="panel-body">
					<div class="tab-pane fade active in">
						<?php if ($apiContentLoadTimes) { 
								Spire::formatLoadTimesTable($apiContentLoadTimes);
							} else {
								echo "No loadtimes to display currently.";
							}
						?>
					</div>
				</div>
			</div><div class="tab-pane" id="section_content_tab">
				<div class="panel-body">
					<div class="tab-pane fade active in">
						<?php if ($apiSectionContentLoadTimes) { 
								Spire::formatLoadTimesTable($apiSectionContentLoadTimes);
							} else {
								echo "No loadtimes to display currently.";
							}
						?>
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