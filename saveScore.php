<?php

	include 'databaseLogin.php';
		 
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		
		 $user = ($_POST["username"]);
		 $pass = ($_POST["password"]);
		 $score = ($_POST["highscore"]);
		 //echo "Sent Score: '". $score ."'";
		 
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
            echo( "Could not execute query" );
            die();
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
		else if ($score > $row['highscore']){
				$query = "UPDATE player SET highscore ='". $score ."' WHERE id = '". $row['id'] . "'";
				
				  if ( !( $result = mysqli_query($database, $query) ) ) {
					echo( "Could not execute query!" );
					die();
				  }
				  echo 'Saved Successfully.';			  	
		} else {
			echo "Higher Score: '". $row['highscore'] ."'";
		}
		
		mysqli_close( $database );
	}
?>