<?php
session_start();

// login credentials

$servername = "localhost";
$serverusername = "root";
$serverpassword = "usbw";
$serverdbname = "signmehub";

// server connection
$mysqli = new mysqli($servername, $serverusername, $serverpassword, $serverdbname);

// get settings from database

$query = $_POST["q"];
$stmt = $mysqli->prepare($query);
if (strpos($query, "user_id") && strpos($query, "?")) {
    $stmt->bind_param("i", $_SESSION["acc"]["user_id"]);
}
$stmt->execute();
$result = $stmt->get_result();
if (gettype($result) == "boolean") {
    echo json_encode($result);
}
else {
    $result_fetched = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($result_fetched);
}
?>