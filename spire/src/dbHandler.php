<?php
ini_set('display_errors',1);
error_reporting(E_ALL);

class DbHandler {
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
     * Insert test results; New formatted table for JSON test results.
     */
    public function insertTestResults($testID, $testType, $station, $status, $testFailureCount, $testScore, $testLoadtime, $results, $info) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("INSERT INTO test_results(ref_test_id, test_type, property, loadtime, status, failures, score, results_data, info) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $insertStatement = $stmt->execute(array($testID, $testType, $station, $testLoadtime, $status, $testFailureCount, $testScore, $results, $info));

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

    
    public function logPayloadError($testID, $testType, $error, $endpoint, $payload) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("INSERT INTO payload_errors(ref_test_id, test_type, error, endpoint, payload) VALUES(?, ?, ?, ?, ?)");
        $insertStatement = $stmt->execute(array($testID, $testType, $error, $endpoint, $payload));

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

    public function logLoadTime($testID, $testType, $manifestLoadTime, $endPoint, $clickXServerName, $testInfo) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("INSERT INTO loadtimes(ref_test_id, test_type, loadtime, endpoint, click_server, info) VALUES(?, ?, ?, ?, ?, ?)");
        $insertStatement = $stmt->execute(array($testID, $testType, $manifestLoadTime, $endPoint, $clickXServerName, $testInfo));

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
        $output = Spire::spireCache('getLoadTimes_'.$testType.'_'.$dataRange, 10000, function() use ($testType, $range) {
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

                case "apiOTTTest":
                    $testTypeName = "WHERE `test_type` = 'apiOTTTest'";
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


            $stmt = $db_con->prepare("SELECT * FROM loadtimes ".$testTypeName." ".$dataRange." AND loadtime > 300" );

            // SELECT test_type, loadtime FROM loadtimes WHERE test_type = 'apiSectionContent' AND DATE(created) >= CURDATE()
            // SELECT * FROM loadtimes WHERE loadtime >= '400' AND DATE(created) = DATE(NOW()) - INTERVAL 7 DAY ORDER BY loadtime DESC

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
        $output = Spire::spireCache('getAverageLoadTime_'.$testType.'_'.$dataRange, 10000, function() use ($testType, $range) {

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

                case "apiOTTTest":
                    $testTypeName = "WHERE `test_type` = 'apiOTTTest'";
                    break;

                case "ottTests":
                    $testTypeName = "WHERE `test_type` = 'apiOTTTest'";
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

            $stmt = $db_con->prepare("SELECT AVG(loadtime) AS averageLoadTime, test_type AS loadTimeFrom, Date(created) AS date FROM loadtimes WHERE Month(created) = Month(CURRENT_TIMESTAMP()) GROUP BY test_type, DAY(created)");

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

    public function getHighLoadTimesOverTime($dayRange, $minResponseTime, $searchTerm) {
        $output = Spire::spireCache('getHighLoadTimesOverTime_'.$dayRange.'_'.$minResponseTime.'_', 10, function() use ($dayRange, $minResponseTime, $searchTerm) {

            $db_con = Spire::getConnection();
            
            if (! $dayRange) {
                $dayRange = '7';
            }

            if (! $minResponseTime) {
                $searchTimeClause = ' AND loadtime > 300';
            } else {
                $searchTimeClause = ' AND loadtime > ' . $minResponseTime;
            }

            if ($searchTerm) {
                $searchClause .= " AND endpoint LIKE '%".$searchTerm."%'";
            }

            $stmt = $db_con->prepare("SELECT endpoint, max(loadtime) AS `max_load_time`, `created` FROM loadtimes WHERE DATE(`created`) >= CURDATE()-".$dayRange."".$searchTimeClause."".$searchClause." GROUP BY endpoint ORDER BY `max_load_time` DESC");

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

    public function storeScrapedContent($refTestID, $station, $sectionContentPayload) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("INSERT INTO content_payloads(ref_test_id, station, payload) VALUES(?, ?, ?)");
        $stmtStatus = $stmt->execute(array($refTestID, $station, $sectionContentPayload));

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

    public function getRecentContentObject($station) {
        $output = Spire::spireCache('getRecentContentObject_'.$station, 270, function() use ($station) {
            
            $db_con = Spire::getConnection();

            $stmt = $db_con->prepare("SELECT * FROM content_payloads WHERE station = '". $station ."' ORDER BY id DESC LIMIT 1");

            if ($stmt->execute()) {
                $contentPayload = $stmt->fetch();

                $stmt->closeCursor();
                return $contentPayload;
                
            } else {
                return NULL;
            }
        });

        return $output;
    }

    public function logContentCheck($refTestID, $payloadID, $station, $stale, $updateDiff, $updateDiffMin) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("INSERT INTO stale_content_check(ref_test_id, payload_id, station, stale, time_diff, min_diff) VALUES(?, ?, ?, ?, ?, ?)");
        $stmtStatus = $stmt->execute(array($refTestID, $payloadID, $station, $stale, $updateDiff, $updateDiffMin));

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


    public function getPagedStaleContentChecks($dateRange, $searchTerm, $updateTime, $includeStale, $ref) {
        $output = Spire::spireCache('getPaggedStaleContentChecks_'.$dateRange.'_'.$searchTerm.'_'.$includeStale, 10000, function() use($dateRange, $searchTerm, $updateTime, $includeStale, $ref) {
            $db_con = Spire::getConnection();

            if (! $dateRange) {
                $dayRange = 'WHERE datediff(current_date,date(`created`)) BETWEEN  0 AND 7';
            } else {
                $dayRange = 'WHERE datediff(current_date,date(`created`)) BETWEEN  0 AND '.$dateRange;
            }

            if ($updateTime) {
                $searchTimeClause = 'AND min_diff >= '.$updateTime;
            }

            if ($includeStale === 'true') {
                $staleClause = "AND stale < 2";
            } else {
                $staleClause = "AND stale < 1";
            }

            if ($searchTerm) {
                $searchClause .= " AND station LIKE '%".$searchTerm."%'";
            }

            if ($ref) {
                $append = $ref;
            } else {
                $append = '?';
            }

            $total = $db_con->query('SELECT COUNT(*) FROM stale_content_check '.$dayRange.' '.$staleClause.' '.$searchClause.' '.$searchTimeClause)->fetchColumn();
            $stmt = $db_con->prepare('SELECT COUNT(*) FROM stale_content_check '.$dayRange.' '.$staleClause.' '.$searchClause.' '.$searchTimeClause);
            // var_dump($stmt);
            // exit();

            $limit = 100;

            // How many pages will there be
            $pages = ceil($total / $limit);

            // What page are we currently on?
            $page = min($pages, filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT, array(
                'options' => array(
                    'default'   => 1,
                    'min_range' => 1
                ),
            )));

            // Calculate the offset for the query
            $offset = ($page - 1)  * $limit;

            // Some information to display to the user
            $start = $offset + 1;
            $end = min(($offset + $limit), $total);

            var_dump($pages);
            

            // The "back" link
            $prevlink = ($page > 1) ? '<li class="paginate_button "><a href="'.$append.'page=1" title="First page">&laquo;</a></li><li><a href="'.$append.'page=' . ($page - 1) . '" title="Previous page">' . ($page - 1) . '</a></li>' : '<li class="paginate_button previous disabled" id="zctb_previous"><a href="#" aria-controls="zctb" data-dt-idx="0" tabindex="0">&laquo;</a></li>';

            $currentlink = '<li class="paginate_button active"><a href="#">'. $page. '</a></li>';

            // The "forward" link
            $nextlink = ($page < $pages) ? '<li class="paginate_button"><a href="'.$append.'page=' . ($page + 1) . '" title="Next page">' . ($page + 1) . '</a></li>
                                            <li><a href="'.$append.'page=' . $pages . '" title="Last page">&raquo;</a></li>'
                                            :
                                            '<li class="paginate_button next disabled" id="zctb_next"><a href="#" aria-controls="zctb" data-dt-idx="7" tabindex="0">&raquo;</a></li>';

            // Prepare the paged query
            $stmt = $db_con->prepare('SELECT * FROM stale_content_check '.$dayRange.' '.$staleClause.' '.$searchClause.' '.$searchTimeClause.' ORDER BY id DESC LIMIT '. $limit .' OFFSET '. $offset);
            $stmt->execute();

            // Do we have any results?
            if ($stmt->rowCount() > 0) {
                $contentData = $stmt->fetchAll();
                
                $pageOutput .= '<table id="stale-content-table" class="table table-bordered table-striped" cellspacing="0" width="100%">';
                $pageOutput .= '<thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Ref ID</th>
                                        <th>Station</th>
                                        <th>Stale</th>
                                        <th>Update Diff</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>';

                foreach( $contentData as $contentCheck ){                    
                    $pageOutput .= '<tr>';
                    $pageOutput .= '<td>'. $contentCheck['id'] .
                                    '</td><td>'. $contentCheck['ref_test_id'] .
                                    '</td><td>'. $contentCheck['station'] .
                                    '</td><td>'. ($contentCheck['stale'] < 1 ? 'Update' : 'Stale') .
                                    '</td><td>'. ($contentCheck['min_diff'] < 1 ? '--' : $contentCheck['min_diff']) .
                                    '</td><td>'. $contentCheck['created'] .'</td>';
                    $pageOutput .= '</tr>';
                }

                $pageOutput .= '</table>';

                // Display the paging information
                $pageOutput .= '<div class="row">';
                $pageOutput .= '<div class="col-sm-5">
                                    <div class="dataTables_info" id="zctb_info" role="status" aria-live="polite">
                                        Showing '. $start. ' to '. $end. ' of '. $total. ' results
                                    </div>
                                </div>
                                <div class="col-sm-7">
                                    <div class="dataTables_paginate paging_simple_numbers" id="zctb_paginate">
                                        <ul class="pagination">'. $prevlink .''. $currentlink .''. $nextlink. '</ul>
                                    </div>
                                </div>';
                $pageOutput .= '</div>';

            } else {
                $pageOutput .= '<p>No results could be displayed.</p>';
            }
            $stmt->closeCursor();
            return $pageOutput;
        });

        return $output;
    }


    public function getStaleContentAverages($dateRange) {
        $output = Spire::spireCache('getStaleContentAverages_'.$dataRange, 10000, function() use ($dateRange) {
            
            if ($dateRange) {
                $searchTimeFrame = $dateRange;
            } else {
                $searchTimeFrame = 30;
            }

            $db_con = Spire::getConnection();

            $stmt = $db_con->prepare('
                SELECT
                    t2.call_letters, t2.brand, t2.shortname, AVG(t1.min_diff) as averageTime, MAX(t1.min_diff) as maxTime
                FROM
                    stale_content_check as t1
                    LEFT JOIN stations as t2 ON t2.shortname = t1.station
                WHERE
                    t1.station = t2.shortname
                    AND t1.stale < 1
                    AND datediff(current_date,date(t1.created)) BETWEEN  0 AND '. $searchTimeFrame .'
                GROUP BY t2.shortname
            ');

            if ($stmt->execute()) {
                $staleContentAverage = $stmt->fetchAll();
                // var_dump($staleContentAverage);
                $stmt->closeCursor();
                return $staleContentAverage;
            }
        });

        return $output;
    }


    public function logWeatherTileCheck($httpStatus) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("INSERT INTO weather_tile_checks(http_status) VALUES(?)");
        $stmtStatus = $stmt->execute(array($httpStatus));

        if ($stmtStatus) {
            // task row created
            $rowID = $db_con->lastInsertId();

            if ($rowID != NULL) {
                return $rowID;
            } else {
                return NULL;
            }
        } else {
            return NULL;
        }

        $stmt->close();
    }


    public function getWeatherTileChecks() {
        $output = Spire::spireCache('getWeatherTileChecks', 3600, function() {
            $db_con = Spire::getConnection();

            $stmt = $db_con->prepare("SELECT * FROM weather_tile_checks ORDER BY id DESC LIMIT 3");

            if ($stmt->execute()) {
                $weatherAPIHTTPStatuses = $stmt->fetchAll();

                $stmt->closeCursor();
                return $weatherAPIHTTPStatuses;
                
            } else {
                return NULL;
            }
        });

        return $output;
    }

    
    public function getWeatherTileCheckAvg($range) {
        $output = Spire::spireCache('getWeatherTileCheckAvg_'.$range, 3600, function() use ($range) {
            $db_con = Spire::getConnection();

            switch ($range) {
                case "today":
                    $dataRange = 'DATE(created) >= CURDATE()';
                    break;

                case "yesterday":
                    $dataRange = 'DATE(created) = CURDATE()-1';
                    break;

                case "week":
                    $dataRange = 'DATE(created) = CURDATE()-7';
                    break;

                case "currentMonth":
                    $dataRange = 'Month(created) = Month(CURRENT_DATE())';
                    break;

                default:
                    $dataRange = 'DATE(created) >= CURDATE()';
            }

            // $stmt = $db_con->prepare("SELECT * FROM weather_tile_checks ORDER BY id DESC LIMIT 3");
            // $total = $db_con->query("SELECT COUNT(*) FROM weather_tile_checks WHERE ".$dayRange)->fetchColumn();

            $stmt = $db_con->prepare("SELECT
                        (SELECT COUNT(*) FROM weather_tile_checks WHERE ".$dataRange.") AS totalTests,
                        (SELECT COUNT(*) FROM weather_tile_checks WHERE ".$dataRange." AND http_status = 404) AS totalFailures,
                        (SELECT (totalTests - totalFailures) * 100 / totalTests) AS avgUptime;");

            if ($stmt->execute()) {
                $weatherAvgData = $stmt->fetch();

                $stmt->closeCursor();
                return $weatherAvgData;
                
            } else {
                return NULL;
            }
        });

        return $output;
    }


    public function logWeatherRadarStatus($refTestID, $weatherRadarSite, $weatherRadarPrettyRef, $weatherRadarID, $weatherRadarStatus) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("INSERT INTO weather_radar_status(ref_test_id, layer_id, wsi_site, radar_status, pretty_ref) VALUES(?, ?, ?, ?, ?)");
        $stmtStatus = $stmt->execute(array($refTestID, $weatherRadarID, $weatherRadarSite, $weatherRadarStatus, $weatherRadarPrettyRef));

        if ($stmtStatus) {
            // task row created
            $rowID = $db_con->lastInsertId();

            if ($rowID != NULL) {
                return $rowID;
            } else {
                return NULL;
            }
        } else {
            return NULL;
        }

        $stmt->close();
    }

    public function getAllWeatherRadarChecks($radarStationID) {
        $output = Spire::spireCache('getAllWeatherRadarChecks_'.$radarStationID, 0, function() use ($radarStationID) {
            $db_con = Spire::getConnection();
            $stmt = $db_con->prepare("SELECT * FROM weather_radar_status WHERE layer_id = '".$radarStationID."' ORDER BY id DESC LIMIT 3");

            if ($stmt->execute()) {
                $testData = $stmt->fetchAll();
                return $testData;
            } else {
                return NULL;
            }
        });
        return $output;
    }

    public function getWeatherRadarCheckAvg($range, $stationLayerID) {
        $output = Spire::spireCache('getWeatherRadarCheckAvg_'.$stationLayerID.'_'.$range, 0, function() use ($range, $stationLayerID) {
            $db_con = Spire::getConnection();

            switch ($range) {
                case "today":
                    $dataRange = 'DATE(created) >= CURDATE()';
                    break;

                case "yesterday":
                    $dataRange = 'DATE(created) = CURDATE()-1';
                    break;

                case "week":
                    $dataRange = 'DATE(created) = CURDATE()-7';
                    break;

                case "currentMonth":
                    $dataRange = 'Month(created) = Month(CURRENT_DATE())';
                    break;

                default:
                    $dataRange = 'DATE(created) >= CURDATE()';
            }

            $stmt = $db_con->prepare("SELECT
                        (SELECT COUNT(*) FROM weather_radar_status WHERE layer_id = '".$stationLayerID."') AS totalTests,
                        (SELECT COUNT(*) FROM weather_radar_status WHERE layer_id = '".$stationLayerID."' AND radar_status = 'offline') AS totalFailures,
                        (SELECT (totalTests - totalFailures) * 100 / totalTests) AS avgUptime;");

            if ($stmt->execute()) {
                $weatherAvgData = $stmt->fetch();

                $stmt->closeCursor();
                return $weatherAvgData;
                
            } else {
                return NULL;
            }
        });

        return $output;
    }

    public function getPagedRadarStatusChecks($dateRange, $searchTerm, $updateTime, $offlineOnly, $queryType, $ref) {
        $output = Spire::spireCache('getPaggedStaleContentChecks_'.$dateRange.'_'.$searchTerm.'_'.$offlineOnly.'_'.$queryType, 0, function() use($dateRange, $searchTerm, $updateTime, $offlineOnly, $queryType, $ref) {
            $db_con = Spire::getConnection();

            if ($searchTerm) {
                if ($queryType == 'radarID') {
                    $searchClause = " WHERE layer_id = ".$searchTerm;
                } else {
                    $searchClause = " WHERE pretty_ref LIKE '%".$searchTerm."%'";
                }
            }

            if (! $dateRange) {
                $dayRange = ' AND datediff(current_date,date(`created`)) BETWEEN  0 AND 7';
            } else {
                $dayRange = ' AND datediff(current_date,date(`created`)) BETWEEN  0 AND '.$dateRange;
            }

            if ($updateTime) {
                $searchTimeClause = 'AND min_diff >= '.$updateTime;
            }

            if ($offlineOnly === 'true') {
                $offlineClause = "AND radar_status = 'offline'";
            }

            if ($ref) {
                $append = $ref;
            } else {
                $append = '?';
            }

            $total = $db_con->query('SELECT COUNT(*) FROM weather_radar_status '.$searchClause.' '.$dayRange.' '.$offlineClause.' '.$searchTimeClause)->fetchColumn();
            $stmt = $db_con->prepare('SELECT COUNT(*) FROM weather_radar_status '.$searchClause.' '.$dayRange.' '.$offlineClause.' '.$searchTimeClause);
            // var_dump($stmt);
            // exit();

            $limit = 100;

            // How many pages will there be
            $pages = ceil($total / $limit);

            // What page are we currently on?
            $page = min($pages, filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT, array(
                'options' => array(
                    'default'   => 1,
                    'min_range' => 1
                ),
            )));

            // Calculate the offset for the query
            $offset = ($page - 1)  * $limit;

            // Some information to display to the user
            $start = $offset + 1;
            $end = min(($offset + $limit), $total);

            if ($pages > 1) {
                $offsetQueryStatement = "'OFFSET '". $offset;
            }
            

            // The "back" link
            $prevlink = ($page > 1) ? '<li class="paginate_button "><a href="'.$append.'page=1" title="First page">&laquo;</a></li><li><a href="'.$append.'page=' . ($page - 1) . '" title="Previous page">' . ($page - 1) . '</a></li>' : '<li class="paginate_button previous disabled" id="zctb_previous"><a href="#" aria-controls="zctb" data-dt-idx="0" tabindex="0">&laquo;</a></li>';

            $currentlink = '<li class="paginate_button active"><a href="#">'. $page. '</a></li>';

            // The "forward" link
            $nextlink = ($page < $pages) ? '<li class="paginate_button"><a href="'.$append.'page=' . ($page + 1) . '" title="Next page">' . ($page + 1) . '</a></li>
                                            <li><a href="'.$append.'page=' . $pages . '" title="Last page">&raquo;</a></li>'
                                            :
                                            '<li class="paginate_button next disabled" id="zctb_next"><a href="#" aria-controls="zctb" data-dt-idx="7" tabindex="0">&raquo;</a></li>';

            // Prepare the paged query
            $stmt = $db_con->prepare('SELECT * FROM weather_radar_status '.$searchClause.' '.$dayRange.' '.$offlineClause.' '.$searchTimeClause.' ORDER BY id DESC LIMIT '.$limit.' '.$offsetQueryStatement );

            // var_dump($stmt);
            // exit();
            $stmt->execute();

            // Do we have any results?
            if ($stmt->rowCount() > 0) {
                $contentData = $stmt->fetchAll();
                
                $pageOutput .= '<table id="radarAverages-content-table" class="table table-bordered table-striped" cellspacing="0" width="100%">';
                $pageOutput .= '<thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Ref ID</th>
                                        <th>Layer ID</th>
                                        <th>WSI Site ID</th>
                                        <th>Radar Name</th>
                                        <th>Radar Status</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>';

                foreach( $contentData as $contentCheck ){                    
                    $pageOutput .= '<tr>';
                    $pageOutput .= '<td>'. $contentCheck['id'] .
                                    '</td><td>'. $contentCheck['ref_test_id'] .
                                    '</td><td>'. $contentCheck['layer_id'] .
                                    '</td><td>'. $contentCheck['wsi_site'] .
                                    '</td><td>'. $contentCheck['pretty_ref'] .
                                    '</td><td>'. $contentCheck['radar_status'] .
                                    '</td><td>'. $contentCheck['created'] .'</td>';
                    $pageOutput .= '</tr>';
                }

                $pageOutput .= '</table>';

                // Display the paging information
                $pageOutput .= '<div class="row">';
                $pageOutput .= '<div class="col-sm-5">
                                    <div class="dataTables_info" id="zctb_info" role="status" aria-live="polite">
                                        Showing '. $start. ' to '. $end. ' of '. $total. ' results
                                    </div>
                                </div>
                                <div class="col-sm-7">
                                    <div class="dataTables_paginate paging_simple_numbers" id="zctb_paginate">
                                        <ul class="pagination">'. $prevlink .''. $currentlink .''. $nextlink. '</ul>
                                    </div>
                                </div>';
                $pageOutput .= '</div>';

            } else {
                $pageOutput .= '<p>No results could be displayed.</p>';
            }
            $stmt->closeCursor();
            return $pageOutput;
        });

        return $output;
    }

    /* ------------- Reporting ------------------ */
    public function getTestDataById($refID, $testID) {
        // var_dump($testID);
        $output = Spire::spireCache('getTestDataById_'.$testID.'_refID-'.$refID, 10000, function() use ($refID) {
            $db_con = Spire::getConnection();
            
            $stmt = $db_con->prepare("SELECT * FROM test_results WHERE id = '".$refID."'");
            $stmt->execute(array($refID));

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

    

    public function getAllTestResultData($testType, $status, $range) {
        // $output = Spire::spireCache('getAllTestResultData_'.$testType.'_'.$status.'_'.$range, 12600, function() use ($testType, $status, $range) {
        $output = Spire::spireCache('getAllTestResultData_'.$testType.'_'.$status.'_'.$range, 12600, function() use ($testType, $status, $range) {
            
            $db_con = Spire::getConnection();

            switch ($testType) {
                case "api_manifest_audits":
                    $testTypeName = 'apiManifestTest';
                    $testTableName = 'test_results';
                    break;

                case "api_navigation_audits":
                    $testTypeName = 'apiNavTest';
                    $testTableName = 'test_results';
                    break;

                case "api_article_audits":
                    $testTypeName = 'apiContentTest';
                    $testTableName = 'test_results';
                    break;

                case "regression_tests":
                    $testTypeName = 'regressionTest';
                    $testTableName = 'test_results';
                    break;

                case "ott_tests":
                    $testTypeName = 'apiOTTTest';
                    $testTableName = 'test_results';
                    break;

                default:
                    $testTypeName = 'none-existent';
                    $testTableName = 'null';
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
                $stmt = $db_con->prepare("SELECT * FROM ".$testTableName." ".$dataRange." ORDER BY id DESC");
            } else {
                $stmt = $db_con->prepare("SELECT * FROM ".$testTableName." WHERE test_type = '".$testTypeName."' ".$filterStatus." ".$dataRange."");
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

    public function getAllRegressionTests() {
        $output = Spire::spireCache('getAllRegressionTests', 10000, function() {
        // $output = Spire::spireCache('getAllTestResultData_'.$testType.'_'.$status.'_'.$range, 12600, function() use ($testType, $status, $range) {
            // echo $testType."<br />".$status."<br />".$range."<br />";
            // exit();
            $db_con = Spire::getConnection();

            // $stmt = $db_con->prepare("SELECT * FROM tests WHERE type = 'regressionTest'");
            $stmt = $db_con->prepare("SELECT tests.*, test_results.score FROM tests LEFT OUTER JOIN test_results ON tests.id = test_results.ref_test_id  WHERE type = 'regressionTest'");

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


    // public function getPagedRegressionReports($testType, $dayRange, $ref) {
    public function getPagedRegressionReports($range, $searchTerm, $failuresOnly, $ref) {
        $output = Spire::spireCache('getPagedRegressionReports'.$range.'_'.$searchTerm, 12600, function() use($range, $searchTerm, $failuresOnly, $ref) {
            $db_con = Spire::getConnection();

            if (! $range) {
                $dayRange = 'AND datediff(current_date,date(`created`)) BETWEEN  0 AND 7';
            } else {
                $dayRange = 'AND datediff(current_date,date(`created`)) BETWEEN  0 AND '.$range;
            }

            if ($searchTerm) {
                $searchClause .= " AND property LIKE '%".$searchTerm."%'";
            }

            if ($ref) {
                $append = $ref;
            } else {
                $append = '?';
            }

            $total = $db_con->query("SELECT COUNT(*) FROM test_results WHERE test_type = 'regressionTest'".$dayRange)->fetchColumn();

            $stmt = $db_con->prepare("SELECT COUNT(*) FROM test_results WHERE test_type = 'regressionTest'".$dayRange." ".$searchClause);
            // var_dump($stmt);
            // exit();

            $limit = 100;

            // How many pages will there be
            $pages = ceil($total / $limit);

            // What page are we currently on?
            $page = min($pages, filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT, array(
                'options' => array(
                    'default'   => 1,
                    'min_range' => 1
                ),
            )));

            // Calculate the offset for the query
            $offset = ($page - 1)  * $limit;

            // Some information to display to the user
            $start = $offset + 1;
            $end = min(($offset + $limit), $total);

            var_dump($pages);
            

            // The "back" link
            $prevlink = ($page > 1) ? '<li class="paginate_button "><a href="'.$append.'page=1" title="First page">&laquo;</a></li><li><a href="'.$append.'page=' . ($page - 1) . '" title="Previous page">' . ($page - 1) . '</a></li>' : '<li class="paginate_button previous disabled" id="zctb_previous"><a href="#" aria-controls="zctb" data-dt-idx="0" tabindex="0">&laquo;</a></li>';

            $currentlink = '<li class="paginate_button active"><a href="#">'. $page. '</a></li>';

            // The "forward" link
            $nextlink = ($page < $pages) ? '<li class="paginate_button"><a href="'.$append.'page=' . ($page + 1) . '" title="Next page">' . ($page + 1) . '</a></li>
                                            <li><a href="'.$append.'page=' . $pages . '" title="Last page">&raquo;</a></li>'
                                            :
                                            '<li class="paginate_button next disabled" id="zctb_next"><a href="#" aria-controls="zctb" data-dt-idx="7" tabindex="0">&raquo;</a></li>';

            // Prepare the paged query
            $stmt = $db_con->prepare("SELECT * FROM test_results WHERE test_type = 'regressionTest'".$dayRange." ".$searchClause." ORDER BY id DESC");
            $stmt->execute();

            // Do we have any results?
            if ($stmt->rowCount() > 0) {
                $contentData = $stmt->fetchAll();
                $pageOutput = '<div class="panel panel-default">';
                $pageOutput .= '<div class="panel-heading">'.$viewName.' Reports</div>';
                $pageOutput .= '<div class="panel-body api_results">';
                $pageOutput .= '<table id="" class="reports_table display table table-striped table-bordered table-hover" cellspacing="0" width="100%">';
                $pageOutput .= '<thead><tr width="100%"><th>ID</th><th>Score</th><th>Property</th><th>Created</th></tr></thead>';
                $pageOutput .= "<tbody>";

                foreach( $contentData as $contentCheck ){
                    $l10nDate = new DateTime($contentCheck['created']);
                    $l10nDate->setTimeZone($usersTimezone);

                    if (!$contentCheck['score']) {
                        $testScore = '--';  
                    } else {
                        $testScore = $contentCheck['score'];
                    }

                    $pageOutput .= '<tr>';
                    $pageOutput .= '<td><a href="/reports/regression_tests/record/'.$contentCheck['id'].'?refID='.$contentCheck['ref_test_id'].'">'.$contentCheck['id'].'</a></td>';
                    $pageOutput .= '<td><a href="/reports/regression_tests/record/'.$contentCheck['id'].'?refID='.$contentCheck['ref_test_id'].'">'.$testScore.'</a></td>';
                    $pageOutput .= '<td><a href="/reports/regression_tests/record/'.$contentCheck['id'].'?refID='.$contentCheck['ref_test_id'].'">'.str_replace('stage_', 'stage.', $contentCheck['property']).'</a></td>';
                    $pageOutput .= '<td><a href="/reports/regression_tests/record/'.$contentCheck['id'].'?refID='.$contentCheck['ref_test_id'].'">'.$l10nDate->format('n/d/Y, g:i A').'</a></td>';
                    $pageOutput .= '</tr>';
                }
                $pageOutput .= "</tbody>";
                $pageOutput .= "<tfoot><tr><th>ID</th><th>Score</th><th>Property</th><th>Created</th></tr></tfoot>";
                $pageOutput .= '</table>';
                $pageOutput .= '</div></div>';
                $pageOutput .= '<p class="text-muted small"><i>* If the table doesn\'t style properly, click one of the sorting headers to update the view.</i></p>';
            } else {
                $pageOutput .= '<p>No results could be displayed.</p>';
            }
            $stmt->closeCursor();
            return $pageOutput;
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

                case "ott_tests":
                    $testTypeName = 'apiOTTTest';
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
                return '0';
            }
        });

        return $output;
    }

    public function getPayLoadError($testReferenceID, $testResultID) {
        $output = Spire::spireCache('getPayLoadError_'.$testReferenceID.'_'.$testResultID, 10000, function() use ($testReferenceID, $testResultID) {
            $db_con = Spire::getConnection();

            $stmt = $db_con->prepare("SELECT * FROM payload_errors WHERE ref_test_id = ".$testReferenceID);
            
            $payLoadErrors = array();

            if ($stmt->execute()) {

                /* fetch values */
                $payLoadErrorData = $stmt->fetchAll();

                foreach( $payLoadErrorData as $key => $value ){
                    $payLoadErrors[$key] = $value;
                }

                $stmt->closeCursor();
                return $payLoadErrors;
            } else {
                return NULL;
            }
        });

        return $output;
    }

    /* ------------- Stations data lookups ------------------ */
    public function getStationsGlobalAPIVer() {
        $output = Spire::spireCache('getStationsGlobalAPIVer', 259200, function() {
            
            $db_con = Spire::getConnection();

            $stmt = $db_con->prepare("SELECT `setting`, `value` FROM spire_settings WHERE `setting` = 'globalAPIVersion'");

            if ($stmt->execute()) {
                $settingData = $stmt->fetch();

                $stmt->closeCursor();
                return $settingData;
                
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

    public function updateStationData($stationID, $stationApiVersion, $stationURL, $stationShortname, $stationCallLetters, $stationGroup, $stationBrand, $stationStatus) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("UPDATE stations SET `call_letters` = '".$stationCallLetters."', `brand` = '".$stationBrand."', `shortname` = '".$stationShortname."', `url` = '".$stationURL."', `group` = '".$stationGroup."', `api_version` = '".$stationApiVersion."', `status` = '".$stationStatus."'  WHERE `id` = '".$stationID."'");

        if ($stmt->execute()) {
            if($stmt->rowCount() > 0){
                return TRUE;
            }
        } else {
            return FALSE;
        }

        $stmt->closeCursor();
    }


    public function updateGlobalAPI($newAPIVersion) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("UPDATE spire_settings, stations SET spire_settings.value = '".$newAPIVersion."', stations.api_version =  '".$newAPIVersion."' WHERE spire_settings.setting = 'globalAPIVersion' AND stations.`api_version` != '".$newAPIVersion."'");

        if ($stmt->execute()) {
            if($stmt->rowCount() > 0){
                return TRUE;
            }
        } else {
            return FALSE;
        }

        $stmt->closeCursor();

    }

    // Util ** Delete all test data older than 30days
    // Updated to purge * > 60 for full month to month
    public function purgeOldTestResults() {
        $db_con = Spire::getConnection();

        $testTableNames = array('tests','test_results','tasks','regression_tests','payload_errors','loadtimes','article_tests','nav_tests','manifest_tests');

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

    public function logNotificationAlert($refID, $errorCount, $sendable, $sendable_time, $type, $info) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("INSERT INTO alerts(ref_id, error_count, sendable, sendable_time, type, info ) VALUES(?, ?, ?, ?, ?, ?)");
        $stmtStatus = $stmt->execute(array($refID, $errorCount, $sendable, $sendable_time, $type, $info));

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


    public function getAllNotificationAlerts($type) {
        // $output = Spire::spireCache('getAllNotificationAlerts', 604800000, function() {
        $output = Spire::spireCache('getAllNotificationAlerts', 10, function() use ($type) {
            
            $db_con = Spire::getConnection();

            $stmt = $db_con->prepare("SELECT * FROM alerts WHERE type = '".$type."' ORDER BY id DESC");

            if ($stmt->execute()) {
                $notification = $stmt->fetchAll();

                $stmt->closeCursor();
                return $notification;
                
            } else {
                return NULL;
            }
        });

        return $output;
    }

    public function getRecentActiveNotificationAlerts() {
        // $output = Spire::spireCache('getAllNotificationAlerts', 604800000, function() {
        $output = Spire::spireCache('getAllNotificationAlerts', 3600, function() {
            
            $db_con = Spire::getConnection();

            $stmt = $db_con->prepare("SELECT * FROM alerts ORDER BY id DESC LIMIT 1");

            if ($stmt->execute()) {
                $notification = $stmt->fetch();

                $stmt->closeCursor();
                return $notification;
                
            } else {
                return NULL;
            }
        });

        return $output;
    }

    public function getRecentNotificationAlerts($type) {
        // $output = Spire::spireCache('getAllNotificationAlerts', 604800000, function() {
        $output = Spire::spireCache('getAllNotificationAlerts', 0, function() use ($type){
            
            $db_con = Spire::getConnection();

            $stmt = $db_con->prepare("SELECT * FROM alerts WHERE type = '".$type."' AND created >= DATE_SUB(NOW(), INTERVAL 2 HOUR) ORDER BY id DESC LIMIT 1");

            if ($stmt->execute()) {
                $notifications = $stmt->fetch();

                $stmt->closeCursor();
                return $notifications;
                
            } else {
                return NULL;
            }
        });

        return $output;
    }

    public function updateRecentNotificationAlert($alertID, $alertInfo) {
        $db_con = Spire::getConnection();

        $stmt = $db_con->prepare("UPDATE alerts SET `sendable` = '0', `info` = '".$alertInfo."'  WHERE `id` = '".$alertID."'");

        if ($stmt->execute()) {
            if($stmt->rowCount() > 0){
                return TRUE;
            }
        } else {
            return FALSE;
        }

        $stmt->closeCursor();
    }

}
?>