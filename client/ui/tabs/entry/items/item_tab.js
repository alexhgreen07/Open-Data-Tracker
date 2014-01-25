/** This is the item tab class which holds all UI objects for item data.
 * @constructor Item_Tab
 */
function Item_Tab() {

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
	
	/** This is the view items form object.
	 * @type View_Items_Form
	 * */
	this.view_items_form = new View_Items_Form();
	
	/** This is the new item targets form object.
	 * @type New_Item_Target_Form
	 * */
	this.new_item_target_form = new New_Item_Target_Form();
	
	/** This is the edit item targets form object.
	 * @type Edit_Item_Target_Form
	 * */
	this.edit_item_target_form = new Edit_Item_Target_Form();
	
	/** @method Refresh_Items
	 * @desc This function retrieves the item list from the database.
	 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
	 * */
	this.Refresh = function(data) {
		
		this.Refresh_Items(data);
		this.Refresh_Item_Entries(data);
		this.Refresh_Item_Targets(data);
		this.Refresh_Item_Categories(data);

	};
	
	/** @method Refresh_Items
	 * @desc This function refreshes the items HTML select objects.
	 * */
	this.Refresh_Items = function(data) {
		var self = this;
		
		this.items_list = data.items;

		Refresh_Select_HTML_From_Table(
			self.new_item_target_form.new_item_target_name_select.id,
			data.items,
			"item_id",
			"item_name");
		
		Refresh_Select_HTML_From_Table(
			self.edit_item_target_form.edit_item_target_name_select.id,
			data.items,
			"item_id",
			"item_name");
		
		
		this.quick_item_entry_form.Refresh(data);
		this.new_item_entry_form.Refresh(data);
		this.edit_item_entry_form.Refresh(data);
		this.edit_item_form.Refresh(data);
		this.view_items_form.Refresh(data);

	};
	
	this.Refresh_Item_Entries = function(data){
		
		
		this.edit_item_entry_form.Refresh(data);
		this.view_item_entries_form.Refresh(data);
		
	};
	
	this.Refresh_Item_Targets = function(data){
		
		var self = this;
		
		Refresh_Select_HTML_From_Table(
			this.edit_item_target_form.edit_item_target_id_select.id,
			data.item_targets,
			"item_target_id",
			"name");
		
		this.edit_item_target_form.Refresh(data);
		
	};
	
	this.Refresh_Item_Categories = function(data){
		
		Refresh_Select_HTML_From_Table(
			this.new_item_form.item_category_select.id,
			data.categories,
			"category_id",
			"category_path");
		
		Refresh_Select_HTML_From_Table(
			this.edit_item_form.item_edit_category_select.id,
			data.categories,
			"category_id",
			"category_path");
	};
	
	this.Show_Form = function(div_id){
		
		for(var i = 0; i < this.div_ids.length; i++)
		{
			if(div_id == this.div_ids[i])
			{
				$('#'+this.div_ids[i]).show();
			}
			else
			{
				$('#'+this.div_ids[i]).hide();
			}
			
		}
		
	};
	
	/** @method Render
	 * @desc This function will render the full tab in the div that it was initialized with.
	 * */
	this.Render = function(item_div_id) {
		
		this.div_ids = [
			'quick_item_entry_div',
			'new_item_entry_div',
			'edit_item_log_div',
			'view_item_log_div',
			'add_item_div',
			'edit_item_div',
			'view_item_div',
			'new_item_target_div',
			'edit_item_target_div',
		];
		
		var return_html = '';
		
		for(var i = 0; i < this.div_ids.length; i++)
		{
			return_html += '<div id="'+this.div_ids[i]+'"></div>';
		}

		var div_tab = document.getElementById(item_div_id);
		div_tab.innerHTML = return_html;
		
		//render the accordian panes
		this.quick_item_entry_form.Render('quick_item_entry_div');

		this.new_item_entry_form.Render('new_item_entry_div');

		this.edit_item_entry_form.Render('edit_item_log_div');

		this.view_item_entries_form.Render('view_item_log_div');

		this.new_item_form.Render('add_item_div');
	
		this.edit_item_form.Render('edit_item_div');

		this.view_items_form.Render('view_item_div');
		
		this.new_item_target_form.Render('new_item_target_div');
		
		this.edit_item_target_form.Render('edit_item_target_div');
		
		for(var i = 0; i < this.div_ids.length; i++)
		{
			$('#'+this.div_ids[i]).hide();
		}
	};
}

