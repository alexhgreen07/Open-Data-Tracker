<?php


Header("content-type: application/x-javascript");

//fastclick code
include_once(dirname(__FILE__).'/../externals/fastclick/lib/fastclick.js');

//jquery code
include_once(dirname(__FILE__).'/../externals/jquery-ui/jquery-1.10.2.js');

//jquery UI code
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.core.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.widget.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.mouse.js');
//include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.position.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.draggable.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.droppable.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.resizable.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.selectable.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.sortable.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.effect.js');

include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.button.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.tabs.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.accordion.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.slider.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.datepicker.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.dialog.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.menu.js');
include_once(dirname(__FILE__).'/../externals/jquery-ui/ui/jquery.ui.tooltip.js');

//jquery datepicker code
include_once(dirname(__FILE__).'/../externals/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../externals/json-rpc2php/jsonRPC2php.client.js');

//include the server API
require_once(dirname(__FILE__).'/core/api.js.php');

//ensure all include files are present.
require_once(dirname(__FILE__).'/ui/tabs.js.php');
require_once(dirname(__FILE__).'/ui/tabs/home/home_tab.js.php');
require_once(dirname(__FILE__).'/ui/tabs/items/item_tab.js.php');
require_once(dirname(__FILE__).'/ui/tabs/tasks/task_tab.js.php');
require_once(dirname(__FILE__).'/ui/tabs/report/report_tab.js.php');

//main file
include_once(dirname(__FILE__).'/main.js');

?>