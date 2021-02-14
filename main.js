const certhandler = require("./modules/certificate-handler.js");
const webserver = require('./modules/webserver');

certhandler.check_existance()
	.then((exists) => exists ? certhandler.load_certificates() : certhandler.create_certificates())
	.then(() => console.log('Loaded certificates'))
	.then(webserver.start_server)
	.then(() => console.log('Webserver started'))
	.catch((err) => {
		console.log("Houston, we have a problem. " + err);
	});

process.on('beforeExit', () => {
	webserver.stop_server();
})