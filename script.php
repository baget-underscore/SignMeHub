<?php
$servername = "172.16.120.85";
$port = "3307";
$username = "root";
$password = "usbw";
$dbname = "signmehub";
$output = array();

$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// query
$data = $_GET['table'];
$sql = "SELECT workshop, workshop_naam, beschrijving, locatie FROM {$data}";
$result = $conn->query($sql);

if ($result) {
    if (mysqli_num_rows($result) > 0) {
        // output data of each row
            while($row = mysqli_fetch_assoc($result)) {
                $output[] = [
                    "id" => $row["workshop"],
                    "title" => $row["workshop_naam"],
                    "description" => $row["beschrijving"],
                    "location" => $row["locatie"],
                ];
            }
            echo json_encode($output);
        }
} else {
    echo "No results";
}
$conn->close();
?>