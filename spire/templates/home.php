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
										<div class="stat-panel-number h2"><?php echo $todayManifestTotalFailureReports; ?></div>
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
										<div class="stat-panel-number h2"><?php echo $todayNavTotalFailureReports; ?></div>
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
										<div class="stat-panel-number h2"><?php echo $todayContentTotalFailureReports; ?></div>
										<div class="stat-panel-title text-uppercase">Content errors</div>
									</div>
								</div>
								<a href="/reports/api_article_audits" class="block-anchor panel-footer text-center">See Reports &nbsp; <i class="fa fa-arrow-right"></i></a>
							</div>
						</div>
						<div class="col-xs-6 col-sm-3">
							<div class="panel panel-default">
								<div class="panel-body text-light <?php if ( $todayOTTTotalFailureReports > 0 ){ echo 'bk-danger'; } else { echo 'bk-success'; } ?>">
									<div class="stat-panel text-center">
										<div class="stat-panel-number h2"><?php echo $todayOTTTotalFailureReports; ?></div>
										<div class="stat-panel-title text-uppercase">OTT errors</div>
									</div>
								</div>
								<a href="/reports/ott_tests" class="block-anchor panel-footer text-center">See Reports &nbsp; <i class="fa fa-arrow-right"></i></a>
							</div>
						</div>
					</div>
					<p class="text-muted small">* Note: totals are at current UTC server time: <?php echo $serverTimeStamp; ?> </p>
				</div>
			</div>
		</div>
		<?php if ($messages){
			?>
			<?php if ( $message_e == true ){ ?>
				<div class="alert alert-dismissible alert-danger">
					<button type="button" class="close" data-dismiss="alert"><i class="fa fa-remove"></i></button>
					<h4>Warning!</h4>
					<p><?php echo $messages; ?>.</p>
				</div>
			<?php } else { ?>
				<div class="alert alert-dismissible alert-success">
					<button type="button" class="close" data-dismiss="alert"><i class="fa fa-remove"></i></button>
					<h4>Success!</h4>
					<p><?php echo $messages; ?></p>
				</div>
			<?php } ?>
		<?php } ?>
		<?php
			if (strlen($recentAlerts['data']['info']) > 0 && $recentAlerts['data']['sendable'] == 0) {
				echo '<div class="alert alert-dismissible alert-info"><p class="text-muted small">'.$recentAlerts['data']['info'].'</p></div>';
			}
		
		if ($recentAlerts['data']['sendable'] > 0): ?>
			<div class="apiNotificationError">
				<form action="/dashboard/clear-alert" method="post" id="notification-alert-form" class="mt">
					<input type="hidden" value="<?php echo $recentAlerts['data']['id']; ?>" name="alertID" />
					<input type="hidden" value="clearNotification" name="task" />
					<input type="hidden" value="<?php echo $recentAlerts['refCacheKey']; ?>" name="refCacheLocation" />
					<input type="hidden" value="set" name="method" />
					<input type="hidden" value="true" name="submitted" />
					<button id="clear-notification"  class="btn btn-primary btn-block" type="submit" value="Submit" name="submit"><i class="fa fa-bell-slash" style="font-size:20px;" alt="Disable"></i> Mute email notification</button>

					<br/>
					<p class="text-muted small">* Mute email notification for recent alert. Will re-enable on additional/new errors. </p>
				</form>
			</div>
		<?php endif ?>
		<hr />
		<div class="panel panel-default">
			<div class="panel-heading"><i class="fa fa-clock-o"></i> Average loadtimes today</div>
			<div class="panel-body">
				<div class="row">
					<div class="col-md-12">
						<div class="row">
							<div class="col-md-2">
								<div class="panel panel-default">
									<div class="panel-body loadTime_manifest text-light">
										<div class="stat-panel text-center">
											<div class="stat-panel-number h4 "><?php echo round($apiManifestTestLoadTime); ?> ms</div>
											<div class="stat-panel-title text-uppercase">Manifest</div>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-2">
								<div class="panel panel-default">
									<div class="panel-body loadTime_navigation text-light">
										<div class="stat-panel text-center">
											<div class="stat-panel-number h4 "><?php echo round($apiNavTestLoadTime); ?> ms</div>
											<div class="stat-panel-title text-uppercase">Navigation</div>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-2">
								<div class="panel panel-default">
									<div class="panel-body loadTime_section text-light">
										<div class="stat-panel text-center">
											<div class="stat-panel-number h4 "><?php echo round($apiSectionContentLoadTime); ?> ms</div>
											<div class="stat-panel-title text-uppercase">Section</div>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-2">
								<div class="panel panel-default">
									<div class="panel-body loadTime_content text-light">
										<div class="stat-panel text-center">
											<div class="stat-panel-number h4 "><?php echo round($apiContentTestLoadTime); ?> ms</div>
											<div class="stat-panel-title text-uppercase">Content</div>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-2">
								<div class="panel panel-default">
									<div class="panel-body loadTime_ott text-light">
										<div class="stat-panel text-center">
											<div class="stat-panel-number h4 "><?php echo round($apiOTTTestLoadTime); ?> ms</div>
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
		<hr />
		<div class="panel panel-default">
			<div class="panel-heading">Average API Endpoint Loadtime DTD</div>
			<div class="panel-body">
				<p class="text-muted small">* 4/24/17 - Updated all loadtimes scripts to pull listner/network times (resource requested vs resource received). </p>
				<div>
					<p><a href="/reports/loadtimes"><i class="fa fa-line-chart"></i> See current loadtimes</a></p>
				</div>
				<hr />
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
<?php include_once 'base/footer.php' ?>