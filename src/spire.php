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

		// var_dump($data);
		// exit();

		$db = new DbHandler();

		foreach ($data as $testReport) {

			if ( $view == 'all' ) {
				if ( strpos($ref, 'manifest') ) {
			    	$testTypeFolder = 'manifest';

		    	} elseif ( strpos($ref, 'nav') ) {
			    	$testTypeFolder = 'navigation';

				} elseif ( strpos($ref, 'article') ) {
			    	$testTypeFolder = 'article';
				
				}

				// $testReportStatus = $db->checkForTestFailures($testReport['id'], $ref, $view);
				$testReportTime = date('n/d/Y, g:i A', strtotime($testReport['created']));

				$reportCSVDate =  date('n_j_Y', strtotime($testReport['created']));
				$reportCSVDateTime =  date('n_j_Y-g_i-A', strtotime($testReport['created']));
				$reportCSVFile = '/test_results/'.$view.'/'.$reportCSVDate.'/'.$testReport['property'].'_'.$testTypeFolder.'-audit_'.$reportCSVDateTime.'.csv';

			} else {
				if ( strpos($view, 'manifest') ) {
			    	$testTypeFolder = 'manifest';

		    	} elseif ( strpos($view, 'nav') ) {
			    	$testTypeFolder = 'navigation';

				} elseif ( strpos($view, 'article') ) {
			    	$testTypeFolder = 'article';
				
				}

				$testReportStatus = strtolower($testReport->status);
				$testReportTime = date('n/d/Y, g:i A', strtotime($testReport->created));

				$reportCSVDate =  date('n_j_Y', strtotime($testReport->created));
				$reportCSVDateTime =  date('n_j_Y-g_i-A', strtotime($testReport->created));
				$reportCSVFile = '/test_results/'.$view.'/'.$reportCSVDate.'/'.$testReport->testInfoProperty.'_'.$testTypeFolder.'-audit_'.$reportCSVDateTime.'.csv';
			}

			$fileLocation = urlencode($reportCSVFile);

			$usersTimezone = new DateTimeZone('America/New_York');
			$l10nDate = new DateTime($testReportTime);
			$l10nDate->setTimeZone($usersTimezone);
			// echo $l10nDate->format('Y-m-d H:i:s')."<br />";

		    $testReportViewData = '<tr class="report_row_status '.$testReportStatus.'">';

		    if ( strpos($view, 'manifest') ) {
	            $testReportViewData .= '<td><div class="report_status '.$testReportStatus.'">'.$testReportStatus.'</div></td>';
	            $testReportViewData .= '<td><a href="/utils/download?file='.$fileLocation.'"><i class="fa fa-download" style="font-size:20px;"></i></a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->testInfoProperty.'.com</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->testInfoId.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->expected_key.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->expected_value.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->live_key.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->live_value.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->info.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$l10nDate->format('n/d/Y, g:i A').'</a></td>';

	        } elseif ( strpos($view, 'nav') ) {
	            $testReportViewData .= '<td><div class="report_status '.$testReportStatus.'">'.$testReportStatus.'</div></td>';
	            $testReportViewData .= '<td><a href="/utils/download?file='.$fileLocation.'"><i class="fa fa-download" style="font-size:20px;"></i></a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->testInfoProperty.'.com</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->testInfoId.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->link_name.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->link_url.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->status_code.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->info.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$l10nDate->format('n/d/Y, g:i A').'</a></td>';

            } elseif ( strpos($view, 'article') ) {
	            $testReportViewData .= '<td><div class="report_status '.$testReportStatus.'">'.$testReportStatus.'</div></td>';
	            $testReportViewData .= '<td><a href="/utils/download?file='.$fileLocation.'"><i class="fa fa-download" style="font-size:20px;"></i></a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->testInfoProperty.'.com</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->testInfoId.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->endpoint.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->content_id.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->content_title.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->content_error.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$testReport->status.'</a></td>';
	            $testReportViewData .= '<td><a href="/reports/'.$view.'/record/'.$testReport->id.'?refID='.$testReport->test_id.'">'.$l10nDate->format('n/d/Y, g:i A').'</a></td>';
		    
		    } elseif ( $view == 'all' ) {
		    	// $testReportViewData .= '<td><div class="report_status '.$testReportStatus.'">'.$testReportStatus.'</div></td>';
		    	$testReportViewData .= '<td><a href="/utils/download?file='.$fileLocation.'"><i class="fa fa-download" style="font-size:20px;"></i></a></td>';
		    	$testReportViewData .= '<td><a href="/reports/'.$ref.'/record/'.$testReport['test_id'].'?refID='.$testReport['id'].'">'.$testReport['id'].'</a></td>';
		    	$testReportViewData .= '<td><a href="/reports/'.$ref.'/record/'.$testReport['test_id'].'?refID='.$testReport['id'].'">'.$testReport['test_id'].'</a></td>';
		    	$testReportViewData .= '<td><a href="/reports/'.$ref.'/record/'.$testReport['test_id'].'?refID='.$testReport['id'].'">'.$testReport['property'].'.com</a></td>';
		    	$testReportViewData .= '<td><a href="/reports/'.$ref.'/record/'.$testReport['test_id'].'?refID='.$testReport['id'].'">'.$l10nDate->format('n/d/Y, g:i A').'</a></td>';	
		    }
            
            $testReportViewData .= "</tr>";
         
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

}
?>