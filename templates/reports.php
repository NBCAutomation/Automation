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