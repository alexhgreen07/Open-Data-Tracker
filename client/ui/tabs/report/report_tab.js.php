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

require_once(dirname(__FILE__).'/../../accordian.js.php');

?>

/** This is the report tab object which holds all UI objects for detailed data interaction.
 * @constructor Report_Tab
 */
function Report_Tab() {

	//class variables
	this.div_id = null;

	this.Refresh = function(data) {
		var params = new Array();

		var self = this;

		var new_inner_html = '';

		new_inner_html += 'Last refreshed: ' + (new Date()) + '<br />';

		new_inner_html += '';

		var summary_div = document.getElementById(self.report_summaries_data_display_div.id);
		summary_div.innerHTML = new_inner_html;

	};

	this.Render_Summaries_Form = function(form_div_id) {

		var self = this;

		this.report_summaries_data_form = document.createElement("form");
		this.report_summaries_data_form.setAttribute('method', "post");
		this.report_summaries_data_form.setAttribute('id', "report_summaries_display_form");


		this.report_summaries_data_display_div = document.createElement("div");
		this.report_summaries_data_display_div.setAttribute('id', 'report_summaries_data_display_div');
		this.report_summaries_data_form.appendChild(this.report_summaries_data_display_div);

		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = 'Under construction...';
		div_tab.appendChild(this.report_summaries_data_form);

	};

	this.Render_Time_Based_Form = function(form_div_id) {

		var self = this;

		this.report_time_based_data_form = document.createElement("form");
		this.report_time_based_data_form.setAttribute('method', "post");
		this.report_time_based_data_form.setAttribute('id', "report_time_based_display_form");

		this.report_time_based_data_display_div = document.createElement("div");
		this.report_time_based_data_form.appendChild(this.report_time_based_data_display_div);

		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = 'Under construction...';
		div_tab.appendChild(this.report_time_based_data_form);

	};

	//render function (div must already exist)
	this.Render = function(data_div_id) {
		
		this.div_id = data_div_id;
		
		var tabs_array = new Array();

		var new_tab;

		new_tab = new Array();
		new_tab.push("Sums and Averages");
		new_tab.push('<div id="reports_summaries_tab"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("Time Based");
		new_tab.push('<div id="reports_time_based_tab"></div>');
		tabs_array.push(new_tab);

		var return_html = '';

		return_html += '<div id="reports_accordian"></div>';

		var div_tab = document.getElementById(this.div_id);
		div_tab.innerHTML = return_html;

		//render the accordian
		var task_accordian = new Accordian('reports_accordian', tabs_array);
		task_accordian.Render();

		this.Render_Summaries_Form('reports_summaries_tab');
		this.Render_Time_Based_Form('reports_time_based_tab');
	};
}

