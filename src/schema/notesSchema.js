const mongoose = require('mongoose');
const notesSchema = mongoose.Schema({
    title: { type: String, required: true },
    details: { type: String },
    time: { type: Date, required: true},
    attachment: { type: String },
    reminder: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reminder'
    }
});

module.exports = mongoose.model('notes', notesSchema);