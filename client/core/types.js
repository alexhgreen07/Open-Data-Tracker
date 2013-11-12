
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

function Cast_Server_Datetime_to_Date(server_datetime_string)
{
	var time_array = server_datetime_string.split(/[- :]/);
	
	year = time_array[0];
	month = time_array[1] - 1;
	day = time_array[2];
	hours = time_array[3];
	minutes = time_array[4];
	seconds = time_array[5];
	milliseconds = 0;
	
	return_value = Date(year, month, day, hours, minutes, seconds, milliseconds);
	
	return return_value;
}
