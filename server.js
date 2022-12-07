//this code will make an express server and listen on port 3000
//for requests to the root URL (/) or route it will respond with "Hello World!"
var express = require('express');
var app = express();

//receive json data
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// static files
app.use(express.static('docs'));

app.get('/', function (req, res) {
    // send index html file in docs folder
    res.sendFile(__dirname + '/docs/index.html');
    // res.send('Hello World!');
});

app.post('/translate', function (req, res) {
    console.log('translate');
    var data = req.body;
    console.log(data);
    res.send('Hola Mundo!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});