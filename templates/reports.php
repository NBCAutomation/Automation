<?php
// error_reporting(E_ALL);
// ini_set('display_errors', '1');
	include_once 'base/header.php';
 
	// Set default server time zone
	date_default_timezone_set('UTC');
	$usersTimezone = new DateTimeZone('America/New_York');
?>
	<div class="panel-body api_results">
		<?php if ($mainView) { ?>
			<ul>
				<li style="display: none;">
					<div class="panel panel-default">
						<div class="panel-heading">
							<i class="fa fa-folder" aria-hidden="true"></i>
							<a href="/reports/overview">Overview</a>
						</div>
						<div class="panel-body">
							<span class="note">Main overview screen displaying pass/fails for all tests.</span>
						</div>
					</div>
				</li>
				<li>
					<div class="panel panel-default">
						<div class="panel-heading">
							<i class="fa fa-folder" aria-hidden="true"></i>
							<a href="/reports/api_manifest_audits">Manifest Audits</a>
						</div>
						<div class="panel-body">
							<span class="note">Manifest Key/Value pair testing against scraped manifest dictionary values.</span>
						</div>
					</div>
				</li>
				<li>
					<div class="panel panel-default">
						<div class="panel-heading">
							<i class="fa fa-folder" aria-hidden="true"></i>
							<a href="/reports/api_navigation_audits">Navigation Audits</a>
						</div>
						<div class="panel-body">
							<span class="note">Manifest testing for App Navigation items. Case: Load manifest &gt; locate navigation block &gt; load and test all navigation links &gt; load endpoint and test JSON for validation.</span>
						</div>
					</div>
				</li>
				<li>
					<div class="panel panel-default">
						<div class="panel-heading">
							<i class="fa fa-folder" aria-hidden="true"></i>
							<a href="/reports/api_article_audits">Article/Content Audits</a>
						</div>
						<div class="panel-body">
							<span class="note"></span>
						</div>
					</div>
				</li>
				<li>
					<div class="panel panel-default">
						<div class="panel-heading">
							<i class="fa fa-folder" aria-hidden="true"></i>
							<a href="/reports/regression_tests">Regression Results</a>
						</div>
						<div class="panel-body">
							<span class="note">Saved output log of test results. Tests listed with most recent first.</span>
						</div>
					</div>
				</li>
				<li>
					<div class="panel panel-default">
						<div class="panel-heading">
							<i class="fa fa-folder" aria-hidden="true"></i>
							<a href="/reports/loadtimes">API Loadtimes</a>
						</div>
						<div class="panel-body">
							<span class="note">API Loadtimes overview.</span>
						</div>
					</div>
				</li>
			</ul>
		<?php } ?>
		<?php if ($reportsView) { ?>
			<?php 
				if ( strpos($view, 'manifest') ) {
					$testTypeFolder = 'manifest';
					$tableHeaders = '<th>Status</th><th>CSV</th><th>Property</th><th>ID</th><th>Expected Key</th><th>Expected Value</th><th>Live Key</th><th>Live Value</th><th>Failure</th><th>Test Date/Time</th>';

				} elseif ( strpos($view, 'nav') ) {
					$testTypeFolder = 'navigation';
					$tableHeaders = '<th>Status</th><th>CSV</th><th>Property</th><th>ID</th><th>Link</th><th>URL</th><th>HTTP Status Code</th><th>Info</th><th>Test Date/Time</th>';

				} elseif ( strpos($view, 'article') ) {
					$testTypeFolder = 'article';
					$tableHeaders = '<th>Status</th><th>CSV</th><th>Property</th><th>ID</th><th>Endpoint</th><th>Content ID</th><th>Content Title</th><th>Content Error</th><th>Test Date/Time</th>';
				}
			?>

			<div class="api_results">
				<div class="panel panel-default">
					<div class="panel-heading">Overview</div>
					<div class="panel-body">
						<div class="row">
							<div class="col-md-12">
								<div class="row">
									<div class="col-md-3">
										<div class="panel panel-default">
											<div class="panel-body bk-danger text-light">
												<div class="stat-panel text-center">
													<div class="stat-panel-number h1 "><?php echo $todayTotalErrors; ?></div>
													<div class="stat-panel-title text-uppercase">Error Reports</div>
												</div>
											</div>
										</div>
									</div>
									<div class="col-md-3">
										<div class="panel panel-default">
											<div class="panel-body bk-warning-alt text-light">
												<div class="stat-panel text-center">
													<div class="stat-panel-number h1 "><?php echo $todayTotalWarnings; ?></div>
													<div class="stat-panel-title text-uppercase">Warnings</div>
												</div>
											</div>
										</div>
									</div>
									<div class="col-md-3">
										<div class="panel panel-default">
											<div class="panel-body bk-primary text-light">
												<div class="stat-panel text-center">
													<div class="stat-panel-number h1 "><?php echo $yesterdayTotalErrors; ?></div>
													<div class="stat-panel-title text-uppercase">Errors Yesterday</div>
												</div>
											</div>
										</div>
									</div>
									<div class="col-md-3">
										<div class="panel panel-default">
											<div class="panel-body bk-info text-light">
												<div class="stat-panel text-center">
													<div class="stat-panel-number h1 "><?php echo $yesterdayTotalWarnings; ?></div>
													<div class="stat-panel-title text-uppercase">Warnings Yesterday</div>
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
				</ul>
				<br />
				<div class="tab-content">
					<div class="tab-pane fade active in" id="today_reports_tab">
						<div class="panel-body">
							<ul class="nav nav-tabs">
								<li class="active"><a href="#errors_tab" data-toggle="tab" aria-expanded="false"><i class="fa fa-exclamation" aria-hidden="true"></i> &nbsp;Errors</a></li>
								<li class=""><a href="#all_reports_tab" data-toggle="tab" aria-expanded="true"><i class="fa fa-file" aria-hidden="true"></i> &nbsp;All</a></li>
							</ul>
							<br>
							<div class="tab-content">
								<div class="tab-pane fade active in" id="errors_tab">
									<?php if ($todayFailureReports) { 
											Spire::returnFormattedDataTable($todayFailureReports, $view, $fullPath);
										} else {
											echo "No error reports currently.";
										}
									?>
								</div>
								<!-- // End errors tab -->
								<!-- // All reports tab -->
								<div class="tab-pane" id="all_reports_tab">
									<?php if ($todayReports) {
											Spire::returnFormattedDataTable($todayReports, $view, $fullPath);
										} else {
											echo "No error reports currently.";
										}
									?>
								</div>
								<!-- // End all reports tab -->
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
												Spire::returnFormattedDataTable($yesterdayFailureReports, $view, $fullPath);
											} else {
												echo "No error reports currently.";
											}
										?>
									</div>
									<!-- // End errors tab -->
									<!-- // All reports tab -->
									<div class="tab-pane" id="yesterday_all_reports_tab">
										<?php if ($yesterdayReports) { 
												Spire::returnFormattedDataTable($yesterdayReports, $view, $fullPath);
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
		<?php } ?>
		
		<?php if ($errorsView) { ?>
			<div class="api_results">
				<div class="panel panel-default">
					<div class="panel-heading">Error Reports</div>
					<div class="panel-body">
						<table border="0" cellspacing="5" cellpadding="5">
							<tbody>
								<tr>
									<td><p>Searching can be done with various combinations of text. For example [property] [date]</p></td>
								</tr>
							</tbody>
						</table>
						<hr />
						<table id="zctb" class="display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
							<thead>
								<tr>
									<th>Status</th>
									<th>CSV</th>
									<th>ID</th>
									<th>Test ID</th>
									<th>Property</th>
									<th>Created</th>
								</tr>
							</thead>
							<tfoot>
								<tr>
									<th>Status</th>
									<th>CSV</th>
									<th>ID</th>
									<th>Test ID</th>
									<th>Property</th>
									<th>Created</th>
								</tr>
							</tfoot>
							<tbody>
					<?php
						if ( strpos($view, 'manifest') ) {
							$testTypeFolder = 'manifest';
						} elseif ( strpos($view, 'nav') ) {
							$testTypeFolder = 'navigation';
						} elseif ( strpos($view, 'article') ) {
							$testTypeFolder = 'article';
						}

						foreach ($todayTotalFailureReports as $testReport) {
							$db = new DbHandler();
							// $testReportStatus = $db->checkForTestFailures($testReport['id'], $view);
							$testReportTime = date('n/d/Y, g:i A', strtotime($testReport['created']));

							$l10nDate = new DateTime($testReportTime);
							$l10nDate->setTimeZone($usersTimezone);
							// echo $l10nDate->format('Y-m-d H:i:s');


							$reportCSVDate =  date('n_j_Y', strtotime($testReport['created']));
							$reportCSVDateTime =  date('n_j_Y-H_i-A', strtotime($testReport['created']));

							$reportCSVFile = '/test_results/'.$view.'/'.$reportCSVDate.'/'.$testReport['property'].'_'.$testTypeFolder.'-audit_'.$reportCSVDateTime.'.csv';

							$fileLocation = urlencode($reportCSVFile);

						    echo '<tr class="report_row_status '.$testReportStatus.'">';
							    echo '<td><div class="report_status '.$testReportStatus.'">'.$testReportStatus.'</div></td>';
							    echo '<td><a href="/utils/download?file='.$fileLocation.'"><i class="fa fa-download" style="font-size:20px;"></i></a></td>';
							    echo '<td><a href="/reports/'.$view.'/record/'.$testReport['id'].'?refID='.$testReport['test_id'].'">'.$testReport['id'].'</a></td>';
							    echo '<td><a href="/reports/'.$view.'/record/'.$testReport['id'].'?refID='.$testReport['test_id'].'">'.$testReport['test_id'].'</a></td>';
							    echo '<td><a href="/reports/'.$view.'/record/'.$testReport['id'].'?refID='.$testReport['test_id'].'">'.$testReport['property'].'.com</a></td>';
							    // echo '<td><a href="/reports/'.$view.'/record/'.$testReport['id'].'?refID='.$testReport['test_id'].'">'.$testReportTime.'</a></td>';
							    echo '<td><a href="/reports/'.$view.'/record/'.$testReport['id'].'?refID='.$testReport['test_id'].'">'.$l10nDate->format('n/d/Y, g:i A').'</a></td>';
			                echo "</tr>";
						}
					?>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		<?php } ?>
<?php include_once 'base/footer.php' ?>