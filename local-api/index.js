const express = require("express");
const app = express();
const PORT = process.env.PORT || 400;

/**
 * A function to handle requests to the local api
 * @param {String} path
 * @returns {Promise<any>}
 */
async function handle(path) {
	return "lol";
}

app.get("/", async (req, res) => {
	let response = await handle(req.url);
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(response);
	res.end();
});
app.listen(PORT, () => console.log(`Web server started on port ${PORT}`));