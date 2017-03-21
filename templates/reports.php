<?php
// error_reporting(E_ALL);
// ini_set('display_errors', '1');
	include_once 'base/header.php';

	// Set default server time zone
	date_default_timezone_set('UTC');
	$usersTimezone = new DateTimeZone('America/New_York');
?>
	<div class="panel-body api_results">
		<?php if ($mainView) {
			?>
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
												Spire::returnFormattedDataTable($todayFailureReports, $view);
											} else {
												echo "No error reports currently.";
											}
										?>
									</div>
									<!-- // End errors tab -->
									<!-- // All reports tab -->
									<div class="tab-pane" id="all_reports_tab">
										<?php if ($todayReports) {
												Spire::returnFormattedDataTable($todayReports, $view);
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
			<?php
			} ?>
		
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
		
		<?php
			if ($singleView) {
				// Inidividual Report View
				// var_dump($viewType);
				// var_dump($reportData);
				// exit();
				
				$db = new DbHandler();

				switch ($viewType) {				    
				    case "apiManifestTest":
				        $tableHeaders = '<th>Status</th><th>Manifest Key</th><th>Expected Value</th><th>Live Value</th>';
				        $manifestData = true;
				        $testTypeFolder = 'manifest';
				        break;

				    case "apiNavTest":
				        $tableHeaders = '<th> Status</th><th>Link</th><th>URL (click to open)</th><th>HTTP Status Code</th><th>Info</th>';
				        $navData = true;
				        $testTypeFolder = 'navigation';
				        break;

			        case "regressionTest":
			            $tableHeaders = '<th> Status</th><th>Link</th><th>URL (click to open)</th><th>HTTP Status Code</th><th>Info</th>';
			            $regressionData = true;
			            break;

				    default:
				        $tableHeaders = '<th> Status</th><th>Endpoint</th><th>Content ID</th><th>Content Title</th><th>Content Error</th>';
				        $articleData = true;
				        $testTypeFolder = 'article';
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
		?>

			<div class="panel panel-primary">
				<div class="panel-heading">
					<h3 class="panel-title"><?php echo $thisPropertyName; ?>.com</h3>
				</div>
				<div class="panel-body">
					<?php if ($manifestData): ?>
						Endpoint: <a href="http://www.<?php echo $thisPropertyName; ?>.com/apps/news-app/navigation?apiVersion=6" target="_blank">http://www.<?php echo $thisPropertyName; ?>.com/apps/news-app/navigation?apiVersion=6</a>
					<?php endif ?>
					<p>Test completed: <?php echo $l10nDate->format('n/d/Y, g:i A'); ?></p>
					<?php
						if($regressionData) {
							echo '<ul>';
							echo '<li><b>Failures:</b> '.$fullReportData['failures'].'</li>';
							echo '</ul>';
						} else {
							
						}
					?>
				</div>
			</div>
			<?php if ($manifestData): ?>
				<p class="text-muted small"><i>* Note: If sub-nested value, the key/value is built using parent + child + grandchild relationship of dictionary items (ex: parent-key__child-key__grandChild-key).</i></p>
			<?php endif ?>
			
			<hr />

			<div class="panel">
				<?php

					if ($regressionData) {
						echo '<div class="panel panel-default">
							<div class="panel-heading">
								<h3 class="panel-title">Failure details</h3>
							</div>
							<div class="panel-body">';

						// var_dump(json_decode($reportData));
						$obj = json_decode($reportData, true);
						$reportFailures = $obj['testResults'];

						foreach ($reportFailures as $reportKey => $reportValue) {
							echo '<div class="panel panel-default">
								<div class="panel-heading">
									<h3 class="panel-title">'.$reportKey.'</h3>
								</div>';
							echo '<div class="panel-body">';

							if (is_array($reportValue)) {
								echo '<ul>';
								echo '<li>'.$reportValue['failure'].'</li>';
								echo '<li><i class="fa fa-file-image-o" aria-hidden="true"></i> <a href="'.$reportValue['screenshot'].'" target="_black">View screenshot</a></li>';
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
						if ($articleData) {
							echo "<p>Data will only be display when errors exist.</p>";
						}
				?>
						<p>Errors displayed first</p>
						<table class="report_data_table display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
							<thead>
								<tr>
									<?php echo $tableHeaders; ?>
								</tr>
							</thead>
							<tfoot>
								<tr>
									<?php echo $tableHeaders; ?>
								</tr>
							</tfoot>
							<tbody>
							<?php
								// var_dump($reportData);

								$obj = json_decode($reportData, true);
								$reportFailures = $obj['testResults'];
								
								foreach ($reportFailures as $thisReportKey => $thisReportValue) {
									echo "<tr>";
									echo "<td><div class=\"report_status fail\">Fail</div></td>";
									echo "<td>".$thisReportKey."</td>";

									if (is_array($thisReportValue)) {
										foreach ($thisReportValue as $subReportKey => $subReportValue) {
											// echo "<td>".$subReportKey."</td>";
											echo "<td>".$subReportValue."</td>";
										}
									} else {
										echo "paco taco gelato flako - supa hot fire";
									}
									    
					             	echo "</tr>";   
								}
							?>
							</tbody>
						</table>
				<?php
					}
				?>
				
			<?php } ?>
			</div>
		<?php if ($overView) { ?>
			<h3>Overview</h3>
			<p></p>
			<?php
				$db = new DbHandler();

				$recentTests = $db->getAllRecentTests();
				$firstArray = $recentTests['1'];

				// var_dump($firstArray['created']);
				$lastRunDT = date('n/d/Y, g:i A', strtotime($firstArray['created']));

				$l10nDate = new DateTime($lastRunDT);
				$l10nDate->setTimeZone($usersTimezone);

				echo 'Last run: '.$l10nDate->format('n/d/Y, g:i A');
				echo "<hr />";
			?>
			<p><i>Results displayed are from the past hour, the property/test endpoint is variable.</i></p>
			<table id="zctb" class="display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
				<thead>
					<tr>
						<th>Status</th>
						<th>ID</th>
						<th>API Test</th>
						<th>Test Property</th>
					</tr>
				</thead>
				<tfoot>
					<tr>
						<th>Status</th>
						<th>ID</th>
						<th>API Test</th>
						<th>Test Property</th>
					</tr>
				</tfoot>
				<tbody>
				<?php
					foreach ($recentTests as $testReport) {

						if (strpos($testReport['type'], 'manifest')) {
							$reportsURL = '/reports/api_manifest_audits';
						} elseif (strpos($testReport['type'], 'nav')) {
							$reportsURL = '/reports/api_navigation_audits';
						} elseif (strpos($testReport['type'], 'article')) {
							$reportsURL = '/reports/api_article_audits';
						}

						
						// $testReportStatus = $db->checkForTestFailures($testReport['id'], $testReport['type']);

					    echo '<tr class="report_row_status '.$testReportStatus.'">';
						    echo '<td><div class="report_status '.$testReportStatus.'">'.$testReportStatus.'</div></td>';
						    echo '<td><a href="'.$reportsURL.'">'.$testReport['id'].'</a></td>';
						    echo '<td><a href="'.$reportsURL.'">'.$testReport['type'].'</a></td>';
						    echo '<td><a href="'.$reportsURL.'">'.$testReport['property'].'</a></td>';
		                echo "</tr>";
					}
				?>
				</tbody>
			</table>

		<?php } ?>
		<?php if ($allView) {
			if ($allReports) { 
				Spire::returnFormattedDataTable($allReports, $view, $fullPath);
			} else {
				echo "No error reports currently.";
			}
		?>			
		<?php } ?>
		<?php 
			if ($regressionView) {
		?>
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
												Spire::returnFormattedDataTable($todayFailureReports, $view);
											} else {
												echo "No error reports currently.";
											}
										?>
									</div>
									<!-- // End errors tab -->
									<!-- // All reports tab -->
									<div class="tab-pane" id="all_reports_tab">
										<?php if ($todayReports) {
												Spire::returnFormattedDataTable($todayReports, $view);
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
		<?php
			}
		?>
<?php include_once 'base/footer.php' ?>