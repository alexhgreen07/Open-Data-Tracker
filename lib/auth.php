<?php

require_once("header.php");
require_once("footer.php");

//Start session
session_start();

//Check whether the session variable SESS_MEMBER_ID is present or not
if(Is_Session_Authorized()) {
	
	$html_output = '';

	$html_output .= render_doctype();

	$html_output .= render_header("Access Denied");
	$html_output .=  '
		<h1>Access Denied </h1>
		<p align="center">&nbsp;</p>
		<h4 align="center" class="err">Access Denied!<br />
		  You do not have access to this resource.<br />
		<a href="index.php">Login Page</a>
		</h4>
		';
	
	$html_output .= render_footer();
	
	echo $html_output;
	
	exit();
}

function Is_Session_Authorized()
{
	$return_value = (!isset($_SESSION['SESS_MEMBER_ID']) || (trim($_SESSION['SESS_MEMBER_ID']) == ''));
	
	return $return_value;
}

?>
