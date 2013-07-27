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
	
	this.Build_Method = function(method, source_object){
		
		var self = this;
		
		var return_function = function(args,callback){
        	
        	
        	self.rpc_queue.Queue_RPC(
				source_object[method],
				args,
				function(jsonRpcObj){
					
					
					callback(jsonRpcObj);
					
				});
        	
        };
        
        return return_function;
		
	};
	
	this.Add_Object_Methods = function(source_object, destination_object)
	{
		var self = this;
		//iterate through all the members of the object
	    for(var member in source_object) {
	    	
	    	//if the member is a function, add the function
        	if(typeof(source_object[member]) == "function"){
        		
        		
        		destination_object[member] = self.Build_Method(member, source_object);
	            
            }
            else if(typeof(source_object[member]) == "object")
            {
            	
            	destination_object[member] = {};
            	self.Add_Object_Methods(source_object[member], destination_object[member]);
            	
            }
        
	    }
	    
	}
	
	this.Connect = function(url, callback){
		
		var self = this;
		
		self.rpc = new jsonrpcphp(url, function() {
			
			self.Add_Object_Methods(self.rpc, self);
			
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