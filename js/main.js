function Main_Application()
{
	//initialize the main tab array
	this.tabs_array = new Array();

	//setup the main tabs
	this.Setup_Main_Tabs = function() {
	
		var main_tabs_div = "main_tab_navigation_div";
	
		//append the main tab div
		document.body.innerHTML += '<div id="' + main_tabs_div + '"></div>';
		
		this.tabs_array[0] = new Array();
		this.tabs_array[0][0] = "Home";
		this.tabs_array[0][1] = "<div id='home_tab_div'></div>";
		
		this.tabs_array[1] = new Array();
		this.tabs_array[1][0] = "Items";
		this.tabs_array[1][1] = "<div id='item_tab_div'></div>";
		
		this.tabs_array[2] = new Array();
		this.tabs_array[2][0] = "Tasks";
		this.tabs_array[2][1] = "<div id='task_tab_div'></div>";
		
		this.tabs_array[3] = new Array();
		this.tabs_array[3][0] = "Data";
		this.tabs_array[3][1] = "<div id='data_tab_div'></div>";
		
		this.tabs_array[4] = new Array();
		this.tabs_array[4][0] = "Graphs";
		this.tabs_array[4][1] = "<div id='graph_tab_div'></div>";
		
		//render the tabs
		var main_tab_nav = new Tabs(main_tabs_div,this.tabs_array);
		main_tab_nav.Render();
		
		var home_tab_object = new Home_Tab('home_tab_div');
		home_tab_object.Render();
		
		var item_tab_object = new Item_Tab('item_tab_div');
		item_tab_object.Render();
		
		var task_tab_object = new Task_Tab('task_tab_div');
		task_tab_object.Render();
		
		var data_tab_object = new Data_Tab('data_tab_div');
		data_tab_object.Render();
		
		var graph_tab_object = new Graph_Tab('graph_tab_div');
		graph_tab_object.Render();
	};
	
	//load a script to the head
	this.Load_Script = function(url, callback) {
	
		// adding the script tag to the head as suggested before
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;

		// then bind the event to the callback function 
		// there are several events for cross browser compatibility
		script.onreadystatechange = callback;
		script.onload = callback;

		// fire the loading
		head.appendChild(script);
	
	};
	
}

//this is the main function for the application
function main()
{

	var app = new Main_Application();
	
	app.Setup_Main_Tabs();

}



