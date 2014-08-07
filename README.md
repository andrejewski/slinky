Slinky
======

Slinky is a web crawler, but just for the links between webpages. Slinky is intended to be used to visualize the routes and structure behind a website by collecting hyperlinks.

If you decide to print out the source code and drop it down a flight of stairs, you may not be disappointed either.

## Installation

```bash
npm install slinky
```

## Usage

Slinky is straightforward to use. Give Slinky a URL and it will index the webpages in that domain.

```javascript
var slinky = require('slinky');
slinky.index('http://example.com', function(error, links) {
	if(error) throw error;
	Array.isArray(links); // true
	console.dir(links); 
	/*
		[
			"http://example.com/", 
			"http://example.com/about.html",
			...
		]
	*/
});
```

## Slinky Class

Slinky is a class that accepts optional configuration options.

```javascript
var Slinky = require('slinky').Slinky;

new Slinky({ // `new` is optional
	// default options
	limit: 100,		// limit the number of links returned
	depth: 3,		// limit recursion of the index 
	restrict: true,	// limit indexing to the domain of the url
	concurrency: 5	// how many async.queue workers to use
});
```

### Slinky#index()
- `#index(
	url String,
	done Callback(error Error, links Array[String]))`
- `#index(
	url String,
	each Callback(link String), 
	done Callback(error Error, links Array[String]))`

The `each` callback will receive each scraped link as they are processed. This is a method of streaming the links instead of waiting for the `done` callback.

The `#index()` is the only method that actually does anything. The other methods of the Slinky class are exposed purely for customization of Slinky. 

While the source is there to be read, some overridable methods to note are `#scrapeLinks()` if anchor tags are not what you are targeting and `#validResponse()` if webpages do not have to be HTML. Again, everything is configurable.

## Contributing

Contributions are incredibly welcome as long as they are standardly applicable and pass the tests (or break bad ones). Tests are written in Mocha and assertions are done with the Node.js core `assert` module.

```bash
# running tests
npm run test
npm run test-spec # spec reporter
```

Follow me on [Twitter](https://twitter.com/compooter) for updates or just for the lolz and please check out my other [repositories](https://github.com/andrejewski) if I have earned it. I thank you for reading.

