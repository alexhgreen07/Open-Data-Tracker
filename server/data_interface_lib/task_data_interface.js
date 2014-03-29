define([],function(){
	return {
		Insert_Task_Entry: function(params, session, callback)
		{
			
		},
		Update_Task_Entry: function(params, session, callback)
		{
			
		},
		Delete_Task_Entry: function(params, session, callback)
		{
			
		},
		Insert_Task: function(params, session, callback)
		{
			
		},
		Delete_Task: function(params, session, callback)
		{
			
		},
		Update_Task: function(params, session, callback)
		{
			
		},
		Insert_Task_Target: function(params, session, callback)
		{
			
		},
		Update_Task_Target: function(params, session, callback)
		{
			
		},
		Delete_Task_Target: function(params, session, callback)
		{
			
		},
		Get_Tasks_Schema: function(params, session, callback)
		{
			var schema = {
				'task_id' : 'int',
				'name' : 'string',
				'description' : 'string',
				'date_created' : 'date',
				'note' : 'string',
				'category_id' : 'int',
				'status' : 'string'
			};
			
			callback(schema);
		},
		Get_Tasks: function(params, session, callback)
		{
			var columns = {
				"task_id" : "tasks.task_id",
				"name" : "tasks.name",
				"description" : "tasks.description",
				"date_created" : "tasks.date_created",
				"note" : "tasks.note",
				"category_id" : "tasks.category_id",
				"status" : "tasks.status"};
			
			session.database.Select(
				'tasks', 
				columns, 
				"member_id = " + session.member_id,
				'ORDER BY tasks.task_id',
				function(table){
					
					callback(table);
					
				});
		},
		Get_Task_Log_Schema: function(params, session, callback)
		{
			var schema = {
				'task_log_id' : 'int',
				'name' : 'string',
				'start_time' : 'date',
				'hours' : 'float',
				'note' : 'note',
				'status' : 'string',
				'task_id' : 'int',
				'task_target_id' : 'int',
				'target_status' : 'string'
			};
			
			callback(schema);
		},
		Get_Task_Log: function(params, session, callback)
		{
			var join = "task_log " + 
				"JOIN tasks ON tasks.task_id = task_log.task_id " + 
				"LEFT JOIN task_targets ON task_targets.task_schedule_id = task_log.task_target_id";
			var columns = {
				"name" : "IFNULL(tasks.name,'')",
				"task_log_id" : "task_log.task_log_id",
				"task_id" : "IFNULL(tasks.task_id,0)",
				"start_time" : "task_log.start_time",
				"hours" : "task_log.hours",
				"status" : "task_log.status",
				"note" : "task_log.note",
				"task_target_id" : "task_log.task_target_id",
				"target_status" : "IFNULL(task_targets.status,'')"};
			
			session.database.Select(
				join, 
				columns, 
				"member_id = " + session.member_id,
				'ORDER BY task_log.task_log_id',
				function(table){
					
					callback(table);
					
				});
		},
		Get_Task_Targets_Schema: function(params, session, callback)
		{
			var schema = {
				'task_schedule_id' : 'int',
				'task_schedule_id' : 'int',
				'name' : 'string',
				'scheduled_time' : 'date',
				'recurring' : 'bool',
				'recurrance_type' : 'string',
				'recurrance_period' : 'int',
				'variance' : 'float',
				'estimated_time' : 'float',
				'recurrance_end_time' : 'date',
				'recurrance_child_id' : 'int',
				'status' : 'string',
				'task_id' : 'int',
				'hours' : 'float',
			};
			
			callback(schema);
		},
		Get_Task_Targets: function(params, session, callback)
		{
			var join = "task_targets " + 
				"JOIN tasks ON tasks.task_id = task_targets.task_id " + 
				"LEFT JOIN task_log ON task_targets.task_schedule_id = task_log.task_target_id ";
			var columns = {
				"task_id" : "task_targets.task_id",
				"task_schedule_id" : "task_targets.task_schedule_id",
				"scheduled_time" : "task_targets.scheduled_time",
				"recurring" : "task_targets.recurring",
				"recurrance_type" : "task_targets.recurrance_type",
				"variance" : "task_targets.allowed_variance",
				"estimated_time" : "task_targets.estimated_time",
				"recurrance_period" : "task_targets.recurrance_period",
				"recurrance_end_time" : "task_targets.recurrance_end_time",
				"recurrance_child_id" : "task_targets.recurrance_child_id",
				"status" : "task_targets.status",
				"name" : "tasks.name",
				"hours" : "IFNULL(SUM(task_log.hours),0)"};
			
			session.database.Select(
				join, 
				columns, 
				"member_id = " + session.member_id,
				'GROUP BY task_targets.task_schedule_id ' + 
				'ORDER BY task_targets.task_schedule_id',
				function(table){
					
					callback(table);
					
				});
		},
		Break_Recuring_Child: function(params, session, callback)
		{
			
		},
		Insert_Recurring_Children: function(params, session, callback)
		{
			
		},
		Update_Recurring_Children: function(params, session, callback)
		{
			
		},
		Delete_Recurring_Children: function(params, session, callback)
		{
			
		},
	};
});

