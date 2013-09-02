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

//main file
include_once(dirname(__FILE__).'/main.css');


?>

