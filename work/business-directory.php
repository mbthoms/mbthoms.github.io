<?php require_once("work-partials/head.php"); require_once("work-partials/header.php"); ?>

<div class="container first-container page-header">
  <h1>
    <span class="fa-stack">
      <i class="fa fa-circle fa-stack-2x"></i>
      <i class="fa fa-code fa-stack-1x fa-inverse"></i>
    </span>
    Business Directory<small> - using Node.JS and ExpressJS Framework</small></h1>
    <hr>
  <div class="row">
    <div class="col-sm-12 col-md-12 col-lg-12 text-center">
      <a href="http://business-directory-nodejs.herokuapp.com/" title="This link will take you to the working application."><img src="../images/works/business-dir/business-dir.jpg" alt="This is the homepage of the business directory application" class="work-img" /></a>
    </div>
  </div>

<div class="row">
    <div class="col-sm-12 col-md-12 col-lg-12">
      <h2>Main Functionality</h2>
      <p>When I was building this business directory web app I wanted to add in a login functionality to make sure users don't just go into the Web Application and add anything they wanted I wanted to add more security in it.<br> <br>
        So when the time came I used the NPM packages that are listed to the left to make the functionality work the way I wanted it. So now you have to register to a database that is hosted by <a href="http://mlab.com/">mLab</a>. You have to have to be logged in to be able to create or edit an entry.</p>
    </div>
  </div>
  <div class="row container text-center">
    <a href="http://business-directory-nodejs.herokuapp.com/" title="This link will take you to the working application."><img src="../images/works/business-dir/business-dir-login.jpg" alt="This is the login page of the business directory application" class="work-img" /></a>
  </div>

  <div class="row">
    <div class="col-sm-12 col-md-12 col-lg-12">
      <h2>NPM Packages</h2>
      <p>
        This business Directory uses npm packages that are listed here:</p>
        <ul>
            <li><a target="_blank" href="https://www.npmjs.com/package/connect-flash">Connect-Flash</a></li>
            <li><a target="_blank" href="https://www.npmjs.com/package/express">Express</a></li>
            <li><a target="_blank" href="https://www.npmjs.com/package/express-session">Express-session</a></li>
            <li><a target="_blank" href="https://www.npmjs.com/package/mongoose">Mongoose</a></li>
            <li><a target="_blank" href="https://www.npmjs.com/package/nodemon">Nodemon</a></li>
            <li><a target="_blank" href="https://www.npmjs.com/package/passport">passport</a></li>
            <li><a target="_blank" href="https://www.npmjs.com/package/passport-local">passport-local</a></li>
            <li><a target="_blank" href="https://www.npmjs.com/package/passport-local-mongoose">passport-local-mongoose</a></li>
        </ul>
    </div>
  </div>
  <div class="row container text-center">
    <a href="http://business-directory-nodejs.herokuapp.com/" title="This link will take you to the working application."><img src="../images/works/business-dir/business-dir-input-form.jpg" alt="This is the input form to add another business to the business list in the application." class="work-img" /></a>
  </div>

  <div class="row">
    <div class="col-sm-12 col-md-12 col-lg-12">
      <h2>Create Functionality</h2>
      <p>The <em>create function</em> on this application is protected by a login that you have to have in order to create an entry. When you create an entry you will have a field that will take care of the HTTP starting of a web address so you don't need to write that in front of the link in the form.</p>
    </div>
  </div>
</div>

<?php require_once("work-partials/footer.php"); ?>
