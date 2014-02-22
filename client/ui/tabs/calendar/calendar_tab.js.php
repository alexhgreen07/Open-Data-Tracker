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

//JSON RPC library
include_once(dirname(__FILE__).'/../../../../externals/json-rpc2php/jsonRPC2php.client.js');

include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/intro.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/defaults.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/main.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/Calendar.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/Header.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/EventManager.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/date_util.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/util.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/basic/MonthView.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/basic/BasicWeekView.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/basic/BasicDayView.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/basic/BasicView.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/basic/BasicEventRenderer.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/agenda/AgendaWeekView.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/agenda/AgendaDayView.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/agenda/AgendaView.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/agenda/AgendaEventRenderer.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/common/View.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/common/DayEventRenderer.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/common/SelectionManager.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/common/OverlayManager.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/common/CoordinateGrid.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/common/HoverListener.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/common/HorizontalPositionCache.js");
include_once(dirname(__FILE__)."/../../../../externals/fullcalendar/src/outro.js");

require_once(dirname(__FILE__).'/../../accordian.js.php');

//main file
include_once(dirname(__FILE__).'/events/scheduler.js.php');

//main file
include_once(dirname(__FILE__).'/calendar_tab.js');


?>
