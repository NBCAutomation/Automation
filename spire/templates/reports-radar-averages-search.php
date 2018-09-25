<?php
// error_reporting(E_ALL);
// ini_set('display_errors', '1');
	include_once 'base/header.php';

	// Set default server time zone
	date_default_timezone_set('UTC');
	$usersTimezone = new DateTimeZone('America/New_York');
	$contentChecks = $staleContentData['data'];

	// var_dump($_SESSION);
?>
	<div class="panel-body api_results">
		<div class="panel panel-default">
			<div class="panel-heading" role="tab" id="headingOne">
				<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
					<i class="fa fa-bars" aria-hidden="true"></i> &nbsp;Search form
				</a>
			</div>
			<div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
				<div class="panel-body">
					<form method="get" class="form-horizontal">
						<div class="form-group">
							<label class="col-sm-2 control-label">Search Range</label>
							<div class="col-sm-10">
								<select class="form-control" name="range">
									<option value="7">Default (7 Days)</option>
									<?php
									    for ($i=1; $i <= 60; $i++)
									    {
									        ?>
									            <option value="<?php echo $i;?>"><?php echo $i;?></option>
									        <?php
									    }
									?>
								</select>
							</div>
						</div>
						<hr />
						<div class="form-group">
							<label class="col-sm-2 control-label">Radar ID</label>
							<div class="col-sm-10">
								<div class="input-group mb">
									<span class="input-group-addon"> <input type="checkbox" class="setContentIDToggle"> </span>
									<input type="text" class="form-control" id="setContentIDInput" 	name="radar_id">
								</div>
								<p class="small">Ex: 0837</p>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label">Radar Name</label>
							<div class="col-sm-10">
								<div class="input-group mb">
									<span class="input-group-addon"> <input type="checkbox" class="setSectionPathToggle"> </span>
									<input type="text" class="form-control"  id="setSectionPathInput" name="radar_name">
								</div>
								<p class="small">Ex: NBC 5 S-Band Radar - DFW</p>
							</div>
						</div>
						<hr />
						<div class="form-group">
							<label class="col-sm-2 control-label">Offline only?</label>
							<div class="col-sm-10">
								<input id="checkbox1" type="checkbox" name="offline" value="true">
							</div>
						</div>
						<hr />
						<div class="form-group">
							<div class="col-sm-8 col-sm-offset-2">
								<input type="hidden" name="queryRadarAverages" value="true">
								<input type="hidden" name="view" value="radarAverages">
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
		</div>
		<div class="panel-body">
			<?php
				if ($searchResults) {
					echo '<h4>Search Results:</h4>';
					echo '<p><i>&nbsp; Last <b>'.$dayRange.'</b> days, station name or ID = <b>'.$searchTerm.'</b>, offline only <b>'.($offlineFilter < true ? 'No' : 'Yes').'</b></i></p>';
					echo '<div class="hr-dashed"></div>';
					echo $searchResults;
				}
			?>
		</div>
	</div>
<?php include_once 'base/footer.php' ?>