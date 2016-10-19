<?php
	include_once 'base/header.php';

	// Set default server time zone
	date_default_timezone_set('UTC');
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
						<span class="note">Manifest Key/Value pair testing against pre-defined manifest dictionary files <a href="https://goo.gl/77NtUc" target="_blank">https://goo.gl/77NtUc</a>.</span>
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
													<div class="stat-panel-number h1 "><?php echo $todayTotalFailures; ?></div>
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
				<!-- <div class="panel panel-default"> -->
					<!-- <div class="panel-body"> -->
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
										<li class=""><a href="#warnings_tab" data-toggle="tab" aria-expanded="true"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> &nbsp;Warnings</a></li>
										<li class=""><a href="#all_reports_tab" data-toggle="tab" aria-expanded="true"><i class="fa fa-file" aria-hidden="true"></i> &nbsp;All</a></li>
									</ul>
									<br>
									<div class="tab-content">
										<div class="tab-pane fade active in" id="errors_tab">
											<?php if ($todayTotalFailureReports) { ?>
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
													<?php Spire::returnFormattedDataTable($todayTotalFailureReports, $view); ?>	
												</tbody>
											</table>
											<?php
												} else {
													echo "No error reports currently.";
												}
											?>
										</div>
										<!-- // End errors tab -->
										<!-- Warnings tab -->
										<div class="tab-pane" id="warnings_tab">
											<?php if ($todayTotalWarningReports) { ?>
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
													<?php Spire::returnFormattedDataTable($todayTotalWarningReports, $view); ?>
												</tbody>
											</table>
											<?php
												} else {
													echo "No warnings currently.";
												}
											?>
										</div>
										<!-- // End warnings tab -->
										<!-- // All reports tab -->
										<div class="tab-pane" id="all_reports_tab">
											<table class="data_table display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
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
													<?php Spire::returnFormattedDataTable($todayReports[0], 'all', $view); ?>
												</tbody>
											</table>	
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
											<li class=""><a href="#yesterday_warnings_tab" data-toggle="tab" aria-expanded="true"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> &nbsp;Warnings</a></li>
											<li class=""><a href="#yesterday_all_reports_tab" data-toggle="tab" aria-expanded="true"><i class="fa fa-file" aria-hidden="true"></i> &nbsp;All</a></li>
										</ul>
										<br>
										<div class="tab-content">
											<div class="tab-pane fade active in" id="yesterday_errors_tab">
												<?php if ($yesterdayTotalFailureReports) { ?>
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
														<?php Spire::returnFormattedDataTable($yesterdayTotalFailureReports, $view); ?>	
													</tbody>
												</table>
												<?php
													} else {
														echo "No error reports currently.";
													}
												?>
											</div>
											<!-- // End errors tab -->
											<!-- Warnings tab -->
											<div class="tab-pane" id="yesterday_warnings_tab">
												<?php if ($yesterdayTotalWarningReports) { ?>
												<table class="data_table display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
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
														<?php Spire::returnFormattedDataTable($yesterdayTotalWarningReports, $view); ?>
													</tbody>
												</table>
												<?php
													} else {
														echo "No warnings currently.";
													}
												?>
											</div>
											<!-- // End warnings tab -->
											<!-- // All reports tab -->
											<div class="tab-pane" id="all_reports_tab">
												<table class="data_table display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
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
														<?php Spire::returnFormattedDataTable($yesterdayReports[0], 'all', $view); ?>
													</tbody>
												</table>	
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
					<!-- </div>					 -->
				<!-- </div> -->
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

						$usersTimezone = new DateTimeZone('America/New_York');
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
			
			$db = new DbHandler();

			switch ($viewType) {
			    
			    case "apiCheck-manifest":
			        $tableHeaders = '<th>Status</th><th>Expected Key</th><th>Expected Value</th><th>Live Key</th><th>Live Value</th><th>Info</th><th>API Version</th>';
			        $manifestData = true;
			        $testTypeFolder = 'manifest';
			        break;

			    case "apiCheck-nav":
			        $tableHeaders = '<th> Status</th><th>Link</th><th>URL (click to open)</th><th>HTTP Status Code</th><th>Info</th>';
			        $navData = true;
			        $testTypeFolder = 'navigation';
			        break;

			    default:
			        $tableHeaders = '<th> Status</th><th>Endpoint</th><th>Content ID</th><th>Content Title</th><th>Content Error</th>';
			        $articleData = true;
			        $testTypeFolder = 'article';
			}

			$testReportTime = date('n/d/Y, g:i A', strtotime($reportPropertyData['created']));

			$usersTimezone = new DateTimeZone('America/New_York');
			$l10nDate = new DateTime($testReportTime);
			$l10nDate->setTimeZone($usersTimezone);

			$reportCSVDate =  date('n_j_Y', strtotime($reportPropertyData['created']));
			$reportCSVDateTime =  date('n_j_Y-g_i-A', strtotime($reportPropertyData['created']));

			$reportCSVFile = '/test_results/'.$viewPath.'/'.$reportCSVDate.'/'.$reportPropertyData['property'].'_'.$testTypeFolder.'-audit_'.$reportCSVDateTime.'.csv';

			$fileLocation = urlencode($reportCSVFile);
	?>

		<div class="panel panel-primary">
			<div class="panel-heading">
				<h3 class="panel-title"><?php echo $reportPropertyData['property']; ?>.com</h3>
			</div>
			<div class="panel-body">
				<!-- <h3><?php echo $reportPropertyData['property']; ?>.com</h3> -->
				<p>Test completed: <?php echo $l10nDate->format('n/d/Y, g:i A'); ?></p>
				<a href="/utils/download?file=<?php echo $fileLocation; ?>"><i class="fa fa-download" style="font-size:20px;"></i> Download report</a>	
			</div>
		</div>
		
		<hr />

		<div class="panel-body">
			<p>Errors displayed first</p>
			<?php 
				if ($articleData) {
					echo "<p>Data will only be display when errors exist.</p>";
				}

			?>
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
					foreach ($reportData as $thisReport) {

					    echo '<tr class="report_row_status '.strtolower($thisReport->status).'">';
					    echo '<td><div class="report_status '.strtolower($thisReport->status).'">'.$thisReport->status.'</div></td>';

					    if ($manifestData) {
						    echo '<td>'.$thisReport->expected_key.'</td>';
						    echo '<td>'.$thisReport->expected_value.'</td>';
						    echo '<td>'.$thisReport->live_key.'</td>';
						    echo '<td>'.$thisReport->live_value.'</td>';
						    echo '<td>'.$thisReport->info.'</td>';
						    echo '<td>'.$thisReport->api_version.'</td>';
					    } elseif ($navData) {
						    echo '<td>'.$thisReport->link_name.'</td>';
						    echo '<td><a href="'.$thisReport->link_url.'" target="_blank">'.$thisReport->link_url.'</a></td>';
						    echo '<td>'.$thisReport->status_code.'</td>';
						    echo '<td>'.$thisReport->info.'</td>';
					    } elseif ($articleData) {
						    echo '<td>'.$thisReport->endpoint.'</td>';
						    echo '<td>'.$thisReport->content_id.'</td>';
						    echo '<td>'.$thisReport->content_title.'</td>';
						    echo '<td>'.$thisReport->content_error.'</td>';
					    }
						    
		                echo "</tr>";
					}
				?>
				</tbody>
			</table>
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

			$usersTimezone = new DateTimeZone('America/New_York');
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
	<?php
		if ($allView) {
			$db = new DbHandler();

			switch ($viewType) {
			    
			    case "apiCheck-manifest":
			        $tableHeaders = '<th>Status</th><th>Expected Key</th><th>Expected Value</th><th>Live Key</th><th>Live Value</th><th>Info</th><th>API Version</th>';
			        $manifestData = true;
			        $testTypeFolder = 'manifest';
			        break;

			    case "apiCheck-nav":
			        $tableHeaders = '<th> Status</th><th>Link</th><th>URL (click to open)</th><th>HTTP Status Code</th><th>Info</th>';
			        $navData = true;
			        $testTypeFolder = 'navigation';
			        break;

			    default:
			        $tableHeaders = '<th> Status</th><th>Endpoint</th><th>Content ID</th><th>Content Title</th><th>Content Error</th>';
			        $articleData = true;
			        $testTypeFolder = 'article';
			}

			$testReportTime = date('n/d/Y, g:i A', strtotime($reportPropertyData['created']));

			$usersTimezone = new DateTimeZone('America/New_York');
			$l10nDate = new DateTime($testReportTime);
			$l10nDate->setTimeZone($usersTimezone);

			$reportCSVDate =  date('n_j_Y', strtotime($reportPropertyData['created']));
			$reportCSVDateTime =  date('n_j_Y-g_i-A', strtotime($reportPropertyData['created']));

			$reportCSVFile = '/test_results/'.$viewPath.'/'.$reportCSVDate.'/'.$reportPropertyData['property'].'_'.$testTypeFolder.'-audit_'.$reportCSVDateTime.'.csv';

			$fileLocation = urlencode($reportCSVFile);
	?>
	<div class="api_results">
		<table class="data_table display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
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
				//var_dump($reportData);
				Spire::returnFormattedDataTable($reportData[0], 'all', $viewPath); ?>
			</tbody>
		</table>	
	<?php } ?>
	</div><!-- panel-body api_results -->

<?php include_once 'base/footer.php' ?>