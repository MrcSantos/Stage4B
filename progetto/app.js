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
const config = {key:"prova", priv:"atlassian-oauth-examples/rsa.pem"};

const consumer = new OAuth(
    "https://jdog.atlassian.com/plugins/servlet/oauth/request-token",
    "https://jdog.atlassian.com/plugins/servlet/oauth/access-token",
    config.key,
    "",
    "1.0",
    "http://localhost:8080/sessions/callback",
    "RSA-SHA1",
	null,
	config.priv
);

const base = "http://stage.gnet.it/"; // Inizio URL
const middle = "rest/api/latest/issue/"; // Metà dell'URL
const all = base + middle; // Tutta la prima parte dell'URL
const auth = "os_authType=any"; // Per le autorizzazioni

/*----------------------------------------------------------------------------*/ // Intercettazione richieste client

app.get('/', (req, res) => res.render('index')); // Fornisce l'index

app.get('/sessions/connect', function(request, response){
	consumer.getOAuthRequestToken (
		function(error, oauthToken, oauthTokenSecret, results) {
    		if (error) {
				console.log(error.data);
      			response.send('Error getting OAuth access token');
			}
    		else {
      			request.session.oauthRequestToken = oauthToken;
      			request.session.oauthRequestTokenSecret = oauthTokenSecret;
      			response.redirect("https://jdog.atlassian.com/plugins/servlet/oauth/authorize?oauth_token="+request.session.oauthRequestToken);
			}
		}
	)
});

app.get('/sessions/callback', function(request, response){
	consumer.getOAuthAccessToken (
		request.session.oauthRequestToken,
		request.session.oauthRequestTokenSecret,
		request.query.oauth_verifier,
		function(error, oauthAccessToken, oauthAccessTokenSecret, results){
			if (error) {
				console.log(error.data);
				response.send("error getting access token");
			}
    		else {
                request.session.oauthAccessToken = oauthAccessToken;
                request.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
                consumer.get("https://jdog.atlassian.com/rest/api/latest/issue/JRADEV-8110.json",
                	request.session.oauthAccessToken,
                	request.session.oauthAccessTokenSecret,
                	"application/json",

                	function(error, data, resp){
                    	console.log(data);
                        data = JSON.parse(data);
                        response.send("I am looking at: "+data["key"]);
                	}
        		);
            }
		}
	)
});

app.get('/json', (req, res) => 
request({
    url: all+"TODO-6?os_authType=basic",
    method: 'GET'/*,
    data: {
        "os_authType": "basic"
    }*/
}, function(err, obj, body) {
    if(body) res.send(body);
    if(obj) res.send(obj);
    if(err) res.send(err);
}));

app.get('/:error', (req, res) => {
    res.send("<h1>Il link " + req.params.error + " non è valido, prego inserirne un altro - error 404</h1>");
    console.log(Red + "Qualcuno ha ricevuto 404 all'indirizzo " + req.params.error + White);
});

/*----------------------------------------------------------------------------*/ // Funzioni varie

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

/*----------------------------------------------------------------------------*/ // Fine

app.listen(port, console.log('\n' + Green + '[ DONE ] Checks complete - server running, listening on port ' + port + '!\n' + White));
