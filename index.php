<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
		<title>Trackanything: Member Index</title>

		<!-- Custom CSS stylsheet -->
		<link href="client/main.css.php" rel="stylesheet" type="text/css" />
	</head>
	<body>
	<h1>TrackAnything Login</h1>
	<a href="new_member.php">Sign Up</a>
	
	<?php

		require_once ('server/config.php');

		$html_output = '';

		//Sanitize the POST values
		$login = mysql_real_escape_string($_POST['login']);
		$password = mysql_real_escape_string($_POST['password']);

		if ($_POST["password"] == "" && $_POST["login"] == "") {
			
			$html_output .= '
		

				<form id="loginForm" name="loginForm" method="post">
		
				Login:
				<input name="login" type="text" id="login" class="text"/><br/>
				Password:
				<input name="password" type="password" id="password" class="text"/><br /><br />
				<input type="submit" name="Submit" value="Login" /><br />
				</form>
				';
				
		} else if ($_POST["password"] != "" && $_POST["login"] != "") {
			
			//Start session
			session_start();

			//Array to store validation errors
			$errmsg_arr = array();

			//Validation error flag
			$errflag = false;

			//Connect to mysql server
			$link = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
			if (!$link) {
				die('Failed to connect to server: ' . mysql_error());
			}

			//Select database
			$db = mysql_select_db(DB_DATABASE);
			if (!$db) {
				die("Unable to select database");
			}

			//Create query
			$qry = "SELECT * FROM members WHERE login='$login' AND passwd='" . md5($password) . "'";
			$result = mysql_query($qry);

			//Check whether the query was successful or not
			if ($result) {

				if (mysql_num_rows($result) == 1) {

					//Login Successful
					session_regenerate_id();
					$member = mysql_fetch_assoc($result);
					$_SESSION['SESS_MEMBER_ID'] = $member['member_id'];
					$_SESSION['SESS_FIRST_NAME'] = $member['firstname'];
					$_SESSION['SESS_LAST_NAME'] = $member['lastname'];
					session_write_close();

					header("location: member-index.php");
					exit();

				} else {

					$html_output .= '<h1>Login Failed </h1>
				<p align="center">&nbsp;</p>
				<h4 align="center" class="err">Login Failed!<br />
				  Please check your username and password
				<br />
				<a href="index.php">Login Page</a>
				</h4>
				';
				}

			} else {
				
				die("Query failed");
				
			}
		} else {
			
			//Input Validations
			if ($login == '') {
				
				$errmsg_arr[] = 'Login ID missing';
				$errflag = true;
			}
			
			if ($password == '') {
				
				$errmsg_arr[] = 'Password missing';
				$errflag = true;
				
			}

			//If there are input validations, redirect back to the login form
			if ($errflag) {
				
				$_SESSION['ERRMSG_ARR'] = $errmsg_arr;
				session_write_close();
				
			}

			header("location: index.php");
			exit();
		}

		echo $html_output;
	?>
	
	</body>
</html>

