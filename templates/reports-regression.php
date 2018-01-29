<?php
// error_reporting(E_ALL);
// ini_set('display_errors', '1');
	include_once 'base/header.php';

	// Set default server time zone
	date_default_timezone_set('UTC');
	$usersTimezone = new DateTimeZone('America/New_York');
	$db = new DbHandler();

	if ($viewType == 'regressionTest') {
        $tableHeaders = '<th> Status</th><th>Link</th><th>URL (click to open)</th><th>HTTP Status Code</th><th>Info</th>';
        $regressionData = true;
	}

	$testReportTime = date('n/d/Y, g:i A', strtotime($fullReportData['created']));

	$l10nDate = new DateTime($testReportTime);
	$l10nDate->setTimeZone($usersTimezone);

	$reportCSVDate =  date('n_j_Y', strtotime($fullReportData['created']));
	$reportCSVDateTime =  date('n_j_Y-g_i-A', strtotime($fullReportData['created']));

	if (strpos($reportProperty, 'stage') !== false) {
		$thisPropertyName = str_replace('stage_', 'stage.', $reportProperty);
	} else {
		$thisPropertyName = $reportProperty;
	}

	if ($reportData) {
		$obj = json_decode($reportData, true);
		$reportScoreData = $obj['testData'];
		$reportFailures = $obj['testResults'];
	}
