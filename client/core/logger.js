
var log_level = 0;

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
		var now = Cast_Date_to_Server_Datetime(new Date());
	
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
