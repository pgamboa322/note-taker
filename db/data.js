const fs = require('fs');
const util = require('util');

const writeNote = util.promisify(fs.writeFile);
const readNote = util.promisify(fs.readFile);

class Note {

    // function to write new note, pulling current data from db
    write(note) {
        return writeNote('db/db.json', JSON.stringify(note));
    };

    // function to read the note created and processed through db
    read() {
        return readNote('db/db.json', 'utf8');
    };

    // function created to pull data from db on to the users page
    // we have to parse the data first
    fetchNotes() {
        return this.read().then(notes => {
            let parsedNotes;
            try {
                parsedNotes = [].concat(JSON.parse(notes));
            } catch (err) {
                parsedNotes = [];
            }
            return parsedNotes;
        });
    }

    // function to add in a new note into our notetaker 
    addNote(note) {
        const { title, text } = note;
        //conditional reequires both text and title to be saved. 
        if (!title || !text) {
            throw new Error('You must add title and text before saving');
        }
        const postNote = { title, text };

        return this.fetchNotes()
            .then(notes => [...notes, postNote])
            .then(updatedNotes => this.write(updatedNotes))
            .then(() => postNote);
    }

}

module.exports = new Note();