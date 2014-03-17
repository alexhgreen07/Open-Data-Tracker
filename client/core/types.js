
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
	
	return new Date(server_datetime_string);
}

function Cast_Date_to_Server_Datetime(date_object)
{
	
	return date_object.toISOString();
}

function Copy_JSON_Data(data)
{
	var copy = JSON.parse(JSON.stringify(data));
	
	return copy;
}

function Convert_UTC_Date_To_Local_Timezone(utc_date_object)
{
	var current_date = new Date();
	var local_date = new Date(utc_date_object.getTime() - 60000*current_date.getTimezoneOffset());
	
	return local_date;
}

function Convert_Local_Date_To_UTC_Timezone(local_date_object)
{
	var current_date = new Date();
	var utc_date = new Date(local_date_object.getTime() + 60000*current_date.getTimezoneOffset());
	
	return utc_date;
}

function Cast_Local_Server_Datetime_To_UTC_Server_Datetime(local_datetime_string)
{
	var local_date = Cast_Server_Datetime_to_Date(local_datetime_string);
	var utc_date = Convert_Local_Date_To_UTC_Timezone(local_date);
	
	utc_datetime_string = Cast_Date_to_Server_Datetime(utc_date);
	
	return utc_datetime_string;
}

function Get_String_From_Time_Interval(time_interval1, time_interval2)
{

    var datetime1 = new Date( time_interval1 ).getTime();
    var datetime2 = new Date(time_interval2).getTime();
	
	var milisec_diff = datetime2 - datetime1;
	var milisec_diff_abs = Math.abs(milisec_diff);
	
	var days = Math.floor(milisec_diff_abs / 1000 / 60 / (60 * 24));
	var hours = Math.floor(milisec_diff_abs / 1000 / 60 / 60) % 24;
	var minutes = Math.floor(milisec_diff_abs / 1000 / 60) % 60;
	var seconds = Math.floor(milisec_diff_abs / 1000) % 60;

	var return_string = ""; 
	
	if(days > 0)
	{
		return_string += days + "d "; 
	}
	
	if(hours > 0)
	{
		return_string +=  hours + "h "; 
	}
	
	return_string += minutes + "m ";
	
    return return_string;
	
}

function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

function Select_Option_From_Table_Row(current_row, value_column_name, text_column_name)
{
	var text_string = '';
		
	if(value_column_name != text_column_name)
	{
		text_string += 
			"(" + current_row[value_column_name] + ") ";
	}
	
	text_string += current_row[text_column_name];
	
	var return_value = new Option(text_string, current_row[value_column_name], true, false);
	
	return return_value;
}

function Refresh_Select_HTML_From_Table(select_id, table, value_column_name, text_column_name)
{
	select_to_refresh = document.getElementById(select_id);
	selected_value = select_to_refresh.value;
	is_selected_value_present = false;
	
	select_to_refresh.options.length = 0;
	select_to_refresh.options.add(new Option("-", "0", true, false));
	
	for (var i=0; i < table.length; i++) {
		

		var current_row = table[i];
		
		var new_option = Select_Option_From_Table_Row(current_row, value_column_name, text_column_name);
		select_to_refresh.options.add(new_option);
		
		if(selected_value == current_row[value_column_name])
		{
			is_selected_value_present = true;
		}
		
	}
	
	if(is_selected_value_present)
	{
		select_to_refresh.value = selected_value;
	}
	
}

function Refresh_Select_HTML_From_Table_Diff(select_id, table_diff, value_column_name, text_column_name)
{
	select_to_refresh = document.getElementById(select_id);
	selected_value = select_to_refresh.value;
	is_selected_value_present = true;
	
	for (var i=0; i < table.length; i++) {
	
		diff_row = table[i];
		var current_row = diff_row.row;
		
		if(diff_row.operation == 'insert')
		{
		
			var new_option = Select_Option_From_Table_Row(current_row, value_column_name, text_column_name);
			select_to_refresh.options.add(new_option);
		}
		else if(diff_row.operation == 'update')
		{
			for(var i = 0; i < select_to_refresh.options.length; i++)
			{
				var current_option = select_to_refresh.options[i];
				
				if(current_option.value == current_row[value_column_name])
				{
					var new_option = Select_Option_From_Table_Row(current_row, value_column_name, text_column_name);
					select_to_refresh.options[i] = new_option;
					
					break;
				}
			}
		}
		else if(diff_row.operation == 'delete')
		{
			for(var i = 0; i < select_to_refresh.options.length; i++)
			{
				var current_option = select_to_refresh.options[i];
				
				if(current_option.value == current_row[value_column_name])
				{
					select_to_refresh.options.remove(i);
					
					break;
				}
			}
		}
	}
	
	if(is_selected_value_present)
	{
		select_to_refresh.value = selected_value;
	}
}

function Rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1, g = f, b = 0; break;
        case 1: r = q, g = 1, b = 0; break;
        case 2: r = 0, g = 1, b = f; break;
        case 3: r = 0, g = q, b = 1; break;
        case 4: r = f, g = 0, b = 1; break;
        case 5: r = 1, g = 0, b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}
