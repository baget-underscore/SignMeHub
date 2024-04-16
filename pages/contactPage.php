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

<style>
body {font-family: Arial, Helvetica, sans-serif;}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

/* Make elements stick to their spot while scrolling */
div.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background-color: yellow;
  padding: 50px;
  font-size: 20px;
}

/* Button customization */
.button {
  background-color: #808080; 
  border: none;
  color: white;
  cursor: pointer;
}

</style>

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

    <!-- Trigger/Open The Modal -->
<div class="w3-bottom">
<button class="w3-circle w3-right w3-margin button" id="myBtn">?</button>
</div>

<!-- The Modal -->
<div id="myModal" class="modal">

  <!-- Modal content -->
  <div class="modal-content">
    <span class="close">&times;</span>
    <h1>Handleiding</h1>
    <p>Stap 1: Vul uw inlog gegevens in op de startpagina, en log in. Deze gegevens heeft uw werkgever of beheerder met u gedeeld.
    <br> Stap 2: U bent nu op het dashboard, waar u de workshops kunt zien waarop u ingeschreven staat
    <br> Stap 3: Via het menu navigeert u naar het kopje 'intekenen', waar u op deze pagina beland:
    <br>
    <img src="../images/signupgif.gif"
                alt="Intekenpagina" class="w3-image" style="margin:auto" width="60%">
    <br> Stap 4: Sleep de workshop in het gewenste tijdslot zoals te zien in het voorbeeld
    <br> Stap 5: U kunt nu teruggaan naar het dashboard, en de zojuist ingeschreven workshop zal in uw rooster staan
    <br>
    <br> Voor persoonlijke hulp en andere support, ga naar de pagina 'Contact' of neem contact op met uw organisatie
    <br>
    <br>
    <h1>FAQ</h1>
    Q1. Waarom kan ik niet inloggen?
    <br> A1. Het is mogelijk dat uw beheerder u geen toegang heeft gegeven tot deze applicatie.
    <br> Q2. Waarom kan ik mij niet inschrijven op een workshop?
    <br> A2. Het kan zijn dat deze workshop niet voor uw groep bedoelt is, of dat u een ander uur op de workshop hebt ingeschreven.
    <br> Q3. Waarom missen er gegevens bij de workshopinformatie?
    <br> A3. Als er gegevens missen zoals de locatie, dan heeft uw beheerder deze (nog) niet ingevuld. Vraag uw beheerder om meer informatie.
  </div>

</div>

<script>
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
</script>

</body>

</html>