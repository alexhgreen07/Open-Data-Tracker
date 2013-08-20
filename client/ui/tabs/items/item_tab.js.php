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

//jquery datepicker code (addon)
include_once(dirname(__FILE__).'/../../../../externals/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../../externals/json-rpc2php/jsonRPC2php.client.js');

//get accordian
require_once(dirname(__FILE__).'/../../accordian.js.php');

//get quick item entry form
require_once(dirname(__FILE__).'/forms/quick_item_entry_form.js.php');

//get new item entry form
require_once(dirname(__FILE__).'/forms/new_item_entry_form.js.php');

//get edit item entry form
require_once(dirname(__FILE__).'/forms/edit_item_entry_form.js.php');

//get view item entries form
require_once(dirname(__FILE__).'/forms/view_item_entries_form.js.php');

//get new item form
require_once(dirname(__FILE__).'/forms/new_item_form.js.php');

//get edit item form
require_once(dirname(__FILE__).'/forms/edit_item_form.js.php');

//get view items form
require_once(dirname(__FILE__).'/forms/view_items_form.js.php');

//main file
include_once(dirname(__FILE__).'/item_tab.js');


?>
