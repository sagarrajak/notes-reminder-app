const mongoose = require('mongoose');

const reminderSchema = mongoose.Schema({
    assigntime: { type: Date, required: true },
    completetime: { type: Date, required: true },
    for: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'seen', 'completed'] 
    }
});

module.exports = mongoose.model('reminder', reminderSchema);