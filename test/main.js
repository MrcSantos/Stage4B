var express = require('express');
var app = express();

app.get('/', function (req, res) {
    console.log("Someone entered in the root folder");
    res.send("Hello world!");
    res.end();
});

app.get('/winter', function (req, res) {
    console.log("Someone entered in the winter folder");
    res.sendFile(__dirname + "/winter.html");
    res.end();
});

app.get('/summer', function (req, res) {
    console.log("Someone entered in the summer folder");
    res.sendFile(__dirname + "/summer.html");
    res.end();
});

app.listen('3000');
console.log("[ DONE ] Server running, waiting...");
