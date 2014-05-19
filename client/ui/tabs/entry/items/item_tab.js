define([
        'jquery.ui',
        './forms/quick_item_entry_form',
        './forms/new_item_entry_form',
        './forms/edit_item_entry_form',
        './forms/new_item_form',
        './forms/edit_item_form',
        './forms/new_item_target_form',
        './forms/edit_item_target_form',
        ],function(
		$,
		quick_item_entry_form,
		new_item_entry_form,
		edit_item_entry_form,
		new_item_form,
		edit_item_form,
		new_item_target_form,
		edit_item_target_form){
	
	/** This is the item tab class which holds all UI objects for item data.
	 * @constructor Item_Tab
	 */
	function Item_Tab(
			init_quick_item_entry_form,
			init_new_item_entry_form,
			init_edit_item_entry_form,
			init_new_item_form,
			init_edit_item_form,
			init_new_item_target_form,
			init_edit_item_target_form) {

		/** This is the array for the item log.
		 * @type Array
		 * */
		this.item_log_data = [];
		
		/** This is the quick item entry form object.
		 * @type Quick_Item_Entry_Form
		 * */
		this.quick_item_entry_form = init_quick_item_entry_form;
		
		/** This is the new item entry form object.
		 * @type New_Item_Entry_Form
		 * */
		this.new_item_entry_form = init_new_item_entry_form;
		
		/** This is the edit item entry form object.
		 * @type Edit_Item_Entry_Form
		 * */
		this.edit_item_entry_form = init_edit_item_entry_form;
		
		/** This is the new item form object.
		 * @type New_Item_Form
		 * */
		this.new_item_form = init_new_item_form;
		
		/** This is the edit item form object.
		 * @type Edit_Item_Form
		 * */
		this.edit_item_form = init_edit_item_form;
		
		/** This is the new item targets form object.
		 * @type New_Item_Target_Form
		 * */
		this.new_item_target_form = init_new_item_target_form;
		
		/** This is the edit item targets form object.
		 * @type Edit_Item_Target_Form
		 * */
		this.edit_item_target_form = init_edit_item_target_form;
		
		/** @method Refresh_Items
		 * @desc This function retrieves the item list from the database.
		 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
		 * */
		this.Refresh = function(data) {
			
			this.quick_item_entry_form.Refresh(data);
			this.new_item_entry_form.Refresh(data);
			this.edit_item_entry_form.Refresh(data);
			this.new_item_form.Refresh(data);
			this.edit_item_form.Refresh(data);
			this.new_item_target_form.Refresh(data);
			this.edit_item_target_form.Refresh(data);
			
		};
		
		this.Refresh_From_Diff = function(diff, data){
			
			this.quick_item_entry_form.Refresh_From_Diff(diff, data);
			this.new_item_entry_form.Refresh_From_Diff(diff, data);
			this.edit_item_entry_form.Refresh_From_Diff(diff, data);
			this.new_item_form.Refresh_From_Diff(diff, data);
			this.edit_item_form.Refresh_From_Diff(diff, data);
			this.new_item_target_form.Refresh_From_Diff(diff, data);
			this.edit_item_target_form.Refresh_From_Diff(diff, data);
		};

		this.Show_Form = function(div_id){
			
			for(var key in this.div_forms)
			{
				if(div_id == this.div_forms[key].id)
				{
					$(this.div_forms[key]).fadeIn();
				}
				else
				{
					$(this.div_forms[key]).hide();
				}
				
			}
			
		};
		
		/** @method Render
		 * @desc This function will render the full tab in the div that it was initialized with.
		 * */
		this.Render = function(parent_div) {
			
			this.div_ids = [
				'quick_item_entry_div',
				'new_item_entry_div',
				'edit_item_log_div',
				'add_item_div',
				'edit_item_div',
				'new_item_target_div',
				'edit_item_target_div',
			];
			this.div_forms = {};
			
			var return_html = '';
			
			for(var i = 0; i < this.div_ids.length; i++)
			{
				var new_form = document.createElement('div');
				new_form.id = this.div_ids[i];
				
				this.div_forms[this.div_ids[i]] = parent_div.appendChild(new_form);
			}

			//render the panes
			this.quick_item_entry_form.Render(this.div_forms['quick_item_entry_div']);

			this.new_item_entry_form.Render(this.div_forms['new_item_entry_div']);

			this.edit_item_entry_form.Render(this.div_forms['edit_item_log_div']);

			this.new_item_form.Render(this.div_forms['add_item_div']);
		
			this.edit_item_form.Render(this.div_forms['edit_item_div']);

			this.new_item_target_form.Render('new_item_target_div');
			
			this.edit_item_target_form.Render('edit_item_target_div');
			
			for(var key in this.div_forms)
			{
				$(this.div_forms[key]).hide();
			}
		};
	}
	
	function Build_Item_Tab()
	{
		var init_quick_item_entry_form = quick_item_entry_form.Build_Quick_Item_Entry_Form();
		var init_new_item_entry_form = new_item_entry_form.Build_New_Item_Entry_Form();
		var init_edit_item_entry_form = edit_item_entry_form.Build_Edit_Item_Entry_Form();
		var init_new_item_form = new_item_form.Build_New_Item_Form();
		var init_edit_item_form = edit_item_form.Build_Edit_Item_Form();
		var init_new_item_target_form = new_item_target_form.Build_New_Item_Target_Form();
		var init_edit_item_target_form = edit_item_target_form.Build_Edit_Item_Target_Form();
		
		var built_item_tab = new Item_Tab(
				init_quick_item_entry_form,
				init_new_item_entry_form,
				init_edit_item_entry_form,
				init_new_item_form,
				init_edit_item_form,
				init_new_item_target_form,
				init_edit_item_target_form);
		
		return built_item_tab;
	}
	
	return {
		Build_Item_Tab: Build_Item_Tab,
		Item_Tab: Item_Tab,
	};
});




