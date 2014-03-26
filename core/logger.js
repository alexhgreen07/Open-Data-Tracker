const ERROR = 1;
const DEBUG = 2;
const INFO = 3;

define([], function(){
	return {
		log_level: 0,
		ERROR: ERROR,
		DEBUG: DEBUG,
		INFO: INFO,
		Log_String: function (level, log_string)
		{
			
			if(level <= log_level)
			{
				var now = Cast_Date_to_Server_Datetime(new Date());
			
				console.log(now + ': ' + log_string);
			}
			
		},
		Error: function (log_string)
		{
			Log_String(ERROR,log_string);
		},
		Debug: function (log_string)
		{
			Log_String(DEBUG,log_string);
		},
		Info: function (log_string)
		{
			Log_String(INFO,log_string);
		},
	};
});

