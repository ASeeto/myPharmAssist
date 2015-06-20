<?php

session_start();

require 'Slim/Slim.php';

$app = new Slim();

$app->post('/login', 'login');
$app->post('/logout', 'logout');
$app->post('/register', 'register');
$app->get('/session', authorize('user'));

/** Profiles */
$app->get('/profiles', authorize('user'), 'getProfiles');
$app->get('/profiles/:id', authorize('user'), 'getProfile');
$app->post('/insertProfile', authorize('user'), 'insertProfile');
$app->post('/deleteProfile', authorize('user'), 'deleteProfile');
$app->post('/updateProfile', authorize('user'), 'updateProfile');

/** Presriptions */
$app->get('/prescriptions/:pid', authorize('user'), 'getPrescriptions');
$app->post('/insertPrescription', authorize('user'), 'insertPrescription');
$app->post('/deletePrescription', authorize('user'), 'deletePrescription');
$app->post('/updatePrescription', authorize('user'), 'updatePrescription');

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
                $app->halt(403, 'You do not have the correct permissions to view this page.');
            }
        }
        else {
            // If a user is not logged in at all, return a 401
            $app->halt(401, 'Please login before continuing.');
        }
    };
}

function getSessionId() {
    /** Get current session email  */
    $email = $_SESSION['user']['email'];
    try {
        /** Connect to database */
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

function verifyUserProfile($id) {
    try {

        /** Connect to database */
        $db = getConnection();
        $user_id = getSessionId();
        $profile_id = $id;

        /** Use session ID to get profile */
        $sql = "SELECT * FROM userprofiles up 
                WHERE up.user_id = :user_id 
                AND up.profile_id = :profile_id;";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("user_id", $user_id);
        $stmt->bindParam("profile_id", $profile_id);
        $stmt->execute();
        $row = $stmt->rowCount();

        if($row){
            return true; 
        }
        /** Halt app and throw Error Code 403 */
        else{
            $app = Slim::getInstance();
            // If a user is logged in, but doesn't have permissions, return 403
            $app->halt(403, 'You do not have the correct permissions to view this page.');
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getProfiles() {
    try {
        /** Connect to database */
        $db = getConnection();
        $user_id = getSessionId();
        
        /** Use session ID to get profiles */
        $sql = "SELECT p.id, p.name, p.color 
                FROM profiles p 
                LEFT JOIN userprofiles up 
                ON p.id = up.profile_id 
                WHERE up.user_id = :user_id;";
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

function getProfile($id) {
    /** Connect to database */
    $db = getConnection();
    /** Verify this profile belongs to this user */
    $verified = verifyUserProfile($id);
    if($verified){
        try {
            /** Get the user profile */
            $sql = "SELECT p.id, p.name, p.color 
                    FROM profiles p 
                    WHERE p.id = :profile_id;";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("profile_id", $id);
            $stmt->execute();
            $db = null;
            $profile = $stmt->fetchObject();
            /** Include support for JSONP requests */
            if (!isset($_GET['callback'])) {
                echo json_encode($profile);
            } else {
                echo $_GET['callback'] . '(' . json_encode($profile) . ');';
            }
        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    }
}

function insertProfile() {
    if(!empty($_POST['name']) && !empty($_POST['color'])) {
    
        /** Initialize variables for values taken from request */
        $user_id = getSessionId();
        $name = $_POST['name'];
        $color = $_POST['color'];

        try {
            /** Create the new profile */
            $db = getConnection();
            $sql = "INSERT INTO profiles(name,color) 
                    VALUES(:name, :color);";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("name", $name);
            $stmt->bindParam("color", $color);
            $stmt->execute();

            /** Get last insert ID, the profile just created from THIS connection */
            $profile_id = $db->lastInsertId('profiles');
            
            /** Add the new profile for the current user in the userprofiles table */
            $sql = "INSERT INTO userprofiles(user_id,profile_id) 
                    VALUES(:user_id, :profile_id);";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("user_id", $user_id);
            $stmt->bindParam("profile_id", $profile_id);
            $stmt->execute();

            $db = null;

            echo true;

        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    }
    else {
        echo '{"error":{"text":"A name and color is required."}}';
    }
}

function deleteProfile() {
    /** Initialize variables for values taken from request */
    $user_id = getSessionId();
    $profile_id = $_POST['id'];

    try {
        /** Create the new profile */
        $db = getConnection();
        $sql = "DELETE FROM profiles 
                WHERE id = :profile_id;";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("profile_id", $profile_id);
        $stmt->execute();
        
        /** Add the new profile for the current user in the userprofiles table */
        $sql = "DELETE FROM userprofiles 
                WHERE user_id = :user_id 
                AND profile_id = :profile_id;";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("user_id", $user_id);
        $stmt->bindParam("profile_id", $profile_id);
        $stmt->execute();

        $db = null;

        echo true;

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function updateProfile() {
    if(!empty($_POST['name']) && !empty($_POST['color'])) {
        /** Initialize variables for values taken from request */
        $profile_id = $_POST['id'];
        $name = $_POST['name'];
        $color = $_POST['color'];
        /** Verify this profile belongs to this user */
        $verified = verifyUserProfile($profile_id);
        if($verified){
            try {

                /** Create the new profile */
                $db = getConnection();
                $sql = "UPDATE profiles 
                        SET name = :name, color = :color 
                        WHERE id = :profile_id;";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("name", $name);
                $stmt->bindParam("color", $color);
                $stmt->bindParam("profile_id", $profile_id);
                $stmt->execute();

                $db = null;

                echo true;

            } catch(PDOException $e) {
                echo '{"error":{"text":'. $e->getMessage() .'}}';
            }
        }
    }
    else {
        echo '{"error":{"text":"A name and color is required."}}';
    }
}

function getPrescriptions($pid) {
    /** Verify this profile belongs to this user */
    $verified = verifyUserProfile($pid);
    if($verified){
        try {
            /** Connect to database */
            $db = getConnection();
            
            /** Use session ID to get prescriptions */
            $sql = "SELECT p.id, p.medication, p.strength, p.quantity, p.route, p.frequency, p.dispense, p.refills 
                    FROM prescriptions p 
                    LEFT JOIN profileprescriptions pp 
                    ON p.id = pp.prescription_id 
                    WHERE pp.profile_id = :profile_id;";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("profile_id", $pid);
            $stmt->execute();
            $prescriptions = $stmt->fetchAll(PDO::FETCH_OBJ);

            // Include support for JSONP requests
            if (!isset($_GET['callback'])) {
                echo json_encode($prescriptions);
            } else {
                echo $_GET['callback'] . '(' . json_encode($prescriptions) . ');';
            }

        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    }
}

function insertPrescription() {

    /** Required Field Names */
    $required = array('profile_id', 'medication', 'strength', 'quantity', 'route', 'frequency', 'dispense', 'refills');
    /** Loop over field names, make sure each one exists and is not empty */
    $error = false;
    foreach($required as $field) {
        if (empty($_POST[$field])) {
            $error = true;
        }
    }

    if(!$error) {
        /** Initialize variables for values taken from request */
        $profile_id = $_POST['profile_id'];
        $medication = $_POST['medication'];
        $strength   = $_POST['strength'];
        $quantity   = $_POST['quantity'];
        $route      = $_POST['route'];
        $frequency  = $_POST['frequency'];
        $dispense   = $_POST['dispense'];
        $refills    = $_POST['refills'];
        
        /** Verify this profile belongs to this user */
        $verified = verifyUserProfile($profile_id);
        if($verified){
            try {
                /** Create the new prescription */
                $db = getConnection();
                $sql = "INSERT INTO prescriptions(medication,strength,quantity,route,frequency,dispense,refills) 
                        VALUES(:medication,:strength,:quantity,:route,:frequency,:dispense,:refills);";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("medication" , $medication);
                $stmt->bindParam("strength"   , $strength);
                $stmt->bindParam("quantity"   , $quantity);
                $stmt->bindParam("route"      , $route);
                $stmt->bindParam("frequency"  , $frequency);
                $stmt->bindParam("dispense"   , $dispense);
                $stmt->bindParam("refills"    , $refills);
                $stmt->execute();
                /** Get last insert ID, the prescription just created from THIS connection */
                $prescription_id = $db->lastInsertId('prescriptions');
                /** Add the new prescription for the current profile in the profileprescriptions table */
                $sql = "INSERT INTO profileprescriptions(profile_id, prescription_id) 
                        VALUES(:profile_id, :prescription_id);";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("profile_id", $profile_id);
                $stmt->bindParam("prescription_id", $prescription_id);
                $stmt->execute();
                $db = null;
                echo true;
            } catch(PDOException $e) {
                echo '{"error":{"text":'. $e->getMessage() .'}}';
            }
        }
    }
    else {
        echo '{"error":{"text":"All fields are required."}}';
    }
}

function deletePrescription() {
    $prescription_id = $_POST['id'];
    $profile_id = $_POST['profile_id'];

    /** Verify this profile belongs to this user */
    $verified = verifyUserProfile($profile_id);
    if($verified){
        try {
            /** Create the new profile */
            $db = getConnection();
            $sql = "DELETE FROM prescriptions 
                    WHERE id = :prescription_id;";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("prescription_id", $prescription_id);
            $stmt->execute();
            /** Add the new profile for the current user in the userprofiles table */
            $sql = "DELETE FROM profileprescriptions 
                    WHERE profile_id = :profile_id 
                    AND prescription_id = :prescription_id;";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("profile_id", $profile_id);
            $stmt->bindParam("prescription_id", $prescription_id);
            $stmt->execute();
            $db = null;
            echo true;
        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    }
}

// function updatePrescription() {
//     if(!empty($_POST['name']) && !empty($_POST['color'])) {
//         /** Initialize variables for values taken from request */
//         $profile_id = $_POST['id'];
//         $name = $_POST['name'];
//         $color = $_POST['color'];
//         try {
//             /** Create the new profile */
//             $db = getConnection();
//             $sql = "UPDATE profiles 
//                     SET name = :name, color = :color 
//                     WHERE id = :profile_id;";
//             $stmt = $db->prepare($sql);
//             $stmt->bindParam("name", $name);
//             $stmt->bindParam("color", $color);
//             $stmt->bindParam("profile_id", $profile_id);
//             $stmt->execute();
//             $db = null;
//             echo true;
//         } catch(PDOException $e) {
//             echo '{"error":{"text":'. $e->getMessage() .'}}';
//         }
//     }
//     else {
//         echo '{"error":{"text":"A name and color is required."}}';
//     }
// }

function getConnection() {
    $dbhost="localhost";
    $dbuser="root";
    $dbpass="";
    $dbname="";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

?>