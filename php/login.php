<?php
session_start();

// form input

$uid = $_POST["user_id"];
$upw = $_POST["password"];

// login credentials

$servername = "localhost";
$serverusername = "root";
$serverpassword = "usbw";
$serverdbname = "signmehub";

// server connection
$mysqli = new mysqli($servername, $serverusername, $serverpassword, $serverdbname);

// get account from datebase

$query = "SELECT a.*, g.groep_naam, g.heeft_toegang FROM account a
LEFT JOIN groepplaatsing gp ON a.user_id = gp.user_id
LEFT JOIN groep g ON gp.groep_naam = g.groep_naam
WHERE a.user_id = ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("i", $uid);
$stmt->execute();
$result = $stmt->get_result();
$result = $result->fetch_all(MYSQLI_ASSOC);

// check if password matches with user

if ($result) {
    foreach ($result as $row) {
        if ($row["heeft_toegang"] == 1) {
            if (password_verify($upw, $row["password_hash"])) {
                $_SESSION["acc"] = array_slice($row, 0, 5);
                header("Location:../pages/dashboardPage.php");
            }
            else {
                header("Location:../index.php?err=psw");
            }
        }
        else {
            header("Location:../index.php?err=nog");
        }
    }
}
else {
    header("Location:../index.php?err=acc");
}   
?>