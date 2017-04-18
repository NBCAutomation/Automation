<?php include_once 'base/header.php' ?>
	<div class="panel-body scripts-library">
	<?php if ($mainView) { ?>
		<h3>Script Library</h3>
		<ul>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">
						<i class="fa fa-file" aria-hidden="true"></i> 
						<a href="/scripts/regressionTest">regressionTest.js</a>
					</div>
					<div class="panel-body">
						<span class="note">Manully run regression test. Tests the following list:</span>
						
						<ul class="defaultList">
							<li>Logo is clickable</li>
							<li>Weather module appears on HP and map loads</li>
							<li>Right rail has Spredfast</li>
							<li>Watch live TVE dropdown appears</li>
							<li>News page loads along with sub nav</li>
							<li>Weather page loads along with sub nav</li>
							<li>Investigations page loads along with sub navs</li>
							<li>Entertainment page loads along with sub nav</li>
							<li>Traffic page loads</li>
							<li>Interactive radar loads map</li>
							<li>Contact us loads</li>
						</ul>

						<span class="note">will also load check telexitos and cozi</span>
					</div>
				</div>
			</li>
		</ul>
		<hr />
		<ul>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">
						<i class="fa fa-file" aria-hidden="true"></i> 
						<a href="/scripts/spire-run">spire-run.sh</a>
					</div>
					<div class="panel-body">
						<span class="note">Bash script is set to run automated test scripts every 4 hours.</span>
					</div>
				</div>
			</li>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">
						<i class="fa fa-file" aria-hidden="true"></i> 
						<a href="/scripts/apiCheck-manifest">apiCheck-manifest.js</a>
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
					</div>
					<div class="panel-body">
						<span class="note">Case: Grab the main app navigation urls from the manifest endpoint. Test each link for correct 200 response, if response is not an error, validate JSON. Some navigation endpoints return set as Text/HTML in the header, when this happens, the test may fail and provide a False/Postive, these items will need to be tested manually.</span>
					</div>
				</div>
			</li>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">
						<i class="fa fa-file" aria-hidden="true"></i> 
						<a href="/scripts/apiCheck-nav">apiCheck-article.js</a>
					</div>
					<div class="panel-body">
						<p class="note">Case: Grab the main app navigation urls from the manifest endpoint. Test each link for correct 200 response, if response is not an error, spider each of the content objects within the JSON file and check for errors. </p>
						<p>Will only log errors/fails</p>
					</div>
				</div>
			</li>
		</ul>
	<?php } ?>
	<?php if ($scriptView) { ?>
		<h3><?php echo $view ?></h3>

		<div class="panel panel-default">
		<?php
			if($view == 'regressionTest' || $view == 'updateDictionaries' || $user['first_name'] == 'Deltrie'){
				include_once 'base/script_config.php';
			} else {
				echo '<div class="panel-body"><span><b>Script set to run on cron every 4 hours, manual starting/testing is disabled.</b></span></div>';
			}
		?>
		</div>
	<?php } ?>
	<?php if ($scriptRunView) { ?>
		<h3><?php echo $view ?></h3>

		<div class="panel panel-default">
			<div class="panel-heading">Script Output</div>
			<div class="panel-body">
				<div class="progress progress-striped active">
					<div class="progress-bar" style="width: 100%">Running Script...</div>
				</div>
				<div class="script-run-completion alert alert-dismissible alert-success" style="display: none;">
					<button type="button" class="close" data-dismiss="alert"><i class="fa fa-remove"></i></button>
					<strong>Complete!</strong> <a href="/reports/regression_tests" class="alert-link"><u>View reports</u></a>.
				</div>
				<div class="process-data">
					<?php
						$db = new DbHandler();
						
						$bashOutput = array('1[33m','[33m','[32;1m','[37;41;1m','[36m','[37;43;1m','[37;46;1m','[0m','[37;42;1');
						$bashOutputStyle = array('<span class="consoleOutput orange">','<span class="consoleOutput orange">','<span class="consoleOutput green">','<span class="consoleOutput red">','<span class="consoleOutput blue">','<span style="display: none;">','<span class="consoleOutput">','</span>','#');

						$testLog = array();

						// Console output
						while (@ ob_end_flush());

						$x = 0;
						$runProcess = popen($execCmd, 'r');

						echo '<pre id="test_output">';

						while (!feof($runProcess)) {
						    $lines = fread($runProcess, 4096);

						    $formattedText = str_replace($bashOutput, $bashOutputStyle, $lines);
					        echo $formattedText;

					        $testLog['line_'.$x] = $formattedText;

						    @ flush();

						    $x++;
						}

						echo '</pre>';

						$output = "";
						$retval = -1;

						if($view == 'regressionTest') {
							$db->saveRegressionResults(serialize($testLog));	
						}
						
						exec($delCmd, $output, $retval);
						echo '<script type="text/javascript">
							$(".progress").fadeOut("slow");
							$(".script-run-completion").fadeIn("slow");
						</script>';
						
					?>
				</div>	
			</div>
		</div>
	<?php } ?>
	</div>
<?php include_once 'base/footer.php' ?>