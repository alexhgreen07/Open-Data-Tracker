<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../../external/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../../external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../external/json-rpc2php-master/jsonRPC2php.client.js');

require_once(dirname(__FILE__).'/../../accordian.js.php');

?>

/** This is the report tab object which holds all UI objects for detailed data interaction.
 * @constructor Report_Tab
 */
function Report_Tab() {

	//class variables
	this.div_id = null;

	this.Refresh_Summary_Data = function(refresh_callback) {
		var params = new Array();

		var self = this;

		//show the loader image
		$('#' + self.report_summaries_loading_image.id).show();
		
		/*
		//execute the RPC callback for retrieving the item log
		rpc.Report_Data_Interface.Get_Report_Summary_Data(params, function(jsonRpcObj) {

			var new_inner_html = '';

			new_inner_html += 'Last refreshed: ' + (new Date()) + '<br />';

			new_inner_html += jsonRpcObj.result.html;

			var summary_div = document.getElementById(self.report_summaries_data_display_div.id);
			summary_div.innerHTML = new_inner_html;

			//hide the loader image
			$('#' + self.report_summaries_loading_image.id).hide();

			refresh_callback();

		});
		*/
	};

	this.Refresh = function(refresh_callback) {
		var self = this;

		self.Refresh_Summary_Data(function() {
			refresh_callback();
		});
	};

	this.On_Summaries_Refresh_Click = function() {
		this.Refresh_Summary_Data(function() {
			//empty
		});
	};

	this.On_Time_Based_Refresh_Click = function() {

	};

	this.Render_Summaries_Form = function(form_div_id) {

		var self = this;

		this.report_summaries_data_form = document.createElement("form");
		this.report_summaries_data_form.setAttribute('method', "post");
		this.report_summaries_data_form.setAttribute('id', "report_summaries_display_form");

		this.report_summaries_refresh_button = document.createElement("input");
		this.report_summaries_refresh_button.setAttribute('type', 'submit');
		this.report_summaries_refresh_button.setAttribute('id', 'report_summaries_submit_button');
		this.report_summaries_refresh_button.value = 'Refresh';

		$(this.report_summaries_refresh_button).button();
		$(this.report_summaries_refresh_button).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.On_Summaries_Refresh_Click();
		});

		this.report_summaries_data_form.appendChild(this.report_summaries_refresh_button);

		this.report_summaries_loading_image = document.createElement("img");
		this.report_summaries_loading_image.setAttribute('id', 'report_summaries_tab_refresh_loader_image');
		this.report_summaries_loading_image.setAttribute('style', 'width:100%;height:19px;');
		this.report_summaries_loading_image.setAttribute('src', 'ajax-loader.gif');
		this.report_summaries_data_form.appendChild(this.report_summaries_loading_image);

		this.report_summaries_data_display_div = document.createElement("div");
		this.report_summaries_data_display_div.setAttribute('id', 'report_summaries_data_display_div');
		this.report_summaries_data_form.appendChild(this.report_summaries_data_display_div);

		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = '';
		div_tab.appendChild(this.report_summaries_data_form);

		$('#' + this.report_summaries_loading_image.id).hide();

		this.On_Summaries_Refresh_Click();
	};

	this.Render_Time_Based_Form = function(form_div_id) {

		var self = this;

		this.report_time_based_data_form = document.createElement("form");
		this.report_time_based_data_form.setAttribute('method', "post");
		this.report_time_based_data_form.setAttribute('id', "report_time_based_display_form");

		this.time_based_button = document.createElement("input");
		this.time_based_button.setAttribute('type', 'submit');
		this.time_based_button.setAttribute('id', 'report_time_based_submit_button');
		this.time_based_button.value = 'Refresh';

		$(this.time_based_button).button();
		$(this.time_based_button).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.On_Time_Based_Refresh_Click();
		});

		this.report_time_based_data_form.appendChild(this.time_based_button);

		this.time_based_loading_image = document.createElement("img");
		this.time_based_loading_image.setAttribute('id', 'report_time_based_tab_refresh_loader_image');
		this.time_based_loading_image.setAttribute('style', 'width:100%;height:19px;');
		this.time_based_loading_image.setAttribute('src', 'ajax-loader.gif');
		this.report_time_based_data_form.appendChild(this.time_based_loading_image);

		this.report_time_based_data_display_div = document.createElement("div");
		this.report_time_based_data_form.appendChild(this.report_time_based_data_display_div);

		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = '';
		div_tab.appendChild(this.report_time_based_data_form);

		$('#' + this.time_based_loading_image.id).hide();
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

