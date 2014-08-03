
var url = require('url'),
	async = require('async'),
	request = require('superagent'),
	cheerio = require('cheerio'),
	defaults = require('defaults');

function Slinky(options) {
	if(!(this instanceof Slinky)) return new Slinky(options);
	this.options = defaults(options, {
		limit: 100,
		depth: 3,
		restrict: true,
		conns: 5
	});
}

Slinky.prototype.index = function(url, next) {
	this.indexUrl(0, 0, null, url, function(error, links) {
		if(error) return next(error);
		next(error, uniques(links));
	});
}

function uniques(array) {
	return array.reduce(function(s,c) {
		if(s.indexOf(c) === -1) s.push(c);
		return s;
	}, []);
}

Slinky.prototype.indexUrl = function(depth, counter, validLink, reqUrl, done) {
	var slinky = this;
	if(slinky.options.limit <= counter) return done(null, []);
	if(slinky.options.depth <= depth) return done(null, []);
	slinky.request(reqUrl, function(error, response) {
		if(error) return done(error);
		if(!slinky.validResponse(response)) return done(null, []);
		var urlString = response.redirects.pop() || reqUrl,
			memo = [urlString];
		if(depth === 0) validLink = slinky.validLink(urlString);
		if(!validLink(urlString)) return done(null, []);
		if(slinky.options.depth <= ++depth) return done(null, memo);
		var links = slinky.scrapeLinks(response.text)
				.map(url.resolve.bind(url, urlString))
				.filter(validLink);

		if(counter + links.length > slinky.options.limit) {
			links = links.slice(0, slinky.options.limit - counter);
		}
		counter += links.length;
		var conns = Math.max(slinky.options.conns - depth, 1);
		async.mapLimit(links, conns, slinky.indexUrl.bind(slinky, depth, counter, validLink), function(error, links) {
			if(error) return done(error);
			done(error, links.reduce(function(s, c) {
				return s.concat(c);
			}, memo));
		});
	});
}

Slinky.prototype.request = function(url, done) {
	request.get(url).end(done);
}

Slinky.prototype.validResponse = function(res) {
	return !res.error && res.type === 'text/html';
}

Slinky.prototype.validLink = function(top) {
	if(!this.options.restrict) return function() {return true};
	var bar = url.parse(top);
	return function(current) {
		var foo = url.parse(current);
		var bool = foo.protocol === bar.protocol && foo.hostname === bar.hostname;
		return bool;
	}
}

Slinky.prototype.scrapeLinks = function(webpageText) {
	var $ = cheerio.load(webpageText),
		links = [];
	$('a').each(function(index, el) {
		return links.push(el.attribs.href);
	})
	return links.filter(function(link) {
		return link && typeof link === 'string';
	}).map(function(link) {
		return link.split("?")[0];
	});
}

module.exports = Slinky;

