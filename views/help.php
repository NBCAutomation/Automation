<?php include_once './views/base/header.php'; ?>
	<div class="panel-body">
		<ul>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">Cronjobs</div>
					<div class="panel-body">
						<p>Currently the master job (spire-run), is set to run daily at 9:30 AM EST.</p>
					</div>
				</div>
			</li>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">Spire-run (master script)</div>
					<div class="panel-body">
						<p>Spire-run is the master script that will run all scripts asynchronously (Script 1 > site 1, Script 1 > site 2, Script 2 > site 1, etc), starting with the Manifest navigation script. This test can be ran synchronously in chunks of 10 at a time via command line using the run command below;</p>
						<div class="well">
							<p>npm run runall-10</p>
						</div>
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
		</ul>
	</div>
<?php include_once './views/base/footer.php' ?>