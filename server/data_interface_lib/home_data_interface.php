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
			'Category ID' => 'int',
			'Name' => 'string',
			'Description' => 'string',
			'Parent Category ID' => 'int',
			'Category Path' => 'string'
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
		
		$columns = array(
			'Category ID' => 'category_id',
			'Name' => 'name',
			'Description' => 'description',
			'Parent Category ID' => 'parent_category_id',
			'Category Path' => 'category_path');
		
		$data = Select_By_Member("categories",$columns,"1","ORDER BY `category_id`");
		
		if(!$data)
		{
			$return_json['success'] = 'false';
			return $return_json;
		}
		
		$return_json['data'] = $data;
		$return_json['success'] = 'true';
		
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
		
		$columns = array(
			'Setting ID' => 'setting_id',
			'Name' => 'name',
			'Type' => 'type');
		
		$data = Select("settings",$columns,"1","ORDER BY setting_id");
		
		if (!$data) {
			
			$return_json['success'] = 'false';
			return $return_json;
		}
		
		$return_json['settings'] = $data;
		
		$join = "setting_entries JOIN settings ON setting_entries.setting_id = settings.setting_id";
		$columns = array(
			"Name" => "name",
			"Type" => "type",
			"Setting ID" => "setting_entries.setting_id",
			"Setting Entry ID" => "setting_entry_id",
			"Value" => "value");
		
		$data = Select_By_Member($join,$columns,"1","ORDER BY setting_entry_id");
		
		if(!$data)
		{
			$return_json['success'] = 'false';
			return $return_json;
		}
		
		$return_json['setting_entries'] = $data;
		
		$return_json['success'] = 'true';
		
		return $return_json;
	}
	
	public function Update_Settings($settings)
	{
		$return_json = array('success' => 'false', );
		
		//$new_settings = json_decode($settings);
		
		foreach($settings  as $setting_id => $value)
		{
			
			$sql = "SELECT * 
				FROM `setting_entries` 
				JOIN `settings` 
				ON `setting_entries`.`setting_id` = `settings`.`setting_id`
				WHERE `setting_entries`.`setting_id` = " . $setting_id ." 
				AND `setting_entries`.`member_id` = " . $_SESSION['session_member_id'] ."";
				
			$result = mysql_query($sql, $this -> database_link);
			
			$num = mysql_numrows($result);
			
			if($num > 0)
			{
				$sql = "UPDATE `setting_entries` 
					SET `value`='".$value."' 
					WHERE `setting_entry_id` = " . $setting_id . "";
					
				$result = mysql_query($sql, $this -> database_link);
				
				if (!$result) 
				{
					$return_json['debug'] = $sql;
					return $return_json;
				}
			}
			else {
				
				$sql = "INSERT INTO `setting_entries` (`setting_id`,`value`,`member_id`) 
					VALUES (".$setting_id.",'".$value."'," . $_SESSION['session_member_id'] .")";
					
				$result = mysql_query($sql, $this -> database_link);
				
				if (!$result) 
				{
					$return_json['debug'] = $sql;
					return $return_json;
				}
			}
			
		}
		
		$return_json['success'] = 'true';
		
		return $return_json;
	}
	
}
?>
