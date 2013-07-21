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

/** This is the new item form class which holds all UI objects for entering new items.
 * @constructor New_Item_Form
 */
function New_Item_Form(){
	
	
	/** @method Add_New_Item_Click
	 * @desc This is the event function for the add new item button click.
	 * */
	this.Add_New_Item_Click = function() {
		var self = this;

		//get the value string
		var name_string = $("#" + self.item_name.id).val();
		var note_string = $("#" + self.item_description.id).val();
		var unit_string = $("#" + self.item_new_unit.id).val();

		if (name_string != '') {

			//show the loader image
			$('#' + self.loading_image_add_item.id).show();

			var params = new Array();
			params[0] = name_string;
			params[1] = unit_string;
			params[2] = note_string;

			//execute the RPC callback for retrieving the item log
			rpc.Item_Data_Interface.Insert_New_Item(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.authenticated == 'true') {
					if (jsonRpcObj.result.success == 'true') {
						alert('New item added!');
					} else {
						alert('Item failed to add.');
					}

				} else {
					alert('You are not logged in. Please refresh the page and login again.');
				}

				//hide the loader image
				$('#' + self.loading_image_add_item.id).hide();

				//reset all the fields to default
				$("#" + self.item_name.id).val('');
				$("#" + self.item_description.id).val('');
				$("#" + self.item_new_unit.id).val('');

				//refresh the items
				self.Refresh_Items();
			});

		} else {
			alert('Item name cannot be empty!');
		}

	};
	
	
	/** @method Render
	 * @desc This function will render the add item form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render = function(form_div_id) {
		
		//create the top form
		this.item_add_data_form = document.createElement("form");
		this.item_add_data_form.setAttribute('method', "post");
		this.item_add_data_form.setAttribute('id', "add_item_entry_form");

		this.item_add_data_form.innerHTML += 'Name:<br />';

		//item name
		this.item_name = document.createElement("input");
		this.item_name.setAttribute('name', "item_name");
		this.item_name.setAttribute('id', "item_name");
		this.item_name.setAttribute('type', 'text');
		this.item_add_data_form.appendChild(this.item_name);
		
		this.item_add_data_form.innerHTML += '<br />';
		
		this.item_add_data_form.innerHTML += 'Category:<br />';

		//task recurring
		this.item_category_select = document.createElement("select");
		this.item_category_select.setAttribute('id', 'item_category_select');
		this.item_category_select.innerHTML = '<option>-</option>';
		this.item_add_data_form.appendChild(this.item_category_select);
		
		this.item_add_data_form.innerHTML += '<br />';
		
		this.item_add_data_form.innerHTML += 'Description:<br />';

		//item description
		this.item_description = document.createElement("input");
		this.item_description.setAttribute('name', "item_description");
		this.item_description.setAttribute('id', "item_description");
		this.item_description.setAttribute('type', 'text');
		this.item_add_data_form.appendChild(this.item_description);
		
		this.item_add_data_form.innerHTML += '<br />';
		
		this.item_add_data_form.innerHTML += 'Unit:<br />';

		//item note
		this.item_new_unit = document.createElement("input");
		this.item_new_unit.setAttribute('name', "add_item_unit");
		this.item_new_unit.setAttribute('id', "add_item_unit");
		this.item_new_unit.setAttribute('type', 'text');
		this.item_add_data_form.appendChild(this.item_new_unit);

		this.item_add_data_form.innerHTML += '<br /><br />';

		//task start/stop button creation
		this.item_add_button = document.createElement("input");
		this.item_add_button.setAttribute('id', 'item_add');
		this.item_add_button.setAttribute('type', 'submit');
		this.item_add_button.value = 'Submit';
		var self = this;
		$(this.item_add_button).button();
		$(this.item_add_button).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.Add_New_Item_Click();
		});
		this.item_add_data_form.appendChild(this.item_add_button);

		this.loading_image_add_item = document.createElement("img");
		this.loading_image_add_item.setAttribute('id', 'item_tab_add_item_entry_loader_image');
		this.loading_image_add_item.setAttribute('style', 'width:100%;height:19px;');
		this.loading_image_add_item.setAttribute('src', 'ajax-loader.gif');
		this.item_add_data_form.appendChild(this.loading_image_add_item);

		$(this.loading_image_add_item).hide();

		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.item_add_data_form);
	};
	
	
}