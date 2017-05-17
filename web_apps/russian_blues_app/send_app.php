<head>
  <meta charset="utf-8">
  <title>Sending Application | The Russian Blues Kitten Application</title>
  <!-- Making sure that the pages scale to a mobile friendly veiw. -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="css/master.css" media="screen" title="no title" charset="utf-8">
  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="css/bootstrap.min.css" media="screen" title="no title" charset="utf-8">
</head>

<body>
  <main class="container well well-background">
    <h1 class="header-title">Kitten Application</h1>

    <?php
    //Information from the app.
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $address_line_1 = $_POST['address-line1'];
    $city = $_POST['city'];
    $region = $_POST['region'];
    $postal_code = $_POST['postal-code'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $question1 = $_POST['question1'];
    $question2 = $_POST['question2'];
    $question3 = $_POST['question3'];
    $question4 = $_POST['question4'];
    $question4a = $_POST['question4a'];
    $question5 = $_POST['question5'];
    $question6 = $_POST['question6'];
    $question7 = $_POST['question7'];
    $question8 = $_POST['question8'];
    $question9 = $_POST['question9'];
    $question10 = $_POST['question10'];
    $question11 = $_POST['question11'];
    $question12 = $_POST['question12'];

    //Variable indicating if form is complete or not.
    $complete = true;

    if(empty($first_name)) {
      echo 'First name is required.<br/>';
      $complete = false;
    }

    if(empty($last_name)) {
      echo 'Last name is required.<br/>';
      $complete = false;
    }

    if(empty($phone)) {
      echo 'Phone number is required.<br/>';
      $complete = false;
    }

    if(empty($address_line_1)) {
      echo 'Address Line 1 is required.<br/>';
      $complete = false;
    }

    if(empty($city)) {
      echo 'City is required.<br/>';
      $complete = false;
    }

    if(empty($region)) {
      echo 'State, Province or Region is required.<br/>';
      $complete = false;
    }

    if(empty($postal_code)) {
      echo 'Postal or zip code is required.<br/>';
      $complete = false;
    }

    if(empty($email)) {
      echo 'Email is required.<br/>';
      $complete = false;
    }

    if(empty($question1)) {
      echo 'You must provide an answer to question 1.<br/>';
      $complete = false;
    }

    if(empty($question2)) {
      echo 'You must provide an answer to question 2.<br/>';
      $complete = false;
    }

    if(empty($question3)) {
      echo 'You must provide an answer to question 3.<br/>';
      $complete = false;
    }

    if(empty($question4)) {
      echo 'You must provide an answer to question 4.<br/>';
      $complete = false;
    }

    if(empty($question5)) {
      echo 'You must provide an answer to question 5.<br/>';
      $complete = false;
    }

    if(empty($question6)) {
      echo 'You must provide an answer to question 6.<br/>';
      $complete = false;
    }

    if(empty($question7)) {
      echo 'You must provide an answer to question 7.<br/>';
      $complete = false;
    }

    if(empty($question8)) {
      echo 'You must provide an answer  to question 8.<br/>';
      $complete = false;
    }

    if(empty($question9)) {
      echo 'You must provide an answer to question 9.<br/>';
      $complete = false;
    }

    if(empty($question10)) {
      echo 'You must provide an answer to question 10.<br/>';
      $complete = false;
    }

    if(empty($question11)) {
      echo 'You must provide an answer to question 11.<br/>';
      $complete = false;
    }

    if(empty($question12)) {
      echo 'You must provide an answer to question 12.<br/>';
      $complete = false;
    }

    // if the form is filled out correctly then send the email with the form content.
    if ($complete == true) {
      // Emailing Varibles.
      $email_to = "matthew@matthewthoms.com";
      $subject_line = "New Kitten Application From: $first_name $last_name";
      $email_message = "
      <html>
      <head>
      <title>Kitten Application</title>
      </head>
      <body>
      <h1>Kitten Application</h1>
            <p>You have received a new New Kitten Application from Online Form.<br><br>
            Here is the following Information that was submitted:<br><br>
            <b>Name:</b> $first_name $last_name <br><br>
            <b>Address:</b> $address_line_1 <br><br>
            <b>City:</b> $city <br><br>
            <b>Province:</b> $region <br><br>
            <b>Postal Code:</b> $postal_code <br><br>
    		    <b>Phone Number:</b> $phone <br><br>
            <b>Email:</b> $email <br><br>
            <ol>
            <li><b>Including yourself please list all family members and their ages:</b><br> $question1</li><br>
            <li><b>Do you rent or own your home?:</b><br> $question2</li><br>
            <li><b>If renting do you have permission from your landlord to have a pet?</b><br>$question3</li><br>
            <li><b>Does anyone in your family have allergies?</b><br>$question4</li><br>
            <li><b>If so Explain:</b><br/><br/>$question4a</li><br/>
            <li><b>Will this kitten be kept as indoor only?</b><br>$question5</li><br>
            <li><b>Which sex do you prefer?</b><br>$question6</li><br>
            <li><b>List any other animals in the home.</b><br> $question7</li><br>
            <li><b>How many hours a day on average will the kitten be left alone?</b><br> $question8</li><br>
            <li><b>Have you read our contract/health guarantee?</b><br> $question9</li><br>
            <li><b>Are you willing to abide by the Contract/health guarantee?</b><br> $question10 </li><br>
            <li><b>Have you ever relinquished an animal to the pound or animal shelter?</b><br> $question11</li><br>
            <li><b>Please tell us any other information that you feel may be helpful in the approval process of your application.</b><br>$question12</li><br>
            </ol>
      </body>
      </html>".

            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

      mail($email_to,$subject_line,$email_message,$headers);
      echo "<h2>We have received your application.<br />
        Thank-you.</h2>
        <br>
        <br>

        <a href=\"http://therussianblues.com\">Go back to Home Page.</a>
        <br>
        <br>
        <footer>
                Copyright &copy;
                <!--Looking up current year and displaying it.-->
                <script type=\"text/javascript\">var year = new Date();document.write(year.getFullYear());</script>
                <a href=\"http://matthewthoms.com\">Matthew Thoms Media</a>
            </footer>
        ";
    }

     ?>

  </main>
</body>

</html>