const pem = require('pem');
const fs = require('fs');

const util = require('./util');

global.certificate_paths = {
	key: "./Certificates/cert.key",
	cert: "./Certificates/cert.crt",
	config: __dirname+"\\..\\Certificates\\openssl.cnf",
};


module.exports = {
	/**
	 * Checks for the existance of the certificate files
	 * @returns {Promise<boolean>}
	 */
	check_existance: () => {
		return new Promise(async (resolve, reject) => {
			const results = await Promise.all([
				util.file_exists(global.certificate_paths.key),
				util.file_exists(global.certificate_paths.cert)
			]).catch(reject);
			
			resolve(results.every(v => v == true));
		});
	},
	/**
	 * Loads the certificates into the global dictionary `global.certificates`
	 * @returns {Promise<void>}
	 */
	load_certificates: () => {
		return new Promise(async (resolve, reject) => {
			global.certificates = {};
			
			const certificates = await Promise.all([
				util.read_file(global.certificate_paths.key),
				util.read_file(global.certificate_paths.cert)
			]).catch(reject);

			global.certificates.key = certificates[0];
			global.certificates.cert = certificates[1];

			resolve();
		});
	},

	/**
	 * Creates valid SSL certificate & keys for a https server, writes them to their respective files and loads them into the global.certificates dictionary.
	 * Creation alternative to load_certificates
	 * @returns {Promise<void>}
	 */
	create_certificates: () => {
		return new Promise((resolve, reject) => {
			pem.createCertificate({csrConfigFile: global.certificate_paths.config, days: 365, selfSigned: true }, (err, keys) => {
				if (err != undefined) 
					reject(err);

				console.log(keys);

				global.certificates = {
					key: keys.serviceKey,
					cert: keys.certificate
				};

				write_certificates().then(resolve).catch(reject);
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
	return new Promise(async (resolve, reject) => {
		await Promise.all([
			util.write_file(global.certificate_paths.key, global.certificates.key),
			util.write_file(global.certificate_paths.cert, global.certificates.cert)
		]).catch(reject);

		resolve();
	});
}