<?php
	
	include 'databaseLogin.php';	
	
	// Create connection
	$conn = new mysqli($servername, $username, $pass, $dbName);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 
	//echo '<br>';

	// sql to create table
	$sql = "DROP TABLE player";

	if ($conn->query($sql) === TRUE) {
		echo "Table player dropped successfully";
	} else {
		echo "Error dropping table: " . $conn->error;
	}
	echo '<br>';
	
	// sql to create table
	$sql = "CREATE TABLE player (
	id INT(11) AUTO_INCREMENT PRIMARY KEY, 
	Email VARCHAR(30) NOT NULL,
	Username VARCHAR(30) NOT NULL,
	Pass VARCHAR(30) NOT NULL,
	Highscore INT(20) DEFAULT 0
	)";

	if ($conn->query($sql) === TRUE) {
		echo "Table player created successfully";
	} else {
		echo "Error creating table: " . $conn->error;
	}
	echo '<br>';
	
	$conn->close();
	
	// Create connection
	$conn = new mysqli($servername, $username, $pass, $dbName);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 

	$sql = "INSERT INTO player (Email, Username, Pass, Highscore)
	VALUES ('john_doe@aol.com', 'John_Doe', 'wordpass', 10)";

	if ($conn->query($sql) === TRUE) {
		echo "Player John Doe added successfully";
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error;
	}
	echo '<br>';
	
	$sql = "INSERT INTO player (Email, Username, Pass, Highscore)
	VALUES ('kevin_chen@yahoo.com', 'Kevin_Chen', 'wordpass', 15)";

	if ($conn->query($sql) === TRUE) {
		echo "Player Kevin Chen added successfully";
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error;
	}
	echo '<br>';
	
	echo "Complete!";

	$conn->close();
?>