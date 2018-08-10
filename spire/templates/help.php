<?php include_once 'base/header.php'; ?>
	<div class="panel-body">
		<ul>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">Regression Script Testing</div>
					<div class="panel-body">
						<p>Currently the regression script tests the below items.</p>
						<small>
							<h4>Market Tests</h4>
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
								<li>Connect dropdown appears</li>
								<li>TV listings page loads and functional</li>
								<li>Traffic page loads with map</li>
								<li>Check the listing tab to ensure the correct tab appears (Cozi for NBC)</li>
								<li>Check the listing tab to ensure the correct tab appears (Telexitos for TLM)</li>
								<li>Subsection/sub nav landing page loads</li>
								<li>Footer appears on all pages</li>
								<li>Icons in connect dropdown are clickable and linkout</li>
								<li>[NBC] Check if the weather map is open on hp]</li>
								<li>Verify TLM nvaigation hover states for sub-menus</li>
							</ul>
							<h4>Cozi Tests</h4>
							<ul class="defaultList">
								<li>Cozi tv page loads</li>
								<li>Cozi TV article page loads</li>
								<li>Cozi Tv - Listings and Channel Finder</li>
								<li>Get cozi map with pins appears on page load</li>
								<li>TV listing page loads with different timezones(same for telexitos)</li>
								<li>PDF sched tab appears on tv listing page</li>
							</ul>
							<h4>Telexitos Tests</h4>
							<ul class="defaultList">
								<li>Telexitos page loads</li>
								<li>TV listing page loads with different timezones(same for telexitos)</li>
								<li>PDF sched tab appears on tv listing page</li>
							</ul>
						</small>
					</div>
				</div>
			</li>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">Cronjobs</div>
					<div class="panel-body">
						<p>Currently the master job (spire-run), is set to run every 2 hours everyday.</p>
					</div>
				</div>
			</li>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">Spire-run (master script)</div>
					<div class="panel-body">
						<p>Spire-run is the master script that will run all scripts asynchronously.</p>
						<div class="well">
							<p>npm run runall-async</p>
						</div>
						<p>Running Async, scripts will process in sequence (Script 1 > site 1, Script 1 > site 2, Script 2 > site 1, etc). This test can be ran synchronously to test multiple scripts/sites at one time, but this is currently not being used due to memory leaks via PhantomJS. Possible future enhancement. </p>
					</div>
				</div>
			</li>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">Time/delays</div>
					<div class="panel-body">
						<p>Running the master job can take 15-20 min to complete. Single running scripts process much faster but can experience delays based on any site delays when loading urls.</p>
					</div>
				</div>
			</li>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">Console Output</div>
					<div class="panel-body">
						<p>Console output displays all console messages directly from the script. If unchecked the script will display start/stop messages.</p>
						<p>If multiple sites are selected and output is selected. Script console messages will be displayed in the order of the sites being processed.</p>
					</div>
				</div>
			</li>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">Kill from server</div>
					<div class="panel-body">
						<p>~/kill-node.sh</p>
					</div>
				</div>
			</li>
		</ul>
	</div>
<?php include_once 'base/footer.php' ?>