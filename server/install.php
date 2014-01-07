<?php

require_once ('config.php');
require_once ('database.php');

//Connect to mysql server
$link = Connect_To_DB();

if(!$link)
{
	$error_string = "Unable to connect to the database: ";
	$error_string .= DB_HOST;
	$error_string .= " as user ";
	$error_string .= DB_USER;
	$error_string .= ". Check that 'config.php' has the correction connection information.";
	
	exit($error_string);
}

//ensure the session is started.
session_start();

if (!isset( $_POST['Install_Submit'] )) 
{
	$html = '
	<form Method="POST">
	Clicking the button below will install the Open Data Tracker database tables.
	<input name="Install_Submit" type="submit" value="Install">
	</form>
	';
}
else {
	
	$result = Create_Database_Tables();
	
	if(!$result)
	{
		$html = 'Failure to install the database: '. mysql_error();
		
	}
	else
	{
		$html = 'Open data tracker database installed successfully. You may now use the application.';
	}
	
}

echo $html;

?>