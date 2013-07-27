<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any style sheet file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

header("Content-type: text/css; charset: UTF-8");

//jquery style sheet
//include_once(dirname(__FILE__).'/../externals/jquery-ui/themes/base/jquery.ui.all.css');
include_once(dirname(__FILE__)."/../externals/jquery-ui/themes/base/jquery.ui.core.css");

include_once(dirname(__FILE__)."/../externals/jquery-ui/themes/base/jquery.ui.accordion.css");
include_once(dirname(__FILE__)."/../externals/jquery-ui/themes/base/jquery.ui.autocomplete.css");
include_once(dirname(__FILE__)."/../externals/jquery-ui/themes/base/jquery.ui.button.css");
include_once(dirname(__FILE__)."/../externals/jquery-ui/themes/base/jquery.ui.datepicker.css");
include_once(dirname(__FILE__)."/../externals/jquery-ui/themes/base/jquery.ui.dialog.css");
include_once(dirname(__FILE__)."/../externals/jquery-ui/themes/base/jquery.ui.menu.css");
include_once(dirname(__FILE__)."/../externals/jquery-ui/themes/base/jquery.ui.progressbar.css");
include_once(dirname(__FILE__)."/../externals/jquery-ui/themes/base/jquery.ui.resizable.css");
include_once(dirname(__FILE__)."/../externals/jquery-ui/themes/base/jquery.ui.selectable.css");
include_once(dirname(__FILE__)."/../externals/jquery-ui/themes/base/jquery.ui.slider.css");
include_once(dirname(__FILE__)."/../externals/jquery-ui/themes/base/jquery.ui.spinner.css");
include_once(dirname(__FILE__)."/../externals/jquery-ui/themes/base/jquery.ui.tabs.css");
include_once(dirname(__FILE__)."/../externals/jquery-ui/themes/base/jquery.ui.tooltip.css");

include_once(dirname(__FILE__)."/../externals/jquery-ui/themes/base/jquery.ui.theme.css");

//jquery timepicker style sheet
include_once(dirname(__FILE__).'/../externals/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon.css');

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
