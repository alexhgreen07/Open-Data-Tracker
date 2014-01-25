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

//jquery datepicker code
include_once(dirname(__FILE__).'/../../../../../externals/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../../../externals/json-rpc2php/jsonRPC2php.client.js');

//get accordian
require_once(dirname(__FILE__).'/../../../accordian.js.php');

//get the timecard task entry form
require_once(dirname(__FILE__).'/forms/timecard_task_entry_form.js.php');

//get the new task entry form
require_once(dirname(__FILE__).'/forms/new_task_entry_form.js.php');

//get the edit task entry form
require_once(dirname(__FILE__).'/forms/edit_task_entry_form.js.php');

//get the view task entries form
require_once(dirname(__FILE__).'/forms/view_task_entries_form.js.php');

//get the new task form
require_once(dirname(__FILE__).'/forms/new_task_form.js.php');

//get the edit task form
require_once(dirname(__FILE__).'/forms/edit_task_form.js.php');

//get the view tasks form
require_once(dirname(__FILE__).'/forms/view_tasks_form.js.php');

//get the view tasks form
require_once(dirname(__FILE__).'/forms/new_task_target_form.js.php');

//get the view tasks form
require_once(dirname(__FILE__).'/forms/edit_task_target_form.js.php');

//get the view tasks form
require_once(dirname(__FILE__).'/forms/view_task_targets_form.js.php');

//main file
include_once(dirname(__FILE__).'/task_tab.js');


?>
