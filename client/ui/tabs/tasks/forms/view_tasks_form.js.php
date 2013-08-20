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
include_once(dirname(__FILE__).'/../../../../../externals/jquery-ui/ui/jquery.ui.core.js');

//jquery datepicker code (addon)
include_once(dirname(__FILE__).'/../../../../../externals/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../../../externals/json-rpc2php/jsonRPC2php.client.js');

?>

/** This is the view task form to viewing task data.
 * @constructor View_Tasks_Form
 */
function View_Tasks_Form(){
	
	
	/** @method Refresh
	 * @desc This function refreshes all the tasks from the server.
	 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
	 * */
	this.Refresh = function(data) {
		var params = new Array();

		var self = this;


		var new_inner_html = '';

		new_inner_html += 'Last refreshed: ' + (new Date()) + '<br />';
		//new_inner_html += jsonRpcObj.result.html;
		
		self.task_list = data.tasks;
		
		new_inner_html += "<b>Database Output</b><br><table border='1' style='width:100%;'>";
		new_inner_html += "<tr><td>Name</td><td>Description</td><td>Estimated Time (Hours)</td><td>Status</td></tr>";
		
		for (var i = 0; i < self.task_list.length; i++) {
		    
		    new_inner_html += '<tr>';
		    
		    new_inner_html += '<td>' + self.task_list[i].name + '</td>';
		    new_inner_html += '<td>' + self.task_list[i].description + '</td>';
		    new_inner_html += '<td>' + self.task_list[i].estimated_time + '</td>';
		    new_inner_html += '<td>' + self.task_list[i].status + '</td>';
		    
		    new_inner_html += '</tr>';
		    
		}
		
		new_inner_html += '</table>';
		
		document.getElementById(self.new_data_display_div.id).innerHTML = new_inner_html;

	};
	
	
	/** @method Render
	 * @desc This function renders the view tasks form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render = function(form_div_id) {

		var return_html = '';

		this.data_form_view_tasks = document.createElement("form");
		this.data_form_view_tasks.setAttribute('method', "post");
		this.data_form_view_tasks.setAttribute('id', "data_display_form");

		var self = this;

		this.new_data_display_div = document.createElement("div");
		this.new_data_display_div.id = 'new_task_view_data_display_div';
		this.data_form_view_tasks.appendChild(this.new_data_display_div);

		var div_tab = document.getElementById(form_div_id);

		div_tab.innerHTML = '';

		div_tab.appendChild(this.data_form_view_tasks);



	};

	
}