const express = require("express");
const https   = require("https");

const proxy   = require("./proxy.js");

var app = express();

/**
 * Results in all https requests being sent to the proxy handler.
 */
app.all("*", (req, res) => {
	proxy.handle_request(req)
		 .then((data) => {
			 res.send(data.data);
		 });
});


module.exports = {
	/**
	 * A function to start the https_server.
	 * @returns {Promise<void>}
	 */
	start_server: () => {
		return new Promise((resolve, reject) => {
			var https_server = https.createServer({
				key: global.certificates.key,
				cert: global.certificates.cert
			}, app);

			https_server.listen(443, "127.0.0.1");

			global.server = {
				initialised: true,
				instance: https_server,
				running: true
			};

			resolve();
		});
	}
}