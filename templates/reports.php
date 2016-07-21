<?php include_once 'base/header.php'; ?>
	<div class="panel-body api_results">
	<?php if ($mainView) { ?>
		<h3>All reports</h3>
		
		<?php
			if ($results) {
				$d = date('n_d_Y');

				echo '<div class="panel panel-primary">
					<div class="panel-heading">
						<h3 class="panel-title">Today\'s Report</h3>
					</div>
					<div class="panel-body">
						<div class="api_results">
							<ul>
								<li class="result file"><a href="'. $view .'/'. $d .'/main"><i class="fa fa-folder-o"></i> ' . str_replace('_','/',$d) . '</a></li>
							</ul>
						</div>
					</div>
				</div><hr />';

				echo "<div class=\"api_results\">";
				echo "<ul>";

				$sorted = array_reverse($results);
				
				foreach ($sorted as $key => $val) {
				    echo "<li class=\"result file\"><a href=\"". $view ."/". $key ."/main\"><i class=\"fa fa-folder-o\"></i> " . str_replace('_','/',$key) . "</a></li>";
				}
				echo "</div>";
			} else { ?>
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
								<span class="note">Manifest testing for App Navigation items. Case: Load manifest > locate navigation block > load and test all navigation links > load endpoint and test JSON for validation.</span>
							</div>
						</div>
					</li>
					<li>
						<div class="panel panel-default">
							<div class="panel-heading">
								<i class="fa fa-folder" aria-hidden="true"></i> 
								<a href="/reports/api_article_audits">Article Audits</a>
								<!-- <span class="script_version">V2.0</span> -->
							</div>
							<div class="panel-body">
								<span class="note">Manifest testing for App article items. Case: Load manifest > locate navigation block > load and test all navigation links > load endpoint > grab article objects and test required keys.</span>
							</div>
						</div>
					</li>
				</ul>
		<?php } ?>
		
	<?php } else if ($fileView) { ?>
		<div class="api_results">
			<ul>
				<?php foreach ($results as $key => $val) { ?>
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
				<?php } ?>
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