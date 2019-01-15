const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const knexConfig = require("./knexfile");

const server = express();
const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());

// endpoints here
server.get("/api/zoos", (req, res) => {
  db("zoos")
    .then(zoos => res.status(200).json(zoos))
    .catch(err => res.status(500).json(err));
});

server.get("/api/zoos/:id", (req, res) => {
  const { id } = req.params;
  db("zoos")
    .where({ id })
    .then(zoo => {
      if (zoo.length > 0) {
        res.status(200).json(zoo);
      } else {
        res.status(404).json({ error: "A zoo with that ID was not found" });
      }
    })
    .catch(err => res.status(500).json(err));
});

server.post("/api/zoos", (req, res) => {
  const { name } = req.body;
  if (!name) res.status(400).send({ error: "Please include the name field" });
  db("zoos")
    .insert(req.body)
    .then(ids => {
      db("zoos")
        .where({ id: ids[0] })
        .then(zoo => res.status(201).json(zoo));
    })
    .catch(err => res.status(500).json(err));
});

server.put("/api/zoos/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db("zoos")
    .where({ id })
    .update(changes)
    .then(count => {
      if (count) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ error: "A zoo with that id was not found" });
      }
    })
    .catch(err => res.status(500).json(err));
});

server.delete("/api/zoos/:id", (req, res) => {
  const { id } = req.params;
  db("zoos")
    .where({ id })
    .del()
    .then(count => {
      if (count) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ error: "An entry with that id was not found" });
      }
    })
    .catch(err => res.status(500).json(err));
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
