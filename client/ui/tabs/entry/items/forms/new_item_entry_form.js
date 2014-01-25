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
	
	/** @method Add_Item_Entry_Click
	 * @desc This is the event function for the add item entry button click.
	 * */
	this.Add_Item_Entry_Click = function() {

		var self = this;

		//get the value string
		var time_string = $("#" + self.item_new_time.id).val();
		var value_string = $("#" + self.item_new_value.id).val();
		var item_select_index = $("#" + self.new_item_name_select.id).prop("selectedIndex");
		var note_string = $("#" + self.item_new_note.id).val();
		var target_id = $("#" + self.new_item_target_select.id).val();

		//check that the string is numeric
		if (!isNaN(Number(value_string)) && value_string != '') {

			var params = new Array();
			params[0] = Cast_Local_Server_Datetime_To_UTC_Server_Datetime(time_string);
			params[1] = value_string;
			params[2] = app.api.data.items[item_select_index - 1].item_id;
			params[3] = note_string;
			params[4] = target_id;

			//execute the RPC callback for retrieving the item log
			app.api.Item_Data_Interface.Insert_Item_Entry(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.success == 'true') {
					
					alert('New item entry added!');

					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});
					
				} else {
					alert('Item entry failed to add.');
				}

				//reset all the fields to default
				$("#" + self.item_new_value.id).val('');
				$("#" + self.new_item_name_select.id).val('-');
				$("#" + self.item_new_note.id).val('');

			});
		} else {
			alert('The value field must be numeric.');
		}

	};
	
	/** @method Render
	 * @desc This function will render the new item entry form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render = function(form_div_id) {

		//create the top form
		this.item_new_entry_data_form = document.createElement("form");
		this.item_new_entry_data_form.setAttribute('method', "post");
		this.item_new_entry_data_form.setAttribute('id', "new_item_entry_form");

		this.item_new_entry_data_form.innerHTML += 'Time:<br />';

		//item value
		this.item_new_time = document.createElement("input");
		this.item_new_time.setAttribute('name', "new_time");
		this.item_new_time.setAttribute('id', "new_time");
		this.item_new_time.setAttribute('type', 'text');
		this.item_new_entry_data_form.appendChild(this.item_new_time);
		
		this.item_new_entry_data_form.innerHTML += '<br />';
		
		this.item_new_entry_data_form.innerHTML += 'Value:<br />';

		//item value
		this.item_new_value = document.createElement("input");
		this.item_new_value.setAttribute('name', "new_value");
		this.item_new_value.setAttribute('id', "new_value");
		this.item_new_value.setAttribute('type', 'text');
		this.item_new_entry_data_form.appendChild(this.item_new_value);
		
		this.item_new_entry_data_form.innerHTML += '<br />';
		
		this.item_new_entry_data_form.innerHTML += 'Item:<br />';

		//item unit
		this.new_item_name_select = document.createElement("select");
		this.new_item_name_select.setAttribute('name', "new_task_name_dropdown");
		this.new_item_name_select.setAttribute('id', "new_task_name_dropdown");
		this.new_item_name_select.innerHTML = '<option>-</option>';
		this.item_new_entry_data_form.appendChild(this.new_item_name_select);

		this.item_new_entry_data_form.innerHTML += '<br />';
		
		this.item_new_entry_data_form.innerHTML += 'Note:<br />';

		//item note
		this.item_new_note = document.createElement("input");
		this.item_new_note.setAttribute('name', "new_notes");
		this.item_new_note.setAttribute('id', "new_notes");
		this.item_new_note.setAttribute('type', 'text');
		this.item_new_entry_data_form.appendChild(this.item_new_note);
		
		this.item_new_entry_data_form.innerHTML += '<br />';
		
		this.item_new_entry_data_form.innerHTML += 'Target:<br />';

		//item target
		this.new_item_target_select = document.createElement("select");
		this.new_item_target_select.setAttribute('name', "new_item_target_select");
		this.new_item_target_select.setAttribute('id', "new_item_target_select");
		this.new_item_target_select.innerHTML = '<option>-</option>';
		this.item_new_entry_data_form.appendChild(this.new_item_target_select);

		this.item_new_entry_data_form.innerHTML += '<br /><br />';

		//task start/stop button creation
		this.item_new_add_entry_button = document.createElement("input");
		this.item_new_add_entry_button.setAttribute('id', 'item_new_add_entry_button');
		this.item_new_add_entry_button.setAttribute('type', 'submit');
		this.item_new_add_entry_button.value = 'Submit';
		var self = this;
		this.item_new_entry_data_form.appendChild(this.item_new_add_entry_button);

		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.item_new_entry_data_form);

		$('#' + this.item_new_add_entry_button.id).button();
		$('#' + this.item_new_add_entry_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.Add_Item_Entry_Click();
		});

		//initialize the datetime picker
		$('#' + this.item_new_time.id).datetimepicker({
			timeFormat : "HH:mm:ss",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.item_new_time.id).datetimepicker("setDate", new Date());

	};
	
}