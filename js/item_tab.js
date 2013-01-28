function Item_Tab (item_div_id) {

	//class variables
	this.div_id = item_div_id;

	this.Add_Item_Entry_Click = function() 
	{
		alert('New item entry added!');
		
		//NOT IMPLEMENTED (RPC)
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




