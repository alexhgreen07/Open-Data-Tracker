<?php

header("Content-type: text/css; charset: UTF-8");

//jquery style sheet
include 'external/jquery-ui-1.10.0.custom/development-bundle/themes/base/jquery-ui.css';

//jquery timepicker style sheet
include 'external/jquery-ui-timerpicker-addon/jquery-ui-timepicker-addon.css';

?>

body {
	font: 28px Verdana, Arial, Helvetica, sans-serif;
	color: #666666;
	margin: 0px;
	padding: 20px 10px 0px;
}
.textfield {
	font-size: 11px;
	color: #333333;
	background: #F7F7F7;
	border: 1px solid #CCCCCC;
	padding-left: 1px;
}
table {
	width:100%;
}
input {
	width:100%;
	font-size:inherit;
}
.text {
	width:95%;
}
textarea {
	width:100%;
}
select {
	width:95%;
	font-size:inherit;
}
h1 {
	color: #99CC00;
	margin: 0px 0px 5px;
	padding: 0px 0px 3px;
	font: bold 38px Verdana, Arial, Helvetica, sans-serif;
	border-bottom: 1px dashed #E6E8ED;
}
a {
	color: #2D3954;
	font-size: inherit;
}
a:hover {
	color: #99CC00;
}
.err {
	color: #FF9900;
}
th {
	font-weight: bold;
	text-align: left;
}
