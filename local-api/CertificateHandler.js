const Promise = require("bluebird");
const pem     = require("pem");
const fs      = require("fs");


global.certificate_paths = {
	key: "./Certificates/cert.key",
	cert: "./Certificates/cert.crt",
	config: __dirname+"\\..\\Certificates\\openssl.cnf",
};

module.exports = {
	/**
	 * Checks for the existance of the certificate files
	 */
	check_existance: () => {
		return new Promise((response, reject) => {
			let respond = false;
			fs.exists(global.certificate_paths.key, (exists) => {
				if (!exists) response(false);
				if (respond) response(true);
				respond = true;
			});
			fs.exists(global.certificate_paths.cert, (exists) => {
				if (!exists) response(false);
				if (respond) response(true);
				respond = true; 
			});
		});
	},
	/**
	 * Loads the certificates into the global dictionary `global.certificates`
	 * @returns {Promise<void>}
	 */
	load_certificates: () => {
		return new Promise((response, reject) => {
			global.certificates = {};
			fs.readFile(global.certificate_paths.key, (error, data) => {
				if (error) reject(error);
				global.certificates.key = data;
				if (global.certificates.cert) response();
			});
			fs.readFile(global.certificate_paths.cert, (error, data) => {
				if (error) reject(error);
				global.certificates.cert = data;
				if (global.certificates.key) response();
			});
		});
	},

	/**
	 * Creates valid SSL certificate & keys for a https server, writes them to their respective files and loads them into the global.certificates dictionary.
	 * Creation alternative to load_certificates
	 * @returns {Promise<Boolean>}
	 */
	create_certificates: () => {
		return new Promise((response, reject) => {
			pem.createCertificate({csrConfigFile: global.certificate_paths.config, days: 365, selfSigned: true }, (err, keys) => {
				console.log(err);
				if (err != undefined) reject(err);

				global.certificates = {
					key: keys.serviceKey,
					cert: keys.certificate
				};
				write_certificates().then(response).catch(reject);
			});
		});
	}
}

/**
 * Internal function for writing certificates in memory to files.
 * Used in create_certificates to prevent callback hell.
 * @returns {Promise<void>}
 */
function write_certificates() {
	return new Promise((resolve) => {
		fs.writeFile(global.certificate_paths.key, global.certificates.key, (err) => {
			console.log(err);
			fs.writeFile(global.certificate_paths.cert, global.certificates.key, (err2) => {
				console.log(err2);
				resolve();
			});
		});
	});
}