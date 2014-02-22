<?php
// Add the correct Content-Type for the cache manifest
header('Content-Type: text/cache-manifest');

// Write the first line
echo "CACHE MANIFEST\n";

// Initialize the $hashes string
$hashes = "";

function create_manifest($folder) {
	$dir = new RecursiveDirectoryIterator($folder);
	// Iterate through all the files/folders in the current directory
	foreach (new RecursiveIteratorIterator($dir) as $file) {
		$info = pathinfo($file);

		// If the object is a file
		// and it's not called manifest.php (this file),
		// and it's not a dotfile, add it to the list
		if ($file -> IsFile() && $file != "./manifest.php" && substr($file -> getFilename(), 0, 1) != ".") {
			
			if(strpos($file,".git/") == FALSE)
			{
				// Replace spaces with %20 or it will break
				echo str_replace(' ', '%20', $file) . "\n";
	
				// Add this file's hash to the $hashes string
				$hashes .= md5_file($file);
			}
			
			
		}
	}
}

$files = array(
	"./client/main.js.php",
	"./client/main.css.php",
	"./ajax-loader.gif",
	"./externals/js.tree/images/resnyanskiy-tree-icons.png");

foreach($files as $file)
{
	echo str_replace(' ', '%20',$file) . "\n";
	
	$hashes .= md5_file($file);
}

echo "NETWORK:\n
		./server/api.php\n";

// Write the $hashes string
echo "# Hash: " . md5($hashes) . "\n";
?>