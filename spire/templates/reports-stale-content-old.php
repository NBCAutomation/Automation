<?php
// error_reporting(E_ALL);
// ini_set('display_errors', '1');
	include_once 'base/header.php';

	// Set default server time zone
	date_default_timezone_set('UTC');
	$usersTimezone = new DateTimeZone('America/New_York');
	$contentChecks = $staleContentData['data'];
?>
	<div class="panel-body api_results">
		<div class="panel panel-default" style="display: none; height: 0px;">
			<div class="panel-heading" role="tab" id="headingOne">
				<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
					<i class="fa fa-bars" aria-hidden="true"></i> &nbsp;Search form
				</a>
			</div>
			<div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
				<div class="panel-body">
					<form method="post" class="form-horizontal">
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
								<input id="checkbox1" type="checkbox" name="trending" value="true"><span class="help-block m-b-none">Include checks where no update occurred. </span>
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
			<p>
				<a href="/utils/purge-cache?ref=<?php echo $staleContentData['refCacheKey'] ?>&reloc=reports%2Fstale_content_check">
					Refresh <i class="fa fa-refresh" style="font-size:20px;"></i>
				</a>
			</p>
			<?php
				if ($searchResults) {
					echo $searchResults;
				} else {
					echo $staleContentData['data'];
				}
				
			?>
			<table id="stale-table" class="table table-bordered table-striped" cellspacing="0" width="100%">
				<thead>
					<tr>
						<th>ID</th>
						<th>Ref ID</th>
						<th>Paylo ID</th>
						<th>Station</th>
						<th>Stale</th>
						<th>Update Diff</th>
						<th>Created</th>
					</tr>
				</thead>
				<tfoot>
					<tr>
						<th>ID</th>
						<th>Ref ID</th>
						<th>Paylo ID</th>
						<th>Station</th>
						<th>Stale</th>
						<th>Update Diff</th>
						<th>Created</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
	<script type="text/javascript">
		$(document).ready(function () {
			// var resultsObject = <?php echo $staleContentData['data']; ?>;
			$('#stale-table').DataTable({
				"processing": true,
		        "serverSide": true,
		        "ajax":"/utils/staleoutput",
				// "data": resultsObject,
				"iDisplayLength": 100
			});
			// var table = jQuery('#stale-tablew').dataTable({
			// 	"bProcessing": true,
			// 	"sAjaxSource": "/utils/staleoutput",
			// 	"bPaginate":true,
			// 	"sPaginationType":"full_numbers",
			// 	"iDisplayLength": 5,
			// 	"bLengthChange":false,
			// 	"bFilter": false,
			// 	"aoColumns": [
			// 		{ mData: 'id' } ,
			// 		{ mData: 'ref_id' },
			// 		{ mData: 'payload_id' },
			// 		{ mData: 'station' }
			// 		{ mData: 'stale' }
			// 		{ mData: 'time_diff' }
			// 		{ mData: 'created' }
			// 	]
			// });
		});
	</script>
<?php include_once 'base/footer.php' ?>