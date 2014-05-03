
//setup all paths and shim configurations
require.config({
    paths : {
    	'jsonrpc' : 'externals/jsonrpc',
    	'jsonrpc_lib' : 'externals/json-rpc2php/jsonRPC2php.client',
    	'fastclick' : 'externals/fastclick/lib/fastclick',
    	'jquery.ui.jstree' : 'externals/jstree/dist/jstree.min',
    	'jquery' : 'externals/jquery-ui/jquery-1.9.0',
        'jquery.ui.lib' : 'externals/jquery-ui/dist/jquery-ui',
        'jquery.ui': 'externals/jquery.ui',
        'jquery.ui.touch-punch' : 'externals/jquery-ui-touch-punch/jquery.ui.touch-punch.min',
        'jquery.ui.timepicker-addon': 'externals/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon',
        'jquery.ui.fullcalendar': 'externals/fullcalendar/build/out/fullcalendar.min',
        'jquery.pivot': 'externals/pivot/pivot',
        'jquery.ui.pivot': 'externals/pivot/jquery_pivot',
    },
	shim : {
		//require shim
		'jsonrpc' : ['jsonrpc_lib'],
		//jquery shim
		'jquery.ui.lib' : ['jquery'],
		'jquery.ui.touch-punch' : ['jquery.ui.lib'],
		'jquery.ui.timepicker-addon' : ['jquery.ui.lib'],
		'jquery.ui.jstree' : ['jquery.ui.lib'],
		'jquery.ui.fullcalendar': ['jquery.ui.lib'],
		'jquery.pivot': ['jquery.ui.lib'],
		'jquery.ui.pivot': ['jquery.pivot'],
	},
	
});

/** This is the main application object to be used
 * during operation.
 * */
var app;

//setup all initial requires
require(['client/application', 'test/test', 'fastclick', 'jquery.ui'], function(application, test, fastclick, $) {
	
	
		$(document).ready(function(){
			
			fastclick.attach(document.body);
			
			if(!unit_test)
			{
				app = new application.Main_Application();
				
				app.Initialize();
			}
			else
			{
				//run unit tests
				test.Execute_Tests();
			}
			
		});
	
	
});