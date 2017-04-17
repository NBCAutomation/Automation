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
	        $data = call_user_func($callback);

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
			$testReportViewData .= '<thead><tr width="100%"><th>Status</th><th>ID</th><th>Ref ID</th><th>Property</th><th>Failures</th><th>Created</th></tr></thead>';
			$testReportViewData .= "<tbody>";

			foreach ($data[0] as $key => $value) {
				$l10nDate = new DateTime($value['created']);
				$l10nDate->setTimeZone($usersTimezone);

				$testReportViewData .= '<tr>';
				$testReportViewData .= '<td><div class="report_status '.strtolower($value['status']).'">'.$value['status'].'</div></td>';
				$testReportViewData .= '<td><a href="/reports/'.$urlPath.'/record/'.$value['id'].'?refID='.$value['ref_test_id'].'">'.$value['id'].'</a></td>';
				$testReportViewData .= '<td><a href="/reports/'.$urlPath.'/record/'.$value['id'].'?refID='.$value['ref_test_id'].'">'.$value['ref_test_id'].'</a></td>';
				$testReportViewData .= '<td><a href="/reports/'.$urlPath.'/record/'.$value['id'].'?refID='.$value['ref_test_id'].'">'.str_replace('stage_', 'stage.', $value['property']).'</a></td>';
				$testReportViewData .= '<td><a href="/reports/'.$urlPath.'/record/'.$value['id'].'?refID='.$value['ref_test_id'].'">'.$value['failures'].'</a></td>';
				// $testReportViewData .= $value['created']."</td>";
				$testReportViewData .= '<td><a href="/reports/'.$urlPath.'/record/'.$value['id'].'?refID='.$value['ref_test_id'].'">'.$l10nDate->format('n/d/Y, g:i A').'</a></td>';
				$testReportViewData .= '</tr>';
			}
			$testReportViewData .= "</tbody>";
			$testReportViewData .= "<tfoot><tr><th>Status</th><th>ID</th><th>Ref ID</th><th>Property</th><th>Failures</th><th>Created</th></tr></tfoot>";
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
				$testReportViewData .= '<div class="panel-heading">Today Loadtime Reports</div>';
				$testReportViewData .= '<div class="panel-body api_results">';
				$testReportViewData .= '<p class="text-muted small"><i>* If the table doesn\'t style properly, click one of the sorting headers to update the view.</i></p>';
				$testReportViewData .= '<table id="" class="reports_table display table table-striped table-bordered table-hover" cellspacing="0" width="100%">';
				$testReportViewData .= '<thead><tr width="100%"><th>ID</th><th>Ref Test ID</th><th>Loadtime (ms)</th><th>Endpoint URL</th><th>Created</th></tr></thead>';
				$testReportViewData .= "<tbody>";

				foreach ($data[0] as $key => $value) {
					$l10nDate = new DateTime($value['created']);
					$l10nDate->setTimeZone($usersTimezone);

					$testReportViewData .= '<tr>';
					$testReportViewData .= '<td>'.$value['id'].'</td>';
					$testReportViewData .= '<td>'.$value['ref_test_id'].'</td>';
					$testReportViewData .= '<td>'.$value['loadtime'].'</td>';
					$testReportViewData .= '<td>'.str_replace('stage_', 'stage.', $value['endpoint']).'</td>';
					$testReportViewData .= '<td>'.$l10nDate->format('n/d/Y, g:i A').'</td>';
					$testReportViewData .= '</tr>';
				}
				$testReportViewData .= "</tbody>";
				$testReportViewData .= "<tfoot><tr><th>ID</th><th>Ref Test ID</th><th>Loadtime (ms)</th><th>Endpoint URL</th><th>Created</th></tr></tfoot>";
				$testReportViewData .= '</table>';
				$testReportViewData .= '</div></div>';
	         
	            print($testReportViewData);
			}

		}

	public static function countDataResults($data, $view){
		$c = 0;
		foreach ($data as $key => $value) {
			// echo "key: ".$key." // val: ".$value."\n\n";
			$c++;
		}

		return $c;
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