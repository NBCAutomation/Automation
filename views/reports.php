<?php include_once 'header.php'; ?>

	<h2 class="page-title"><?php echo $title; ?></h2>
	<div class="panel-body">
		<div class="api_results">
		<!-- // Main report table view -->
		<?php if ($mainView) { ?>
			<ul>
				<?php
					foreach ($results as $key => $val) {
					    echo "<li class=\"result file\"><a href=\"". $view ."/". $key ."/main\"><i class=\"fa fa-folder-o\"></i> " . $key . "</a></li>";
					}
				?>
			</ul>
		<?php } else if ($fileView) { ?>
			<ul>
				<?php foreach ($results as $key => $val) { ?>
    				<li class="result file">
    					<div>
    						<a href="<?php echo $linkPath . "/" . $val ?>">
    							<i class="fa fa-download"></i>
    						</a>
    					</div>
						<div>
							<a href="#">
								<i class="fa fa-envelope"></i>
							</a>
						</div>
						<div>
							<a href="#">
								<i class="fa fa-eye"></i>
							</a>
						</div>
						<div>
							<?php
								// $__report = $key ."]". $__key ."]" . $__subVal;
								// $__reportLink = urlencode($__report);
							?>
							<!--<a href="<?php echo $viewPath . "/" . $val; ?>"><?php echo $val; ?></a>-->
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

<?php include_once 'footer.php' ?>