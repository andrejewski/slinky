
var Slinky = require('../lib/index').Slinky;

Slinky({depth: 2, limit: 10, concurrency: 10}).index("http://chrisandrejewski.com/", perLink, function(error, links) {
	if(error) throw error;
	console.log('Links ['+links.length+']');
	console.dir(links);
});

function perLink(link) {
	console.log('Link:', link);
}