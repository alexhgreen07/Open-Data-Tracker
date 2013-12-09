<?php

require_once ('server/config.php');
require_once ('server/database.php');
require_once ('server/auth.php');

Connect_To_DB();

//Start session
session_start();

Logout_Authorized_Session();

session_destroy();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
		<title>Logged Out</title>
		<link href="client/main.css.php" rel="stylesheet" type="text/css" />
	</head>
	<body>
		<h1>Logout </h1>
		<p align="center">
			&nbsp;
		</p>
		<h4 align="center" class="err">You have been logged out.</h4>
		<p align="center">
			Click here to <a href="index.php">Login</a>
		</p>
	</body>
</html>
