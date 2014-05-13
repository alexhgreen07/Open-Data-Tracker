define([],function(){
	return {
		Get_Categories_Schema: function(params, session, callback){
			
			var schema = {'Category ID' : 'int',
				'Name' : 'string',
				'Description' : 'string',
				'Parent Category ID' : 'int',
				'Category Path' : 'string'};
			
			callback(schema);
			
		},
		Get_Categories: function(params, session, callback){
			
			var columns = {
				'Category ID' : 'category_id',
				'Name' : 'name',
				'Description' : 'description',
				'Parent Category ID' : 'parent_category_id',
				'Category Path' : 'category_path'};
			
			session.database.Select(
				'categories', 
				columns, 
				"member_id = " + session.member_id,
				'ORDER BY `category_id`',
				function(table){
					
					callback(table);
					
				});
			
		},
		Insert_Category: function(params, session, callback){
			
			var value_lookup = params;
			value_lookup.member_id = session.member_id;
			
			value_lookup['category_path'] = '/' + value_lookup['name'];
			
			if(value_lookup["parent_category_id"] == 0)
			{
				session.database.Insert('categories',value_lookup,function(object){
					callback(object);
				});
			}
			else
			{
				var columns = {
						'category_path' : 'category_path'};
				
				var where = "member_id = " + session.member_id + " AND category_id = " + value_lookup["parent_category_id"];
				
				//check the parent category path
				session.database.Select(
						'categories', 
						columns, 
						where,
						'ORDER BY `category_id`',
						function(table){
							
							value_lookup['category_path'] = table[0]['category_path'] + value_lookup['category_path'];
							
							session.database.Insert('categories',value_lookup,function(object){
								callback(object);
							});
							
						});
			}
			
			
			
		},
		Update_Category: function(params, session, callback){
			
			var value_lookup = params;
			
			category_id = value_lookup.category_id;
			
			delete value_lookup.category_id;
			
			var where = 'category_id = ' + category_id;
			where += ' AND member_id = ' + session.member_id;
			
			value_lookup['category_path'] = '/' + value_lookup['name'];
			
			if(value_lookup["parent_category_id"] == 0)
			{
				session.database.Update('categories',value_lookup,where,function(object){
					callback(object);
				});
			}
			else
			{
				var columns = {
						'category_path' : 'category_path'};
				
				var select_where = "member_id = " + session.member_id + " AND category_id = " + value_lookup["parent_category_id"];
				
				//check the parent category path
				session.database.Select(
						'categories', 
						columns, 
						select_where,
						'ORDER BY `category_id`',
						function(table){
							
							value_lookup['category_path'] = table[0]['category_path'] + value_lookup['category_path'];
							
							session.database.Update('categories',value_lookup,where,function(object){
								callback(object);
							});
							
						});
			}
			
		},
		Delete_Category: function(params, session, callback){
			
			var where = 'category_id = ' + params.category_id;
			where += ' AND member_id = ' + session.member_id;
			
			session.database.Delete('categories',where,function(object){
				callback(object);
			});
			
		},
		Get_Settings: function(params, session, callback){
			
			//TODO: implement
			
		},
		Update_Settings: function(params, session, callback){
			
			//TODO: implement
			
		},
	};
});

