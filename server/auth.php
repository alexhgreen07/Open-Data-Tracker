<?php
/** \file auth.php
 * This file contains functions to authorize users.
 * */

/** \fn function Authorize_Session()
 * \brief This function attempts to authorize the session with a member.
 * If it fails the script exits.
 * \return None.
 * */
function Authorize_Session() {
	//Start session
	session_start();

	//Check whether the session variable SESS_MEMBER_ID is present or not
	if (!Is_Session_Authorized()) {

		header('location: index.php');

		exit();
	}
}

/** \fn function Is_Session_Authorized()
 * \brief This function checks whether a session is authorized.
 * \return Returns a boolean true if the member is authorized, otherwise it returns false.
 * */
function Is_Session_Authorized() {
	$return_value = !(!isset($_SESSION['SESS_MEMBER_ID']) || (trim($_SESSION['SESS_MEMBER_ID']) == ''));

	return $return_value;
}
?>
