<?php

session_start();

require 'Slim/Slim.php';

$app = new Slim();

$app->post('/login', 'login');
$app->post('/logout', 'logout');
$app->post('/register', 'register');
$app->post('/insertProfile', authorize('user'), 'insertProfile');
$app->get('/session', authorize('user'));
$app->get('/profiles', authorize('user'), 'getProfiles');
$app->get('/employees', authorize('user'),'getEmployees');
$app->get('/employees/:id', authorize('user'),  'getEmployee');
$app->get('/employees/:id/reports', authorize('user'),  'getReports');
$app->get('/employees/search/:query', authorize('user'), 'getEmployeesByName');
$app->get('/employees/modifiedsince/:timestamp', authorize('user'), 'findByModifiedDate');

$app->run();

/**
 * Verify a user/password pair exists and sign in
 */
function login() {
    if(!empty($_POST['email']) && !empty($_POST['password'])) {
        
        /** Initialize variables for values taken from request */
        $email = $_POST['email'];
        $pword = $_POST['password'];

        /** Validate the given email address */
        if(filter_var($email, FILTER_VALIDATE_EMAIL)){
            try {

                /** Connect to the database */
                $db = getConnection();

                /** Execute query to select rows with given email address */
                $sql = "SELECT * FROM users WHERE email = :email";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("email", $email);
                $stmt->execute();
                $row = $stmt->rowCount();

                /** Verify given email address exists in records */
                if($row){
                    /** Get selected row */
                    $res = $stmt->fetchObject();
                    /** Verify given password matches the stored encrypted password */
                    if(password_verify($pword, $res->password)){
                        /** Start session for user */
                        $user = array("email"=>$email, "role"=>"user");
                        $_SESSION['user'] = $user;
                        echo json_encode($user);
                    }
                    else{
                        echo '{"error":{"text":"The given password does not match the one in our records."}}';
                    }
                }
                else{
                    echo '{"error":{"text":"The given email address does not match one in our records."}}';
                }

                $db = null;

            } catch(PDOException $e) {
                echo '{"error":{"text":'. $e->getMessage() .'}}';
            }
        }
        else {
            echo '{"error":{"text":"Please enter a valid email address."}}';
        }
    }
    else {
        echo '{"error":{"text":"An Email Address and Password are required."}}';
    }
}

/**
 * Sign a user out by unsetting current session
 */
function logout() {
    unset($_SESSION['user']);
    // Finally, destroy the session.
    session_destroy();
}

/**
 * Register a user with given credentials
 */
function register() {
    if(!empty($_POST['email']) && !empty($_POST['password'])) {
        
        /** Initialize variables for values taken from request */
        $email = $_POST['email'];
        $pword = $_POST['password'];

        /** Validate the given email address */
        if(filter_var($email, FILTER_VALIDATE_EMAIL)){
            try {

                /** Connect to the database */
                $db = getConnection();

                /** Execute query to select rows with given email address */
                $sql = "SELECT * FROM users WHERE email = :email";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("email", $email);
                $stmt->execute();
                $row = $stmt->rowCount();

                /** Verify no other record with given email address exists */
                if($row){
                    echo '{"error":{"text":"The given email address has already been registered."}}';
                }
                /** Insert new user into users table */
                else{
                    $pass = password_hash($pword, PASSWORD_BCRYPT);
                    $sql = "INSERT INTO users(email,password) VALUES(:email, :password)";
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam("email", $email);
                    $stmt->bindParam("password", $pass);
                    $stmt->execute();

                    /** Start session for newly registered user */
                    if($stmt)
                    {
                        $user = array("email"=>$email, "role"=>"user");
                        $_SESSION['user'] = $user;
                        echo json_encode($user);
                    }
                }

                $db = null;

            } catch(PDOException $e) {
                echo '{"error":{"text":'. $e->getMessage() .'}}';
            }
        }
        else {
            echo '{"error":{"text":"Please enter a valid email address."}}';
        }
    }
    else {
        echo '{"error":{"text":"An Email Address and Password are required."}}';
    }
}

/**
 * Authorise function, used as Slim Route Middleware
 */
