<?php

//require authorization and configuration files
require_once('lib/auth.php');
require_once('lib/config.php');

//pages and objects
require_once("lib/header.php");
require_once("lib/footer.php");
require_once('lib/member-tabs.php');

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

$html_output = '';

$html_output .= render_doctype();

$html_output .= render_header("Member Index",$member_forms_header_text);

$html_output .= '
<h1>Welcome '.$_SESSION['SESS_FIRST_NAME'].'</h1>
<a href="logout.php">Logout</a>';

//create tabs using render functions
$tabs = array(
	"Home" => Render_Home_Tab(),
	"Items" => Render_Items_Tab(),
	"Tasks" => Render_Tasks_Tab(),
	"Data" => Render_Data_Tab(),
	"Graphs" => Render_Graph_Tab(),
);

//create the main tab navigation
$html_output .= Create_Tabs("main_tabs",$tabs);

mysql_close();

$html_output .= '
</body>
</html>';

echo $html_output;
