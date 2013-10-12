
/**
 * Module dependencies.
 */

var express = require('express'),
		routes = require('./routes'),
		user = require('./routes/user'),
		http = require('http'),
		request = require('request'),
		path = require('path'),
		cronJob = require('cron').CronJob;
		Parse = require('node-parse-api').Parse,
		PARSE_APP_ID = process.env.PARSE_APP_ID,
		PARSE_MASTER_KEY = process.env.PARSE_MASTER_KEY,
		parseApp = new Parse(PARSE_APP_ID, PARSE_MASTER_KEY),
		app = express();

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.post( '/create', routes.create );

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

new cronJob('*/5 * * * *', function() {
	var i = 0;
	parseApp.findMany('Domain', {}, function(err, response) {
		for(; i < response.results.length; i += 1) {
			performRequest(response.results[i]);
		}
	});
}, null, true, "America/New_York");

function performRequest(result) {
	var url = result['url'],
			objectId = result['objectId'],
			obj;
	return request(url, function(error, response, body) {
		// obj = { domainId: objectId, success: true };

		if (!error && response.statusCode == 200) {
			console.log('GET succeeded. Mighty Kong has awoken');
		} else {
				// obj.success = false;
				console.log(error);
		}

		// parseApp.insert('Log', obj);

		return this;
	});
}
