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
						<div class="form-group">
							<label class="col-sm-2 control-label">Station shortname</label>
							<div class="col-sm-10">
								<input type="text" class="form-control" name="term"><span class="help-block m-b-none">Ex Like: nbcnewyork </span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label">Include stale checks</label>
							<div class="col-sm-10">
								<input id="checkbox1" type="checkbox" name="stale" value="1"><span class="help-block m-b-none">Include checks where no update occurred. </span>
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-8 col-sm-offset-2">
								<input type="hidden" name="queryStaleContent" value="true">
								<input type="hidden" name="view" value="staleContent">
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
					echo '<p><i>&nbsp; Last <b>'.$dayRange.'</b> days, station > <b>'.$searchTerm.'</b>. Stale included <b>'.($staleFilter['stale'] < 1 ? 'No' : 'Yes').'</b></i></p>';
					echo '<div class="hr-dashed"></div>';
					echo $searchResults;
				}
			?>
		</div>
	</div>
<?php include_once 'base/footer.php' ?>