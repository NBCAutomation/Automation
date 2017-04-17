<?php
ini_set('display_errors',1);
error_reporting(E_ALL);

class DbHandler {

    // private $conn;

    function __construct() {
        require_once dirname(__FILE__) . '/spire.php';
    }

    /* ------------- `users` table method ------------------ */

    /**
     * Creating new user
     * @param String $name User full name
     * @param String $email User login email id
     * @param String $password User login password
     */
    public function createUser($first_name, $last_name, $email, $password) {
        require_once 'passHash.php';
        $response = array();

        // First check if user already existed in db
        if (!$this->isUserExists($email)) {
            // Generating password hash
            $password_hash = PassHash::hash($password);

            // Generating API key
            $api_key = $this->generateApiKey();

            // var_dump($first_name, $last_name, $email, $password);
            // exit();

            // insert query
            $stmt = $db_con->prepare("INSERT INTO users(first_name, last_name, email, password_hash, api_key, status, role) values(?, ?, ?, ?, ?, 1, 4)");
            $stmt->bind_param("sssss", $first_name, $last_name, $email, $password_hash, $api_key);

            $result = $stmt->execute();

            $stmt->close();

            // Check for successful insertion
            if ($result) {
                // User successfully inserted
                $response = 'USER_CREATED_SUCCESSFULLY';
            } else {
                // Failed to create user
                $response = 'USER_CREATE_FAILED';
            }
        } else {
            // User with same email already existed in the db
            $response = 'USER_ALREADY_EXISTED';
        }

        return $response;
    }

    /**
     * Checking user login
     * @param String $email User login email id
     * @param String $password User login password
     * @return boolean User login status success/fail
     */
    public function checkLogin($email, $password) {

        $db_con = Spire::getConnection();

        // fetching user by email
        $stmt = $db_con->prepare("SELECT `password_hash` FROM `users` WHERE `email` = ?");
        $stmt->execute(array($email));
        
        $rows = $stmt->fetchAll();
        $totalRows = count($rows);

        $password_hash = $rows[0][0];

        // echo $password_hash;

        if ($totalRows > 0) {
            // Found user with the email
            // Now verify the password
            if (PassHash::check_password($password_hash, $password)) {
                // User password is correct
                return TRUE;
            } else {
                // user password is incorrect
                return FALSE;
            }
            $stmt->close();
        } else {
            $stmt->close();
            // user not existed with the email
            return FALSE;
        }
    }

    /**
     * Checking for duplicate user by email address
     * @param String $email email to check in db
     * @return boolean
     */
    private function isUserExists($email) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("SELECT id from users WHERE email = ?");
        $stmt->execute(array($email));

        $rows = $stmt->fetchAll();
        $num_rows = count($rows);

        return $num_rows > 0;

