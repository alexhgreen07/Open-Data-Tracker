<?php


function Render_Home_Form()
{
	
	$database_form_output = '';
	
	$database_form_output .= '<form method="post" style="text-align:center;" id="home_display_form">';
	$database_form_output .= '<input type="hidden" value="Refresh" name="refresh_home_display_hidden">';
	$database_form_output .= '<input type="submit" value="Refresh" name="refresh_home_display">';
	$database_form_output .= '</form>';
	
	
	$database_form_output .= "
	<div id='home_display_div'>";
	
	$database_form_output .= '</div>';

	$database_form_output .= '
	<script type="text/javascript">
	
	$("#home_display_form").submit(function(event) {
		
		/* stop form from submitting normally */
  		event.preventDefault();
  		
  		/* get some values from elements on the page: */
   		var values = $(this).serialize();
   		
   		/* Send the data using post and put the results in a div */
		$.ajax({
			url: "lib/ajax.php",
			type: "post",
			data: values,
			success: function(response, textStatus, jqXHR){
			
				var home_div = document.getElementById("home_display_div");
				home_div.innerHTML = "Last refresh: " + (new Date()) + "<br />" + response;
			
				//alert("success");

			},
			error:function(){
			
				alert("Data refresh failure.");

			}   
		}); 
	
	});
	
	$("#home_display_form").submit();
	
	</script>
	';

	return $database_form_output;
}


