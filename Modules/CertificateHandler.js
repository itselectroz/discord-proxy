const Promise = require("bluebird");
const pem     = require("pem");
const fs      = require("fs");


global.certificate_paths = {
	key: "../Certificates/cert.key",
	cert: "../Certificates/cert.crt"
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
			pem.createCertificate({ days: 365, selfSigned: true }, (err, keys) => {
				console.log(err);
				console.log(keys);
				if(err) reject(err);
				global.certificates = {
					key: keys.serviceKey,
					cert: keys.certificate
				};
			});
		});
	}
}
