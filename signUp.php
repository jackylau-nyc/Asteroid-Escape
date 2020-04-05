<?php

	include 'databaseLogin.php';
		 
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		
		 //$email = ($_POST["email"]);
		 $email = "generic@generic.com";
		 $user = ($_POST["username"]);
		 $pass = ($_POST["password"]);
		 $passR = ($_POST["passwordR"]);
		 
		 /*if (empty($email) || empty($user) || empty($pass) || empty($passR)){
			echo 'All fields are required!';
			die();
		 }*/
		 
		 if (empty($user) || empty($pass) || empty($passR)){
			echo 'All fields are required!';
			die();
		 }
		 	
		/*	
		 if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			echo 'Invalid Email!';
			die();
		 }
		 */
		 
		 if ( preg_match('/\s/',$user) ){
			 echo 'Username cannot have blank spaces!';
			die();
		 }
		 
		 if ( strlen($user) < 5 ){
			 echo 'Username must be at least 5 characters long!';
			die();
		 }
		 
		 if ( strlen($pass) < 5 ){
			 echo 'Password must be at least 5 characters long!';
			die();
		 }
		 
		 if ($pass != $passR){
			 echo 'Passwords Do Not Match!';
			 die();
		 }
		 
         // Connect to MySQL
         if ( !( $database = mysqli_connect($servername,$username,$password,$dbName) ) ) die( "Could not connect to database" );
   
		/*	
		 $query = "SELECT * FROM player WHERE Email = '". $email . "'";
         // query database
		  if ( !( $result = mysqli_query($database, $query) ) ) 
         {
            print( "<p>Could not execute query!</p>" );
            die( mysqli_error() );
         }
		 if (mysqli_num_rows($result) > 0) {
			echo 'Account with email already exists!';
			mysqli_close( $database );
			die();
		}
		*/
		
		$query = "SELECT * FROM player WHERE Username = '". $user . "'";
		
         // query database
		  if ( !( $result = mysqli_query($database, $query) ) ) 
         {
            print( "<p>Could not execute query!</p>" );
            die( mysqli_error() );
         }
		 if (mysqli_num_rows($result) > 0) {
			echo 'Select a different username!';
			mysqli_close( $database );
			die();
		}
		
		
		 
		 $query = "INSERT INTO player (Email, Username, Password)
					VALUES ('" . $email . "', '" . $user . "' , '" . $pass . "')";
		 
		  // query Employee database
		  if ( !( $result = mysqli_query($database, $query) ) ) 
         {
            print( "<p>Could not execute query!</p>" );
            die( mysqli_error() . "</body></html>" );
         }
		 if (!$result) {
			$message  = 'Invalid query: ' . mysqli_error() . "\n";
			$message .= 'Whole query: ' . $query;
			die($message);
		}
		setcookie('username', $user, time() + (86400 * 30), "/");
		setcookie('password', $pass, time() + (86400 * 30), "/");
		echo 'Added Successfully!';
		
		mysqli_close( $database );
		
		
		
	}
?>