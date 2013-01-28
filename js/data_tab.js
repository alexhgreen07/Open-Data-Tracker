function Data_Tab (data_div_id) {

	//class variables
	this.div_id = data_div_id;
	this.data_form;
	this.button;
	this.new_data_display_div;
	
	this.On_Click_Event = function()
	{
		
		//set local variable for scoping
		var data_div_to_refresh = this.new_data_display_div;
		
		
		var params = new Array();
		
		//execute the RPC callback for retrieving the item log
		rpc.Data_Interface.Get_Item_Log(params,function(jsonRpcObj){
			
			//RPC complete. Set appropriate HTML.
			var new_html = '';
			
			new_html += 'Last refreshed: ' + (new Date()) + '<br />';
			new_html += jsonRpcObj.result;
			
			data_div_to_refresh.innerHTML = new_html;

		});
	};
	
	//render function (div must already exist)
	this.Render = function() {
	
		var return_html = '';
		
		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method',"post");
		this.data_form.setAttribute('id',"data_display_form");
		
		this.button = document.createElement("input");
		this.button.setAttribute('type','submit');
		this.button.setAttribute('id','data_submit_button');
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

		this.new_data_display_div = document.createElement("div");
		
		this.data_form.appendChild(this.new_data_display_div);
		
		var div_tab = document.getElementById(this.div_id);
		
		div_tab.innerHTML = '';
			
		div_tab.appendChild(this.data_form);
		
		//call the click function to refresh data.
		this.On_Click_Event();
	};
}




