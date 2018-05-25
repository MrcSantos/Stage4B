Black = "\x1b[30m"
Red = "\x1b[31m"
Green = "\x1b[32m"
Yellow = "\x1b[33m"
Blue = "\x1b[34m"
Magenta = "\x1b[35m"
Cyan = "\x1b[36m"
White = "\x1b[37m"

const express = require('express')
const app = express()
const port = 8080;

const request = require('ajax-request');

var head = {Id:"ID", Titolo:"TITOLO", Status:"STATUS", Descrizione:"DESCRIZIONE"};

app.use(express.static('pages'));
app.set('views', './pages');
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index'));
app.get('/json', (req, res) => res.send(tabelize()));
app.get('/:error', (req, res) => error(res, req.params.error));

function error(res, e) {
    res.send("Il link " + e + " non è valido, prego inserirne un altro - error 404");
    console.log(Red + "Qualcuno ha ricevuto 404");
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

app.listen(port, () => console.log('\n' + Green + '[ DONE ] Checks complete - server running, listening on port ' + port + '!\n'));
