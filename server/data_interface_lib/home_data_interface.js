var database = require('./../database.js');

module.exports = {
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
		
		database.Select(
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
		
		database.Insert('categories',value_lookup,function(object){
			callback(object);
		});
		
	},
	Update_Category: function(params, session, callback){
		
	},
	Delete_Category: function(params, session, callback){
		
	},
	Get_Settings: function(params, session, callback){
		
	},
	Update_Settings: function(params, session, callback){
		
	},
};