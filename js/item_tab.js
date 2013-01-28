function Item_Tab (item_div_id) {

	//class variables
	this.div_id = item_div_id;

	this.Render_New_Item_Entry_Form = function() {
	
		var return_html = '';
		
		return_html += '<form method="post" style="text-align:center;" id="new_item_entry_form">';
		return_html += 'Value: <br><input type="text" class="text" name="value" /><br/>';
		return_html += 'Unit: <br><select name="unit_dropdown"></select><br/>';
		return_html += 'Note: <br><input type="text" class="text" name="notes" /><br/><br/>';
		return_html += '<button type="button">Submit</button><br/><br/></form>';
		
		return return_html;
	
	};
	
	this.Render_View_Items_Form = function() {
	
		var return_html = '';
		
		return return_html;
	};

	//render function (div must already exist)
	this.Render = function() {
		
		var tabs_array = new Array();
		
		tabs_array[0] = new Array();
		tabs_array[0][0] = "New Item Entry";
		tabs_array[0][1] = this.Render_New_Item_Entry_Form();
		
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
		
		
	};
}




