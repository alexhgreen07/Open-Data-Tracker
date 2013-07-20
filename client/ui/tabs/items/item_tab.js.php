<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../../external/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../../external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//jquery datepicker code (addon)
include_once(dirname(__FILE__).'/../../../external/jquery-ui-timerpicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../external/json-rpc2php-master/jsonRPC2php.client.js');

//get accordian
require_once(dirname(__FILE__).'/../../accordian.js.php');

//get quick item entry form
require_once(dirname(__FILE__).'/forms/quick_item_entry_form.js.php');

//get new item entry form
require_once(dirname(__FILE__).'/forms/new_item_entry_form.js.php');

//get edit item entry form
require_once(dirname(__FILE__).'/forms/edit_item_entry_form.js.php');

//get view item entries form
require_once(dirname(__FILE__).'/forms/view_item_entries_form.js.php');

//get new item form
require_once(dirname(__FILE__).'/forms/new_item_form.js.php');

//get edit item form
require_once(dirname(__FILE__).'/forms/edit_item_form.js.php');

?>

/** This is the item tab class which holds all UI objects for item data.
 * @constructor Item_Tab
 */
function Item_Tab(item_div_id) {

	/** This is the parent div ID where the item tab is.
	 * @type String
	 * */
	this.div_id = item_div_id;
	
	/** This is the array for the item log.
	 * @type Array
	 * */
	this.item_log_data = Array();
	
	/** This is the quick item entry form object.
	 * @type Quick_Item_Entry_Form
	 * */
	this.quick_item_entry_form = new Quick_Item_Entry_Form();
	
	/** This is the new item entry form object.
	 * @type New_Item_Entry_Form
	 * */
	this.new_item_entry_form = new New_Item_Entry_Form();
	
	/** This is the edit item entry form object.
	 * @type Edit_Item_Entry_Form
	 * */
	this.edit_item_entry_form = new Edit_Item_Entry_Form();
	
	/** This is the edit item entry form object.
	 * @type Edit_Item_Entry_Form
	 * */
	this.view_item_entries_form = new View_Item_Entries_Form();
	
	/** This is the new item form object.
	 * @type New_Item_Form
	 * */
	this.new_item_form = new New_Item_Form();
	
	/** This is the edit item form object.
	 * @type Edit_Item_Form
	 * */
	this.edit_item_form = new Edit_Item_Form();
	
	/** @method Refresh_Items
	 * @desc This function retrieves the item list from the database.
	 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
	 * */
	this.Refresh_Items = function(refresh_callback) {
		var params = new Array();

		var self = this;

		//show the loader image
		$('#' + self.loading_image.id).show();

		//execute the RPC callback for retrieving the item log
		rpc.Item_Data_Interface.Get_Items(params, function(jsonRpcObj) {

			if (jsonRpcObj.result.authenticated == 'true') {
				if (jsonRpcObj.result.success == 'true') {
					self.items_list = jsonRpcObj.result.items;

					self.Refresh_Item_Entry_List();

					self.Refresh_Item_View();

					self.Refresh_Item_Data(function() {
						refresh_callback();
					});

				} else {
					alert('Items failed to refresh.');
				}

			} else {
				alert('You are not logged in. Please refresh the page and login again.');
			}

			//hide the loader image
			$('#' + self.loading_image.id).hide();

		});

	};
	
	/** @method Refresh_Item_Entry_List
	 * @desc This function refreshes the items HTML select objects.
	 * */
	this.Refresh_Item_Entry_List = function() {
		var self = this;
		var new_inner_html = '';

		new_inner_html += '<option>-</option>';

		for (var i = 0; i < self.items_list.length; i++) {
			new_inner_html += '<option>' + self.items_list[i].item_name + '</option>';
		}

		document.getElementById(self.quick_item_name_select.id).innerHTML = new_inner_html;
		document.getElementById(self.new_item_name_select.id).innerHTML = new_inner_html;
		document.getElementById(self.item_edit_select.id).innerHTML = new_inner_html;
		document.getElementById(self.edit_item_name_select.id).innerHTML = new_inner_html;

	};

	/** @method Refresh_Item_View
	 * @desc This function refreshes the item display pane table.
	 * */
	this.Refresh_Item_View = function() {
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
	
	/** @method Render_View_Items_Form
	 * @desc This function will render the view item entries form in the specified div.
	 * @param {String} div_id The div ID to render the form in.
	 * */
	this.Render_View_Items_Form = function(div_id) {

		//create the top form
		this.item_display_div = document.getElementById(div_id);

		//unknown if this will work...
		//this.Refresh_Item_View();

	};

	/** @method Render
	 * @desc This function will render the full tab in the div that it was initialized with.
	 * */
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
		new_tab.push('<div id="edit_item_log_div"></div>');
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
		new_tab.push('<div id="edit_item_div"></div>');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("View Items");
		new_tab.push('<div id="view_item_div"></div>');
		tabs_array.push(new_tab);
		
		new_tab = new Array();
		new_tab.push("New Target Entry");
		new_tab.push('Under construction...');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("Edit Target Entry");
		new_tab.push('Under construction...');
		tabs_array.push(new_tab);

		new_tab = new Array();
		new_tab.push("View Targets");
		new_tab.push('Under construction...');
		tabs_array.push(new_tab);

		var return_html = '';

		return_html += '<div id="items_accordian"></div>';

		var div_tab = document.getElementById(this.div_id);

		div_tab.innerHTML = return_html;

		var items_accordian = new Accordian('items_accordian', tabs_array);

		items_accordian.Render();

		//render the accordian panes
		this.quick_item_entry_form.Render('quick_item_entry_div');

		this.new_item_entry_form.Render('new_item_entry_div');

		this.edit_item_entry_form.Render('edit_item_log_div');

		this.view_item_entries_form.Render('view_item_log_div');

		this.new_item_form.Render('add_item_div');
	
		this.edit_item_form.Render('edit_item_div');

		this.Render_View_Items_Form('view_item_div');

	};
}

