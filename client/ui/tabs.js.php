<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../externals/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../externals/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

?>

/** This is a wrapper for an array of panes in a JQuery tab object.
 * @constructor Tabs
 */
function Tabs(tab_div_id, tab_array) {

	//class variables
	this.div_id = tab_div_id;
	this.tabs = tab_array;

	//render function (div must already exist)
	this.Render = function() {

		var new_inner_html = '';

		new_inner_html += "<ul>";

		//create all top tab items using ul
		for (var i = 0; i < this.tabs.length; i++) {
			new_inner_html += '<li><a href="#' + this.div_id + '-tab-' + i + '">' + this.tabs[i][0] + '</a></li>';
		}

		new_inner_html += "</ul>";

		//create all content tab items using div
		for (var i = 0; i < this.tabs.length; i++) {
			new_inner_html += '<div id="' + this.div_id + '-tab-' + i + '">' + this.tabs[i][1] + '</div>';
		}

		new_inner_html += "</ul>";

		var div_tab = document.getElementById(this.div_id);

		div_tab.innerHTML = new_inner_html;

		//execute JQuery tabs initialization
		$("#" + this.div_id).tabs();

	};
}

