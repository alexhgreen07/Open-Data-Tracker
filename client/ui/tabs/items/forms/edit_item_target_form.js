/** This is the edit item target form class which holds all UI objects for editing item targets.
 * @constructor Edit_Item_Target_Form
 */
function Edit_Item_Target_Form(){

	
	this.Render = function(form_div_id) {
		
		this.edit_item_target_form = document.createElement("form");
		this.edit_item_target_form.setAttribute('method', "post");
		this.edit_item_target_form.setAttribute('id', "edit_item_target_form");
		
		this.edit_item_target_form.innerHTML = 'Under construction...';
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.edit_item_target_form);
	
	};
}