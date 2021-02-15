const SimpleHosts = require('simple-hosts').SimpleHosts;
const hosts = new SimpleHosts();

global.redirects = {
	ip: '127.0.0.1',
	hosts: [
		'discord.com',
		'discord.gg'
	],
	originalIps: {}
}

module.exports = {
	/**
	 * Writes relevant redirects to the hosts file
	 * @returns {Promise<boolean>}
	 */
	write_redirects: async () => {
		let originalIps = {};
		for(let host of global.redirects.hosts) {
			if(!!hosts.getIp(host))
				originalIps[host] = hosts.getIp(host);
			hosts.set(global.redirects.ip, host);
		}
		global.redirects.originalIps = originalIps;
		return true;
	},

	/**
	 * Removes all hosts file modifications made by the proxy
	 * @returns {Promise<boolean>}
	 */
	remove_redirects: async () => {
		const originalIps = global.redirects.originalIps;
		for(let host of global.redirects.hosts) {
			if(originalIps[host])
				hosts.set(originalIps[host], host);
			else 
				hosts.removeHost(host);
		}
		return true;
	}
}