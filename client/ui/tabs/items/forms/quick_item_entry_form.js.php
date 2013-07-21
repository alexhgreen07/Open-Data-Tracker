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

/** This is the quick item entry form class which holds all UI objects for quick item data entry.
 * @constructor Quick_Item_Entry_Form
 */
function Quick_Item_Entry_Form(){
	
	
	/** @method Add_Quick_Item_Entry_Click
	 * @desc This is the event function for the item quick item entry button click.
	 * */
	this.Add_Quick_Item_Entry_Click = function() {

		var self = this;

		//get the value string
		var value_string = $("#" + self.item_value.id).val();
		var item_select_index = $("#" + self.quick_item_name_select.id).prop("selectedIndex");
		var note_string = $("#" + self.item_note.id).val();

		//check that the string is numeric
		if (!isNaN(Number(value_string)) && value_string != '') {

			//show the loader image
			$('#' + self.loading_image.id).show();

			var params = new Array();
			params[0] = value_string;
			params[1] = self.items_list[item_select_index - 1].item_id;
			params[2] = note_string;

			//execute the RPC callback for retrieving the item log
			rpc.Item_Data_Interface.Insert_Quick_Item_Entry(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.authenticated == 'true') {
					if (jsonRpcObj.result.success == 'true') {
						alert('New item entry added!');

						self.Refresh_Item_Data(function() {
							self.refresh_item_log_callback();
						});
					} else {
						alert('Item entry failed to add.');
					}

				} else {
					alert('You are not logged in. Please refresh the page and login again.');
				}

				//hide the loader image
				$('#' + self.loading_image.id).hide();

				//reset all the fields to default
				$("#" + self.item_value.id).val('');
				$("#" + self.quick_item_name_select.id).val('-');
				$("#" + self.item_note.id).val('');

			});
		} else {
			alert('The value field must be numeric.');
		}

	};
	
	
	/** @method Render
	 * @desc This function will render the quick item entry form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render = function(form_div_id) {

		//create the top form
		this.item_quick_entry_data_form = document.createElement("form");
		this.item_quick_entry_data_form.setAttribute('method', "post");
		this.item_quick_entry_data_form.setAttribute('id', "quick_item_entry_form");

		this.item_quick_entry_data_form.innerHTML += 'Value:<br />';

		//item value
		this.item_value = document.createElement("input");
		this.item_value.setAttribute('name', "value");
		this.item_value.setAttribute('id', "value");
		this.item_value.setAttribute('type', 'text');
		this.item_quick_entry_data_form.appendChild(this.item_value);
		
		this.item_quick_entry_data_form.innerHTML += '<br />';

		this.item_quick_entry_data_form.innerHTML += 'Item:<br />';

		//item unit
		this.quick_item_name_select = document.createElement("select");
		this.quick_item_name_select.setAttribute('name', "task_name_dropdown");
		this.quick_item_name_select.setAttribute('id', "task_name_dropdown");
		this.quick_item_name_select.innerHTML = '<option>-</option>';
		this.item_quick_entry_data_form.appendChild(this.quick_item_name_select);

		this.item_quick_entry_data_form.innerHTML += '<br />';

		this.item_quick_entry_data_form.innerHTML += 'Note:<br />';

		//item note
		this.item_note = document.createElement("input");
		this.item_note.setAttribute('name', "notes");
		this.item_note.setAttribute('id', "notes");
		this.item_note.setAttribute('type', 'text');
		this.item_quick_entry_data_form.appendChild(this.item_note);

		this.item_quick_entry_data_form.innerHTML += '<br /><br />';

		//task start/stop button creation
		this.item_add_entry_button = document.createElement("input");
		this.item_add_entry_button.setAttribute('id', 'item_add_entry_button');
		this.item_add_entry_button.setAttribute('type', 'submit');
		this.item_add_entry_button.value = 'Submit';
		var self = this;
		$(this.item_add_entry_button).button();
		$(this.item_add_entry_button).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.Add_Quick_Item_Entry_Click();
		});
		this.item_quick_entry_data_form.appendChild(this.item_add_entry_button);

		this.loading_image = document.createElement("img");
		this.loading_image.setAttribute('id', 'item_tab_quick_item_entry_loader_image');
		this.loading_image.setAttribute('style', 'width:100%;height:19px;');
		this.loading_image.setAttribute('src', 'ajax-loader.gif');
		this.item_quick_entry_data_form.appendChild(this.loading_image);

		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.item_quick_entry_data_form);

	};

	
}