<?php
session_start();
?>
<!DOCTYPE html>

<!-- site style setup and name -->

<head>
    <title>
        SignMeHub  -  Inloggen
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="../style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
</head>

<body>
    <div>

        <!-- login title -->

        <div class="title">
            <p class="title">
                <label class="title"><b>SignMeHub - Inloggen</b></label>
            </p>
        </div>

        <!-- login form -->

        <div class="login">
            <form action="php/login.php" method="post">
                <input class="login" name="user_id" type="text" placeholder="Leerlingnummer" required>
                <input class="login" name="password" type="password" placeholder="Wachtwoord" required>
                <p style="color: red;"><?php
                if (isset($_GET["err"])) {
                    if ($_GET["err"] == "acc") {
                        echo "Dit account bestaat niet!";
                    }
                    elseif ($_GET["err"] == "psw") {
                        echo "Incorrect wachtwoord!";
                    }
                    elseif ($_GET["err"] == "nog") {
                        echo "Jouw klas heeft geen toegang!";
                    }
                }
                ?></p>
                <input class="button" type="submit">
            </form>
        </div>
    </div>
</body>

</html>