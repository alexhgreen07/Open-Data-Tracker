<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../../../external/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../../../external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../../external/json-rpc2php-master/jsonRPC2php.client.js');

?>

/** This is the view category form class which holds all UI objects for the category view.
 * @constructor View_Category_Form
 */
function View_Category_Form(){
	
	/** @method Category_Data_Refresh_Click_Event
	 * @desc This is the category data refresh button click event handler.
	 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
	 * */
	this.Category_Data_Refresh_Click_Event = function(refresh_callback) {
		
		var params = new Array();

		var self = this;


		//execute the RPC callback for retrieving the item log
		rpc.Home_Data_Interface.Get_Categories(params, function(jsonRpcObj) {
			
			if(jsonRpcObj.result.authenticated)
			{
				if(jsonRpcObj.result.success)
				{
					var new_inner_html = '';
					var select_html = '';
		
					new_inner_html += 'Last refreshed: ' + (new Date()) + '<br />';
					
					new_inner_html += '<table border="1" style="width:100%;">';
					new_inner_html += '<tr><td>Name</td><td>Description</td><td>Category Path</td></tr>';
					
					select_html += '<option value="0">-</option>';
					
					
					for (var i=0; i < jsonRpcObj.result.data.length; i++) {
						
		
						var current_row = jsonRpcObj.result.data[i];
		
						new_inner_html += '<tr>';
						new_inner_html += '<td>';
						new_inner_html += current_row.name;
						new_inner_html += '</td>';
						new_inner_html += '<td>';
						new_inner_html += current_row.description;
						new_inner_html += '</td>';
						new_inner_html += '<td>';
		
						if (current_row.category_path) {
							new_inner_html += current_row.category_path;
						}
		
						new_inner_html += '</td>';
						new_inner_html += '</tr>';
		
						select_html += '<option value="' + current_row.category_id + '">' + current_row.category_path + '</option>';
				
					  
					};
					
					
					self.categories_list = jsonRpcObj.result.data;
					
					new_inner_html += '</table>';
					
					
					document.getElementById(self.category_data_div.id).innerHTML = new_inner_html;
					//TODO: Find a way to transfer category data between modules.
					//document.getElementById(self.add_new_category_parent_select.id).innerHTML = select_html;
					//document.getElementById(self.edit_category_form.edit_category_select.id).innerHTML = select_html;
					//document.getElementById(self.edit_category_form.edit_category_parent_select.id).innerHTML = select_html;
				}
				else
				{
					alert('Refresh failed.');
				}
				
			}
			else
			{
				alert('Not authenticated. Refresh failed.');
			}
			
			
			
			
			refresh_callback();
		});
			
		
	};
	
	/** @method Render
	 * @desc This function will render the view category tab in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render = function(form_div_id) {

		var self = this;
		
		this.view_category_form = document.createElement("form");
		this.view_category_form.setAttribute('method', "post");
		this.view_category_form.setAttribute('id', "home_view_category_form");
		
		this.refresh_category_data_button = document.createElement("input");
		this.refresh_category_data_button.setAttribute('type', "submit");
		this.refresh_category_data_button.setAttribute('id', "refresh_category_data_button");
		this.refresh_category_data_button.value = "Refresh";
		this.view_category_form.appendChild(this.refresh_category_data_button);
		
		this.category_data_div = document.createElement("div");
		this.category_data_div.setAttribute('id', "category_data_div");
		this.view_category_form.appendChild(this.category_data_div);
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.view_category_form);
		
		$('#' + this.refresh_category_data_button.id).button();
		$('#' + this.refresh_category_data_button.id).click(function(event){
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			self.Category_Data_Refresh_Click_Event(function(){});
		});
	};
	
}