function authorize($role = "user") {
    return function () use ( $role ) {
        // Get the Slim framework object
        $app = Slim::getInstance();
        // First, check to see if the user is logged in at all
        if(!empty($_SESSION['user'])) {
            // Next, validate the role to make sure they can access the route
            // We will assume admin role can access everything
            if($_SESSION['user']['role'] == $role || 
                $_SESSION['user']['role'] == 'admin') {
                //User is logged in and has the correct permissions... Nice!
                return true;
            }
            else {
                // If a user is logged in, but doesn't have permissions, return 403
                $app->halt(403, 'You shall not pass!');
            }
        }
        else {
            // If a user is not logged in at all, return a 401
            $app->halt(401, 'You shall not pass!');
        }
    };
}

function getSessionId() {
    /** Get current session email  */
    $email = $_SESSION['user']['email'];
    try {
        /** Connect to database  */
        $db = getConnection();

        /** Use email to find current session ID */
        $sql = "SELECT * FROM users WHERE email = :email";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("email", $email);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['id'];

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getProfiles() {
    /** Get current session email  */
    $email = $_SESSION['user']['email'];
    try {
        /** Connect to database  */
        $db = getConnection();
        $user_id = getSessionId();
        
        /** Use session ID to get profiles */
        $sql = "SELECT p.name, p.color FROM profiles p LEFT JOIN userprofiles up ON p.id = up.profile_id WHERE up.user_id = :user_id;";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("user_id", $user_id);
        $stmt->execute();
        $profiles = $stmt->fetchAll(PDO::FETCH_OBJ);

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($profiles);
        } else {
            echo $_GET['callback'] . '(' . json_encode($profiles) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function insertProfile() {
    if(!empty($_POST['name']) && !empty($_POST['color'])) {
    
        /** Initialize variables for values taken from request */
        $user_id = getSessionId();
        $name = $_POST['name'];
        $color = $_POST['color'];

        try {

            /** Connect to the database */
            $db = getConnection();

            /** Create the new profile */
            $db = getConnection();
            $sql = "INSERT INTO profiles(name,color) VALUES(:name, :color);";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("name", $name);
            $stmt->bindParam("color", $color);
            $stmt->execute();

            /** Get last insert ID, the profile just created from THIS connection */
            $profile_id = $db->lastInsertId('profiles');
            
            /** Add the new profile for the current user in the userprofiles table */
            $sql = "INSERT INTO userprofiles(user_id,profile_id) VALUES(:user_id, :profile_id);";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("user_id", $user_id);
            $stmt->bindParam("profile_id", $profile_id);
            $stmt->execute();

            $db = null;

            return true;

        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    }
    else {
        echo '{"error":{"text":"A name and color is required."}}';
    }
}

function getEmployees() {

    if (isset($_GET['name'])) {
        return getEmployeesByName($_GET['name']);
    } else if (isset($_GET['modifiedSince'])) {
        return getModifiedEmployees($_GET['modifiedSince']);
    }

    $sql = "select e.id, e.firstName, e.lastName, e.title, count(r.id) reportCount " .
            "from employee e left join employee r on r.managerId = e.id " .
            "group by e.id order by e.lastName, e.firstName";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $employees = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getEmployee($id) {
    $sql = "select e.id, e.firstName, e.lastName, e.title, e.officePhone, e.cellPhone, e.email, e.managerId, e.twitterId, m.firstName managerFirstName, m.lastName managerLastName, count(r.id) reportCount " .
            "from employee e " .
            "left join employee r on r.managerId = e.id " .
            "left join employee m on e.managerId = m.id " .
            "where e.id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $employee = $stmt->fetchObject();
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employee);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employee) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getReports($id) {

    $sql = "select e.id, e.firstName, e.lastName, e.title, count(r.id) reportCount " .
            "from employee e left join employee r on r.managerId = e.id " .
            "where e.managerId=:id " .
            "group by e.id order by e.lastName, e.firstName";

    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $employees = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getEmployeesByName($name) {
    $sql = "select e.id, e.firstName, e.lastName, e.title, count(r.id) reportCount " .
            "from employee e left join employee r on r.managerId = e.id " .
            "WHERE UPPER(CONCAT(e.firstName, ' ', e.lastName)) LIKE :name " .
            "group by e.id order by e.lastName, e.firstName";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $name = "%".$name."%";
        $stmt->bindParam("name", $name);
        $stmt->execute();
        $employees = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function getModifiedEmployees($modifiedSince) {
    if ($modifiedSince == 'null') {
        $modifiedSince = "1000-01-01";
    }
    $sql = "select * from employee WHERE lastModified > :modifiedSince";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("modifiedSince", $modifiedSince);
        $stmt->execute();
        $employees = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getConnection() {
    $dbhost="localhost";
    $dbuser="root";
    $dbpass="";
    $dbname="project";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

?>