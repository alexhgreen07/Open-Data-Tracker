/** This is the edit item target form class which holds all UI objects for editing item targets.
 * @constructor Edit_Item_Target_Form
 */
function Edit_Item_Target_Form(){
	
	var self = this;
	
	this.Refresh = function(data){
		
		
	};
	
	this.Edit_Item_Target_Click = function(){
		
		alert('Edit item target button click.');
		
	};
	
	this.Edit_Item_Target_Delete_Click = function(){
		
		alert('Edit item target delete button click.');
		
	};
	
	this.Render = function(form_div_id) {
		
		this.edit_item_target_form = document.createElement("form");
		this.edit_item_target_form.setAttribute('method', "post");
		this.edit_item_target_form.setAttribute('id', "edit_item_target_form");
		
		this.edit_item_target_form.innerHTML += 'Item Target:<br />';

		//item unit
		this.edit_item_target_id_select = document.createElement("select");
		this.edit_item_target_id_select.setAttribute('id', "edit_item_target_id_select");
		this.edit_item_target_id_select.innerHTML = '<option>-</option>';
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
		this.edit_item_target_recurrance_period = document.createElement("input");
		this.edit_item_target_recurrance_period.setAttribute('id', "edit_item_target_recurrance_period");
		this.edit_item_target_recurrance_period.setAttribute('type', 'text');
		this.edit_item_target_form.appendChild(this.edit_item_target_recurrance_period);
		
		this.edit_item_target_form.innerHTML += '<br />';
		
		this.edit_item_target_form.innerHTML += 'Recurring:<br />';

		//item unit
		this.edit_item_target_recurring_select = document.createElement("select");
		this.edit_item_target_recurring_select.setAttribute('id', "edit_item_target_recurring_select");
		this.edit_item_target_recurring_select.innerHTML = '<option>False</option>';
		this.edit_item_target_recurring_select.innerHTML += '<option>True</option>';
		this.edit_item_target_form.appendChild(this.edit_item_target_recurring_select);

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
			timeFormat : "HH:mm",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.item_edit_target_time.id).datetimepicker("setDate", new Date());
	
	};
}