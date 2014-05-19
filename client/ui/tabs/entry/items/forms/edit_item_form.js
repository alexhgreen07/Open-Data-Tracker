define([
        'jquery.ui',
        ],function($){
	
	/** This is the edit item form class which holds all UI objects for editing items.
	 * @constructor Edit_Item_Form
	 */
	function Edit_Item_Form(){

		this.Refresh = function(data){
			
			var self = this;
			
			this.items_list = data.items;
			
			Refresh_Select_HTML_From_Table(
				self.item_edit_select.id,
				data.items,
				"item_id",
				"item_name");
			
			Refresh_Select_HTML_From_Table(
				self.item_edit_category_select.id,
				data['Categories'],
				"Category ID",
				"Category Path");
			
			self.Item_Select_Change();
		};
		
		this.Refresh_From_Diff = function(diff, data)
		{
			var self = this;
			
			this.items_list = data.items;
			
			Refresh_Select_HTML_From_Table_Diff(
				self.item_edit_select.id,
				diff.data.items,
				"item_id",
				"item_name");
			
			Refresh_Select_HTML_From_Table_Diff(
				self.item_edit_category_select.id,
				diff.data['Categories'],
				"Category ID",
				"Category Path");
			
			self.Item_Select_Change();
			
		};
		
		/** @method Edit_Item_Click
		 * @desc This is the event function for the edit item button click.
		 * */
		this.Edit_Item_Click = function()
		{
			var self = this;
			
			var selected_index = self.item_edit_select.selectedIndex;
			
			if(selected_index != 0)
			{
				var selected_item = self.items_list[selected_index - 1];
				
				var params = {};
				params.name = self.edit_item_name.value;
				params.unit = self.edit_item_unit.value;
				params.description = self.item_edit_description.value;
				params.category_id = self.item_edit_category_select.value;
				params.item_id = selected_item.item_id;
				
				app.api.Item_Data_Interface.Edit_Item(params, function(jsonRpcObj) {
				
					if(jsonRpcObj.result.success){
						
						alert('Item successfully edited.');
						
						app.api.Refresh_Data(function() {
							//self.refresh_item_log_callback();
						});
						
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
			
			var selected_index = self.item_edit_select.selectedIndex;
			
			if(selected_index != 0)
			{
				var selected_item = self.items_list[selected_index - 1];
				
				self.edit_item_name.value = selected_item.item_name;
				self.item_edit_description.value = selected_item.item_description;
				self.edit_item_unit.value = selected_item.item_unit;
				self.item_edit_category_select.value = selected_item.category_id;
			}
			else
			{
				self.edit_item_name.value = '';
				self.item_edit_description.value = '';
				self.edit_item_unit.value = '';
				self.item_edit_category_select.value = 0;
			}
			
		};


		/** @method Delete_Item_Click
		 * @desc This is the event function for the delete item button click.
		 * */
		this.Delete_Item_Click = function()
		{
			
			var self = this;
			
			var selected_index = self.item_edit_select.selectedIndex;
			
			if(selected_index != 0)
			{
				var r=confirm("Are you sure you want to delete this item?");
				
				if (r==true)
				{
					var value = self.items_list[selected_index - 1].item_id;
				
					var params = {};
					params.item_id = value;
					
					app.api.Item_Data_Interface.Delete_Item(params, function(jsonRpcObj) {
					
						if(jsonRpcObj.result.success){
							
							alert('Item deleted: ' + value);
							
							self.item_edit_select.value = 0;
							
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
				alert('Select a valid item.');
			}
			
		};
		
		
		/** @method Render
		 * @desc This function will render the edit item form in the specified div.
		 * @param {String} form_div_id The div ID to render the form in.
		 * */
		this.Render = function(parent_div) {
			
			//create the top form
			this.item_edit_data_form = document.createElement("form");
			this.item_edit_data_form.setAttribute('method', "post");
			this.item_edit_data_form.setAttribute('id', "edit_item_entry_form");

			this.item_edit_data_form = parent_div.appendChild(this.item_edit_data_form);
			
			this.item_edit_data_form.appendChild(document.createTextNode('Items:'));
			this.item_edit_data_form.appendChild(document.createElement('br'));

			//task recurring
			this.item_edit_select = document.createElement("select");
			this.item_edit_select.setAttribute('id', 'item_edit_select');
			this.item_edit_select.innerHTML = '<option>-</option>';
			this.item_edit_select = this.item_edit_data_form.appendChild(this.item_edit_select);
			
			this.item_edit_data_form.appendChild(document.createElement('br'));
			this.item_edit_data_form.appendChild(document.createElement('br'));
			this.item_edit_data_form.appendChild(document.createTextNode('Name:'));
			this.item_edit_data_form.appendChild(document.createElement('br'));

			//item name
			this.edit_item_name = document.createElement("input");
			this.edit_item_name.setAttribute('name', "edit_item_name");
			this.edit_item_name.setAttribute('id', "edit_item_name");
			this.edit_item_name.setAttribute('type', 'text');
			this.edit_item_name = this.item_edit_data_form.appendChild(this.edit_item_name);
			
			this.item_edit_data_form.appendChild(document.createElement('br'));
			this.item_edit_data_form.appendChild(document.createTextNode('Category:'));
			this.item_edit_data_form.appendChild(document.createElement('br'));

			//task recurring
			this.item_edit_category_select = document.createElement("select");
			this.item_edit_category_select.setAttribute('id', 'item_edit_category_select');
			this.item_edit_category_select.innerHTML = '<option>-</option>';
			this.item_edit_category_select = this.item_edit_data_form.appendChild(this.item_edit_category_select);
			
			this.item_edit_data_form.appendChild(document.createElement('br'));
			this.item_edit_data_form.appendChild(document.createTextNode('Description:'));
			this.item_edit_data_form.appendChild(document.createElement('br'));

			//item description
			this.item_edit_description = document.createElement("input");
			this.item_edit_description.setAttribute('name', "item_edit_description");
			this.item_edit_description.setAttribute('id', "item_edit_description");
			this.item_edit_description.setAttribute('type', 'text');
			this.item_edit_description = this.item_edit_data_form.appendChild(this.item_edit_description);
			
			this.item_edit_data_form.appendChild(document.createElement('br'));
			this.item_edit_data_form.appendChild(document.createTextNode('Unit:'));
			this.item_edit_data_form.appendChild(document.createElement('br'));

			//item note
			this.edit_item_unit = document.createElement("input");
			this.edit_item_unit.setAttribute('name', "edit_item_unit");
			this.edit_item_unit.setAttribute('id', "edit_item_unit");
			this.edit_item_unit.setAttribute('type', 'text');
			this.edit_item_unit = this.item_edit_data_form.appendChild(this.edit_item_unit);

			this.item_edit_data_form.appendChild(document.createElement('br'));
			this.item_edit_data_form.appendChild(document.createElement('br'));

			//item submit button creation
			this.item_edit_submit_button = document.createElement("input");
			this.item_edit_submit_button.setAttribute('id', 'item_edit_submit_button');
			this.item_edit_submit_button.setAttribute('type', 'submit');
			this.item_edit_submit_button.value = 'Submit';
			this.item_edit_submit_button = this.item_edit_data_form.appendChild(this.item_edit_submit_button);
			
			this.item_edit_data_form.appendChild(document.createElement('br'));
			this.item_edit_data_form.appendChild(document.createElement('br'));
			
			//item delete button creation
			this.item_edit_delete_button = document.createElement("input");
			this.item_edit_delete_button.setAttribute('id', 'item_edit_delete_button');
			this.item_edit_delete_button.setAttribute('type', 'submit');
			this.item_edit_delete_button.value = 'Delete';
			this.item_edit_delete_button = this.item_edit_data_form.appendChild(this.item_edit_delete_button);

			var self = this;

			$(this.item_edit_submit_button).button();
			$(this.item_edit_submit_button).click(function(event) {

				//ensure a normal postback does not occur
				event.preventDefault();
				
				
				//execute the click event
				self.Edit_Item_Click();
			});
			
			$(this.item_edit_delete_button).button();
			$(this.item_edit_delete_button).click(function(event) {

				//ensure a normal postback does not occur
				event.preventDefault();
				
				
				//execute the click event
				self.Delete_Item_Click();
			});
			
			$(self.item_edit_select).change(function() {
				
				self.Item_Select_Change();
				

			});
		};

	}
	
	function Build_Edit_Item_Form()
	{
		var built_edit_item_form = new Edit_Item_Form();
		
		return built_edit_item_form;
	}
	
	return {
		Build_Edit_Item_Form: Build_Edit_Item_Form,
		Edit_Item_Form: Edit_Item_Form,
	};
});


