Black = "\x1b[30m"; Red = "\x1b[31m"; Green = "\x1b[32m"; Yellow = "\x1b[33m"; Blue = "\x1b[34m"; Magenta = "\x1b[35m"; Cyan = "\x1b[36m"; White = "\x1b[37m";

const express = require('express')
const app = express()
const port = 8080;
const head = {Id:"ID", Titolo:"TITOLO", Status:"STATUS", Descrizione:"DESCRIZIONE"};

const rest = require('jira-rest');

var config = {
    "url": "http://stage.gnet.it/rest/api/latest/issue/10008",
    "authorization": {
        "username": "mrcsossy",
        "password": "Stage.2018"
    }
};
var jira = rest.connect(config);

app.use(express.static('pages'));
app.set('views', './pages');
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index'));
app.get('/json', (req, res) => request(res));
app.get('/:error', (req, res) => error(res, req.params.error));

function request(res) {
    jira.fetchProjects((error, data) => res.send(error+data));
}

function error(res, link) {
    res.send("Il link " + link + " non è valido, prego inserirne un altro - error 404");
    console.log(Red + "Qualcuno ha ricevuto 404" + White);
}

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

app.listen(port, () => console.log('\n' + Green + '[ DONE ] Checks complete - server running, listening on port ' + port + '!\n' + White));
