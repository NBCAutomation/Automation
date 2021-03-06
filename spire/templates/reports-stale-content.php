<?php
// error_reporting(E_ALL);
// ini_set('display_errors', '1');
	include_once 'base/header.php';

	// Set default server time zone
	date_default_timezone_set('UTC');
	$usersTimezone = new DateTimeZone('America/New_York');
	$contentChecks = $staleContentData['data'];
	$db = new DbHandler();

	$tableHeaders = '<th>Call Letters</th><th>Brand</th><th>Shortname</th><th>Avg Update Time (min)</th><th>Longest Update Time (min)</th>';

	if ($dayRange) {
		$dayRange = $dayRange;
	} else {
		$dayRange = 30;
	}
?>
	<div class="panel-body api_results">
		<div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
			<div class="panel-body">
				<form method="get" class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-2 control-label">Search Range (days)</label>
						<div class="col-sm-10">
							<select class="form-control" name="range">
								<?php
								    for ($i=1; $i <= 60; $i++) {
								    	if ($i == $dayRange) { $selected = 'selected'; } else { $selected = ''; }
							            echo '<option value="'.$i.'" '.$selected.'>'.$i.'</option>';
								    }
								?>
							</select>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-8 col-sm-offset-2">
							<input type="hidden" name="queryStaleContentAverage" value="true">
							<input type="hidden" name="view" value="staleContent">
							<input type="hidden" name="refLoc" value="<?php echo $staleContentAveragesRefLoc ?>">
							<button class="btn btn-primary" type="submit">Search</button>
						</div>
					</div>
					<?php
						if ($formResponse) {
							
						}
					?>
				</form>
			</div>
		</div>
		<h4>Search Results:</h4>
		<hr />
		<div id="stale-content-averages">
			<table id="stations-table" class="display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
				<thead>
					<tr>
						<?php
							echo $tableHeaders; ?>
					</tr>
				</thead>
				<tfoot>
					<tr>
						<?php echo $tableHeaders; ?>
					</tr>
				</tfoot>
				<tbody>
				<?php
					foreach ($staleContentAverages as $stationAverageData) {
						echo '<tr class="report_row">';
					    echo '<td>'.$stationAverageData['call_letters'].'</td>';
					    echo '<td>'.$stationAverageData['brand'].'</td>';
					    echo '<td>'.$stationAverageData['shortname'].'</td>';
					    echo '<td>'.round($stationAverageData['averageTime']).'</td>';
					    echo '<td><b>'.round($stationAverageData['maxTime']).'</td>';
	                	echo "</tr>";
					}
				?>
				</tbody>
			</table>
		</div>
	</div>
<?php include_once 'base/footer.php' ?>