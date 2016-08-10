<?php
ini_set('display_errors',1);
error_reporting(E_ALL);

class DbHandler {

    private $conn;

    function __construct() {
        require_once dirname(__FILE__) . '/dbConn.php';

        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();

        // $dbcon->conn = $db->getConnection();
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
            $stmt = $this->conn->prepare("INSERT INTO users(first_name, last_name, email, password_hash, api_key, status, role) values(?, ?, ?, ?, ?, 1, 4)");
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
        // fetching user by email
        $stmt = $this->conn->prepare("SELECT password_hash FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->bind_result($password_hash);
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            // Found user with the email
            // Now verify the password
            $stmt->fetch();
            $stmt->close();
            if (PassHash::check_password($password_hash, $password)) {
                // User password is correct
                return TRUE;
            } else {
                // user password is incorrect
                return FALSE;
            }
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
        $stmt = $this->conn->prepare("SELECT id from users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    /**
     * Fetching user by email
     * @param String $email User email id
    */
    public function getUserByEmail($email) {
        $stmt = $this->conn->prepare("SELECT id, first_name, last_name, email, api_key, status, role, created_at FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);

        if ($stmt->execute()) {
            $stmt->bind_result($id, $first_name, $last_name, $email, $api_key, $status, $role, $created_at);

            $user = array();

            /* fetch values */
            mysqli_stmt_fetch($stmt);

            /* set values */
            $user['id'] = $id;
            $user['first_name'] = $first_name;
            $user['last_name'] = $last_name;
            $user['email'] = $email;
            $user['api_key'] = $api_key;
            $user['role'] = $role;
            $user['created_at'] = $created_at;

            $stmt->close();
            return $user;
        } else {
            return NULL;
        }
    }

    /**
     * Fetching user api key
     * @param String $user_id user id primary key in user table
     */
    public function getApiKeyById($user_id) {
        $stmt = $this->conn->prepare("SELECT api_key FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        if ($stmt->execute()) {
            $api_key = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            return $api_key;
        } else {
            return NULL;
        }

        // if ($stmt->execute()) {
        //     $stmt->bind_result($api_key);

        //     $api_key = array();

        //     /* fetch values */
        //     mysqli_stmt_fetch($stmt);
        //     var_dump($api_key)
        //     $stmt->close();
        //     return $api_key;
        // } else {
        //     return NULL;
        // }
    }

    /**
     * Fetching user id by api key
     * @param String $api_key user api key
     */
    public function getUserId($api_key) {
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE api_key = ?");
        // $stmt->bind_param("s", $api_key);
        $stmt->bind_param("s", $api_key);
        if ($stmt->execute()) {
            $user_id = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            return $user_id;
        } else {
            return NULL;
        }
    }

    /**
     * Fetching user id by api key
     * @param String $api_key user api key
     */
    // public function getUserRole($api_key) {
    //     $stmt = $this->conn->prepare("SELECT role FROM users WHERE api_key = ?");
    //     // $stmt = $this->conn->prepare("SELECT `users`.`role` FROM `users` LEFT JOIN `user_roles` ON `user_roles`.`role` = `users`.`role`");
        // $stmt = $this->conn->prepare("SELECT `users`.`role` FROM `users` WHERE `api_key` = `31d6440532e72c5882e90baa3e820eca` AS `c_uer_role` INNER JOIN `user_roles` ON `users`.`c_uer_role` = `user_roles`.`role`");

    //     $stmt->bind_param("s", $api_key);
    //     if ($stmt->execute()) {
    //         $user_role = $stmt->get_result()->fetch_assoc();
    //         var_dump('user role - '.$user_role);
    //         $stmt->close();
    //         return $user_role;
    //     } else {
    //         return NULL;
    //     }
    // }


    public function getUserRole($api_key) {
        $stmt = $this->conn->prepare("SELECT role FROM users WHERE api_key = ?");
        $stmt->bind_param("s", $api_key);

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
        // $stmt = $this->conn->prepare("SELECT id, first_name, last_name, email, api_key, status, role FROM users");
        $stmt = $this->conn->prepare("SELECT `users`.`id`, `users`.`first_name`, `users`.`last_name`, `users`.`email`, `users`.`api_key`, `user_roles`.`role_name`, `users`.`status` FROM `users` INNER JOIN `user_roles` ON `users`.`role` = `user_roles`.`role`");
        $stmt->execute();
        $users = array();

        if ($stmt->execute()) {
            $stmt->bind_result($user->id, $user->first_name, $user->last_name, $user->email, $user->api_key, $user->role, $user->status);

            while (mysqli_stmt_fetch($stmt)){
                
                foreach( $user as $key => $value ){
                    $users[$key] = $value;
                }

                $usersArray[] = $users;
            }

            $stmt->close();
            return $usersArray;
        } else {
            return NULL;
        }
    }


    public function getUserById($userID) {
        // $stmt = $this->conn->prepare("SELECT id, first_name, last_name, email, api_key, status, role, created_at FROM users WHERE email = ?");
        $stmt = $this->conn->prepare("SELECT `users`.`id`, `users`.`first_name`, `users`.`last_name`, `users`.`email`, `users`.`api_key`, `users`.`role`, `user_roles`.`role_name`, `users`.`status`, `users`.`created_at` FROM `users` INNER JOIN `user_roles` ON `users`.`role` = `user_roles`.`role` WHERE `users`.`id` = ?");
        $stmt->bind_param("s", $userID);

        $user = array();

        if ($stmt->execute()) {
            $stmt->bind_result($id, $first_name, $last_name, $email, $api_key, $roleID, $role, $status, $created_at);

            /* fetch values */
            mysqli_stmt_fetch($stmt);

            /* set values */
            $user['id'] = $id;
            $user['first_name'] = $first_name;
            $user['last_name'] = $last_name;
            $user['email'] = $email;
            $user['api_key'] = $api_key;
            $user['roleID'] = $roleID;
            $user['role'] = $role;
            $user['status'] = $status;
            $user['created_at'] = $created_at;

            $stmt->close();
            return $user;
        } else {
            return NULL;
        }
    }


    /**
     * Update User Password
    */
    public function updateUserPassword($user_id, $new_password) {
        // var_dump($user_id, $new_password);
        // exit();

        require_once 'passHash.php';
        $password_hash = PassHash::hash($new_password);
        $stmt = $this->conn->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
        $stmt->bind_param("si", $password_hash, $user_id);
        $stmt->execute();
        $num_affected_rows = $stmt->affected_rows;
        $stmt->close();
        return $num_affected_rows > 0;
    }

    /**
     * Update User info
    */
    public function updateUser($user_id, $new_password, $role, $status) {
        // var_dump($user_id, $new_password, $role, $status);
        
        if ( strlen($new_password) > 0 ){
            require_once 'passHash.php';
            $password_hash = PassHash::hash($new_password);

            $stmt = $this->conn->prepare("UPDATE users SET password_hash = ?, status = ?, role = ? WHERE id = ?");
            $stmt->bind_param("siii", $password_hash, $status, $role, $user_id);
        } else {
            $stmt = $this->conn->prepare("UPDATE users SET status = ?, role = ? WHERE id = ?");
            $stmt->bind_param("iii", $status, $role, $user_id);
        }
        
        $stmt->execute();
        $num_affected_rows = $stmt->affected_rows;
        $stmt->close();
        return $num_affected_rows > 0;
    }

    /**
     * Validating user api key
     * If the api key is there in db, it is a valid key
     * @param String $api_key user api key
     * @return boolean
     */
    public function isValidApiKey($api_key) {
        $stmt = $this->conn->prepare("SELECT id from users WHERE api_key = ?");
        $stmt->bind_param("s", $api_key);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    /**
     * Generating random Unique MD5 String for user Api key
     */
    private function generateApiKey() {
        return md5(uniqid(rand(), true));
    }

    /* ------------- `tasks` table method ------------------ */

    /**
     * Creating new task
     * @param String $user_id user id to whom task belongs to
     * @param String $task task text
     */
    public function createTask($user_id, $task) {
        $stmt = $this->conn->prepare("INSERT INTO tasks(task) VALUES(?)");
        $stmt->bind_param("s", $task);
        $result = $stmt->execute();
        $stmt->close();

        if ($result) {
            // task row created
            // now assign the task to user
            $new_task_id = $this->conn->insert_id;
            $res = $this->createUserTask($user_id, $new_task_id);
            if ($res) {
                // task created successfully
                return $new_task_id;
            } else {
                // task failed to create
                return NULL;
            }
        } else {
            // task failed to create
            return NULL;
        }
    }

    /**
     * Fetching single task
     * @param String $task_id id of the task
     */
    public function getTask($task_id, $user_id) {
        $stmt = $this->conn->prepare("SELECT t.id, t.task, t.status, t.created_at from tasks t, user_tasks ut WHERE t.id = ? AND ut.task_id = t.id AND ut.user_id = ?");
        $stmt->bind_param("ii", $task_id, $user_id);
        if ($stmt->execute()) {
            $task = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            return $task;
        } else {
            return NULL;
        }
    }

    /**
     * Fetching all user tasks
     * @param String $user_id id of the user
     */
    public function getAllUserTasks($user_id) {
        $stmt = $this->conn->prepare("SELECT t.* FROM tasks t, user_tasks ut WHERE t.id = ut.task_id AND ut.user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $tasks = $stmt->get_result();
        $stmt->close();
        return $tasks;
    }

    /**
     * Updating task
     * @param String $task_id id of the task
     * @param String $task task text
     * @param String $status task status
     */
    public function updateTask($user_id, $task_id, $task, $status) {
        $stmt = $this->conn->prepare("UPDATE tasks t, user_tasks ut set t.task = ?, t.status = ? WHERE t.id = ? AND t.id = ut.task_id AND ut.user_id = ?");
        $stmt->bind_param("siii", $task, $status, $task_id, $user_id);
        $stmt->execute();
        $num_affected_rows = $stmt->affected_rows;
        $stmt->close();
        return $num_affected_rows > 0;
    }

    /**
     * Deleting a task
     * @param String $task_id id of the task to delete
     */
    public function deleteTask($user_id, $task_id) {
        $stmt = $this->conn->prepare("DELETE t FROM tasks t, user_tasks ut WHERE t.id = ? AND ut.task_id = t.id AND ut.user_id = ?");
        $stmt->bind_param("ii", $task_id, $user_id);
        $stmt->execute();
        $num_affected_rows = $stmt->affected_rows;
        $stmt->close();
        return $num_affected_rows > 0;
    }

    /* ------------- `user_tasks` table method ------------------ */

    /**
     * Function to assign a task to user
     * @param String $user_id id of the user
     * @param String $task_id id of the task
     */
    public function createUserTask($user_id, $task_id) {
        $stmt = $this->conn->prepare("INSERT INTO user_tasks(user_id, task_id) values(?, ?)");
        $stmt->bind_param("ii", $user_id, $task_id);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }

    /* ------------- Scripting and Testing DB Queries ------------------ */

    /**
     * Creating Test ID
     */
    
    public function createTestID($testID, $stationProperty, $testType) {
        $stmt = $this->conn->prepare("INSERT INTO tests(test_id, property, type) VALUES(?, ?, ?)");
        $stmt->bind_param("iss", $testID, $stationProperty, $testType);

        $result = $stmt->execute();
        $stmt->close();

        if ($result) {
            // task row created
            // now assign the task to user
            $new_test_id = $this->conn->insert_id;

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
    }


    /**
     * Insert Test Results
     */
    public function navigationAuditInsert($resultsFile) {
        // print_r($resultsFile);
        $uploadQuery = "LOAD DATA LOCAL INFILE '".$resultsFile."' INTO TABLE nav_tests FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' IGNORE 1 LINES (test_id, link_name, link_url, status_code, status, info)";
        


        if ( !($stmt = $this->conn->query($uploadQuery)) ) {
            // echo "\nQuery execute failed: ERRNO: (" . $this->conn->errno . ") " . $this->conn->error;
            return 0;
        } else {
            return 1;
        }
    }

    public function articleAuditInsert($resultsFile) {
        // print_r($resultsFile);
        $uploadQuery = "LOAD DATA LOCAL INFILE '".$resultsFile."' INTO TABLE article_tests FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' IGNORE 1 LINES (test_id, endpoint, content_id, content_title, content_error, status)";

        if ( !($stmt = $this->conn->query($uploadQuery)) ) {
            // echo "\nQuery execute failed: ERRNO: (" . $this->conn->errno . ") " . $this->conn->error;
            return 0;
        } else {
            return 1;
        }
    }

    public function manifestAuditInsert($resultsFile) {
        // print_r($resultsFile);
        $uploadQuery = "LOAD DATA LOCAL INFILE '".$resultsFile."' INTO TABLE manifest_tests FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' IGNORE 1 LINES (test_id, apiVersion, expected_key, expected_value, live_key, live_value, status, info)";

        if ( !($stmt = $this->conn->query($uploadQuery)) ) {
            // echo "\nQuery execute failed: ERRNO: (" . $this->conn->errno . ") " . $this->conn->error;
            return 0;
        } else {
            return 1;
        }
    }

    /**
     * Reporting
     */
    
    public function getAllTests() {
        $stmt = $this->conn->prepare("SELECT * FROM tests");
        $tests = array();

        if ($stmt->execute()) {
            $stmt->bind_result($test->id, $test->test_id, $test->property, $test->type, $test->created);

            while (mysqli_stmt_fetch($stmt)){
                
                foreach( $test as $key => $value ){
                    $tests[$key] = $value;
                }

                $apiTestsArray[] = $tests;
            }

            $stmt->close();
            return $apiTestsArray;
        } else {
            return NULL;
        }
    }


    public function getTestById($testID) {
        // $stmt = $this->conn->prepare("SELECT id, test_id, property, type FROM tests WHERE id =".$testID);
        $stmt = $this->conn->prepare("SELECT id, test_id, property, type FROM tests WHERE id = ?");
        
        $stmt->bind_param("i", $testID);

        if ($stmt->execute()) { 
            $stmt->bind_result($thisTestID, $testRefID, $property, $testType);

            /* fetch values */
            mysqli_stmt_fetch($stmt);
            var_dump($thisTestID, $testRefID, $property, $testType);
            $stmt->close();
            // return $user_role;
        } else {
            return NULL;
        }

    }

    public function getAllTestByType($testType) {
        
        switch ($testType) {
            
            case "api_manifest_audits":
                $testTypeName = 'apiCheck-manifest';
                break;

            case "api_navigation_audits":
                $testTypeName = 'apiCheck-nav';
                break;

            case "api_article_audits":
                $testTypeName = 'apiCheck-article';
                break;
            default:
                $testTypeName = 'none-existent';
        }

        $stmt = $this->conn->prepare("SELECT * FROM tests WHERE type = ?");
        $stmt->bind_param("s", $testTypeName);
        
        $tests = array();

        if ($stmt->execute()) {
            $stmt->bind_result($test->id, $test->test_id, $test->property, $test->type, $test->created);

            while (mysqli_stmt_fetch($stmt)){
                
                foreach( $test as $key => $value ){
                    $tests[$key] = $value;
                }

                $apiTestsArray[] = $tests;
            }

            $stmt->close();
            return $apiTestsArray;
        } else {
            return NULL;
        }
    }

    public function checkForTestFailures($testID, $testResultsTable) {
        // var_dump($testID, $testResultsTable);
        
        switch ($testResultsTable) {
            
            case "api_manifest_audits":
                $testTableName = 'manifest_tests';
                break;

            case "api_navigation_audits":
                $testTableName = 'nav_tests';
                break;

            case "api_article_audits":
                $testTableName = 'article_tests';
                break;
            default:
                $testTableName = 'none-existent';
        }

        $stmt = $this->conn->prepare("SELECT status, COUNT(*) FROM ".$testTableName." WHERE test_id = ".$testID." AND status = 'Fail'");
        
        $tests = array();

        if ($stmt->execute()) {
            $stmt->bind_result($test->status, $test->total);

            while (mysqli_stmt_fetch($stmt)){
                
                if ($test->total > 0) {
                    return 'fail';
                    echo 'fail';
                } else {
                    return 'pass';
                    echo 'pass';
                }
            }

            $stmt->close();
        } else {
            return NULL;
        }
    }


    public function getCurrentTestsByType($testType) {
        // $stmt = $this->conn->prepare("SELECT id, first_name, last_name, email, api_key, status, role FROM users");
        $stmt = $this->conn->prepare("SELECT * FROM tests WHERE ");
        // $stmt->execute();
        $tests = array();

        if ($stmt->execute()) {
            $stmt->bind_result($test->id, $test->test_id, $test->property, $test->type, $test->created);

            while (mysqli_stmt_fetch($stmt)){
                
                foreach( $test as $key => $value ){
                    $tests[$key] = $value;
                }

                $apiTestsArray[] = $tests;
            }

            $stmt->close();
            return $apiTestsArray;
        } else {
            return NULL;
        }
    }

}

?>