<?php
/** \file auth.php
 * \brief This file contains functions to authorize users.
 * */
 
/** \fn function Is_Session_Authorized()
 * \brief This function checks whether a session is authorized.
 * \return Returns a boolean true if the member is authorized, otherwise it returns false.
 * */
function Is_Session_Authorized() {
	$return_value = !(!isset($_SESSION['SESS_MEMBER_ID']) || (trim($_SESSION['SESS_MEMBER_ID']) == ''));

	return $return_value;
}
?>
