define([
        'jquery.ui',
        ],function($){
		return {
			/** This is the quick item entry form class which holds all UI objects for quick item data entry.
			 * @constructor Quick_Item_Entry_Form
			 */
			Quick_Item_Entry_Form: function (){
			
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
		
					var self = this;
		
					//get the value string
					var value_string = $("#" + self.item_value.id).val();
					var item_select_index = $("#" + self.quick_item_name_select.id).prop("selectedIndex");
					var note_string = $("#" + self.item_note.id).val();
					var target_id = $("#" + self.quick_item_target_select.id).val();
		
					//check that the string is numeric
					if (!isNaN(Number(value_string)) && value_string != '') {
						
						var current_utc_date = new Date();
		
						var params = {};
						params.time = current_utc_date;
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
					
					this.item_quick_entry_data_form.innerHTML += '<br />';
		
					this.item_quick_entry_data_form.innerHTML += 'Target:<br />';
		
					//item target
					this.quick_item_target_select = document.createElement("select");
					this.quick_item_target_select.setAttribute('name', "quick_item_target_select");
					this.quick_item_target_select.setAttribute('id', "quick_item_target_select");
					this.quick_item_target_select.innerHTML = '<option>-</option>';
					this.item_quick_entry_data_form.appendChild(this.quick_item_target_select);
		
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
		
					var div_tab = document.getElementById(form_div_id);
					div_tab.appendChild(this.item_quick_entry_data_form);
		
				};
		
				
		}
	};
});



