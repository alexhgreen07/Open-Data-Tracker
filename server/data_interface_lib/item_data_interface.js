define([],function(){
	return {
		Insert_Item_Entry: function(params, session, callback){
			
			var value_lookup = params;
			value_lookup.time = session.database.Date_To_MYSQL_String(new Date(value_lookup.time));
			
			session.database.Insert('item_log',value_lookup,function(object){
				callback(object);
			});
			
		},
		Update_Item_Entry: function(params, session, callback){
			
			var value_lookup = params;
			value_lookup.time = session.database.Date_To_MYSQL_String(new Date(value_lookup.time));
			
			item_log_id = value_lookup.item_log_id;
			
			delete value_lookup.item_log_id;
			
			var where = 'item_log_id = ' + item_log_id;
			
			session.database.Update('item_log',value_lookup,where,function(object){
				callback(object);
			});
			
		},
		Delete_Item_Entry: function(params, session, callback){
			
			var where = 'item_log_id = ' + params.item_log_id;
			
			session.database.Delete('item_log',where,function(object){
				callback(object);
			});
			
		},
		Insert_New_Item: function(params, session, callback){
			
			var value_lookup = params;
			value_lookup.member_id = session.member_id;
			value_lookup.date_created = session.database.Date_To_MYSQL_String(new Date());
			
			session.database.Insert('items',value_lookup,function(object){
				callback(object);
			});
			
		},
		Edit_Item: function(params, session, callback){
			
			var value_lookup = params;
			
			item_id = value_lookup.item_id;
			
			delete value_lookup.item_id;
			
			var where = 'item_id = ' + item_id;
			where += ' AND member_id = ' + session.member_id;
			
			session.database.Update('items',value_lookup,where,function(object){
				callback(object);
			});
			
		},
		Delete_Item: function(params, session, callback){
			
			var where = 'item_id = ' + params.item_id;
			where += ' AND member_id = ' + session.member_id;
			
			session.database.Delete('items',where,function(object){
				callback(object);
			});
			
		},
		Insert_Item_Target: function(params, session, callback){
			
			var value_lookup = params;
			
			session.database.Insert('item_targets',value_lookup,function(object){
				callback(object);
			});
		},
		Update_Item_Target: function(params, session, callback){
			
			var value_lookup = params;
			
			item_target_id = value_lookup.item_target_id;
			
			delete value_lookup.item_target_id;
			
			var where = 'item_target_id = ' + item_target_id;
			
			session.database.Update('item_targets',value_lookup,where,function(object){
				callback(object);
			});
			
		},
		Delete_Item_Target: function(params, session, callback){
			
			var where = 'item_target_id = ' + params.item_target_id;
			where += ' AND member_id = ' + session.member_id;
			
			session.database.Delete('item_targets',where,function(object){
				callback(object);
			});
			
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
			
			session.database.Select(
				join, 
				columns, 
				"member_id = " + session.member_id,
				'ORDER BY item_log_id ASC',
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
			
			session.database.Select(
				'items', 
				columns, 
				"member_id = " + session.member_id,
				'ORDER BY item_id ASC',
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
			
			session.database.Select(
				join, 
				columns, 
				"member_id = " + session.member_id,
				'ORDER BY item_target_id ASC',
				function(table){
					
					callback(table);
					
				});
			
		},
		Insert_Recurring_Children: function(params, session, callback){
			//TODO: implement
		},
		Update_Recurring_Children: function(params, session, callback){
			//TODO: implement
		},
		Delete_Recurring_Children: function(params, session, callback){
			//TODO: implement
		},
	};
});
