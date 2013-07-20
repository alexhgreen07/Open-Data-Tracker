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

/** This is the edit item entry form class which holds all UI objects for editing item data entry.
 * @constructor Edit_Item_Entry_Form
 */
function Edit_Item_Entry_Form(){
	
	
	/** @method Edit_Item_Entry_Click
	 * @desc This is the event function for the edit item entry button click.
	 * */
	this.Edit_Item_Entry_Click = function()
	{
		var self = this;
		
		var item_entry_id = document.getElementById(self.edit_item_entry_select.id).value;
		var selected_index = document.getElementById(self.edit_item_entry_select.id).selectedIndex;
		var item_select_index = document.getElementById(self.edit_item_name_select.id).selectedIndex;
		
		
		if(item_entry_id != 0)
		{
			
			var selected_item_entry = self.item_log_data[selected_index - 1];
			
			var params = new Array();
			params.push(item_entry_id);
			params.push(document.getElementById(self.item_edit_time.id).value);
			params.push(document.getElementById(self.item_edit_value.id).value);
			params.push(self.items_list[item_select_index - 1].item_id);
			params.push(document.getElementById(self.item_edit_note.id).value);
			
			//execute the RPC callback for retrieving the item log
			rpc.Item_Data_Interface.Update_Item_Entry(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.authenticated == 'true') {
					if (jsonRpcObj.result.success == 'true') {
						//alert(jsonRpcObj.result.debug);
						alert('Item entry updated!');

						self.Refresh_Item_Data(function() {
							self.refresh_item_log_callback();
						});
					} else {
						alert('Item entry failed to update.');
						//alert(jsonRpcObj.result.debug);
					}

				} else {
					alert('You are not logged in. Please refresh the page and login again.');
				}

			});
		
		}
		else
		{
			alert('Select a valid item entry.');
		}
		
	};
	
	/** @method Delete_Item_Entry_Click
	 * @desc This is the event function for the delete item entry button click.
	 * */
	this.Delete_Item_Entry_Click = function()
	{
		var self = this;
		
		var value = document.getElementById(self.edit_item_entry_select.id).value;
		
		if(value != 0)
		{
			
			var r=confirm("Are you sure you want to delete this item entry?");
			
			if (r==true)
			{
				var params = new Array();
				params[0] = value;
				
				rpc.Item_Data_Interface.Delete_Item_Entry(params, function(jsonRpcObj) {
				
					if(jsonRpcObj.result.success == 'true'){
						
						alert('Index deleted: ' + value);
						
						self.Refresh_Items(function(){});
						
					}
					else
					{
						alert('Failed to delete the entry.');
					}
				
				});
			}
			else
			{
				//do nothing, operation cancelled.
			}
			
			
		
		}
		else
		{
			alert('Select a valid item entry.');
		}
	};
	
	/** @method Item_Entry_Select_Change
	 * @desc This is the event function for the item entry HTML select index change.
	 * */
	this.Item_Entry_Select_Change = function()
	{
		var self = this;
		
		//alert('Select item entry changed!');
		
		var selected_index = document.getElementById(self.edit_item_entry_select.id).selectedIndex;
		
		if(selected_index != 0)
		{
			var selected_item_entry = self.item_log_data[selected_index - 1];
			
			document.getElementById(self.item_edit_time.id).value = selected_item_entry.time;
			document.getElementById(self.item_edit_value.id).value = selected_item_entry.value;
			document.getElementById(self.edit_item_name_select.id).value = selected_item_entry.name;
			document.getElementById(self.item_edit_note.id).value = selected_item_entry.note;
		}
		else
		{
			document.getElementById(self.item_edit_time.id).value = '';
			document.getElementById(self.item_edit_value.id).value = '0';
			document.getElementById(self.edit_item_name_select.id).value = '-';
			document.getElementById(self.item_edit_note.id).value = '';
		}
		
	};
	
	
	/** @method Render
	 * @desc This function will render the edit item entry form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render = function(form_div_id) {

		//create the top form
		this.item_edit_entry_data_form = document.createElement("form");
		this.item_edit_entry_data_form.setAttribute('method', "post");
		this.item_edit_entry_data_form.setAttribute('id', "edit_item_entry_form");

		this.item_edit_entry_data_form.innerHTML += 'Item Entries:<br />';

		//item unit
		this.edit_item_entry_select = document.createElement("select");
		this.edit_item_entry_select.setAttribute('name', "edit_task_entry_dropdown");
		this.edit_item_entry_select.setAttribute('id', "edit_task_entry_dropdown");
		this.edit_item_entry_select.innerHTML = '<option>-</option>';
		this.item_edit_entry_data_form.appendChild(this.edit_item_entry_select);
		
		this.item_edit_entry_data_form.innerHTML += '<br /><br />';
		
		this.item_edit_entry_data_form.innerHTML += 'Time:<br />';

		//item value
		this.item_edit_time = document.createElement("input");
		this.item_edit_time.setAttribute('name', "edit_time");
		this.item_edit_time.setAttribute('id', "edit_time");
		this.item_edit_time.setAttribute('type', 'text');
		this.item_edit_entry_data_form.appendChild(this.item_edit_time);
		
		this.item_edit_entry_data_form.innerHTML += '<br />';
		
		this.item_edit_entry_data_form.innerHTML += 'Value:<br />';

		//item value
		this.item_edit_value = document.createElement("input");
		this.item_edit_value.setAttribute('name', "edit_value");
		this.item_edit_value.setAttribute('id', "edit_value");
		this.item_edit_value.setAttribute('type', 'text');
		this.item_edit_entry_data_form.appendChild(this.item_edit_value);
		
		this.item_edit_entry_data_form.innerHTML += '<br />';
		
		this.item_edit_entry_data_form.innerHTML += 'Item:<br />';

		//item unit
		this.edit_item_name_select = document.createElement("select");
		this.edit_item_name_select.setAttribute('name', "edit_task_name_dropdown");
		this.edit_item_name_select.setAttribute('id', "edit_task_name_dropdown");
		this.edit_item_name_select.innerHTML = '<option>-</option>';
		this.item_edit_entry_data_form.appendChild(this.edit_item_name_select);
		
		this.item_edit_entry_data_form.innerHTML += '<br />';
		
		this.item_edit_entry_data_form.innerHTML += 'Note:<br />';

		//item note
		this.item_edit_note = document.createElement("input");
		this.item_edit_note.setAttribute('name', "edit_notes");
		this.item_edit_note.setAttribute('id', "edit_notes");
		this.item_edit_note.setAttribute('type', 'text');
		this.item_edit_entry_data_form.appendChild(this.item_edit_note);

		this.item_edit_entry_data_form.innerHTML += '<br /><br />';

		//item submit button creation
		this.item_edit_add_entry_button = document.createElement("input");
		this.item_edit_add_entry_button.setAttribute('id', 'edit_task_entry_submit');
		this.item_edit_add_entry_button.setAttribute('type', 'submit');
		this.item_edit_add_entry_button.value = 'Submit';
		var self = this;
		this.item_edit_entry_data_form.appendChild(this.item_edit_add_entry_button);

		this.item_edit_entry_data_form.innerHTML += '<br /><br />';

		//item delete button creation
		this.item_edit_delete_entry_button = document.createElement("input");
		this.item_edit_delete_entry_button.setAttribute('id', 'item_edit_delete_entry_button');
		this.item_edit_delete_entry_button.setAttribute('type', 'submit');
		this.item_edit_delete_entry_button.value = 'Delete';
		var self = this;
		this.item_edit_entry_data_form.appendChild(this.item_edit_delete_entry_button);


		this.new_loading_image = document.createElement("img");
		this.new_loading_image.setAttribute('id', 'item_tab_edit_item_entry_loader_image');
		this.new_loading_image.setAttribute('style', 'width:100%;height:19px;');
		this.new_loading_image.setAttribute('src', 'ajax-loader.gif');
		this.item_edit_entry_data_form.appendChild(this.new_loading_image);

		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.item_edit_entry_data_form);

		//hide the loader image
		$('#' + self.new_loading_image.id).hide();

		$('#' + this.item_edit_add_entry_button.id).button();
		$('#' + this.item_edit_add_entry_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			
			//execute the click event
			self.Edit_Item_Entry_Click();
		});
		
		$('#' + this.item_edit_delete_entry_button.id).button();
		$('#' + this.item_edit_delete_entry_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();
			
			
			//execute the click event
			self.Delete_Item_Entry_Click();
		});
		
		$('#' + self.edit_item_entry_select.id).change(function() {
			
			self.Item_Entry_Select_Change();
			

		});
		
		//initialize the datetime picker
		$('#' + this.item_edit_time.id).datetimepicker({
			timeFormat : "HH:mm",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.item_edit_time.id).datetimepicker("setDate", new Date());
		$('#' + this.item_edit_time.id).datetimepicker("setDate", new Date());
		
	};
	
}