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

//jquery datepicker code (addon)
include_once(dirname(__FILE__).'/../../../external/jquery-ui-timerpicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../external/json-rpc2php-master/jsonRPC2php.client.js');

//get accordian
require_once(dirname(__FILE__).'/../../accordian.js.php');

//get quick item entry form
require_once(dirname(__FILE__).'/forms/quick_item_entry_form.js.php');

//get new item entry form
require_once(dirname(__FILE__).'/forms/new_item_entry_form.js.php');

?>

/** This is the item tab class which holds all UI objects for item data.
 * @constructor Item_Tab
 */
function Item_Tab(item_div_id) {

	/** This is the parent div ID where the item tab is.
	 * @type String
	 * */
	this.div_id = item_div_id;
	/** This is the array for the item log.
	 * @type Array
	 * */
	this.item_log_data = Array();
	
	/** This is the quick item entry form object.
	 * @type Quick_Item_Entry_Form
	 * */
	this.quick_item_entry_form = new Quick_Item_Entry_Form();
	
	/** This is the new item entry form object.
	 * @type New_Item_Entry_Form
	 * */
	this.new_item_entry_form = new New_Item_Entry_Form();
	
	/** @method Refresh_Items
	 * @desc This function retrieves the item list from the database.
	 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
	 * */
	this.Refresh_Items = function(refresh_callback) {
		var params = new Array();

		var self = this;

		//show the loader image
		$('#' + self.loading_image.id).show();

		//execute the RPC callback for retrieving the item log
		rpc.Item_Data_Interface.Get_Items(params, function(jsonRpcObj) {

			if (jsonRpcObj.result.authenticated == 'true') {
				if (jsonRpcObj.result.success == 'true') {
					self.items_list = jsonRpcObj.result.items;

					self.Refresh_Item_Entry_List();

					self.Refresh_Item_View();

					self.Refresh_Item_Data(function() {
						refresh_callback();
					});

				} else {
					alert('Items failed to refresh.');
				}

			} else {
				alert('You are not logged in. Please refresh the page and login again.');
			}

			//hide the loader image
			$('#' + self.loading_image.id).hide();

		});

	};
	
	/** @method Refresh_Item_Entry_List
	 * @desc This function refreshes the items HTML select objects.
	 * */
	this.Refresh_Item_Entry_List = function() {
		var self = this;
		var new_inner_html = '';

		new_inner_html += '<option>-</option>';

		for (var i = 0; i < self.items_list.length; i++) {
			new_inner_html += '<option>' + self.items_list[i].item_name + '</option>';
		}

		document.getElementById(self.quick_item_name_select.id).innerHTML = new_inner_html;
		document.getElementById(self.new_item_name_select.id).innerHTML = new_inner_html;
		document.getElementById(self.item_edit_select.id).innerHTML = new_inner_html;
		document.getElementById(self.edit_item_name_select.id).innerHTML = new_inner_html;

	};

	/** @method Refresh_Item_View
	 * @desc This function refreshes the item display pane table.
	 * */
	this.Refresh_Item_View = function() {
		var new_inner_html = '';

		new_inner_html += '<table width="100%" border="1">';

		new_inner_html += '<tr>';
		new_inner_html += '<td>Name</td>';
		new_inner_html += '<td>Description</td>';
		new_inner_html += '<td>Unit</td>';
		new_inner_html += '<td>Date Created</td>';
		new_inner_html += '</tr>';

		for (var i = 0; i < this.items_list.length; i++) {

			new_inner_html += '<tr>';

			new_inner_html += '<td>' + this.items_list[i].item_name + '</td>';
			new_inner_html += '<td>' + this.items_list[i].item_description + '</td>';
			new_inner_html += '<td>' + this.items_list[i].item_unit + '</td>';
			new_inner_html += '<td>' + this.items_list[i].date_created + '</td>';

			new_inner_html += '</tr>';
		}

		new_inner_html += '</table>';

		this.item_display_div.innerHTML = new_inner_html;
	};

	/** @method Refresh_Item_Data
	 * @desc This function refreshes the item display pane table.
	 * @param {function} refresh_callback The function to call after the data has refreshed successfully.
	 * */
	this.Refresh_Item_Data = function(refresh_callback) {
		var self = this;

		//show the loader image
		$('#' + self.item_log_loading_image.id).show();

		var params = new Array();

		//execute the RPC callback for retrieving the item log
		rpc.Item_Data_Interface.Get_Item_Log(params, function(jsonRpcObj) {
			
			self.item_log_data = jsonRpcObj.result.data;
			
			var new_html = '';
			new_html += 'Last refreshed: ' + (new Date()) + '<br />';
			new_html += "<b>Database Output</b><br><table border='1' style='width:100%;'>";
			new_html += "<tr><td>Date</td><td>Name</td><td>Value</td><td>Unit</td><td>Note</td></tr>";
			
			var entries_options_list = '<option value="0">-</option>';
			
			for (var i = 0; i < self.item_log_data.length; i++) {
			    
			    new_html += '<tr>';
			    
			    new_html += '<td>' + self.item_log_data[i].time + '</td>';
			    new_html += '<td>' + self.item_log_data[i].name + '</td>';
			    new_html += '<td>' + self.item_log_data[i].value + '</td>';
			    new_html += '<td>' + self.item_log_data[i].unit + '</td>';
			    new_html += '<td>' + self.item_log_data[i].note + '</td>';
			    
			    new_html += '</tr>';
			    
			    entries_options_list += '<option value="' + 
			   		self.item_log_data[i].item_log_id + 
			   		'">' + self.item_log_data[i].time + '</option>';
			}
			
			new_html += '</table>';
			
			document.getElementById(self.new_data_display_div.id).innerHTML = new_html;
			
			document.getElementById(self.edit_item_entry_select.id).innerHTML = entries_options_list;
			
			//hide the loader image
			$('#' + self.item_log_loading_image.id).hide();
			
			refresh_callback();
		});
	};
	
	/** @method Item_Data_Refresh_Click
	 * @desc This is the event function for the item data refresh button click event.
	 * */
	this.Item_Data_Refresh_Click = function() {

		//alert('calling rpc onclick.');

		this.Refresh_Item_Data();

	};
	
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
	
	/** @method Delete_Item_Click
	 * @desc This is the event function for the delete item button click.
	 * */
	this.Delete_Item_Click = function()
	{
		
		var self = this;
		
		var selected_index = document.getElementById(self.item_edit_select.id).selectedIndex;
		
		if(selected_index != 0)
		{
			var r=confirm("Are you sure you want to delete this item?");
			
			if (r==true)
			{
				var value = self.items_list[selected_index - 1].item_id;
			
				var params = new Array();
				params[0] = value;
				
				rpc.Item_Data_Interface.Delete_Item(params, function(jsonRpcObj) {
				
					if(jsonRpcObj.result.success == 'true'){
						
						alert('Item deleted: ' + value);
						
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
			alert('Select a valid item.');
		}
		
	};
	
	/** @method Edit_Item_Click
	 * @desc This is the event function for the edit item button click.
	 * */
	this.Edit_Item_Click = function()
	{
		var self = this;
		
		var selected_index = document.getElementById(self.item_edit_select.id).selectedIndex;
		
		if(selected_index != 0)
		{
			var selected_item = self.items_list[selected_index - 1];
			
			var params = new Array();
			params[0] = selected_item.item_id;
			params[1] = document.getElementById(self.edit_item_name.id).value;
			params[2] = document.getElementById(self.edit_item_unit.id).value;
			params[3] = document.getElementById(self.item_edit_description.id).value;
			
			rpc.Item_Data_Interface.Edit_Item(params, function(jsonRpcObj) {
			
				if(jsonRpcObj.result.success == 'true'){
					
					alert('Item successfully edited.');
					
					self.Refresh_Items(function(){});
					
				}
				else
				{
					alert('Failed to edit the item.');
				}
			
			});
			
		
		}
		else
		{
			alert('Select a valid item.');
		}
			
	};
	
	/** @method Item_Select_Change
	 * @desc This is the event function for the item HTML select index change.
	 * */
	this.Item_Select_Change = function()
	{
		var self = this;
		
		//alert('Select item entry changed!');
		
		var selected_index = document.getElementById(self.item_edit_select.id).selectedIndex;
		
		if(selected_index != 0)
		{
			var selected_item = self.items_list[selected_index - 1];
			
			document.getElementById(self.edit_item_name.id).value = selected_item.item_name;
			document.getElementById(self.item_edit_description.id).value = selected_item.item_description;
			document.getElementById(self.edit_item_unit.id).value = selected_item.item_unit;
		}
		else
		{
			document.getElementById(self.edit_item_name.id).value = '';
			document.getElementById(self.item_edit_description.id).value = '';
			document.getElementById(self.edit_item_unit.id).value = '';
		}
		
	};
	
	/** @method Render_Edit_Item_Entry_Form
	 * @desc This function will render the edit item entry form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render_Edit_Item_Entry_Form = function(form_div_id) {

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

	/** @method Render_View_Items_Form
	 * @desc This function will render the view item entries form in the specified div.
	 * @param {String} div_id The div ID to render the form in.
	 * */
	this.Render_View_Items_Form = function(div_id) {

		//create the top form
		this.item_display_div = document.getElementById(div_id);

		//unknown if this will work...
		//this.Refresh_Item_View();

	};

	/** @method Render_Add_Item_Form
	 * @desc This function will render the add item form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render_Add_Item_Form = function(form_div_id) {
		
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
	
	/** @method Render_Edit_Item_Form
	 * @desc This function will render the edit item form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render_Edit_Item_Form = function(form_div_id) {
		
		//create the top form
		this.item_edit_data_form = document.createElement("form");
		this.item_edit_data_form.setAttribute('method', "post");
		this.item_edit_data_form.setAttribute('id', "edit_item_entry_form");
		
		this.item_edit_data_form.innerHTML += 'Item:<br />';

		//task recurring
		this.item_edit_select = document.createElement("select");
		this.item_edit_select.setAttribute('id', 'item_edit_select');
		this.item_edit_select.innerHTML = '<option>-</option>';
		this.item_edit_data_form.appendChild(this.item_edit_select);
		
		this.item_edit_data_form.innerHTML += '<br /><br />';
		
		this.item_edit_data_form.innerHTML += 'Name:<br />';

		//item name
		this.edit_item_name = document.createElement("input");
		this.edit_item_name.setAttribute('name', "edit_item_name");
		this.edit_item_name.setAttribute('id', "edit_item_name");
		this.edit_item_name.setAttribute('type', 'text');
		this.item_edit_data_form.appendChild(this.edit_item_name);
		
		this.item_edit_data_form.innerHTML += '<br />';
		
		this.item_edit_data_form.innerHTML += 'Category:<br />';

		//task recurring
		this.item_edit_category_select = document.createElement("select");
		this.item_edit_category_select.setAttribute('id', 'item_edit_category_select');
		this.item_edit_category_select.innerHTML = '<option>-</option>';
		this.item_edit_data_form.appendChild(this.item_edit_category_select);
		
		this.item_edit_data_form.innerHTML += '<br />';
		
		this.item_edit_data_form.innerHTML += 'Description:<br />';

		//item description
		this.item_edit_description = document.createElement("input");
		this.item_edit_description.setAttribute('name', "item_edit_description");
		this.item_edit_description.setAttribute('id', "item_edit_description");
		this.item_edit_description.setAttribute('type', 'text');
		this.item_edit_data_form.appendChild(this.item_edit_description);
		
		this.item_edit_data_form.innerHTML += '<br />';
		
		this.item_edit_data_form.innerHTML += 'Unit:<br />';

		//item note
		this.edit_item_unit = document.createElement("input");
		this.edit_item_unit.setAttribute('name', "edit_item_unit");
		this.edit_item_unit.setAttribute('id', "edit_item_unit");
		this.edit_item_unit.setAttribute('type', 'text');
		this.item_edit_data_form.appendChild(this.edit_item_unit);

		this.item_edit_data_form.innerHTML += '<br /><br />';

		//item submit button creation
		this.item_edit_submit_button = document.createElement("input");
		this.item_edit_submit_button.setAttribute('id', 'item_edit_submit_button');
		this.item_edit_submit_button.setAttribute('type', 'submit');
		this.item_edit_submit_button.value = 'Submit';
		var self = this;

		this.item_edit_data_form.appendChild(this.item_edit_submit_button);
		
		this.item_edit_data_form.innerHTML += '<br /><br />';
		
		//item delete button creation
		this.item_edit_delete_button = document.createElement("input");
		this.item_edit_delete_button.setAttribute('id', 'item_edit_delete_button');
		this.item_edit_delete_button.setAttribute('type', 'submit');
		this.item_edit_delete_button.value = 'Delete';
		
		this.item_edit_data_form.appendChild(this.item_edit_delete_button);

		this.loading_image_edit_item = document.createElement("img");
		this.loading_image_edit_item.setAttribute('id', 'item_tab_edit_item_entry_loader_image');
		this.loading_image_edit_item.setAttribute('style', 'width:100%;height:19px;');
		this.loading_image_edit_item.setAttribute('src', 'ajax-loader.gif');
		this.item_edit_data_form.appendChild(this.loading_image_edit_item);

		$(this.loading_image_edit_item).hide();

		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.item_edit_data_form);
		
		$('#' + this.item_edit_submit_button.id).button();
		$('#' + this.item_edit_submit_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();
			
			
			//execute the click event
			self.Edit_Item_Click();
		});
		
		$('#' + this.item_edit_delete_button.id).button();
		$('#' + this.item_edit_delete_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();
			
			
			//execute the click event
			self.Delete_Item_Click();
		});
		
		$('#' + self.item_edit_select.id).change(function() {
			
			self.Item_Select_Change();
			

		});
	};

	/** @method Render_Item_Log
	 * @desc This function will render the item log in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render_Item_Log = function(form_div_id) {
		var self = this;
		var return_html = '';

		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method', "post");
		this.data_form.setAttribute('id', "data_display_form");

		this.button = document.createElement("input");
		this.button.setAttribute('type', 'submit');
		this.button.setAttribute('id', 'data_submit_button');
		this.button.value = 'Refresh';

		this.data_form.appendChild(this.button);

		this.item_log_loading_image = document.createElement("img");
		this.item_log_loading_image.setAttribute('id', 'item_log_loader_image');
		this.item_log_loading_image.setAttribute('style', 'width:100%;height:19px;');
		this.item_log_loading_image.setAttribute('src', 'ajax-loader.gif');
		this.data_form.appendChild(this.item_log_loading_image);

		this.new_data_display_div = document.createElement("div");
		this.new_data_display_div.setAttribute('id', 'new_item_data_display_div');
		this.data_form.appendChild(this.new_data_display_div);

		var div_tab = document.getElementById(form_div_id);

		div_tab.innerHTML = '';

		div_tab.appendChild(this.data_form);

		$(this.button).button();
		$(this.button).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.Item_Data_Refresh_Click();
		});

	};

	/** @method Render
	 * @desc This function will render the full tab in the div that it was initialized with.
	 * */
	this.Render = function() {

		var tabs_array = new Array();

		var new_tab;

		new_tab = new Array();
		new_tab.push("Quick Item Entry");
		new_tab.push('<div id="quick_item_entry_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("New Item Entry");
		new_tab.push('<div id="new_item_entry_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("Edit Item Entry");
		new_tab.push('<div id="edit_item_log_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("View Item Log");
		new_tab.push('<div id="view_item_log_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("New Item");
		new_tab.push('<div id="add_item_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("Edit Item");
		new_tab.push('<div id="edit_item_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("View Items");
		new_tab.push('<div id="view_item_div"></div>');
		tabs_array.push(new_tab);
		
		new_tab = new Array();
		new_tab.push("New Target Entry");
		new_tab.push('Under construction...');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("Edit Target Entry");
		new_tab.push('Under construction...');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("View Targets");
		new_tab.push('Under construction...');
		tabs_array.push(new_tab);

		var return_html = '';

		return_html += '<div id="items_accordian"></div>';

		var div_tab = document.getElementById(this.div_id);

		div_tab.innerHTML = return_html;

		var items_accordian = new Accordian('items_accordian', tabs_array);

		items_accordian.Render();

		//render the accordian panes
		this.quick_item_entry_form.Render('quick_item_entry_div');

		this.new_item_entry_form.Render('new_item_entry_div');

		this.Render_Edit_Item_Entry_Form('edit_item_log_div');

		this.Render_Add_Item_Form('add_item_div');
	
		this.Render_Edit_Item_Form('edit_item_div');

		this.Render_View_Items_Form('view_item_div');

		this.Render_Item_Log('view_item_log_div');

	};
}

