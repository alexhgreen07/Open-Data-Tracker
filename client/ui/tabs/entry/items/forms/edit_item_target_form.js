/** This is the edit item target form class which holds all UI objects for editing item targets.
 * @constructor Edit_Item_Target_Form
 */
function Edit_Item_Target_Form(){
	
	var self = this;
	
	this.Refresh = function(data){
		
		self.data = data;
		
		Refresh_Select_HTML_From_Table(
			self.edit_item_target_name_select.id,
			data.items,
			"item_id",
			"item_name");
		
		Refresh_Select_HTML_From_Table(
			self.edit_item_target_id_select.id,
			data.item_targets,
			"item_target_id",
			"name");
		
		this.Selected_Item_Target_Change();
	};
	
	this.Refresh_From_Diff = function(diff){
		
		Refresh_Select_HTML_From_Table_Diff(
			self.edit_item_target_name_select.id,
			diff.data.items,
			"item_id",
			"item_name");
		
		Refresh_Select_HTML_From_Table_Diff(
			self.edit_item_target_id_select.id,
			diff.data.item_targets,
			"item_target_id",
			"name");
		
		this.Selected_Item_Target_Change();
		
	};
	
	this.Selected_Item_Target_Change = function(){
		
		selected_index = document.getElementById(self.edit_item_target_id_select.id).selectedIndex;
		
		document.getElementById(self.item_edit_target_time.id).disabled = false;
		document.getElementById(self.edit_item_target_type_select.id).disabled = false;
		document.getElementById(self.item_edit_target_value.id).disabled = false;
		document.getElementById(self.edit_item_target_name_select.id).disabled = false;
		document.getElementById(self.edit_item_target_recurrance_type_select.id).disabled = false;
		document.getElementById(self.edit_item_target_period.id).disabled = false;
		document.getElementById(self.edit_item_target_recurring_select.id).disabled = false;
		document.getElementById(self.edit_item_target_variance.id).disabled = false;
		document.getElementById(self.edit_item_target_recurring_period.id).disabled = false;
		document.getElementById(this.edit_item_target_recurring_end_date.id).disabled = false;
		
		if(selected_index != 0)
		{
			selected_target = self.data.item_targets[selected_index - 1];
			
			if(selected_target.recurring_child_id != 0)
			{
				document.getElementById(self.item_edit_target_time.id).disabled = true;
				document.getElementById(self.edit_item_target_type_select.id).disabled = true;
				document.getElementById(self.item_edit_target_value.id).disabled = true;
				document.getElementById(self.edit_item_target_name_select.id).disabled = true;
				document.getElementById(self.edit_item_target_recurrance_type_select.id).disabled = true;
				document.getElementById(self.edit_item_target_period.id).disabled = true;
				document.getElementById(self.edit_item_target_recurring_select.id).disabled = true;
				document.getElementById(self.edit_item_target_variance.id).disabled = true;
				document.getElementById(self.edit_item_target_recurring_period.id).disabled = true;
				document.getElementById(self.edit_item_target_recurring_end_date.id).disabled = true;
			}
		
			$("#" + self.item_edit_target_time.id).val(selected_target.start_time);
			$("#" + self.edit_item_target_type_select.id).val(selected_target.type);
			$("#" + self.item_edit_target_value.id).val(selected_target.value);
			$("#" + self.edit_item_target_name_select.id).val(selected_target.item_id);
			$("#" + self.edit_item_target_recurrance_type_select.id).val(selected_target.period_type);
			$("#" + self.edit_item_target_period.id).val(selected_target.period);
			$("#" + self.edit_item_target_recurring_select.id).val(selected_target.recurring);
			$("#" + self.edit_item_target_variance.id).val(selected_target.allowed_variance);
			$("#" + self.edit_item_target_recurring_period.id).val(selected_target.recurrance_period);
			$('#' + self.edit_item_target_recurring_end_date.id).val(selected_target.recurrance_end_time);
			$('#' + self.edit_item_target_status_select.id).val(selected_target.status);
		}
		else
		{
			$("#" + self.item_edit_target_time.id).val();
			$("#" + self.edit_item_target_type_select.id).val('sum');
			$("#" + self.item_edit_target_value.id).val('');
			$("#" + self.edit_item_target_name_select.id).val(0);
			$("#" + self.edit_item_target_recurrance_type_select.id).val('Minutes');
			$("#" + self.edit_item_target_period.id).val('');
			$("#" + self.edit_item_target_recurring_select.id).val(0);
			$("#" + self.edit_item_target_variance.id).val('');
			$("#" + self.edit_item_target_recurring_period.id).val('');
		}
		
		
		
	};
	
	this.Edit_Item_Target_Click = function(){
		
		var item_target_id = $("#" + self.edit_item_target_id_select.id).val();
		var start_time = $("#" + self.item_edit_target_time.id).val();
		var type = $("#" + self.edit_item_target_type_select.id).val();
		var value = $("#" + self.item_edit_target_value.id).val();
		var item = $("#" + self.edit_item_target_name_select.id).val();
		var period_type = $("#" + self.edit_item_target_recurrance_type_select.id).val();
		var period = $("#" + self.edit_item_target_period.id).val();
		var variance = $("#" + self.edit_item_target_variance.id).val();
		var status = $('#' + self.edit_item_target_status_select.id).val();
		var recurring = $("#" + self.edit_item_target_recurring_select.id).val();
		var recurrance_period = $("#" + self.edit_item_target_recurring_period.id).val();
		var recurrance_end_date = $("#" + self.edit_item_target_recurring_end_date.id).val();
		
		if(item_target_id == 0)
		{
			alert('Select an item target.');
		}
		else if(value == '')
		{
			alert('Enter a value.');
		}
		else if(item == 0)
		{
			alert('Select an item.');
		}
		else if(period == '')
		{
			alert('Enter a period.');
		}
		else
		{
			
			var params = new Array();
			params[0] = item_target_id;
			params[1] = Cast_Local_Server_Datetime_To_UTC_Server_Datetime(start_time);
			params[2] = type;
			params[3] = value;
			params[4] = item;
			params[5] = period_type;
			params[6] = period;
			params[7] = variance;
			params[8] = status;
			params[9] = recurring;
			params[10] = recurrance_period;
			params[11] = recurrance_end_date;

			//execute the RPC callback for retrieving the item log
			app.api.Item_Data_Interface.Update_Item_Target(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.success == 'true') {
					
					alert('Item target updated!');
					
				} else {
					
					alert('Item target failed to update.');
					
				}

				//refresh the items
				app.api.Refresh_Data(function() {
					//self.refresh_item_log_callback();
				});
			});
			
		}
		
	};
	
	this.Edit_Item_Target_Delete_Click = function(){
		
		var item_target_id = $("#" + self.edit_item_target_id_select.id).val();
		
		if(item_target_id == 0)
		{
			alert('Select an item target.');
		}
		else
		{
			
			var params = new Array();
			params[0] = item_target_id;
			
			var r=confirm("Are you sure you want to delete this item target?");
			
			if (r==true)
			{
			
				//execute the RPC callback for retrieving the item log
				app.api.Item_Data_Interface.Delete_Item_Target(params, function(jsonRpcObj) {
	
					if (jsonRpcObj.result.success == 'true') {
						
						alert('Item target deleted!');
						
					} else {
						
						alert('Item target failed to delete.');
						
					}
	
					//refresh the items
					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});
				});
			}
		}
		
	};
	
	this.Render = function(form_div_id) {
		
		this.edit_item_target_form = document.createElement("form");
		this.edit_item_target_form.setAttribute('method', "post");
		this.edit_item_target_form.setAttribute('id', "edit_item_target_form");
		
		this.edit_item_target_form.innerHTML += 'Item Target:<br />';

		//item unit
		this.edit_item_target_id_select = document.createElement("select");
		this.edit_item_target_id_select.setAttribute('id', "edit_item_target_id_select");
		this.edit_item_target_id_select.innerHTML = '<option value="0">-</option>';
		this.edit_item_target_form.appendChild(this.edit_item_target_id_select);

		this.edit_item_target_form.innerHTML += '<br />';
		
		this.edit_item_target_form.innerHTML += '<br />';
		
		this.edit_item_target_form.innerHTML += 'Start Time:<br />';

		//item value
		this.item_edit_target_time = document.createElement("input");
		this.item_edit_target_time.setAttribute('name', "new_time");
		this.item_edit_target_time.setAttribute('id', "item_edit_target_time");
		this.item_edit_target_time.setAttribute('type', 'text');
		this.edit_item_target_form.appendChild(this.item_edit_target_time);
		
		this.edit_item_target_form.innerHTML += '<br />';
		
		this.edit_item_target_form.innerHTML += 'Type:<br />';

		//item unit
		this.edit_item_target_type_select = document.createElement("select");
		this.edit_item_target_type_select.setAttribute('id', "edit_item_target_type_select");
		this.edit_item_target_type_select.innerHTML = '<option>Sum</option>';
		this.edit_item_target_type_select.innerHTML += '<option>Average</option>';
		this.edit_item_target_form.appendChild(this.edit_item_target_type_select);

		this.edit_item_target_form.innerHTML += '<br />';
		
		this.edit_item_target_form.innerHTML += 'Value:<br />';

		//item value
		this.item_edit_target_value = document.createElement("input");
		this.item_edit_target_value.setAttribute('name', "item_edit_target_value");
		this.item_edit_target_value.setAttribute('id', "item_edit_target_value");
		this.item_edit_target_value.setAttribute('type', 'text');
		this.edit_item_target_form.appendChild(this.item_edit_target_value);
		
		this.edit_item_target_form.innerHTML += '<br />';
		
		this.edit_item_target_form.innerHTML += 'Item:<br />';

		//item unit
		this.edit_item_target_name_select = document.createElement("select");
		this.edit_item_target_name_select.setAttribute('name', "edit_item_target_name_select");
		this.edit_item_target_name_select.setAttribute('id', "edit_item_target_name_select");
		this.edit_item_target_name_select.innerHTML = '<option>-</option>';
		this.edit_item_target_form.appendChild(this.edit_item_target_name_select);

		this.edit_item_target_form.innerHTML += '<br />';
		
		this.edit_item_target_form.innerHTML += 'Period Type:<br />';

		//item unit
		this.edit_item_target_recurrance_type_select = document.createElement("select");
		this.edit_item_target_recurrance_type_select.setAttribute('id', "edit_item_target_recurrance_type_select");
		this.edit_item_target_recurrance_type_select.innerHTML = '<option>Minutes</option>';
		this.edit_item_target_recurrance_type_select.innerHTML += '<option>Hours</option>';
		this.edit_item_target_recurrance_type_select.innerHTML += '<option>Days</option>';
		this.edit_item_target_recurrance_type_select.innerHTML += '<option>Weeks</option>';
		this.edit_item_target_recurrance_type_select.innerHTML += '<option>Weekly</option>';
		this.edit_item_target_recurrance_type_select.innerHTML += '<option>Months</option>';
		this.edit_item_target_recurrance_type_select.innerHTML += '<option>Years</option>';
		this.edit_item_target_form.appendChild(this.edit_item_target_recurrance_type_select);

		this.edit_item_target_form.innerHTML += '<br />';
		
		this.edit_item_target_form.innerHTML += 'Period:<br />';

		//item value
		this.edit_item_target_period = document.createElement("input");
		this.edit_item_target_period.setAttribute('id', "edit_item_target_period");
		this.edit_item_target_period.setAttribute('type', 'text');
		this.edit_item_target_form.appendChild(this.edit_item_target_period);
		
		this.edit_item_target_form.innerHTML += '<br />';
		
		this.edit_item_target_form.innerHTML += 'Variance:<br />';

		//item value
		this.edit_item_target_variance = document.createElement("input");
		this.edit_item_target_variance.setAttribute('id', "edit_item_target_variance");
		this.edit_item_target_variance.setAttribute('type', 'text');
		this.edit_item_target_form.appendChild(this.edit_item_target_variance);
		
		this.edit_item_target_form.innerHTML += '<br />';
		
		this.edit_item_target_form.innerHTML += 'Status:<br />';

		//item unit
		this.edit_item_target_status_select = document.createElement("select");
		this.edit_item_target_status_select.setAttribute('id', "edit_item_target_status_select");
		this.edit_item_target_status_select.innerHTML = '<option>Incomplete</option>';
		this.edit_item_target_status_select.innerHTML += '<option>Complete</option>';
		this.edit_item_target_status_select.innerHTML += '<option>Missed</option>';
		this.edit_item_target_form.appendChild(this.edit_item_target_status_select);

		this.edit_item_target_form.innerHTML += '<br />';
		
		this.edit_item_target_form.innerHTML += '<br />';
		
		this.edit_item_target_form.innerHTML += 'Recurring:<br />';

		//item unit
		this.edit_item_target_recurring_select = document.createElement("select");
		this.edit_item_target_recurring_select.setAttribute('id', "edit_item_target_recurring_select");
		this.edit_item_target_recurring_select.innerHTML = '<option value="0">False</option>';
		this.edit_item_target_recurring_select.innerHTML += '<option value="1">True</option>';
		this.edit_item_target_form.appendChild(this.edit_item_target_recurring_select);

		this.edit_item_target_form.innerHTML += '<br />';
		
		this.edit_item_target_form.innerHTML += 'Recurrance Period:<br />';

		//item value
		this.edit_item_target_recurring_period = document.createElement("input");
		this.edit_item_target_recurring_period.setAttribute('id', "edit_item_target_recurring_period");
		this.edit_item_target_recurring_period.setAttribute('type', 'text');
		this.edit_item_target_form.appendChild(this.edit_item_target_recurring_period);
		
		this.edit_item_target_form.innerHTML += '<br />';
		
		this.edit_item_target_form.innerHTML += 'Recurrance End Date:<br />';

		//item value
		this.edit_item_target_recurring_end_date = document.createElement("input");
		this.edit_item_target_recurring_end_date.setAttribute('id', "edit_item_target_recurring_end_date");
		this.edit_item_target_recurring_end_date.setAttribute('type', 'text');
		this.edit_item_target_form.appendChild(this.edit_item_target_recurring_end_date);
		
		this.edit_item_target_form.innerHTML += '<br />';

		this.edit_item_target_form.innerHTML += '<br />';
		
		//button creation
		this.item_edit_target_button = document.createElement("input");
		this.item_edit_target_button.setAttribute('id', 'item_edit_target_button');
		this.item_edit_target_button.setAttribute('type', 'submit');
		this.item_edit_target_button.value = 'Submit';
		this.edit_item_target_form.appendChild(this.item_edit_target_button);

		this.edit_item_target_form.innerHTML += '<br />';

		this.edit_item_target_form.innerHTML += '<br />';
		
		//button creation
		this.item_edit_target_delete_button = document.createElement("input");
		this.item_edit_target_delete_button.setAttribute('id', 'item_edit_target_delete_button');
		this.item_edit_target_delete_button.setAttribute('type', 'submit');
		this.item_edit_target_delete_button.value = 'Delete';
		this.edit_item_target_form.appendChild(this.item_edit_target_delete_button);

		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.edit_item_target_form);
		
		$('#' + this.edit_item_target_id_select.id).change(function(event) {

			//execute the click event
			self.Selected_Item_Target_Change();
		});
		
		$('#' + this.item_edit_target_button.id).button();
		$('#' + this.item_edit_target_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.Edit_Item_Target_Click();
		});
		
		$('#' + this.item_edit_target_delete_button.id).button();
		$('#' + this.item_edit_target_delete_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.Edit_Item_Target_Delete_Click();
		});

		//initialize the datetime picker
		$('#' + this.item_edit_target_time.id).datetimepicker({
			timeFormat : "HH:mm:ss",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.item_edit_target_time.id).datetimepicker("setDate", new Date());
		
		//initialize the datetime picker
		$('#' + this.edit_item_target_recurring_end_date.id).datetimepicker({
			timeFormat : "HH:mm:ss",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.edit_item_target_recurring_end_date.id).datetimepicker("setDate", new Date());
	
	};
}