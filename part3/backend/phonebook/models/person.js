const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
console.log("Connecting to MongoDB");
mongoose
    .connect(url, { family: 4 })
    .then((_) => console.log("Connected to MongoDB"))
    .catch((error) =>
        console.error(`Error connecting to MongoDB: ${error.message}`),
    );

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function (v) {
                return /^\d{2,3}-\d+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid phone number`,
        },
    },
});

personSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);
