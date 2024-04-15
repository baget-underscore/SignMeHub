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
        SignMeHub  -  Contact
    </title>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="../style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
</head>

<body>
    <div>
        <div class="title">
            <p class="title">
                <label class="title"><b>SignMeHub - Contact</b></label>
            </p>
        </div>

        <nav>
            <a href="dashboardPage.php"><button>Dashboard</button></a>
            <a href="signUpPage.php"><button>Intekenen</button></a>
            <a href="contactPage.php"><button disabled>Contact</button></a>
            <a href="adminPage.php"><button style="display:<?php echo ($_SESSION['acc']['rol'] == 'admin' || $_SESSION['acc']['rol'] == 'beheerder') ? 'block' : 'none' ?>;">Admin</button></a>
            <a href="../php/logout.php"><button class="logout">Uitloggen</button></a>
        </nav>
    </div>

    <div class="w3-panel w3-center">
    <img src="../images/logo.png"
                alt="StrongMedia" class="w3-image" style="margin:auto" width="50%">
    </div>

    <div class="w3-panel w3-margin w3-center">
        Developed by StrongMedia
        <br>
        Contact us at 
        21806@leerling.pieterzandt.nl
    </div>
</html>