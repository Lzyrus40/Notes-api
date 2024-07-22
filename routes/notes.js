// routes/notes.js
const express = require('express');
const router = express.Router();
const { Note, notes } = require('../models/note');
const validateNote = require('../middleware/validateNote');

// Create a new note
router.post('/', validateNote, (req, res) => {
    const { id, title, content, tags } = req.body;

    const existingNote = notes.find((n) => n.id === id);
    if (existingNote) {
        return res.status(409).json({ error: 'Note with the same ID already exists' });
    }

    const newNote = new Note(id, title, content, tags);
    notes.push(newNote);
    res.send({ "status":201, "note":newNote });
});

// Retrieve all notes
router.get('/', (req, res) => {
    res.json(notes);
});

// Retrieve a single note by its ID
router.get('/:id', (req, res) => {
    const noteId = req.params.id;
    const note = notes.find((n) => n.id === noteId);
    if (!note) {
        return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
});

// Update a note by its ID
router.put('/:id', validateNote, (req, res) => {
    const noteId = req.params.id;
    const { title, content, tags } = req.body;

    const index = notes.findIndex((n) => n.id === noteId);
    if (index === -1) {
        return res.status(404).json({ error: 'Note not found' });
    }

    const updatedNote = new Note(noteId, title, content, tags);
    notes[index] = updatedNote;
    res.json(updatedNote);
});

// Delete a note by its ID
router.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    const index = notes.findIndex((n) => n.id === noteId);
    if (index === -1) {
        return res.status(404).json({ error: 'Note not found' });
    }
    notes.splice(index, 1);
    res.send({ "status": 1, "message": "Note deleted successfully" });
});

// Append tags to a note
router.put('/:id/tags', (req, res) => {
    const noteId = req.params.id;
    const { tags } = req.body;

    if (!Array.isArray(tags)) {
        return res.status(400).json({ error: 'Tags must be an array of strings' });
    }

    const index = notes.findIndex((n) => n.id === noteId);
    if (index === -1) {
        return res.status(404).json({ error: 'Note not found' });
    }

    notes[index].tags.push(...tags); // Append new tags
    res.json(notes[index]);
});

// Remove tags from a note
router.delete('/:id/tags', (req, res) => {
    const noteId = req.params.id;
    const { tags } = req.body;

    if (!Array.isArray(tags)) {
        return res.status(400).json({ error: 'Tags must be an array of strings' });
    }

    const index = notes.findIndex((n) => n.id === noteId);
    if (index === -1) {
        return res.status(404).json({ error: 'Note not found' });
    }

    // Remove specified tags
    notes[index].tags = notes[index].tags.filter((existingTag) => !tags.includes(existingTag));
    res.json(notes[index]);
});

// Query notes based on tags
router.get('/query', (req, res) => {
    const { includeTags, excludeTags } = req.query;

    // Validate input tags
    if (includeTags && !Array.isArray(includeTags)) {
        return res.status(400).json({ error: 'includeTags must be an array of strings' });
    }
    if (excludeTags && !Array.isArray(excludeTags)) {
        return res.status(400).json({ error: 'excludeTags must be an array of strings' });
    }

    // Filter notes based on includeTags (AND condition)
    const filteredNotes = notes.filter((note) => {
        if (includeTags) {
            return includeTags.every((tag) => note.tags.includes(tag));
        }
        return true; // If no includeTags specified, include all notes
    });

    // Exclude notes based on excludeTags (NOT condition)
    if (excludeTags) {
        excludeTags.forEach((tag) => {
            filteredNotes.forEach((note) => {
                const tagIndex = note.tags.indexOf(tag);
                if (tagIndex !== -1) {
                    note.tags.splice(tagIndex, 1);
                }
            });
        });
    }

    res.json(filteredNotes);
});

module.exports = router;
