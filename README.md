Dead Can't Dance (2016 Global Game Jam submission)
------------------------------------------------------------------------------

## To run on a local network

To build, be sure you have [node](http://nodejs.org) installed. Clone the project:

You must also have `grunt-cli` installed globally:

    npm install -g grunt-cli

Edit the js/screens/title.js file, at line 10 put your hostname instead of localhost.

Then in the cloned directory, simply run:

    npm install
    grunt dist
    cd server
    npm install
    node server.js

Voilà! Access the game by pointing your browser at http://your_host_name_here:3000/


-------------------------------------------------------------------------------

Based on melonJS boilerplate, which is:

Copyright (C) 2011 - 2015 Olivier Biot, Jason Oster, Aaron McLeod
melonJS is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php)

