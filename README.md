Open-Data-Tracker
=================

An open source web application for tracking data.

Getting Started
===============
To use the application you need:
* A web server with PHP (apache, mongoose)
* MYSQL server

Install Instructions
====================
* Copy all files into your web server directory.
* Add a database to your MYSQL server.
* Add the database login credentials to 'server/config.php'
* Import the database schema in 'doc/mysql.sql'.

Developer Notes
===============
* This is still in ALPHA stages.
* If you'd like to contribute, check out: https://github.com/alexhgreen07/Open-Data-Tracker

Documentation Generation
------------------------
* The documentation was written for 'doxygen' (PHP) and 'jsdoc' (javascript).
* If you'd like to generate documentation, excute the commands below in Ubuntu:
 * ```sudo apt-get install jsdoc doxygen```
 * ```./build-doc.py```
