 <?php

$servername = "localhost";
$username = "root";
$password = "usbw";
$dbname = "bibliotheek";
$output = array();

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// query
$data = $_GET['table'];
$sql = "SELECT boeknr, titel, genre, rubriek FROM {$data}";
$result = $conn->query($sql);

if ($result) {
    if (mysqli_num_rows($result) > 0) {
        // output data of each row
            while($row = mysqli_fetch_assoc($result)) {
                $output[] = [
                    "id" => $row["boeknr"],
                    "title" => $row["titel"],
                    "description" => $row["genre"],
                    "location" => $row["rubriek"],
                ];
            }
            echo json_encode($output);
        }
} else {
    echo "No results";
}
$conn->close();
?>