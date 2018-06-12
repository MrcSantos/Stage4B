/*----------------------------------------------------------------------------*/ // Moduli

const express = require('express');
const routes = require('./moduli/routes');
const col = require('./moduli/colori');

/*----------------------------------------------------------------------------*/ // Variabili

const app = express();
const port = 5000;

/*----------------------------------------------------------------------------*/ // Inizializzazione Express

app.use("/", routes);

/* Scrive la stringa se non ci sono errori al lancio */
app.listen(port, col.green('\n[ DONE ] Checks complete - server running, listening on port ' + port + '!\n'));
