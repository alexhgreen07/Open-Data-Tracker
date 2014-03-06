/** This is the new task form to entering task data.
 * @constructor New_Task_Form
 */
function New_Task_Form(){
	
	
	this.Refresh = function(data){
		
		Refresh_Select_HTML_From_Table(
			this.task_category_select.id,
			data['Categories'],
			"Category ID",
			"Category Path");
		
	};
	
	this.Refresh_From_Diff = function(diff, data)
	{
		
		Refresh_Select_HTML_From_Table_Diff(
			this.task_category_select.id,
			diff.data['Categories'],
			"Category ID",
			"Category Path");
		
	};
	
	/** @method Task_New_Submit_Click
	 * @desc This function is the new task submit button click event handler.
	 * */
	this.Task_New_Submit_Click = function() {
		var params = new Array();
		params[0] = $("#" + this.task_name.id).val();
		params[1] = $("#" + this.task_description.id).val();
		params[2] = $("#" + this.task_note.id).val();
		params[3] = $("#" + this.task_category_select.id).val();

		var self = this;

		//execute the RPC callback for retrieving the item log
		app.api.Task_Data_Interface.Insert_Task(params, function(jsonRpcObj) {

			if (jsonRpcObj.result.success == 'true') {

				alert('New task added.');

				app.api.Refresh_Data(function() {
					//self.refresh_item_log_callback();
				});

			} else {
				alert('Task failed to add.');
				//alert(jsonRpcObj.result.debug);
			}

		});
	};

	
	/** @method Render
	 * @desc This function renders the new task form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render = function(form_div_id) {

		//create the top form
		this.data_form_new_task = document.createElement("form");
		this.data_form_new_task.setAttribute('method', "post");
		this.data_form_new_task.setAttribute('id', "new_task_form");

		this.data_form_new_task.innerHTML += 'Name:<br />';

		//task name creation
		this.task_name = document.createElement("input");
		this.task_name.setAttribute('name', 'task_name');
		this.task_name.setAttribute('id', 'task_name');
		this.task_name.setAttribute('type', 'text');
		this.data_form_new_task.appendChild(this.task_name);

		this.data_form_new_task.innerHTML += '<br />Category:<br />';

		//task recurring
		this.task_category_select = document.createElement("select");
		this.task_category_select.setAttribute('id', 'task_category_select');
		this.task_category_select.innerHTML = '<option value="0">-</option>';
		this.data_form_new_task.appendChild(this.task_category_select);

		this.data_form_new_task.innerHTML += '<br />Description:<br />';

		//task description creation
		this.task_description = document.createElement("input");
		this.task_description.setAttribute('name', 'task_description');
		this.task_description.setAttribute('id', 'task_description');
		this.task_description.setAttribute('type', 'text');
		this.data_form_new_task.appendChild(this.task_description);

		this.data_form_new_task.innerHTML += '<br />Note:<br />';

		//task note creation
		this.task_note = document.createElement("input");
		this.task_note.setAttribute('name', 'task_note');
		this.task_note.setAttribute('id', 'task_note');
		this.task_note.setAttribute('type', 'text');
		this.data_form_new_task.appendChild(this.task_note);
		
		this.data_form_new_task.innerHTML += '<br /><br />';

		//task submit creation
		this.task_submit_button = document.createElement("input");
		this.task_submit_button.setAttribute('id', 'task_submit');
		this.task_submit_button.setAttribute('type', 'submit');
		this.task_submit_button.value = 'Submit';
		var self = this;
		
		this.data_form_new_task.appendChild(this.task_submit_button);

		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form_new_task);

		$('#' + this.task_submit_button.id).button();
		$('#' + this.task_submit_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.Task_New_Submit_Click();
		});

	};
	
}