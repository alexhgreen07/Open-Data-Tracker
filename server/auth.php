<?php
/** \file auth.php
 * \brief This file contains functions to authorize users.
 * */
 
function Is_Cookie_Authorized(){
	
	$return_value = false;
	
	//check for the 'remember me' cookie.
	if(isset($_COOKIE['session_longterm_id']))
	{
		//validate cookie from database
		$is_cookie_valid = false;
		
		//Create query
		$qry = "SELECT * FROM sessions WHERE session_id='".$_COOKIE['session_longterm_id']."';";
		$result = mysql_query($qry);
		
		//Check whether the query was successful or not
		if ($result) {
			
			if (mysql_num_rows($result) == 1) {
					
				//Start session
				session_start();
				
				$session = mysql_fetch_assoc($result);
				
				$qry = "SELECT * FROM members WHERE member_id='".$session['member_id']."';";
				$result = mysql_query($qry);
				
				$member = mysql_fetch_assoc($result);
				$_SESSION['SESS_MEMBER_ID'] = $member['member_id'];
				$_SESSION['SESS_FIRST_NAME'] = $member['firstname'];
				$_SESSION['SESS_LAST_NAME'] = $member['lastname'];
				
				$cookieLifetime = 7 * 24 * 60 * 60; // A week in seconds
				$cookie_expiry = time()+$cookieLifetime;
				setcookie('session_longterm_id',session_id(),$cookie_expiry);	
				
				$qry = "UPDATE sessions SET session_id = '".session_id()."', session_expiry = FROM_UNIXTIME(".$cookie_expiry.") WHERE session_id = '".$session['session_id']."';";
				$result = mysql_query($qry);
				
				$return_value = true;
			}
		}
		
	}
	
	return $return_value;
}
 
/** \fn function Is_Session_Authorized()
 * \brief This function checks whether a session is authorized.
 * \return Returns a boolean true if the member is authorized, otherwise it returns false.
 * */
function Is_Session_Authorized() {
	$return_value = !(!isset($_SESSION['SESS_MEMBER_ID']) || (trim($_SESSION['SESS_MEMBER_ID']) == ''));

	return $return_value;
}

function Is_Authorized() {
	
	$return_value = false;
	
	//this is a protected area. Ensure the session is authorized.
	if (Is_Session_Authorized()) {
		
		$return_value = true;
	}
	else if(Is_Cookie_Authorized())
	{
		$return_value = true;
	}
	
	return $return_value;
}

function Authorize_User_Password($login, $password)
{
	
	//Array to store validation errors
	$errmsg_arr = array();

	//Validation error flag
	$errflag = false;
	
	$return_value = false;
	
	//Create query
	$qry = "SELECT * FROM members WHERE login='".$login."' AND passwd='" . md5($password) . "'";
	$result = mysql_query($qry);

	//Check whether the query was successful or not
	if ($result) {

		if (mysql_num_rows($result) == 1) {
				
			//Login Successful
			$return_value = true;
			
			//Start session
			session_start();
		
			
			$member = mysql_fetch_assoc($result);
			$_SESSION['SESS_MEMBER_ID'] = $member['member_id'];
			$_SESSION['SESS_FIRST_NAME'] = $member['firstname'];
			$_SESSION['SESS_LAST_NAME'] = $member['lastname'];
			
			//Create query
			$qry = "SELECT * FROM sessions WHERE session_id='".$_COOKIE['session_longterm_id']."';";
			$result = mysql_query($qry);
			
			$cookieLifetime = 7 * 24 * 60 * 60; // A week in seconds
			$cookie_expiry = time()+$cookieLifetime;
			setcookie('session_longterm_id',session_id(),$cookie_expiry);	
			
			//Check whether the query was successful or not
			if ($result) {
				
				
				if (mysql_num_rows($result) == 1) {
					
					$session = mysql_fetch_assoc($result);
					
					$qry = "UPDATE sessions SET session_id = '".session_id()."', session_expiry = FORM_UNIXTIME(".$cookie_expiry.") WHERE session_id = '".$session['session_id']."';";
					$result = mysql_query($qry);
					
				}
				else {
					
					$qry = "INSERT INTO sessions (session_id,member_id,session_expiry) VALUES('".session_id()."','".$_SESSION['SESS_MEMBER_ID']."', FROM_UNIXTIME(".$cookie_expiry."));";
					$result = mysql_query($qry);
					
					
				}
				
				
			}

		}
		
	} else {
		
		die("Query failed");
		
	}
	
	return $return_value;
}


?>
