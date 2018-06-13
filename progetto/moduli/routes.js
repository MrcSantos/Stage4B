/*----------------------------------------------------------------------------*/ // Moduli

const express = require('express');
const bp = require('body-parser');
const request = require('request');
const col = require('./colori');
const out = require('./output');

/*----------------------------------------------------------------------------*/ // Inizializzazione Express

const bodyParser = bp.urlencoded({ extended: false });
const routes = express();
routes.use(express.static('pages'));

/*----------------------------------------------------------------------------*/ // Variabili

/* Variabili URL */
const host = "http://stage.gnet.it/"; // Inizio URL
const path = "rest/api/2/"; // Metà dell'URL
const base = host + path; // Tutta la prima parte dell'URL

var currentFilter = "";

/* Variabili autenticazione */
var username = "";
var password = "";

function auth() {
	return 'Basic ' + new Buffer(username + ':' + password).toString('base64'); // Richiesta basic
}

/*----------------------------------------------------------------------------*/ // Intercettazione richieste client

routes.get('/', (req, res) => res.render('index')); // Fornisce l'index

routes.post("/login", bodyParser, (req, res) => {
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

routes.get('/get', (req, res) => {
	request(
		{
			url: base + "search?jql=project=DEV" + getFilter() + "+order+by+summary&fields=*all",
			method: 'GET',
			headers: {
				'Content-Type':'application/json',
				'Authorization': auth()
			}
		}, function(err, obj, body) {
			if (err) {
				// col.red(err);
			}
			else {
				if (username && password) {
					// console.log(body);
					data = JSON.parse(body);
					out.all(res, data);
				}
			}
		}
	)
}); // Richiesta di tutte le issues - FUNZIONANTE

routes.post('/filter', bodyParser, (req, res) => {
	var filters = ["", "resolution=Unresolved", "statusCategory=Done", "assignee=currentUser()+and+resolution=Unresolved"];
	currentFilter = filters[req.body.filter]
	res.send(200);
})


routes.post('/create', bodyParser, (req, res) => {
	// col.white("Inizio richiesta di creazione di una issue");

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
				// col.green("Issue creata con successo");
				if (req.body.comment != "")
				comment(res, obj.body.id, req.body.comment);
			}
		}
	)
}); // Creazione di una issue

routes.post('/comment', bodyParser, (req, res) => {
	comment(res, req.body.key, req.body.comment);
});


function comment(res, key, comment) {
	// col.white("Inizio richiesta di creazione di un commento");

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
				// col.red(err);
			}
			else {
				res.send(200);
				// col.green("Commento creato con successo");
			}
		}
	)
}

function lowLevelRequest(url, method, authorization, data, callback) {
	if (url && method && authorization) {
		var requestData = {
			url: url,
			method: method,
			headers: {
				'Content-Type':'application/json',
				'Authorization': authorization
			}
		};
		if (data) { requestData.json = data; }
	}
	else throw "Parameters error";

	request(requestData, function(err, response, body) {
		if (response.statusCode == 200) {
			if (callback && typeof(callback) === "function") {
				callback();
			}
		}

		res.send(response.statusCode);
	});
}


function getFilter() {
	if (currentFilter == "") {
		return "";
	}
	else {
		return "+and+" + currentFilter;
	}
}

module.exports = routes;
