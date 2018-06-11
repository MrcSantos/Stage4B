/*----------------------------------------------------------------------------*/ // Inizializzazione

const express = require('express'); // Implementa Express
const requ = require('./moduli/request'); // Implementa le chiamate personalizzate
const request = require('request');
const col = require('./moduli/colori');
const routes = require('./routes');
const out = require('./moduli/output');

const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({ extended: false });
const app = express();
app.use(express.static('pages'));

/*----------------------------------------------------------------------------*/ // Variabili

/* Variabili statiche utili */
const port = 5000; // Porta di ascolto
exports.port = port;

/* Variabili URL */
const host = "http://stage.gnet.it/"; // Inizio URL
const path = "rest/api/2/"; // Metà dell'URL
const base = host + path; // Tutta la prima parte dell'URL
const srcPro = "search?jql=project=";
const sort = "+order+by+summary"; // Ordina per titolo nella richiesta
const issueUrl = base + "issue";

/* Variabili autenticazione */
var username;
var password;

function auth() {
	return 'Basic ' + new Buffer(username + ':' + password).toString('base64'); // Richiesta basic
}

/*----------------------------------------------------------------------------*/ // Intercettazione richieste client

app.get('/', (req, res) => res.render('index')); // Fornisce l'index

app.post("/login", parseUrlencoded, (req, res) => {
	username = req.body.user;
	password = req.body.pass;

	request({
		url: base + "issue/createmeta",
		method: 'GET',
		headers: {
			'Content-Type':'application/json',
			'Authorization': auth()
		}
	}, 	function(err, obj, body) {
		if(err) res.send(401);
		if (obj.statusCode == 200) {
			res.send(200);
		} else {
			res.send(400);
		}
	})
});

app.get('/get', (req, res) => {
    request(
        {
            url: base + srcPro + "DEV" + sort + "&fields=*all",
            method: 'GET',
            headers: {
                'Authorization': auth()
            }
        }, function(err, obj, body) {
            if (err) {
                col.r(err);
            }
            else {
                data = JSON.parse(body);
                out.all(res, data);
            }
        }
    )
}); // Richiesta di tutte le issues - FUNZIONANTE

app.post('/create', parseUrlencoded, (req, res) => {
	col.w("Inizio richiesta di creazione di una issue");

	request(
		{
			url: issueUrl,
			method: 'POST',
			headers: {
					'Authorization': auth()
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
			else {
				res.send(200);
				col.g("Issue creata con successo");
				if (req.body.comment != "")
					comment(res, obj.body.id, req.body.comment);
			}
		}
	)
}); // Creazione di una issue

app.post('/comment', parseUrlencoded, (req, res) => {
	comment(res, req.body.key, req.body.comment);
});


function comment(res, key, comment) {
	col.w("Inizio richiesta di creazione di un commento");

	// var url = base + "issue/" + key;
	// var url = ;
	// var url = ;

	// requests()

	request(
		{
			url: base + "issue/" + key + "/comment",
			method: 'POST',
			headers: {
				'Content-Type':'application/json',
				'Authorization': auth()
			},
			json: {
				'body': comment
			}
		}, function(err, obj, body) {
			if (err) {
				col.r(err);
			}
			else {
				res.send(200);
				col.g("Commento creato con successo");
			}
		}
	)
}

function requests(url, method, authorization, data) {
	request({
		url: url,
		method: method,
		headers: {
			'Content-Type':'application/json',
			'Authorization': authorization
		},
		json: data
	}, 	function(err, obj, body) {
		if (err) {
			col.r(err);
		}
		else {
			res.send(200);
		}
	})
}




/*-------------------------------------//-------------------------------------*/


/*----------------------------------------------------------------------------*/ // Fine

/* Scrive la stringa se va tutto bene */
app.listen(port, col.g('\n[ DONE ] Checks complete - server running, listening on port ' + port + '!\n'));
