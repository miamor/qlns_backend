const port = 3003;
var express = require('express');
var cors = require('cors');
var mongo = require('mongodb');

var app = express();
app.use(cors());
//require('loopback3-xtotalcount')(app);

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

// Configure DB
var Server = mongo.Server
  , Db = mongo.Db
  , BSON = mongo.BSONPure
  , server = new Server('localhost', 27017, {auto_reconnect: true})
  , db = new Db('qlns', server, {safe: true});

// Open DB to see if we need to populate with data
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'qlns' database");

        var Emp = require('./routes/employees')
          , employees = new Emp(db);
        app.get('/employees', employees.findAll);
        app.get('/employees/:id', employees.findById);
        app.post('/employees', employees.add);
        app.put('/employees/:id', employees.update);
        app.delete('/employees/:id', employees.delete);

        var Cms = require('./routes/customers')
          , customers = new Cms(db);
        app.get('/customers', customers.findAll);
        app.get('/customers/:id', customers.findById);
        app.post('/customers', customers.add);
        app.put('/customers/:id', customers.update);
        app.delete('/customers/:id', customers.delete);

        // Fire up the server
        app.listen(port);
        console.log('Listening on port '+port+'...');
    }
});
