function Item_Tab () {

	//class variables

	this.Render_New_Item_Entry_Form = function() {
	
		var return_html = '';
		
		return_html += '<form method="post" style="text-align:center;" id="new_item_entry_form">';
		return_html += 'Value: <br><input type="text" class="text" name="value" /><br/>';
		return_html += 'Unit: <br><select name="unit_dropdown"></select><br/>';
		return_html += 'Note: <br><input type="text" class="text" name="notes" /><br/><br/>';
		return_html += '<input type="submit"><br/><br/></form>';
		
		return return_html;
	
	};
	
	this.Render_View_Items_Form = function() {
	
		var return_html = '';
		
		return return_html;
	};

	//render function (div must already exist)
	this.Render = function() {
		
		var tabs_array = new Array();
		
		this.tabs_array[0] = new Array();
		this.tabs_array[0][0] = "New Item Entry";
		this.tabs_array[0][1] = this.Render_New_Item_Entry_Form();
		
		this.tabs_array[1] = new Array();
		this.tabs_array[1][0] = "View Items";
		this.tabs_array[1][1] = "Under construction...";
		
		var return_html = '';
		
		return_html += '<div id="items_accordian"></div>';
		
		var items_accordian = Accordian('items_accordian',tabs_array);
		
		return_html += items_accordian.Render();
		
		
		return return_html;

	};
}




