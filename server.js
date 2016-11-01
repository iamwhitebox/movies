var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var MOVIES_COLLECTION = "movies";

var app = express();
app.use(express.static(__dirname + "/build"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect('mongodb://admin:admin@ds059908.mlab.com:59908/iamwhitebox-sandbox-v1', function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// MOVIES API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/movies"
 *    GET: finds all movies
 *    POST: creates a new movie
 */

app.get("/movies", function(req, res) {
  console.log('got');
  db.collection(MOVIES_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get movies.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/movies", function(req, res) {
  var newMovie = req.body;
  newMovie.createDate = new Date();

  if (!(req.body.firstName || req.body.lastName)) {
    handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
  }

  db.collection(MOVIES_COLLECTION).insertOne(newMovie, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new movie.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/movies/:id"
 *    GET: find movie by id
 *    PUT: update movie by id
 *    DELETE: deletes movie by id
 */

app.get("/movies/:id", function(req, res) {
  db.collection(MOVIES_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get movie");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/movies/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(MOVIES_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update movie");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/movies/:id", function(req, res) {
  db.collection(MOVIES_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete movie");
    } else {
      res.status(204).end();
    }
  });
});