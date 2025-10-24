const express = require("express");
const morgan = require("morgan");

const app = express();

// Show static content.
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

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

const generateId = () => {
    let id = 0;
    do {
        id = Math.floor(Math.random() * 1e6) + 1;
    } while (persons.find((p) => p.id === id));

    return id.toString();
};

app.get("/api/persons", (_request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = persons.find((p) => p.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.get("/api/info", (_request, response) => {
    const date = new Date();
    response.send(
        `<div>Phonebook has info for ${persons.length} people.</div>` +
            `<div>${date.toDateString()}&nbsp;${date.toTimeString()}</div>`
    );
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = persons.find((p) => p.id === id);
    if (person) {
        persons = persons.filter((p) => p.id !== id);
        response.status(204).end();
    } else {
        response.status(404).end();
    }
});

const isValidInput = (name, number, response) => {
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
    } else if (persons.find((p) => p.name === name)) {
        response.status(404).json({
            error: "Name must be unique.",
        });
        return false;
    }
    return true;
};

app.post("/api/persons", (request, response) => {
    const name = request.body.name?.trim();
    const number = request.body.number?.trim();
    if (!isValidInput(name, number, response)) {
        return;
    }

    const person = {
        id: generateId(),
        name,
        number,
    };

    persons = persons.concat(person);
    response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
