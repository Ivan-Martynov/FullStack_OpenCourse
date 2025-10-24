// import { createServer } from "http";
const express = require("express");
const cors = require("cors");

const app = express();

const requestLogger = (request, response, next) => {
    console.log("Method: ", request.method);
    console.log("Path: ", request.path);
    console.log("Body: ", request.body);
    console.log("---");
    next();
};

// Activate CORS (Cross-Origin Resource Sharing).
app.use(cors());

app.use(express.static("dist"));

// Activate the json parser.
app.use(express.json());
app.use(requestLogger);

let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true,
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false,
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true,
    },
];

const generateId = () => {
    const id = notes.length > 0 ? Math.max(...notes.map((n) => +n.id)) : 0;
    return (id + 1).toString();
};

app.get("/", (_request, response) => {
    response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (_request, response) => {
    response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
    const id = request.params.id;
    const note = notes.find((item) => item.id === id);
    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
});

// Adding a note.
app.post("/api/notes", (request, response) => {
    const body = request.body;
    if (!body.content) {
        return response.status(400).json({
            error: "content missing",
        });
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId(),
    };
    notes = notes.concat(note);
    response.json(note);
});

app.delete("/api/notes/:id", (request, response) => {
    const id = request.params.id;
    const note = notes.find((item) => item.id === id);

    response.status(204).end();
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "Unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
