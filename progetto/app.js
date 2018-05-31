/*----------------------------------------------------------------------------*/ // Inizializzazione

const express = require('express'); // Implementa Express
const request = require('request'); // Implementa le chiamate
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({ extended: false });
const app = express();
app.use(express.static('pages'));

/*----------------------------------------------------------------------------*/ // Variabili

/* Variabili colori */
Black = "\x1b[30m"; Red = "\x1b[31m"; Green = "\x1b[32m"; Yellow = "\x1b[33m"; Blue = "\x1b[34m"; Magenta = "\x1b[35m"; Cyan = "\x1b[36m"; White = "\x1b[37m";

/* Variabili statiche utili */
const port = 8080; // Porta di ascolto
const head = {Id:"ID", Titolo:"TITOLO", Status:"STATUS", Descrizione:"DESCRIZIONE"};
const home = "<br><a = href='http://localhost:" + port + "/'>Clicca qui per tornare alla home</a>";

/* Variabili autenticazione */
const username = 'mrcsossy';
const password = 'Stage.2018';
const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64'); // Richiesta basic

/* Variabili URL */
const host = "http://stage.gnet.it/"; // Inizio URL
const path = "rest/api/latest/"; // Metà dell'URL
const base = host + path; // Tutta la prima parte dell'URL
const issueUrl = base + "issue";
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
                error(err);
            }
            else {
                good(out(res, body));
            }
        }
    )
});

app.post('/create', parseUrlencoded, (req, res) => { // Creazione di una issue
    neutral("Inizio richiesta di creazione di una issue");

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
                       "key": "TODO"
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
                error(err);
            }
            else {
                good();
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
function error(err) {
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
function riga(id, obj, isHead) {
    if (isHead === undefined) isHead = false;
    if (id === undefined) id = "";
    var out = "";

    if(isHead) out += "<thead><tr class='w3-light-grey fix'>";
    else out += "<tr id='" + id + "'onclick='pop(" + id + ")'>";

    for (var i in obj) {
        out +=  "<td class='" + i + "'>\
        " + obj[i] + "\
        </td>";
    }
    out += "</tr>";
    if(isHead) out += "</thead>";

    return out;
}
function tabelize(obj) {
    var out = "";

    out += riga(i, head, true);

    out += "<tbody>";
    for (var i in obj)
        out += riga(i, obj[i]);
    out += "</tbody>";

    return out;
}

/*----------------------------------------------------------------------------*/ // Fine

/* Scrive la stringa se va tutto bene */
app.listen(port, green('\n[ DONE ] Checks complete - server running, listening on port ' + port + '!\n'));
