<?php include_once './views/base/header.php' ?>
	<div class="panel-body scripts-library">
	<?php if ($mainView) { ?>
		<h3>Script Library</h3>
		<ul>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">
						<i class="fa fa-file" aria-hidden="true"></i> 
						<a href="/scripts/spire-run">spire-run.sh</a>
						<!-- <span class="script_version">V1.0</span> -->
					</div>
					<div class="panel-body">
						<span class="note">Bash script to run all automated test scripts. This script currently runs on a cron daily at 9:30 AM EST. If all sites are selected, this test can take up to 30 min to complete.</span>
					</div>
				</div>
			</li>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">
						<i class="fa fa-file" aria-hidden="true"></i> 
						<a href="/scripts/apiCheck-manifest">apiCheck-manifest.js</a>
						<!-- <span class="script_version">V2.0</span> -->
					</div>
					<div class="panel-body">
						<span class="note">Case: Test API main manifest file to verify main key/values against the manifest dictionary files, to verify that the necessary values are present to allow the app to function correctly.</span>
					</div>
				</div>
			</li>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">
						<i class="fa fa-file" aria-hidden="true"></i> 
						<a href="/scripts/apiCheck-nav">apiCheck-nav.js</a>
						<!-- <span class="script_version">V2.0</span> -->
					</div>
					<div class="panel-body">
						<span class="note">Case: Grab the main app navigation urls from the manifest endpoint. Test each link for correct 200 response, if response is not an error, validate JSON. Some navigation endpoints return set as Text/HTML in the header, when this happens, the test may fail and provide a False/Postive, these items will need to be tested manually.</span>
					</div>
				</div>
			</li>
		</ul>
	<?php } ?>
	<?php if ($scriptView) { ?>
		<h3><?php echo $view ?></h3>

		<div class="panel panel-default">
			<?php include_once './views/base/script_config.php' ?>
		</div>
	<?php } ?>
	<?php if ($scriptRunView) { ?>
		<h3><?php echo $view ?></h3>

		<div class="panel panel-default">
			<div class="panel-heading">Running Script...</div>
			<div class="panel-body">
				<div class="progress progress-striped active">
					<div class="progress-bar" style="width: 100%"></div>
				</div>
				<div class="process-data">
					<?php
						
						$bashOutput = array('1[33m','[33m','[32;1m','[37;41;1m','[36m','[37;43;1m','[37;46;1m','[0m');
						$bashOutputStyle = array('<span class="consoleOutput orange">','<span class="consoleOutput orange">','<span class="consoleOutput green">','<span class="consoleOutput red">','<span class="consoleOutput blue">','<span style="display: none;">','<span class="consoleOutput">','</span>');

						$output = shell_exec($execCmd);
						
						$lines = split("[\r|\n]", trim($output));
						array_shift($lines);
						echo "<table class=\"table table-bordered table-striped\">";
						foreach($lines as $drive) {
						    $formattedText = str_replace($bashOutput, $bashOutputStyle, $drive);
						    echo "<tr><td>".$formattedText."</td></tr>";
						}
						echo "</table>";
						echo shell_exec($delCmd);
						
					?>
				</div>	
			</div>
		</div>
	<?php } ?>
	</div>
<?php include_once './views/base/footer.php' ?>