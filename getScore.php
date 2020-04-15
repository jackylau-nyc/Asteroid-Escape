<?php

	include 'databaseLogin.php';
		 
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		
		 $user = ($_POST["username"]);
		 $pass = ($_POST["password"]);
		 
		 if (empty($user) || empty($pass)){
			echo '-1';
			die();
		 }
		 
         // Connect to MySQL
         if ( !( $database = mysqli_connect($servername,$username,$password,$dbName) ) ) die( "Could not connect to database" );
   
		
		$query = "SELECT * FROM player WHERE username = '". $user . "'";
		
         // query database
		  if ( !( $result = mysqli_query($database, $query) ) ) 
         {
            print( "<p>Could not execute query!</p>" );
            die( mysqli_error() );
         }
		 if (mysqli_num_rows($result) == 0) {
			echo '-1';
			mysqli_close( $database );
			die();
		}
		
		$row = mysqli_fetch_assoc($result);
		
		
		if ($row['password'] != $pass){
			echo '-1';
			mysqli_close( $database );
			die();
		}
		else {
			echo $row['highscore'];
		}
		
		mysqli_close( $database );
	}
?>