<?php

	require_once ('server/config.php');
	require_once ('server/database.php');
	require_once ('server/auth.php');
	
	//Connect to mysql server
	Connect_To_DB();
	
	if (Is_Authorized()) {
		
		header('location: member-index.php');
	
		exit();
		
	}
		
	
	$html_output = '
	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;"> 
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
				<title>Open Data Tracker: Member Login</title>
		
				<!-- Custom CSS stylsheet -->
				<link href="client/main.css.php" rel="stylesheet" type="text/css" />
			</head>
			<body>
			<h1>Open Data Tracker Login</h1>
			<a href="new_member.php">Sign Up</a>';

	if (!isset($_POST["password"]) && !isset($_POST["login"])) {
		
		$html_output .= '
	

			<form id="loginForm" name="loginForm" method="post">
	
			Login:<br/>
			<input name="login" type="text" id="login" class="text"/><br/>
			Password:<br/>
			<input name="password" type="password" id="password" class="text"/><br /><br />
			<input type="submit" name="Submit" value="Login" /><br />
			</form>
			';
			
	} 
	else if (isset($_POST["password"]) && isset($_POST["login"])) {
		
		//Sanitize the POST values
		$login = mysql_real_escape_string($_POST['login']);
		$password = mysql_real_escape_string($_POST['password']);
		
		Authorize_User_Password($login, $password);
		
		//check authentication
		if(Is_Authorized())
		{
			header("location: member-index.php");
			exit();
		}
		else {
			$html_output .= '
						<p align="center">&nbsp;</p>
						<h4 align="center" class="err">Login Failed!<br />
						  Please check your username and password
						<br />
						<a href="index.php">Login Page</a>
						</h4>
						';
		}

		
	}
	else {
		
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
	
	$html_output .= '
		</body>
		</html>
					';
	
	echo $html_output;
?>


