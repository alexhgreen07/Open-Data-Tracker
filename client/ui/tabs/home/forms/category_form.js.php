<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../../../../externals/jquery-ui/jquery-1.10.2.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../../../../externals/jquery-ui/ui/jquery.ui.core.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../../../externals/json-rpc2php/jsonRPC2php.client.js');

require_once(dirname(__FILE__).'/../../../accordian.js.php');

require_once(dirname(__FILE__).'/new_category_form.js.php');
require_once(dirname(__FILE__).'/edit_category_form.js.php');
require_once(dirname(__FILE__).'/view_categories_form.js.php');

//main file
include_once(dirname(__FILE__).'/category_form.js');


?>
