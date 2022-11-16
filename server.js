//bringing in our modules and setting the listening port
const fs = require('fs');
const path = require('path');
const express = require('express');
const PORT = 8080;
//enabling express
const app = express();
//setting our note json file as a variable
const notes = require('./db/db.json');
//setting up our middleware to parse data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//setting up our get routes including a catch all route with *
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/api/notes', (req, res) => {
    res.json(notes.slice(1));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
// setting our post route
app.post('/api/notes', (req, res) => {
    const newNote = createNote(req.body, notes);
    res.json(newNote);
});
//function to create notes
function createNote(body, notesArr) {
    const newNote = body;
    if (!Array.isArray(notesArr))
        notesArr = [];
    
    if (notesArr.length === 0)
        notesArr.push(0);
        body.id = notesArr[0];
        notesArr[0]++;
        notesArr.push(newNote);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArr)
    );
    return newNote;
}
//functions to delete saved notes
function deleteNote(id, notesArr) {
    for (let i = 0; i < notesArr.length; i++) {
        let note = notesArr[i];
        if (note.id === id) {
            notesArr.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArr)
            );
        }
    }
}
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, notes);
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});