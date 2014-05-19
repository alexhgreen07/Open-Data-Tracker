define([
        'jquery.ui',
        'core/datetimes',
        ],function($,datetimes){
	
	/** This is the new item entry form class which holds all UI objects for new item data entry.
	 * @constructor New_Item_Entry_Form
	 */
	function New_Item_Entry_Form(){
		
		
		this.Refresh = function(data){
			
			Refresh_Select_HTML_From_Table(
				this.new_item_name_select.id,
				data.items,
				"item_id",
				"item_name");
			
			Refresh_Select_HTML_From_Table(
				this.new_item_target_select.id,
				data.item_targets,
				"item_target_id",
				"name");
			
		};
		
		this.Refresh_From_Diff = function(diff, data){
			
			Refresh_Select_HTML_From_Table_Diff(
				this.new_item_name_select.id,
				diff.data.items,
				"item_id",
				"item_name");
			
			Refresh_Select_HTML_From_Table_Diff(
				this.new_item_target_select.id,
				diff.data.item_targets,
				"item_target_id",
				"name");
		};
		
		/** @method Add_Item_Entry_Click
		 * @desc This is the event function for the add item entry button click.
		 * */
		this.Add_Item_Entry_Click = function() {

			var self = this;

			//get the value string
			var entry_time = $(self.item_new_time).datetimepicker('getDate');
			var value_string = $(self.item_new_value).val();
			var item_select_index = $(self.new_item_name_select).prop("selectedIndex");
			var note_string = $(self.item_new_note).val();
			var target_id = $(self.new_item_target_select).val();

			//check that the string is numeric
			if (!isNaN(Number(value_string)) && value_string != '') {

				var params = {};
				params.time = entry_time.toISOString();
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
					$(self.item_new_value).val('');
					$(self.new_item_name_select).val('-');
					$(self.item_new_note).val('');

				});
			} else {
				alert('The value field must be numeric.');
			}

		};
		
		/** @method Render
		 * @desc This function will render the new item entry form in the specified div.
		 * @param {String} form_div_id The div ID to render the form in.
		 * */
		this.Render = function(parent_div) {

			//create the top form
			this.item_new_entry_data_form = document.createElement("form");
			this.item_new_entry_data_form.setAttribute('method', "post");
			this.item_new_entry_data_form.setAttribute('id', "new_item_entry_form");

			this.item_new_entry_data_form = parent_div.appendChild(this.item_new_entry_data_form);
			
			this.item_new_entry_data_form.appendChild(document.createTextNode('Time:'));
			this.item_new_entry_data_form.appendChild(document.createElement('br'));

			//item value
			this.item_new_time = document.createElement("input");
			this.item_new_time.setAttribute('name', "new_time");
			this.item_new_time.setAttribute('id', "new_time");
			this.item_new_time.setAttribute('type', 'text');
			this.item_new_time = this.item_new_entry_data_form.appendChild(this.item_new_time);
			
			this.item_new_entry_data_form.appendChild(document.createElement('br'));
			this.item_new_entry_data_form.appendChild(document.createTextNode('Value:'));
			this.item_new_entry_data_form.appendChild(document.createElement('br'));

			//item value
			this.item_new_value = document.createElement("input");
			this.item_new_value.setAttribute('name', "new_value");
			this.item_new_value.setAttribute('id', "new_value");
			this.item_new_value.setAttribute('type', 'text');
			this.item_new_value = this.item_new_entry_data_form.appendChild(this.item_new_value);

			this.item_new_entry_data_form.appendChild(document.createElement('br'));
			this.item_new_entry_data_form.appendChild(document.createTextNode('Item:'));
			this.item_new_entry_data_form.appendChild(document.createElement('br'));

			//item unit
			this.new_item_name_select = document.createElement("select");
			this.new_item_name_select.setAttribute('name', "new_task_name_dropdown");
			this.new_item_name_select.setAttribute('id', "new_task_name_dropdown");
			this.new_item_name_select.innerHTML = '<option>-</option>';
			this.new_item_name_select = this.item_new_entry_data_form.appendChild(this.new_item_name_select);

			this.item_new_entry_data_form.appendChild(document.createElement('br'));
			this.item_new_entry_data_form.appendChild(document.createTextNode('Note:'));
			this.item_new_entry_data_form.appendChild(document.createElement('br'));

			//item note
			this.item_new_note = document.createElement("input");
			this.item_new_note.setAttribute('name', "new_notes");
			this.item_new_note.setAttribute('id', "new_notes");
			this.item_new_note.setAttribute('type', 'text');
			this.item_new_note = this.item_new_entry_data_form.appendChild(this.item_new_note);
			
			this.item_new_entry_data_form.appendChild(document.createElement('br'));
			this.item_new_entry_data_form.appendChild(document.createTextNode('Target:'));
			this.item_new_entry_data_form.appendChild(document.createElement('br'));

			//item target
			this.new_item_target_select = document.createElement("select");
			this.new_item_target_select.setAttribute('name', "new_item_target_select");
			this.new_item_target_select.setAttribute('id', "new_item_target_select");
			this.new_item_target_select.innerHTML = '<option>-</option>';
			this.new_item_target_select = this.item_new_entry_data_form.appendChild(this.new_item_target_select);

			this.item_new_entry_data_form.appendChild(document.createElement('br'));
			this.item_new_entry_data_form.appendChild(document.createElement('br'));

			//task start/stop button creation
			this.item_new_add_entry_button = document.createElement("input");
			this.item_new_add_entry_button.setAttribute('id', 'item_new_add_entry_button');
			this.item_new_add_entry_button.setAttribute('type', 'submit');
			this.item_new_add_entry_button.value = 'Submit';
			this.item_new_add_entry_button = this.item_new_entry_data_form.appendChild(this.item_new_add_entry_button);

			var self = this;
			
			$(this.item_new_add_entry_button).button();
			$(this.item_new_add_entry_button).click(function(event) {

				//ensure a normal postback does not occur
				event.preventDefault();

				//execute the click event
				self.Add_Item_Entry_Click();
			});

			//initialize the datetime picker
			$(this.item_new_time).datetimepicker({
				timeFormat : "HH:mm:ss",
				dateFormat : 'yy-mm-dd'
			});
			$(this.item_new_time).datetimepicker("setDate", new Date());

		};
		
	}
	
	function Build_New_Item_Entry_Form()
	{
		var built_new_item_entry_form = new New_Item_Entry_Form();
		
		return built_new_item_entry_form;
	}
	
	return {
		Build_New_Item_Entry_Form: Build_New_Item_Entry_Form,
		New_Item_Entry_Form: New_Item_Entry_Form,
	};
});


