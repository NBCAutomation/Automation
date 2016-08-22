<?php include_once 'base/header.php'; ?>
	<div class="panel-body api_results">
	<?php if ($mainView) {
		?>
		<h3></h3>
		
		<ul>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">
						<i class="fa fa-folder" aria-hidden="true"></i> 
						<a href="/reports/overview">Overview</a>
						<!-- <span class="script_version">V2.0</span> -->
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
						<!-- <span class="script_version">V2.0</span> -->
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
						<!-- <span class="script_version">V2.0</span> -->
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
						<!-- <span class="script_version">V2.0</span> -->
					</div>
					<div class="panel-body">
						<span class="note"></span>
					</div>
				</div>
			</li>
		</ul>
	<?php } ?>
	<?php
		if ($reportsView) {
	?>
			<!-- date range search - https://datatables.net/examples/plug-ins/range_filtering.html -->
			<div class="api_results">
				<div class="panel panel-default">
					<div class="panel-heading">Reports</div>
					<div class="panel-body">
						<h5>Date filter</h5>
						<table border="0" cellspacing="5" cellpadding="5">
							<tbody>
								<tr>
									<td>Starting Date:</td>
									<td>Ending Date:</td>
								</tr>
								<tr>
									<td><input type="text" id="min" name="min"></td>
									<td><input type="text" id="max" name="max"></td>
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

						foreach ($results as $testReport) {
							$db = new DbHandler();
							$testReportStatus = $db->checkForTestFailures($testReport['id'], $view);
							$testReportTime = date('n/d/Y, g:i A', strtotime($testReport['created']));

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
							    echo '<td><a href="/reports/'.$view.'/record/'.$testReport['id'].'?refID='.$testReport['test_id'].'">'.$testReportTime.'</a></td>';
			                echo "</tr>";
						}
					?>
							</tbody>
						</table>
					</div>
				</div>

		<?php
		} else { ?>
			
	<?php } ?>
		
	<?php if ($fileView) { ?>
		<div class="api_results">
			<ul>
				<!--<?php foreach ($results as $key => $val) { ?>
					<li class="result file">
						<div>
							<a href="<?php echo $linkPath . "/" . $val ?>" download>
								<i class="fa fa-download"></i>
							</a>
						</div>
						<div>
							<a href="#">
								<i class="fa fa-envelope"></i>
							</a>
						</div>
						<div>
							<a href="<?php echo $val; ?>">
								<i class="fa fa-eye"></i>
							</a>
						</div>
						<div>
							<a href="<?php echo $val; ?>"><?php echo $val; ?></a>
						</div>
					</li>
				<?php } ?>-->
			</ul>
		</div>
	<?php
	}
	if ($singleView) {
		$db = new DbHandler();

		switch ($viewType) {
		    
		    case "apiCheck-manifest":
		        $tableHeaders = '<th>Status</th><th>Expected Key</th><th>Expected Value</th><th>Live Key</th><th>Live Value</th><th>Info</th><th>API Version</th>';
		        $manifestData = true;
		        break;

		    case "apiCheck-nav":
		        $tableHeaders = '<th> Status</th><th>Link</th><th>URL</th><th>HTTP Status Code</th><th>Info</th>';
		        $navData = true;
		        break;

		    default:
		        $tableHeaders = '<th> Status</th><th>Endpoint</th><th>Content ID</th><th>Content Title</th><th>Content Error</th>';
		        $articleData = true;
		}
	?>
		<p>Errors displayed first</p>
		<?php 
			if ($articleData) {
				echo "<p>Data will only be display when errors exist.</p>";
			}

		?>
		<table id="report-table" class="display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
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

				foreach ($reportData as $thisReport) {
					
					$testReportStatus = $db->checkForTestFailures($reportID, $viewType);

				    echo '<tr class="report_row_status '.strtolower($thisReport['status']).'">';
					    echo '<td><div class="report_status '.strtolower($thisReport['status']).'">'.$thisReport['status'].'</div></td>';

					    if ($manifestData) {
						    echo '<td>'.$thisReport['expected_key'].'</td>';
						    echo '<td>'.$thisReport['expected_value'].'</td>';
						    echo '<td>'.$thisReport['live_key'].'</td>';
						    echo '<td>'.$thisReport['live_value'].'</td>';
						    echo '<td>'.$thisReport['info'].'</td>';
						    echo '<td>'.$thisReport['api_version'].'</td>';
					    } elseif ($navData) {
						    echo '<td>'.$thisReport['link_name'].'</td>';
						    echo '<td>'.$thisReport['link_url'].'</td>';
						    echo '<td>'.$thisReport['status_code'].'</td>';
						    echo '<td>'.$thisReport['info'].'</td>';
					    } elseif ($articleData) {
						    echo '<td>'.$thisReport['endpoint'].'</td>';
						    echo '<td>'.$thisReport['content_id'].'</td>';
						    echo '<td>'.$thisReport['content_title'].'</td>';
						    echo '<td>'.$thisReport['content_error'].'</td>';
					    }
					    
	                echo "</tr>";
				}
			?>
			</tbody>
		</table>
	<?php 
	}
	?>
	<?php if ($overView) { ?>
		<h3>Overview</h3>
		<p></p>
		<?php
			$db = new DbHandler();

			$recentTests = $db->getAllRecentTests();
			$firstArray = $recentTests['1'];

			// var_dump($firstArray['created']);
			$lastRunDT = date('n/d/Y, g:i A', strtotime($firstArray['created']));

			echo 'Last run: '.$lastRunDT;
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

					
					$testReportStatus = $db->checkForTestFailures($testReport['id'], $testReport['type']);

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
	</div><!-- panel-body api_results -->

<?php include_once 'base/footer.php' ?>