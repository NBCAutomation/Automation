<?php
	include_once 'header.php';

	if ($view == 'single') {
		$singleView = true;
	} elseif ($view == 'main') {
		$mainView = true;
	}
?>

	<h2 class="page-title"><?php echo $title; ?></h2>
	<div class="panel-body">
		<div class="api_results">
		<!-- // Main report table view -->
		<?php if ($mainView) { ?>
			<ul>
				<?php
					foreach ($results as $key => $val) {
					    echo "<li>" . $key;

					    if ( is_array($val) ) {
					    	echo "<ul>";
					    	foreach ($val as $__key => $__val) {
					    		echo "<li>" . $__key;

					    		if ( is_array($__val) ) {
					    			echo "<ul>";
					    			foreach ($__val as $__subKey => $__subVal) {
					    			?>
					    				<li class="result file">
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
												<a href=<?php echo "/test_results/". $key ."". $__key ."/" . $__subVal; ?>
													<i class="fa fa-download"></i>
												</a>
											</div>
											<div>
												<?php
													$__report = $key ."]". $__key ."]" . $__subVal;
													$__reportLink = urlencode($__report);
												?>
												<a href="/reports/single/<?php echo $__reportLink; ?>"><?php echo $__subVal; ?></a>
											</div>
					    				</li>
					    			<?php }
					    			echo "</ul>";
					    		}
					    		echo "</li>";
					    	}
					    	echo "</ul>";
					    }
					    echo "</li>";
					}
				?>
			</ul>
		<?php } ?>

		<!-- // Single report view -->
		<?php
		if ($singleView) {
			echo $reportData;
		}
		?>
		</div>		
	</div>

<?php include_once 'footer.php' ?>