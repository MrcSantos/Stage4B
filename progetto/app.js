/*----------------------------------------------------------------------------*/ // Inizializzazione

const express = require('express'); // Implementa Express
const request = require('ajax-request'); // Implementa le chiamate
const OAuth = require('oauth').OAuth
const app = express();
app.use(express.static('pages'));

/*----------------------------------------------------------------------------*/ // Variabili

Black = "\x1b[30m"; Red = "\x1b[31m"; Green = "\x1b[32m"; Yellow = "\x1b[33m"; Blue = "\x1b[34m"; Magenta = "\x1b[35m"; Cyan = "\x1b[36m"; White = "\x1b[37m";
const port = 8080; // Porta di ascolto

const head = {Id:"ID", Titolo:"TITOLO", Status:"STATUS", Descrizione:"DESCRIZIONE"};
const config = {key:"prova", priv:"rsa.pem"};

const username = 'mrcsossy';
const password = 'Stage.2018';
const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

const base = "http://stage.gnet.it/"; // Inizio URL
const middle = "rest/api/latest/issue/"; // Metà dell'URL
const all = base + middle; // Tutta la prima parte dell'URL
const auth = "os_authType=any"; // Per le autorizzazioni

/*----------------------------------------------------------------------------*/ // Intercettazione richieste client

app.get('/', (req, res) => res.render('index')); // Fornisce l'index

app.get('/json', (req, res) =>
request({
    url: middle+"TODO-6",
    method: 'PUT',
    json: {
        "fields": {
		"summary":"test 123321"
		}
    }, function(err, obj, body) {
        if (error) res.send(error);
        else res.send(response.statusCode, body);
    }})
);

app.get('/:error', (req, res) => {
    res.send("<h1>Il link " + req.params.error + " non è valido, prego inserirne un altro - error 404</h1>");
    console.log(Red + "Qualcuno ha ricevuto 404 all'indirizzo " + req.params.error + White);
});

/*----------------------------------------------------------------------------*/ // Funzioni varie

function riga(obj, isHead) {
    if (isHead === undefined) isHead = false;
    var out;

    if(isHead) out = "<tr class='w3-light-grey'>";
    else out = "<tr>";

    for (var i in obj) {
        out +=  "<td>\
        " + obj[i] + "\
        </td>";
    }
    out += "</tr>";

    return out;
}

function tabelize() {
    var out = "";

    out += riga(head, true);

    return out;
}

/*----------------------------------------------------------------------------*/ // Fine

app.listen(port, console.log('\n' + Green + '[ DONE ] Checks complete - server running, listening on port ' + port + '!\n' + White));