?>
	<div class="panel-body api_results">
	<div class="api_results">
		<div class="panel panel-default">
			<div class="panel-heading">Regression reports</div>
			<div class="panel-body">
			<?php if (! $regressionData) { ?>
				<!-- // Regression Report table list -->
				<div class="api_results">
					<ul class="nav nav-tabs">
						<li class="active"><a href="#today_reports_tab" data-toggle="tab" aria-expanded="false">Recent Reports</a></li>
					</ul>
					<br />
					<div class="tab-content">
						<div class="tab-pane fade active in" id="today_reports_tab">
							<div class="panel-body">
							<?php
								$testReportViewData = '<div class="panel panel-default">';
								$testReportViewData .= '<div class="panel-heading">'.$viewName.' Reports</div>';
								$testReportViewData .= '<div class="panel-body api_results">';
								$testReportViewData .= '<table id="" class="reports_table display table table-striped table-bordered table-hover" cellspacing="0" width="100%">';
								$testReportViewData .= '<thead><tr width="100%"><th>ID</th><th>Score</th><th>Property</th><th>Created</th></tr></thead>';
								$testReportViewData .= "<tbody>";

								foreach ($recentRegressionTests[0] as $key => $value) {
									$l10nDate = new DateTime($value['created']);
									$l10nDate->setTimeZone($usersTimezone);

									if (!$value['score']) {
										$testScore = '--';	
									} else {
										$testScore = $value['score'];
									}

									$testReportViewData .= '<tr>';
									$testReportViewData .= '<td><a href="/reports/regression_tests/record/'.$value['id'].'?refID='.$value['test_id'].'">'.$value['id'].'</a></td>';
									$testReportViewData .= '<td><a href="/reports/regression_tests/record/'.$value['id'].'?refID='.$value['test_id'].'">'.$testScore.'</a></td>';
									$testReportViewData .= '<td><a href="/reports/regression_tests/record/'.$value['id'].'?refID='.$value['test_id'].'">'.str_replace('stage_', 'stage.', $value['property']).'</a></td>';
									$testReportViewData .= '<td><a href="/reports/regression_tests/record/'.$value['id'].'?refID='.$value['test_id'].'">'.$l10nDate->format('n/d/Y, g:i A').'</a></td>';
									$testReportViewData .= '</tr>';
								}
								$testReportViewData .= "</tbody>";
								$testReportViewData .= "<tfoot><tr><th>ID</th><th>Score</th><th>Property</th><th>Created</th></tr></tfoot>";
								$testReportViewData .= '</table>';
								$testReportViewData .= '</div></div>';
								$testReportViewData .= '<p class="text-muted small"><i>* If the table doesn\'t style properly, click one of the sorting headers to update the view.</i></p>';
					         
					            print($testReportViewData);
							?>
							</div>
						</div>
					</div>
				</div>
				<!-- Regression Report Data view -->
				<?php } else { ?>
				<div class="panel panel-primary">
					<div class="panel-heading">
						<h3 class="panel-title"><?php echo $thisPropertyName; ?>.com</h3>
					</div>
					<div class="panel-body">
						<p>Test completed: <?php echo $l10nDate->format('n/d/Y, g:i A'); ?></p>
						<div class="col-md-12">
							<div class="row">
								<div class="col-md-2">
									<div class="panel panel-default score">
										<div class="panel-body">
											<div class="stat-panel text-center">
												<div class="stat-panel-number h1 "><?php echo $reportScoreData['testScore']; ?></div>
												<div class="stat-panel-title text-uppercase">Score</div>
											</div>
										</div>
									</div>
								</div>
								<div class="col-md-2">
									<div class="panel panel-default passes">
										<div class="panel-body">
											<div class="stat-panel text-center">
												<div class="stat-panel-number h1 "><?php echo $reportScoreData['totalPasses']; ?></div>
												<div class="stat-panel-title text-uppercase">Passed</div>
											</div>
										</div>
									</div>
								</div>
								<div class="col-md-2">
									<div class="panel panel-default failrues">
										<div class="panel-body">
											<div class="stat-panel text-center">
												<div class="stat-panel-number h1 "><?php echo $reportScoreData['totalFailures']; ?></div>
												<div class="stat-panel-title text-uppercase">Failed</div>
											</div>
										</div>
									</div>
								</div>
								<div class="col-md-2">
									<div class="panel panel-default">
										<div class="panel-body">
											<div class="stat-panel text-center">
												<div class="stat-panel-number h1 "><?php echo $reportScoreData['totalTests']; ?></div>
												<div class="stat-panel-title text-uppercase">Total</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
					<?php
						if ($fullReportData['failures'] > 0) {
							echo '<div class="panel panel-default">
								<div class="panel-heading">
									<h3 class="panel-title">Failure details</h3>
								</div>
								<div class="panel-body">';

							// var_dump(json_decode($reportFailures));

							foreach ($reportFailures as $reportKey => $reportValue) {
								echo '<div class="panel panel-default">
									<div class="panel-heading">
										<h3 class="panel-title">'.$reportKey.'</h3>
									</div>';
								echo '<div class="panel-body">';

								if (is_array($reportValue)) {
									echo '<ul>';
									echo '<li>'.$reportValue['failure'].'</li>';
									
									if ($reportValue['screenshot']) {
										echo '<li><i class="fa fa-file-image-o" aria-hidden="true"></i> <a href="'.$reportValue['screenshot'].'" target="_black">View screenshot</a></li>';	
									}
									
									echo '</ul>';
								} else {
									echo $reportValue;	
								}
								echo '</div>';
								echo '</div>';
							}
							echo '</div>';
							echo '</div>';
						} else {
							echo '<div class="alert alert-success"><p><i class="fa fa-check-circle-o" aria-hidden="true"></i> No errors to report, all tests passed.</p></div>';
							echo '<ul class="defaultList">
								<li>Logo is clickable</li>
								<li>Weather module appears on HP and map loads</li>
								<li>Right rail has Spredfast</li>
								<li>Watch live TVE dropdown appears</li>
								<li>News page loads along with sub nav</li>
								<li>Weather page loads along with sub nav</li>
								<li>Investigations page loads along with sub navs</li>
								<li>Entertainment page loads along with sub nav</li>
								<li>Traffic page loads</li>
								<li>Interactive radar loads map</li>
								<li>Contact us loads</li>
								<li>Connect dropdown appears</li>
								<li>TV listings page loads and functional</li>
								<li>Traffic page loads with map</li>
								<li>Check the listing tab to ensure the correct tab appears (Cozi for NBC)</li>
								<li>Check the listing tab to ensure the correct tab appears (Telexitos for TLM)</li>
								<li>Subsection/sub nav landing page loads</li>
								<li>Footer appears on all pages</li>
								<li>Icons in connect dropdown are clickable and linkout</li>
							</ul>';
						}
					?>
				<?php } ?>
			</div>
		</div>
	</div>
<?php include_once 'base/footer.php' ?>