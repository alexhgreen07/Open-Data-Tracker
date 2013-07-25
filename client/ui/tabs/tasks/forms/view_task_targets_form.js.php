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

/** This is the view task targets form to viewing task target data.
 * @constructor View_Task_Targets_Form
 */
function View_Task_Targets_Form(){
	
	
	/** @method Refresh_Task_Target_Data
	 * @desc This function will refresh the task log data from the server.
	 * @param {function} data The function to call when the refresh is complete.
	 * */
	this.Refresh = function(data)
	{
		
		var self = this;

		//RPC complete. Set appropriate HTML.
		var new_html = '';

		new_html += 'Last refreshed: ' + (new Date()) + '<br />';
		
		self.task_targets_log = data.task_targets;
		
		new_html += "<b>Database Output</b><br><table border='1' style='width:100%;'>";
		
		new_html += "<tr><td>Target ID</td><td>Name</td><td>Scheduled Time</td><td>Recuring</td><td>Recurrance Period</td></tr>";
		
		var select_html = '<option value="0">-</option>';
		
		for (var i = 0; i < self.task_targets_log.length; i++) {
		    
		    new_html += '<tr>';
		    
		    new_html += '<td>' + self.task_targets_log[i].task_schedule_id + '</td>';
		    new_html += '<td>' + self.task_targets_log[i].name + '</td>';
		    new_html += '<td>' + self.task_targets_log[i].scheduled_time + '</td>';
		    new_html += '<td>' + self.task_targets_log[i].recurring + '</td>';
		    new_html += '<td>' + self.task_targets_log[i].recurrance_period + '</td>';
		    
		    new_html += '</tr>';
		    
		    select_html += '<option value="'
		    	+ self.task_targets_log[i].task_schedule_id + '">' + 
		    	self.task_targets_log[i].name + 
		    	" (" + self.task_targets_log[i].task_schedule_id + ")</option>";
		    
		}
		
		new_html += '</table>';
		
		document.getElementById(self.view_task_target_data_div.id).innerHTML = new_html;
		document.getElementById(self.task_edit_target_select.id).innerHTML = select_html;
		
	};
	
	/** @method Render
	 * @desc This function renders the view task targets form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render = function(form_div_id)
	{
		var self = this;
		
		
		//create the top form
		this.view_task_target_form = document.createElement("form");
		this.view_task_target_form.setAttribute('method', "post");
		this.view_task_target_form.setAttribute('id', "view_task_target_form");
		
		
		this.view_task_target_form.innerHTML += '<br />';
		
		this.view_task_target_data_div = document.createElement('div');
		this.view_task_target_data_div.id = 'view_task_target_data_div';
		this.view_task_target_form.appendChild(this.view_task_target_data_div);
		
		var div_tab = document.getElementById(form_div_id);

		div_tab.innerHTML = '';
		
		div_tab.appendChild(this.view_task_target_form);
		

	};

	
}