# Google Query

A simple microservice that takes a string, and uses it to query Google for search results. The program returns the top 'X' results where X is a given limit.

## Dependencies

The mircroservice is written in JavaScript and developed in a Nodejs environment with the following packages:

- Express: Used to run a webserver
- Unirest: HTTP library
- Cheerio: Used to parse HTML/XML

## Usage

Grab the source files from GitHub:
```git clone https://github.com/mCaballero1224/google_query.git```

Get `npm` dependencies:
```npm install```

Run the microservice with the following command:
```npm start```

You can then get Google Search results by making a request to the service with JSON data:

### Example HTTP Request

```
POST /search HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "query": "Hello World",
  "limit": 10
}
```

An example that uses the microservice can be found in the [example](https://github.com/mCaballero1224/google_query/tree/main/example) directory.

## Application

<p style="text-align:center;">
  <img src="https://github.com/mCaballero1224/google_query/blob/main/assets/UML_diagram.png" atl="UML Diagram">
</p>

## Citations

Code adapted from the example given in [this article](https://medium.com/@darshankhandelwal12/how-to-scrape-google-organic-search-results-with-node-js-d3abe0274f40) by Darshan Khandelwal.
