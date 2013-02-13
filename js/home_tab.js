function Home_Tab (home_div_id) {

	//class variables
	this.div_id = home_div_id;
	this.data_form;
	this.button;
	this.new_data_display_div;
	this.loading_image;
	
	this.Refresh_Data = function(refresh_callback)
	{
		var params = new Array();
		
		var self = this;
		
		//show the loader image
		$('#' + self.loading_image.id).show();
		
		//execute the RPC callback for retrieving the item log
		rpc.Home_Data_Interface.Get_Home_Data_Summary(params,function(jsonRpcObj){
			
			
			var new_inner_html = '';
			
			new_inner_html += 'Last refreshed: ' + (new Date()) + '<br />';
			
			new_inner_html += jsonRpcObj.result.html;
			
			self.new_data_display_div.innerHTML = new_inner_html;
			
			//hide the loader image
			$('#' + self.loading_image.id).hide();
			
			refresh_callback();
		});
	};
	
	this.On_Click_Event = function()
	{
		var self = this;
		
		this.Refresh_Data(function()
		{
			//empty
		});
	};
	
	this.Render_Summary_Home_Data = function(form_div_id)
	{
		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method',"post");
		this.data_form.setAttribute('id',"home_display_form");
		
		this.button = document.createElement("input");
		this.button.setAttribute('type','submit');
		this.button.setAttribute('id','home_submit_button');
		this.button.value = 'Refresh';
		
		this.data_form.appendChild(this.button);
		
		this.loading_image = document.createElement("img");
		this.loading_image.setAttribute('id','home_tab_refresh_loader_image');
		this.loading_image.setAttribute('style','width:100%;height:19px;');
		this.loading_image.setAttribute('src','ajax-loader.gif');
		this.data_form.appendChild(this.loading_image);
		
		this.new_data_display_div = document.createElement("div");
		this.data_form.appendChild(this.new_data_display_div);
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = '';
		div_tab.appendChild(this.data_form);
		
		var self = this;
		$('#' + this.button.id).button();
		$('#' + this.button.id).click(function( event ) {
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			//execute the click event
			self.On_Click_Event();
		});
	};
	
	this.Render_View_Category_Tab = function(form_div_id)
	{
		
		this.view_category_form = document.createElement("form");
		this.view_category_form.setAttribute('method',"post");
		this.view_category_form.setAttribute('id',"home_view_category_form");
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = 'Under construction...';
		div_tab.appendChild(this.view_category_form);
	};
	
	this.Render_Add_New_Category_Tab = function(form_div_id)
	{
		this.add_new_category_form = document.createElement("form");
		this.add_new_category_form.setAttribute('method',"post");
		this.add_new_category_form.setAttribute('id',"home_add_new_category_form");
		
		this.add_new_category_form.innerHTML += 'Name:<br />';
		
		this.add_new_category_name = document.createElement("input");
		this.add_new_category_name.setAttribute('type',"text");
		this.add_new_category_name.setAttribute('id',"add_new_category_name");
		this.add_new_category_form.appendChild(this.add_new_category_name);
		
		this.add_new_category_form.innerHTML += 'Description:<br />';
		
		this.add_new_category_description = document.createElement("input");
		this.add_new_category_description.setAttribute('type',"text");
		this.add_new_category_description.setAttribute('id',"add_new_category_description");
		this.add_new_category_form.appendChild(this.add_new_category_description);
		
		this.add_new_category_form.innerHTML += 'Parent Category:<br />';
		
		this.add_new_category_parent_select = document.createElement("select");
		this.add_new_category_parent_select.setAttribute('id',"add_new_category_parent_select");
		this.add_new_category_parent_select.innerHTML = '<option>-</option>';
		this.add_new_category_form.appendChild(this.add_new_category_parent_select);
		
		this.add_new_category_form.innerHTML += '<br /><br />';
		
		this.add_new_category_submit_button = document.createElement("input");
		this.add_new_category_submit_button.setAttribute('id','add_new_category_submit_button');
		this.add_new_category_submit_button.setAttribute('type','submit');
		this.add_new_category_submit_button.value = 'Submit';
		this.add_new_category_form.appendChild(this.add_new_category_submit_button);
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = '';
		div_tab.appendChild(this.add_new_category_form);
		
		$('#' + this.add_new_category_submit_button.id).button();
		$('#' + this.add_new_category_submit_button.id).click(function( event )
		{
			//ensure a normal postback does not occur
			event.preventDefault();
			
			
		});
	};
	
	this.Render_Edit_Category_Tab = function(form_div_id)
	{
		this.edit_category_form = document.createElement("form");
		this.edit_category_form.setAttribute('method',"post");
		this.edit_category_form.setAttribute('id',"home_edit_category_form");
		
		this.edit_category_form.innerHTML += 'Category:<br />';
		
		this.edit_category_parent_select = document.createElement("select");
		this.edit_category_parent_select.setAttribute('id',"edit_category_parent_select");
		this.edit_category_parent_select.innerHTML = '<option>-</option>';
		this.edit_category_form.appendChild(this.edit_category_parent_select);
		
		this.edit_category_form.innerHTML += '<br /><br />';
		
		this.edit_category_form.innerHTML += 'Name:<br />';
		
		this.edit_category_name = document.createElement("input");
		this.edit_category_name.setAttribute('type',"text");
		this.edit_category_name.setAttribute('id',"edit_category_name");
		this.edit_category_form.appendChild(this.edit_category_name);
		
		this.edit_category_form.innerHTML += 'Description:<br />';
		
		this.edit_category_description = document.createElement("input");
		this.edit_category_description.setAttribute('type',"text");
		this.edit_category_description.setAttribute('id',"edit_category_description");
		this.edit_category_form.appendChild(this.edit_category_description);
		
		this.edit_category_form.innerHTML += 'Parent Category:<br />';
		
		this.edit_category_parent_select = document.createElement("select");
		this.edit_category_parent_select.setAttribute('id',"edit_category_parent_select");
		this.edit_category_parent_select.innerHTML = '<option>-</option>';
		this.edit_category_form.appendChild(this.edit_category_parent_select);
		
		this.edit_category_form.innerHTML += '<br /><br />';
		
		this.edit_category_submit_button = document.createElement("input");
		this.edit_category_submit_button.setAttribute('id','edit_category_submit_button');
		this.edit_category_submit_button.setAttribute('type','submit');
		this.edit_category_submit_button.value = 'Submit';
		this.edit_category_form.appendChild(this.edit_category_submit_button);
		
		this.edit_category_form.innerHTML += '<br /><br />';		
		
		this.edit_category_delete_button = document.createElement("input");
		this.edit_category_delete_button.setAttribute('id','edit_category_delete_button');
		this.edit_category_delete_button.setAttribute('type','submit');
		this.edit_category_delete_button.value = 'Delete';
		this.edit_category_form.appendChild(this.edit_category_delete_button);
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = '';
		div_tab.appendChild(this.edit_category_form);
		
		$('#' + this.edit_category_submit_button.id).button();
		$('#' + this.edit_category_delete_button.id).button();
		
		$('#' + this.edit_category_submit_button.id).click(function( event )
		{
			//ensure a normal postback does not occur
			event.preventDefault();
			
			
		});
		
		$('#' + this.edit_category_delete_button.id).click(function( event )
		{
			//ensure a normal postback does not occur
			event.preventDefault();
			
			
		});
	};
	
	this.Render_General_Home_Form = function(form_div_id)
	{
		var tabs_array = new Array();
		var new_tab;
		
		new_tab = new Array();
		new_tab.push("View Categories");
		new_tab.push('<div id="home_category_view_tab"></div>');
		tabs_array.push(new_tab);
		
		new_tab = new Array();
		new_tab.push("New Category");
		new_tab.push('<div id="home_category_add_new_tab"></div>');
		tabs_array.push(new_tab);
		
		new_tab = new Array();
		new_tab.push("Edit Category");
		new_tab.push('<div id="home_category_edit_tab"></div>');
		tabs_array.push(new_tab);
		
		this.general_form = document.createElement("form");
		this.general_form.setAttribute('method',"post");
		this.general_form.setAttribute('id',"home_general_form");
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = '<div id="home_category_accordian_div"></div>';
		div_tab.appendChild(this.general_form);
		
		var category_accordian = new Accordian('home_category_accordian_div',tabs_array);
		category_accordian.Render();
		
		this.Render_View_Category_Tab('home_category_view_tab');
		this.Render_Add_New_Category_Tab('home_category_add_new_tab');
		this.Render_Edit_Category_Tab('home_category_edit_tab');
	};
	
	//render function (div must already exist)
	this.Render = function() {
		
		var tabs_array = new Array();
		var new_tab;
		
		new_tab = new Array();
		new_tab.push("Summary Data");
		new_tab.push('<div id="home_summary_data_div"></div>');
		tabs_array.push(new_tab);
		
		new_tab = new Array();
		new_tab.push("General");
		new_tab.push('<div id="home_general_div"></div>');
		tabs_array.push(new_tab);
		
		var return_html = '';
		
		return_html += '<div id="home_accordian"></div>';
		
		var div_tab = document.getElementById(this.div_id);

		div_tab.innerHTML = return_html;
		
		var items_accordian = new Accordian('home_accordian',tabs_array);
		items_accordian.Render();
		
		
		this.Render_Summary_Home_Data('home_summary_data_div');
		this.Render_General_Home_Form('home_general_div');
		
		//call the click event function
		this.On_Click_Event();


	};
}


