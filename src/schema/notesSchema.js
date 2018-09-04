const mongoose = require('mongoose');
const notesSchema = mongoose.Schema({
    title: { type: string, required: true },
    time: { type: Date, required },
    attachment: { type: string },
    reminder: { 
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('notes', notesSchema);