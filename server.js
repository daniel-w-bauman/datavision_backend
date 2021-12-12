const express = require('express')
const app = express()
const fileupload = require("express-fileupload")
const { v4: uuidv4 } = require('uuid');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileupload())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('files'))

app.get('/', (req, res) => {
  res.end("Listening on http://localhost:8000")
})

app.post("/upload", (req, res) => {
  const newpath = __dirname + "/files/"
  if(!('files' in req)){
      console.log('files not in req');
      res.status(500).send({ message: "No files in request", code: 200 })
  } else if(!('file' in req.files)){
    console.log('file not in req');
    res.status(500).send({ message: "No file in request", code: 200 })
  } else {
    const file = req.files.file
    const filename = file.name.split('.')[0] + uuidv4() + '.csv';
    file.mv(`${newpath}${filename}`, (err) => {
      if (err) {
        res.status(500).send({ message: "File upload failed", code: 200 })
      }
      res.status(200).send({ message: "File Uploaded", filename: filename, code: 200 })
    })
  }
})

app.listen(8000)
console.log('Listening on http://localhost:8000')
