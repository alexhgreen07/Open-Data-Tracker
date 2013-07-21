#!/usr/bin/python
import sys
import os
import time
import datetime
import subprocess
import argparse

def main(args):
    
	parser = argparse.ArgumentParser(description='Build the documentation for the code.')
	args = parser.parse_args(args)
    	
    	#directory_files = os.listdir("./client")
    	
    	fileList = []
	fileSize = 0
	folderCount = 0
	rootdir = "./client"

	for root, subFolders, files in os.walk(rootdir):
	
	    folderCount += len(subFolders)
	    
	    for file in files:
	    
		f = os.path.join(root,file)
		fileSize = fileSize + os.path.getsize(f)
		#print(f)
		fileList.append(f)

    	
    	
    	javascript_php_files = []
	
	print 'Files found: ',
	
	for script_file in fileList:
		
		if '.js.php' in script_file:
			
			print ('%s,' % script_file),
			new_script_file = script_file.replace('.js.php','.js')
			os.rename(script_file, new_script_file)
			
			javascript_php_files.append(new_script_file)
	
	print '\n\n'
	
	proc = subprocess.Popen('jsdoc -a -r -E=./client/external -E=./doc/ -d=./doc/out .', shell=True)
	proc.wait()
	
	print '\n\n'
	
	print 'Files reverting: ',
	
	for script_file in javascript_php_files:
		
		print ('%s' % script_file),
		new_script_file = script_file.replace('.js','.js.php')
		os.rename(script_file, new_script_file)
	
	print '\n\n'
	
	proc = subprocess.Popen('doxygen Doxyfile', shell=True)
	proc.wait()
	
	print '\n\n'
	print 'Script complete.'
	print '\n\n'
	
	return

if __name__ == "__main__":
    
	args = sys.argv[1:]

	main(args)

