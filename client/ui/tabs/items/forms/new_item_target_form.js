/** This is the new item target form class which holds all UI objects for new item target entry.
 * @constructor New_Item_Target_Form
 */
function New_Item_Target_Form(){
	
	var self = this;
	
	this.Refresh = function(data){
		
		
	};
	
	this.Add_Item_Target_Click = function(){
		
		var start_time = $("#" + self.item_target_time.id).val();
		var type = $("#" + self.new_item_target_type_select.id).val();
		var value = $("#" + self.item_target_value.id).val();
		var item = $("#" + self.new_item_target_name_select.id).val();
		var period_type = $("#" + self.new_item_target_recurrance_type_select.id).val();
		var period = $("#" + self.item_target_recurrance_period.id).val();
		var recurring = $("#" + self.new_item_target_recurring_select.id).val();
		
		if(value == '')
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
			params[0] = start_time;
			params[1] = type;
			params[2] = value;
			params[3] = item;
			params[4] = period_type;
			params[5] = period;
			params[6] = recurring;

			//execute the RPC callback for retrieving the item log
			app.api.Item_Data_Interface.Insert_Item_Target(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.authenticated == 'true') {
					
					if (jsonRpcObj.result.success == 'true') {
						
						alert('New item target added!');
						
					} else {
						
						alert('Item target failed to add.');
						
					}

				} else {
					alert('You are not logged in. Please refresh the page and login again.');
				}

				//refresh the items
				app.api.Refresh_Data(function() {
					//self.refresh_item_log_callback();
				});
			});
			
		}
		
		
	};
	
	this.Render = function(form_div_id) {
		
		this.new_item_target_form = document.createElement("form");
		this.new_item_target_form.setAttribute('method', "post");
		this.new_item_target_form.setAttribute('id', "new_item_target_form");
		
		this.new_item_target_form.innerHTML += 'Start Time:<br />';

		//item value
		this.item_target_time = document.createElement("input");
		this.item_target_time.setAttribute('name', "new_time");
		this.item_target_time.setAttribute('id', "item_target_time");
		this.item_target_time.setAttribute('type', 'text');
		this.new_item_target_form.appendChild(this.item_target_time);
		
		this.new_item_target_form.innerHTML += '<br />';
		
		this.new_item_target_form.innerHTML += 'Type:<br />';

		//item unit
		this.new_item_target_type_select = document.createElement("select");
		this.new_item_target_type_select.setAttribute('id', "new_item_target_type_select");
		this.new_item_target_type_select.innerHTML = '<option>Sum</option>';
		this.new_item_target_type_select.innerHTML += '<option>Average</option>';
		this.new_item_target_form.appendChild(this.new_item_target_type_select);

		this.new_item_target_form.innerHTML += '<br />';
		
		this.new_item_target_form.innerHTML += 'Value:<br />';

		//item value
		this.item_target_value = document.createElement("input");
		this.item_target_value.setAttribute('name', "item_target_value");
		this.item_target_value.setAttribute('id', "item_target_value");
		this.item_target_value.setAttribute('type', 'text');
		this.new_item_target_form.appendChild(this.item_target_value);
		
		this.new_item_target_form.innerHTML += '<br />';
		
		this.new_item_target_form.innerHTML += 'Item:<br />';

		//item unit
		this.new_item_target_name_select = document.createElement("select");
		this.new_item_target_name_select.setAttribute('name', "new_item_target_name_select");
		this.new_item_target_name_select.setAttribute('id', "new_item_target_name_select");
		this.new_item_target_name_select.innerHTML = '<option>-</option>';
		this.new_item_target_form.appendChild(this.new_item_target_name_select);

		this.new_item_target_form.innerHTML += '<br />';

		this.new_item_target_form.innerHTML += '<br />';
		
		this.new_item_target_form.innerHTML += 'Period Type:<br />';

		//item unit
		this.new_item_target_recurrance_type_select = document.createElement("select");
		this.new_item_target_recurrance_type_select.setAttribute('id', "new_item_target_recurrance_type_select");
		this.new_item_target_recurrance_type_select.innerHTML = '<option>Minutes</option>';
		this.new_item_target_recurrance_type_select.innerHTML += '<option>Hours</option>';
		this.new_item_target_recurrance_type_select.innerHTML += '<option>Days</option>';
		this.new_item_target_recurrance_type_select.innerHTML += '<option>Weeks</option>';
		this.new_item_target_recurrance_type_select.innerHTML += '<option>Weekly</option>';
		this.new_item_target_recurrance_type_select.innerHTML += '<option>Months</option>';
		this.new_item_target_recurrance_type_select.innerHTML += '<option>Years</option>';
		this.new_item_target_form.appendChild(this.new_item_target_recurrance_type_select);

		this.new_item_target_form.innerHTML += '<br />';
		
		this.new_item_target_form.innerHTML += 'Period:<br />';

		//item value
		this.item_target_recurrance_period = document.createElement("input");
		this.item_target_recurrance_period.setAttribute('id', "item_target_recurrance_period");
		this.item_target_recurrance_period.setAttribute('type', 'text');
		this.new_item_target_form.appendChild(this.item_target_recurrance_period);
		
		this.new_item_target_form.innerHTML += '<br />';
		
		this.new_item_target_form.innerHTML += 'Recurring:<br />';

		//item unit
		this.new_item_target_recurring_select = document.createElement("select");
		this.new_item_target_recurring_select.setAttribute('id', "new_item_target_recurring_select");
		this.new_item_target_recurring_select.innerHTML = '<option>False</option>';
		this.new_item_target_recurring_select.innerHTML += '<option>True</option>';
		this.new_item_target_form.appendChild(this.new_item_target_recurring_select);

		this.new_item_target_form.innerHTML += '<br />';

		this.new_item_target_form.innerHTML += '<br />';
		
		//button creation
		this.item_new_target_button = document.createElement("input");
		this.item_new_target_button.setAttribute('id', 'item_new_target_button');
		this.item_new_target_button.setAttribute('type', 'submit');
		this.item_new_target_button.value = 'Submit';
		this.new_item_target_form.appendChild(this.item_new_target_button);

		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.new_item_target_form);
		
		$('#' + this.item_new_target_button.id).button();
		$('#' + this.item_new_target_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.Add_Item_Target_Click();
		});

		//initialize the datetime picker
		$('#' + this.item_target_time.id).datetimepicker({
			timeFormat : "HH:mm",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.item_target_time.id).datetimepicker("setDate", new Date());

	};
}