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
const path = "rest/api/latest/"; // Metà dell'URL
const base = host + path; // Tutta la prima parte dell'URL
const srcPro = "search?jql=project=";
const sort = "+order+by+summary"; // Ordina per titolo nella richiesta
const issueUrl = base + "issue";

/* Variabili autenticazione */
const username = 'mrcsossy';
const password = 'Stage.2018';
const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64'); // Richiesta basic

/*----------------------------------------------------------------------------*/ // Intercettazione richieste client

app.get('/', (req, res) => res.render('index')); // Fornisce l'index

app.get('/get', (req, res) => requ.getAll(res)); // Richiesta di tutte le issues - FUNZIONANTE
app.get('/get/:numero', (req, res) => req.getIssue(res, requ.params.numero)); // Richiesta di tutte le issues - FUNZIONANTE

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
                    "summary": req.body.tit,
                    "description": req.body.des,
                    "issuetype": {
                       "name": "Task"
                    }
                }
            }
        }, function(err, res, body) {
            if (err) {
                out.err(err);
            }
        }
    )
}); // Creazione di una issue

app.get('/:error', (req, res) => {
    res.send("<h1>Il link " + req.params.error + " non è valido - error 404</h1>" + home);
    col.r("Qualcuno ha ricevuto 404 all'indirizzo " + req.params.error);
});

/*----------------------------------------------------------------------------*/ // Fine

/* Scrive la stringa se va tutto bene */
app.listen(port, col.g('\n[ DONE ] Checks complete - server running, listening on port ' + port + '!\n'));
