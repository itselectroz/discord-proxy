const fs = require('fs');

module.exports = {
	/**
	 * Checks for the existance of given file path
	 * @returns {Promise<boolean>}
	 */
	file_exists: (path) => {
		return new Promise((resolve, reject) => {
			fs.stat(path, (err, stats) => {
				if(err != undefined)
				{
					if(err.errno == -4058) // No such file or directory
						return resolve(false);
					else
						return reject(err);	
				}
				
				if(!stats)
					return resolve(false);
				
				if(!stats.isFile())
					return resolve(false);
				
				resolve(true);
			});
		});
	},

	/**
	 * Reads data from given file path
	 * @returns {Promise<boolean>}
	 */
	read_file: (path) => {
		return new Promise((resolve, reject) => {
			fs.readFile(path, (err, data) => {
				if(err != undefined)
					reject(err);
				
				resolve(data);
			})
		});
	},

	/**
	 * Writes data to given file path
	 * @returns {Promise<void>}
	 */
	write_file: (path, data) => {
		return new Promise((resolve, reject) => {
			fs.writeFile(path, data, (err) => {
				if(err != undefined)
					reject(err);
				
				resolve();
			})
		});
	}
}