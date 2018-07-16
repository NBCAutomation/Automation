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
				<i class="fa fa-bars" aria-hidden="true"></i> &nbsp;Average API Endpoint Loadtime DTD (uncached), current month
			</a>
		</div>
		<div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
			<div class="panel-body">
				<p class="text-muted small">* Note: times are in ms</p>
				<div id="chart-container">
					<div class="chart">
						<canvas id="lineChart" height="310" width="600"></canvas>
					</div>
				</div>
				<div id="legendDiv">
					<ul>
						<li class="manifest"><div></div>Manifest</li>
						<li class="navigation"><div></div>Navigation</li>
						<li class="section"><div></div>Section</li>
						<li class="content"><div></div>Content</li>
						<li class="ott"><div></div>OTT</li>
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
							<div class="col-md-3">
								<div class="panel panel-default">
									<div class="panel-body loadTime_ott text-light">
										<div class="stat-panel text-center">
											<div class="stat-panel-number h4 "><?php echo round($apiOTTAverageLoadTime); ?> ms</div>
											<div class="stat-panel-title text-uppercase">OTT</div>
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
			<li class=""><a href="#section_content_tab" data-toggle="tab" aria-expanded="true">Section &amp; Content</a></li>
			<li class=""><a href="#ott_tab" data-toggle="tab" aria-expanded="true">OTT</a></li>
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
			</div>
			<div class="tab-pane" id="content_tab">
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
			</div>
			<div class="tab-pane" id="section_content_tab">
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
			<div class="tab-pane" id="ott_tab">
				<div class="panel-body">
					<div class="tab-pane fade active in">
						<?php if ($apiOTTLoadTimes) { 
								Spire::formatLoadTimesTable($apiOTTLoadTimes);
							} else {
								echo "No loadtimes to display currently.";
							}
						?>
					</div>
				</div>
			</div>
		</div>
	</div>
<?php include_once 'base/footer.php' ?>