/** This is the view items form class which holds all UI objects for viewing items.
 * @constructor View_Items_Form
 */
function View_Items_Form(){
	
	
	/** @method Refresh
	 * @desc This function refreshes the item display pane table.
	 * */
	this.Refresh = function(data) {
		
		this.items_list = data.items;
		
		var new_inner_html = '';

		new_inner_html += '<table width="100%" border="1">';

		new_inner_html += '<tr>';
		new_inner_html += '<td>Name</td>';
		new_inner_html += '<td>Description</td>';
		new_inner_html += '<td>Unit</td>';
		new_inner_html += '<td>Date Created</td>';
		new_inner_html += '</tr>';

		for (var i = 0; i < this.items_list.length; i++) {

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
	
	/** @method Render
	 * @desc This function will render the view item entries form in the specified div.
	 * @param {String} div_id The div ID to render the form in.
	 * */
	this.Render = function(div_id) {

		//create the top form
		this.item_display_div = document.getElementById(div_id);

		//unknown if this will work...
		//this.Refresh_Item_View();

	};

	
}