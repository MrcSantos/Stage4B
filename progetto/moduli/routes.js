/*----------------------------------------------------------------------------*/ // Moduli

const express = require('express');
const bp = require('body-parser');
const request = require('request');
const col = require('./colori');
const out = require('./output');

/*----------------------------------------------------------------------------*/ // Inizializzazione Express

const routes = express();
routes.use(express.static('pages'));

const bodyParser = bp.urlencoded({ extended: false }); // Utilizzato per leggere i dati passati dal client

/*----------------------------------------------------------------------------*/ // Variabili

/* Variabili URL */
const host = "http://stage.gnet.it/"; // Inizio URL
const path = "rest/api/2/"; // Metà dell'URL
const base = host + path; // Tutta la prima parte dell'URL

/* Variabile filtro */
var currentFilter = ""; // Filtro corrente, se vuoto prende tutte le issues

/* Variabili autenticazione */
var username = "";
var password = "";

/*----------------------------------------------------------------------------*/ // Funzioni

// Returna la stringa di autenticazione per l'header delle richieste utilizzando le var di autenticazione globali
function auth() {
	return 'Basic ' + new Buffer(username + ':' + password).toString('base64'); // Stringa richiesta basic
}

// Returna la stringa necessaria per l'url prendendo la var del filtro per costruirla
function getFilter() {
	if (currentFilter == "") { // Prende tutte le issue non aggiungendo i filtri
		return "";
	}
	else {
		return "+and+" + currentFilter; // Aggiunge il filtro alla ricerca nell'url
	}
}

// Effettua una richiesta a Jira chiedendo tutti i parametri necessari
function lowLevelRequest(res, url, method, authorization, data, callback) {
	if (res && url && method && authorization) { // Controllo delle variabili fondamentali per una richiesta
		// Costruisco l'oggetto con i dati per la richiesta
		var requestData = {
			url: url,
			method: method,
			headers: {
				'Content-Type':'application/json',
				'Authorization': authorization
			}
		};
		// Se ci sono dei dati allora li metto dentro alla voce json
		if (data) { requestData.json = data; }
	}
	else throw "Parameters error"; // Lancia un errore se non ci sono tutti i dati richiesti

	// Effettua la richiesta con tutti i dati validati e spedisce al client la risposta del server Jira
	request(requestData, function(error, response, body) {
		if (callback && typeof(callback) === "function") {
			callback(error, response, body);
		}
	})
}

// Effettua una richiesta per commentare
function comment(res, key, commentBody) {
	var url = base + "issue/" + key + "/comment";
	var method = 'POST';
	var authorization = auth();
	var data = { 'body': commentBody };

	lowLevelRequest(res, url, method, authorization, data, (error, response, body) => res.send(response.statusCode));
}

// Effettua una richiesta per controllare le credenziali
function checkCredentials(res, user, pass) {
	username = user;
	password = pass;

	var url = base + "issue/createmeta";
	var method = 'GET';
	var authorization = auth();

	lowLevelRequest(res, url, method, authorization, null, (error, response, body) => res.send(response.statusCode));
}

//
function getAllIssues(res, projectName, sortType) {
	// Controlla se viene specificato il nome progetto
	function checkProj(project) {
		if (project) { return "project=" + project; }
		else { return "" }
	}

	// Controlla se viene specificato il tipo di ordinamento
	function checkSort(sort) {
		if (sort) { return "+order+by+" + sort; }
		else { return "" }
	}

	// Variabili url locali
	var jql = "search?jql=";
	var project = checkProj(projectName);
	var sort = checkSort(sortType);
	var fields = "&fields=*all";

	// Variabili per la richiesta
	var url = base + jql + project + sort + fields;
	var method = 'GET';
	var authorization = auth();
	lowLevelRequest(res, url, method, authorization, null, (error, response, body) => {
		if (username && password) {
			var data = JSON.parse(body);
			out.all(res, data);
		}
	});
}

/*----------------------------------------------------------------------------*/ // Intercettazione richieste client

routes.get('/', (req, res) => res.render('index')); // Fornisce l'index

routes.post("/login", bodyParser, (req, res) => checkCredentials(res, req.body.user, req.body.pass));

routes.get('/get', (req, res) => getAllIssues(res, "DEV", "key+desc"));

routes.post('/filter', bodyParser, (req, res) => {
	var filters = ["", "resolution=Unresolved", "statusCategory=Done", "assignee=currentUser()+and+resolution=Unresolved"];
	currentFilter = filters[req.body.filter]
	res.send(200);
});

routes.post('/create', bodyParser, (req, res) => {
	request(
		{
			url: base + "issue",
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
						"name": req.body.type
					}
				}
			}
		}, function(err, obj, body) {
			if (err) {
				out.err(err);
			}
			else {
				res.send(200);
				if (req.body.comment != "")
				comment(res, obj.body.id, req.body.comment);
			}
		}
	)
}); // Creazione di una issue

routes.post('/comment', bodyParser, (req, res) => {
	comment(res, req.body.key, req.body.comment);
});

module.exports = routes;
