require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

// Activate CORS (Cross-Origin Resource Sharing).
app.use(cors());

app.use(express.static("dist"));

// Activate the json parser.
app.use(express.json());

// Morgan's token to receive content in a JSON format.
morgan.token("body-json", function (request, _response) {
    return JSON.stringify(request.body);
});

// Custom morgan configuration. Basically, copying the default output with a
// small change for the POST method.
const morganHandler = morgan(function (tokens, request, response) {
    let config = [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, "content-length"),
        "-",
        tokens["response-time"](request, response),
        "milliseconds",
        tokens["date"](request, response, "web"),
    ];
    if (request.method === "POST") {
        config = config.concat(tokens["body-json"](request, response));
    }
    return config.join(" ");
});

// Predefined format string as 'tiny'.
app.use(morganHandler);

app.get("/api/persons", (_request, response) => {
    Person.find({}).then((persons) => response.json(persons));
});

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id)
        .then((person) => {
            person
                ? response.json(person)
                : response.status(404).json({ error: "Person not found" });
        })
        .catch((error) => next(error));
});

app.get("/api/info", (_request, response) => {
    const date = new Date();
    Person.find({}).then((persons) =>
        response.send(
            `<div>Phonebook has info for ${persons.length} people.</div>` +
                `<div>${date.toDateString()}&nbsp;${date.toTimeString()}</div>`,
        ),
    );
});

app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then((person) =>
            person ? response.json(person) : response.status(204).end(),
        )
        .catch((error) => next(error));
});

const isValidNewInput = async (name, number, response) => {
    if (!name) {
        response.status(404).json({
            error: "Name missing.",
        });
        return false;
    } else if (!number) {
        response.status(404).json({
            error: "Number missing.",
        });
        return false;
    }
    return true;
};

const isValidUpdateInput = async (name, number, response) => {
    if (!name && !number) {
        response.status(404).json({
            error: "Name and number are missing.",
        });
        return false;
    }
    return true;
};

const updatePerson = (request, response, next) => {
    Person.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true,
    })
        .then((person) =>
            person
                ? person
                      .save()
                      .then((updatedPerson) => response.json(updatedPerson))
                      .catch((error) => next(error))
                : response.status(404).json({ error: "Person not found" }),
        )
        .catch((error) => next(error));
};

app.put("/api/persons/:id", async (request, response, next) => {
    const name = request.body.name?.trim();
    const number = request.body.number?.trim();
    const isValid = await isValidUpdateInput(name, number, response);

    if (isValid) {
        updatePerson(request, response, next);
    }
});

app.post("/api/persons", async (request, response, next) => {
    const name = request.body.name?.trim();
    const number = request.body.number?.trim();
    const isValid = await isValidNewInput(name, number, response);

    if (isValid) {
        const exists = await Person.exists({ name });
        if (exists) {
            request.params.id = exists._id;
            updatePerson(request, response);
        } else {
            new Person({ name, number })
                .save()
                .then((savedPerson) => response.json(savedPerson))
                .catch((error) => next(error));
        }
    }
});

const unknownEndpoint = (_request, response) => {
    return response.status(404).send({ error: "Unknown endpoint" });
};
app.use(unknownEndpoint);

// The error-handling middleware has to be the last loaded middleware, also all
// the routes should be registered before the error-handler.
const errorHandler = (error, _request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).json({ error: "Malformed id" });
    } else if (error.name == "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
