<?php
// namespace Spire;
// use \InvalidArgumentException;
use Psr\Http\Message\ResponseInterface;

class Spire {

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

	// public function getConnection() {
	//     $dbhost="internal-db.s135861.gridserver.com";
	//     $dbuser="db135861_bec";
	//     $dbpass="B0U6X58X54GrRjC";
	//     $dbname="db135861_bec";
	//     $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
	//     $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	//     return $dbh;
	// }

	public function getConnection() {
	    $dbhost = "localhost";
	    $dbuser = "__spireUser";
	    $dbpass = "password";
	    $dbname = "ots_spire";
	    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
	    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	    return $dbh;
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


// **********

	public static function Foo($val, $valThis) {
		$thisVal = ($val + $valThis);
		$returnVal = Spire::assertThis($thisVal, 4);
		return ($returnVal);
	}

	public static function assertThis($val, $valThis) {
		$thisVal = ($val == $valThis);

		if ($thisVal < 2) {
			$returnVal = '<h1 style="color:red;">false</h1>';
		} else {
			$returnVal = '<h1 style="color:green;">true</h1>';
		}
		return ($returnVal);
	}
}
?>