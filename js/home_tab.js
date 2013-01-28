function Home_Tab () {

	//class variables

	//render function (div must already exist)
	this.Render = function() {
		
		var return_html = '';
		
		return_html += '<form method="post" style="text-align:center;" id="home_display_form">';
		return_html += '<button type="button" onClick="Alert_Stuff()">Refresh</button>';
		return_html += '</form>';
		
		
		return return_html;

	};
}

function Alert_Stuff()
{
	alert("success");
}



