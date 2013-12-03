
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
	
	return_value = new Date(year, month, day, hours, minutes, seconds, milliseconds);
	
	return return_value;
}

function Refresh_Select_HTML_From_Table(select_id, table, value_column_name, text_column_name)
{
	var select_html = '';
	
	select_to_refresh = document.getElementById(select_id);
	selected_value = select_to_refresh.value;
	is_selected_value_present = false;
	
	select_html += '<option value="0">-</option>';
	
	for (var i=0; i < table.length; i++) {
		

		var current_row = table[i];

		select_html += '<option value="' + 
			current_row[value_column_name] + '">' + 
			"(" + current_row[value_column_name] + ") " + 
			current_row[text_column_name] + 
			'</option>';
		
		if(selected_value == current_row[value_column_name])
		{
			is_selected_value_present = true;
		}
		
	}
	
	select_to_refresh.innerHTML = select_html;
	
	if(is_selected_value_present)
	{
		select_to_refresh.value = selected_value;
	}
	
}
