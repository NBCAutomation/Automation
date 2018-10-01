<?php
// namespace Spire; 
// use \InvalidArgumentException;

use Psr\Http\Message\ResponseInterface;

class Spire {

	public function getConnection() {
		if (gethostname() == 'ip-10-9-169-143') {
			$dbhost = "127.0.0.1";
			$dbuser = "dbuser";
			$dbpass = "dbuser";
		} else {
		    $dbhost = "localhost";
		    $dbuser = "__spireUser";
		    $dbpass = "LTXaxWwnemXzzrcK";
		}

		$dbname = "ots_spire";
		$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $dbh;
	}

	public static function getGravatar( $email, $s = 250, $d = 'mm', $r = 'g', $img = false, $atts = array() ) {
	    $url = 'http://www.gravatar.com/avatar/';
	    $url .= md5( strtolower( trim( $email ) ) );
	    $url .= "?s=$s&d=$d&r=$r";
	    if ( $img ) {
	        $url = '<img src="' . $url . '"';
	        foreach ( $atts as $key => $val )
	            $url .= ' ' . $key . '="' . $val . '"';
	        $url .= 'onerror="this.src=\'/assets/img/icon-user-default.png\'" />';
	    }

	    $handle = curl_init($url);
	    curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);
	    $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
	    
	    if($httpCode != 200) {
	    	// var_dump($url);
	    	// exit();
	    	// $url = '/assets/img/icon-user-default.png';
	    }

	    curl_close($handle);

