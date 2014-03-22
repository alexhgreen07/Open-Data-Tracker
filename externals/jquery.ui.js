var jquery_ui_modules = [
	'jquery',
	'jquery.ui.button',
	'jquery.ui.tabs',
	'jquery.ui.accordion',
	'jquery.ui.slider',
	'jquery.ui.datepicker',
	'jquery.ui.dialog',
	'jquery.ui.menu',
	'jquery.ui.tooltip',
];

var jquery_ui_plugins = [
	'jquery.ui.touch-punch',
	'jquery.ui.timepicker-addon',
];

var modules = jquery_ui_modules.concat(jquery_ui_plugins);

//groups all jquery UI moduels into a single include
define(modules,function ($){
	return $;
});