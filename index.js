const certhandler = require("./Modules/CertificateHandler.js");

certhandler.check_existance()
        .then((exists) => {
            return exists ? certhandler.load_certificates() : certhandler.create_certificates();
        }).catch((err) => {
            console.log("Heuston, we have a problem. " + err);
        });