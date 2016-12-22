<?php include_once 'base/header.php' ?>
	<div class="panel-body scripts-library">
	<?php if ($mainView) { ?>
		<h3>Script Library</h3>
		<ul>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">
						<i class="fa fa-file" aria-hidden="true"></i> 
						<a href="/scripts/spire-run">spire-run.sh</a>
					</div>
					<div class="panel-body">
						<p><b>Running from web-app is currently disabled due to memory leaks and sever stability.</b></p>
						<span class="note">Bash script to run all automated test scripts. This script currently runs on a cron daily at 9:30 AM EST.</span>
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
		<?php if($view != 'spire-run'){include_once 'base/script_config.php';} ?>
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
						
						$bashOutput = array('1[33m','[33m','[32;1m','[37;41;1m','[36m','[37;43;1m','[37;46;1m','[0m','[37;42;1');
						$bashOutputStyle = array('<span class="consoleOutput orange">','<span class="consoleOutput orange">','<span class="consoleOutput green">','<span class="consoleOutput red">','<span class="consoleOutput blue">','<span style="display: none;">','<span class="consoleOutput">','</span>','#');

						// Console output
						while (@ ob_end_flush());

						$runProcess = popen($execCmd, 'r');

						echo '<pre id="test_output">';
						while (!feof($runProcess))
						{
						    $lines = fread($runProcess, 4096);

						    $formattedText = str_replace($bashOutput, $bashOutputStyle, $lines);
					        echo $formattedText;

						    @ flush();
						}
						echo '</pre>';

						$output = "";
						$retval = -1;

						exec($delCmd, $output, $retval);
						
					?>
				</div>	
			</div>
		</div>
	<?php } ?>
	</div>
<?php include_once 'base/footer.php' ?>