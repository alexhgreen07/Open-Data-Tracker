define([
        'jquery.ui',
        ],function(){
	
	/** This is the edit item entry form class which holds all UI objects for editing item data entry.
	 * @constructor Edit_Item_Entry_Form
	 */
	function Edit_Item_Entry_Form(){
		
		
		this.Refresh = function(data){
			
			var self = this;
			
			this.item_log_data = data.item_entries;
			this.items_list = data.items;
			
			Refresh_Select_HTML_From_Table(
				self.edit_item_entry_select.id,
				data.item_entries,
				"item_log_id",
				"time");
			
			Refresh_Select_HTML_From_Table(
				self.edit_item_name_select.id,
				data.items,
				"item_id",
				"item_name");
			
			Refresh_Select_HTML_From_Table(
				self.edit_item_target_select.id,
				data.item_targets,
				"item_target_id",
				"name");
				
			self.Item_Entry_Select_Change();
		};
		
		this.Refresh_From_Diff = function(diff, data)
		{
			
			var self = this;
			
			this.item_log_data = data.item_entries;
			this.items_list = data.items;
			
			Refresh_Select_HTML_From_Table_Diff(
				self.edit_item_entry_select.id,
				diff.data.item_entries,
				"item_log_id",
				"time");
			
			Refresh_Select_HTML_From_Table_Diff(
				self.edit_item_name_select.id,
				diff.data.items,
				"item_id",
				"item_name");
			
			Refresh_Select_HTML_From_Table_Diff(
				self.edit_item_target_select.id,
				diff.data.item_targets,
				"item_target_id",
				"name");
				
			self.Item_Entry_Select_Change();
			
		};
		
		/** @method Edit_Item_Entry_Click
		 * @desc This is the event function for the edit item entry button click.
		 * */
		this.Edit_Item_Entry_Click = function()
		{
			var self = this;
			
			var item_entry_id = self.edit_item_entry_select.value;
			var selected_index = self.edit_item_entry_select.selectedIndex;
			var item_select_index = self.edit_item_name_select.selectedIndex;
			
			
			if(item_entry_id != 0)
			{
				
				var selected_item_entry = self.item_log_data[selected_index - 1];
				
				var entry_time = $(self.item_edit_time).datetimepicker('getDate');
				
				var params = {};
				params.item_log_id = item_entry_id;
				params.time = entry_time.toISOString();
				params.value = self.item_edit_value.value;
				params.item_id = self.edit_item_name_select.value;
				params.note = self.item_edit_note.value;
				params.item_target_id = self.edit_item_target_select.value;
				
				//execute the RPC callback for retrieving the item log
				app.api.Item_Data_Interface.Update_Item_Entry(params, function(jsonRpcObj) {
					
					if (jsonRpcObj.result.success) {
						
						
						alert('Item entry updated!');

						app.api.Refresh_Data(function() {
							//self.refresh_item_log_callback();
						});
						
					} else {
						alert('Item entry failed to update.');
						//alert(jsonRpcObj.result.debug);
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
			
			var value = self.edit_item_entry_select.value;
			
			if(value != 0)
			{
				
				var r=confirm("Are you sure you want to delete this item entry?");
				
				if (r==true)
				{
					var params = {};
					params.item_log_id = value;
					
					app.api.Item_Data_Interface.Delete_Item_Entry(params, function(jsonRpcObj) {
					
						if(jsonRpcObj.result.success){
							
							alert('Index deleted: ' + value);
							
							app.api.Refresh_Data(function() {
								//self.refresh_item_log_callback();
							});
							
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
			
			var selected_index = self.edit_item_entry_select.selectedIndex;
			
			if(selected_index != 0)
			{
				var selected_item_entry = self.item_log_data[selected_index - 1];
				
				$(self.item_edit_time).datetimepicker('setDate',new Date(selected_item_entry.time));
				self.item_edit_value.value = selected_item_entry.value;
				self.edit_item_name_select.value = selected_item_entry.item_id;
				self.item_edit_note.value = selected_item_entry.note;
				self.edit_item_target_select.value = selected_item_entry.item_target_id;
			}
			else
			{
				self.item_edit_time.value = '';
				self.item_edit_value.value = '0';
				self.edit_item_name_select.value = 0;
				self.item_edit_note.value = '';
				self.edit_item_target_select.value = 0;
			}
			
		};
		
		
		/** @method Render
		 * @desc This function will render the edit item entry form in the specified div.
		 * @param {String} form_div_id The div ID to render the form in.
		 * */
		this.Render = function(parent_div) {

			//create the top form
			this.item_edit_entry_data_form = document.createElement("form");
			this.item_edit_entry_data_form.setAttribute('method', "post");
			this.item_edit_entry_data_form.setAttribute('id', "edit_item_entry_form");

			this.item_edit_entry_data_form = parent_div.appendChild(this.item_edit_entry_data_form);
			
			this.item_edit_entry_data_form.appendChild(document.createTextNode('Item Entries:'));
			this.item_edit_entry_data_form.appendChild(document.createElement('br'));

			//item unit
			this.edit_item_entry_select = document.createElement("select");
			this.edit_item_entry_select.setAttribute('name', "edit_task_entry_dropdown");
			this.edit_item_entry_select.setAttribute('id', "edit_task_entry_dropdown");
			this.edit_item_entry_select.innerHTML = '<option>-</option>';
			this.edit_item_entry_select = this.item_edit_entry_data_form.appendChild(this.edit_item_entry_select);
			
			this.item_edit_entry_data_form.appendChild(document.createElement('br'));
			this.item_edit_entry_data_form.appendChild(document.createElement('br'));
			this.item_edit_entry_data_form.appendChild(document.createTextNode('Time:'));
			this.item_edit_entry_data_form.appendChild(document.createElement('br'));

			//item value
			this.item_edit_time = document.createElement("input");
			this.item_edit_time.setAttribute('name', "edit_time");
			this.item_edit_time.setAttribute('id', "edit_time");
			this.item_edit_time.setAttribute('type', 'text');
			this.item_edit_time = this.item_edit_entry_data_form.appendChild(this.item_edit_time);
			
			this.item_edit_entry_data_form.appendChild(document.createElement('br'));
			this.item_edit_entry_data_form.appendChild(document.createTextNode('Value:'));
			this.item_edit_entry_data_form.appendChild(document.createElement('br'));

			//item value
			this.item_edit_value = document.createElement("input");
			this.item_edit_value.setAttribute('name', "edit_value");
			this.item_edit_value.setAttribute('id', "edit_value");
			this.item_edit_value.setAttribute('type', 'text');
			this.item_edit_value = this.item_edit_entry_data_form.appendChild(this.item_edit_value);
			
			this.item_edit_entry_data_form.appendChild(document.createElement('br'));
			this.item_edit_entry_data_form.appendChild(document.createTextNode('Item:'));
			this.item_edit_entry_data_form.appendChild(document.createElement('br'));

			//item unit
			this.edit_item_name_select = document.createElement("select");
			this.edit_item_name_select.setAttribute('name', "edit_task_name_dropdown");
			this.edit_item_name_select.setAttribute('id', "edit_task_name_dropdown");
			this.edit_item_name_select.innerHTML = '<option>-</option>';
			this.edit_item_name_select = this.item_edit_entry_data_form.appendChild(this.edit_item_name_select);
			
			this.item_edit_entry_data_form.appendChild(document.createElement('br'));
			this.item_edit_entry_data_form.appendChild(document.createTextNode('Note:'));
			this.item_edit_entry_data_form.appendChild(document.createElement('br'));

			//item note
			this.item_edit_note = document.createElement("input");
			this.item_edit_note.setAttribute('name', "edit_notes");
			this.item_edit_note.setAttribute('id', "edit_notes");
			this.item_edit_note.setAttribute('type', 'text');
			this.item_edit_note = this.item_edit_entry_data_form.appendChild(this.item_edit_note);

			this.item_edit_entry_data_form.appendChild(document.createElement('br'));
			this.item_edit_entry_data_form.appendChild(document.createTextNode('Target:'));
			this.item_edit_entry_data_form.appendChild(document.createElement('br'));

			//item unit
			this.edit_item_target_select = document.createElement("select");
			this.edit_item_target_select.setAttribute('name', "edit_item_target_select");
			this.edit_item_target_select.setAttribute('id', "edit_item_target_select");
			this.edit_item_target_select.innerHTML = '<option>-</option>';
			this.edit_item_target_select = this.item_edit_entry_data_form.appendChild(this.edit_item_target_select);

			this.item_edit_entry_data_form.appendChild(document.createElement('br'));
			this.item_edit_entry_data_form.appendChild(document.createElement('br'));

			//item submit button creation
			this.item_edit_add_entry_button = document.createElement("input");
			this.item_edit_add_entry_button.setAttribute('id', 'edit_task_entry_submit');
			this.item_edit_add_entry_button.setAttribute('type', 'submit');
			this.item_edit_add_entry_button.value = 'Submit';
			this.item_edit_add_entry_button = this.item_edit_entry_data_form.appendChild(this.item_edit_add_entry_button);

			this.item_edit_entry_data_form.appendChild(document.createElement('br'));
			this.item_edit_entry_data_form.appendChild(document.createElement('br'));

			//item delete button creation
			this.item_edit_delete_entry_button = document.createElement("input");
			this.item_edit_delete_entry_button.setAttribute('id', 'item_edit_delete_entry_button');
			this.item_edit_delete_entry_button.setAttribute('type', 'submit');
			this.item_edit_delete_entry_button.value = 'Delete';
			this.item_edit_delete_entry_button = this.item_edit_entry_data_form.appendChild(this.item_edit_delete_entry_button);

			var self = this;

			$(this.item_edit_add_entry_button).button();
			$(this.item_edit_add_entry_button).click(function(event) {

				//ensure a normal postback does not occur
				event.preventDefault();

				
				//execute the click event
				self.Edit_Item_Entry_Click();
			});
			
			$(this.item_edit_delete_entry_button).button();
			$(this.item_edit_delete_entry_button).click(function(event) {

				//ensure a normal postback does not occur
				event.preventDefault();
				
				
				//execute the click event
				self.Delete_Item_Entry_Click();
			});
			
			$(self.edit_item_entry_select).change(function() {
				
				self.Item_Entry_Select_Change();
				

			});
			
			//initialize the datetime picker
			$(this.item_edit_time).datetimepicker({
				timeFormat : "HH:mm:ss",
				dateFormat : 'yy-mm-dd'
			});
			$(this.item_edit_time).datetimepicker("setDate", new Date());
			
		};
		
	}
	
	function Build_Edit_Item_Entry_Form()
	{
		var built_edit_item_entry_form = new Edit_Item_Entry_Form();
		
		return built_edit_item_entry_form;
	}
	
	return {
		Build_Edit_Item_Entry_Form: Build_Edit_Item_Entry_Form,
		Edit_Item_Entry_Form: Edit_Item_Entry_Form,
	};
});


