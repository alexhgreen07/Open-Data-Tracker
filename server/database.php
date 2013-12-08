<?php

require_once ('config.php');
require_once ('auth.php');

function Connect_To_DB()
{
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
	
	return $link;
}

?>