        $stmt->close();
    }

    /**
     * Fetching user by email
     * @param String $email User email id
    */
    public function getUserByEmail($email) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("SELECT id, first_name, last_name, email, api_key, status, role, created_at FROM users WHERE email = ?");
        $stmt->execute(array($email));

        if ($stmt->execute()) {
            $userData = $stmt->fetch();

            $user = array();

            /* fetch values */
            // mysqli_stmt_fetch($stmt);

            /* set values */
            $user['id'] = $userData['id'];
            $user['first_name'] = $userData['first_name'];
            $user['last_name'] = $userData['last_name'];
            $user['email'] = $userData['email'];
            $user['api_key'] = $userData['api_key'];
            $user['role'] = $userData['role'];
            $user['created_at'] = $userData['created_at'];

            return $user;
            $stmt->close();
        } else {
            return NULL;
        }
    }

    /**
     * Fetching user api key
     * @param String $user_id user id primary key in user table
     */
    public function getApiKeyById($user_id) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("SELECT api_key FROM users WHERE id = ?");
        $stmt->execute(array($user_id));

        if ($stmt->execute()) {
            $api_key = $stmt->fetch();

            return $api_key;
            $stmt->close();
        } else {
            return NULL;
        }
    }

    /**
     * Fetching user id by api key
     * @param String $api_key user api key
     */
    public function getUserId($api_key) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("SELECT id FROM users WHERE api_key = ?");
        $stmt->execute(array($api_key));

        if ($stmt->execute()) {
            $user_id = $stmt->fetch();

            return $user_id;
            $stmt->close();
        } else {
            return NULL;
        }
    }

    /**
     * Fetching user id by api key
     * @param String $api_key user api key
     */

    public function getUserRole($api_key) {
        $db_con = Spire::getConnection();
        $stmt = $db_con->prepare("SELECT role FROM users WHERE api_key = ?");
        $stmt->execute(array($api_key));

        if ($stmt->execute()) { 
            $stmt->bind_result($user_role);

            /* fetch values */
            mysqli_stmt_fetch($stmt);

            $stmt->close();
            return $user_role;
        } else {
            return NULL;
        }
    }


    public function getAllUsers() {
        $db_con = Spire::getConnection();

        // $stmt = $db_con->prepare("SELECT id, first_name, last_name, email, api_key, status, role FROM users");
        $stmt = $db_con->prepare("SELECT `users`.`id`, `users`.`first_name`, `users`.`last_name`, `users`.`email`, `users`.`api_key`, `user_roles`.`role_name`, `users`.`status` FROM `users` INNER JOIN `user_roles` ON `users`.`role` = `user_roles`.`role`");
        $stmt->execute();

        $users = array();
        $allUserData = $stmt->fetchAll();

        if ($stmt->execute()) {
                
            foreach( $allUserData as $key => $value ){
                $users[$key] = $value;
            }

            $usersArray[] = $users;

            return $usersArray;
            $stmt->close();
        } else {
            return NULL;
        }
    }


    public function getUserById($userID) {
        $db_con = Spire::getConnection();

        // $stmt = $db_con->prepare("SELECT id, first_name, last_name, email, api_key, status, role, created_at FROM users WHERE email = ?");
        $stmt = $db_con->prepare("SELECT `users`.`id`, `users`.`first_name`, `users`.`last_name`, `users`.`email`, `users`.`api_key`, `users`.`role`, `user_roles`.`role_name`, `users`.`status`, `users`.`created_at` FROM `users` INNER JOIN `user_roles` ON `users`.`role` = `user_roles`.`role` WHERE `users`.`id` = ?");
        $stmt->execute(array($userID));

        $user = array();

        if ($stmt->execute()) {
            // Get data
            $allUserData = $stmt->fetch();

            /* set values */
            $user['id'] = $allUserData['id'];
            $user['first_name'] = $allUserData['first_name'];
            $user['last_name'] = $allUserData['last_name'];
            $user['email'] = $allUserData['email'];
            $user['api_key'] = $allUserData['api_key'];
            $user['roleID'] = $allUserData['roleID'];
            $user['role'] = $allUserData['role'];
            $user['status'] = $allUserData['status'];
            $user['created_at'] = $allUserData['created_at'];

            return $user;
            $stmt->close();
        } else {
            return NULL;
        }
    }


    /**
     * Update User Password
    */
    public function updateUserPassword($user_id, $new_password) {
        $db_con = Spire::getConnection();

        require_once 'passHash.php';
        $password_hash = PassHash::hash($new_password);
        $stmt = $db_con->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
        $stmtStatus = $stmt->execute(array($password_hash, $user_id));

        return $stmtStatus;

        $stmt->close();
    }

    /**
     * Update User info
    */
    public function updateUser($user_id, $new_password, $role, $status) {
        $db_con = Spire::getConnection();
        // var_dump($user_id, $new_password, $role, $status);
        
        if ( strlen($new_password) > 0 ){
            require_once 'passHash.php';
            $password_hash = PassHash::hash($new_password);

            $stmt = $db_con->prepare("UPDATE users SET password_hash = ?, status = ?, role = ? WHERE id = ?");
            $stmtStatus = $stmt->execute(array($password_hash, $status, $role, $user_id));
        } else {
            $stmt = $db_con->prepare("UPDATE users SET status = ?, role = ? WHERE id = ?");
            $stmtStatus = $stmt->execute(array($status, $role, $user_id));

        }

        return $stmtStatus;

        $stmt->close();
    }

    /**
     * Validating user api key
     * If the api key is there in db, it is a valid key
     * @param String $api_key user api key
     * @return boolean
     */
    public function isValidApiKey($api_key) {
        $stmt = $db_con->prepare("SELECT id from users WHERE api_key = ?");
        $stmt->bind_param("s", $api_key);
        $stmt->execute();
        $stmt->store_result();
        $rows = $stmt->fetchAll();
        $num_rows = count($rows);
        $stmt->close();
        return $num_rows > 0;
    }

    /**
     * Generating random Unique MD5 String for user Api key
     */
    private function generateApiKey() {
        return md5(uniqid(rand(), true));
    }

    /* ------------- Scripting and Testing DB Queries ------------------ */

    /**
     * Creating Test ID
     */
    
    public function createTestID($testID, $stationProperty, $testType, $testResultsFile) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("INSERT INTO tests(test_id, property, type, results_csv) VALUES(?, ?, ?, ?)");
        $stmtStatus = $stmt->execute(array($testID, $stationProperty, $testType, $testResultsFile));

        if ($stmtStatus) {
            // task row created
            // now assign the task to user
            $new_test_id = $db_con->lastInsertId();

            if ($new_test_id != NULL) {
                // task created successfully
                return $new_test_id;
            } else {
                // task failed to create
                return NULL;
            }
        } else {
            // task failed to create
            return NULL;
        }

        $stmt->close();
    }


    /**
     * Insert Test Results
     */
    public function navigationAuditInsert($resultsFile) {
        $db_con = Spire::getConnection();

        // print_r($resultsFile);
        $uploadQuery = "LOAD DATA INFILE '".$resultsFile."' INTO TABLE nav_tests FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' IGNORE 1 LINES (test_id, link_name, link_url, status_code, status, info)";

        // var_dump($db_con->query($uploadQuery));

        if ( !($stmt = $db_con->query($uploadQuery)) ) {
            // echo "\nQuery execute failed: ERRNO: (" . $db_con->errno . ") " . $db_con->error;
            return 0;
        } else {
            return 1;
        }
    }

    public function articleAuditInsert($resultsFile) {
        $db_con = Spire::getConnection();

        // print_r($resultsFile);
        $uploadQuery = "LOAD DATA INFILE '".$resultsFile."' INTO TABLE article_tests FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' IGNORE 1 LINES (test_id, endpoint, content_id, content_title, content_error, status)";

        if ( !($stmt = $db_con->query($uploadQuery)) ) {
            // echo "\nQuery execute failed: ERRNO: (" . $db_con->errno . ") " . $db_con->error;
            return 0;
        } else {
            return 1;
        }
    }

    // Will be replaced by 
    public function manifestAuditInsert($resultsFile) {
        $db_con = Spire::getConnection();

        // print_r($resultsFile);
        $uploadQuery = "LOAD DATA INFILE '".$resultsFile."' INTO TABLE manifest_tests FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' IGNORE 1 LINES (test_id, apiVersion, expected_key, expected_value, live_key, live_value, status, info)";

        // if ( !($stmt = $db_con->query($uploadQuery)) ) {
        if ( !($stmt = $db_con->query($uploadQuery)) ) {
            // echo "\nQuery execute failed: ERRNO: (" . $db_con->errno . ") " . $db_con->error;
            return 0;
        } else {
            return 1;
        }
    }

    public function saveRegressionResults($regressionResults) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("INSERT INTO regression_tests(test_data) VALUES(?)");
        $stmtStatus = $stmt->execute(array($regressionResults));

        if ($stmtStatus) {
            // task row created
            // now assign the task to user
            $new_test_id = $db_con->lastInsertId();

            if ($new_test_id != NULL) {
                // task created successfully
                return $new_test_id;
            } else {
                // task failed to create
                return NULL;
            }
        } else {
            // task failed to create
            return NULL;
        }

        $stmt->closeCursor();
    }

    /**
     * Insert test results; New formatted table for JSON test results.
     */
    public function insertTestResults($testID, $testType, $station, $status, $testFailureCount, $testLoadtime, $results, $info) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("INSERT INTO test_results(ref_test_id, test_type, property, loadtime, status, failures, results_data, info) VALUES(?, ?, ?, ?, ?, ?, ?, ?)");
        $insertStatement = $stmt->execute(array($testID, $testType, $station, $testLoadtime, $status, $testFailureCount, $results, $info));

        if ($insertStatement) {
            $lastInsertId = $db_con->lastInsertId();

            if (! $lastInsertId) {
                return FALSE;
            } else {
                return TRUE;
            }
        }

        $stmt->closeCursor();
    }


    /**
     * Insert or update manifest dictionary data
     */
    public function insertUpdateManifestDictionary($station, $manifestDictionaryData) {
        $db_con = Spire::getConnection();
        $queryStatus = FALSE;

        $lookupStmt = $db_con->prepare("SELECT id FROM manifest_dictionary WHERE `station` = '".$station."'");

        if ($lookupStmt->execute()) {
            $manifestDictionaryID = $lookupStmt->fetch();

            if(! $manifestDictionaryID){
                // If no dictionary found insert
                $stmt = $db_con->prepare("INSERT INTO manifest_dictionary(station, dictionary_object) VALUES(?, ?)");
                $insertStatement = $stmt->execute(array($station, $manifestDictionaryData));

                if ($insertStatement) {
                    $dictionaryID = $db_con->lastInsertId();

                    if ($dictionaryID != NULL) {
                        $queryStatus = TRUE;
                        return $queryStatus;
                    } else {
                        return $queryStatus;
                    }
                } else {
                    return $queryStatus;
                }
            } else {
                // If dictionary found update data object
                $stmt = $db_con->prepare("UPDATE manifest_dictionary SET dictionary_object = ? WHERE station = ?");
                $stmtStatus = $stmt->execute(array($manifestDictionaryData, $station));

                $queryStatus = $stmtStatus;

                $stmt->closeCursor();
                return $queryStatus;
            }

            return $queryStatus;

            $lookupStmt->closeCursor();
        } else {
            
        }
    }


    public function getManifestDictionaryData($station) {
        $output = Spire::spireCache('getManifestDictionaryData_'.$station, 604800, function() use ($station) {

            $db_con = Spire::getConnection();

            $stmt = $db_con->prepare("SELECT dictionary_object FROM manifest_dictionary WHERE `station` = '".$station."'");

            if ($stmt->execute()) {
                $manifestDictionaryData = $stmt->fetch();

                $stmt->closeCursor();
                return $manifestDictionaryData;
            } else {
                return NULL;
            }
        });

        return $output;
    }

    
    public function logLoadTime($testID, $testType, $manifestLoadTime, $endPoint, $testInfo) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("INSERT INTO loadtimes(ref_test_id, test_type, loadtime, endpoint, info) VALUES(?, ?, ?, ?, ?)");
        $insertStatement = $stmt->execute(array($testID, $testType, $manifestLoadTime, $endPoint, $testInfo));

        if ($insertStatement) {
            $lastInsertId = $db_con->lastInsertId();

            if (! $lastInsertId) {
                return FALSE;
            } else {
                return TRUE;
            }
        }

        $stmt->closeCursor();
    }


    public function getLoadTimes($testType, $dataRange) {
        $output = Spire::spireCache('getLoadTimes_'.$testType.'_'.$dataRange, 10, function() use ($testType, $range) {
            $db_con = Spire::getConnection();

            switch ($testType) {
                case "apiManifestTest":
                    $testTypeName = "WHERE `test_type` = 'apiManifestTest'";
                    break;

                case "apiContentTest":
                    $testTypeName = "WHERE `test_type` = 'apiContentTest'";
                    break;

                case "apiNavTest":
                    $testTypeName = "WHERE `test_type` = 'apiNavTest'";
                    break;

                case "apiSectionContent":
                    $testTypeName = "WHERE `test_type` = 'apiSectionContent'";
                    break;

                default:
                    $testTypeName = '';
            }

            switch ($range) {
                case "all":
                    $dataRange = '';
                    break;

                case "today":
                    $dataRange = 'AND DATE(created) >= CURDATE()';
                    break;

                case "yesterday":
                    $dataRange = 'AND DATE(created) = CURDATE()-1';
                    break;

                case "currentMonth":
                    $dataRange = 'AND Month(created) = Month(CURRENT_DATE())';
                    break;

                case "lastMonth":
                    $dataRange = 'AND Month(created) = Month(CURRENT_DATE())-1';
                    break;

                default:
                    $dataRange = 'AND DATE(created) >= CURDATE()';
            }


            $stmt = $db_con->prepare("SELECT test_type, loadtime, endpoint, created FROM loadtimes ".$testTypeName." ".$dataRange );

            // SELECT test_type, loadtime FROM loadtimes WHERE test_type = 'apiSectionContent' AND DATE(created) >= CURDATE()

            $loadTimeArray = array();

            if ($stmt->execute()) {
                $loadTimeResults = $stmt->fetchAll();
                    
                foreach( $loadTimeResults as $key => $value ){
                    $loadTimeArray[$key] = $value;
                }

                $storedLoadTimes[] = $loadTimeArray;

                $stmt->closeCursor();
                return $storedLoadTimes;
                
            } else {
                return NULL;
            }
        });

        return $output;
    }

    public function getAverageLoadTime($testType, $range) {
        $output = Spire::spireCache('getAverageLoadTime_'.$testType.'_'.$dataRange, 1000, function() use ($testType, $range) {

            $db_con = Spire::getConnection();

            switch ($testType) {
                case "apiManifestTest":
                    $testTypeName = "WHERE `test_type` = 'apiManifestTest'";
                    break;

                case "apiContentTest":
                    $testTypeName = "WHERE `test_type` = 'apiContentTest'";
                    break;

                case "apiNavTest":
                    $testTypeName = "WHERE `test_type` = 'apiNavTest'";
                    break;

                case "apiSectionContent":
                    $testTypeName = "WHERE `test_type` = 'apiSectionContent'";
                    break;

                default:
                    $testTypeName = '';
            }

            switch ($range) {
                case "all":
                    $dataRange = '';
                    break;

                case "today":
                    $dataRange = 'AND DATE(created) >= CURDATE()';
                    break;

                case "yesterday":
                    $dataRange = 'AND DATE(created) = CURDATE()-1';
                    break;

                case "currentMonth":
                    $dataRange = 'AND Month(created) = Month(CURRENT_DATE())';
                    break;

                case "lastMonth":
                    $dataRange = 'AND Month(created) = Month(CURRENT_DATE())-1';
                    break;

                // Last Hour
                default:
                    $dataRange = 'AND created >= DATE_SUB(NOW(), INTERVAL 1 HOUR)';
            }


            $stmt = $db_con->prepare("SELECT AVG(loadtime) AS averageLoadTime FROM loadtimes ". $testTypeName ."  ".$dataRange);

            if ($stmt->execute()) {
                $averageLoadTime = $stmt->fetch();

                $stmt->closeCursor();
                return $averageLoadTime['averageLoadTime'];
            } else {
                return NULL;
            }
        });

        return $output;
    }

    public function getAllAverageLoadTimes() {
        $output = Spire::spireCache('getAllAverageLoadTimes', 10000, function() {

            $db_con = Spire::getConnection();

            // $stmt = $db_con->prepare("SELECT AVG(loadtime) AS averageLoadTime, test_type AS dataPointName, Date(created) AS dayDate, Hour(created) AS hourInterval FROM loadtimes GROUP BY test_type, DAY(created), HOUR(created)");
            $stmt = $db_con->prepare("SELECT AVG(loadtime) AS averageLoadTime, test_type AS loadTimeFrom, Date(created) AS date FROM loadtimes GROUP BY test_type, DAY(created)");

            $loadTimeArray = array();

            if ($stmt->execute()) {
                $loadTimeResults = $stmt->fetchAll();
                    
                foreach( $loadTimeResults as $key => $value ){
                    $loadTimeArray[$key] = $value;
                    // echo $value['dataPointName'].' // '.$value['dayDate'].' - '.$value['hourInterval'].'<br />';
                }

                $storedLoadTimes[] = $loadTimeArray;

                $stmt->closeCursor();
                return $storedLoadTimes;
                
            } else {
                return NULL;
            }


        });

        return $output;
    }


    /* ------------- Reporting ------------------ */
    public function getTestDataById($testID) {
        $output = Spire::spireCache('getTestDataById_'.$testID, 1000, function() use ($testID) {
            $db_con = Spire::getConnection();
            
            $stmt = $db_con->prepare("SELECT * FROM test_results WHERE id = '".$testID."'");
            $stmt->execute(array($testID));

            $tests = array();

            if ($stmt->execute()) {
                $testData = $stmt->fetch();


                $tests['id'] = $testData['id'];
                $tests['ref_test_id'] = $testData['ref_test_id'];
                $tests['test_type'] = $testData['test_type'];
                $tests['property'] = $testData['property'];
                $tests['status'] = $testData['status'];
                $tests['failures'] = $testData['failures'];            
                $tests['results_data'] = $testData['results_data'];            
                $tests['info'] = $testData['info'];            
                $tests['created'] = $testData['created'];

                $stmt->closeCursor();
                return $tests;
            } else {
                return NULL;
            }
        });
        return $output;
    }

    public function getFailuresPer30Day($testResultsTable) {
        $output = Spire::spireCache('getFailuresPer30Day_'.$testResultsTable, 10, function() use ($testResultsTable) {
            
            $db_con = Spire::getConnection();

            switch ($testResultsTable) {
                
                case "api_manifest_audits":
                    $testTableName = 'manifest_tests';
                    break;

                case "apiCheck-manifest":
                    $testTableName = 'manifest_tests';
                    break;

                case "api_navigation_audits":
                    $testTableName = 'nav_tests';
                    break;

                case "apiCheck-nav":
                    $testTableName = 'nav_tests';
                    break;

                case "api_article_audits":
                    $testTableName = 'article_tests';
                    break;

                case "apiCheck-article":
                    $testTableName = 'article_tests';
                    break;

                default:
                    $testTableName = 'none-existent';
            }

            //$stmt = $db_con->prepare("SELECT * FROM ".$testTableName." WHERE DATE(created) = CURDATE() AND status = 'Fail'");
            $stmt = $db_con->prepare("SELECT Year(`created`) AS 'Year', Month(`created`) AS 'Month', Day(`created`) AS 'Day', COUNT(*) AS 'Total' FROM ".$testTableName." WHERE `created` <= NOW() AND status = 'Fail' GROUP BY Year(`created`), Month(`created`), Day(`created`)");
            $failureCounts = array();

            $months = array(1 => 'Jan.', 2 => 'Feb.', 3 => 'Mar.', 4 => 'Apr.', 5 => 'May', 6 => 'Jun.', 7 => 'Jul.', 8 => 'Aug.', 9 => 'Sep.', 10 => 'Oct.', 11 => 'Nov.', 12 => 'Dec.');

            if ($stmt->execute()) {
                $errorReports = $stmt->fetchAll();

                foreach ($errorReports as $key => $val) {
                    echo 'Day > '. $val['Day'].'<br />';
                    echo 'Month > '. $val['Month'].'<br />';
                    echo 'Year > '. $val['Year'].'<br />';
                    echo 'Total > '. $val['Total'].'<br />';
                    echo '<br />';

                    foreach ($months as $num => $name) {
                        $monthName = date('F', mktime(0, 0, 0, $num, 10));
                        if ($num == $val['Month']) {
                            $failureCounts[$monthName."Value"] = $val['Total'];
                        } else {
                            $failureCounts[$monthName."Value"] = "0";
                        }
                    }
                }

                $stmt->closeCursor();
                // var_dump($failureCounts);
                $monthFailureCounts = implode(",",$failureCounts);
                return $monthFailureCounts;
            } else {
                return NULL;
            }
        });

        return $output;

    }

    public function getAllTestResultData($testType, $status, $range) {
        $output = Spire::spireCache('getAllTestResultData_'.$testType.'_'.$status.'_'.$range, 12600, function() use ($testType, $status, $range) {
            // echo $testType."<br />".$status."<br />".$range."<br />";
            $db_con = Spire::getConnection();

            switch ($testType) {
                case "api_manifest_audits":
                    $testTypeName = 'apiManifestTest';
                    break;

                case "api_navigation_audits":
                    $testTypeName = 'apiNavTest';
                    break;

                case "api_article_audits":
                    $testTypeName = 'apiContentTest';
                    break;

                case "regression_tests":
                    $testTypeName = 'regressionTest';
                    break;

                default:
                    $testTypeName = 'none-existent';
            }

            switch ($status) {
                case "all":
                    $filterStatus = '';
                    break;

                case "fail":
                    $filterStatus = "AND status = 'fail'";
                    break;

                case "pass":
                    $filterStatus = "AND status = 'pass'";
                    break;

                default:
                    $filterStatus = "";
            }

            switch ($range) {
                case "all":
                    $dataRange = '';
                    break;

                case "today":
                    $dataRange = 'AND DATE(created) >= CURDATE()';
                    break;

                case "yesterday":
                    $dataRange = 'AND DATE(created) = CURDATE()-1';
                    break;

                case "currentMonth":
                    $dataRange = 'AND Month(created) = Month(CURRENT_DATE())';
                    break;

                case "lastMonth":
                    $dataRange = 'AND Month(created) = Month(CURRENT_DATE())-1';
                    break;

                default:
                    $dataRange = 'AND DATE(created) >= CURDATE()';
            }


            if ($testType == 'all') {
                $stmt = $db_con->prepare("SELECT * FROM test_results ".$dataRange." ORDER BY id DESC");    
            } else {
                $stmt = $db_con->prepare("SELECT * FROM test_results WHERE test_type = '".$testTypeName."' ".$filterStatus." ".$dataRange."");
            }

            $testResultsData = array();

            if ($stmt->execute()) {
                $testResults = $stmt->fetchAll();
                    
                foreach( $testResults as $key => $value ){
                    $testResultsData[$key] = $value;
                }

                $storedTestData[] = $testResultsData;

                $stmt->closeCursor();
                return $storedTestData;
                
            } else {
                return NULL;
            }
        });

        return $output;
    }

    public function getTestReportCount($testType, $status, $range) {
        $output = Spire::spireCache('getTestReportCount_'.$testType.'-'.$status.'-'.$range, 12600, function() use ($testType, $status, $range) {

            $db_con = Spire::getConnection();
            
            switch ($testType) {
                case "api_manifest_audits":
                    $testTypeName = 'apiManifestTest';
                    break;

                case "api_navigation_audits":
                    $testTypeName = 'apiNavTest';
                    break;

                case "api_article_audits":
                    $testTypeName = 'apiContentTest';
                    break;

                case "regression_tests":
                    $testTypeName = 'regressionTest';
                    break;

                default:
                    $testTypeName = 'none-existent';
            }

            switch ($status) {
                case "all":
                    $filterStatus = '';
                    break;

                case "fail":
                    $filterStatus = "AND status = 'fail'";
                    break;

                case "pass":
                    $filterStatus = "AND status = 'pass'";
                    break;

                case "warning":
                    $filterStatus = "AND status = 'warning'";
                    break;

                default:
                    $filterStatus = "";
            }

            switch ($range) {
                case "all":
                    $dataRange = '';
                    break;

                case "today":
                    $dataRange = 'AND DATE(created) >= CURDATE()';
                    break;

                case "yesterday":
                    $dataRange = 'AND DATE(created) = CURDATE()-1';
                    break;

                case "currentMonth":
                    $dataRange = 'AND Month(created) = Month(CURRENT_DATE())';
                    break;

                case "lastMonth":
                    $dataRange = 'AND Month(created) = Month(CURRENT_DATE())-1';
                    break;

                default:
                    $dataRange = 'AND DATE(created) >= CURDATE()';
            }

            if ($testType == 'all') {
                $stmt = $db_con->prepare("SELECT COUNT(*) AS totalFailures FROM test_results ".$dataRange." ORDER BY id DESC");    
            } else {
                $stmt = $db_con->prepare("SELECT COUNT(*) AS totalFailures FROM test_results WHERE test_type = '".$testTypeName."' ".$filterStatus." ".$dataRange."");
            }

            // var_dump($stmt);
            
            if ($stmt->execute()) {

                $errorCount = $stmt->fetch();
                $totalFailures = $errorCount['totalFailures'];

                $stmt->closeCursor();
                return $totalFailures;
            } else {
                return NULL;
            }
        });

        return $output;
    }

    public function getAllStations() {
        $output = Spire::spireCache('getAllStations', 259200, function() {
            
            $db_con = Spire::getConnection();

            $stmt = $db_con->prepare("SELECT * FROM stations");
            $stations = array();

            if ($stmt->execute()) {
                $stationData = $stmt->fetchAll();
                    
                foreach( $stationData as $key => $value ){
                    $stations[$key] = $value;
                }

                $stationsArray[] = $stations;

                $stmt->closeCursor();
                return $stationsArray;
                
            } else {
                return NULL;
            }
        });

        return $output;
    }

    public function getStationById($stationID) {
        $output = Spire::spireCache('getStationById_'.$stationID, 86400, function() use ($stationID) {
            $db_con = Spire::getConnection();

            $stmt = $db_con->prepare("SELECT * FROM stations WHERE id = ".$stationID);
            
            $station = array();

            if ($stmt->execute()) {

                /* fetch values */
                $stationData = $stmt->fetchAll();
                $stmt->closeCursor();
                return $stationData;
            } else {
                return NULL;
            }
        });

        return $output;
    }


    // Util ** Delete all test data older than 30days
    // Updated to purge * > 60 for full month to month
    public function purgeOldTestResults() {
        $db_con = Spire::getConnection();

        $testTableNames = array('tests','article_tests','nav_tests','manifest_tests');

        $purgedData = array();

        foreach ($testTableNames as $tableName) {
            
            $stmt = $db_con->prepare("DELETE FROM ".$tableName." WHERE DATE_SUB(CURDATE(),INTERVAL 61 DAY) >= `created`");
            
            if ( $res = $stmt->execute() ) {

                $purgedData[$tableName] = $stmt->rowCount();
                $stmt->closeCursor();
            } else {
                return NULL;
            }
        }

        return $purgedData;
    }

    /**
     * Log user task
     */
    
    public function logTask($task, $user, $taskNotes) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("INSERT INTO tasks(task, user, info) VALUES(?, ?, ?)");
        $stmtStatus = $stmt->execute(array($task, $user, $taskNotes));

        if ($stmtStatus) {
            // task row created
            $rowID = $db_con->lastInsertId();

            if ($rowID != NULL) {
                // task created successfully
                return $rowID;
            } else {
                // task failed to create
                return NULL;
            }
        } else {
            // task failed to create
            return NULL;
        }

        $stmt->close();
    }

}
// DB
// SELECT Year(`created`), Month(`created`), Day(`created`), COUNT(*) FROM article_tests WHERE `created` <= NOW() AND status = 'Fail' GROUP BY Year(`created`), Month(`created`), Day(`created`)

// SELECT Year(`created`) AS 'Year', Month(`created`) AS 'Month', Day(`created`) AS 'Day', COUNT(*) AS 'Total' FROM manifest_tests WHERE `created` <= NOW() AND status = 'Fail' GROUP BY Year(`created`), Month(`created`), Day(`created`)

// Total past 30 days
// SELECT Year(`created`), Month(`created`), Day(`created`), COUNT(*) FROM article_tests WHERE `created` <= NOW() AND status = 'Fail'
?>