<?php
session_start();
if(isset($_SESSION['acc'])) { 
} else {
    header("location:../index.php");
}
?>
<!DOCTYPE html>

<head>
    <title>
        SignMeHub  -  Dashboard
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="../style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
    <!-- Documentation: https://github.com/BorisMoore/jquery-tmpl -->
    <script src="http://ajax.microsoft.com/ajax/jquery.templates/beta1/jquery.tmpl.js"></script>
    <script src="../js/dashboardScript.js"></script>
</head>

<body>
    <div>
        <div class="title">
            <p class="title">
                <label class="title"><b>SignMeHub - Dashboard</b></label>
            </p>
        </div>

        <nav>
            <a href="dashboardPage.php"><button disabled>Dashboard</button></a>
            <a href="signUpPage.php"><button>Intekenen</button></a>
            <a href="contactPage.php"><button>Contact</button></a>
            <a href="adminPage.php"><button style="display:<?php echo ($_SESSION['acc']['rol'] == 'admin' || $_SESSION['acc']['rol'] == 'beheerder') ? 'block' : 'none' ?>;">Admin</button></a>
            <a href="../php/logout.php"><button class="logout">Uitloggen</button></a>
        </nav>
    </div>

    <div style="margin:10px">

        <h2>Hoi <?php echo $_SESSION["acc"]["voornaam"]; ?>, jouw rooster is:</h2>
        <div class="w3-row-padding w3-content ws-itemrow" id="intekenRooster">
        </div>

    </div>
</body>

</html>