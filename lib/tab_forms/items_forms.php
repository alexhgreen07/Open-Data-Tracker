<?php


function Render_Add_Item_Entry_Form()
{
	
	$add_form_output = '';
	
	$add_form_output .= '
	<form method="post" style="text-align:center;" id="add_item_entry_form">
	<div style= text-align:left;">
	Value: <br> <input type="text" class="text" name="value" /><br/>';
	$add_form_output .= 'Unit: <br> ';
	$add_form_output .= '<select name="unit_dropdown">';
	$add_form_output .= '<option>-</option>';

	$sql_query = "SELECT DISTINCT `unit` FROM `life_management`.`item_log` ORDER BY `unit` asc";
	$result=mysql_query($sql_query);
	$num=mysql_numrows($result);

	$i=0;
	while ($i < $num) {

		$row_result = mysql_result($result,$i,"unit");

		if($row_result != "")
		{

			$add_form_output .= '<option>';
			$add_form_output .= $row_result;
			$add_form_output .= '</option>';
	
		}

		$i++;
	}

	$add_form_output .= '</select><br/>';

	$add_form_output .= 'Note: <br> 
	<input type="text" class="text" name="notes" /><br/><br/>
	</div>
	<input type="submit"><br/><br/>
	</form>';

	$add_form_output .= '
	<script type="text/javascript">
	
		/* attach a submit handler to the form */
		$("#add_item_entry_form").submit(function(event) {
		
			/* stop form from submitting normally */
	  		event.preventDefault();
	  		
	  		/* get some values from elements on the page: */
	   		var values = $(this).serialize();
	   		
	   		/* Send the data using post and put the results in a div */
			$.ajax({
				url: "lib/ajax.php",
				type: "post",
				data: values,
				success: function(){
				
					  alert("success");

				},
				error:function(){
				
					  alert("failure");

				}   
			}); 
		
		});
	
	</script>
	';

	return $add_form_output;
}


