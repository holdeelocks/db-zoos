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

//
//
////// BEARS ENDPOINTS (STRETCH)
//
//

server.get("/api/bears", (req, res) => {
  db("bears")
    .then(bears => res.status(200).json(bears))
    .catch(err => res.status(500).json(err));
});

server.get("/api/bears/:id", (req, res) => {
  const { id } = req.params;
  db("bears")
    .where({ id })
    .then(bear => {
      if (bear.length > 0) {
        res.status(200).json(bear);
      } else {
        res.status(404).json({ error: "A bear with that ID does not exist" });
      }
    })
    .catch(err => res.status(500).json(err));
});

server.post("/api/bears", (req, res) => {
  const { name } = req.body;
  if (!name) res.status(400).json({ error: "Please include a name field" });

  db("bears")
    .insert(req.body)
    .then(ids => {
      db("bears")
        .where({ id: ids[0] })
        .then(bear => res.status(201).json(bear));
    })
    .catch(err => {
      if ((err.errno = 19)) {
        res.status(400).json({ error: "A bear with that name already exists" });
      } else {
        res.status(500).json(err);
      }
    });
});

server.put("/api/bears/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db("bears")
    .where({ id })
    .update(changes)
    .then(resp => {
      if (resp) {
        res.status(201).json(resp);
      } else {
        res.status(404).json({ error: "A bear with that id does not exist" });
      }
    })
    .catch(err => res.status(500).json(err));
});

server.delete("/api/bears/:id", (req, res) => {
  const { id } = req.params;

  db("bears")
    .where({ id })
    .del()
    .then(count => {
      if (count) {
        res.status(200).json({ recordsDeleted: count });
      } else {
        res.status(404).json({ error: "A bear with that ID does not exist" });
      }
    })
    .catch(err => res.status(500).json(err));
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
