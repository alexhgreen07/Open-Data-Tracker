<?php


Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../externals/jquery-ui/jquery-1.10.2.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../externals/jquery-ui/ui/jquery.ui.core.js');

//jquery datepicker code
include_once(dirname(__FILE__).'/../../externals/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../externals/json-rpc2php/jsonRPC2php.client.js');

include_once(dirname(__FILE__).'/json_rpc_queue.js.php');

include_once(dirname(__FILE__).'/types.js');

//main file
include_once(dirname(__FILE__).'/api.js');

?>
