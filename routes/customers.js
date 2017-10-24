var ObjectID = require("bson-objectid");

module.exports = function(db) {
    var module = {};

    module.findById = function(req, res) {
        var id = req.params.id;
        console.log('Retrieving user: ' + id);
        db.collection('customers', function(err, collection) {
            collection.findOne({'_id':ObjectID(id)}, function(err, item) {
                res.header({
                    'ETag': null,
                    'Access-Control-Expose-Headers': 'X-Total-Count',
                    'X-Total-Count': 1
                });
                item.id = item._id;
                console.log(item);
                res.send(item);
            })
        });
    };

    module.findAll = function(req, res) {
        db.collection('customers', function(err, collection) {
            collection.find().toArray(function(err, items) {
                res.header({
                    /*'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
                    */'Access-Control-Expose-Headers': 'X-Total-Count',
                    'X-Total-Count': items.length
                });
                for (i = 0; i < items.length; i++) items[i].id = items[i]._id;
                res.send(items);
            });
        });
    };

    module.add = function(req, res) {
        var customers = req.body;
        console.log('Adding user: ' + JSON.stringify(customers));
        db.collection('customers', function(err, collection) {
            collection.insert(customers, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    result.ops[0].id = result.ops[0]._id;
                    console.log('Success: ' + JSON.stringify(result));
                    console.log(result.ops);
                    res.send(result.ops[0]);
                }
            });
        });
    }

    module.update = function(req, res) {
        var id = req.params.id;
        var customers = req.body;
        delete customers['id'];
        delete customers['_id'];
        console.log('Updating customers: ' + id);
        console.log(JSON.stringify(customers));
        db.collection('customers', function(err, collection) {
            collection.update({'_id':ObjectID(id)}, customers, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error updating customers: ' + err);
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('' + result + ' document(s) updated');
                    customers.id = customers._id;
                    res.send(customers);
                }
            });
        });
    }

    module.delete = function(req, res) {
        var id = req.params.id;
        console.log('Deleting customers: ' + id);
        db.collection('customers', function(err, collection) {
            collection.remove({'_id':ObjectID(id)}, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred - ' + err});
                } else {
                    console.log('' + result + ' document(s) deleted');
                    res.send(req.body);
                }
            });
        });
    }

    return module;
}
