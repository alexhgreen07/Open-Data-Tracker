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
include_once(dirname(__FILE__).'/../../../../external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//jquery datepicker code (addon)
include_once(dirname(__FILE__).'/../../../../external/jquery-ui-timerpicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../../external/json-rpc2php-master/jsonRPC2php.client.js');

?>

/** This is the view task entries form to viewing task entry data.
 * @constructor View_Task_Entries_Form
 */
function View_Task_Entries_Form(){
	
	
	/** @method Refresh_Task_Log_Data
	 * @desc This function will refresh the task log data from the server.
	 * @param {function} refresh_callback The function to call when the refresh is complete.
	 * */
	this.Refresh_Task_Log_Data = function(refresh_callback) {
		var self = this;

		//show the loader image
		$('#' + self.task_log_loading_image.id).show();

		var params = new Array();

		//execute the RPC callback for retrieving the item log
		rpc.Task_Data_Interface.Get_Task_Log(params, function(jsonRpcObj) {

			//RPC complete. Set appropriate HTML.
			var new_html = '';

			new_html += 'Last refreshed: ' + (new Date()) + '<br />';
			
			self.task_log = jsonRpcObj.result.data;
			
			new_html += "<b>Database Output</b><br><table border='1' style='width:100%;'>";
			
			new_html += "<tr><td>Name</td><td>Start Time</td><td>Duration (Hours)</td><td>Status</td><td>Note</td></tr>";
			
			var task_entry_options = '<option value="0">-</option>';
			
			for (var i = 0; i < self.task_log.length; i++) {
			    
			    new_html += '<tr>';
			    
			    new_html += '<td>' + self.task_log[i].name + '</td>';
			    new_html += '<td>' + self.task_log[i].start_time + '</td>';
			    new_html += '<td>' + self.task_log[i].hours + '</td>';
			    new_html += '<td>' + self.task_log[i].status + '</td>';
			    new_html += '<td>' + self.task_log[i].note + '</td>';
			    
			    new_html += '</tr>';
			    
			    task_entry_options += '<option value="' + 
			    	self.task_log[i].task_log_id + '">' +
			    	self.task_log[i].start_time + '</option>';
			    
			}
			
			new_html += '</table>';
			
			document.getElementById(self.new_log_data_display_div.id).innerHTML = new_html;
			document.getElementById(self.edit_task_entry_select.id).innerHTML = task_entry_options;

			//hide the loader image
			$('#' + self.task_log_loading_image.id).hide();

			refresh_callback();

		});
	};
	
	/** @method Refresh_Task_Target_Data
	 * @desc This function will refresh the task log data from the server.
	 * */
	this.On_Click_Event = function() {

		//alert('calling rpc onclick.');

		this.Refresh_Task_Log_Data(function() {
			//empty
		});

	};

	
	/** @method Render
	 * @desc This function renders the view task log form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render = function(form_div_id) {
		var self = this;
		var return_html = '';

		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method', "post");
		this.data_form.setAttribute('id', "task_log_display_form");

		this.task_log_submit_button = document.createElement("input");
		this.task_log_submit_button.setAttribute('type', 'submit');
		this.task_log_submit_button.setAttribute('id', 'task_log_submit_button');
		this.task_log_submit_button.value = 'Refresh';

		this.data_form.appendChild(this.task_log_submit_button);

		this.task_log_loading_image = document.createElement("img");
		this.task_log_loading_image.setAttribute('id', 'task_log_loader_image');
		this.task_log_loading_image.setAttribute('style', 'width:100%;height:19px;');
		this.task_log_loading_image.setAttribute('src', 'ajax-loader.gif');
		this.data_form.appendChild(this.task_log_loading_image);

		this.new_log_data_display_div = document.createElement("div");
		this.new_log_data_display_div.setAttribute('id', 'new_task_log_data_display_div');
		this.data_form.appendChild(this.new_log_data_display_div);

		var div_tab = document.getElementById(form_div_id);

		div_tab.innerHTML = '';

		div_tab.appendChild(this.data_form);

		$('#' + this.task_log_submit_button.id).button();
		$('#' + this.task_log_submit_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.On_Click_Event();
		});
	};
}