<?php

$servername = "localhost";
$username = "root";
$password = "usbw";
$dbname = "bibliotheek";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// query
$sql = "SELECT boeknr, titel, genre FROM boeken";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output
  echo $result;
} else {
  echo "No results";
}
$conn->close();
?>