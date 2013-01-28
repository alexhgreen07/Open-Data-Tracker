<?php

$jquery_ui_header_text = '
<link rel="stylesheet" href="js/jquery-ui-1.10.0.custom/development-bundle/themes/base/jquery-ui.css" />
<script src="js/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js"></script>
<script src="js/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js"></script>
<link rel="stylesheet" href="/resources/demos/style.css" />
';

function Create_Tabs($div_id,$tabs)
{
	
	$html_output = '';
	
	$html_output .= '
		<div id="'.$div_id.'">
		<ul>';
	
	$tab_counter = 0;
	
	foreach ($tabs as $tab_name => $tab_content) {
	
    		$html_output .= '<li><a href="#'.$div_id.'-tab-'.$tab_counter.'">'.$tab_name.'</a></li>';
		
		$tab_counter++;
	}
	
	$html_output .= '</ul>';
	
	$tab_counter = 0;
	
	foreach ($tabs as $tab_name => $tab_content) {
	
    		$html_output .= '<div id="'.$div_id.'-tab-'.$tab_counter.'">'.$tab_content.'</div>';
		
		$tab_counter++;
	}
	
	$html_output .= '</div>';
	
	$html_output .= '
		<script>
		$(function() {
		$("#'.$div_id.'").tabs();
		});
		</script>
		';
	
	return $html_output;
}

function Create_Accordian($div_id,$panes)
{
	$html_output = '';
	
	$html_output .= '<div id="'.$div_id.'">';
	
	foreach($panes as $pane_title => $pane_content) {
	
		$html_output .= '
			<h3>'.$pane_title.'</h3>
			<div>
			<p>
			'.$pane_content.'
			</p>
			</div>
			';
	
	}
	
	$html_output .= '</div>';
	
	$html_output .= '
		<script>
		$(function() {
		$( "#'.$div_id.'" ).accordion();
		});
		</script>';	
	
	
	return $html_output;
}


?>
