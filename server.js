import express from "express";
import path from "path";
import bodyParser from "body-parser";
import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

const MOVIES_COLLECTION = "movies";

const app = express();
app.use(express.static(`${__dirname}/app`));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
let db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log("App now running on port", port);
  });
});

// MOVIES API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log(`ERROR: ${reason}`);
  res.status(code || 500).json({"error": message});
}

/*  "/movies"
 *    GET: finds all movies
 *    POST: creates a new movie
 */

app.get("/movies", (req, res) => {
  db.collection(MOVIES_COLLECTION).find({}).toArray((err, docs) => {
    if (err) {
      handleError(res, err.message, "Failed to get movies.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/movies", (req, res) => {
  const newMovie = req.body;
  newMovie.createDate = new Date();

  if (!(req.body.title || req.body.rating)) {
    handleError(res, "Invalid user input", "Must provide a title or rating.", 400);
  }

  db.collection(MOVIES_COLLECTION).insertOne(newMovie, (err, doc) => {
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

app.get("/movies/:id", (req, res) => {
  db.collection(MOVIES_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to get movie");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/movies/:id", (req, res) => {
  const updateDoc = req.body;
  delete updateDoc._id;

  db.collection(MOVIES_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to update movie");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/movies/:id", (req, res) => {
  db.collection(MOVIES_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, (err, result) => {
    if (err) {
      handleError(res, err.message, "Failed to delete movie");
    } else {
      res.status(204).end();
    }
  });
});