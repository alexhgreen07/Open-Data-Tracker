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

//include_once(dirname(__FILE__).'/../../../../externals/DataTables/media/js/jquery.dataTables.js');

include_once(dirname(__FILE__).'/../../../../externals/pivot/pivot.js');

include_once(dirname(__FILE__).'/../../../../externals/pivot/jquery_pivot.js');

include_once(dirname(__FILE__).'/../../../../externals/Chart/Chart.js');

require_once(dirname(__FILE__).'/../../accordian.js.php');

//main file
include_once(dirname(__FILE__).'/report_tab.js');

?>
