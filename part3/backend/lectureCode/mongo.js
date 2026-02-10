const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password as an argument')
  process.exit(1)
}

const db_password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${db_password}` +
  '@cluster0.9mvmpch.mongodb.net/noteApp?' +
  'retryWrites=true&w=majority&appName=Cluster0'

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note)
  })
  mongoose.connection.close()
})

// const note = new Note({
//     content: "Mongoose makes things easy",
//     important: true,
// });

// note.save().then((_result) => {
//     console.log("Note saved!");
//     mongoose.connection.close();
// });
