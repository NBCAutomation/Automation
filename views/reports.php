<?php include_once './views/base/header.php'; ?>
	<div class="panel-body">
		<div class="api_results">
		<!-- // Main report table view -->
		<?php if ($mainView) { ?>
			<ul>
				<?php
					if ($results) {
						foreach ($results as $key => $val) {
						    echo "<li class=\"result file\"><a href=\"". $view ."/". $key ."/main\"><i class=\"fa fa-folder-o\"></i> " . str_replace('_','/',$key) . "</a></li>";
						}	
					} else {
						echo "<p>Currently there are no results to display.</p>";
					}
				?>
			</ul>
		<?php } else if ($fileView) { ?>
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
		<?php
		}
		if ($singleView) {
			echo $reportData;
		}
		?>
		</div>		
	</div>

<?php include_once './views/base/footer.php' ?>