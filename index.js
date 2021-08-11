require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

morgan.token("person", function getPerson(req) {
  return JSON.stringify(req.person);
});

app.use(express.static("build"));
app.use(express.json());
app.use(morgan(":method :url :status :response-time :person"));
app.use(cors());

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
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
  Person.findByIdAndDelete(request.params.id)
    .then((person) => {
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error);
      response.status(404).end();
    });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Missing name or number",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
