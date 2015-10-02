#StockQuery

The StockQuery project showcases how to query the Yahoo Finance REST API, to receive back JSON stock quotes pulling back all of history in order to query and perform analysis on historical stock trades.

##Get Started
To get started first please follow these steps:

* clone the repository
* `cd stockquery`
* `npm install && bower install`


##Capabilities

###Import script
The application allows users to import stock quotes from Yahoo Finance using the YQL construct to the MarkLogic database. 

If you are unfamiliar with the YQL syntax browse to the following URL for assistance constructing a query (https://developer.yahoo.com/yql/). Once you are at the YQL page you can enter queries similiar to select * from yahoo.finance.historicaldata where symbol in ("AA","AXP","BA","BAC","CAT","CSCO","CVX","DD","DIS","GE","HD","HPQ","IBM","INTC","JNJ","JPM","KFT","KO","MCD","MMM","MRK","MSFT","PFE","PG","T","TRV","UTX","VZ","WMT","XOM") and startDate = "2015-09-01" and endDate = "2015-10-02. This Query pulls down all of the DJIA historical quotes from September to October of 2015.

The import script itself is written using ES6 and has been complied to ES5 using [Babel](http://babeljs.io/).

###Frontend
The idea for the front end is to utilize AngularJS to query MarkLogic and pull back relavant stock information for a given time range.

The application also makes use of MarkLogic's built in search features such as text search.

##Installation
There are a few steps that are required in order to get up and running with the project - you will need to create an application server as well as a content and a modules database.

###MarkLogic Server
It is assumed that you already have the MarkLogic Server 8 installed. If you require help please [download MarkLogic](http://developer.marklogic.com/products) and read our [installation guide](http://docs.marklogic.com/guide/installation/procedures#id_28962).

StockQuery utilizes Node.js to call the [Management API](http://docs.marklogic.com/REST/management) to set up the application server and databases needed. To run this script, change directories to `ml-setup` with the root directory of StockQuery, then run `node setup.js`. 

    cd ml-setup
    node setup.js bootstrap

> Note that `setup.js` assumes a default local installation, where the Management API is available at http://localhost:8002. If deploying to a remote server, or if you need to change the admin username or password, edit setup.js with relavant information before running. 

##Data import
The import script can be found under the folder named 'import' and it's called `import.js`. Again, all the import script does for right now is pulls down historical stock quotes from Yahoo Finance.

###Usage
Before executing the script please make sure that you open the file `connection.js` (which is in the import folder as well) and you update the connection information:

	var connection = {
	  host: "localhost",
	  port: 5001,
	  user: "admin",
	  password: "admin"
	};

To import quotes run the following:
`node import.js`

###Modifications to the import script
If you'd like to modify the import script there are a few steps that you need to do. First of all please make sure that you have the Babel compiler installed and that it is globally available on your system. You can do this by executing the following statement: `npm install -g babel`

The source for the import script is under 'import/es6'. Once you have made your changes, you need to recompile the JavaScript files from the es6 source. You can do this on a Linux/Mac system by executing the following command: 
`chmod a+x run.sh; ./run.sh`.

If you're running on windows you'd have to manually recompile the JavaScript files using this command (one command per each file): `babel semantic.es6 --out-file ../semantic.js`

##Starting the application
Before starting the application please make sure that you have the right connection details as well as the correct username/password combination in the `dbsettings.js` file:

	var connection = {
	    host: 'localhost',
	    port: 5003,
	    user: 'admin',
	    password: 'admin'
	};
	
(note that this file is **different** from the connection file that the import script is using)

To start the application nagivate to the project's root folder and execute the following command: `node app.js` - this should start up an Express server on port 4000 which means that navigating to localhost:4000 would show the main page of the application.

If port 4000 is not available you can always open up `app.js` and modify the following line `app.set('port', 4000);` and use a desired port number.
