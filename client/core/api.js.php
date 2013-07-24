<?php


Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../external/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once(dirname(__FILE__).'/../external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//jquery datepicker code
include_once(dirname(__FILE__).'/../external/jquery-ui-timerpicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../external/json-rpc2php-master/jsonRPC2php.client.js');

include_once(dirname(__FILE__).'/json_rpc_queue.js.php');

?>


/** Represents the main api to the server.
 * @constructor Server_API
 */
function Server_API() {
	
	this.rpc_queue = new JSON_RPC_Queue();
	
	this.rpc = null;
	
	this.Connect = function(url, callback){
		
		this.rpc = new jsonrpcphp(url, function() {

			callback();
	
		});
		
	};
	
	this.Refresh_Data = function(callback) {
		
		var self = this;
		
		this.rpc_queue.Queue_RPC(
			this.rpc.Data_Interface.Refresh_All_Data,
			[],
			function(jsonRpcObj){
				
				self.data = jsonRpcObj.result.data;
				
				callback();
				
			});
		
	};
	
	this.Insert_Quick_Item_Entry = function() {
		
		
		
	};
	
	this.Insert_Item_Entry = function() {
		
		
		
	};
	
}