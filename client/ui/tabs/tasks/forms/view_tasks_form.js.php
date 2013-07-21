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

/** This is the view task form to viewing task data.
 * @constructor View_Tasks_Form
 */
function View_Tasks_Form(){
	
	
	/** @method Refresh_Tasks
	 * @desc This function refreshes all the tasks from the server.
	 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
	 * */
	this.Refresh_Tasks = function(refresh_callback) {
		var params = new Array();

		var self = this;

		//show the loader image
		$('#' + self.loading_image_view.id).show();

		//execute the RPC callback for retrieving the item log
		rpc.Task_Data_Interface.Get_Tasks(params, function(jsonRpcObj) {

			var new_inner_html = '';

			new_inner_html += 'Last refreshed: ' + (new Date()) + '<br />';
			//new_inner_html += jsonRpcObj.result.html;
			
			self.task_list = jsonRpcObj.result.data;
			
			new_inner_html += "<b>Database Output</b><br><table border='1' style='width:100%;'>";
			new_inner_html += "<tr><td>Name</td><td>Description</td><td>Estimated Time (Hours)</td></tr>";
			
			for (var i = 0; i < self.task_list.length; i++) {
			    
			    new_inner_html += '<tr>';
			    
			    new_inner_html += '<td>' + self.task_list[i].name + '</td>';
			    new_inner_html += '<td>' + self.task_list[i].description + '</td>';
			    new_inner_html += '<td>' + self.task_list[i].estimated_time + '</td>';
			    
			    new_inner_html += '</tr>';
			    
			}
			
			new_inner_html += '</table>';
			
			document.getElementById(self.new_data_display_div.id).innerHTML = new_inner_html;

			//hide the loader image
			$('#' + self.loading_image_view.id).hide();

			self.Refresh_Task_Log_Data(function() {
				
				self.Refresh_Task_Target_Data(function(){
					
					refresh_callback();
					
				})
				
			});

		});
	};
	
	
	/** @method On_View_Task_Refresh_Click_Event
	 * @desc This function is the task entry view refresh button click event handler.
	 * */
	this.On_View_Task_Refresh_Click_Event = function() {
		this.Refresh_Tasks(function() {
		});
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

		this.view_tasks_refresh_button = document.createElement("input");
		this.view_tasks_refresh_button.setAttribute('type', 'submit');
		this.view_tasks_refresh_button.setAttribute('id', 'view_tasks_refresh_button');
		this.view_tasks_refresh_button.value = 'Refresh';

		var self = this;

		this.data_form_view_tasks.appendChild(this.view_tasks_refresh_button);

		this.loading_image_view = document.createElement("img");
		this.loading_image_view.setAttribute('id', 'task_tab_task_view_loader_image');
		this.loading_image_view.setAttribute('style', 'width:100%;height:19px;');
		this.loading_image_view.setAttribute('src', 'ajax-loader.gif');
		this.data_form_view_tasks.appendChild(this.loading_image_view);

		this.new_data_display_div = document.createElement("div");
		this.new_data_display_div.id = 'new_task_view_data_display_div';
		this.data_form_view_tasks.appendChild(this.new_data_display_div);

		var div_tab = document.getElementById(form_div_id);

		div_tab.innerHTML = '';

		div_tab.appendChild(this.data_form_view_tasks);

		$('#' + this.view_tasks_refresh_button.id).button();
		$('#' + this.view_tasks_refresh_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.On_View_Task_Refresh_Click_Event();
		});


	};

	
}