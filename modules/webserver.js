const express = require("express");
const tls = require("tls");

const proxy = require("./proxy.js");

tls.DEFAULT_MIN_VERSION = 'TLSv1'

module.exports = {
	/**
	 * A function to start the tls server.
	 * @returns {Promise<void>}
	 */
	start_server: () => {
		return new Promise((resolve, reject) => {
			var tls_server = tls.createServer({
				key: global.certificates.key,
				cert: global.certificates.cert
			}, (socket) => {
				console.log('Got socket');
			});

			tls_server.listen(443, "127.0.0.1");

			global.server = {
				initialised: true,
				instance: tls_server,
				running: true
			};

			resolve();
		});
	},

	/**
	 * A function to stop the tls server
	 * @returns {Promise<boolean>}
	 */
	stop_server: () => {
		return new Promise((resolve, reject) => {
			if(!global.server || !global.server.instance)
				return resolve(true);
			
			global.server.instance.close(() => {
				resolve(true);
			});
		});
	},
}