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
		rpc.Data_Interface.Get_Home_Data_Summary(params,function(jsonRpcObj){
			
			
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
	
	//render function (div must already exist)
	this.Render = function() {
		
		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method',"post");
		this.data_form.setAttribute('id',"home_display_form");
		
		this.button = document.createElement("input");
		this.button.setAttribute('type','submit');
		this.button.setAttribute('id','home_submit_button');
		this.button.value = 'Refresh';
		
		var self = this;
		$(this.button).button();
		$(this.button).click(function( event ) {
			
			//ensure a normal postback does not occur
			event.preventDefault();
			
			//execute the click event
			self.On_Click_Event();
		});
		
		this.data_form.appendChild(this.button);
		
		this.loading_image = document.createElement("img");
		this.loading_image.setAttribute('id','home_tab_refresh_loader_image');
		this.loading_image.setAttribute('style','width:100%;height:19px;');
		this.loading_image.setAttribute('src','ajax-loader.gif');
		this.data_form.appendChild(this.loading_image);
		
		this.new_data_display_div = document.createElement("div");
		this.data_form.appendChild(this.new_data_display_div);
		
		var div_tab = document.getElementById(this.div_id);
		div_tab.innerHTML = '';
		div_tab.appendChild(this.data_form);
		
		//call the click event function
		this.On_Click_Event();


	};
}


