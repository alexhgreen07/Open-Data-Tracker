define([],function(){
	return {
		Insert_Task_Entry: function(params, session, callback)
		{
			var value_lookup = params;
			value_lookup.start_time = session.database.Date_To_MYSQL_String(new Date(value_lookup.start_time));
			
			session.database.Insert('task_log',value_lookup,function(object){
				callback(object);
			});
		},
		Update_Task_Entry: function(params, session, callback)
		{
			var value_lookup = params;
			value_lookup.start_time = session.database.Date_To_MYSQL_String(new Date(value_lookup.start_time));
			
			task_log_id = value_lookup.task_log_id;
			
			delete value_lookup.task_log_id;
			
			var where = 'task_log_id = ' + task_log_id;
			
			session.database.Update('task_log',value_lookup,where,function(object){
				callback(object);
			});
		},
		Delete_Task_Entry: function(params, session, callback)
		{
			var where = 'task_log_id = ' + params.task_log_id;
			
			session.database.Delete('task_log',where,function(object){
				callback(object);
			});
		},
		Insert_Task: function(params, session, callback)
		{
			var value_lookup = params;
			value_lookup.date_created = session.database.Date_To_MYSQL_String(new Date());
			value_lookup.status = "Active";
			value_lookup.member_id = session.member_id;
			
			session.database.Insert('tasks',value_lookup,function(object){
				callback(object);
			});
		},
		Update_Task: function(params, session, callback)
		{
			var value_lookup = params;
			
			task_id = value_lookup.task_id;
			
			delete value_lookup.task_id;
			
			var where = 'task_id = ' + task_id + ' AND member_id = ' + session.member_id;
			
			session.database.Update('tasks',value_lookup,where,function(object){
				callback(object);
			});
		},
		Delete_Task: function(params, session, callback)
		{
			var where = 'task_id = ' + params.task_id + ' AND member_id = ' + session.member_id;
			
			session.database.Delete('tasks',where,function(object){
				callback(object);
			});
		},
		Insert_Task_Target: function(params, session, callback)
		{
			var value_lookup = params;
			value_lookup.scheduled_time = session.database.Date_To_MYSQL_String(new Date(value_lookup.scheduled_time));
			value_lookup.recurrance_end_time = session.database.Date_To_MYSQL_String(new Date(value_lookup.recurrance_end_time));
			
			session.database.Insert('task_targets',value_lookup,function(object){
				callback(object);
			});
		},
		Update_Task_Target: function(params, session, callback)
		{
			var value_lookup = params;
			value_lookup.scheduled_time = session.database.Date_To_MYSQL_String(new Date(value_lookup.scheduled_time));
			value_lookup.recurrance_end_time = session.database.Date_To_MYSQL_String(new Date(value_lookup.recurrance_end_time));
			
			task_schedule_id = value_lookup.task_schedule_id;
			
			delete value_lookup.task_schedule_id;
			
			var where = 'task_schedule_id = ' + task_schedule_id;
			
			session.database.Update('task_targets',value_lookup,where,function(object){
				callback(object);
			});
		},
		Delete_Task_Target: function(params, session, callback)
		{
			var where = 'task_schedule_id = ' + params.task_schedule_id;
			
			session.database.Delete('task_targets',where,function(object){
				callback(object);
			});
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
			var columns = {
				"scheduled_time" : "scheduled_time",
				"recurrance_child_id" : "recurrance_child_id",
				};
			
			var task_target_id = params.task_target_id;
			var continue_recurrance = params.continue_recurrance;
			
			//get the child columns
			session.database.Select(
				'task_targets', 
				columns, 
				"task_schedule_id = " + task_target_id,
				'',
				function(table){
					
					if(table.length == 1)
					{
						var task_start_time = table[0]["scheduled_time"];
						var recurrance_child_id = table[0]["recurrance_child_id"];
						
						var columns = {
								"task_id" : "task_id",
								"task_schedule_id" : "task_schedule_id",
								"scheduled_time" : "scheduled_time",
								"recurring" : "recurring",
								"recurrance_type" : "recurrance_type",
								"recurrance_period" : "recurrance_period",
								"recurrance_type" : "recurrance_type",
								"allowed_variance" : "allowed_variance",
								"estimated_time" : "estimated_time",
								"recurrance_end_time" : "recurrance_end_time",
								"recurrance_child_id" : "recurrance_child_id",
								"status" : "status",
								};
						
						//get the parent columns
						session.database.Select(
								'task_targets', 
								columns, 
								"task_schedule_id = " + recurrance_child_id,
								'',
								function(table){
									
									if(table.length == 1)
									{
										
										var parent_recurrance_end_time = table[0]["recurrance_end_time"];
										
										var value_lookup = {
											'recurrance_child_id': '0',
											'recurring': '0',
										};
										
										where = 'task_schedule_id = ' + task_target_id;
										
										//break the child from the parent
										session.database.Update('task_targets',value_lookup,where,function(object){
											
											if(continue_recurrance)
											{
												var columns = {
														"task_schedule_id" : "task_schedule_id",
														"scheduled_time" : "scheduled_time",
														};
												
												var where = "recurrance_child_id` = " + recurrance_child_id + 
													" AND scheduled_time > '" + task_start_time + "'";
												
												//get the next recurring child
												session.database.Select(
														'task_targets', 
														columns, 
														where,
														'ORDER BY scheduled_time',
														function(table){
															
															if(table.length > 0)
															{
																var task_schedule_id = table[0]["task_schedule_id"];
																var task_schedule_time = table[0]["scheduled_time"];
																
																var value_lookup = {
																		'recurrance_child_id': '0',
																		'recurrance_end_time': parent_recurrance_end_time,
																	};
																	
																where = 'task_schedule_id = ' + task_schedule_id;
																
																//break the next child from the parent
																session.database.Update('task_targets',value_lookup,where,function(object){
																	
																	var value_lookup = {
																			'recurrance_child_id': task_schedule_id,
																		};
																		
																	where = "scheduled_time > '" + task_target_id = "'" +
																		" AND recurrance_child_id = " + recurrance_child_id;
																	
																	//update all children parents to next child parent
																	session.database.Update('task_targets',value_lookup,where,function(object){
																		
																		//TODO: create proper update parameters
																		var update_params = {};
																		
																		self.Update_Recurring_Children(update_params, session, callback);
																		
																	});
																});
															}
															
														});
											}
											
											callback(object);
										});
									}
									else
									{
										callback(table);
									}
									
								});
					}
					else
					{
						callback(table);
					}
					
					
				});
		},
		Insert_Recurring_Children: function(params, session, callback)
		{
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
				};
			
			
			session.database.Select(
				'task_targets', 
				columns, 
				"task_schedule_id = " + params.task_schedule_id,
				'',
				function(table){
					
					if(table.length > 0)
					{
						
						if(table[0]["scheduled_time"] && table[0]["recurrance_child_id"] == 0)
						{
							
							var recurring_timestamp = table[0]["scheduled_time"];
							var recurrance_end_timestamp = table[0]["recurrance_end_time"];
							
							var recurrance_period_seconds = table[0]["recurrance_period"] * 60 * 60;
							
							var insert_queries = [];
							
							while(recurring_timestamp < recurrance_end_timestamp)
							{
								recurring_timestamp = recurring_timestamp + recurrance_period_seconds;
								
								var recurring_timestring = session.database.Date_To_MYSQL_String(recurring_timestamp);
								
								var sql = 'INSERT INTO `task_targets`(`task_id`,`scheduled_time`,`recurring`,`recurrance_type`,`recurrance_period`,`allowed_variance`,`recurrance_end_time`,`estimated_time`,`recurrance_child_id`,`status`)' +
									"VALUES (" +
									"'" + table[0]["task_id"] + "'," + 
									"'" + recurring_timestring + "'," + 
									"'" + table[0]["recurring"] + "'," +
									"'" + table[0]["recurrance_type"] + "'," +
									"'" + table[0]["recurrance_period"] + "'," +
									"'" + table[0]["allowed_variance"] + "'," +
									"'" + recurring_timestring + "'," +
									"'" + table[0]["estimated_time"] + "'," +
									"'" + table[0]["task_schedule_id"] + "'," +
									"'Incomplete')";
								
								insert_queries.push(sql);
							}
							
							session.database.Queries(insert_queries, function(object){
								callback(object);
							});
							
							
						}
						else
						{
							callback(true);
						}
						
						
					}
					else
					{
						//TODO: figure out this case
						callback(false);
					}
					
				});
			
		},
		Update_Recurring_Children: function(params, session, callback)
		{
			if(params['recurring'])
			{
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
						};
					
					session.database.Select(
						'task_targets', 
						columns, 
						"task_schedule_id = " + params.task_schedule_id,
						'',
						function(table){
							
							var recurring_timestamp = params['scheduled_time'];
							var recurrance_end_timestamp = params['recurrance_end_time'];
							
							var recurrance_period_seconds = params['recurrance_period'];
							
							var i = 0;
							
							var update_queries = [];
							
							while((i < table.length) || (recurring_timestamp < recurrance_end_timestamp))
							{
								recurring_timestamp = recurring_timestamp + recurrance_period_seconds;
								var recurring_timestring = session.database.Date_To_MYSQL_String(recurring_timestamp);
								
								if(i < table.length)
								{
									if(recurring_timestamp < recurrance_end_timestamp)
									{
										var sql = "UPDATE `task_targets` SET " + 
											"`task_id` = '" + params['task_id'] + "'," + 
											"`scheduled_time` = '" + recurring_timestring + "'," + 
											"`recurring` = " + table[i]['recurring'] + "," + 
											"`recurrance_type` = '" + params['recurrance_type'] + "'," + 
											"`recurrance_period` = " + params['recurrance_period'] + "," + 
											"`allowed_variance` = " + params['allowed_variance'] + "," + 
											"`recurrance_end_time` = '" + recurring_timestring + "'," + 
											"`estimated_time` = '" + params['estimated_time'] + "'," + 
											"`recurrance_child_id` = " + params['task_schedule_id'] + "" + 
											" WHERE " +  
											"`task_schedule_id` = " + table[i]['task_schedule_id'] + "";
										
										update_queries.push(sql);
									}
									else
									{
										var sql = "DELETE FROM `task_targets` WHERE " + 
											"`task_schedule_id` = " + table[i]['task_schedule_id'] + "";
										
										update_queries.push(sql);
									}
								}
								else
								{
									var sql = 'INSERT INTO `task_targets`(`task_id`,`scheduled_time`,`recurring`,`recurrance_type`,`recurrance_period`,`allowed_variance`,`recurrance_end_time`,`estimated_time`,`recurrance_child_id`,`status`)' +
									"VALUES (" +
									"'" + params["task_id"] + "'," + 
									"'" + recurring_timestring + "'," + 
									"'" + params["recurring"] + "'," +
									"'" + params["recurrance_type"] + "'," +
									"'" + params["recurrance_period"] + "'," +
									"'" + params["allowed_variance"] + "'," +
									"'" + recurring_timestring + "'," +
									"'" + params["estimated_time"] + "'," +
									"'" + table[i]['task_schedule_id'] + "'," +
									"'Incomplete')";
									
									update_queries.push(sql);
								}
								
								i++;
							}
							
							session.database.Queries(update_queries, function(object){
								callback(object);
							});
							
						});
			}
			else
			{
				callback(false);
			}
			
		},
		Delete_Recurring_Children: function(params, session, callback)
		{
			var where = 'recurrance_child_id = ' + params.recurrance_child_id;
			
			session.database.Delete('task_targets',where,function(object){
				callback(object);
			});
			
		},
	};
});