	    return $url;
	}
	
	public static function dirFilesToArray($dir) {

		$result = array(); 

		$cdir = scandir($dir);

		foreach ($cdir as $key => $value) {
			if ( !in_array($value,array(".","..")) ) {

				if ( is_dir($dir . DIRECTORY_SEPARATOR . $value) ) {
					$result[$value] = dirToArray($dir . DIRECTORY_SEPARATOR . $value);
				} else {
					$result[] = $value;
				}
			}
		}
		return $result;
	}

	public static function readCSV($__file) {
		$row = 1;
		$fails = 0;

		$__fileData;

		$__fileData .= "<table class=\"table table-bordered table-striped\">";

		if (($handle = fopen($__file, "r")) !== FALSE) {
		    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		        $num = count($data);
		        $row++;

		        $__fileData .= "<tr>";

		        for ($c = 0; $c < $num; $c++) {
		        	
		        	if (strpos($data[$c], 'Fail') !== false || strpos($data[$c], 'FAIL') !== false) {
		        		$fails++;
		        		$__class = 'class="test_fail" ';
		        	} else {
		        		$__class = '';
		        	}

		        	if (!empty($data[$c])) {
		        		if ($row < 5) {
		        			$__fileData .= "<td colspan=\"5\">" . $data[$c] . "</td>";
		        		} else {
		        			if ($row < 7) {
		        				$__fileData .= "<td>" . $data[$c] . "</td>";
			        		} else {
			        			$__fileData .= "<td ". $__class .">" . $data[$c] . "</td>";
			        		}
		        		}
		        	}
		        }
		        $__fileData .= "</tr>";
		    }
		    fclose($handle);
		}
		$__fileData .= "</table>";
		return $__fileData;
	}

	public static function dirToArray($dir) {
		$result = array(); 

		$cdir = scandir($dir);

		foreach ($cdir as $key => $value) {
			if ( !in_array($value,array(".","..")) ) {

				if ( is_dir($dir . DIRECTORY_SEPARATOR . $value) ) {
					$result[$value] = Spire::dirToArray($dir . DIRECTORY_SEPARATOR . $value);
				}
			}
		}
		return $result;
	}

	public static function getUser($email) {
		$db = new DbHandler();
		$user = $db->getUserByEmail($email);

		return $user;
	}

	public static function checkPermissions($role, $required) {
		// Poor mans permissions
		
		$userPerms = array();

		if ($role != 0) {
			$userPerms['isAdmin'] = false;

			if ($role == 1 ) {
				$userPerms['role'] = 'user';
			} elseif ($role == 2) {
				$userPerms['role'] = 'developer';
			}

			if ($required == true) {
				$userPerms['uAthMessage'] = "You're not authorized to view this section";
				$userPerms['auth'] = false;
			}
		} else {
			$userPerms['isAdmin'] = true;
			$userPerms['auth'] = true;
			$userPerms['role'] = 'admin';
		}

		return $userPerms;
	}

	/**
	 * Get cached data and set data if expired.
	 * 
	 * @param  String   Cache key
	 * @param  Integer  Expiration in seconds
	 * @param  Closure  Callback used for data
	 * @return String   Cached data
	 */
	public static function spireCache($key, $expTime, Closure $callback) {
	    $cacheKey = sha1($key);
	    $cacheDir = './tmp/' . implode('/', array_slice(str_split($cacheKey, 2), 0, 3));
	    $cacheFile = $cacheDir . '/' . $cacheKey;

	    if(! is_dir($cacheDir)) {
	        mkdir(dirname($cacheFile), 0777, true);
	    }

	    $modifedTime = file_exists($cacheFile) ? filemtime($cacheFile) : 0;

	    if($modifedTime + intval($expTime) < time()) {
	        $data['data'] = call_user_func($callback);
	        $data['refCacheKey'] = $cacheKey;

	        // if (strpos($key, 'getStationById') !== false || strpos($key, 'getStationsGlobalAPIVer')) {
		       //  if (array_key_exists(0, $data)){
		       //  	$data[0]['refCacheKey'] = $cacheKey;
		       //  } else {
		       //  	$data['refCacheKey'] = $cacheKey;
		       //  }
	        // }

	        file_put_contents($cacheFile, serialize($data));

	        // var_dump('miss!');
	        // var_dump($data);
	        // echo '----------<br />';
	    } else {
	        $data = unserialize(file_get_contents($cacheFile));
	        // var_dump('hit!');
	        // var_dump($data);
	    }

	    if (is_array($data) && count($data) > 0 && is_array($data[0])) {
	    	foreach ($data as $key => $value) {
	    		$data[$key] = (object)$value;
	    	}
	    }

	    return $data;
	}


	public static function purgeAllCache($target, $canDeleteTarget = false) {
	    $files = glob( $target . '*', GLOB_MARK );

	    if(is_dir($target)){
        	foreach($files as $file) {
    			if(is_file($file)) {
    				unlink($file);
    			} elseif(is_dir($file)){
    				Spire::purgeAllCache($file, true);
    				rmdir($file);
    			}
    		}

    		if ($canDeleteTarget) {
    			rmdir($target);	
    		}

	    } elseif(is_file($target)) {
	        unlink( $target );
	    }
	}

	public static function returnFormattedDataTable($data, $view, $ref){

		// var_dump($view);
		// exit();

		$db = new DbHandler();

		foreach ($data as $testReport) {

			if ( strpos($view, 'manifest') ) {
		    	$viewName = 'Manifest';
		    	$testPath = 'apiManifestTest';

	    	} elseif ( strpos($view, 'nav') ) {
		    	$viewName = 'Navigation';
		    	$testPath = 'apiNavTest';

			} elseif ( strpos($view, 'article') ) {
		    	$viewName = 'Article/Content';
		    	$testPath = 'apiContentTest';

		    } elseif ( strpos($view, 'regression_tests')  !== false ) {
		    	$viewName = 'Regression';
		    	$testPath = 'regressionTest';
		    }
		    
			if ( strpos($ref, 'all') !== false ) {
				$urlPath = chop($ref,"/all");
				$tableClass = '_all';
			} else {
				$urlPath = $view;
			}

			$testReportViewData = '<div class="panel panel-default">';
			$testReportViewData .= '<div class="panel-heading">'.$viewName.' Reports</div>';
			$testReportViewData .= '<div class="panel-body api_results">';
			$testReportViewData .= '<table id="" class="reports_table display table table-striped table-bordered table-hover" cellspacing="0" width="100%">';
			$testReportViewData .= '<thead><tr width="100%"><th>Status</th><th>ID</th><th>Property</th><th>Failures</th><th>Created</th></tr></thead>';
			$testReportViewData .= "<tbody>";

			foreach ($data[0] as $key => $value) {
				// var_dump($data[0]);
				// exit();
				$l10nDate = new DateTime($value['created']);
				$l10nDate->setTimeZone($usersTimezone);
				$testReportViewData .= '<tr>';
				$testReportViewData .= '<td><div class="report_status '.strtolower($value['status']).'">'.$value['status'].'</div></td>';
				$testReportViewData .= '<td><a href="/reports/'.$urlPath.'/record/'.$value['ref_test_id'].'?refID='.$value['id'].'">'.$value['ref_test_id'].'</a></td>';
				$testReportViewData .= '<td><a href="/reports/'.$urlPath.'/record/'.$value['ref_test_id'].'?refID='.$value['id'].'">'.str_replace('stage_', 'stage.', $value['property']).'</a></td>';
				$testReportViewData .= '<td><a href="/reports/'.$urlPath.'/record/'.$value['ref_test_id'].'?refID='.$value['id'].'">'.$value['failures'].'</a></td>';
				// $testReportViewData .= $value['created']."</td>";
				$testReportViewData .= '<td><a href="/reports/'.$urlPath.'/record/'.$value['ref_test_id'].'?refID='.$value['id'].'">'.$l10nDate->format('n/d/Y, g:i A').'</a></td>';
				$testReportViewData .= '</tr>';
			}
			$testReportViewData .= "</tbody>";
			$testReportViewData .= "<tfoot><tr><th>Status</th><th>ID</th><th>Property</th><th>Failures</th><th>Created</th></tr></tfoot>";
			$testReportViewData .= '</table>';
			$testReportViewData .= '</div></div>';
			$testReportViewData .= '<p class="text-muted small"><i>* If the table doesn\'t style properly, click one of the sorting headers to update the view.</i></p>';
         
            print($testReportViewData);
		}

	}

	public static function formatLoadTimesTable($data){
		// var_dump($view);
		// exit();

		foreach ($data as $testReport) {
			$testReportViewData = '<div class="panel panel-default">';
			$testReportViewData .= '<div class="panel-heading">Today Loadtime Reports ( x > 300 ms)</div>';
			$testReportViewData .= '<div class="panel-body api_results">';
			$testReportViewData .= '<p class="text-muted small"><i>* If the table doesn\'t style properly, click one of the sorting headers to update the view.</i></p>';
			$testReportViewData .= '<p class="text-muted small"><i>* Click X-Server added 7/12/18, prior data will display ----.</i></p>';
			$testReportViewData .= '<table id="" class="reports_table display table table-striped table-bordered table-hover" cellspacing="0" width="100%">';
			$testReportViewData .= '<thead><tr width="100%"><th>ID</th><th>Ref Test ID</th><th>Loadtime (ms)</th><th>Endpoint URL</th><th>Click X-Server</th><th>Notes/info</th><th>Created</th></tr></thead>';
			$testReportViewData .= "<tbody>";

			foreach ($data[0] as $key => $value) {
				$l10nDate = new DateTime($value['created']);
				$l10nDate->setTimeZone($usersTimezone);

				$testReportViewData .= '<tr>';
				$testReportViewData .= '<td>'.$value['id'].'</td>';
				$testReportViewData .= '<td>'.$value['ref_test_id'].'</td>';
				$testReportViewData .= '<td>'.$value['loadtime'].'</td>';
				$testReportViewData .= '<td>'.str_replace('stage_', 'stage.', $value['endpoint']).'</td>';
				$testReportViewData .= '<td>'.$value['click_server'].'</td>';
				$testReportViewData .= '<td>'.str_replace('stage_', 'stage.', $value['info']).'</td>';
				$testReportViewData .= '<td>'.$l10nDate->format('n/d/Y, g:i A').'</td>';
				$testReportViewData .= '</tr>';
			}
			$testReportViewData .= "</tbody>";
			$testReportViewData .= "<tfoot><tr><th>ID</th><th>Ref Test ID</th><th>Loadtime (ms)</th><th>Endpoint URL</th><th>Click X-Server</th><th>Notes/info</th><th>Created</th></tr></tfoot>";
			$testReportViewData .= '</table>';
			$testReportViewData .= '</div></div>';
         
            print($testReportViewData);
		}
	}


	public static function formatLoadTimeSearchResultsTable($data){
		// var_dump($view);
		// exit();

		foreach ($data as $testReport) {
			$testReportViewData = '<div class="panel panel-default">';
			$testReportViewData .= '<div class="panel-body api_results">';
			$testReportViewData .= '<p class="text-muted small"><i>* If the table doesn\'t style properly, click one of the sorting headers to update the view.</i></p>';
			$testReportViewData .= '<table id="" class="reports_table display table table-striped table-bordered table-hover" cellspacing="0" width="100%">';
			$testReportViewData .= '<thead><tr width="100%"><th>Endpoint URL</th><th>Loadtime (ms)</th><th>Created</th></tr></thead>';
			$testReportViewData .= "<tbody>";

			foreach ($data[0] as $key => $value) {
				$l10nDate = new DateTime($value['created']);
				$l10nDate->setTimeZone($usersTimezone);

				$testReportViewData .= '<tr>';
				$testReportViewData .= '<td>'.str_replace('stage_', 'stage.', $value['endpoint']).'</td>';
				$testReportViewData .= '<td>'.$value['max_load_time'].'</td>';
				$testReportViewData .= '<td>'.$l10nDate->format('n/d/Y, g:i A').'</td>';
				$testReportViewData .= '</tr>';
			}
			$testReportViewData .= "</tbody>";
			$testReportViewData .= '<tfoot><tr width="100%"><th>Endpoint URL</th><th>Loadtime (ms)</th><th>Created</th></tr></tfoot>';
			$testReportViewData .= '</table>';
			$testReportViewData .= '</div></div>';
         
            print($testReportViewData);
		}
	}

	public static function downloadLoadTimeResults($data, $method){
		// var_dump($data);
		// exit();

		$csv_export = '';

		if ($method == 'trending') {
			$csv_export .= '"endpoint","Average Loadtime (ms)"'.PHP_EOL;

			foreach ($data as $key => $value) {
				$loadtimeAverage = array_sum($value) / count($value);
				$csv_export .= '"'.$key.'","'.round($loadtimeAverage).'"'.PHP_EOL;
			}
			return $csv_export;
		} else {
			$csv_export .= '"endpoint","max_load_time","created"'.PHP_EOL;

			foreach ($data as $testReport) {
				foreach ($data[0] as $key => $value) {
					$l10nDate = new DateTime($value['created']);
					$l10nDate->setTimeZone($usersTimezone);

					$csv_export .= '"'.str_replace('stage_', 'stage.', $value['endpoint']).'","'.$value['max_load_time'].'","'.$l10nDate->format('n/d/Y, g:i A').'"'.PHP_EOL;
				}
				return $csv_export;
			}
		}
	}


	public static function displayPayLoadError($testReferenceID, $testResultID){

		$db = new DbHandler();
		$failurePayloadData = $db->getPayLoadError($testReferenceID, $testResultID);

		if (sizeof($failurePayloadData['data']) > 0) {
			foreach ($failurePayloadData['data'] as $failureData) {
				// echo $failureData->id;
				$strippedData = $failureData['payload'];
				$strippedData = str_replace('<', '&lt;', $failureData['payload']);
				$strippedData = str_replace('>', '&gt;', $strippedData);
				
				
				$testReportViewData .= '<div class="panel panel-default">';
				$testReportViewData .= '<div class="panel-heading"><h3 class="panel-title">sub test type: '.$failureData['test_type'].'</h3></div>';
				$testReportViewData .= '<div class="panel-body">';
				$testReportViewData .= '<table id="" class="reports_table display table table-bordered" cellspacing="0" width="100%">';
				$testReportViewData .= '<tbody>';
				$testReportViewData .= '<tr><td class="text-muted small">JSON Error: '.$failureData['error'].'</td></tr>';
				$testReportViewData .= '<tr><td class="text-muted small">Endpoint url: '.$failureData['endpoint'].'</td></tr>';
				$testReportViewData .= '<tr><td class="text-muted small">JSON error payload</td></tr>';
				$testReportViewData .= '
				<tr><td>
				<div class="panel panel-default">
					<div class="panel-heading" role="tab" id="headingOne">
						<a role="button" data-toggle="collapse" class="accordion-button" data-parent="#accordion" href="#collapse'.$failureData['id'].'" aria-expanded="true" aria-controls="collapse'.$failureData['id'].'">
							<i class="fa fa-bars" aria-hidden="true"></i> &nbsp;show/hide
						</a>
					</div>
					<div id="collapse'.$failureData['id'].'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
						<div class="panel-body">
							<pre class=\"payload_error\""><code>'.$strippedData.'</code></pre>
						</div>
					</div>
				</div>
				</td></tr>';
				$testReportViewData .= '</tbody>';
				$testReportViewData .= '</table>';
				$testReportViewData .= '</div></div>';
	         
	            print($testReportViewData);
	            $testReportViewData = '';
			}
		}
	}

	public static function buildQueryCache($resetCurrentCache = false){
		if ($resetCurrentCache) {
			$tmpLocation = BASEPATH .'/tmp/';
			$cacheClear = Spire::purgeAllCache($tmpLocation);	
		}

		$db = new DbHandler();
		// Build additional test result caches
		$todayManifestTotalFailureReports = $db->getTestReportCount('all', 'all', 'all');
		$todayManifestTotalFailureReports = $db->getTestReportCount('api_manifest_audits', 'all', 'all');
		$todayNavTotalFailureReports = $db->getTestReportCount('api_navigation_audits', 'all', 'all');
		$todayContentTotalFailureReports = $db->getTestReportCount('api_article_audits', 'all', 'all');

		// Today report data
		// Manifest
		$todayManifestTotalFailureReports = $db->getTestReportCount('api_manifest_audits', 'fail', 'today');
		$todayManifestTotalWarningReports = $db->getTestReportCount('api_manifest_audits', 'warning', 'today');

		// Nav
		$todayNavTotalFailureReports = $db->getTestReportCount('api_navigation_audits', 'fail', 'today');
		$todayNavTotalWarningReports = $db->getTestReportCount('api_navigation_audits', 'warning', 'today');

		// Content
		$todayContentTotalFailureReports = $db->getTestReportCount('api_article_audits', 'fail', 'today');
		$todayContentTotalWarningReports = $db->getTestReportCount('api_article_audits', 'warning', 'today');

		// OTT
		$todayOTTTotalFailureReports = $db->getTestReportCount('ott_tests', 'fail', 'today');
		$todayOTTTotalWarningReports = $db->getTestReportCount('ott_tests', 'warning', 'today');

		// Loadtime data
		$apiManifestTestLoadTime = $db->getAverageLoadTime('apiManifestTest', 'today');
		$apiNavTestLoadTime = $db->getAverageLoadTime('apiNavTest', 'today');
		$apiContentTestLoadTime = $db->getAverageLoadTime('apiContentTest', 'today');
		$apiSectionContentLoadTime = $db->getAverageLoadTime('apiSectionContent', 'today');
		$apiOTTLoadTime = $db->getAverageLoadTime('ottTests', 'today');
		$chartLoadTimeData = $db->getAllAverageLoadTimes();

		// Weather API Tile Data checks
		$weatherTileUptimeAverage_today = $db->getWeatherTileCheckAvg('today');
		$weatherTileUptimeAverage_yesterday = $db->getWeatherTileCheckAvg('yesterday');
		$weatherTileUptimeAverage_week = $db->getWeatherTileCheckAvg('week');
		$weatherTileUptimeAverage_month = $db->getWeatherTileCheckAvg('currentMonth');

		// Weather radar stations
    	$radarStat = array(
	    	"0845" => "First Alert Live Doppler - Los Angeles",
            "0846" => "First Alert Live Doppler - Orange County",
            "0847" => "First Alert Live Doppler - San Diego",
            "0848" => "StormRanger - Los Angeles",
            "0849" => "NBC 5 S-Band Radar - DFW",
            "0850" => "StormRanger - DFW",
            "0851" => "StormRanger - Philadelphia",
            "0854" => "NBC Boston Fixed",
            "0855" => "StormTracker 4 - New York",
            "0856" => "Live Doppler 5 - Chicago",
            "0837" => "TeleDoppler - Puerto Rico",
            "0853" => "First Alert Doppler 6000",
            "0870" => "StormRanger 2 - New York/Boston",
            "0871" => "StormRanger 2 - Philadelphia",
            "0872" => "StormRanger 2 - DFW"
        );

        $weatherRadarStationAverages = array();
        $weatherRadarStationAverage = array();

    	foreach ($radarStat as $radarID => $radarName) {
    		$__today = "today_".$radarID;
    		$__yesterday = "yesterday_".$radarID;
    		$__week = "week_".$radarID;
    		$__month = "month_".$radarID;



    		$__today = $db->getWeatherRadarCheckAvg('today', $radarID);
    		$__yesterday = $db->getWeatherRadarCheckAvg('yesterday', $radarID);
    		$__week = $db->getWeatherRadarCheckAvg('week', $radarID);
    		$__month = $db->getWeatherRadarCheckAvg('currentMonth', $radarID);

    		$weatherRadarStationAverage["today"] = $__today['data']['avgUptime'];
    		$weatherRadarStationAverage["yesterday"] = $__yesterday['data']['avgUptime'];
    		$weatherRadarStationAverage["week"] = $__week['data']['avgUptime'];
    		$weatherRadarStationAverage["month"] = $__month['data']['avgUptime'];

    		$weatherRadarStationAverages[$radarID.'-'.$radarName] = $weatherRadarStationAverage;

    		$weatherRadarStationAverage = array();
    	}

    	$__today = array_column($weatherRadarStationAverages, 'today');
    	$__yesterday = array_column($weatherRadarStationAverages, 'yesterday');
    	$__week = array_column($weatherRadarStationAverages, 'week');
    	$__month = array_column($weatherRadarStationAverages, 'month');
    	

    	$weatherRadarAverage_today = array_sum($__today)/count($__today);
    	$weatherRadarAverage_yesterday = array_sum($__yesterday)/count($__yesterday);
    	$weatherRadarAverage_week = array_sum($__week)/count($__week);
    	$weatherRadarAverage_month = array_sum($__month)/count($__month);


		// Get Station stale content
		$staleContentAverages = $db->getStaleContentAverages(30);

		$resultsArray = array();
			$resultsArray['todayManifestTotalFailureReports'] = $todayManifestTotalFailureReports['data'];
			$resultsArray['todayManifestTotalFailureReports'] = $todayManifestTotalFailureReports['data'];

			$resultsArray['todayManifestTotalFailureReports'] = $todayManifestTotalFailureReports['data'];
			$resultsArray['todayManifestTotalWarningReports'] = $todayManifestTotalWarningReports['data'];

			$resultsArray['todayNavTotalFailureReports'] = $todayNavTotalFailureReports['data'];
			$resultsArray['todayNavTotalWarningReports'] = $todayNavTotalWarningReports['data'];
			
			$resultsArray['todayContentTotalFailureReports'] = $todayContentTotalFailureReports['data'];
			$resultsArray['todayContentTotalWarningReports'] = $todayContentTotalWarningReports['data'];

			$resultsArray['todayOTTTotalFailureReports'] = $todayOTTTotalFailureReports['data'];
			$resultsArray['todayOTTTotalWarningReports'] = $todayOTTTotalWarningReports['data'];

			$resultsArray['apiManifestTestLoadTime'] = $apiManifestTestLoadTime['data'];
			$resultsArray['apiNavTestLoadTime'] = $apiNavTestLoadTime['data'];
			$resultsArray['apiContentTestLoadTime'] = $apiContentTestLoadTime['data'];
			$resultsArray['apiSectionContentLoadTime'] = $apiSectionContentLoadTime['data'];
			$resultsArray['apiOTTLoadTime'] = $apiOTTLoadTime['data'];
			$resultsArray['chartLoadTimeData'] = $chartLoadTimeData['data'];

			$resultsArray['weatherTileUptimeAverage_today'] = $weatherTileUptimeAverage_today['data'];
			$resultsArray['weatherTileUptimeAverage_yesterday'] = $weatherTileUptimeAverage_yesterday['data'];
			$resultsArray['weatherTileUptimeAverage_week'] = $weatherTileUptimeAverage_week['data'];
			$resultsArray['weatherTileUptimeAverage_month'] = $weatherTileUptimeAverage_month['data'];
			
			$resultsArray['weatherRadarAverage_today'] = $weatherRadarAverage_today;
			$resultsArray['weatherRadarAverage_yesterday'] = $weatherRadarAverage_yesterday;
			$resultsArray['weatherRadarAverage_week'] = $weatherRadarAverage_week;
			$resultsArray['weatherRadarAverage_month'] = $weatherRadarAverage_month;


		return $resultsArray;
	}

	// Time format is UNIX timestamp or
	// PHP strtotime compatible strings
	public static function dateDiff($time1, $time2, $precision = 6) {
		// If not numeric then convert texts to unix timestamps
		if (!is_int($time1)) {
			$time1 = strtotime($time1);
		}

		if (!is_int($time2)) {
			$time2 = strtotime($time2);
		}

		// If time1 is bigger than time2
		// Then swap time1 and time2
		if ($time1 > $time2) {
			$ttime = $time1;
			$time1 = $time2;
			$time2 = $ttime;
		}

		// Set up intervals and diffs arrays
		$intervals = array('year','month','day','hour','minute','second');
		$diffs = array();

		// Loop thru all intervals
		foreach ($intervals as $interval) {
		// Create temp time from time1 and interval
			$ttime = strtotime('+1 ' . $interval, $time1);
			// Set initial values
			$add = 1;
			$looped = 0;
			// Loop until temp time is smaller than time2
			while ($time2 >= $ttime) {
				// Create new temp time from time1 and interval
				$add++;
				$ttime = strtotime("+" . $add . " " . $interval, $time1);
				$looped++;
			}

			$time1 = strtotime("+" . $looped . " " . $interval, $time1);
			$diffs[$interval] = $looped;
		}

		$count = 0;
		$times = array();
		// Loop thru all diffs
		foreach ($diffs as $interval => $value) {
			// Break if we have needed precission
			if ($count >= $precision) {
				break;
			}
			// Add value and interval 
			// if value is bigger than 0
			if ($value > 0) {
				// Add s if value is not 1
				if ($value != 1) {
					$interval .= "s";
				}
				// Add value and interval to times array
				$times[] = $value . " " . $interval;
				$count++;
			}
		}

		// Return string with times
		return implode(", ", $times);
	}


	public static function sendEmailNotification($email, $alertData, $emailSubject){
		///////////HEADERS INFORMATION////////////
		$f_email = 'LIMQualityAssurance@nbcuni.com';
		$emailto = $email;

		$headers = "From: " . strip_tags($f_email) . "\r\n";
		$headers .= "Reply-To: ". strip_tags($f_email) . "\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

		$message =  $alertData;

		//Email message
		mail($emailto, $emailSubject, $message, $headers);
	}

}
?>