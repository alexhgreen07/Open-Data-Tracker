<?php

//require authorization and configuration files
require_once('lib/auth.php');

//this is a protected area. Ensure the session is authorized.
Authorize_Session();

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
	<title>Trackanything: Member Index</title>
	
	<!-- Custom CSS stylsheet -->
	<link href="css/loginmodule.css" rel="stylesheet" type="text/css" />
	
	<!-- JQuery UI javscript and stylesheets -->
	<link rel="stylesheet" href="js/jquery-ui-1.10.0.custom/development-bundle/themes/base/jquery-ui.css" />
	<script src="js/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js"></script>
	<script src="js/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js"></script>
	<link rel="stylesheet" href="/resources/demos/style.css" />
	
	<!-- JSON RPC Library -->
	<script src="js/json-rpc2php-master/jsonRPC2php.client.js"></script>
	
	<!-- Custom javascript -->
	<script src="js/main.js"></script>
	<script src="js/tabs.js"></script>
	<script src="js/accordian.js"></script>
	<script src="js/home_tab.js"></script>
	<script src="js/item_tab.js"></script>
	<script src="js/task_tab.js"></script>
	<script src="js/data_tab.js"></script>
	<script src="js/graph_tab.js"></script>
	
	<script>
		
		//setup the main tabs
		main();
		
	</script>
	
</head>

<body>

	<h1>Trackanything Welcome!</h1>

</body>
</html>
	
	

