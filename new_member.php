<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
		<title>Trackanything: Member Sign Up</title>

		<!-- Custom CSS stylsheet -->
		<link href="client/main.css.php" rel="stylesheet" type="text/css" />
	</head>
	<body>
		<h1>
			TrackAnything Member Sign Up
		</h1>
		<a href="index.php">Login</a>
		
		<?php

		require_once ('server/config.php');

		$html_output = '';

		//Sanitize the POST values
		$login = mysql_real_escape_string($_POST['member_name']);
		$password = mysql_real_escape_string($_POST['member_password']);

		if ($login == "" && $password == "") {
			
			$html_output .= '
		

				<form id="loginForm" name="loginForm" method="post">
		
				New Member Login:
				<input name="member_name" type="text" id="member_name" class="text"/><br/>
				Desired Password:
				<input name="member_password" type="password" id="member_password" class="text"/><br />
				Email (optional):
				<input name="member_email" type="text" id="member_email" class="text"/><br /><br />
				<input type="submit" name="Submit" value="Sign Up" /><br />
				
				</form>
				';
				
		} else if ($login != "" && $password != "") {
			
			
			
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
			$qry = "INSERT INTO `life_management`.`members` (
				`member_id` ,
				`firstname` ,
				`lastname` ,
				`login` ,
				`passwd`
				)
				VALUES (
				NULL , NULL , NULL , '".$login."',
				'" . md5($password) . "');";
				
			$result = mysql_query($qry);

			//Check whether the query was successful or not
			if ($result) {
				
				header( 'Location: index.php' ) ;

			} else {
				
				die("Query failed.");
				
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
