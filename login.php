<?php

	include 'databaseLogin.php';
		 
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		
		 $user = ($_POST["username"]);
		 $pass = ($_POST["pass"]);
		 
		 if (empty($user) || empty($pass)){
			echo 'Enter Credentials';
			die();
		 }
		 
         // Connect to MySQL
         if ( !( $database = mysqli_connect($servername,$username,$pass,$dbName) ) ) die( "Could not connect to database" );
   
		
		$query = "SELECT * FROM player WHERE Username = '". $user . "'";
		
         // query database
		  if ( !( $result = mysqli_query($database, $query) ) ) 
         {
            print( "<p>Could not execute query</p>" );
            die( mysqli_error() );
         }
		 if (mysqli_num_rows($result) == 0) {
			echo 'Credentials do not match';
			mysqli_close( $database );
			die();
		}
		
		$row = mysqli_fetch_assoc($result);
		
		
		if ($row['pass'] != $pass){
			echo 'Credentials do not match';
			mysqli_close( $database );
			die();
		}
		else {
			setcookie('username', $user, time() + (86400 * 30), "/");
			setcookie('pass', $pass, time() + (86400 * 30), "/");
			echo 'Logged In Successfully!';
		}
		
		mysqli_close( $database );
		

	}
?>