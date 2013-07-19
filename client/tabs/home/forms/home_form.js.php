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

require_once(dirname(__FILE__).'/../../../accordian.js.php');

?>


/** This is the home form class which holds all UI objects for the homepage form.
 * @constructor Home_Form
 */
function Home_Form(home_div_id) {
	
	
	/** @method Summary_Data_Refresh_Click_Event
	 * @desc This is the summary data refresh button click event handler.
	 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
	 * */
	this.Summary_Data_Refresh_Click_Event = function(refresh_callback) {
		var params = new Array();

		var self = this;

		//show the loader image
		$('#' + self.loading_image.id).show();

		//execute the RPC callback for retrieving the item log
		rpc.Home_Data_Interface.Get_Home_Data_Summary(params, function(jsonRpcObj) {

			var new_inner_html = '';

			new_inner_html += 'Last refreshed: ' + (new Date()) + '<br />';

			new_inner_html += jsonRpcObj.result.html;

			self.new_data_display_div.innerHTML = new_inner_html;

			//hide the loader image
			$('#' + self.loading_image.id).hide();

			refresh_callback();
		});
	};
	
	/** @method Render
	 * @desc This function will render the home data form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render = function(form_div_id) {
		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method', "post");
		this.data_form.setAttribute('id', "home_display_form");

		this.button = document.createElement("input");
		this.button.setAttribute('type', 'submit');
		this.button.setAttribute('id', 'home_submit_button');
		this.button.value = 'Refresh';

		this.data_form.appendChild(this.button);

		this.loading_image = document.createElement("img");
		this.loading_image.setAttribute('id', 'home_tab_refresh_loader_image');
		this.loading_image.setAttribute('style', 'width:100%;height:19px;');
		this.loading_image.setAttribute('src', 'ajax-loader.gif');
		this.data_form.appendChild(this.loading_image);

		this.new_data_display_div = document.createElement("div");
		this.data_form.appendChild(this.new_data_display_div);

		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = '';
		div_tab.appendChild(this.data_form);

		var self = this;
		$('#' + this.button.id).button();
		$('#' + this.button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.Summary_Data_Refresh_Click_Event(function(){});
		});
	};
		
}