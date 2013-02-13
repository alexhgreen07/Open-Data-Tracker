function Item_Tab (item_div_id) {

	//class variables
	this.div_id = item_div_id;
	this.item_value;
	this.quick_item_name_select;
	this.new_item_name_select;
	this.item_note;
	this.loading_image;
	this.refresh_item_log_callback;
	this.items_list;
	
	this.Refresh_Items = function(refresh_callback)
	{
		var params = new Array();
		
		var self = this;
		
		//show the loader image
		$('#' + self.loading_image.id).show();
		
		//execute the RPC callback for retrieving the item log
		rpc.Item_Data_Interface.Get_Items(params,function(jsonRpcObj){
			
			if(jsonRpcObj.result.authenticated == 'true')
			{
				if(jsonRpcObj.result.success == 'true')
				{
					self.items_list = jsonRpcObj.result.items;
					
					self.Refresh_Item_Entry_List();
					
					self.Refresh_Item_View();
					
					self.Refresh_Item_Data(function()
					{
						refresh_callback();
					});
					
					
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
			
			
		});
		
	};
	
	this.Refresh_Item_Entry_List = function()
	{
		var self = this;
		var new_inner_html = '';
				
		new_inner_html += '<option>-</option>';
		
		for (var i = 0; i < self.items_list.length; i++)
		{
			new_inner_html += '<option>' + self.items_list[i].item_name + '</option>';
		}
		
		document.getElementById(self.quick_item_name_select.id).innerHTML = new_inner_html;
		document.getElementById(self.new_item_name_select.id).innerHTML = new_inner_html;
		
	};
	
	this.Refresh_Item_View = function()
	{
		var new_inner_html = '';
		
		new_inner_html += '<table width="100%" border="1">';
		
		new_inner_html += '<tr>';
		new_inner_html += '<td>Name</td>';
		new_inner_html += '<td>Description</td>';
		new_inner_html += '<td>Unit</td>';
		new_inner_html += '<td>Date Created</td>';
		new_inner_html += '</tr>';
		
		for(var i = 0; i < this.items_list.length; i++)
		{
			
			new_inner_html += '<tr>';
			
			new_inner_html += '<td>' + this.items_list[i].item_name + '</td>';
			new_inner_html += '<td>' + this.items_list[i].item_description + '</td>';
			new_inner_html += '<td>' + this.items_list[i].item_unit + '</td>';
			new_inner_html += '<td>' + this.items_list[i].date_created + '</td>';
			
			new_inner_html += '</tr>';
		}
		
		new_inner_html += '</table>';
		
		this.item_display_div.innerHTML = new_inner_html;
	};
	
	this.Refresh_Item_Data = function(refresh_callback)
	{
		var self = this;
		
		//show the loader image
		$('#' + self.item_log_loading_image.id).show();
		
		var params = new Array();
		
		
		//execute the RPC callback for retrieving the item log
		rpc.Item_Data_Interface.Get_Item_Log(params,function(jsonRpcObj){
			
			//RPC complete. Set appropriate HTML.
			var new_html = '';
			
			new_html += 'Last refreshed: ' + (new Date()) + '<br />';
			new_html += jsonRpcObj.result.html;
			
			document.getElementById(self.new_data_display_div.id).innerHTML = new_html;
			
			//hide the loader image
			$('#' + self.item_log_loading_image.id).hide();
			
			refresh_callback();
		});
	};
	
	this.On_Click_Event = function()
	{
		
		//alert('calling rpc onclick.');
		
		this.Refresh_Item_Data();
		
	};
	
	this.Add_Quick_Item_Entry_Click = function() 
	{
		
		var self = this;
		
		//get the value string
		var value_string = $("#" + self.item_value.id).val();
		var item_select_index = $("#" + self.quick_item_name_select.id).prop("selectedIndex");
		var note_string = $("#" + self.item_note.id).val();
		
		//check that the string is numeric
		if(!isNaN(Number(value_string)) && value_string != '')
		{
			
			
		
			//show the loader image
			$('#' + self.loading_image.id).show();
			
			var params = new Array();
			params[0] = value_string;
			params[1] = self.items_list[item_select_index - 1].item_id;
			params[2] = note_string;
		
			//execute the RPC callback for retrieving the item log
			rpc.Item_Data_Interface.Insert_Quick_Item_Entry(params,function(jsonRpcObj){
				
				if(jsonRpcObj.result.authenticated == 'true')
				{
					if(jsonRpcObj.result.success == 'true')
					{
						alert('New item entry added!');
						
						self.Refresh_Item_Data(function()
						{
							self.refresh_item_log_callback();
						});
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
				$("#" + self.quick_item_name_select.id).val('-');
				$("#" + self.item_note.id).val('');
				
			});
		}
		else
		{
			alert('The value field must be numeric.');
		}
		
	};
	
	this.Add_Item_Entry_Click = function() 
	{
		
		var self = this;
		
		//get the value string
		var time_string = $("#" + self.item_new_time.id).val();
		var value_string = $("#" + self.item_new_value.id).val();
		var item_select_index = $("#" + self.new_item_name_select.id).prop("selectedIndex");
		var note_string = $("#" + self.item_new_note.id).val();
		
		//check that the string is numeric
		if(!isNaN(Number(value_string)) && value_string != '')
		{
			
			
		
			//show the loader image
			$('#' + self.new_loading_image.id).show();
			
			var params = new Array();
			params[0] = time_string;
			params[1] = value_string;
			params[2] = self.items_list[item_select_index - 1].item_id;
			params[3] = note_string;
		
			//execute the RPC callback for retrieving the item log
			rpc.Item_Data_Interface.Insert_Item_Entry(params,function(jsonRpcObj){
				
				if(jsonRpcObj.result.authenticated == 'true')
				{
					if(jsonRpcObj.result.success == 'true')
					{
						//alert(jsonRpcObj.result.debug);
						alert('New item entry added!');
						
						self.Refresh_Item_Data(function()
						{
							self.refresh_item_log_callback();
						});
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
				$('#' + self.new_loading_image.id).hide();
				
				//reset all the fields to default
				$("#" + self.item_new_value.id).val('');
				$("#" + self.new_item_name_select.id).val('-');
				$("#" + self.item_new_note.id).val('');
				
				
				
			});
		}
		else
		{
			alert('The value field must be numeric.');
		}
		
	};
	
	this.Add_New_Item_Click = function()
	{
		var self = this;
		
		//get the value string
		var name_string = $("#" + self.item_name.id).val();
		var note_string = $("#" + self.item_description.id).val();
		var unit_string = $("#" + self.item_new_unit.id).val();
		
		if(name_string != '')
		{
		
			//show the loader image
			$('#' + self.loading_image_add_item.id).show();
		
			var params = new Array();
			params[0] = name_string;
			params[1] = unit_string;
			params[2] = note_string;
	
			//execute the RPC callback for retrieving the item log
			rpc.Item_Data_Interface.Add_New_Item(params,function(jsonRpcObj){
			
				if(jsonRpcObj.result.authenticated == 'true')
				{
					if(jsonRpcObj.result.success == 'true')
					{
						alert('New item added!');
					}
					else
					{
						alert('Item failed to add.');
					}

				}
				else
				{
					alert('You are not logged in. Please refresh the page and login again.');
				}
			
				//hide the loader image
				$('#' + self.loading_image_add_item.id).hide();
			
				//reset all the fields to default
				$("#" + self.item_name.id).val('');
				$("#" + self.item_description.id).val('');
				$("#" + self.item_new_unit.id).val('');
				
				//refresh the items
				self.Refresh_Items();
			});
		
		}
		else
		{
			alert('Item name cannot be empty!');
		}

	};
	
	this.Render_Quick_Item_Entry_Form = function(form_div_id) {
		
		//create the top form
		this.item_quick_entry_data_form = document.createElement("form");
		this.item_quick_entry_data_form.setAttribute('method',"post");
		this.item_quick_entry_data_form.setAttribute('id',"quick_item_entry_form");
	
		this.item_quick_entry_data_form.innerHTML += 'Value:<br />';
		
		//item value
		this.item_value = document.createElement("input");
		this.item_value.setAttribute('name',"value");
		this.item_value.setAttribute('id',"value");
		this.item_value.setAttribute('type','text');
		this.item_quick_entry_data_form.appendChild(this.item_value);
		
		this.item_quick_entry_data_form.innerHTML += 'Item:<br />';
		
		//item unit
		this.quick_item_name_select = document.createElement("select");
		this.quick_item_name_select.setAttribute('name',"task_name_dropdown");
		this.quick_item_name_select.setAttribute('id',"task_name_dropdown");
		this.quick_item_name_select.innerHTML = '<option>-</option>';
		this.item_quick_entry_data_form.appendChild(this.quick_item_name_select);
		
		this.item_quick_entry_data_form.innerHTML += 'Note:<br />';
		
		//item note
		this.item_note = document.createElement("input");
		this.item_note.setAttribute('name',"notes");
		this.item_note.setAttribute('id',"notes");
		this.item_note.setAttribute('type','text');
		this.item_quick_entry_data_form.appendChild(this.item_note);
		
		this.item_quick_entry_data_form.innerHTML += '<br /><br />';
		
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
			self.Add_Quick_Item_Entry_Click();
		});
		this.item_quick_entry_data_form.appendChild(this.item_add_entry_button);
		
		this.loading_image = document.createElement("img");
		this.loading_image.setAttribute('id','item_tab_quick_item_entry_loader_image');
		this.loading_image.setAttribute('style','width:100%;height:19px;');
		this.loading_image.setAttribute('src','ajax-loader.gif');
		this.item_quick_entry_data_form.appendChild(this.loading_image);
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.item_quick_entry_data_form);
		
	};
	
	this.Render_New_Item_Entry_Form = function(form_div_id) {
		
		//create the top form
		this.item_new_entry_data_form = document.createElement("form");
		this.item_new_entry_data_form.setAttribute('method',"post");
		this.item_new_entry_data_form.setAttribute('id',"new_item_entry_form");
		
		this.item_new_entry_data_form.innerHTML += 'Time:<br />';
		
		//item value
		this.item_new_time = document.createElement("input");
		this.item_new_time.setAttribute('name',"new_time");
		this.item_new_time.setAttribute('id',"new_time");
		this.item_new_time.setAttribute('type','text');
		this.item_new_entry_data_form.appendChild(this.item_new_time);
		
		this.item_new_entry_data_form.innerHTML += 'Value:<br />';
		
		//item value
		this.item_new_value = document.createElement("input");
		this.item_new_value.setAttribute('name',"new_value");
		this.item_new_value.setAttribute('id',"new_value");
		this.item_new_value.setAttribute('type','text');
		this.item_new_entry_data_form.appendChild(this.item_new_value);
		
		this.item_new_entry_data_form.innerHTML += 'Item:<br />';
		
		//item unit
		this.new_item_name_select = document.createElement("select");
		this.new_item_name_select.setAttribute('name',"new_task_name_dropdown");
		this.new_item_name_select.setAttribute('id',"new_task_name_dropdown");
		this.new_item_name_select.innerHTML = '<option>-</option>';
		this.item_new_entry_data_form.appendChild(this.new_item_name_select);
		
		this.item_new_entry_data_form.innerHTML += 'Note:<br />';
		
		//item note
		this.item_new_note = document.createElement("input");
		this.item_new_note.setAttribute('name',"new_notes");
		this.item_new_note.setAttribute('id',"new_notes");
		this.item_new_note.setAttribute('type','text');
		this.item_new_entry_data_form.appendChild(this.item_new_note);
		
		this.item_new_entry_data_form.innerHTML += '<br /><br />';
		
		//task start/stop button creation
		this.item_new_add_entry_button = document.createElement("input");
		this.item_new_add_entry_button.setAttribute('id','new_task_entry_start_stop');
		this.item_new_add_entry_button.setAttribute('type','submit');
		this.item_new_add_entry_button.value = 'Submit';
		var self = this;
		this.item_new_entry_data_form.appendChild(this.item_new_add_entry_button);
		
		this.new_loading_image = document.createElement("img");
		this.new_loading_image.setAttribute('id','item_tab_new_item_entry_loader_image');
		this.new_loading_image.setAttribute('style','width:100%;height:19px;');
		this.new_loading_image.setAttribute('src','ajax-loader.gif');
		this.item_new_entry_data_form.appendChild(this.new_loading_image);
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.item_new_entry_data_form);
		
		//hide the loader image
		$('#' + self.new_loading_image.id).hide();
		
		$('#' + this.item_new_add_entry_button.id).button();
		$('#' + this.item_new_add_entry_button.id).click(function( event ) {
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			//execute the click event
			self.Add_Item_Entry_Click();
		});
		
		//initialize the datetime picker
		$('#' + this.item_new_time.id).datetimepicker({
			timeFormat: "HH:mm",
			dateFormat: 'yy-mm-dd'
		});
		$('#' + this.item_new_time.id).datetimepicker("setDate", new Date());
		$('#' + this.item_new_time.id).datetimepicker("setDate", new Date());
		
	};
	
	this.Render_View_Items_Form = function(div_id) {
	
		//create the top form
		this.item_display_div = document.getElementById(div_id);
		
		//unknown if this will work...
		//this.Refresh_Item_View();
		
	};
	
	this.Render_Add_Item_Form = function(form_div_id)
	{
		//create the top form
		this.item_add_data_form = document.createElement("form");
		this.item_add_data_form.setAttribute('method',"post");
		this.item_add_data_form.setAttribute('id',"add_item_entry_form");
	
		this.item_add_data_form.innerHTML += 'Name:<br />';
		
		//item name
		this.item_name = document.createElement("input");
		this.item_name.setAttribute('name',"item_name");
		this.item_name.setAttribute('id',"item_name");
		this.item_name.setAttribute('type','text');
		this.item_add_data_form.appendChild(this.item_name);
		
		this.item_add_data_form.innerHTML += 'Category:<br />';
		
		//task recurring
		this.item_category_select = document.createElement("select");
		this.item_category_select.setAttribute('id','item_category_select');
		this.item_category_select.innerHTML = '<option>-</option>';
		this.item_add_data_form.appendChild(this.item_category_select);
		
		this.item_add_data_form.innerHTML += 'Description:<br />';
		
		//item description
		this.item_description = document.createElement("input");
		this.item_description.setAttribute('name',"item_description");
		this.item_description.setAttribute('id',"item_description");
		this.item_description.setAttribute('type','text');
		this.item_add_data_form.appendChild(this.item_description);
		
		this.item_add_data_form.innerHTML += 'Unit:<br />';
		
		//item note
		this.item_new_unit = document.createElement("input");
		this.item_new_unit.setAttribute('name',"add_item_unit");
		this.item_new_unit.setAttribute('id',"add_item_unit");
		this.item_new_unit.setAttribute('type','text');
		this.item_add_data_form.appendChild(this.item_new_unit);
		
		this.item_add_data_form.innerHTML += '<br /><br />';
		
		//task start/stop button creation
		this.item_add_button = document.createElement("input");
		this.item_add_button.setAttribute('id','item_add');
		this.item_add_button.setAttribute('type','submit');
		this.item_add_button.value = 'Submit';
		var self = this;
		$(this.item_add_button).button();
		$(this.item_add_button).click(function( event ) {
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			//execute the click event
			self.Add_New_Item_Click();
		});
		this.item_add_data_form.appendChild(this.item_add_button);
		
		this.loading_image_add_item = document.createElement("img");
		this.loading_image_add_item.setAttribute('id','item_tab_add_item_entry_loader_image');
		this.loading_image_add_item.setAttribute('style','width:100%;height:19px;');
		this.loading_image_add_item.setAttribute('src','ajax-loader.gif');
		this.item_add_data_form.appendChild(this.loading_image_add_item);
		
		$(this.loading_image_add_item).hide();
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.item_add_data_form);
	};
	
	this.Render_Item_Log = function(form_div_id)
	{
		var self = this;
		var return_html = '';
		
		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method',"post");
		this.data_form.setAttribute('id',"data_display_form");
		
		this.button = document.createElement("input");
		this.button.setAttribute('type','submit');
		this.button.setAttribute('id','data_submit_button');
		this.button.value = 'Refresh';
		
		this.data_form.appendChild(this.button);
		
		this.item_log_loading_image = document.createElement("img");
		this.item_log_loading_image.setAttribute('id','item_log_loader_image');
		this.item_log_loading_image.setAttribute('style','width:100%;height:19px;');
		this.item_log_loading_image.setAttribute('src','ajax-loader.gif');
		this.data_form.appendChild(this.item_log_loading_image);

		this.new_data_display_div = document.createElement("div");
		this.new_data_display_div.setAttribute('id','new_item_data_display_div');
		this.data_form.appendChild(this.new_data_display_div);
		
		var div_tab = document.getElementById(form_div_id);
		
		div_tab.innerHTML = '';
			
		div_tab.appendChild(this.data_form);
		
		$(this.button).button();
		$(this.button).click(function( event ) {
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			//execute the click event
			self.On_Click_Event();
		});
		
		
		
	};

	//render function (div must already exist)
	this.Render = function() {
		
		var tabs_array = new Array();
		
		var new_tab;
		
		new_tab = new Array();
		new_tab.push("Quick Item Entry");
		new_tab.push('<div id="quick_item_entry_div"></div>');
		tabs_array.push(new_tab);
		
		new_tab = new Array();
		new_tab.push("New Item Entry");
		new_tab.push('<div id="new_item_entry_div"></div>');
		tabs_array.push(new_tab);
		
		new_tab = new Array();
		new_tab.push("Edit Item Entry");
		new_tab.push("Under construction...");
		tabs_array.push(new_tab);
		
		new_tab = new Array();
		new_tab.push("View Item Log");
		new_tab.push('<div id="view_item_log_div"></div>');
		tabs_array.push(new_tab);
		
		new_tab = new Array();
		new_tab.push("New Item");
		new_tab.push('<div id="add_item_div"></div>');
		tabs_array.push(new_tab);
		
		new_tab = new Array();
		new_tab.push("Edit Item");
		new_tab.push("Under construction...");
		tabs_array.push(new_tab);
		
		new_tab = new Array();
		new_tab.push("View Items");
		new_tab.push('<div id="view_item_div"></div>');
		tabs_array.push(new_tab);
		
		var return_html = '';
		
		return_html += '<div id="items_accordian"></div>';
		
		var div_tab = document.getElementById(this.div_id);

		div_tab.innerHTML = return_html;
		
		var items_accordian = new Accordian('items_accordian',tabs_array);
		
		items_accordian.Render();
		
		//render the accordian panes
		this.Render_Quick_Item_Entry_Form('quick_item_entry_div');
		
		this.Render_New_Item_Entry_Form('new_item_entry_div');
		
		this.Render_Add_Item_Form('add_item_div');
		
		this.Render_View_Items_Form('view_item_div');
		
		this.Render_Item_Log('view_item_log_div');
		
	};
}




