<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/external/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once(dirname(__FILE__).'/external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

?>

/** This is a wrapper class for an array of JQuery accordian panes.
 * @constructor Accordian
 */
function Accordian(accordian_div_id, accordian_array) {

	//class variables
	this.div_id = accordian_div_id;
	this.tabs = accordian_array;

	//render function (div must already exist)
	this.Render = function() {

		var new_inner_html = '';

		//create all top tab items using ul
		for (var i = 0; i < this.tabs.length; i++) {
			new_inner_html += '<h3>' + this.tabs[i][0] + '</h3>';
			new_inner_html += '<div><p>' + this.tabs[i][1] + '</p></div>';
		}

		var div_tab = document.getElementById(this.div_id);

		div_tab.innerHTML = new_inner_html;

		//execute JQuery tabs initialization
		$("#" + this.div_id).accordion({
			collapsible : true,
			heightStyle : "content"
		});

	};
}

