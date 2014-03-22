var jquery_ui_path = 'externals/jquery-ui/ui';
var jquery_path = 'externals/jquery-ui/jquery-1.10.2';

//setup all paths and shim configurations
require.config({
    paths : {
    	'jsonrpc' : 'externals/jsonrpc',
    	'jsonrpc_lib' : 'externals/json-rpc2php/jsonRPC2php.client',
    	'fastclick' : 'externals/fastclick/lib/fastclick',
        'jquery' : jquery_path,
        'jquery.ui' : 'externals/jquery.ui',
        'jquery.ui.core' : jquery_ui_path + '/jquery.ui.core',
        'jquery.ui.widget' : jquery_ui_path + '/jquery.ui.widget',
        'jquery.ui.mouse' : jquery_ui_path + '/jquery.ui.mouse',
        'jquery.ui.position' : jquery_ui_path + '/jquery.ui.position',
        'jquery.ui.draggable' : jquery_ui_path + '/jquery.ui.draggable',
        'jquery.ui.droppable' : jquery_ui_path + '/jquery.ui.droppable',
        'jquery.ui.resizable' : jquery_ui_path + '/jquery.ui.resizable',
        'jquery.ui.selectable' : jquery_ui_path + '/jquery.ui.selectable',
        'jquery.ui.sortable' : jquery_ui_path + '/jquery.ui.sortable',
        'jquery.ui.effect' : jquery_ui_path + '/jquery.ui.effect',
        'jquery.ui.button' : jquery_ui_path + '/jquery.ui.button',
        'jquery.ui.tabs' : jquery_ui_path + '/jquery.ui.tabs',
        'jquery.ui.accordion' : jquery_ui_path + '/jquery.ui.accordion',
        'jquery.ui.slider' : jquery_ui_path + '/jquery.ui.slider',
        'jquery.ui.datepicker' : jquery_ui_path + '/jquery.ui.datepicker',
        'jquery.ui.dialog' : jquery_ui_path + '/jquery.ui.dialog',
        'jquery.ui.menu' : jquery_ui_path + '/jquery.ui.menu',
        'jquery.ui.tooltip' : jquery_ui_path + '/jquery.ui.tooltip',
        'jquery.ui.touch-punch' : 'externals/jquery-ui-touch-punch/jquery.ui.touch-punch.min',
        'jquery.ui.timepicker-addon': 'externals/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon',
    },
	shim : {
		'jsonrpc' : ['jsonrpc_lib'],
		'jquery.ui.core' : ['jquery'],
		'jquery.ui.widget' : ['jquery.ui.core'],
		'jquery.ui.mouse' : ['jquery.ui.widget'],
		'jquery.ui.position' : ['jquery.ui.mouse'],
		'jquery.ui.button' : ['jquery.ui.widget'],
		'jquery.ui.tabs' : ['jquery.ui.widget'],
		'jquery.ui.accordion' : ['jquery.ui.widget'],
		'jquery.ui.slider' : ['jquery.ui.widget','jquery.ui.mouse'],
		'jquery.ui.datepicker' : ['jquery.ui.widget'],
		'jquery.ui.dialog' : ['jquery.ui.widget'],
		'jquery.ui.menu' : ['jquery.ui.widget'],
		'jquery.ui.tooltip' : ['jquery.ui.widget'],
		'jquery.ui.touch-punch' : ['jquery.ui.core'],
		'jquery.ui.timepicker-addon' : ['jquery.ui.datepicker','jquery.ui.slider'],
	},
	
});

/** This is the main application object to be used
 * during operation.
 * */
var app;

//setup all initial requires
require(['client/application', 'fastclick', 'jquery.ui'], function(application, fastclick, $) {
	
	$(document).ready(function(){
		
		fastclick.attach(document.body);

		app = new application.Main_Application();
		
		app.Initialize();
		
		
	});
	
});