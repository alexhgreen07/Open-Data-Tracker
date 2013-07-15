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
    	
    	directory_files = os.listdir("./client")
    	javascript_php_files = []
	
	print 'Files found: ',
	
	for script_file in directory_files:
		
		if '.js.php' in script_file:
			
			print ('%s,' % script_file),
			new_script_file = script_file.replace('.js.php','.js')
			os.rename('./client/' + script_file, './client/' + new_script_file)
			
			javascript_php_files.append(new_script_file)
	
	print '\n\n'
	
	proc = subprocess.Popen('jsdoc -d=doc/out client/*', shell=True)
	proc.wait()
	
	print '\n\n'
	
	print 'Files reverting: ',
	
	for script_file in javascript_php_files:
		
		print ('%s' % script_file),
		new_script_file = script_file.replace('.js','.js.php')
		os.rename('./client/' + script_file, './client/' + new_script_file)
	
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

