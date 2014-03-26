define([],function(){
	return {
		Datetime_Helper: function()
		{
			var self = this;
			
			self.Cast_Server_Datetime_to_Date = function(server_datetime_string)
			{
				
				return new Date(server_datetime_string);
			};

			self.Cast_Date_to_Server_Datetime = function(date_object)
			{
				
				return date_object.toISOString();
			};
			self.Convert_UTC_Date_To_Local_Timezone function (utc_date_object)
			{
				var current_date = new Date();
				var local_date = new Date(utc_date_object.getTime() - 60000*current_date.getTimezoneOffset());
				
				return local_date;
			};
			self.Convert_Local_Date_To_UTC_Timezone = function (local_date_object)
			{
				var current_date = new Date();
				var utc_date = new Date(local_date_object.getTime() + 60000*current_date.getTimezoneOffset());
				
				return utc_date;
			};
			self.Cast_Local_Server_Datetime_To_UTC_Server_Datetime = function (local_datetime_string)
			{
				var local_date = Cast_Server_Datetime_to_Date(local_datetime_string);
				var utc_date = Convert_Local_Date_To_UTC_Timezone(local_date);
				
				utc_datetime_string = Cast_Date_to_Server_Datetime(utc_date);
				
				return utc_datetime_string;
			};
			self.Get_String_From_Time_Interval = function (time_interval1, time_interval2)
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
				
			};
		},
	};
});