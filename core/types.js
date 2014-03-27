
function Cast_String_To_Type(type, value)
{
	
	var cast_value;
	
	if(type == "int")
	{
		cast_value = int(value);
	}
	else if(type == "float")
	{
		cast_value = float(value);
	}
	else if(type == "date" || type == "string")
	{
		cast_value = value;
	}
	
	return cast_value;
}

function Copy_JSON_Data(data)
{
	var copy = JSON.parse(JSON.stringify(data));
	
	return copy;
}

define([],function(){
	return {
		Cast_String_To_Type: Cast_String_To_Type,
		Copy_JSON_Data: Copy_JSON_Data,
	};
});

