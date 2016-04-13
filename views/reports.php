<?php include_once 'header.php' ?>
	<div class="row">
		<h2 class="lead"><?php echo $title; ?></h2>
	</div>
	<div class="row">
		<div class="api_results">
		<?php if ($view == 'main') { ?>
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
		<?php
		if ($view == 'single') {
			echo $reportData;
		}
		?>
		</div>		
	</div>

<?php include_once 'footer.php' ?>