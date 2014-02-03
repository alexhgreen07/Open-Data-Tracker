<?php
/** \file home_data_interface.php
 * \brief This file contains the class definition for the home data interface class.
 * */

/** \class Home_Data_Interface
 * \brief This class contains the functions for the home data interface.
 * 
 * The class contains functions related to data summary and general settings.
 * It has the interfaces to categories as well.
 * */
class Home_Data_Interface {

	//this will store the open database link
	private $database_link;

	/** \fn public function Home_Data_Interface($new_database_link)
     * \brief This is the constructor for the class.
     * \param new_database_link This is the link to the database which the class will be interacting with.
     * \return None.
     * */
	public function Home_Data_Interface($new_database_link) {

		//note this is expected to be initialized and open to the proper database
		$this -> database_link = $new_database_link;

	}

	public function Get_Categories_Schema()
	{
		$return_json = array();
		
		$return_json['schema'] = array(
			'category_id' => 'int',
			'name' => 'string',
			'description' => 'string',
			'parent_category_id' => 'int',
			'category_path' => 'string'
		);
		
		return $return_json;
	}
	
	/** \fn public function Get_Categories()
     * \brief This functions retrieves and compiles the categories into a JSON arrary.
     * \return A JSON array with format: {success:<value>,authenticated:<value>,data:<value>}
     * */
	public function Get_Categories()
	{
		$return_json = array('success' => 'false', );

		$sql_query = "SELECT 
			`category_id`, 
			`name`, 
			`description`, 
			`parent_category_id`,
			`category_path` 
			FROM `categories` WHERE `member_id` = '" . $_SESSION['session_member_id'] ."' ORDER BY `category_path`";
		$result = mysql_query($sql_query, $this -> database_link);

		if ($result) {
			$return_json['success'] = 'true';
			
			$return_json['data'] = array();
			
			$num = mysql_numrows($result);

			$i = 0;
			while ($i < $num) {

				$category_id = mysql_result($result, $i, "category_id");
				$name = mysql_result($result, $i, "name");
				$description = mysql_result($result, $i, 'description');
				$parent_category_id = mysql_result($result, $i, 'parent_category_id');
				$category_path = mysql_result($result, $i, 'category_path');
				
				$return_json['data'][$i] = 
					array(
					'category_id' => $category_id, 
					'name' => $name, 
					'description' => $description, 
					'parent_category_id' => $parent_category_id,
					'category_path' => $category_path);

				$i++;
			}
		} else {
			$return_json['success'] = 'false';
		}
		
		return $return_json;
		
	}
	
	/** \fn public function Insert_Category($name, $description, $parent_category_id)
     * \brief This function inserts a new category into the database.
     * \param name This is the name string of the new category.
     * \param description This is the description string related to the category.
     * \param parent_category_id The parent category integer ID.
     * \return A JSON array with format: {success:<value>,authenticated:<value>}
     * */
	public function Insert_Category($name, $description, $parent_category_id){
		
		$return_json = array('success' => 'false', );
		
		$sql_query = "SELECT `category_path` FROM `categories` WHERE `category_id` = '".$parent_category_id."' AND `member_id` = '" . $_SESSION['session_member_id'] ."'";
		
		$result = mysql_query($sql_query, $this -> database_link);
		
		if ($result) {
			
			$num = mysql_numrows($result);

			$i = 0;
			while ($i < $num) {

				$category_path = mysql_result($result, $i, "category_path");
				$i++;
			}
			
			$category_path = $category_path . '/' . $name;
			
			$sql_query = "INSERT INTO `categories`
				(`member_id`, 
				`name`, 
				`description`, 
				`parent_category_id`,
				`category_path`) 
				VALUES 
				('".$_SESSION['session_member_id']."',
				'".$name."',
				'".$description."',
				".$parent_category_id.",
				'".$category_path."')";
			
			$result = mysql_query($sql_query, $this -> database_link);

			if ($result) {
				$return_json['success'] = 'true';

			} else {
				$return_json['success'] = 'false';
			}
			

		} else {
			$return_json['success'] = 'false';
		}
		
		return $return_json;
	}
	
	/** \fn public function Update_Category($category_id, $name, $description, $parent_category_id)
     * \brief This function updates a category in the database.
     * \param category_id The category integer ID to update.
     * \param name This is the new name string of the category.
     * \param description This is the new description string related to the category.
     * \param parent_category_id The new parent category integer ID.
     * \return A JSON array with format: {success:<value>,authenticated:<value>}
     * */
	public function Update_Category($category_id, $name, $description, $parent_category_id){
		
		$return_json = array('success' => 'false', );

		$sql_query = "UPDATE `categories` 
			SET `name`='".$name."',
			`description`='".$description."',
			`parent_category_id`=".$parent_category_id." 
			WHERE `category_id` = ".$category_id ." AND `member_id` = '" . $_SESSION['session_member_id'] ."'";
			
		$result = mysql_query($sql_query, $this -> database_link);

		if ($result) {
			$return_json['success'] = 'true';

		} else {
			$return_json['success'] = 'false';
		}
	
		return $return_json;
	}
	
	/** \fn public function Delete_Category($category_id)
     * \brief This function deletes a category from the database.
     * \param category_id The category integer ID to update.
     * \param name This is the new name string of the category.
     * \param description This is the new description string related to the category.
     * \param parent_category_id The new parent category integer ID.
     * \return A JSON array with format: {success:<value>,authenticated:<value>}
     * */
	public function Delete_Category($category_id){
		
		$return_json = array('success' => 'false', );

		$sql_query = "DELETE FROM `categories` WHERE `category_id` = ".$category_id  ." AND `member_id` = '" . $_SESSION['session_member_id'] ."'";
			
		$result = mysql_query($sql_query, $this -> database_link);

		if ($result) {
			$return_json['success'] = 'true';

		} else {
			$return_json['success'] = 'false';
		}
	
		return $return_json;
	}
	
	public function Get_Settings()
	{
		$return_json = array('success' => 'false', );
		
		$sql = "SELECT * 
			FROM `setting_entries` 
			JOIN `settings` 
			ON `setting_entries`.`setting_id` = `settings`.`setting_id`
			WHERE `setting_entries`.`member_id` = '" . $_SESSION['session_member_id'] ."'";
		
		$result = mysql_query($sql_query, $this -> database_link);
		
		if ($result) {
			$return_json['success'] = 'true';
			
			$return_json['data'] = array();
			
			$num = mysql_numrows($result);

			$i = 0;
			while ($i < $num) {

				$name = mysql_result($result, $i, "name");
				$type = mysql_result($result, $i, "type");
				$setting_id = mysql_result($result, $i, 'setting_id');
				$setting_entry_id = mysql_result($result, $i, 'setting_entry_id');
				$value = mysql_result($result, $i, 'value');
				
				$return_json['data'][$i] = 
					array(
					'name' => $name, 
					'type' => $type, 
					'setting_id' => $setting_id, 
					'setting_entry_id' => $setting_entry_id,
					'value	' => $value);

				$i++;
			}
		} else {
			$return_json['success'] = 'false';
		}
		
		return $return_json;
	}
	
	public function Update_Settings($settings)
	{
		$return_json = array('success' => 'false', );
		
		return $return_json;
	}
	
}
?>
