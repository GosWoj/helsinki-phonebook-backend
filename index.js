const express = require("express");
const morgan = require("morgan");
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());
app.use(morgan("tiny"));

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const newID = Math.floor(Math.random() * 99999);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Missing name or number",
    });
  }

  const sameName = persons.find((person) => person.name === body.name);

  if (sameName) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  }

  const person = {
    id: newID,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<div>
        <h2>Phonebook has info for ${persons.length} people</h2>
        <h3>${date}</h3>
    </div> `
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
