const request = require('request'); // Implementa le chiamate
const col = require('./colori');
const out = require('./output');

/* Variabili URL */
const host = "http://stage.gnet.it/"; // Inizio URL
const path = "rest/api/2/"; // Metà dell'URL
const base = host + path; // Tutta la prima parte dell'URL
const srcPro = "search?jql=project=";
const sort = "+order+by+summary"; // Ordina per titolo nella richiesta

/* Variabili autenticazione */
const username = 'mrcsossy';
const password = 'Stage.2018';
const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64'); // Richiesta basic

exports.getAll = function getAll(res) {
    col.w("Inizio richiesta di lettura progetto");
    request(
        {
            url: base + "issue/DEV-6/comment",
            method: 'GET',
            headers: {
                'Authorization': auth
            }
        }, function(err, obj, body) {
            if (err) {
                out.err(err);
            }
            else {
                data = JSON.parse(body)
                console.log(data.comments[0].body);
                col.g("Richiesta andata a buon fine\n");
                out.all(res, body);
            }
        }
    )
}
exports.getIssue = function getIssue(res, num) {
    col.w("Inizio richiesta di lettura issue N° " + num);
    request(
        {
            url: issueUrl + "/" + num,
            method: 'GET',
            headers: {
                'Authorization': auth
            }
        }, function(err, obj, body) {
            if (err) {
                out.err(err);
            }
            else {
                col.g("Richiesta andata a buon fine\n");
                res.send(body);
            }
        }
    )
}
