<?php


Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../externals/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../externals/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//jquery datepicker code
include_once(dirname(__FILE__).'/../../externals/jquery-ui-timepicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../externals/json-rpc2php/jsonRPC2php.client.js');


?>


/** This is a function call queue for JSON RPC.
 * @constructor JSON_RPC_Queue
 */
function JSON_RPC_Queue() {
	
	this.is_busy = false;
	this.function_queue = [];
	this.arguments_queue = [];
	this.callback_queue = [];
	
	this.Run = function(){
		
		var self = this;
		self.is_busy = true;
		
		rpc_function = self.function_queue.shift();
		rpc_arguments = self.arguments_queue.shift();
		rpc_callback = self.callback_queue.shift();
		
		rpc_function(rpc_arguments, function(jsonRpcObj){
			
			rpc_callback(jsonRpcObj);
			
			if (self.function_queue.length > 0) {
			
			      self.Run();
			}
			
			self.is_busy = false;
			
		});
		
		
		
		
	};
	
    this.Queue_RPC = function(rpc_function, rpc_arguments, rpc_callback){
    	
    	this.function_queue.push(rpc_function);
    	this.arguments_queue.push(rpc_arguments);
    	this.callback_queue.push(rpc_callback);
    	
    	if(!this.is_busy)
    	{
    		this.Run();
    	}
    	
    };
    
    
}



