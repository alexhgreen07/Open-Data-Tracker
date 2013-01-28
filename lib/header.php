<?php

function render_doctype()
{	
	$html_output = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">';	
	
	
	return $html_output;
}

function render_header($page_title,$extra_links="")
{
	$html_output = '
	<head>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
	<title>'.$page_title.'</title>
	<link href="css/loginmodule.css" rel="stylesheet" type="text/css" />
	'.$extra_links.'
	</head>
	';	
	
	
	return $html_output;
}

?>
