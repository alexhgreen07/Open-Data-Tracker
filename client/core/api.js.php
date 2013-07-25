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
	
	this.data_changed_callback = function(){};
	
	this.Add_RPC_Methods = function(rpc_object, destination_object)
	{
		var self = this;
	
	    for(var member in rpc_object) {
	    	
        	if(typeof rpc_object[member] == "function"){
        	
	            destination_object[member.toString()] = function(args,callback){
	            	
	            	self.rpc_queue.Queue_RPC(
						rpc_object[member],
						args,
						function(jsonRpcObj){
							
							
							callback(jsonRpcObj);
							
						});
	            	
	            };
	            
            }
            else if(typeof rpc_object[member] == "object")
            {
            	destination_object[member.toString()] = [];
            	self.Add_RPC_Methods(rpc_object[member], self[member.toString()]);
            }
        
	    }
	    
	}
	
	this.Connect = function(url, callback){
		
		var self = this;
		
		self.rpc = new jsonrpcphp(url, function() {
			
			self.Add_RPC_Methods(self.rpc, self);
			
			self.Refresh_Data(function(){
				
				callback();
				
			});
			
			
	
		});
		
	};
	
	this.Refresh_Data = function(callback) {
		
		var self = this;
		
		self.Data_Interface.Refresh_All_Data([],
			function(jsonRpcObj){
				
				self.data = jsonRpcObj.result.data;
				
				//call the data changed callback since the data was refreshed.
				self.data_changed_callback();
				
				callback();
				
			});
		
	};

	
}