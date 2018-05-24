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

var json = [{Id:"todo-1", Titolo:"Iniziare...", Status:"wip", Descrizione:"Sono una tastiera qwerty!"}, {Id:"todo-2", Titolo:"bla bla...", Status:"done", Descrizione:"Sono una tastiera bella!"}];

app.use(express.static('pages'));
app.set('views', './pages');
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index', { titolo: 'Ciao Torricelli' }));
app.get('/id', (req, res) => res.send(json[0].Id));
app.get('/titolo', (req, res) => res.send(json[0].Titolo));
app.get('/json', (req, res) => res.send(tabelize(json)));
app.get('/:error', (req, res) => error(res, req.params.error));

function error(res, e) {
    res.send("Il link " + e + " non è valido - error 404");
    console.log(Red + "Qualcuno ha ricevuto 404");
}

function tabelize(obj) {
    var out = "";
    var i;

    for (i in obj) {
        out += "<tr>";
        for (j in obj[i]) {
            out +=  "<td>\
            " + obj[i][j] + "\
            </td>";
        }
    }

    return out;
}

app.listen(port, '0.0.0.0', () => console.log('\n' + Green + '[ DONE ] Checks complete - server running, listening on port ' + port + '!\n'));
