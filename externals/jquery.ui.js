var jquery_ui_modules = [
	'jquery',
	'jquery.ui.lib',
];

var jquery_ui_plugins = [
	'jquery.ui.touch-punch',
	'jquery.ui.timepicker-addon',
	'jquery.ui.fullcalendar',
	'jquery.ui.pivot',
];

var modules = jquery_ui_modules.concat(jquery_ui_plugins);

//groups all jquery UI moduels into a single include
define(modules,function ($){
	return $;
});