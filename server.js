//Install express server
const express = require('express');
const path = require('path');
let cors = require('cors');
let bodyParser = require("body-parser");


const app = express();

// Serve only the static files form the angularapp directory

app.use(bodyParser.urlencoded({extend: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname ));
app.all('*', function(req, res, next) {
    var origin = req.get('origin');
    res.header('Access-Control-Allow-Origin', origin);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.get('/*', function(req,res) {

    res.sendFile(path.join(__dirname+'/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);