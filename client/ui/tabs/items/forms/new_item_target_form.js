/** This is the new item target form class which holds all UI objects for new item target entry.
 * @constructor New_Item_Target_Form
 */
function New_Item_Target_Form(){

	
	this.Render = function(form_div_id) {
		
		this.new_item_target_form = document.createElement("form");
		this.new_item_target_form.setAttribute('method', "post");
		this.new_item_target_form.setAttribute('id', "new_item_target_form");
		
		this.new_item_target_form.innerHTML = 'Under construction...';
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.new_item_target_form);
	
	};
}