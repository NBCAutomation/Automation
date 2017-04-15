<?php include_once 'base/header.php'; ?>
<?php
// todayManifestTotalFailureReports
// todayManifestTotalWarningReports
// todayNavTotalFailureReports
// todayNavTotalWarningReports
// todayContentTotalFailureReports
// todayContentTotalWarningReports
?>
	<div class="panel-body">
		<?php if ($user) { ?>
			<h4>Welcome, <?php echo $user['first_name']; ?></h4>
			<hr />
		<?php } ?>
		<div class="panel panel-default">
			<div class="panel-heading">Today's Failures/Errors</div>
			<div class="panel-body">
				<div class="col-md-12">
					<div class="row">
						<div class="col-xs-6 col-sm-3">
							<div class="panel panel-default">
								<div class="panel-body text-light <?php if ( $todayManifestTotalFailureReports > 0 ){ echo 'bk-danger'; } else { echo 'bk-success'; } ?>">
									<div class="stat-panel text-center">
										<div class="stat-panel-number h1 "><?php echo $todayManifestTotalFailureReports; ?></div>
										<div class="stat-panel-title text-uppercase">Manifest errors</div>
									</div>
								</div>
								<a href="/reports/api_manifest_audits" class="block-anchor panel-footer text-center">See Reports &nbsp; <i class="fa fa-arrow-right"></i></a>
							</div>
						</div>
						<div class="col-xs-6 col-sm-3">
							<div class="panel panel-default">
								<div class="panel-body text-light <?php if ( $todayNavTotalFailureReports > 0 ){ echo 'bk-danger'; } else { echo 'bk-success'; } ?>">
									<div class="stat-panel text-center">
										<div class="stat-panel-number h1 "><?php echo $todayNavTotalFailureReports; ?></div>
										<div class="stat-panel-title text-uppercase">Navigation Errors</div>
									</div>
								</div>
								<a href="/reports/api_navigation_audits" class="block-anchor panel-footer text-center">See Reports &nbsp; <i class="fa fa-arrow-right"></i></a>
							</div>
						</div>
						<div class="col-xs-6 col-sm-3">
							<div class="panel panel-default">
								<div class="panel-body text-light <?php if ( $todayContentTotalFailureReports > 0 ){ echo 'bk-danger'; } else { echo 'bk-success'; } ?>">
									<div class="stat-panel text-center">
										<div class="stat-panel-number h1 "><?php echo $todayContentTotalFailureReports; ?></div>
										<div class="stat-panel-title text-uppercase">Content errors</div>
									</div>
								</div>
								<a href="/reports/api_article_audits" class="block-anchor panel-footer text-center">See Reports &nbsp; <i class="fa fa-arrow-right"></i></a>
							</div>
						</div>
					</div>
					<p class="text-muted small">* Note: totals are at current UTC server time: <?php echo $serverTimeStamp; ?> </p>
				</div>
			</div>
		</div>
		<div class="panel panel-default">
			<div class="panel-heading">Average API Endpoint Loadtime (uncached)</div>
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
<?php include_once 'base/footer.php' ?>