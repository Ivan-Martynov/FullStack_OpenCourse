const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.error("Give password as an argument");
    process.exit(1);
} else if (process.argv.length === 4) {
    console.error("Give also a phone number");
    process.exit(1);
}

const db_password = process.argv[2];

const url =
    `mongodb+srv://fullstack:${db_password}` +
    `@cluster0.9mvmpch.mongodb.net/noteApp?` +
    `retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

const showAll = () => {
    Person.find({}).then((result) => {
        result.forEach((note) => {
            console.log(note);
        });
        mongoose.connection.close();
    });
};

const addPerson = (name, number) => {
    const person = new Person({
        name,
        number,
    });
    person.save().then((_result) => {
        console.log(`Added ${name} with number ${number} to phonebook`);
        mongoose.connection.close();
    });
};

if (process.argv.length === 3) {
    showAll();
} else if (process.argv.length > 4) {
    addPerson(process.argv[3], process.argv[4]);
}
