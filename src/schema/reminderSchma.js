const mongoose = require('mongoose');

const reminderSchema = mongoose.Schema({
    assigntime: { type: Date, required: true },
    completime: { type: Date, require: true },
    title: { type: String, required: true },
    status: {
        type: string,
        enum: ['pending', 'seen', 'completed'] 
    }
});

module.exports = mongoose.model('reminder', reminderSchema);