/*----------------------------------------------------------------------------*/ // Inizializzazione

const express = require('express'); // Implementa Express
const request = require('./moduli/request'); // Implementa le chiamate personalizzate
const col = require('./moduli/colori');

const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({ extended: false });
const app = express();
app.use(express.static('pages'));

/*----------------------------------------------------------------------------*/ // Variabili

/* Variabili statiche utili */
const port = 8080; // Porta di ascolto
exports.port = port;

/*----------------------------------------------------------------------------*/ // Intercettazione richieste client

app.get('/', (req, res) => res.render('index')); // Fornisce l'index

app.get('/get', (req, res) => request.getAll(res)); // Richiesta di tutte le issues - FUNZIONANTE
app.get('/get/:numero', (req, res) => request.getIssue(res, req.params.numero)); // Richiesta di tutte le issues - FUNZIONANTE

app.post('/create', parseUrlencoded, (req, res) => request.create(req, res)); // Creazione di una issue

app.get('/:error', (req, res) => {
    res.send("<h1>Il link " + req.params.error + " non è valido - error 404</h1>" + home);
    col.r("Qualcuno ha ricevuto 404 all'indirizzo " + req.params.error);
});

/*----------------------------------------------------------------------------*/ // Funzioni varie

/*----------------------------------------------------------------------------*/ // Fine

/* Scrive la stringa se va tutto bene */
app.listen(port, col.g('\n[ DONE ] Checks complete - server running, listening on port ' + port + '!\n'));
