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
						<span class="note">Bash script to run all automated test scripts.</span>
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
	<?php } ?>
	</div>
<?php include_once './views/base/footer.php' ?>