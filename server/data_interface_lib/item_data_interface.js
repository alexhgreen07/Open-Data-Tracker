var database = require('./../database.js');

module.exports = {
	Insert_Item_Entry: function(params, session, callback){
		
	},
	Update_Item_Entry: function(params, session, callback){
		
	},
	Delete_Item_Entry: function(params, session, callback){
		
	},
	Insert_New_Item: function(params, session, callback){
		
	},
	Edit_Item: function(params, session, callback){
		
	},
	Delete_Item: function(params, session, callback){
		
	},
	Insert_Item_Target: function(params, session, callback){
		
	},
	Update_Item_Target: function(params, session, callback){
		
	},
	Delete_Item_Target: function(params, session, callback){
		
	},
	Get_Item_Log_Schema: function(params, session, callback){
		
		var schema = {'item_log_id' : 'int',
			'item_id' : 'int',
			'time' : 'date',
			'value' : 'float',
			'name' : 'string',
			'unit' : 'string',
			'note' : 'string',
			'item_target_id' : 'int'};
		
		callback(schema);
		
	},
	Get_Item_Log: function(params, session, callback){
		
		var join = "item_log JOIN items ON item_log.item_id = items.item_id";
		var columns = {
			"item_log_id" : "item_log.item_log_id",
			"item_id" : "item_log.item_id",
			"time" : "item_log.time",
			"value" : "item_log.value",
			"item_target_id" : "item_log.item_target_id",
			"note" : "item_log.note",
			"name" : "items.name",
			"unit" : "items.unit"};
		
		database.Select(
			join, 
			columns, 
			"member_id = " + session.member_id,
			'ORDER BY item_log_id',
			function(table){
				
				callback(table);
				
			});
	},
	Get_Items_Schema: function(params, session, callback){
		
		var schema = {'item_name' : 'string', 
			'item_description' : 'string', 
			'item_unit' : 'string', 
			'date_created' : 'date', 
			'item_id' : 'int',
			'category_id' : 'int'};
		
		callback(schema);
		
	},
	Get_Items: function(params, session, callback){
		
		var columns = {
			"item_id" : "item_id",
			"item_name" : "name",
			"item_description" : "description",
			"item_unit" : "unit",
			"date_created" : "date_created",
			"category_id" : "category_id"};
		
		database.Select(
			'items', 
			columns, 
			"member_id = " + session.member_id,
			'ORDER BY item_id',
			function(table){
				
				callback(table);
				
			});
		
	},
	Get_Item_Targets_Schema: function(params, session, callback){
		
		var schema = {'item_target_id' : 'int', 
				'start_time' : 'date', 
				'type' : 'string', 
				'value' : 'float', 
				'item_id' : 'int', 
				'name' : 'string',
				'period_type' : 'string', 
				'period' : 'float', 
				'recurring' : 'bool', 
				'recurring_child_id' : 'int',
				'recurrance_end_time' : 'date',
				'allowed_variance' : 'float',
				'recurrance_period' : 'float',
				'status' : 'string'};
		
		callback(schema);
		
	},
	Get_Item_Targets: function(params, session, callback){
		
		var join = "item_targets JOIN items ON item_targets.item_id = items.item_id";
		var columns = {
			"item_target_id" : "item_targets.item_target_id",
			"start_time" : "item_targets.start_time",
			"type" : "item_targets.type",
			"value" : "item_targets.value",
			"item_id" : "item_targets.item_id",
			"period_type" : "item_targets.period_type",
			"period" : "item_targets.period",
			"recurring" : "item_targets.recurring",
			"recurring_child_id" : "item_targets.recurring_child_id",
			"recurrance_end_time" : "item_targets.recurrance_end_time",
			"allowed_variance" : "item_targets.allowed_variance",
			"recurrance_period" : "item_targets.recurrance_period",
			"status" : "item_targets.status",
			"name" : "items.name"};
		
		database.Select(
			join, 
			columns, 
			"member_id = " + session.member_id,
			'ORDER BY item_target_id',
			function(table){
				
				callback(table);
				
			});
		
	},
	Insert_Recurring_Children: function(params, session, callback){
		
	},
	Update_Recurring_Children: function(params, session, callback){
		
	},
	Delete_Recurring_Children: function(params, session, callback){
		
	},
};