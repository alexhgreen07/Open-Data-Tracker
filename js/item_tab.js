function Item_Tab (item_div_id) {

	//class variables
	this.div_id = item_div_id;
	this.item_value;
	this.unit_name_select;
	this.item_note;
	this.loading_image;
	this.refresh_item_log_callback;

	this.Add_Item_Entry_Click = function() 
	{
		
		var self = this;
		
		//get the value string
		var value_string = $("#" + self.item_value.id).val();
		var unit_string = $("#" + self.unit_name_select.id).val();
		var note_string = $("#" + self.item_note.id).val();
		
		//check that the string is numeric
		if(!isNaN(Number(value_string)) && value_string != '')
		{
			
			
		
			//show the loader image
			$('#' + self.loading_image.id).show();
			
			var params = new Array();
			params[0] = value_string;
			params[1] = unit_string;
			params[2] = note_string;
		
			//execute the RPC callback for retrieving the item log
			rpc.Data_Interface.Insert_Item_Entry(params,function(jsonRpcObj){
				
				if(jsonRpcObj.result.authenticated == 'true')
				{
					if(jsonRpcObj.result.success == 'true')
					{
						alert('New item entry added!');
					}
					else
					{
						alert('Item entry failed to add.');
					}

				}
				else
				{
					alert('You are not logged in. Please refresh the page and login again.');
				}
				
				//hide the loader image
				$('#' + self.loading_image.id).hide();
				
				//reset all the fields to default
				$("#" + self.item_value.id).val('');
				$("#" + self.unit_name_select.id).val('-');
				$("#" + self.item_note.id).val('');
				
				self.refresh_item_log_callback();
			});
		}
		else
		{
			alert('The value field must be numeric.');
		}
		
	};
	
	this.Refresh_Items = function(refresh_callback)
	{
		var params = new Array();
		
		var self = this;
		
		//show the loader image
		$('#' + self.loading_image.id).show();
		
		//execute the RPC callback for retrieving the item log
		rpc.Data_Interface.Get_Items_Names(params,function(jsonRpcObj){
			
			if(jsonRpcObj.result.authenticated == 'true')
			{
				if(jsonRpcObj.result.success == 'true')
				{
					var new_inner_html = '';
					
					new_inner_html += '<option>-</option>';
					
					for (var i = 0; i < jsonRpcObj.result.items.length; i++)
					{
						new_inner_html += '<option>' + jsonRpcObj.result.items[i] + '</option>';
					}
					
					document.getElementById(self.unit_name_select.id).innerHTML = new_inner_html;
					
				}
				else
				{
					alert('Items failed to refresh.');
				}

			}
			else
			{
				alert('You are not logged in. Please refresh the page and login again.');
			}
			
			//hide the loader image
			$('#' + self.loading_image.id).hide();
			
			refresh_callback();
		});
		
	};
	
	

	this.Render_New_Item_Entry_Form = function(form_div_id) {
		
		//create the top form
		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method',"post");
		this.data_form.setAttribute('id',"new_item_entry_form");
	
		this.data_form.innerHTML += 'Value:<br />';
		
		//item value
		this.item_value = document.createElement("input");
		this.item_value.setAttribute('name',"value");
		this.item_value.setAttribute('id',"value");
		this.item_value.setAttribute('type','text');
		this.data_form.appendChild(this.item_value);
		
		this.data_form.innerHTML += 'Unit:<br />';
		
		//item unit
		this.unit_name_select = document.createElement("select");
		this.unit_name_select.setAttribute('name',"unit_dropdown");
		this.unit_name_select.setAttribute('id',"unit_dropdown");
		this.unit_name_select.innerHTML = '<option>-</option>';
		this.data_form.appendChild(this.unit_name_select);
		
		this.data_form.innerHTML += 'Note:<br />';
		
		//item note
		this.item_note = document.createElement("input");
		this.item_note.setAttribute('name',"notes");
		this.item_note.setAttribute('id',"notes");
		this.item_note.setAttribute('type','text');
		this.data_form.appendChild(this.item_note);
		
		this.data_form.innerHTML += '<br /><br />';
		
		//task start/stop button creation
		this.item_add_entry_button = document.createElement("input");
		this.item_add_entry_button.setAttribute('id','task_entry_start_stop');
		this.item_add_entry_button.setAttribute('type','submit');
		this.item_add_entry_button.value = 'Submit';
		var self = this;
		$(this.item_add_entry_button).button();
		$(this.item_add_entry_button).click(function( event ) {
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			//execute the click event
			self.Add_Item_Entry_Click();
		});
		this.data_form.appendChild(this.item_add_entry_button);
		
		this.loading_image = document.createElement("img");
		this.loading_image.setAttribute('id','item_tab_new_item_entry_loader_image');
		this.loading_image.setAttribute('style','width:100%;height:19px;');
		this.loading_image.setAttribute('src','ajax-loader.gif');
		this.data_form.appendChild(this.loading_image);
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.data_form);
		
	};
	
	this.Render_View_Items_Form = function() {
	
		var return_html = '';
		
		//NOT IMPLEMENTED
		
		return return_html;
	};

	//render function (div must already exist)
	this.Render = function() {
		
		var tabs_array = new Array();
		
		tabs_array[0] = new Array();
		tabs_array[0][0] = "New Item Entry";
		tabs_array[0][1] = '<div id="new_item_entry_div"></div>';
		
		tabs_array[1] = new Array();
		tabs_array[1][0] = "View Items";
		tabs_array[1][1] = "Under construction...";
		
		tabs_array[2] = new Array();
		tabs_array[2][0] = "New Item";
		tabs_array[2][1] = "Under construction...";
		
		tabs_array[3] = new Array();
		tabs_array[3][0] = "Edit Item";
		tabs_array[3][1] = "Under construction...";
		
		var return_html = '';
		
		return_html += '<div id="items_accordian"></div>';
		
		var div_tab = document.getElementById(this.div_id);

		div_tab.innerHTML = return_html;
		
		var items_accordian = new Accordian('items_accordian',tabs_array);
		
		items_accordian.Render();
		
		//render the accordian panes
		this.Render_New_Item_Entry_Form('new_item_entry_div');
		
		
	};
}




