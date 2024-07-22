// models/note.js
class Note {
    constructor(id, title, content, tags) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.tags = tags;
    }
}

const notes = [];

module.exports = { Note, notes };
