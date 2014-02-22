<?php //require authorization and configuration files
require_once ('server/auth.php');
require_once ('server/database.php');

Connect_To_DB();

Update_Database();

//ensure the session is started.
session_start();

//this is a protected area. Ensure the session is authorized.
if (!Is_Authorized()) {
	
	header('location: index.php');

	exit();
	
}

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<!--<html manifest="manifest.php">-->
<link rel="shortcut icon" href="apple-touch-icon.png" />
<link href="apple-touch-icon.png" rel="apple-touch-icon" />

<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;"> 
<meta name="apple-mobile-web-app-capable" content="yes"/>

<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
		<title>Open Data Tracker: Member Index</title>

		<!-- Application CSS stylsheet -->
		<link href="client/main.css.php" rel="stylesheet" type="text/css" />

		<!-- Application javascript -->
		<script src="client/main.js.php"></script>
		
		<script>
		
			//run the application
			main();

		</script>

	</head>

	<body>
		
		<div><h1>Open Data Tracker</h1><a href="logout.php">Logout</a></div>

	</body>
</html>

