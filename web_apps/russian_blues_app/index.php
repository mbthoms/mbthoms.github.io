<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<title>The Russian Blues Kitten Application</title>
	<!-- Making sure that the pages scale to a mobile friendly veiw. -->
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="css/master.css" media="screen" title="no title" charset="utf-8">
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="css/bootstrap.min.css" media="screen" title="no title" charset="utf-8">
</head>

<body>

	<main class="container well well-background">
		<h1 class="header-title">Kitten Application</h1>
		<p>This form must be filled out <strong>COMPLETELY</strong> to be consided for a kitten.</p>
		<!-- The app form -->
		<form action="send_app.php" method="post">
			<div class="row">

				<!-- First Name -->
				<section class="col-sm-12 col-md-6 col-lg-6 form-group">
					<label for="first_name">First Name:</label>
					<input class="form-control" type="text" name="first_name" placeholder="First Name">
				</section>

				<!-- Last Name -->
				<section class="col-sm-12 col-md-6 col-lg-6 form-group">
					<label for="last_name">Last Name:</label>
					<input class="form-control" type="text" name="last_name" placeholder="Last Name">
				</section>
			</div>
			<!-- End of Row -->

			<!-- Address -->
			<section class="form-group">
				<!-- Address Line 1 -->
				<label class="control-label">Address</label>
				<input id="address-line1" name="address-line1" type="text" placeholder="Address" class="form-control">
				<p class="help-block">Street Address</p>

				<section class="row">
					<section class="col-sm-12 col-md-4 col-lg-4">
						<!-- City -->
						<label class="control-label">City / Town</label>
						<input id="city" name="city" type="text" placeholder="City / Town" class="form-control">
						<!-- <p class="help-block"></p> -->
					</section>
					<section class="col-sm-12 col-md-4 col-lg-4">
						<!-- Region -->
						<label class="control-label">Province</label>
						<input id="region" name="region" type="text" placeholder="Province" class="form-control">
						<!-- <p class="help-block"></p> -->
					</section>
					<section class="col-sm-12 col-md-4 col-lg-4">
						<!-- Postal Code/Zip Code-->
						<label class="control-label">Postal Code</label>
						<input id="postal-code" name="postal-code" type="text" placeholder="Postal Code" class="form-control">
						<!-- <p class="help-block"></p> -->
					</section>
				</section>

				<!-- Phone number -->
				<section class="form-group">
					<label for="phone">Phone Number:</label>
					<input class="form-control" type="tel" name="phone" placeholder="Phone Number (eg. 555-555-5555)">
				</section>

				<!-- Email -->
				<section class="form-group">
					<label for="email">Email Address:</label>
					<input class="form-control" type="email" name="email" placeholder="Email">
				</section>

				<!-- Question 1 -->
				<section class="form-group">
					<label for="question1">1. Including yourself please list all family members and their ages.</label>
					<textarea class="form-control" type="textarea" name="question1"></textarea>
				</section>

				<!-- Question 2 -->
				<section class="form-group">
					<label for="question2">2. Do you rent or own your home?</label>
					<br />
					<input type="radio" name="question2" value="Rent"> Rent<br>
					<input type="radio" name="question2" value="Own"> Own
				</section>

				<!-- Question 3 -->
				<section class="form-group">
					<label for="question3">3. If renting do you have permission from your landlord to have a pet?</label>
					<br />
					<input type="radio" name="question3" value="Yes"> Yes<br>
					<input type="radio" name="question3" value="No"> No
				</section>

				<!-- Question 4 -->
				<section class="form-group">
					<label for="question4">4. Does anyone in your family have allergies?</label>
					<br />
					<input type="radio" name="question4" value="Yes"> Yes<br>
					<input type="radio" name="question4" value="No"> No
				</section>

				<!-- Question 4 a) -->
				<section class="form-group">
					<label for="question4a">4. a) If so please explain.</label>
					<br />
					<input class="form-control" type="text" name="question4a">
				</section>

				<!-- Question 5 -->
				<section class="form-group">
					<label for="question5">5. Will this kitten be kept as indoor only?</label>
					<br />
					<input type="radio" name="question5" value="Yes"> Yes<br>
					<input type="radio" name="question5" value="No"> No
				</section>

				<!-- Question 6 -->
				<section class="form-group">
					<label for="question6">6. Which sex do you prefer?</label>
					<br />
					<input type="radio" name="question6" value="Male"> Male<br>
					<input type="radio" name="question6" value="Female"> Female<br>
					<input type="radio" name="question6" value="Doesn't matter"> Doesn't matter
				</section>

				<!-- Question 7 -->
				<section class="form-group">
					<label for="question7">7. List any other animals in the home.</label>
					<textarea class="form-control" type="textarea" name="question7"></textarea>
				</section>

				<!-- Question 8 -->
				<section class="form-group">
					<label for="question8">8. How many hours a day on average will the kitten be left alone?</label>
					<textarea class="form-control" type="textarea" name="question8"></textarea>
				</section>

				<!-- Question 9 -->
				<section class="form-group">
					<label for="question9">9. Have you read our contract/health guarantee?</label>
					<br />
					<input type="radio" name="question9" value="Yes"> Yes<br>
					<input type="radio" name="question9" value="No"> No
				</section>

				<!-- Question 10 -->
				<section class="form-group">
					<label for="question6">10. Are you willing to abide by the Contract/health guarantee?</label>
					<br />
					<input type="radio" name="question10" value="Yes"> Yes<br>
					<input type="radio" name="question10" value="No"> No
				</section>

				<!-- Question 11 -->
				<section class="form-group">
					<label for="question6">11. Have you ever relinquished an animal to the pound or animal shelter?</label>
					<br />
					<input type="radio" name="question11" value="Yes"> Yes<br>
					<input type="radio" name="question11" value="No"> No
				</section>

				<!-- Question 12 -->
				<section class="form-group">
					<label for="question12">12. Please tell us any other information that you feel may be helpful in the approval process of your application.</label>
					<textarea class="form-control" type="textarea" name="question12"></textarea>
				</section>

				<!-- Submit Button -->
				<section>
					<input class="btn btn-success btn-lg" type="submit" name="submit" value="Submit Application">
				</section>
		</form>

		<aside class="text-center">
			<!-- back to homepage link -->
			<a href="http://therussianblues.com">Back to Russian Blues Home Page</a>
		</aside>
	</main>
	<footer>
		Copyright &copy;
		<!--Looking up current year and displaying it.-->
		<script type="text/javascript">
			var year = new Date();
			document.write(year.getFullYear());
		</script>
		<a href="http://matthewthoms.com">Matthew Thoms Media</a>
	</footer>
	<script>
		(function(i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;
			i[r] = i[r] || function() {
				(i[r].q = i[r].q || []).push(arguments)
			}, i[r].l = 1 * new Date();
			a = s.createElement(o),
				m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m)
		})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

		ga('create', 'UA-73366429-2', 'auto');
		ga('send', 'pageview');
	</script>
</body>

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>

</html>