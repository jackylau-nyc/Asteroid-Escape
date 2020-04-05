<?php

	include 'databaseLogin.php';
		 
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
			 
			
        //echo 'leaderboard reached'; 
		// Connect to MySQL
         if ( !( $database = mysqli_connect($servername,$username,$password,$dbName) ) ) die( "Could not connect to database" );
   
		
		$query = "SELECT * FROM player ORDER BY Highscore DESC limit 10";
		
         // query database
		  if ( !( $result = mysqli_query($database, $query) ) ) 
         {
            print( "<p>Could not execute query!</p>" );
            die();
         }
		 
		 echo '<table border style = "display:block; width:100%;">';
		 echo '<th colspan="2" style="text-align:center">Leaderboard</th>';
		 
	 $rowNumber = 1;
		 
		 while($row = mysqli_fetch_assoc($result)) {
				//echo 'inside while loop';
				echo "<tr>";
				if ($rowNumber < 4){
					echo '<td style="text-align:left; width:215px"><b>' . strtolower($row['Username']) . '</b></td>';
					echo '<td style="text-align:right; width:35px"><b>' . $row['Highscore'] . '</b></td>';
				} else {
					echo '<td style="text-align:left; width:215px">' . strtolower($row['Username']) . '</td>';
					echo '<td style="text-align:right; width:35px">' . $row['Highscore'] . '</td>';
				}
				echo "</tr>";
				$rowNumber++;

		 }
		 
		 
		 echo "</table>";
		
		mysqli_close( $database );
	}
?>