/* example.js
 * @brief Short example of using the microservice
 * @author Michael Caballero
 * @version 0.1
*/
const axios = require("axios"); /* Used for making request */
const readLine = require("readline"); /* Used for user input/output */

const rl = readLine.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const apiEndpoint = "http://localhost:3000/search";

async function fetchResults(query, limit = 10) {
	try {
		const response = await axios.get(apiEndpoint, {
			headers: { "Content-Type": "application/json" },
			data: { query, limit },
		});
		return response.data.results;
	} catch (error) {
		console.error("Error getting search results:", error.response?.data || error.message);
		return [];
	}
}

async function main() {
	rl.question("Enter your search query: ", async (query) => {
		if (!query.trim()) {
			console.log("Invalid query. Exiting.");
			rl.close();
			return;
		}
		console.log(`Search request: "${query}"...`);
		const results = await fetchResults(query);

		if (results.length === 0) {
			console.log("No results found.");
		} else {
			console.log("\nSearch Results:");
			results.forEach((result, index) => {
				console.log(`Result #${index+1}\n\tTitle: ${result.title}\n\tLink: ${result.link}`);
			});
		}
		rl.close()
	});
}

main();
