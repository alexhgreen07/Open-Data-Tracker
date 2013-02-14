<?php //require authorization and configuration files
require_once ('server/auth.php');

//this is a protected area. Ensure the session is authorized.
Authorize_Session();
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
		<title>Trackanything: Member Index</title>

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
		
		<div><h1>Trackanything Welcome!</h1></div>

	</body>
</html>

