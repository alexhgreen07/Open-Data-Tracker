<?php
/** \file api.php
 * \brief This file contains the RPC API. It is where a client calls back to.
 * */


require_once ('auth.php');
require_once ('config.php');
require_once ('database.php');
require_once ('data_interface.php');
require_once ('data_interface_lib/home_data_interface.php');
require_once ('data_interface_lib/item_data_interface.php');
require_once ('data_interface_lib/task_data_interface.php');
require_once ('../externals/json-rpc2php/jsonRPC2Server.php');

//Connect to mysql server
$link = Connect_To_DB();

//this is a protected area. Ensure the session is authorized.
if (!Is_Authorized()) {
	
	header('location: index.php');

	exit();
	
}


//initialize the API classes and the RPC interface
$generaldatainterface = new Data_Interface($link);
$homedatainteface = new Home_Data_Interface($link);
$itemdatainterface = new Item_Data_Interface($link);
$taskdatainterface = new Task_Data_Interface($link);

//initialize the jsonRPC server object
$jsonRpc = new jsonRPCServer();

//register classes
$jsonRpc -> registerClass($generaldatainterface);
$jsonRpc -> registerClass($homedatainteface);
$jsonRpc -> registerClass($itemdatainterface);
$jsonRpc -> registerClass($taskdatainterface);
$jsonRpc -> registerClass($reportdatainterface);

//handle requests
$jsonRpc -> handle() or die('no request');
?>

