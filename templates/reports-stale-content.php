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
		<div class="panel-body">
			<p>
				<a href="/utils/purge-cache?ref=<?php echo $staleContentData['refCacheKey'] ?>&reloc=reports%2Fstale_content_check">
					Refresh <i class="fa fa-refresh" style="font-size:20px;"></i>
				</a>
			</p>
			<?php echo $staleContentData['data']; ?>
		</div>
	</div>
<?php include_once 'base/footer.php' ?>