<?php
session_start();

// form input
$type = $_POST["type"];
$option1 = $_POST["option1"];
$option2 = $_POST["option2"];

// login credentials

$servername = "localhost";
$serverusername = "root";
$serverpassword = "usbw";
$serverdbname = "signmehub";

// server connection

$mysqli = new mysqli($servername, $serverusername, $serverpassword, $serverdbname);

// updating the database with given values

if ($type=="passw") {
    $upwhash = password_hash($option2, PASSWORD_BCRYPT);
    $query = ("UPDATE account SET password_hash = ? WHERE user_id = ?");
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("si", $upwhash, $option1);
    }
if ($type=="groep") {
    $query = ("UPDATE groepplaatsing SET groep_naam = ? WHERE user_id = ?");
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("si", $option2, $option1);
}
if ($type=="rol") {
    $query = ("UPDATE account SET rol = ? WHERE user_id = ?");
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("si", $option2, $option1);
}
if ($type=="wsorg") {
    if ($option2 == null) {
        $query = ("DELETE FROM workshop_organisator WHERE user_id = ?");
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("i", $option1);
    }
    else {
        $query = ("INSERT INTO workshop_organisator (user_id, workshop) VALUES(?, ?) ON DUPLICATE KEY UPDATE workshop = ?");
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("iii", $option1, $option2, $option2);
    }
}
if ($type=="toegang") {
    $query = ("UPDATE groep SET heeft_toegang = ? WHERE groep_naam = ?");
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("is", $option2, $option1);
}

$stmt->execute();
$result = $stmt->affected_rows;

if ($result > 0) {
    echo "Gelukt!";
}
else {
    echo "Mislukt, controleer of " . $option1 . " bestaat.";
}
?>