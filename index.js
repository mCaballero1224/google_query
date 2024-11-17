const express = require("express"); /* Used for webserver */
const unirest = require("unirest"); /* HTTP library */
const cheerio = require("cheerio"); /* Used to parse HTML/XML */

const PORT = 3000 /* Port for the web server */
const app = express(); /* Create an object to interact with the server */

/* Middleware */
app.use(express.json());

/* queryGoogle
 * @brief Scrapes Google search results and returns the top results
 * @param query - The string that will be the query for the google search
 * @param limit - The number of results that will be returned
 * @returns results - An array of search results [title, link]
 */
const queryGoogle = async (query, limit = 10) => {
	/* Create the return object */
	const results = [];
	/* Start from the first search result */
	let start = 0;
	while (results.length < limit) {
		try {
			/* Query google */
			const response = await unirest
				.get(`https://www.google.com/search?q=${encodeURIComponent(query)}&start=${start}&gl=us&hl=en`)
				.headers({
				  "User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
				});

			if (response.status !== 200) {
				throw new Error(`Failed to fetch Google results: ${response.status}`);
			}

			const $ = cheerio.load(response.body);
			let foundResults = false;

			/* Go through the search results and obtain the title and link */
			$(".g").each((index, element) => {
				const title = $(element).find(".yuRUbf h3").text();
				const link = $(element).find(".yuRUbf a").attr("href");

				/* Push title and link to return object */
				if (title && link) {
					results.push({
						title,
						link,
					});
					foundResults = true;
				}
				/* Stop when the limit is reached */
				if (results.length >= limit) {
					return false; /* Break from the above loop */
				}
			});
			/* Handle case where no results are found */
			if (!foundResults) {
				console.log("No more results found.");
				break; /* Stop fetching results */
			}
			/* Move to next page if it has not reached the limit */
			start += results.length + 1;
		} catch (error) {
			if (error) console.error("Error fetching Google results:", error.message);
			return [];
		}
	}
	return results.slice(0, limit); /* Return X results */
};

/* GET "/search?q=query+string&limit=10"
 * @brief route by which to communicate with the microservice
 * @param q - String used to query google search
 * @param limit - The number of results to get
 * @returns - JSON data containing an array of search results
 */
app.get("/search", async (req, res) => {
	/* Pull data from the request */
	const {query, limit } = req.body;

	/* Error handling */
	if (!query) {
		return res.status(400).json({ error: "Missing required 'q' paramter." });
	}
	try {
		/* Try to fetch the search results based on the query string and limit */
		console.log(`Fetching results for query: '${query}' for the top ${limit} results`);
		const results = await queryGoogle(query, limit);
		res.json({ query, results });
	} catch (error) {
		/* Handle error fetching the results */
		res.status(500).json({ error: "Failed to fetch search results." });
	}
});

/* App listens on PORT */
app.listen(PORT, () => {
	console.log(`Google Query microservice running on http://127.0.0.1:${PORT}`);
});
