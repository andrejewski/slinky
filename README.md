Slinky
======

Slinky is a web crawler, but just for the links between webpages. Slinky is intended to be used to visualize the routes and structure behind a website by collecting hyperlinks.

If you decide to print out the source code and drop it down a flight of stairs, you may not be disappointed either.

## Installation

```bash
npm install slinky
```

## Usage

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

## Contributing

Contributions are incredibly welcome as long as they are standardly applicable and pass the tests (or break bad ones). Tests are written in Mocha and assertions are done with the Node.js core `assert` module.

```bash
# running tests
npm run test
npm run test-spec # spec reporter
```

Follow me on [Twitter](https://twitter.com/compooter) for updates or just for the lolz and please check out my other [repositories](https://github.com/andrejewski) if I have earned it. I thank you for reading.

