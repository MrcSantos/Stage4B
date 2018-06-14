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

/*----------------------------------------------------------------------------*/ // Variabili globali

var host = ""; // Host da Inizializzare

var currentFilter = ""; // Filtro corrente, se vuoto prende tutte le issues

/* Variabili autenticazione */
var username = "";
var password = "";

/*----------------------------------------------------------------------------*/ // Funzioni

// Returna tutta la prima parte dell'URL
function getBaseUrl() {
	const path = "/rest/api/2/";
	return host + path;
}

// Returna la stringa di autenticazione per l'header delle richieste utilizzando le var di autenticazione globali
function auth() {
	return 'Basic ' + new Buffer(username + ':' + password).toString('base64'); // Stringa richiesta basic
}

// Imposta il filtro corrente
function setFilter(res, filterNumber) {
	var filters = ["", "resolution=Unresolved", "statusCategory=Done", "assignee=currentUser()+and+resolution=Unresolved"];
	currentFilter = filters[filterNumber];
	res.send(200);
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

// Effettua una richiesta per controllare le credenziali
function checkCredentials(res, user, pass, hostNet) {
	username = user;
	password = pass;
	host = hostNet;

	var url = getBaseUrl() + "issue/createmeta";
	var method = 'GET';
	var authorization = auth();

	lowLevelRequest(res, url, method, authorization, null, (error, response, body) => res.send(response.statusCode));
}

// Effettua una richiesta per ricevere tutte le issues
function getAllIssues(res, projectName, sortType) {
	// Controlla se viene specificato il nome progetto
	function checkProj() {
		if (projectName) { return "project=" + projectName; }
		else { return "" }
	}

	// Controlla se viene specificato il tipo di ordinamento
	function checkSort() {
		if (sortType) { return "+order+by+" + sortType; }
		else { return "" }
	}

	// Controlla se viene specificato il filtro
	function checkFilter() {
		if (currentFilter) {
			if (projectName) { return "+and+" + currentFilter; }
			else { return currentFilter; }
		}
		else { return ""; }
	}

	// Variabili url locali
	var jql = "search?jql=";
	var project = checkProj();
	var filter = checkFilter();
	var sort = checkSort();
	var fields = "&fields=*all";

	// Variabili per la richiesta
	var url = getBaseUrl() + jql + project + filter + sort + fields;
	var method = 'GET';
	var authorization = auth();
	lowLevelRequest(res, url, method, authorization, null, (error, response, body) => {
		if (response.statusCode <= 400) {
			var data = JSON.parse(body);
			out.all(res, data);
		}
	});
}

// Effettua una richiesta per creare una issue
function createIssue(res, project, summary, type, description, comment) {
	var url = getBaseUrl() + "issue/";
	var method = 'POST';
	var authorization = auth();
	var data = {
		"fields": {
			"project": {
				"key": project
			},
			"summary": summary,
			"description": description,
			"issuetype": {
				"name": type
			}
		}
	}

	lowLevelRequest(res, url, method, authorization, data, (error, response, body) => {
		res.send(200);
		if (comment != "") { commentIssue(res, response.body.id, comment) }
	});
}

// Effettua una richiesta per commentare
function commentIssue(res, idIssue, commentBody) {
	var url = getBaseUrl() + "issue/" + idIssue + "/comment";
	var method = 'POST';
	var authorization = auth();
	var data = { 'body': commentBody };

	lowLevelRequest(res, url, method, authorization, data, (error, response, body) => res.send(response.statusCode));
}

/*----------------------------------------------------------------------------*/ // Intercettazione richieste client

routes.get('/', (req, res) => res.render('index')); // Fornisce l'index

// Richieste che modificano i dati globali
routes.post("/login", bodyParser, (req, res) => checkCredentials(res, req.body.user, req.body.pass, req.body.host));
routes.post('/filter', bodyParser, (req, res) => setFilter(res, req.body.filter));

// Richieste per la modifica delle issues
routes.get('/get', (req, res) => getAllIssues(res, "DEV", "key+desc"));
routes.post('/create', bodyParser, (req, res) => createIssue(res, "DEV", req.body.summary, req.body.type, req.body.description, req.body.comment));
routes.post('/comment', bodyParser, (req, res) => commentIssue(res, req.body.key, req.body.comment));

module.exports = routes;
