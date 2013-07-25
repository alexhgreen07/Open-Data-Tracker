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
	 * @param {function} data The function to call when the refresh is complete.
	 * */
	this.Refresh = function(data) {
		
		var self = this;
		
		//RPC complete. Set appropriate HTML.
		var new_html = '';

		new_html += 'Last refreshed: ' + (new Date()) + '<br />';
		
		self.task_log = data.task_entries;
		
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

		this.new_log_data_display_div = document.createElement("div");
		this.new_log_data_display_div.setAttribute('id', 'new_task_log_data_display_div');
		this.data_form.appendChild(this.new_log_data_display_div);

		var div_tab = document.getElementById(form_div_id);

		div_tab.innerHTML = '';

		div_tab.appendChild(this.data_form);

	};
}