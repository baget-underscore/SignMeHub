<?php
session_start();
if(isset($_SESSION['acc'])) {
    if (!($_SESSION['acc']['rol'] == 'admin' || $_SESSION['acc']['rol'] == 'beheerder')) {
        header("Location:dashboardPage.php");
    }
} else {
    header("Location:../index.php");
}
?>
<!DOCTYPE html>

<head>
    <title>
        SignMeHub  -  Admin
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="../style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
    <script src="../js/adminScript.js"></script>
</head>

<body>
    <div>
        <div class="title red">
            <p class="title">
                <label class="title"><b>SignMeHub - Admin</b></label>
            </p>
        </div>

        <nav>
            <a href="dashboardPage.php"><button>Dashboard</button></a>
            <a href="signUpPage.php"><button>Intekenen</button></a>
            <a href="contactPage.php"><button>Contact</button></a>
            <a href="adminPage.php"><button disabled style="display:<?php echo ($_SESSION['acc']['rol'] == 'admin' || $_SESSION['acc']['rol'] == 'beheerder') ? 'block' : 'none' ?>;">Admin</button></a>
            <a href="../php/logout.php"><button class="logout">Uitloggen</button></a>
        </nav>
    </div>

    <div style="margin:10px">
        <!-- Setting password for an account -->
        <br><br>
        <iframe name="passw_res", style="min-width: 430px; max-height: 2.5em;"></iframe>
        <div>
            <form action="../php/set_value.php" method="post" target="passw_res">
                <input type="hidden" name="type" value="passw">
                <input name="option1" type="text" placeholder="llnr" required>
                <input name="option2" type="password" placeholder="Wachtwoord">
                <input type="submit">
            </form>
        </div>

        <br><br>
        <iframe name="group_res", style="min-width: 430px; max-height: 2.5em;"></iframe>
        <div>
            <form action="../php/set_value.php" method="post" target="group_res">
                <input type="hidden" name="type" value="groep">
                <input name="option1" type="text" placeholder="llnr" required>
                <input name="option2" type="text" placeholder="Groep">
                <input type="submit">
            </form>
        </div>

        <br><br>
        <iframe name="rol_res", style="min-width: 430px; max-height: 2.5em;"></iframe>
        <div>
            <form action="../php/set_value.php" method="post" target="rol_res">
                <input type="hidden" name="type" value="rol">
                <input name="option1" type="text" placeholder="llnr" required>
                <input name="option2" type="text" placeholder="Rol">
                <input type="submit">
            </form>
        </div>

        <br><br>
        <iframe name="wso_res", style="min-width: 430px; max-height: 2.5em;"></iframe>
        <div>
            <form action="../php/set_value.php" method="post" target="wso_res">
                <input type="hidden" name="type" value="wsorg">
                <input name="option1" type="text" placeholder="llnr" required>
                <input name="option2" type="text" placeholder="Workshop ID">
                <input type="submit">
            </form>
        </div>

        <br><br>
        <iframe name="toegang_res", style="min-width: 430px; max-height: 2.5em;"></iframe>
        <div>
            <form action="../php/set_value.php" method="post" target="toegang_res">
                <input type="hidden" name="type" value="toegang">
                <input name="option1" type="text" placeholder="groep" required>
                <input name="option2" type="text" placeholder="toegang? (0/1)" required>
                <input type="submit">
            </form>
        </div>

    </div>
</body>

</html>