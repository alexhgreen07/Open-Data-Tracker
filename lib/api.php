<?php

require_once('auth.php');
require_once('config.php');
require_once('data_interface.php');
require_once('../js/json-rpc2php-master/jsonRPC2Server.php');

//this is a protected area. Ensure the session is authorized.
Authorize_Session();

//Connect to mysql server
$link = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
if(!$link) {
	die('Failed to connect to server: ' . mysql_error());
}

//Select database
$db = mysql_select_db(DB_DATABASE);
if(!$db) {
	die("Unable to select database");
}

//initialize the API class and the RPC interface
$myClass = new Data_Interface($link);
$jsonRpc = new jsonRPCServer();

//register class and process requests
$jsonRpc->registerClass($myClass);
$jsonRpc->handle() or die('no request');


?>

