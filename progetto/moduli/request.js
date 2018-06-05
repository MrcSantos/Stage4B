const request = require('request'); // Implementa le chiamate
const col = require('./colori');
const out = require('./output');

/* Variabili URL */
const host = "http://stage.gnet.it/"; // Inizio URL
const path = "rest/api/2/"; // Metà dell'URL
const base = host + path; // Tutta la prima parte dell'URL
const srcPro = "search?jql=project=";
const pro = "DEV"
const sort = "+order+by+summary"; // Ordina per titolo nella richiesta

/* Variabili autenticazione */
const username = 'mrcsossy';
const password = 'Stage.2018';
const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64'); // Richiesta basic

exports.getAll = function getAll(res) {
    col.w("Inizio richiesta di lettura progetto");
    request(
        {
            url: base + srcPro + pro,
            method: 'GET',
            headers: {
                'Authorization': auth
            }
        }, function(err, obj, body) {
            body = JSON.parse(body);
            comments = [];

            if (err) {
                out.err(err);
            }
            else {
                col.g("Richiesta andata a buon fine\n");

                // for (var i in body.issues) {
                    request(
                        {
                            url: base + "issue/DEV-6",
                            method: 'GET',
                            headers: {
                                'Authorization': auth
                            }
                        }, function(err, obj, body) {
                            if (err) {
                                out.err(err);
                            }
                            else {
                                var comment = {
                                    'name': [],
                                    'date': [],
                                    'body': []
                                }
                                console.log(body.comments);
                                for (var j in body.comments) {
                                    comment.name.push(body.comments[j].author.displayName);
                                    comment.body.push(body.comments[j].body);
                                    comment.date.push(body.comments[j].created);
                                }
                                console.log(comment);
                                comments.push(comment);
                            }
                        }
                    )
                // }
                out.all(res, body, comments);
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
