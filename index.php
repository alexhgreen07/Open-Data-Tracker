<?php

	require_once ('server/config.php');
	
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
		
		//check for the 'remember me' cookie.
		if(isset($_COOKIE['session_longterm_id']))
		{
			//validate cookie from database
			$is_cookie_valid = false;
			
			//Create query
			$qry = "SELECT * FROM sessions WHERE session_id='".$_COOKIE['session_longterm_id']."';";
			$result = mysql_query($qry);
			
			//Check whether the query was successful or not
			if ($result) {
				
				if (mysql_num_rows($result) == 1) {
						
					//Start session
					session_start();
					
					$session = mysql_fetch_assoc($result);
					
					$qry = "SELECT * FROM members WHERE member_id='".$session['member_id']."';";
					$result = mysql_query($qry);
					
					$member = mysql_fetch_assoc($result);
					$_SESSION['SESS_MEMBER_ID'] = $member['member_id'];
					$_SESSION['SESS_FIRST_NAME'] = $member['firstname'];
					$_SESSION['SESS_LAST_NAME'] = $member['lastname'];
					
					$cookieLifetime = 7 * 24 * 60 * 60; // A week in seconds
					$cookie_expiry = time()+$cookieLifetime;
					setcookie('session_longterm_id',session_id(),$cookie_expiry);	
					
					$qry = "UPDATE sessions SET session_id = '".session_id()."', session_expiry = FROM_UNIXTIME(".$cookie_expiry.") WHERE session_id = '".$session['session_id']."';";
					$result = mysql_query($qry);
					
					//go to member index
					header("location: member-index.php");
					exit();
				}
			}
			
		}
		
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
		
		//Start session
		session_start();
		
		//Sanitize the POST values
		$login = mysql_real_escape_string($_POST['login']);
		$password = mysql_real_escape_string($_POST['password']);

		//Array to store validation errors
		$errmsg_arr = array();

		//Validation error flag
		$errflag = false;

		//Create query
		$qry = "SELECT * FROM members WHERE login='".$login."' AND passwd='" . md5($password) . "'";
		$result = mysql_query($qry);

		//Check whether the query was successful or not
		if ($result) {

			if (mysql_num_rows($result) == 1) {
					
				//Login Successful
				
				$member = mysql_fetch_assoc($result);
				$_SESSION['SESS_MEMBER_ID'] = $member['member_id'];
				$_SESSION['SESS_FIRST_NAME'] = $member['firstname'];
				$_SESSION['SESS_LAST_NAME'] = $member['lastname'];
				
				//Create query
				$qry = "SELECT * FROM sessions WHERE session_id='".$_COOKIE['session_longterm_id']."';";
				$result = mysql_query($qry);
				
				$cookieLifetime = 7 * 24 * 60 * 60; // A week in seconds
				$cookie_expiry = time()+$cookieLifetime;
				setcookie('session_longterm_id',session_id(),$cookie_expiry);	
				
				//Check whether the query was successful or not
				if ($result) {
					
					
					if (mysql_num_rows($result) == 1) {
						
						$session = mysql_fetch_assoc($result);
						
						$qry = "UPDATE sessions SET session_id = '".session_id()."', session_expiry = FORM_UNIXTIME(".$cookie_expiry.") WHERE session_id = '".$session['session_id']."';";
						$result = mysql_query($qry);
						
					}
					else {
						
						$qry = "INSERT INTO sessions (session_id,member_id,session_expiry) VALUES('".session_id()."','".$_SESSION['SESS_MEMBER_ID']."', FROM_UNIXTIME(".$cookie_expiry."));";
						$result = mysql_query($qry);
						
						
					}
					
					
				}

				header("location: member-index.php");
				exit();

			} else {

				$html_output .= '
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


