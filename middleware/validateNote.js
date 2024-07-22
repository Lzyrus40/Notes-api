// middleware/validateNote.js
const validateNote = (req, res, next) => {
    const { id, title, content, tags } = req.body;
    if (!id || !title || !content || !tags) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    next();
};

module.exports = validateNote;
