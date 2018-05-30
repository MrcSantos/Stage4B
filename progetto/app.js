/*----------------------------------------------------------------------------*/ // Inizializzazione

const express = require('express'); // Implementa Express
const request = require('ajax-request'); // Implementa le chiamate
const app = express();
app.use(express.static('pages'));

/*----------------------------------------------------------------------------*/ // Variabili

/* Variabili colori */
Black = "\x1b[30m"; Red = "\x1b[31m"; Green = "\x1b[32m"; Yellow = "\x1b[33m"; Blue = "\x1b[34m"; Magenta = "\x1b[35m"; Cyan = "\x1b[36m"; White = "\x1b[37m";

/* Variabili statiche utili */
const port = 8080; // Porta di ascolto
const head = {Id:"ID", Titolo:"TITOLO", Status:"STATUS", Descrizione:"DESCRIZIONE"};
const json = [
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
const home = "<br><a = href='http://localhost:" + port + "/'>Clicca qui per tornare alla home</a>";

/* Variabili autenticazione */
const username = 'mrcsossy';
const password = 'Stage.2018';
const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64'); // Richiesta basic
const data = {
    "fields": {
       "project":
       {
          "key": "TODO"
       },
       "summary": "No REST for the Wicked.",
       "description": "Creating of an issue using the REST API"
   }
}

/* Variabili URL */
const host = "http://stage.gnet.it/"; // Inizio URL
const path = "rest/api/latest/"; // Metà dell'URL
const base = host + path; // Tutta la prima parte dell'URL
const srcPro = "search?jql=project=";
const sort = "+order+by+summary"; // Ordina per titolo nella richiesta
const fields = "fields=id,summary,description,status"; // Solo i campi interessati

/*----------------------------------------------------------------------------*/ // Intercettazione richieste client

app.get('/', (req, res) => res.render('index')); // Fornisce l'index

app.get('/get', (req, res) => { // Richiesta di tutte le issues - FUNZIONANTE
    neutral("Inizio richiesta di lettura");

    request(
        {
            url: base + srcPro + "TODO" + sort + "&" + fields,
            method: 'GET',
            headers: {
                'Authorization': auth
            }
        }, function(err, obj, body) {
            if (err) {
                error();
            }
            else {
                good(out(res, body));
            }
        }
    )
});

app.get('/create', (req, res) => { // Creazione di una issue
    neutral("Inizio richiesta di creazione di una issue");

    request(
        {
            url: base,
            method: 'POST',
            headers: {
                    'Authorization': auth
            },
            body: JSON.stringify(data)
        }, function(err, obj, body) {
            if (err) {
                error();
            }
            else {
                good(/*Funzione di callback*/);
            }
        }
    )
});

app.get('/:error', (req, res) => {
    res.send("<h1>Il link " + req.params.error + " non è valido - error 404</h1>" + home);
    red("Qualcuno ha ricevuto 404 all'indirizzo " + req.params.error);
});

/*----------------------------------------------------------------------------*/ // Funzioni varie

/* Funzioni di output */
function good(callback) {
    green("Richiesta andata a buon fine\n");
    callback;
}
function error() {
    res.send("Siamo spiacenti ma si è verificato un errore" + home);
    red("Richiesta fallita; " + err + "\n");
}
function out(res, body) {
    var got = JSON.parse(body);

    function extract(i) {
        if(got.issues[i].fields.description === null) got.issues[i].fields.description = 'Nessuna descrizione';
        var issue = {
            'key': got.issues[i].key,
            'summary': got.issues[i].fields.summary,
            'status': got.issues[i].fields.status.statusCategory.name,
            'description': got.issues[i].fields.description
        };
        return issue;
    }

    function issues() {
        var issues = [];
        for (var i in got.issues)
            issues.push(extract(i));
        return issues;
    }

    res.send(tabelize(issues()));
}

/* Funzioni per il log colorato */
function green(str) {
    console.log(Green + str + Red);
}
function red(str) {
    console.log(Red + str);
}
function neutral(str) {
    console.log(White + str + Red);
}

/* Funzioni per la paginazione */
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
function tabelize(obj) {
    var out = "";

    out += riga(head, true);

    out += "<tbody>";
    for (var i in obj)
        out += riga(obj[i]);
    out += "</tbody>";

    return out;
}

/*----------------------------------------------------------------------------*/ // Fine

/* Scrive la stringa se va tutto bene */
app.listen(port, green('\n[ DONE ] Checks complete - server running, listening on port ' + port + '!\n'));
