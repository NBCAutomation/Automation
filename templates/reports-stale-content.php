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
		<div class="panel panel-body">
			<p>
				<a href="/utils/purge-cache?ref=<?php echo $staleContentData['refCacheKey'] ?>&reloc=reports%2Fstale_content_check">
					Refresh <i class="fa fa-refresh" style="font-size:20px;"></i>
				</a>
			</p>
			<table id="stale-content-table" class="display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
				<thead>
					<tr>
						<th>ID</th>
						<th>Ref ID</th>
						<th>Station</th>
						<th>Stale</th>
						<th>Update Diff</th>
						<th>Created</th>
					</tr>
				</thead>
				<?php
					foreach ($contentChecks as $contentCheck) { 
						echo '<tr>';
						echo '<td>'.$contentCheck['id'].'</td>';
						echo '<td>'.$contentCheck['ref_test_id'].'</td>';
						echo '<td>'.$contentCheck['station'].'</td>';
						echo '<td>'.($contentCheck['stale'] < 1 ? 'Update' : 'Stale').'</td>';
						echo '<td>'.($contentCheck['time_diff'] < 1 ? '--' : $contentCheck['time_diff']).'</td>';
						echo '<td>'.$contentCheck['created'].'</td>';
						echo '</tr>';
					}
				?>
				<tfoot>
					<tr>
						<th>ID</th>
						<th>Ref ID</th>
						<th>Station</th>
						<th>Stale</th>
						<th>Update Diff</th>
						<th>Created</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
<?php include_once 'base/footer.php' ?>