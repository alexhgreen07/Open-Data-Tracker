var log_level = 0;

define([], function(){
	
	const ERROR = 1;
	const DEBUG = 2;
	const INFO = 3;
	
	function Set_Log_Level(level)
	{
		
		log_level = level;
		
	}

	function Log_String(level, log_string)
	{
		
		if(level <= log_level)
		{
			var now = new Date();
		
			console.log(now + ': ' + log_string);
		}
		
	}

	function Error(log_string)
	{
		Log_String(ERROR,log_string);
	}

	function Debug(log_string)
	{
		Log_String(DEBUG,log_string);
	}

	function Info(log_string)
	{
		Log_String(INFO,log_string);
	}
	
	return {
		ERROR: ERROR,
		DEBUG: DEBUG,
		INFO: INFO,
		Log_String: Log_String,
		Error: Error,
		Debug: Debug,
		Info: Info,
		Set_Log_Level: Set_Log_Level,
	};
});

