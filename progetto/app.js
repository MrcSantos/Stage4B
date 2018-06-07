/*----------------------------------------------------------------------------*/ // Inizializzazione

const express = require('express'); // Implementa Express
const requ = require('./moduli/request'); // Implementa le chiamate personalizzate
const request = require('request');
const col = require('./moduli/colori');

const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({ extended: false });
const app = express();
app.use(express.static('pages'));

/*----------------------------------------------------------------------------*/ // Variabili

/* Variabili statiche utili */
const port = 8080; // Porta di ascolto
exports.port = port;

/* Variabili URL */
const host = "http://stage.gnet.it/"; // Inizio URL
const path = "rest/api/2/"; // Metà dell'URL
const base = host + path; // Tutta la prima parte dell'URL
const srcPro = "search?jql=project=";
const sort = "+order+by+summary"; // Ordina per titolo nella richiesta
const issueUrl = base + "issue";
const home = "<br><a = href='http://localhost:" + port + "/'>Clicca qui per tornare alla home</a>";

/* Variabili autenticazione */
const username = 'mrcsossy';
const password = 'Stage.2018';
const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64'); // Richiesta basic

/*----------------------------------------------------------------------------*/ // Intercettazione richieste client

app.get('/', (req, res) => res.render('index')); // Fornisce l'index

app.get('/get', (req, res) => requ.getAll(res)); // Richiesta di tutte le issues - FUNZIONANTE

app.post('/create', parseUrlencoded, (req, res) => {
    col.w("Inizio richiesta di creazione di una issue");

    request(
        {
            url: issueUrl,
            method: 'POST',
            headers: {
                    'Authorization': auth
            },
            json: {
                "fields": {
                    "project": {
                       "key": "DEV"
                    },
                    "summary": req.body.summary,
                    "description": req.body.description,
                    "issuetype": {
                       "name": "Task"
                    }
                }
            }
        }, function(err, obj, body) {
            if (err) {
                out.err(err);
            }
            console.log(JSON.stringify(obj));
            if (req.body.comment != "") {
                comment(obj.body.id, req.body.comment);
            }
        }
    )
}); // Creazione di una issue

app.post('/comment', parseUrlencoded, (req, res) => {
    comment(req.body.key, req.body.comment);
});


function comment(key, comment) {
    col.w("Inizio richiesta di creazione di un commento");

    request(
        {
            url: base + "issue/" + key + "/comment",
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': auth
            },
            json: {
                'body': comment
            }
        }, function(err, obj, body) {
            if (err) {
                col.r(err);
            }
            else {
                col.g("Commento creato con successo");
            }
        }
    )
}

/*----------------------------------------------------------------------------*/ // Fine

/* Scrive la stringa se va tutto bene */
app.listen(port, col.g('\n[ DONE ] Checks complete - server running, listening on port ' + port + '!\n'));
