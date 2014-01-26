<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../../../externals/jquery-ui/jquery-1.10.2.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../../../externals/jquery-ui/ui/jquery.ui.core.js');

//jquery datepicker code
include_once(dirname(__FILE__).'/../../../../externals/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../../externals/json-rpc2php/jsonRPC2php.client.js');

//get accordian
require_once(dirname(__FILE__).'/../../accordian.js.php');
require_once(dirname(__FILE__).'/../../tree_view.js.php');

require_once(dirname(__FILE__).'/categories/category_form.js.php');
require_once(dirname(__FILE__).'/items/item_tab.js.php');
require_once(dirname(__FILE__).'/tasks/task_tab.js.php');

//main file
include_once(dirname(__FILE__).'/entry_tab.js');


?>
