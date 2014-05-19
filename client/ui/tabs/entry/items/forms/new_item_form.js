define([
        'jquery.ui',
        ],function($){
	
	/** This is the new item form class which holds all UI objects for entering new items.
	 * @constructor New_Item_Form
	 */
	function New_Item_Form(){
		
		
		this.Refresh = function(data)
		{
			
			Refresh_Select_HTML_From_Table(
				this.item_category_select.id,
				data['Categories'],
				"Category ID",
				"Category Path");
			
		};
		
		this.Refresh_From_Diff = function(diff, data)
		{
			
			Refresh_Select_HTML_From_Table_Diff(
				this.item_category_select.id,
				diff.data['Categories'],
				"Category ID",
				"Category Path");
			
		};
		
		/** @method Add_New_Item_Click
		 * @desc This is the event function for the add new item button click.
		 * */
		this.Add_New_Item_Click = function() {
			var self = this;

			//get the value string
			var name_string = $(self.item_name).val();
			var note_string = $(self.item_description).val();
			var unit_string = $(self.item_new_unit).val();
			var category_id = $(self.item_category_select).val();

			if (name_string != '') {


				var params = {};
				params.name = name_string;
				params.unit = unit_string;
				params.description = note_string;
				params.category_id = category_id;

				//execute the RPC callback for retrieving the item log
				app.api.Item_Data_Interface.Insert_New_Item(params, function(jsonRpcObj) {

					if (jsonRpcObj.result.success) {
						alert('New item added!');
					} else {
						alert('Item failed to add.');
					}

					//reset all the fields to default
					$(self.item_name).val('');
					$(self.item_description).val('');
					$(self.item_new_unit).val('');

					//refresh the items
					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});
				});

			} else {
				alert('Item name cannot be empty!');
			}

		};
		
		
		/** @method Render
		 * @desc This function will render the add item form in the specified div.
		 * @param {String} form_div_id The div ID to render the form in.
		 * */
		this.Render = function(parent_div) {
			
			//create the top form
			this.item_add_data_form = document.createElement("form");
			this.item_add_data_form.setAttribute('method', "post");
			this.item_add_data_form.setAttribute('id', "add_item_entry_form");

			this.item_add_data_form = parent_div.appendChild(this.item_add_data_form);
			
			this.item_add_data_form.appendChild(document.createTextNode('Name:'));
			this.item_add_data_form.appendChild(document.createElement('br'));

			//item name
			this.item_name = document.createElement("input");
			this.item_name.setAttribute('name', "item_name");
			this.item_name.setAttribute('id', "item_name");
			this.item_name.setAttribute('type', 'text');
			this.item_name = this.item_add_data_form.appendChild(this.item_name);
			
			this.item_add_data_form.appendChild(document.createElement('br'));
			this.item_add_data_form.appendChild(document.createTextNode('Category:'));
			this.item_add_data_form.appendChild(document.createElement('br'));

			//task recurring
			this.item_category_select = document.createElement("select");
			this.item_category_select.setAttribute('id', 'item_category_select');
			this.item_category_select.innerHTML = '<option>-</option>';
			this.item_category_select = this.item_add_data_form.appendChild(this.item_category_select);

			this.item_add_data_form.appendChild(document.createElement('br'));
			this.item_add_data_form.appendChild(document.createTextNode('Description:'));
			this.item_add_data_form.appendChild(document.createElement('br'));

			//item description
			this.item_description = document.createElement("input");
			this.item_description.setAttribute('name', "item_description");
			this.item_description.setAttribute('id', "item_description");
			this.item_description.setAttribute('type', 'text');
			this.item_description = this.item_add_data_form.appendChild(this.item_description);
			
			this.item_add_data_form.appendChild(document.createElement('br'));
			this.item_add_data_form.appendChild(document.createTextNode('Unit:'));
			this.item_add_data_form.appendChild(document.createElement('br'));

			//item note
			this.item_new_unit = document.createElement("input");
			this.item_new_unit.setAttribute('name', "add_item_unit");
			this.item_new_unit.setAttribute('id', "add_item_unit");
			this.item_new_unit.setAttribute('type', 'text');
			this.item_new_unit = this.item_add_data_form.appendChild(this.item_new_unit);

			this.item_add_data_form.appendChild(document.createElement('br'));
			this.item_add_data_form.appendChild(document.createElement('br'));

			//task start/stop button creation
			this.item_add_button = document.createElement("input");
			this.item_add_button.setAttribute('id', 'item_add');
			this.item_add_button.setAttribute('type', 'submit');
			this.item_add_button.value = 'Submit';
			
			this.item_add_button = this.item_add_data_form.appendChild(this.item_add_button);
			
			var self = this;
			$(this.item_add_button).button();
			$(this.item_add_button).click(function(event) {

				//ensure a normal postback does not occur
				event.preventDefault();

				//execute the click event
				self.Add_New_Item_Click();
			});

		};
		
		
	}
	
	function Build_New_Item_Form()
	{
		var built_new_item_form = new New_Item_Form();
		
		return built_new_item_form;
	}
	
	return {
		Build_New_Item_Form: Build_New_Item_Form,
		New_Item_Form: New_Item_Form,
	};
});


