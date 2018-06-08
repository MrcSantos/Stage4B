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
    request(
        {
            url: base + srcPro + "DEV" + sort + "&fields=*all",
            method: 'GET',
            headers: {
                'Authorization': auth
            }
        }, function(err, obj, body) {
            if (err) {
                col.r(err);
            }
            else {
                data = JSON.parse(body);
                out.all(res, data);
            }
        }
    )
}
