<?php
// error_reporting(E_ALL);
// ini_set('display_errors', '1');
	include_once 'base/header.php';

	// Set default server time zone
	date_default_timezone_set('UTC');
	$usersTimezone = new DateTimeZone('America/New_York');
?>
	<div class="panel-body api_results">
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
				// -- Regression Data View -- //
				if ($regressionData) {
					if ($fullReportData['failures'] > 0) {
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
						</ul>';
					}
				} else {
					// -- Article Data View -- //
					if ($articleData) {
						echo '<p class="text-muted small">Article Data</p>';
						echo '<p class="text-muted small"><i>Data will only be display when errors exist.</i></p>';

						$obj = json_decode($reportData, true);
						$reportFailures = $obj['testResults'];
						echo '<div class="panel panel-default">
								<div class="panel-heading">
									<h3 class="panel-title">Failure details</h3>
								</div>';
						echo '<div class="panel-body">';
						echo '<p class="text-muted small"><i> * Content ID\'s are clickable and will link to the CMS Search.</i></p>';

						foreach ($reportFailures as $thisReportKey => $thisReportValue) {	
							echo '<div class="panel panel-default">';
							
							if (strstr($thisReportKey, 'article_')) {
								$contentKeyName = explode("_", $thisReportKey);
								echo '<div class="panel-heading"><h4 class="panel-title"><a href="https://cms.clickability.com/cms?searchTab=contentTab&searchText='.$contentKeyName[1].'&action=consolidatedSearch" target="_blank">Content ID: '.$contentKeyName[1].'</a></h4></div>';
							} elseif (strstr($thisReportKey, 'endpointContentValidationError_')) {
								$endpointName = str_replace('_', ' ', str_replace('endpointContentValidationError_', '', $thisReportKey));
								echo '<div class="panel-heading"><h4 class="panel-title">Endpoint Name: <span class="endpointName">'.$endpointName.'</span></h4></div>';
							} else {
								echo '<div class="panel-heading"><h4 class="panel-title">Endpoint Failure: '.$thisReportKey.'</h4></div>';
							}

							echo '<div class="panel-body">';
							
							if (is_array($thisReportValue)) {
								echo '<ul>';
								foreach ($thisReportValue as $subReportKey => $subReportValue) {
									if (strstr($subReportValue, '// ')) {
										echo "<li>".str_replace('// ', '</li><li>', $subReportValue)."</li>";	
									} else {
										echo $subReportValue;
									}
								}
								echo '</ul>';
							} else {
								echo str_replace('// ', '<br />', $thisReportValue);
							}
							    
			             	echo '</div>
			             	</div>';
						}
						// Look up failure data and display it
			             	// $testReferenceID = $fullReportData['ref_test_id'];
			             	// $testResultID = $fullReportData['id'];
			             	
			             	// Spire::displayPayLoadError($testReferenceID, $testResultID);
						echo '</div></div>';
					} else {
						// var_dump($reportData);

						$obj = json_decode($reportData, true);
						$reportFailures = $obj['testResults'];
					?>
					<?php if (! is_array($obj['testResults'])): ?>
						<p><b><?php echo $obj['testStatus']; ?></b>: <?php echo $reportFailures; ?></p>

						<?php
							// Look up failure data and display it
							$testReferenceID = $fullReportData['ref_test_id'];
							$testResultID = $fullReportData['id'];
							
							Spire::displayPayLoadError($testReferenceID, $testResultID);
						?>

					<?php elseif (is_array($obj['testResults'])): ?>
						<!-- // Nav Report Data view --> 						
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
								foreach ($reportFailures as $thisReportKey => $thisReportValue) {
									echo "<tr>";
									echo "<td><div class=\"report_status fail\">Fail</div></td>";
									echo "<td>";
									

									if (strstr($thisReportKey, 'article_')) {
										$contentKeyName = explode("_", $thisReportKey);
										echo $contentKeyName[1];
									} else {
										echo $thisReportKey;
									}

									echo "</td>";


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
					<?php endif; ?>
			<?php
					}
				}
			?>
				
			<?php } ?>
			</div>
		<!-- // Overview Data view -->
		<?php if ($overView): ?>
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
		<?php endif; ?>
		<!-- // End: Overview Data view -->
		<!-- // All Report Data view -->
		<?php
			if ($allView) {
				echo "jeezy";
				if ($allReports) { 
					Spire::returnFormattedDataTable($allReports, $view, $fullPath);
				} else {
					echo "No error reports currently.";
				}
			}
		?>
		<!-- // End: All Report Data view -->
		<!-- // Regression Data view -->
		<?php  if ($regressionView): ?>
			<div class="api_results">
				<ul class="nav nav-tabs">
					<li class="active"><a href="#today_reports_tab" data-toggle="tab" aria-expanded="false">Recent Reports</a></li>
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
									<?php
										if ($todayFailureReports) {
											Spire::returnFormattedDataTable($todayFailureReports, $view);
										} else {
											echo "No error reports currently.";
										}
									?>
								</div>
								<div class="tab-pane" id="all_reports_tab">
									<?php
										if ($todayReports) {
											Spire::returnFormattedDataTable($todayReports, $view);
										} else {
											echo "No error reports currently.";
										}
									?>
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
		<?php endif; ?>
		<!-- // End: Regression Data view -->
<?php include_once 'base/footer.php' ?>