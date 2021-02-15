const certhandler = require("./modules/certificate-handler.js");
const webserver = require('./modules/webserver');
const hosts = require('./modules/hosts');

certhandler.check_existance()
	.then((exists) => exists ? certhandler.load_certificates() : certhandler.create_certificates())
	.then(() => console.log('Loaded certificates'))
	.then(webserver.start_server)
	.then(() => console.log('Webserver started'))
	.then(hosts.write_redirects)
	.then(() => console.log('Written to hosts file'))
	.catch((err) => {
		console.log("Houston, we have a problem. " + err);
	});

function exitHandler() { 
	Promise.all([
		webserver.stop_server(),
		hosts.remove_redirects()
	]).then(() => {
		console.log('Cleanup complete.');
		process.exit();
	});
}

[
  'beforeExit', 'uncaughtException', 'unhandledRejection', 
  'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 
  'SIGABRT','SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 
  'SIGUSR2', 'SIGTERM', 
].forEach(evt => process.on(evt, exitHandler));