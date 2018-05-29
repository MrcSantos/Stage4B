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
var json = [
    {Id:"todo-1", Titolo:"Iniziare...", Status:"wip", Descrizione:"Lorem ipsum dolor sit amet"},
    {Id:"todo-2", Titolo:"Fare...", Status:"done", Descrizione:"consectetur adipiscing elit"},
    {Id:"todo-3", Titolo:"Provare...", Status:"to do", Descrizione:"Sed eu dolor id nisi tempus"},
    {Id:"todo-4", Titolo:"Asdfghjkl...", Status:"asd", Descrizione:"sagittis sed et ex"},
    {Id:"todo-5", Titolo:"Boh, non lo so...", Status:"wip", Descrizione:"Fusce finibus libero risus"},
    {Id:"todo-6", Titolo:"Insert catchy phrase here...", Status:"done", Descrizione:"semper metus ultrices nec"},
    {Id:"todo-7", Titolo:"bla bla...", Status:"done", Descrizione:"Vestibulum sed placerat metus"},
    {Id:"todo-8", Titolo:"Iniziare...", Status:"wip", Descrizione:"Lorem ipsum dolor sit amet"},
    {Id:"todo-9", Titolo:"Iniziare...", Status:"wip", Descrizione:"Lorem ipsum dolor sit amet"},
    {Id:"todo-10", Titolo:"Iniziare...", Status:"wip", Descrizione:"Lorem ipsum dolor sit amet"},
    {Id:"todo-11", Titolo:"Iniziare...", Status:"wip", Descrizione:"Lorem ipsum dolor sit amet"},
    {Id:"todo-12", Titolo:"Iniziare...", Status:"wip", Descrizione:"Lorem ipsum dolor sit amet"},
    {Id:"todo-13", Titolo:"Iniziare...", Status:"wip", Descrizione:"Lorem ipsum dolor sit amet"},
    {Id:"todo-14", Titolo:"Iniziare...", Status:"wip", Descrizione:"Lorem ipsum dolor sit amet"},
    {Id:"todo-15", Titolo:"Iniziare...", Status:"wip", Descrizione:"Lorem ipsum dolor sit amet"},
];

const username = 'mrcsossy';
const password = 'Stage.2018';
const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64'); // Richiesta basic

const base = "http://stage.gnet.it/"; // Inizio URL
const middle = "rest/api/latest/issue/"; // Metà dell'URL
const all = base + middle; // Tutta la prima parte dell'URL
const os = "os_authType=any"; // Per le autorizzazioni

/*----------------------------------------------------------------------------*/ // Intercettazione richieste client

app.get('/', (req, res) => res.render('index')); // Fornisce l'index

app.get('/json', (req, res) => request({
    url: all+"TODO-6",
    method: 'GET',
    headers: {
            'Authorization': auth
    },
    json: {
        "fields": {
		"id":"TODO-6"
		}
    }}, function(err, obj, body) {
        if (err) res.send(err);
        else res.send(body);
    })
);

app.get('/:error', (req, res) => {
    res.send("<h1>Il link " + req.params.error + " non è valido, prego inserirne un altro - error 404</h1>");
    console.log(Red + "Qualcuno ha ricevuto 404 all'indirizzo " + req.params.error + White);
});

/*----------------------------------------------------------------------------*/ // Funzioni varie

function riga(obj, isHead) {
    if (isHead === undefined) isHead = false;
    var out = "";

    if(isHead) out += "<thead><tr class='w3-light-grey fix'>";
    else out += "<tr>";

    for (var i in obj) {
        out +=  "<td>\
        " + obj[i] + "\
        </td>";
    }
    out += "</tr>";
    if(isHead) out += "</thead>";

    return out;
}

function t(obj) {
    var out = "";

    out += riga(head, true);

    out += "<tbody>";
    for (var i in obj)
        out += riga(obj[i]);
    out += "</tbody>";

    return out;
}

/*----------------------------------------------------------------------------*/ // Fine

app.listen(port, ()=>console.log('\n' + Green + '[ DONE ] Checks complete - server running, listening on port ' + port + '!\n' + White));
