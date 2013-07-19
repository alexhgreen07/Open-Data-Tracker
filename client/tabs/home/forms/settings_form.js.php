<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../../external/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../../external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../external/json-rpc2php-master/jsonRPC2php.client.js');

require_once(dirname(__FILE__).'/../../../accordian.js.php');

?>

function Settings_Form(){
	
	/** @method Render_Text_Size_Changer
	 * @desc This function will render the text size changer in the specified div.
	 * @param {String} form_div_id The div ID to render the form in.
	 * */
	this.Render_Text_Size_Changer = function(form_div_id) {
		
		var self = this;
		
		//append the main tab div
		this.text_changer_div = document.createElement('div');
		
		this.text_changer_div.innerHTML += 'Text Size: <br />';
		
		this.change_text_box = document.createElement('input');
		this.change_text_box.setAttribute('id','change_text_box');
		this.change_text_box.setAttribute('type','text');
		
		this.text_changer_div.appendChild(this.change_text_box);
		
		this.text_changer_div.innerHTML += '<br /><br />';
		
		this.change_text_link = document.createElement('input');
		this.change_text_link.setAttribute('id','change_text_link');
		this.change_text_link.setAttribute('type','submit');
		this.change_text_link.setAttribute('value','Change');
		
		this.text_changer_div.appendChild(this.change_text_link);
		
		this.text_changer_div.innerHTML += '<br /><br />';
		
		this.smaller_text_link = document.createElement('input');
		this.smaller_text_link.setAttribute('id','smaller_text_link');
		this.smaller_text_link.setAttribute('type','submit');
		this.smaller_text_link.setAttribute('value','Smaller');
		
		this.text_changer_div.appendChild(this.smaller_text_link);
		
		this.text_changer_div.innerHTML += '<br /><br />';
		
		this.larger_text_link = document.createElement('input');
		this.larger_text_link.setAttribute('id','larger_text_link');
		this.larger_text_link.setAttribute('type','submit');
		this.larger_text_link.setAttribute('value','Larger');
		
		this.text_changer_div.appendChild(this.larger_text_link);
		
		this.text_changer_div.innerHTML += '<br /><br />';
		
		var div_tab = document.getElementById(form_div_id);
		div_tab.appendChild(this.text_changer_div);
		
		$('#' + this.change_text_link.id).button();
		$('#' + this.change_text_link.id).click(function(){
			
			var size = document.getElementById(self.change_text_box.id).value;
			
			$('body').css('font-size',size + 'px');
			
		});
		
		$('#' + this.smaller_text_link.id).button();
		
		//setup actions
		$('#' + this.smaller_text_link.id).click(function()
		{
			var size = parseInt($('body').css('font-size').replace("px",""));
			
			if(size > 1)
			{
				size--;
			}
			
			$('body').css('font-size',size + 'px');
			
			document.getElementById(self.change_text_box.id).value = size;
		});
		
		$('#' + this.larger_text_link.id).button();
		
		$('#' + this.larger_text_link.id).click(function()
		{
			var size = parseInt($('body').css('font-size').replace("px",""));
			
			size++;
			
			$('body').css('font-size',size + 'px');
			
			document.getElementById(self.change_text_box.id).value = size;
		});
		
		var size = parseInt($('body').css('font-size').replace("px",""));
		
		document.getElementById(this.change_text_box.id).value = size;
		
	};
	
	this.Render = function(form_div_id){
		
		this.Render_Text_Size_Changer(form_div_id);
		
	};
}
