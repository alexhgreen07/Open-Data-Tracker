<?php

function Authorize_Session() {
	//Start session
	session_start();

	//Check whether the session variable SESS_MEMBER_ID is present or not
	if (!Is_Session_Authorized()) {

		header('location: index.php');

		exit();
	}
}

function Is_Session_Authorized() {
	$return_value = !(!isset($_SESSION['SESS_MEMBER_ID']) || (trim($_SESSION['SESS_MEMBER_ID']) == ''));

	return $return_value;
}
?>
