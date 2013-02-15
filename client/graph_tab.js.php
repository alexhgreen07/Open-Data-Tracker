<?php

Header("content-type: application/x-javascript");

//jquery code
include_once('external/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once('external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//JSON RPC library
include_once('external/json-rpc2php-master/jsonRPC2php.client.js');

require_once('accordian.js.php');

?>

function Graph_Tab(data_div_id) {

	//class variables
	this.div_id = data_div_id;

	//render function (div must already exist)
	this.Render = function() {

		var tabs_array = new Array();

		var new_tab;

		new_tab = new Array();
		new_tab.push("Summaries");
		new_tab.push('Under construction...');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("Custom Graph");
		new_tab.push('Under construction...');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("Time Based");
		new_tab.push('Under construction...');
		tabs_array.push(new_tab);

		var return_html = '';

		return_html += '<div id="graphs_accordian"></div>';

		var div_tab = document.getElementById(this.div_id);
		div_tab.innerHTML = return_html;

		//render the accordian
		var task_accordian = new Accordian('graphs_accordian', tabs_array);
		task_accordian.Render();

	};
}

