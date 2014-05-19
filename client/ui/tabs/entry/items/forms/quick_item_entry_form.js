define([
        'jquery.ui',
        ],function($){
	
	/** This is the quick item entry form class which holds all UI objects for quick item data entry.
	 * @constructor Quick_Item_Entry_Form
	 */
	function Quick_Item_Entry_Form(){
		
		var self = this;
		
		this.Refresh = function(data){
			
			Refresh_Select_HTML_From_Table(
				this.quick_item_name_select.id,
				data.items,
				"item_id",
				"item_name");
			
			Refresh_Select_HTML_From_Table(
				this.quick_item_target_select.id,
				data.item_targets,
				"item_target_id",
				"name");
			
		};
		
		this.Refresh_From_Diff = function(diff, data)
		{
			
			Refresh_Select_HTML_From_Table_Diff(
				this.quick_item_name_select.id,
				diff.data.items,
				"item_id",
				"item_name");
			
			Refresh_Select_HTML_From_Table_Diff(
				this.quick_item_target_select.id,
				diff.data.item_targets,
				"item_target_id",
				"name");
			
		};
		
		/** @method Add_Quick_Item_Entry_Click
		 * @desc This is the event function for the item quick item entry button click.
		 * */
		this.Add_Quick_Item_Entry_Click = function() {

			//get the value string
			var value_string = $(self.item_value).val();
			var item_select_index = $(self.quick_item_name_select).prop("selectedIndex");
			var note_string = $(self.item_note).val();
			var target_id = $(self.quick_item_target_select).val();

			//check that the string is numeric
			if (!isNaN(Number(value_string)) && value_string != '') {
				
				var current_utc_date = new Date();

				var params = {};
				params.time = current_utc_date.toISOString();
				params.value = value_string;
				params.item_id = app.api.data.items[item_select_index - 1].item_id;
				params.note = note_string;
				params.item_target_id = target_id;
				
				//execute the RPC callback for retrieving the item log
				app.api.Item_Data_Interface.Insert_Item_Entry(params, function(jsonRpcObj) {

					if (jsonRpcObj.result.success) {
						
						alert('New item entry added!');

						app.api.Refresh_Data(function() {
							//self.refresh_item_log_callback();
						});
						
					} else {
						alert('Item entry failed to add.');
					}

					//reset all the fields to default
					$(self.item_value).val('');
					$(self.quick_item_name_select).val('-');
					$(self.item_note).val('');

				});
			} else {
				alert('The value field must be numeric.');
			}

		};
		
		
		/** @method Render
		 * @desc This function will render the quick item entry form in the specified div.
		 * @param {String} form_div_id The div ID to render the form in.
		 * */
		this.Render = function(parent_div) {

			//create the top form
			this.item_quick_entry_data_form = document.createElement("form");
			this.item_quick_entry_data_form.setAttribute('method', "post");
			this.item_quick_entry_data_form.setAttribute('id', "quick_item_entry_form");

			this.item_quick_entry_data_form = parent_div.appendChild(this.item_quick_entry_data_form);
			
			this.item_quick_entry_data_form.appendChild(document.createTextNode('Value:'));
			this.item_quick_entry_data_form.appendChild(document.createElement('br'));

			//item value
			this.item_value = document.createElement("input");
			this.item_value.setAttribute('name', "value");
			this.item_value.setAttribute('id', "value");
			this.item_value.setAttribute('type', 'text');
			this.item_value = this.item_quick_entry_data_form.appendChild(this.item_value);
			
			this.item_quick_entry_data_form.appendChild(document.createElement('br'));
			this.item_quick_entry_data_form.appendChild(document.createTextNode('Item:'));
			this.item_quick_entry_data_form.appendChild(document.createElement('br'));

			//item unit
			this.quick_item_name_select = document.createElement("select");
			this.quick_item_name_select.setAttribute('name', "task_name_dropdown");
			this.quick_item_name_select.setAttribute('id', "task_name_dropdown");
			this.quick_item_name_select.innerHTML = '<option>-</option>';
			this.quick_item_name_select = this.item_quick_entry_data_form.appendChild(this.quick_item_name_select);

			this.item_quick_entry_data_form.appendChild(document.createElement('br'));
			this.item_quick_entry_data_form.appendChild(document.createTextNode('Note:'));
			this.item_quick_entry_data_form.appendChild(document.createElement('br'));

			//item note
			this.item_note = document.createElement("input");
			this.item_note.setAttribute('name', "notes");
			this.item_note.setAttribute('id', "notes");
			this.item_note.setAttribute('type', 'text');
			this.item_note = this.item_quick_entry_data_form.appendChild(this.item_note);
			
			this.item_quick_entry_data_form.appendChild(document.createElement('br'));
			this.item_quick_entry_data_form.appendChild(document.createTextNode('Target:'));
			this.item_quick_entry_data_form.appendChild(document.createElement('br'));

			//item target
			this.quick_item_target_select = document.createElement("select");
			this.quick_item_target_select.setAttribute('name', "quick_item_target_select");
			this.quick_item_target_select.setAttribute('id', "quick_item_target_select");
			this.quick_item_target_select.innerHTML = '<option>-</option>';
			this.quick_item_target_select = this.item_quick_entry_data_form.appendChild(this.quick_item_target_select);

			this.item_quick_entry_data_form.appendChild(document.createElement('br'));
			this.item_quick_entry_data_form.appendChild(document.createElement('br'));

			//task start/stop button creation
			this.item_add_entry_button = document.createElement("input");
			this.item_add_entry_button.setAttribute('id', 'item_add_entry_button');
			this.item_add_entry_button.setAttribute('type', 'submit');
			this.item_add_entry_button.value = 'Submit';
			
			this.item_add_entry_button = this.item_quick_entry_data_form.appendChild(this.item_add_entry_button);
			
			$(this.item_add_entry_button).button();
			$(this.item_add_entry_button).click(function(event) {

				//ensure a normal postback does not occur
				event.preventDefault();

				//execute the click event
				self.Add_Quick_Item_Entry_Click();
			});

		};
		
	}
	
	function Build_Quick_Item_Entry_Form()
	{
		var built_quick_item_entry_form = new Quick_Item_Entry_Form();
		
		return built_quick_item_entry_form;
	}
	
	return {
		Build_Quick_Item_Entry_Form: Build_Quick_Item_Entry_Form,
		Quick_Item_Entry_Form: Quick_Item_Entry_Form,
	};
});



