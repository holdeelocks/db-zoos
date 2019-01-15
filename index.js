const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const knexConfig = require("./knexfile");

const server = express();
const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());

// endpoints here
server.get("/", (req, res) => {
  res.status(200).send("We made it fam");
});

server.get("/api/zoos", (req, res) => {
  db("zoos")
    .then(zoos => res.status(200).json(zoos))
    .catch(err => res.status(500).json(err));
});

server.get("/api/zoos/:id", (req, res) => {});

server.post("/api/zoos", (req, res) => {
  const { name } = req.body;
  if (!name) res.status(400).send({ error: "Please include the name field" });
});

server.put();

server.delete();

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
