
/*
 * GET home page.
 */

var Parse = require('node-parse-api').Parse,
		PARSE_APP_ID = process.env.PARSE_APP_ID,
		PARSE_MASTER_KEY = process.env.PARSE_MASTER_KEY,
		parseApp = new Parse(PARSE_APP_ID, PARSE_MASTER_KEY);

exports.index = function(req, res) {
	return parseApp.findMany('Domain', {}, function(err, response) {
		return res.render('index', {
			title: 'KeepAwake',
			domains: response.results
		});
	});
};

exports.create = function(req, res) {
	var name = req.body.name,
			url = req.body.url
			domainAttrs = { name: name, url: url };

	if (validateURL(url)) {
		return parseApp.findMany('Domain', { url: url }, function(err, response) {
			return buildDomain(res, response, domainAttrs);
		});
	} else {
			return invalidURLFormat(res);
	}
};

function validateURL() {
	return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(validateURL.arguments[0]);
}

function invalidURLFormat(res) {
	return res.status(400).send('Validation Error: URL does not have correct format (http://subdomain.domain.extension)');
}

function buildDomain(res, response, domainAttrs) {
	if (Array.isArray(response.results) && response.results.length > 0) {
		return res.status(400).send('Validation Error: Domain URL already queued');
	} else {
			return saveDomain(res, domainAttrs);
	}
}

function saveDomain(res, domainAttrs) {
	return parseApp.insert('Domain', domainAttrs, function(err, response) {
		if (!err) {
			parseApp.insert('Log', { domainId: response.objectId, success: true });
			return res.status(200).send('Domain URL added to queue');
		} else {
				parseApp.insert('Log', { success: false });
				return res.status(500).send('Rut row. There was an error...please try again kthnxbai');
		}
	});
}
