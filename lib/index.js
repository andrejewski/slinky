
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
		concurrency: 5
	});
}

Slinky.prototype.index = function(urlRoot, linkDone, done) {
	if(done === void 0) {
		done = linkDone;
		linkDone = function(link) {};
	}

	var _this = this,
		uniqs = [],
		validLink = this.validLink(urlRoot),
		finished = once(done);

	var queue = async.queue(function worker(task, done) {
		var urlString = task.url,
			depth = task.depth+1;
		_this.request(urlString, function(error, res) {
			if(error) return done(error);
			if(_this.validResponse(res)) {
				urlString = res.redirects.pop() || urlString;
				if(validLink(urlString) && isNew(urlString) && collect(urlString)) {
					if(_this.options.depth <= depth) return done(error);
					_this.scrapeLinks(res.text)
						.map(url.resolve.bind(url, urlString))
						.filter(validLink)
						.filter(isNew)
						.forEach(function(link, index, list) {
							queue.push({
								url: link,
								depth: depth
							});
						});
				}
			}
			done(error);
		});
	}, this.options.concurrency);
	queue.push({url: urlRoot, depth: 0});
	queue.drain = function drain(error) {
		finished(error, uniqs);
	};

	function once(fn) {
		var called = false;
		return function() {
			if(!called && (called = true)) fn.apply(this, arguments);
		}
	}

	function collect(link) {
		linkDone(link);
		if(uniqs.push(link) >= _this.options.limit) {
			queue.kill();
			finished(null, uniqs);
			return false;
		}
		return true;
	}

	function isNew(link) {
		return !~uniqs.indexOf(link);
	}
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
	});
	return links.filter(function(link) {
		return link && typeof link === 'string';
	}).map(function(link) {
		return link.split("#")[0].split("?")[0];
	});
}

module.exports = Slinky();
module.exports.Slinky = Slinky;

