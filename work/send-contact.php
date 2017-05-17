<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<!--<?php $title = "Sending Message... - Matthew Thoms, Web Designer / Developer"; ?>
	<script>alert("Thank you for contact me. As early as possible I will contact you.");</script>-->
	<!--<meta HTTP-EQUIV="REFRESH" content="0; url=index.php">-->
</head>
<body>
	<?php
	// Contact Form Vars.
	$name = $_POST['name'];
	$email = $_POST['email'];
	$subject = $_POST['subject'];
	$message = $_POST['message'];

	$email_to = "matthew@matthewthoms.com";
  $subject_line = "Contact Form Message From: $name, $subject";
  $email_message = "You have received a new message from your Personal Website. \n\n ".
        "Here are the details:\n\n ".
        "Name: $name \n\n ".
        "Email: $email \n\n ".
        "Message: \n\n $message";

  $headers = "From: contact_form@matthewthoms.com";

  mail($email_to,$subject_line,$email_message,$headers);
  
  	?>
</body>
