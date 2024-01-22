<?php

$username = $_POST["username"];
$password = $_POST["password"];

if ($username == 'pieter') {
    session_start();
    $_SESSION["name"] = $username;
    echo "Welkom, " . $_SESSION["name"];
} else {
    echo "Geen toegang";
}
?>

