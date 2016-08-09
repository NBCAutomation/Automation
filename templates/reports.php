<?php include_once 'base/header.php'; ?>
	<div class="panel-body api_results">
	<?php if ($mainView) { ?>
		<h3></h3>
		
		<ul>
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
		</ul>
		
		<?php
			if ($results) {
				$d = date('n_d_Y');
		?>

				<div class="panel panel-primary">
					<div class="panel-heading">
						<h3 class="panel-title">Today's Report</h3>
					</div>
					<div class="panel-body">
						<div class="api_results">
							<ul>
								<li class="result file"><a href="<?php echo $view .'/'. $d; ?>/main"><i class="fa fa-folder-o"></i><?php str_replace('_','/',$d) ?></a></li>
							</ul>
						</div>
					</div>
				</div><hr />

				
				<div class="api_results">
					<div class="panel panel-default">
						<div class="panel-heading">Reports</div>
						<div class="panel-body">
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
							foreach ($results as $testReport) {
								$db = new DbHandler();
								$testReportStatus = $db->checkForTestFailures($testReport['id'], $view);

							    echo '<tr class="report_row_status '.$testReportStatus.'">';
								    echo '<td><a href="#"><div class="report_status '.$testReportStatus.'">'.$testReportStatus.'</div></a></td>';
								    echo '<td><a href="#"><i class="fa fa-download" style="font-size:20px;"></i></a></td>';
								    echo '<td><a href="#">'.$testReport['id'].'</a></td>';
								    echo '<td><a href="#">'.$testReport['test_id'].'</a></td>';
								    echo '<td><a href="#">'.$testReport['property'].'</a></td>';
								    echo '<td><a href="#">'.$testReport['created'].'</a></td>';
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
		
	<?php } else if ($fileView) { ?>
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
		echo $reportData;
	}
	?>
	</div>

<?php include_once 'base/footer.php' ?>